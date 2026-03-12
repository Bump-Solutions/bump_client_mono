import type { ApiError } from "@bump/core/api";
import type { InventoryModel } from "@bump/core/models";
import { queryKeys } from "@bump/core/queries";
import { listSavedProducts } from "@bump/core/services";
import { ENUM } from "@bump/utils";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuthHttpClient } from "../../http/useHttpClient";

const MAX_PRODUCTS_PER_PAGE = 20;

export const useListSavedProducts = () => {
  const http = useAuthHttpClient();

  return useInfiniteQuery<InventoryModel, ApiError>({
    queryKey: queryKeys.product.saved(),
    queryFn: ({ signal, pageParam }) =>
      listSavedProducts(
        http,
        MAX_PRODUCTS_PER_PAGE,
        pageParam as number,
        signal,
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next ?? undefined,
    staleTime: ENUM.GLOBALS.staleTime5,
  });
};
