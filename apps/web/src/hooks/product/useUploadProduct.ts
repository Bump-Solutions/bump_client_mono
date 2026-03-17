import type { ApiError, ApiResponse } from "@bump/core/api";
import type { CreateProductModel, InventoryModel } from "@bump/core/models";
import { queryKeys } from "@bump/core/queries";
import { uploadProduct } from "@bump/core/services";
import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { useAuth } from "../../context/auth/useAuth";
import { useAuthHttpClient } from "../../http/useHttpClient";

type UploadProductVariables = {
  newProduct: CreateProductModel;
};

type UploadProductContext = {
  prevList?: InfiniteData<InventoryModel>;
};

export const useUploadProduct = (
  onSuccess?: (resp: ApiResponse, variables: UploadProductVariables) => void,
  onError?: (error: ApiError, variables: UploadProductVariables) => void,
) => {
  const { auth } = useAuth();

  const http = useAuthHttpClient();
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse,
    ApiError,
    UploadProductVariables,
    UploadProductContext
  >({
    mutationFn: ({ newProduct }) => uploadProduct(http, newProduct),

    onSuccess: (resp, variables) => {
      if (onSuccess) {
        onSuccess(resp, variables);
      }
    },

    onError: (error, variables, context) => {
      if (context?.prevList) {
        queryClient.setQueryData(
          queryKeys.product.list(auth?.user.id ?? 0),
          context.prevList,
        );
      }

      if (onError) {
        onError(error, variables);
      }

      return Promise.reject(error);
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.product.list(auth?.user.id ?? 0),
        refetchType: "all",
      });
    },
  });
};
