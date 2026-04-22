import { createContext } from "react";
import type { TickContextValue } from "./types";

export const TickContext = createContext<TickContextValue>(Date.now());
