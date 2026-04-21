import { useMemo } from "react";
import { useToggle } from "react-use";
import { NavbarThemeContext } from "./context";
import type { NavbarThemeProviderProps } from "./types";

const NavbarThemeProvider = ({ children }: NavbarThemeProviderProps) => {
  const [isSolid, toggleSolid] = useToggle(false);

  const value = useMemo(
    () => ({ isSolid, setIsSolid: toggleSolid }),
    [isSolid, toggleSolid],
  );

  return <NavbarThemeContext value={value}>{children}</NavbarThemeContext>;
};

export default NavbarThemeProvider;
