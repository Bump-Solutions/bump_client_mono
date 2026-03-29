import { useState, useEffect, useMemo } from 'react';
import { searchProducts, searchUsers } from '@bump/core/services';
import { useAuthHttpClient } from '../../http/useHttpClient';
import type { 
  ProductSearchModel, 
  UserSearchModel, 
  SearchPageModel 
} from '@bump/core/models';
import type { ApiError } from '@bump/core/api';

const MAX_SEARCH_RESULTS = 25;

export const useSearch = (params: { searchKey: string; delay?: number }) => {
  const http = useAuthHttpClient();
  const [data, setData] = useState<SearchPageModel<UserSearchModel | ProductSearchModel> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const rawSearchKey = params.searchKey.trim();
  const isUserSearch = rawSearchKey.startsWith('@');
  const cleanedSearchKey = isUserSearch ? rawSearchKey.slice(1) : rawSearchKey;

  useEffect(() => {
    if (cleanedSearchKey.length === 0) {
      setData(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const result = isUserSearch
          ? await searchUsers(http, MAX_SEARCH_RESULTS, 1, cleanedSearchKey)
          : await searchProducts(http, MAX_SEARCH_RESULTS, 1, cleanedSearchKey);
        
        setData(result);
      } catch (e: any) {
        setIsError(true);
        setError(e);
      } finally {
        setIsLoading(false);
      }
    }, params.delay ?? 400);

    return () => clearTimeout(timer);
  }, [cleanedSearchKey, isUserSearch, http, params.delay]);

  return {
    data,
    isLoading,
    isError,
    error,
    mode: isUserSearch ? 'users' : 'products',
  };
};
