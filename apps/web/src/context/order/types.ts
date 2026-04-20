import type { orderMachine } from "@bump/core/machines";
import type { OrderAction, OrderModel } from "@bump/core/models";
import type { ReactNode } from "react";
import type { ActorRefFrom, SnapshotFrom } from "xstate";

export type OrderProviderProps = {
  children: ReactNode;
};

export type OrderMachineSnapshot = SnapshotFrom<typeof orderMachine>;

export type OrderContextValue = {
  order: OrderModel;
  setOrder: (data: Partial<OrderModel>) => void;
  pretty: string;
  isLoading: boolean;

  machineState: OrderMachineSnapshot["value"];
  isPolling: boolean;
  currentAction: OrderAction | null;
  error: string | null;

  send: ActorRefFrom<typeof orderMachine>["send"];
};
