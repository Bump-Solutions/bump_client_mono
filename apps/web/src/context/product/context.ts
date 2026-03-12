import { createContext } from "react";
import type { ProductContextValue } from "./types";

export const ProductContext = createContext<ProductContextValue | undefined>(
  undefined,
);
