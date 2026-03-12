import type { ColorwaysPageModel } from "@bump/core/models";
import { queryKeys } from "@bump/core/queries";
import { listAvailableColorways } from "@bump/core/services";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuthHttpClient } from "../../http/useHttpClient";

const MAX_COLORWAYS_PER_PAGE = 12;

export const useListAvailableColorways = (params: {
  isCatalogProduct: boolean;
  brand: string;
  model: string;
  searchKey: string;
}) => {
  const http = useAuthHttpClient();

  return useInfiniteQuery<ColorwaysPageModel>({
    queryKey: queryKeys.product.availableColorways(params),
    queryFn: ({ signal, pageParam }) =>
      listAvailableColorways(
        http,
        params.brand,
        params.model,
        MAX_COLORWAYS_PER_PAGE,
        pageParam as number,
        params.searchKey,
        signal,
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next ?? undefined,
    staleTime: Infinity,
    enabled:
      params.isCatalogProduct && Boolean(params.brand) && Boolean(params.model),
  });
};
