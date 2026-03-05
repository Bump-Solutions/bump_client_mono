import type { ApiError, ApiResponse } from "@bump/core/api";
import type { ProfileModel } from "@bump/core/models";
import { queryKeys } from "@bump/core/queries";
import { updateProfile } from "@bump/core/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthHttpClient } from "../../http/useHttpClient";

export const useUpdateProfile = (
  onSuccess?: (resp: ApiResponse, variables: Partial<ProfileModel>) => void,
  onError?: (error: ApiError, variables: Partial<ProfileModel>) => void,
) => {
  const http = useAuthHttpClient();
  const queryClient = useQueryClient();

  return useMutation<ApiResponse, ApiError, Partial<ProfileModel>>({
    mutationFn: (newProfile: Partial<ProfileModel>) =>
      updateProfile(http, newProfile),

    onSuccess: (resp, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.meta() });

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
