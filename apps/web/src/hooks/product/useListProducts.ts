import type { ApiError } from "@bump/core/api";
import type { InventoryModel, UserModel } from "@bump/core/models";
import { queryKeys } from "@bump/core/queries";
import { listProducts } from "@bump/core/services";
import { ENUM } from "@bump/utils";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuthHttpClient } from "../../http/useHttpClient";

const MAX_PRODUCTS_PER_PAGE = 20;

export const useListProducts = (uid: UserModel["id"]) => {
  const http = useAuthHttpClient();

  return useInfiniteQuery<InventoryModel, ApiError>({
    queryKey: queryKeys.product.list(uid),
    queryFn: ({ signal, pageParam }) =>
      listProducts(
        http,
        uid,
        MAX_PRODUCTS_PER_PAGE,
        pageParam as number,
        signal,
      ),
    enabled: Boolean(uid),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next ?? undefined,
    staleTime: ENUM.GLOBALS.staleTime5,
  });
};
