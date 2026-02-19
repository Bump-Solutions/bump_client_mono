import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

import { ThemeContext } from "./context";
import type { Theme, ThemeProviderProps } from "./types";

const ThemeProvider = ({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
}: ThemeProviderProps) => {
  const [theme, setThemeState] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme,
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    const resolved =
      theme === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : theme;

    root.classList.add(resolved);
  }, [theme]);

  const setTheme: Dispatch<SetStateAction<Theme>> = (next) => {
    setThemeState((prev) => {
      const resolvedNext = typeof next === "function" ? next(prev) : next;
      localStorage.setItem(storageKey, resolvedNext);
      return resolvedNext;
    });
  };

  const value = {
    theme,
    setTheme,
  };

  return <ThemeContext value={value}>{children}</ThemeContext>;
};

export default ThemeProvider;
