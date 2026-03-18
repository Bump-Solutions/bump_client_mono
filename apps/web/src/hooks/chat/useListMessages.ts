import type { ApiError } from "@bump/core/api";
import type { ChatGroupModel, MessagesPageModel } from "@bump/core/models";
import { queryKeys } from "@bump/core/queries";
import { listMessages } from "@bump/core/services";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuthHttpClient } from "../../http/useHttpClient";

const MAX_MESSAGES_PER_PAGE = 20;

export const useListMessages = (chat: ChatGroupModel["name"]) => {
  const http = useAuthHttpClient();

  return useInfiniteQuery<MessagesPageModel, ApiError>({
    queryKey: queryKeys.chat.messages(chat),
    queryFn: ({ signal, pageParam }) =>
      listMessages(
        http,
        chat,
        MAX_MESSAGES_PER_PAGE,
        pageParam as number,
        signal,
      ),
    enabled: Boolean(chat),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next ?? undefined,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
    staleTime: 0, // No caching
    gcTime: 0, // No caching
  });
};
