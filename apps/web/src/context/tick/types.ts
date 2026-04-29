import type { ReactNode } from "react";

export type TickProviderProps = {
  children: ReactNode;
  intervalMs?: number;
};

export type TickContextValue = number;
