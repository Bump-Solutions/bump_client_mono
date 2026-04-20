import { assign, createMachine } from "xstate";
import type { OrderAction, OrderModel } from "../models/orderModel";

export type OrderMachineContext = {
  order: OrderModel | null;
  isLoading: boolean;
  isPolling: boolean;
  currentAction: OrderAction | null;
  error: string | null;
};

export type OrderMachineEvent =
  | { type: "ORDER_LOADING" }
  | { type: "ORDER_LOADED"; order: OrderModel }
  | { type: "ORDER_LOAD_FAILED"; error: string }
  | { type: "REFRESH" }
  | { type: "ACTION_REQUESTED"; action: OrderAction }
  | { type: "ACTION_SUCCEEDED"; order: OrderModel }
  | { type: "ACTION_FAILED"; error: string }
  | { type: "START_POLLING" }
  | { type: "ORDER_UPDATED"; order: OrderModel }
  | { type: "STOP_POLLING" }
  | { type: "POLLING_FAILED"; error: string }
  | { type: "CLEAR_ERROR" };

export const orderMachine = createMachine({
  id: "order",

  types: {} as {
    context: OrderMachineContext;
    events: OrderMachineEvent;
  },
  context: {
    order: null,
    isLoading: true,
    isPolling: false,
    currentAction: null,
    error: null,
  },

  initial: "loading",
  states: {
    loading: {
      on: {
        ORDER_LOADED: {
          target: "ready",
          actions: assign(({ event }) => ({
            order: event.order,
            isLoading: false,
            error: null,
          })),
        },

        ORDER_LOAD_FAILED: {
          target: "error",
          actions: assign(({ event }) => ({
            error: event.error,
            isLoading: false,
          })),
        },
      },
    },

    ready: {
      on: {
        REFRESH: {
          target: "loading",
          actions: assign(() => ({
            isLoading: true,
            error: null,
          })),
        },

        ACTION_REQUESTED: {
          target: "executingAction",
          actions: assign(({ event }) => ({
            currentAction: event.action,
            error: null,
          })),
        },

        START_POLLING: {
          target: "polling",
          actions: assign(() => ({
            isPolling: true,
          })),
        },

        CLEAR_ERROR: {
          actions: assign(() => ({
            error: null,
          })),
        },
      },
    },

    executingAction: {
      on: {
        ACTION_SUCCEEDED: {
          target: "ready",
          actions: assign(({ event }) => ({
            order: event.order,
            currentAction: null,
            error: null,
          })),
        },

        ACTION_FAILED: {
          target: "error",
          actions: assign(({ event, context }) => ({
            error: event.error,
            currentAction: context.currentAction,
          })),
        },
      },
    },

    polling: {
      on: {
        ORDER_UPDATED: {
          actions: assign(({ event }) => ({
            order: event.order,
            error: null,
          })),
        },

        STOP_POLLING: {
          target: "ready",
          actions: assign(() => ({
            isPolling: false,
          })),
        },

        POLLING_FAILED: {
          target: "error",
          actions: assign(({ event }) => ({
            error: event.error,
            isPolling: false,
          })),
        },
      },
    },

    error: {
      on: {
        CLEAR_ERROR: {
          target: "ready",
          actions: assign(() => ({
            error: null,
            currentAction: null,
            isPolling: false,
          })),
        },

        REFRESH: {
          target: "loading",
          actions: assign(() => ({
            isLoading: true,
            error: null,
            currentAction: null,
            isPolling: false,
          })),
        },
      },
    },
  },
});
