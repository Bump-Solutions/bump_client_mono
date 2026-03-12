import type { ApiError } from "@bump/core/api";
import type { ProductModel } from "@bump/core/models";
import { queryKeys } from "@bump/core/queries";
import { getProduct } from "@bump/core/services";
import { ENUM } from "@bump/utils";
import { useQuery } from "@tanstack/react-query";
import { useAuthHttpClient } from "../../http/useHttpClient";

export const useGetProduct = (productId: ProductModel["id"]) => {
  const http = useAuthHttpClient();

  return useQuery<ProductModel, ApiError>({
    queryKey: queryKeys.product.get(productId),
    queryFn: ({ signal }) => getProduct(http, productId, signal),
    enabled: Boolean(productId),
    staleTime: ENUM.GLOBALS.staleTime5,
    retry: 1,
  });
};
