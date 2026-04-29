import Spinner from "@/components/Spinner";
import { useGetOrder } from "@/hooks/order/useGetOrder";
import { ROUTES } from "@/routes/routes";
import type { OrderMachineEvent, OrderMachineState } from "@bump/core/machines";
import { ORDER_TIMING, ORDER_TURN, orderMachine } from "@bump/core/machines";
import { getOrderUserRole, type OrderModel } from "@bump/core/models";
import { queryKeys } from "@bump/core/queries";
import { displayUuid } from "@bump/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useMachine } from "@xstate/react";
import { useCallback, useEffect, useMemo, useRef, type ReactNode } from "react";
import { Navigate, useParams } from "react-router";
import { OrderContext } from "./context";
import type { OrderContextValue, OrderProviderProps } from "./types";

const getErrorStatus = (err: unknown): number | undefined => {
  if (!err || typeof err !== "object") return undefined;
  if ("status" in err && typeof err.status === "number") return err.status;
  if ("response" in err) {
    const res = (err as { response?: { status?: number } }).response;
    if (res && typeof res.status === "number") return res.status;
  }
  return undefined;
};

const isNotFoundStatus = (status: number | undefined): boolean =>
  status === 404 || status === 410;

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
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { data: order, isLoading, isError, error, refetch } = useGetOrder(uuid);

  const setOrder = useCallback(
    (data: Partial<OrderModel>) => {
      queryClient.setQueryData(
        queryKeys.order.get(uuid),
        (prev: OrderModel | undefined) => ({ ...prev, ...data }),
      );
    },
    [queryClient, uuid],
  );

  // Sync React Query → machine
  useEffect(() => {
    if (isLoading) return;

    if (isError) {
      send({
        type: "LOAD_FAILURE",
        error: {
          kind: "network",
          message:
            error?.message ||
            "Ismeretlen hiba történt a rendelés betöltésekor.",
          retryable: true,
        },
      });
      return;
    }

    if (order) {
      send({ type: "LOAD_SUCCESS", order });
    }
  }, [error, isError, isLoading, order, send]);

  // Poll only while awaitingSystem
  useEffect(() => {
    const isAwaiting =
      (machineState.value as OrderMachineState) === "awaitingSystem";

    if (isAwaiting) {
      pollRef.current = setInterval(async () => {
        try {
          const result = await refetch();
          if (result.data) {
            send({ type: "POLL_RESULT", order: result.data });
          }
        } catch (e) {
          send({
            type: "POLL_FAILURE",
            error: {
              kind: "network",
              message: e instanceof Error ? e.message : "Polling failed",
              retryable: true,
            },
          });
        }
      }, ORDER_TIMING.pollInterval);
    }

    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [machineState.value, refetch, send]);

  const can = useCallback(
    (event: OrderMachineEvent) => machineState.can(event),
    [machineState],
  );

  const contextValue = useMemo<OrderContextValue | undefined>(() => {
    if (!order) return undefined;

    const role = getOrderUserRole(order);
    const turn = ORDER_TURN[order.state];
    const state = machineState.value as OrderMachineState;

    return {
      order,
      setOrder,
      pretty: displayUuid(order.uuid),
      role,
      turn,
      isMyTurn: state === "myTurn",
      machineState: state,
      pendingAction: machineState.context.pendingAction,
      error: machineState.context.error,
      can,
      send,
    };
  }, [order, setOrder, machineState, can, send]);

  if (isError) {
    const status = getErrorStatus(error);

    if (isNotFoundStatus(status)) {
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

    return (
      <OrderLoadError
        message={error?.message}
        onRetry={() => {
          send({ type: "RETRY" });
          refetch();
        }}
      />
    );
  }

  if (isLoading || !order || !contextValue) {
    return <Spinner />;
  }

  return <OrderContext value={contextValue}>{children}</OrderContext>;
};

const OrderLoadError = ({
  message,
  onRetry,
}: {
  message?: string;
  onRetry: () => void;
}) => (
  <div style={{ padding: 24 }}>
    <h2>A rendelés betöltése sikertelen</h2>
    <p>{message ?? "Ismeretlen hiba történt."}</p>
    <button type='button' onClick={onRetry}>
      Újrapróbálás
    </button>
  </div>
);

export default OrderProvider;
