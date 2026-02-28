import type { ApiError } from "@bump/core/api";
import type { OrderModel } from "@bump/core/models";
import { queryKeys } from "@bump/core/queries";
import { getOrder } from "@bump/core/services";
import { ENUM } from "@bump/utils";
import { useQuery } from "@tanstack/react-query";
import { useAuthHttpClient } from "../../http/useHttpClient";

export const useGetOrder = (uuid: string | undefined) => {
  const http = useAuthHttpClient();

  return useQuery<OrderModel, ApiError>({
    queryKey: uuid ? queryKeys.order.get(uuid) : queryKeys.order.all,
    queryFn: ({ signal }) => getOrder(http, uuid, signal),
    enabled: Boolean(uuid),
    retry: 1,
    staleTime: ENUM.GLOBALS.staleTime5,
  });
};
