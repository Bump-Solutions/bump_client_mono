import type { ApiResponse } from "@bump/core/api";
import type { ReactNode } from "react";

type TYPES = readonly [1, 2, 3];
export type NotificationType = TYPES[number];

export type NotificationsProviderProps = {
  children: ReactNode;
};

export type NotificationsContextValue = {
  markAsRead: (notificationId: number) => Promise<ApiResponse>;
};
