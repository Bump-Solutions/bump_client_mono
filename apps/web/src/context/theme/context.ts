import { createContext } from "react";
import type { ThemeContextValue } from "./types";

const initialState: ThemeContextValue = {
  theme: "system",
  setTheme: () => null,
};

export const ThemeContext = createContext<ThemeContextValue>(initialState);
