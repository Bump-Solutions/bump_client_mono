import type { OrderModel } from "@bump/core/models";
import { queryKeys } from "@bump/core/queries";
import { displayUuid } from "@bump/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { Navigate, useParams } from "react-router";
import { useGetOrder } from "../../hooks/order/useGetOrder";
import { ROUTES } from "../../routes/routes";
import { OrderContext } from "./context";
import type { OrderContextValue, OrderProviderProps } from "./types";

const OrderProvider = ({ children }: OrderProviderProps) => {
  const { uuid } = useParams();
  const queryClient = useQueryClient();

  const { data: order, isLoading, isError } = useGetOrder(uuid);

  const setOrder = useCallback(
    (data: Partial<OrderModel>) => {
      queryClient.setQueryData(
        uuid ? queryKeys.order.get(uuid) : queryKeys.order.all,
        (prev: OrderModel | undefined) => ({
          ...prev,
          ...data,
        }),
      );
    },
    [queryClient, uuid],
  );

  const contextValue = useMemo<OrderContextValue>(
    () => ({
      order,
      setOrder,
      isLoading,
    }),
    [order, setOrder, isLoading],
  );

  if (!uuid) return null;

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

  return <OrderContext value={contextValue}>{children}</OrderContext>;
};

export default OrderProvider;
