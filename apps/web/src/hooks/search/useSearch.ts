import type { ApiError } from "@bump/core/api";
import type {
  ProductSearchModel,
  SearchPageModel,
  UserSearchModel,
} from "@bump/core/models";
import { queryKeys } from "@bump/core/queries";
import { searchProducts, searchUsers } from "@bump/core/services";
import { useDebounce } from "@bump/hooks";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useAuthHttpClient } from "../../http/useHttpClient";

const MAX_SEARCH_RESULTS = 25;

type SearchMode = "users" | "products";

type DebouncedSearchState = {
  key: string;
  mode: SearchMode;
};

export const useSearch = (params: { searchKey: string; delay?: number }) => {
  const http = useAuthHttpClient();
  const queryClient = useQueryClient();

  const [debounced, setDebounced] = useState<DebouncedSearchState>({
    key: "",
    mode: "products",
  });

  const rawSearchKey = params.searchKey.trim();

  useDebounce(
    () => {
      const isUserSearch = rawSearchKey.startsWith("@");
      const cleanedSearchKey = isUserSearch
        ? rawSearchKey.slice(1)
        : rawSearchKey;

      setDebounced((prev) => {
        const next: DebouncedSearchState = {
          key: cleanedSearchKey,
          mode: isUserSearch ? "users" : "products",
        };

        // avoid unnecessary state updates
        if (prev.key === next.key && prev.mode === next.mode) {
          return prev;
        }

        return next;
      });
    },
    params.delay ?? 0,
    [rawSearchKey],
  );

  const isDebouncing =
    rawSearchKey.length > 0 &&
    (() => {
      const isUserSearch = rawSearchKey.startsWith("@");
      const cleaned = isUserSearch ? rawSearchKey.slice(1) : rawSearchKey;
      const mode: SearchMode = isUserSearch ? "users" : "products";

      return debounced.key !== cleaned || debounced.mode !== mode;
    })();

  const queryKey = useMemo(() => {
    return debounced.mode === "users"
      ? queryKeys.search.users({ key: debounced.key })
      : queryKeys.search.products({ key: debounced.key });
  }, [debounced.key, debounced.mode]);

  const query = useInfiniteQuery<
    SearchPageModel<UserSearchModel | ProductSearchModel>,
    ApiError
  >({
    queryKey,
    queryFn: ({ signal, pageParam }) =>
      debounced.mode === "users"
        ? searchUsers(
            http,
            MAX_SEARCH_RESULTS,
            pageParam as number,
            debounced.key,
            signal,
          )
        : searchProducts(
            http,
            MAX_SEARCH_RESULTS,
            pageParam as number,
            debounced.key,
            signal,
          ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next ?? undefined,
    enabled: debounced.key.length > 0,
    staleTime: 0,
    retry: 1,
  });

  // Invalidate search history after successful search
  useEffect(() => {
    if (!query.isSuccess) return;

    queryClient.invalidateQueries({
      queryKey: queryKeys.search.history(),
    });
  }, [query.isSuccess, queryClient]);

  return {
    ...query,
    isDebouncing,
    mode: debounced.mode,
    debouncedKey: debounced.key,
  };
};
