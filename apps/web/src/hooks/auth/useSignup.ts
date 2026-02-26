import type { SignupModel } from "@bump/core/models";

import { signup } from "@bump/core/services";
import { useMutation } from "@tanstack/react-query";
import { usePublicHttpClient } from "../../http/useHttpClient";
import type { ApiError } from "../../types/api";

export const useSignup = (
  onSuccess?: (resp: unknown, variables: SignupModel) => void,
  onError?: (error: ApiError, variables: SignupModel) => void,
) => {
  const http = usePublicHttpClient();

  return useMutation<unknown, ApiError, SignupModel>({
    mutationFn: (model) => signup(http, model),
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
