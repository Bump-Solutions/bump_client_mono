import type { BrandsPageModel } from "@bump/core/models";
import { queryKeys } from "@bump/core/queries";
import { listAvailableBrands } from "@bump/core/services";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuthHttpClient } from "../../http/useHttpClient";

const MAX_BRANDS_PER_PAGE = 12;

export const useListAvailableBrands = (params: {
  isCatalogProduct: boolean;
  searchKey: string;
}) => {
  const http = useAuthHttpClient();

  return useInfiniteQuery<BrandsPageModel>({
    queryKey: queryKeys.product.availableBrands(params),
    queryFn: ({ signal, pageParam }) =>
      listAvailableBrands(
        http,
        MAX_BRANDS_PER_PAGE,
        pageParam as number,
        params.searchKey,
        signal,
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next ?? undefined,
    staleTime: Infinity,
    enabled: params.isCatalogProduct,
  });
};
