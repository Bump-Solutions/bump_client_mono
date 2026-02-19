import { createContext } from "react";
import type { NavbarThemeContextValue } from "./types";

export const NavbarThemeContext = createContext<
  NavbarThemeContextValue | undefined
>(undefined);
