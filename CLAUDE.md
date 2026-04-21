# CLAUDE.md

Guidance for Claude Code (claude.ai/code) in this repo.

## Commands

Package manager: `pnpm@10.32.1`. Orchestrator: Turbo. Run from repo root.

- `pnpm dev:web` — start web app (Vite port 3000, proxies `/api` → `https://api.bumpmarket.hu`).
- `pnpm dev:mobile` — start Expo dev server for RN app.
- `pnpm build` — build all packages + apps.
- `pnpm typecheck` — `turbo typecheck` across workspace.
- `pnpm lint` — `turbo lint` across workspace.
- `pnpm theme` — regen CSS tokens (runs `packages/theme/scripts/generate-css.ts`, writes `apps/web/src/styles/css/_tokens.css`). Run after editing `packages/theme/src/{colors,palette,tokens}.ts`.

Per-app scripts (run inside app):
- `apps/web`: `pnpm dev | build | lint | preview`. Build = `tsc -b && vite build`.
- `apps/mobile`: `pnpm start | android | ios | web` (Expo).

No test runner wired. Don't claim tests exist.

## Architecture

pnpm workspace + Turbo monorepo. Two apps share seven internal packages.

### Apps

- `apps/web` — React 19 + Vite 7 + React Router 7 + TanStack Query 5. Entry `src/index.tsx` → `src/App.tsx`. Routes in `src/routes/Routing.tsx` split into `publicRoutes`, `privateRoutes`, `errorRoutes`, `modalRoutes`. Modal routes use React Router `location.state.background` pattern — modals render over background route.
- `apps/mobile` — Expo SDK 55 + React Native 0.83 + React Navigation 7. Entry `index.ts` → `src/App.tsx` → `src/navigation/RootNavigator.tsx`. Token storage: `expo-secure-store`.

Both apps host own `src/context/` providers (auth, notification, etc.) + own `src/http/Axios.ts` instances (`axiosPublic`, `axiosPrivate`). Web `axiosPrivate` sets `withCredentials: true`; mobile handles tokens via secure store + custom refresh in `useHttpClient.ts`.

### Shared packages (`packages/*`, workspace protocol `@bump/<name>`)

- `@bump/core` — domain layer. Subpath exports: `./api`, `./queries`, `./http`, `./models`, `./dtos`, `./mappers`, `./schemas`, `./services`, `./presentation`, `./machines`. XState machines in `src/machines/` (e.g. `orderMachine.ts`). Zod schemas in `src/schemas/`. Query keys centralized in `src/queries/queryKeys.ts`. Import narrowest subpath (e.g. `@bump/core/queries`), not root.
- `@bump/theme` — design tokens (`colors.ts`, `palette.ts`, `tokens.ts`). Build step generates CSS vars for web (see `pnpm theme`). Mobile consumes TS exports directly.
- `@bump/assets` — platform-split exports via `package.json` conditions: `react-native` → `src/index.native.ts`, default → `src/index.web.ts`. Excluded from Vite `optimizeDeps`. Add both variants when adding assets.
- `@bump/forms` — TanStack Form + Zod adapters, cross-platform.
- `@bump/hooks` — cross-platform React hooks (peer dep React 19).
- `@bump/types` — shared TS types.
- `@bump/utils` — shared utils incl. `ENUM.AUTH.ROLES` used by web `RequireAuth` wrapper.

### Web module layout

`apps/web/src/modules/` — one folder per domain (auth, cart, chat, product, profile, order, sell, settings, search, follow, report, notification, home, navigation, stripe, error). Route components lazy-loaded via `React.lazy` + `Suspense` fallback. Auth gating: `PersistLogin` wraps, `RequireAuth allowedRoles={ENUM.AUTH.ROLES.X}` enforces role tiers (`All`, `Authenticated`, `Validated`).

Other web dirs: `components/` (generic UI — Button, Modal, DataTable, etc.), `wizards/`, `datatable/`, `forms/`, `schemas/`, `context/` (providers), `styles/css/` (global CSS imported in `index.tsx`).

### React version pinning

`pnpm.overrides` in root `package.json` pins `react` + `react-dom` to `19.2.0`. No unilateral bump — apps + all packages must agree.

### Vite specifics (web)

- `resolve.extensions` includes `.web.ts` before `.ts` — platform-specific web files win.
- Manual chunks split `react`, `react-dom`, `react-router-dom` into `react` chunk.
- `@bump/assets` excluded from `optimizeDeps` to preserve platform export conditions.

## Conventions

- Cross-package imports via `@bump/<name>` subpaths, never relative paths across packages.
- New queries: add key to `@bump/core/queries/queryKeys.ts`, fetcher in `@bump/core/services`.
- New API endpoints: add to `@bump/core/api/paths.ts` + `types.ts`.
- New domain state machine: `@bump/core/machines/` using XState 5.
- Auth-gated routes sit under `PersistLogin` + `RequireAuth` with explicit `allowedRoles`.
- Modal routes (overlay on background) register in `modalRoutes()` in `Routing.tsx`, navigate with `state: { background: location }`.
