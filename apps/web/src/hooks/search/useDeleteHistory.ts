import type { ApiError, ApiResponse } from "@bump/core/api";
import type { SearchHistoryItemModel } from "@bump/core/models";
import { queryKeys } from "@bump/core/queries";
import { deleteSearchHistoryItem } from "@bump/core/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthHttpClient } from "../../http/useHttpClient";

export const useDeleteHistory = (
  onSuccess?: (resp: ApiResponse, variables: number) => void,
  onError?: (error: ApiError, variables: number) => void,
) => {
  const http = useAuthHttpClient();
  const queryClient = useQueryClient();

  return useMutation<ApiResponse, ApiError, number>({
    mutationFn: (historyId) => deleteSearchHistoryItem(http, historyId),

    onMutate: async (historyId) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.search.history(),
      });

      const prev = queryClient.getQueryData<SearchHistoryItemModel[]>(
        queryKeys.search.history(),
      );
      if (!prev) return { prev };

      const newHistory = prev.filter((item) => item.id !== historyId);

      queryClient.setQueryData(queryKeys.search.history(), newHistory);

      return { prev };
    },

    onSuccess: (resp, variables) => {
      if (onSuccess) {
        onSuccess(resp, variables);
      }
    },

    onError: (error, variables) => {
      if (onError) {
        onError(error, variables);
      }
      return Promise.reject(error);
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.search.history(),
      });
    },
  });
};
