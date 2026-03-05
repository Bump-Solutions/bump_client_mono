import type { ApiError } from "@bump/core/api";
import type { ProfileMetaModel } from "@bump/core/models";
import { queryKeys } from "@bump/core/queries";
import { uploadProfilePicture } from "@bump/core/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/auth/useAuth";
import { useAuthHttpClient } from "../../http/useHttpClient";

export const useUploadProfilePicture = (
  onSuccess?: (
    resp: { message: string },
    variables: Record<string, unknown>,
  ) => void,
  onError?: (error: ApiError, variables: Record<string, unknown>) => void,
) => {
  const { auth } = useAuth();
  const http = useAuthHttpClient();
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, ApiError, Record<string, unknown>>({
    mutationFn: (data) => uploadProfilePicture(http, data),
    onSuccess: (
      resp: { message: string },
      variables: Record<string, unknown>,
    ) => {
      queryClient.setQueryData(
        queryKeys.profile.meta(),
        (prev: ProfileMetaModel) => {
          return {
            ...prev,
            profilePicture: resp.message,
          };
        },
      );

      queryClient.invalidateQueries({
        queryKey: queryKeys.user.get(auth?.user.username || ""),
      });

      if (onSuccess) {
        onSuccess(resp, variables);
      }
    },

    onError: (error: ApiError, variables: Record<string, unknown>) => {
      if (onError) {
        onError(error, variables);
      }
      return Promise.reject(error);
    },
  });
};
