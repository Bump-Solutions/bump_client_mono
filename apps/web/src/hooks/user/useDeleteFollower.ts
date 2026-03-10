import type { ApiError, ApiResponse } from "@bump/core/api";
import { deleteFollower } from "@bump/core/services";
import { useMutation } from "@tanstack/react-query";
import { useAuthHttpClient } from "../../http/useHttpClient";

export const useDeleteFollower = (
  onSuccess?: (response: ApiResponse, variables: number) => void,
  onError?: (error: ApiError, variables: number) => void,
) => {
  const http = useAuthHttpClient();

  return useMutation<ApiResponse, ApiError, number>({
    mutationFn: (followerId: number) => deleteFollower(http, followerId),

    onSuccess: (response, variables) => {
      if (onSuccess) {
        onSuccess(response, variables);
      }
    },

    onError: (error, variables) => {
      if (onError) {
        onError(error, variables);
      }
      return Promise.reject(error);
    },
  });
};
