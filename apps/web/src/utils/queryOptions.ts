import type { HttpClient } from "@bump/core/http";
import { queryKeys } from "@bump/core/queries";
import { listOrders } from "@bump/core/services";
import { ENUM } from "@bump/utils";
import { queryOptions } from "@tanstack/react-query";

export const listOrdersQueryOptions = (
  http: HttpClient,
  pageNumber: number,
  pageSize: number,
) => {
  return queryOptions({
    queryKey: queryKeys.order.list({ pageNumber, pageSize }),
    queryFn: ({ signal }) => listOrders(http, pageSize, pageNumber, signal),
    retry: false,
    placeholderData: (prev) => prev,
    staleTime: ENUM.GLOBALS.staleTime5,
  });
};
