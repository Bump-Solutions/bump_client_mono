import { createContext } from "react";
import type { SellContextValue } from "./types";

export const SellContext = createContext<SellContextValue | undefined>(
  undefined,
);
