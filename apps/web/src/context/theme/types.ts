import type { Dispatch, ReactNode, SetStateAction } from "react";

export type Theme = "light" | "dark" | "system";

export type ThemeProviderProps = {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

export type ThemeContextValue = {
  theme: Theme;
  setTheme: Dispatch<SetStateAction<Theme>>;
};
