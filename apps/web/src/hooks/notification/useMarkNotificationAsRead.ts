import type { ApiError, ApiResponse } from "@bump/core/api";
import type {
  NotificationsPageModel,
  ProfileMetaModel,
} from "@bump/core/models";
import { queryKeys } from "@bump/core/queries";
import { markNotificationAsRead } from "@bump/core/services";
import {
  type InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useAuthHttpClient } from "../../http/useHttpClient";

export const useMarkNotificationAsRead = (
  onSuccess?: (resp: ApiResponse, variables: number) => void,
  onError?: (error: ApiError, variables: number) => void,
) => {
  const http = useAuthHttpClient();
  const queryClient = useQueryClient();

  return useMutation<ApiResponse, ApiError, number>({
    mutationFn: (notificationId: number) =>
      markNotificationAsRead(http, notificationId),

    onSuccess: (resp, variables) => {
      // Navbar notification count update
      queryClient.setQueryData(
        queryKeys.profile.meta(),
        (prev: ProfileMetaModel | undefined) => {
          if (!prev) return prev;

          return {
            ...prev,
            unreadNotifications: prev.unreadNotifications - 1,
          };
        },
      );

      queryClient.setQueriesData<InfiniteData<NotificationsPageModel>>(
        {
          queryKey: queryKeys.notification.all,
          exact: false,
        },
        (prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            pages: prev.pages.map((page) => {
              const hasTarget = page.notifications.some(
                (notification) => notification.id === variables,
              );

              if (!hasTarget) return page;

              return {
                ...page,
                unreadCount: Math.max(
                  0,
                  page.unreadCount -
                    (page.notifications.find(
                      (notification) =>
                        notification.id === variables && !notification.isRead,
                    )
                      ? 1
                      : 0),
                ),
                notifications: page.notifications.map((notification) => {
                  if (notification.id === variables) {
                    return {
                      ...notification,
                      isRead: true,
                    };
                  }
                  return notification;
                }),
              };
            }),
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
