import { createContext } from "react";
import type { OrderContextValue } from "./types";

export const OrderContext = createContext<OrderContextValue | undefined>(
  undefined,
);
