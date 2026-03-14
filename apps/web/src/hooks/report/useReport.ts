import type { ApiError, ApiResponse } from "@bump/core/api";
import { reportProduct, reportUser } from "@bump/core/services";
import type { ReportType } from "@bump/types";
import { useMutation } from "@tanstack/react-query";
import { useAuthHttpClient } from "../../http/useHttpClient";

type ReportPayload = {
  id: number;
  type: ReportType;
  reason: number;
  description?: string;
};

export const useReport = (
  onSuccess?: (resp: ApiResponse, variables: ReportPayload) => void,
  onError?: (error: ApiError, variables: ReportPayload) => void,
) => {
  const http = useAuthHttpClient();

  return useMutation<ApiResponse, ApiError, ReportPayload>({
    mutationFn: (payload: ReportPayload) => {
      const { type, id, reason, description } = payload;

      switch (type) {
        case "product":
          return reportProduct(http, id, { reason, description });

        case "user":
          return reportUser(http, id, { reason, description });

        default:
          return Promise.reject("Invalid report type");
      }
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
  });
};
