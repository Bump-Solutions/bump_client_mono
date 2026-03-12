import type { ApiError, ApiResponse } from "@bump/core/api";
import type {
  InventoryModel,
  ProductListModel,
  ProductModel,
} from "@bump/core/models";
import { queryKeys } from "@bump/core/queries";
import { saveProduct } from "@bump/core/services";
import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { useAuthHttpClient } from "../../http/useHttpClient";

type SaveProductVariables = {
  product: ProductModel | ProductListModel;
  ownerId: number;
};

type SaveProductCtx = {
  prev?: ProductModel | ProductListModel;
  prevList?: InfiniteData<InventoryModel>;
  prevSaved?: InfiniteData<InventoryModel>;
};

export const useSaveProduct = (
  onSuccess?: (resp: ApiResponse, variables: SaveProductVariables) => void,
  onError?: (error: ApiError, variables: SaveProductVariables) => void,
) => {
  const http = useAuthHttpClient();
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse,
    ApiError,
    SaveProductVariables,
    SaveProductCtx
  >({
    mutationFn: ({ product }) => saveProduct(http, product.id),

    onMutate: async ({ product, ownerId }) => {
      await Promise.all([
        queryClient.cancelQueries({
          queryKey: queryKeys.product.get(product.id),
        }),
        queryClient.cancelQueries({
          queryKey: queryKeys.product.list(ownerId),
        }),
        queryClient.cancelQueries({
          queryKey: queryKeys.product.saved(),
        }),
      ]);

      const prev = queryClient.getQueryData<ProductModel>(
        queryKeys.product.get(product.id),
      );

      const prevList = queryClient.getQueryData<InfiniteData<InventoryModel>>(
        queryKeys.product.list(ownerId),
      );

      const prevSaved = queryClient.getQueryData<InfiniteData<InventoryModel>>(
        queryKeys.product.saved(),
      );

      // 1) getProduct: optimista mentés
      queryClient.setQueryData<ProductModel>(
        queryKeys.product.get(product.id),
        (old) => {
          if (!old) return old;

          return {
            ...old,
            saved: true,
            saves: old.saves + 1,
          };
        },
      );

      // 2) owner list
      queryClient.setQueryData<InfiniteData<InventoryModel>>(
        queryKeys.product.list(ownerId),
        (old) => {
          if (!old) return old;

          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              products: page.products.map((p: ProductListModel) => {
                if (p.id === product.id) {
                  return {
                    ...p,
                    saved: true,
                    saves: p.saves + 1,
                  };
                }
                return p;
              }),
            })),
          };
        },
      );

      // 3) saved list
      queryClient.setQueryData<InfiniteData<InventoryModel>>(
        queryKeys.product.saved(),
        (old) => {
          if (!old) return old;

          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              products: [
                {
                  ...(product as ProductListModel),
                  saved: true,
                  saves: product.saves + 1,
                },
                ...page.products,
              ],
            })),
          };
        },
      );

      return { prev, prevList, prevSaved };
    },

    onSuccess: (resp, variables) => {
      if (onSuccess) {
        onSuccess(resp, variables);
      }
    },

    onError: (error, variables, context) => {
      const product = variables.product;
      const ownerId = variables.ownerId;

      if (context?.prev) {
        queryClient.setQueryData(
          queryKeys.product.get(product.id),
          context.prev,
        );
      }

      if (context?.prevList) {
        queryClient.setQueryData(
          queryKeys.product.list(ownerId),
          context.prevList,
        );
      }

      if (context?.prevSaved) {
        queryClient.setQueryData(queryKeys.product.saved(), context.prevSaved);
      }

      if (onError) {
        onError(error, variables);
      }

      return Promise.reject(error);
    },

    onSettled: (_resp, _error, { product, ownerId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.product.get(product.id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.product.list(ownerId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.product.saved(),
      });
    },
  });
};
