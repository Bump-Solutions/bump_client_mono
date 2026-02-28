import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { useMarkNotificationAsRead } from "../../hooks/notification/useMarkNotificationAsRead";
import { API } from "../../utils/api";
import { useAuth } from "../auth/useAuth";
import type { NotificationsProviderProps, NotificationType } from "./types";

import type { FetchedNotificationDTO } from "@bump/core/dtos";
import { fromNotificationDTO } from "@bump/core/mappers";
import { queryKeys } from "@bump/core/queries";
import useWebSocket from "react-use-websocket";
import { NotificationsContext } from "./context";

const NotificationsProvider = ({ children }: NotificationsProviderProps) => {
  const { auth } = useAuth();
  const queryClient = useQueryClient();

  // 1) Mark-as-read mutation
  const markAsReadMutation = useMarkNotificationAsRead();
  const markAsRead = useCallback(
    (notificationId: number) => {
      return markAsReadMutation.mutateAsync(notificationId);
    },
    [markAsReadMutation],
  );

  // 2) WebSocket
  const URL = `${API.WS_BASE_URL}/notifications/`;
  const { lastJsonMessage } = useWebSocket(
    URL,
    {
      queryParams: {
        token: auth?.accessToken || "",
      },
      shouldReconnect: () => {
        return Boolean(auth?.accessToken);
      },
      share: true,
    },
    Boolean(auth?.accessToken),
  );

  // 3) Handle incoming notifications
  useEffect(() => {
    if (!lastJsonMessage) return;

    const dto = lastJsonMessage as FetchedNotificationDTO;
    const newNotification = fromNotificationDTO(dto);

    // Map the type to the correct tab: type: tab index
    const mapping: Record<number, NotificationType> = {
      0: 1, // message-related
      1: 2, // follow
      2: 2, // like
    };
    const tabType = mapping[newNotification.type] as NotificationType;

    // Update global notification counter
    queryClient.invalidateQueries({
      queryKey: queryKeys.profile.meta(),
      exact: true,
      refetchType: "active",
    });

    // Update the specific tab with the new notification
    queryClient.invalidateQueries({
      queryKey: queryKeys.notification.list(tabType),
      exact: true,
      refetchType: "active",
    });
  }, [lastJsonMessage, queryClient]);

  return (
    <NotificationsContext value={{ markAsRead }}>
      {children}
    </NotificationsContext>
  );
};

export default NotificationsProvider;
