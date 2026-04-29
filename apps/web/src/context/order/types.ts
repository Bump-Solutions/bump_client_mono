import type {
  OrderError,
  orderMachine,
  OrderMachineEvent,
  OrderMachineState,
  OrderTurn,
} from "@bump/core/machines";
import type { OrderAction, OrderModel, OrderUserRole } from "@bump/core/models";
import type { ReactNode } from "react";
import type { ActorRefFrom } from "xstate";

export type OrderProviderProps = {
  children: ReactNode;
};

export type OrderContextValue = {
  order: OrderModel;
  setOrder: (data: Partial<OrderModel>) => void;
  pretty: string;

  role: OrderUserRole;
  turn: OrderTurn;
  isMyTurn: boolean;

  machineState: OrderMachineState;
  pendingAction: OrderAction | null;
  error: OrderError | null;

  can: (event: OrderMachineEvent) => boolean;

  send: ActorRefFrom<typeof orderMachine>["send"];
};
