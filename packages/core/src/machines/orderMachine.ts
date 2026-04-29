import { assign, setup, type StateFrom } from "xstate";
import {
  OrderAction,
  OrderState,
  OrderUserRole,
  type OrderModel,
} from "../models/orderModel";

export const ORDER_TIMING = {
  /** Poll cadence while waiting on a system-driven transition (ms) */
  pollInterval: 5_000,
  /** Maximum poll attempts before timeout — 5s × 60 = 5 minute ceiling */
  maxPollAttempts: 60,
  /** Timeout for a user-initiated action before surfacing an error (ms) */
  actionTimeout: 30_000,
} as const;

// ---------------------------------------------------------------------------
// Turn metadata — every OrderState knows whose turn it is
// ---------------------------------------------------------------------------

export type OrderTurn = "buyer" | "seller" | "system" | "both" | null;

export const ORDER_TURN: Record<OrderState, OrderTurn> = {
  [OrderState.SELLER_CONFIRMATION]: "seller",
  [OrderState.WAITING_FOR_INITIATE_CHECKOUT]: "buyer",
  [OrderState.WAITING_FOR_EXTERNAL_TASKS]: "system",
  [OrderState.CHECKOUT_SUCCESSFUL_NOT_PAID]: "buyer",
  [OrderState.PAID_WAITING_FOR_SHIPMENT]: "seller",
  [OrderState.SHIPPED_WAITING_FOR_ARRIVAL]: "system",
  [OrderState.ARRIVED_WAITING_FOR_PICKUP]: "buyer",
  [OrderState.RECEIVED_WAITING_FOR_RESPONSE]: "buyer",
  [OrderState.COMPLETED]: null,
  [OrderState.CANCELLED]: null,
  [OrderState.EXPIRED]: null,
  [OrderState.FAILED]: null,
};

// ---------------------------------------------------------------------------
// Error taxonomy — timeouts split by origin so the UI can respond correctly
// ---------------------------------------------------------------------------

export type OrderError =
  | { kind: "network"; message: string; retryable: true }
  | { kind: "action_timeout"; message: string; action: OrderAction }
  | { kind: "poll_timeout"; message: string; state: OrderState }
  | { kind: "validation"; message: string }
  | { kind: "unknown"; message: string };

// ---------------------------------------------------------------------------
// Context & events
// ---------------------------------------------------------------------------

export type OrderMachineContext = {
  order: OrderModel | null;
  role: OrderUserRole | null;
  turn: OrderTurn;
  pendingAction: OrderAction | null;
  error: OrderError | null;
  pollAttempts: number;
};

export type OrderMachineEvent =
  | { type: "LOAD_SUCCESS"; order: OrderModel }
  | { type: "LOAD_FAILURE"; error: OrderError }
  | { type: "CONFIRM_ORDER" }
  | { type: "INITIATE_CHECKOUT" }
  | { type: "GET_PAYMENT_STATUS" }
  | { type: "GET_SHIPMENT_DETAILS" }
  | { type: "SUBMIT_RATING" } // role-resolved inside the machine
  | { type: "CANCEL_ORDER" }
  | { type: "ACTION_SUCCESS"; order: OrderModel }
  | { type: "ACTION_FAILURE"; error: OrderError }
  | { type: "POLL_RESULT"; order: OrderModel }
  | { type: "POLL_FAILURE"; error: OrderError }
  | { type: "RETRY" }
  | { type: "DISMISS_ERROR" };

// ---------------------------------------------------------------------------
// Direct event → action mapping (rating is role-resolved, see setPendingRating)
// ---------------------------------------------------------------------------

type DirectActionEventType =
  | "CONFIRM_ORDER"
  | "INITIATE_CHECKOUT"
  | "GET_PAYMENT_STATUS"
  | "GET_SHIPMENT_DETAILS"
  | "CANCEL_ORDER";

export const EVENT_TO_ACTION: Record<DirectActionEventType, OrderAction> = {
  CONFIRM_ORDER: OrderAction.CONFIRM_ORDER,
  INITIATE_CHECKOUT: OrderAction.INITIATE_CHECKOUT,
  GET_PAYMENT_STATUS: OrderAction.GET_ORDER_PAYMENT_STATUS,
  GET_SHIPMENT_DETAILS: OrderAction.GET_SHIPMENT_DETAILS,
  CANCEL_ORDER: OrderAction.CANCEL_ORDER,
};

const TERMINAL_STATES: OrderState[] = [
  OrderState.COMPLETED,
  OrderState.CANCELLED,
  OrderState.EXPIRED,
  OrderState.FAILED,
];

// ---------------------------------------------------------------------------
// Machine
// ---------------------------------------------------------------------------

export const orderMachine = setup({
  types: {} as {
    context: OrderMachineContext;
    events: OrderMachineEvent;
  },

  guards: {
    isTerminal: ({ context }) =>
      !!context.order && TERMINAL_STATES.includes(context.order.state),
    isSystemTurn: ({ context }) => context.turn === "system",
    isMyTurn: ({ context }) => {
      if (!context.role || !context.turn) return false;
      if (context.turn === "both") return true;
      return context.turn === context.role;
    },
    canPollMore: ({ context }) =>
      context.pollAttempts < ORDER_TIMING.maxPollAttempts,
    pollStateChanged: ({ event, context }) => {
      if (event.type !== "POLL_RESULT") return false;
      return event.order.state !== context.order?.state;
    },
  },

  actions: {
    syncFromOrder: assign(({ event }) => {
      if (
        event.type !== "LOAD_SUCCESS" &&
        event.type !== "ACTION_SUCCESS" &&
        event.type !== "POLL_RESULT"
      ) {
        return {};
      }
      const order = event.order;
      return {
        order,
        role: order.isSeller ? OrderUserRole.SELLER : OrderUserRole.BUYER,
        turn: ORDER_TURN[order.state],
        error: null,
      };
    }),

    setError: assign(({ event }) => {
      if (
        event.type !== "LOAD_FAILURE" &&
        event.type !== "ACTION_FAILURE" &&
        event.type !== "POLL_FAILURE"
      ) {
        return {};
      }
      return { error: event.error };
    }),

    clearPending: assign({ pendingAction: null }),

    // Collapsed from 5 setPending* actions — derives from the event type.
    setPending: assign(({ event }) => ({
      pendingAction:
        EVENT_TO_ACTION[event.type as DirectActionEventType] ?? null,
    })),

    // Rating is the one event whose target action depends on role, not type.
    setPendingRating: assign(({ context }) => ({
      pendingAction:
        context.role === OrderUserRole.SELLER
          ? OrderAction.SUBMIT_BUYER_RATING
          : OrderAction.SUBMIT_SELLER_RATING,
    })),

    resetPolling: assign({ pollAttempts: 0 }),

    incrementPoll: assign(({ event, context }) => {
      if (event.type !== "POLL_RESULT") return {};
      return {
        order: event.order,
        pollAttempts: context.pollAttempts + 1,
      };
    }),

    pollTimeout: assign(({ context }) => ({
      error: {
        kind: "poll_timeout",
        message: "Polling timed out",
        state: context.order!.state,
      } as OrderError,
    })),

    actionTimeout: assign(({ context }) => ({
      error: {
        kind: "action_timeout",
        message: "Action timed out",
        action: context.pendingAction!,
      } as OrderError,
    })),

    // One clear action — resets everything recovery needs reset.
    clearError: assign({
      error: null,
      pendingAction: null,
      pollAttempts: 0,
    }),
  },
}).createMachine({
  id: "order",

  context: {
    order: null,
    role: null,
    turn: null,
    pendingAction: null,
    error: null,
    pollAttempts: 0,
  },

  initial: "loading",

  states: {
    loading: {
      on: {
        LOAD_SUCCESS: { target: "routing", actions: "syncFromOrder" },
        LOAD_FAILURE: { target: "error", actions: "setError" },
      },
    },

    routing: {
      always: [
        { guard: "isTerminal", target: "terminal" },
        { guard: "isSystemTurn", target: "awaitingSystem" },
        { guard: "isMyTurn", target: "myTurn" },
        { target: "theirTurn" },
      ],
    },

    myTurn: {
      on: {
        CONFIRM_ORDER: { target: "executingAction", actions: "setPending" },
        INITIATE_CHECKOUT: { target: "executingAction", actions: "setPending" },
        GET_PAYMENT_STATUS: {
          target: "executingAction",
          actions: "setPending",
        },
        GET_SHIPMENT_DETAILS: {
          target: "executingAction",
          actions: "setPending",
        },
        CANCEL_ORDER: { target: "executingAction", actions: "setPending" },
        SUBMIT_RATING: {
          target: "executingAction",
          actions: "setPendingRating",
        },
        // NEW: accept server-driven reloads while idling here
        LOAD_SUCCESS: { target: "routing", actions: "syncFromOrder" },
      },
    },

    theirTurn: {
      on: {
        CANCEL_ORDER: { target: "executingAction", actions: "setPending" },
        LOAD_SUCCESS: { target: "routing", actions: "syncFromOrder" },
      },
    },

    awaitingSystem: {
      entry: "resetPolling",
      on: {
        POLL_RESULT: [
          {
            guard: "pollStateChanged",
            target: "routing",
            actions: "syncFromOrder",
          },
          { guard: "canPollMore", actions: "incrementPoll" },
          { target: "error", actions: "pollTimeout" },
        ],
        POLL_FAILURE: { target: "error", actions: "setError" },
        LOAD_SUCCESS: { target: "routing", actions: "syncFromOrder" },
      },
    },

    executingAction: {
      after: {
        [ORDER_TIMING.actionTimeout]: {
          target: "error",
          actions: "actionTimeout",
        },
      },
      on: {
        ACTION_SUCCESS: {
          target: "routing",
          actions: ["syncFromOrder", "clearPending"],
        },
        ACTION_FAILURE: { target: "error", actions: "setError" },
      },
    },

    terminal: {
      on: {
        SUBMIT_RATING: {
          target: "executingAction",
          actions: "setPendingRating",
        },
        // NEW: server updates still reconcile (e.g. refund cancels a completed order)
        LOAD_SUCCESS: { target: "routing", actions: "syncFromOrder" },
      },
    },

    error: {
      on: {
        RETRY: { target: "loading", actions: "clearError" },
        DISMISS_ERROR: { target: "routing", actions: "clearError" },
      },
    },
  },
});

// Derived so it cannot drift from the actual machine definition
export type OrderMachineState = StateFrom<typeof orderMachine>["value"];
