import type { ApiError } from "@bump/core/api";
import type { NotificationsPageModel } from "@bump/core/models";
import { queryKeys } from "@bump/core/queries";
import { listNotifications } from "@bump/core/services";
import { ENUM } from "@bump/utils";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/auth/useAuth";
import { useAuthHttpClient } from "../../http/useHttpClient";

const MAX_NOTIFICATIONS_PER_PAGE = 5;

export const useListNotifications = (type: number) => {
  const http = useAuthHttpClient();
  const { auth } = useAuth();

  return useInfiniteQuery<NotificationsPageModel, ApiError>({
    queryKey: queryKeys.notification.list(type),
    queryFn: ({ signal, pageParam }) =>
      listNotifications(
        http,
        type,
        MAX_NOTIFICATIONS_PER_PAGE,
        pageParam as number,
        signal,
      ),
    enabled: Boolean(auth),
    refetchOnWindowFocus: true,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next ?? undefined,
    staleTime: ENUM.GLOBALS.staleTime1,
  });
};
