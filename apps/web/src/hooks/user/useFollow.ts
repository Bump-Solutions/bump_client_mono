import type { ApiError, ApiResponse } from "@bump/core/api";
import { follow } from "@bump/core/services";
import { useMutation } from "@tanstack/react-query";
import { useAuthHttpClient } from "../../http/useHttpClient";

export const useFollow = (
  onSuccess?: (resp: ApiResponse, variables: number) => void,
  onError?: (error: ApiError, variables: number) => void,
) => {
  const http = useAuthHttpClient();

  return useMutation<ApiResponse, ApiError, number>({
    mutationFn: (uid: number) => follow(http, uid),

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
  });
};
