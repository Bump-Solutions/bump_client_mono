import { PATHS, type ApiResponse } from "../api";
import type { NotificationsPageDTO } from "../dtos";
import type { HttpClient } from "../http/types";
import { fromNotificationDTO } from "../mappers";
import type { NotificationsPageModel } from "../models";

export const listNotifications = async (
  http: HttpClient,
  type: number,
  size: number,
  page: number,
  signal?: AbortSignal,
): Promise<NotificationsPageModel> => {
  let endpoint: string;
  switch (type) {
    case 1: // Message-related notifications
      endpoint = PATHS.NOTIFICATIONS.LIST_MESSAGE_RELATED_NOTIFICATIONS(
        size,
        page,
      );
      break;

    case 2: // General notifications
      endpoint = PATHS.NOTIFICATIONS.LIST_GENERAL_NOTIFICATIONS(size, page);
      break;

    default:
      throw new Error("Invalid notification type");
  }

  const data = await http.get<{ message: NotificationsPageDTO }>(endpoint, {
    signal,
  });

  if (data.message.next) {
    data.message.next = page + 1;
  }

  const { unread_count, ...rest } = data.message;

  return {
    ...rest,
    unreadCount: unread_count,
    notifications: rest.notifications.map(fromNotificationDTO),
  };
};

export const markNotificationAsRead = async (
  http: HttpClient,
  notificationId: number,
): Promise<ApiResponse> => {
  if (!notificationId) {
    throw new Error("Missing required parameter: notificationId");
  }

  return await http.put(
    PATHS.NOTIFICATIONS.MARK_NOTIFICATION_AS_READ(notificationId),
  );
};
