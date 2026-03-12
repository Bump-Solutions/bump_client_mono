import type { ModelsPageModel } from "@bump/core/models";
import { queryKeys } from "@bump/core/queries";
import { listAvailableModels } from "@bump/core/services";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuthHttpClient } from "../../http/useHttpClient";

const MAX_MODELS_PER_PAGE = 12;

export const useListAvailableModels = (params: {
  isCatalogProduct: boolean;
  brand: string;
  searchKey: string;
}) => {
  const http = useAuthHttpClient();

  return useInfiniteQuery<ModelsPageModel>({
    queryKey: queryKeys.product.availableModels(params),
    queryFn: ({ signal, pageParam }) =>
      listAvailableModels(
        http,
        params.brand,
        MAX_MODELS_PER_PAGE,
        pageParam as number,
        params.searchKey,
        signal,
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next ?? undefined,
    staleTime: Infinity,
    enabled: params.isCatalogProduct && Boolean(params.brand),
  });
};
