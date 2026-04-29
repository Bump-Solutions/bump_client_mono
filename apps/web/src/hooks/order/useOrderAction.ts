import { useOrder } from "@/context/order/useOrder";
import { OrderAction, type OrderModel } from "@bump/core/models";
import { useCallback } from "react";

// Stub: replace with real mutations (TanStack mutate calls) when the API is wired.
// For now, simulates a 1.5s round-trip and echoes back the order with the next state.
const mockApiCall = (
  order: OrderModel,
  action: OrderAction,
): Promise<OrderModel> =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      // Force a failure for any action when ?fail=1 is in the URL — handy for testing the error branch.
      if (new URLSearchParams(window.location.search).get("fail") === "1") {
        reject(new Error(`Mock failure for action ${action}`));
        return;
      }

      // Echo back the same order; in real life the server returns the new state.
      // For local testing, you can hand-edit the resolved order here to simulate state transitions.
      console.log("[mockApi] action completed", { action, order });
      resolve(order);
    }, 1500);
  });

export const useOrderActions = () => {
  const { order, send } = useOrder();

  const dispatch = useCallback(
    async (action: OrderAction) => {
      try {
        const updatedOrder = await mockApiCall(order, action);
        send({ type: "ACTION_SUCCESS", order: updatedOrder });
      } catch (e) {
        send({
          type: "ACTION_FAILURE",
          error: {
            kind: "network",
            message: e instanceof Error ? e.message : "Unknown error",
            retryable: true,
          },
        });
      }
    },
    [order, send],
  );

  return { dispatch };
};
