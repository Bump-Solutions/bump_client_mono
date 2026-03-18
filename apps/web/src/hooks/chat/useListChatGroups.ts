import type { ApiError } from "@bump/core/api";
import type { InboxModel } from "@bump/core/models";
import { queryKeys } from "@bump/core/queries";
import { listChatGroups } from "@bump/core/services";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuthHttpClient } from "../../http/useHttpClient";

const MAX_CHAT_PER_PAGE = 20;

export const useListChatGroups = (searchKey: string) => {
  const http = useAuthHttpClient();

  return useInfiniteQuery<InboxModel, ApiError>({
    queryKey: queryKeys.chat.groups(searchKey),
    queryFn: ({ signal, pageParam }) =>
      listChatGroups(
        http,
        MAX_CHAT_PER_PAGE,
        pageParam as number,
        searchKey,
        signal,
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next ?? undefined,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
    staleTime: 0, // No caching
    gcTime: 0, // No caching
  });
};
