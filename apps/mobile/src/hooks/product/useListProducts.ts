import { useState, useEffect, useCallback } from "react";
import { listProducts as listProductsService, listSavedProducts as listSavedProductsService } from "@bump/core/services";
import { useAuthHttpClient } from "../../http/useHttpClient";
import type { InventoryModel, ProductListModel } from "@bump/core/models";
import type { ApiError } from "@bump/core/api";

const MAX_PRODUCTS_PER_PAGE = 20;

export type ProductListType = 'inventory' | 'saved';

export const useListProducts = (uid?: number, type: ProductListType = 'inventory') => {
  const http = useAuthHttpClient();
  const [products, setProducts] = useState<ProductListModel[]>([]);
  const [nextPage, setNextPage] = useState<number | null>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchProducts = useCallback(async (page: number) => {
    if (type === 'inventory' && !uid) return;
    
    const isFirstPage = page === 1;
    if (isFirstPage) setIsLoading(true);
    else setIsFetchingNextPage(true);

    setIsError(false);
    try {
      const data: InventoryModel = type === 'inventory' 
        ? await listProductsService(http, uid!, MAX_PRODUCTS_PER_PAGE, page, new AbortController().signal)
        : await listSavedProductsService(http, MAX_PRODUCTS_PER_PAGE, page, new AbortController().signal);

      setProducts(prev => isFirstPage ? data.products : [...prev, ...data.products]);
      setNextPage(data.next);
    } catch (e: any) {
      setIsError(true);
      setError(e);
    } finally {
      if (isFirstPage) setIsLoading(false);
      else setIsFetchingNextPage(false);
    }
  }, [uid, http, type]);

  const loadMore = useCallback(() => {
    if (nextPage && !isFetchingNextPage && !isLoading) {
      fetchProducts(nextPage);
    }
  }, [nextPage, isFetchingNextPage, isLoading, fetchProducts]);

  useEffect(() => {
    setProducts([]);
    setNextPage(1);
    fetchProducts(1);
  }, [uid, type, fetchProducts]);

  return { 
    products, 
    isLoading, 
    isFetchingNextPage, 
    hasNextPage: !!nextPage, 
    isError, 
    error, 
    loadMore,
    refetch: () => fetchProducts(1)
  };
};
