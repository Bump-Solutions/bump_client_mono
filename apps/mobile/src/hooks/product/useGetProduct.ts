import { useState, useEffect, useCallback } from "react";
import { getProduct as getProductService } from "@bump/core/services";
import { useAuthHttpClient } from "../../http/useHttpClient";
import type { ProductModel } from "@bump/core/models";
import type { ApiError } from "@bump/core/api";

export const useGetProduct = (productId?: number) => {
  const http = useAuthHttpClient();
  const [product, setProduct] = useState<ProductModel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!productId) return;
    setIsLoading(true);
    try {
      const data = await getProductService(http, productId, new AbortController().signal);
      setProduct(data);
      setError(null);
    } catch (e: any) {
      setError(e);
    } finally {
      setIsLoading(false);
    }
  }, [productId, http]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return { product, setProduct, isLoading, error, refetch: fetchProduct };
};
