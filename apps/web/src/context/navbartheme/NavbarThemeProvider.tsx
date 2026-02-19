import { useToggle } from "react-use";
import { NavbarThemeContext } from "./context";
import type { NavbarThemeProviderProps } from "./types";

const NavbarThemeProvider = ({ children }: NavbarThemeProviderProps) => {
  const [isSolid, toggleSolid] = useToggle(false);

  return (
    <NavbarThemeContext value={{ isSolid, setIsSolid: toggleSolid }}>
      {children}
    </NavbarThemeContext>
  );
};

export default NavbarThemeProvider;
