import type { ApiError, ApiResponse } from "@bump/core/api";
import type { AddressModel } from "@bump/core/models";
import { queryKeys } from "@bump/core/queries";
import { modifyAddress } from "@bump/core/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthHttpClient } from "../../http/useHttpClient";

export const useModifyAddress = (
  onSuccess?: (resp: ApiResponse, variables: AddressModel) => void,
  onError?: (error: ApiError, variables: AddressModel) => void,
) => {
  const http = useAuthHttpClient();
  const queryClient = useQueryClient();

  return useMutation<ApiResponse, ApiError, AddressModel>({
    mutationFn: (address: AddressModel) => modifyAddress(http, address),
    onSuccess: (resp, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.address.list() });
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
