import { PATHS, type ApiResponse } from "../api";
import type { HttpClient } from "../http/types";

export const reportProduct = async (
  http: HttpClient,
  productId: number,
  params: {
    reason: number;
    description?: string;
  },
): Promise<ApiResponse> => {
  if (!productId) throw new Error("Missing required parameter: productId");

  return http.post(PATHS.REPORT.PRODUCT, {
    product: productId,
    reason: params.reason,
    description: params.description,
  });
};

export const reportUser = async (
  http: HttpClient,
  userId: number,
  params: {
    reason: number;
    description?: string;
  },
): Promise<ApiResponse> => {
  if (!userId) throw new Error("Missing required parameter: userId");

  return http.post(PATHS.REPORT.USER, {
    user: userId,
    reason: params.reason,
    description: params.description,
  });
};
