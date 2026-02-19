import type { Dispatch, ReactNode, SetStateAction } from "react";

export type NavbarThemeProviderProps = {
  children: ReactNode;
};

export type NavbarThemeContextValue = {
  isSolid: boolean;
  setIsSolid: Dispatch<SetStateAction<boolean>>;
};
