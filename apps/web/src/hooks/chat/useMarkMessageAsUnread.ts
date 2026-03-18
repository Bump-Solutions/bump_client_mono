import type { ApiError, ApiResponse } from "@bump/core/api";
import type { ChatGroupModel, InboxModel } from "@bump/core/models";
import { queryKeys } from "@bump/core/queries";
import { markMessageAsUnread } from "@bump/core/services";
import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { useAuthHttpClient } from "../../http/useHttpClient";

export const useMarkMessageAsUnread = (
  onSuccess?: (resp: ApiResponse, variables: string) => void,
  onError?: (error: ApiError, variables: string) => void,
) => {
  const http = useAuthHttpClient();
  const queryClient = useQueryClient();

  return useMutation<ApiResponse, ApiError, string>({
    mutationFn: (chat: ChatGroupModel["name"]) =>
      markMessageAsUnread(http, chat),

    onSuccess: (resp, variables) => {
      queryClient.setQueriesData(
        {
          queryKey: queryKeys.chat.groups(""),
          exact: false,
        },
        (prev: InfiniteData<InboxModel>) => {
          if (!prev) return prev;

          return {
            ...prev,
            pages: prev.pages.map((page: InboxModel) => ({
              ...page,
              messages: page.messages.map((chatGroup: ChatGroupModel) => {
                if (chatGroup.name === variables) {
                  return {
                    ...chatGroup,
                    lastMessage: {
                      ...chatGroup.lastMessage,
                      isRead: false,
                    },
                  };
                }
                return chatGroup;
              }),
            })),
          };
        },
      );

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
