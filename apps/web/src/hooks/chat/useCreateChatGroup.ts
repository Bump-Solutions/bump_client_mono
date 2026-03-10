import type { ApiError, ApiResponse } from "@bump/core/api";
import type { UserModel } from "@bump/core/models";
import { queryKeys } from "@bump/core/queries";
import { createChatGroup } from "@bump/core/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthHttpClient } from "../../http/useHttpClient";

export const useCreateChatGroup = (
  onSuccess?: (
    resp: ApiResponse<{ message: string }>,
    variables: UserModel["id"],
  ) => void,
  onError?: (error: ApiError, variables: UserModel["id"]) => void,
) => {
  const http = useAuthHttpClient();
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<{ message: string }>,
    ApiError,
    UserModel["id"]
  >({
    mutationFn: (partnerId: UserModel["id"]) =>
      createChatGroup(http, partnerId),

    onSuccess: async (resp, variables) => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.chat.groups(),
        exact: false,
        refetchType: "all",
      });

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
