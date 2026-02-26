import { createContext } from "react";
import type { CartContextValue, PackageContextValue } from "./types";

export const CartContext = createContext<CartContextValue | undefined>(
  undefined,
);

export const PackageContext = createContext<PackageContextValue | undefined>(
  undefined,
);
