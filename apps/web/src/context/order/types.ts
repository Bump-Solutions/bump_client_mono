import type { OrderModel } from "@bump/core/models";
import type { ReactNode } from "react";

export type OrderProviderProps = {
  children: ReactNode;
};

export type OrderContextValue = {
  order: OrderModel | undefined;
  setOrder: (data: Partial<OrderModel>) => void;
  isLoading: boolean;
};
