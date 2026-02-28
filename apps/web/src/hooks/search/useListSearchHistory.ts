import type { ApiError } from "@bump/core/api";
import type { SearchHistoryItemModel } from "@bump/core/models";
import { queryKeys } from "@bump/core/queries";
import { listSearchHistory } from "@bump/core/services";
import { useQuery } from "@tanstack/react-query";
import { useAuthHttpClient } from "../../http/useHttpClient";

export const useListSearchHistory = () => {
  const http = useAuthHttpClient();

  return useQuery<SearchHistoryItemModel[], ApiError>({
    queryKey: queryKeys.search.history(),
    queryFn: ({ signal }) => listSearchHistory(http, signal),
    retry: 0,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
};
