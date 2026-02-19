import { use, useEffect } from "react";
import { NavbarThemeContext } from "./context";

export const useNavbarTheme = (initialSolid: boolean = true) => {
  const context = use(NavbarThemeContext);

  if (!context) {
    throw new Error("useNavbarTheme must be used within a NavbarThemeProvider");
  }

  const { isSolid, setIsSolid } = context;

  useEffect(() => {
    setIsSolid(initialSolid);
  }, [initialSolid, setIsSolid]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0) {
        setIsSolid(initialSolid);
      } else {
        setIsSolid(true);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      setIsSolid(initialSolid);
    };
  }, [initialSolid, setIsSolid]);

  return { isSolid, setIsSolid };
};
