# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager: `pnpm@10.32.1`. Orchestrator: Turbo. Run from repo root.

- `pnpm dev:web` — start web app (Vite on port 3000, proxies `/api` → `https://api.bumpmarket.hu`).
- `pnpm dev:mobile` — start Expo dev server for React Native app.
- `pnpm build` — build all packages + apps.
- `pnpm typecheck` — `turbo typecheck` across workspace.
- `pnpm lint` — `turbo lint` across workspace.
- `pnpm theme` — regenerate CSS tokens (runs `packages/theme/scripts/generate-css.ts`, writes `apps/web/src/styles/css/_tokens.css`). Run after editing `packages/theme/src/{colors,palette,tokens}.ts`.

Per-app scripts (run inside the app):
- `apps/web`: `pnpm dev | build | lint | preview`. Build = `tsc -b && vite build`.
- `apps/mobile`: `pnpm start | android | ios | web` (Expo).

No test runner wired up — do not claim tests exist.

## Architecture

pnpm workspace + Turbo monorepo. Two apps share seven internal packages.

### Apps

- `apps/web` — React 19 + Vite 7 + React Router 7 + TanStack Query 5. Entry `src/index.tsx` → `src/App.tsx`. Routes defined in `src/routes/Routing.tsx` split into `publicRoutes`, `privateRoutes`, `errorRoutes`, `modalRoutes`. Modal routes use React Router `location.state.background` pattern — modals render on top of the background route.
- `apps/mobile` — Expo SDK 55 + React Native 0.83 + React Navigation 7. Entry `index.ts` → `src/App.tsx` → `src/navigation/RootNavigator.tsx`. Uses `expo-secure-store` for token storage.

Both apps host their own `src/context/` providers (auth, notification, etc.) and their own `src/http/Axios.ts` instances (`axiosPublic`, `axiosPrivate`). Web's `axiosPrivate` sets `withCredentials: true`; mobile handles tokens via secure store + custom refresh in `useHttpClient.ts`.

### Shared packages (`packages/*`, published as `@bump/<name>` via workspace protocol)

- `@bump/core` — domain layer. Subpath exports: `./api`, `./queries`, `./http`, `./models`, `./dtos`, `./mappers`, `./schemas`, `./services`, `./presentation`, `./machines`. XState machines live in `src/machines/` (e.g. `orderMachine.ts`). Zod schemas in `src/schemas/`. Query keys centralized in `src/queries/queryKeys.ts`. Import from the narrowest subpath (e.g. `@bump/core/queries`) not the root.
- `@bump/theme` — design tokens (`colors.ts`, `palette.ts`, `tokens.ts`). Build step generates CSS variables for web (see `pnpm theme`). Mobile consumes TS exports directly.
- `@bump/assets` — platform-split exports via `package.json` conditions: `react-native` → `src/index.native.ts`, default → `src/index.web.ts`. Excluded from Vite `optimizeDeps`. When adding assets, add both variants.
- `@bump/forms` — TanStack Form + Zod adapters shared across platforms.
- `@bump/hooks` — cross-platform React hooks (peer depends on React 19).
- `@bump/types` — shared TypeScript types.
- `@bump/utils` — shared utilities including `ENUM.AUTH.ROLES` used by web's `RequireAuth` wrapper.

### Web module layout

`apps/web/src/modules/` — one folder per domain (auth, cart, chat, product, profile, order, sell, settings, search, follow, report, notification, home, navigation, stripe, error). Route components lazy-loaded via `React.lazy` + `Suspense` fallback. Auth gating: `PersistLogin` wraps, `RequireAuth allowedRoles={ENUM.AUTH.ROLES.X}` enforces role tiers (`All`, `Authenticated`, `Validated`).

Other web dirs: `components/` (generic UI — Button, Modal, DataTable, etc.), `wizards/`, `datatable/`, `forms/`, `schemas/`, `context/` (providers), `styles/css/` (global CSS imported in `index.tsx`).

### React version pinning

`pnpm.overrides` in root `package.json` pins `react` and `react-dom` to `19.2.0`. Do not bump unilaterally — both apps and all packages must agree.

### Vite specifics (web)

- `resolve.extensions` includes `.web.ts` before `.ts` — platform-specific web files win.
- Manual chunks split `react`, `react-dom`, `react-router-dom` into a `react` chunk.
- `@bump/assets` excluded from `optimizeDeps` to preserve platform export conditions.

## Conventions

- Import cross-package code via `@bump/<name>` subpaths, never relative paths across packages.
- New queries: add key to `@bump/core/queries/queryKeys.ts`, place fetcher in `@bump/core/services`.
- New API endpoints: add to `@bump/core/api/paths.ts` + `types.ts`.
- New domain state machine: `@bump/core/machines/` using XState 5.
- Auth-gated routes must sit under `PersistLogin` + `RequireAuth` with explicit `allowedRoles`.
- Modal routes (overlay over background) must be registered in `modalRoutes()` in `Routing.tsx` and navigated with `state: { background: location }`.
