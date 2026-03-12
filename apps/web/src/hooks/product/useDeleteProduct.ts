import type { ApiError, ApiResponse } from "@bump/core/api";
import type {
  InventoryModel,
  ProductListModel,
  ProductModel,
} from "@bump/core/models";
import { queryKeys } from "@bump/core/queries";
import { deleteProduct } from "@bump/core/services";
import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { useProfile } from "../../context/profile/useProfile";
import { useAuthHttpClient } from "../../http/useHttpClient";

type DeleteProductVariables = {
  product: ProductListModel;
};

type DeleteProductContext = {
  prev?: ProductModel;
  prevList?: InventoryModel;
  prevSaved?: InventoryModel;
};

export const useDeleteProduct = (
  onSuccess?: (resp: ApiResponse, variables: DeleteProductVariables) => void,
  onError?: (error: ApiError, variables: DeleteProductVariables) => void,
) => {
  const { user } = useProfile();

  const http = useAuthHttpClient();
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse,
    ApiError,
    DeleteProductVariables,
    DeleteProductContext
  >({
    mutationFn: ({ product }) => deleteProduct(http, product.id),

    onMutate: async ({ product }) => {
      await Promise.all([
        queryClient.cancelQueries({
          queryKey: queryKeys.product.get(product.id),
        }),
        queryClient.cancelQueries({
          queryKey: queryKeys.product.list(user.id),
        }),
        queryClient.cancelQueries({
          queryKey: queryKeys.product.saved(),
        }),
      ]);

      const prev = queryClient.getQueryData<ProductModel>(
        queryKeys.product.get(product.id),
      );

      const prevList = queryClient.getQueryData<InventoryModel>(
        queryKeys.product.list(user.id),
      );

      const prevSaved = queryClient.getQueryData<InventoryModel>(
        queryKeys.product.saved(),
      );

      // 1) getProduct: optimista mentés - delete
      queryClient.removeQueries({
        queryKey: queryKeys.product.get(product.id),
      });

      // 2) listProducts: optimista mentés
      queryClient.setQueryData<InfiniteData<InventoryModel>>(
        queryKeys.product.list(user.id),
        (old) => {
          if (!old) return old;

          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              products: page.products.filter(
                (p: ProductListModel) => p.id !== product.id,
              ),
            })),
          };
        },
      );

      // 3) listSavedProducts: optimista mentés
      queryClient.setQueryData<InfiniteData<InventoryModel>>(
        queryKeys.product.saved(),
        (old) => {
          if (!old) return old;

          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              products: page.products.filter(
                (p: ProductListModel) => p.id !== product.id,
              ),
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

      if (context?.prev) {
        queryClient.setQueryData(
          queryKeys.product.get(product.id),
          context.prev,
        );
      }

      if (context?.prevList) {
        queryClient.setQueryData(
          queryKeys.product.list(user.id),
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
  });
};
