import { orderMachine } from "@bump/core/machines";
import { shouldPollOrderState, type OrderModel } from "@bump/core/models";
import { queryKeys } from "@bump/core/queries";
import { displayUuid } from "@bump/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useMachine } from "@xstate/react";
import { useCallback, useEffect, useMemo, type ReactNode } from "react";
import { Navigate, useParams } from "react-router";
import Spinner from "../../components/Spinner";
import { useGetOrder } from "../../hooks/order/useGetOrder";
import { ROUTES } from "../../routes/routes";
import { OrderContext } from "./context";
import type { OrderContextValue, OrderProviderProps } from "./types";

const OrderProvider = ({ children }: OrderProviderProps) => {
  const { uuid } = useParams();

  if (!uuid)
    return (
      <Navigate
        to={ROUTES.NOTFOUND}
        replace
        state={{
          error: {
            code: 404,
            title: "Hibás rendelésazonosító",
            message: `Sajnáljuk, a megadott rendelésazonosító nem található. Megeshet, hogy elírás van az azonosítóban, vagy a rendelés törölve lett.`,
          },
        }}
      />
    );

  return <OrderProviderInner uuid={uuid}>{children}</OrderProviderInner>;
};

const OrderProviderInner = ({
  uuid,
  children,
}: {
  uuid: string;
  children: ReactNode;
}) => {
  const queryClient = useQueryClient();

  const [machineState, send] = useMachine(orderMachine);

  const { data: order, isLoading, isError, error } = useGetOrder(uuid);

  const setOrder = useCallback(
    (data: Partial<OrderModel>) => {
      queryClient.setQueryData(
        queryKeys.order.get(uuid),
        (prev: OrderModel | undefined) => ({
          ...prev,
          ...data,
        }),
      );
    },
    [queryClient, uuid],
  );

  useEffect(() => {
    if (isLoading) {
      send({ type: "ORDER_LOADING" });
      return;
    }

    if (isError) {
      send({
        type: "ORDER_LOAD_FAILED",
        error:
          error?.message || "Ismeretlen hiba történt a rendelés betöltésekor.",
      });
      return;
    }

    if (order) {
      send({ type: "ORDER_LOADED", order });

      if (shouldPollOrderState(order.state)) {
        send({ type: "START_POLLING" });
      } else {
        send({ type: "STOP_POLLING" });
      }
    }
  }, [error, isError, isLoading, order, send]);

  const contextValue = useMemo<OrderContextValue | undefined>(() => {
    if (!order) return undefined;

    return {
      order,
      setOrder,
      pretty: displayUuid(order.uuid),
      isLoading,

      machineState: machineState.value,
      isPolling: machineState.context.isPolling,
      currentAction: machineState.context.currentAction,
      error: machineState.context.error,

      send,
    };
  }, [order, setOrder, isLoading, machineState, send]);

  if (isError) {
    return (
      <Navigate
        to={ROUTES.NOTFOUND}
        replace
        state={{
          error: {
            code: 404,
            title: "Hibás rendelésazonosító",
            message: `Sajnáljuk, a(z) "${displayUuid(uuid)}" azonosítójú rendelés nem található. Megeshet, hogy elírás van az azonosítóban, vagy a rendelés törölve lett.`,
          },
        }}
      />
    );
  }

  if (isLoading || !order || !contextValue) {
    return <Spinner />;
  }

  return <OrderContext value={contextValue}>{children}</OrderContext>;
};

export default OrderProvider;
