import type { FetchedNotificationDTO } from "@bump/core/dtos";
import { fromNotificationDTO } from "@bump/core/mappers";
import type {
  NotificationModel,
  NotificationsPageModel,
  ProfileMetaModel,
} from "@bump/core/models";
import { queryKeys } from "@bump/core/queries";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import useWebSocket from "react-use-websocket";
import { useMarkNotificationAsRead } from "../../hooks/notification/useMarkNotificationAsRead";
import { API } from "../../utils/api";
import { useAuth } from "../auth/useAuth";
import { NotificationsContext } from "./context";
import type { NotificationsProviderProps, NotificationType } from "./types";

// map server type -> tab
const toTabType = (serverType: number): NotificationType => {
  const mapping: Record<number, NotificationType> = {
    0: 1, // message-related
    1: 2, // follow
    2: 2, // like
    3: 2, // order
  };
  return mapping[serverType] ?? 1;
};

const prependNotification = (
  prev: InfiniteData<NotificationsPageModel> | undefined,
  n: NotificationModel,
): InfiniteData<NotificationsPageModel> | undefined => {
  if (!prev || prev.pages.length === 0) return prev;

  const first = prev.pages[0];

  // de-dupe by id (avoid duplicates on reconnect/refetch)
  if (first.notifications.some((x) => x.id === n.id)) return prev;

  const nextFirst: NotificationsPageModel = {
    ...first,
    notifications: [n, ...first.notifications],
    // keep count consistent (optional, depends on your backend semantics)
    count: first.count + 1,
    unreadCount: first.unreadCount + (n.isRead ? 0 : 1),
  };

  return {
    ...prev,
    pages: [nextFirst, ...prev.pages.slice(1)],
  };
};

const bumpUnreadInAllPages = (
  prev: InfiniteData<NotificationsPageModel> | undefined,
  delta: number,
): InfiniteData<NotificationsPageModel> | undefined => {
  if (!prev) return prev;
  return {
    ...prev,
    pages: prev.pages.map((p) => ({
      ...p,
      unreadCount: Math.max(0, p.unreadCount + delta),
    })),
  };
};

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

  const token = auth?.accessToken ?? "";

  const socketUrl = useMemo(() => {
    if (!token) return null;
    return `${API.WS_BASE_URL}/notifications/?token=${encodeURIComponent(token)}`;
  }, [token]);

  const onMessage = useCallback(
    (event: MessageEvent) => {
      let dto: FetchedNotificationDTO;
      try {
        dto = JSON.parse(event.data) as FetchedNotificationDTO;
      } catch {
        return; // ignore non-JSON frames
      }

      const n = fromNotificationDTO(dto);
      const tabType = toTabType(n.type);

      // 1) Update the tab list cache (infinite query) if it exists
      queryClient.setQueryData<InfiniteData<NotificationsPageModel>>(
        queryKeys.notification.list(tabType),
        (prev) => prependNotification(prev, n),
      );

      // 2) If you show unread badges per tab, you might want to bump unreadCount
      // even if that tab list isn't mounted yet:
      queryClient.setQueriesData<InfiniteData<NotificationsPageModel>>(
        { queryKey: queryKeys.notification.list(tabType), exact: true },
        (prev) => bumpUnreadInAllPages(prev, n.isRead ? 0 : 1),
      );

      // 3) Update profile meta if you keep a global unread counter there
      queryClient.setQueryData(
        queryKeys.profile.meta(),
        (prev: ProfileMetaModel | undefined) => {
          if (!prev) return prev;
          return {
            ...prev,
            unreadNotifications:
              (prev.unreadNotifications ?? 0) + (n.isRead ? 0 : 1),
          };
        },
      );
    },
    [queryClient],
  );

  // 2) WebSocket
  useWebSocket(
    socketUrl,
    {
      share: true,
      shouldReconnect: () => Boolean(token),
      reconnectAttempts: 10,
      reconnectInterval: 2000,
      retryOnError: true,

      onMessage,
      // onOpen: () => console.log("WS connected"),
      // onClose: (e) => console.log("WS closed", e.code, e.reason),
    },
    Boolean(socketUrl && token), // only connect when we have a URL and token
  );

  return (
    <NotificationsContext value={{ markAsRead }}>
      {children}
    </NotificationsContext>
  );
};

export default NotificationsProvider;
