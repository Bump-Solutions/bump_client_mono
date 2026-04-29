import { useAuthHttpClient } from "@/http/useHttpClient";
import type { ApiError } from "@bump/core/api";
import type { OrderModel } from "@bump/core/models";
import { queryKeys } from "@bump/core/queries";
import { getOrder } from "@bump/core/services";
import { useQuery } from "@tanstack/react-query";

export const useGetOrder = (uuid: string) => {
  const http = useAuthHttpClient();

  return useQuery<OrderModel, ApiError>({
    queryKey: queryKeys.order.get(uuid),
    queryFn: ({ signal }) => getOrder(http, uuid, signal),
    enabled: Boolean(uuid),
    retry: 1,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
    staleTime: 0, // No caching
    gcTime: 0, // No caching
  });
};
