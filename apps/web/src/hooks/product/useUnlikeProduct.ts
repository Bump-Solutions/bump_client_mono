import type { ApiError, ApiResponse } from "@bump/core/api";
import type {
  InventoryModel,
  ProductListModel,
  ProductModel,
} from "@bump/core/models";
import { queryKeys } from "@bump/core/queries";
import { unlikeProduct } from "@bump/core/services";
import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { useAuthHttpClient } from "../../http/useHttpClient";

type UnlikeProductVariables = {
  product: ProductModel | ProductListModel;
  ownerId: number;
};

type UnlikeProductCtx = {
  prev?: ProductModel | ProductListModel;
  prevList?: InfiniteData<InventoryModel>;
  prevSaved?: InfiniteData<InventoryModel>;
};

export const useUnlikeProduct = (
  onSuccess?: (resp: ApiResponse, variables: UnlikeProductVariables) => void,
  onError?: (error: ApiError, variables: UnlikeProductVariables) => void,
) => {
  const http = useAuthHttpClient();
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse,
    ApiError,
    UnlikeProductVariables,
    UnlikeProductCtx
  >({
    mutationFn: ({ product }) => unlikeProduct(http, product.id),

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
            liked: false,
            likes: old.likes - 1,
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
                    liked: false,
                    likes: p.likes - 1,
                  };
                }
                return p;
              }),
            })),
          };
        },
      );

      // 3) saved list: csak akkor ha mentve van
      if (product.saved) {
        queryClient.setQueryData<InfiniteData<InventoryModel>>(
          queryKeys.product.saved(),
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
                      liked: false,
                      likes: p.likes - 1,
                    };
                  }
                  return p;
                }),
              })),
            };
          },
        );
      }

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

    /* OLD 
    onSettled: (resp, error, { product, ownerId }) => {
      
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.listProducts, ownerId],
        refetchType: "active",
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.listSavedProducts],
        refetchType: "active",
      });
    },
    */
  });
};
