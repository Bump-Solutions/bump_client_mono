import type { ApiError, ApiResponse } from "@bump/core/api";
import { setProfileBackgroundColor } from "@bump/core/services";
import { useMutation } from "@tanstack/react-query";
import { useAuthHttpClient } from "../../http/useHttpClient";

export const useSetProfileBackgroundColor = (
  onSuccess?: (resp: ApiResponse, variables: string) => void,
  onError?: (error: ApiError, variables: string) => void,
) => {
  const http = useAuthHttpClient();

  return useMutation<ApiResponse, ApiError, string>({
    mutationFn: (color: string) => setProfileBackgroundColor(http, color),
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
