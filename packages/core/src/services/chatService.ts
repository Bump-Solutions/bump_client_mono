import { PATHS, type ApiResponse } from "../api";
import type { InboxDTO, MessagesPageDTO } from "../dtos";
import type { HttpClient } from "../http/types";
import { fromChatGroupDTO, fromMessageDTO } from "../mappers";
import type { ChatGroupModel, InboxModel, MessagesPageModel } from "../models";

export const listChatGroups = async (
  http: HttpClient,
  size: number,
  page: number,
  searchKey: string,
  signal: AbortSignal,
): Promise<InboxModel> => {
  const data = await http.get<{ message: InboxDTO }>(
    PATHS.CHAT.LIST_CHAT_GROUPS(size, page, searchKey),
    {
      signal,
    },
  );

  if (data.message.next) {
    data.message.next = page + 1;
  }

  return {
    ...data.message,
    messages: data.message.messages.map(fromChatGroupDTO),
  };
};

export const createChatGroup = async (
  http: HttpClient,
  partnerId: number,
): Promise<ApiResponse<{ message: string }>> => {
  if (!partnerId) throw new Error("Missing required parameter: partnerId");

  return await http.post(PATHS.CHAT.CREATE_CHAT_GROUP, { user_id: partnerId });
};

export const markMessageAsUnread = async (
  http: HttpClient,
  chatName: ChatGroupModel["name"],
): Promise<ApiResponse> => {
  if (!chatName) throw new Error("Missing required parameter: chatName");

  return await http.post(PATHS.CHAT.MARK_MESSAGE_AS_UNREAD(chatName));
};

export const listMessages = async (
  http: HttpClient,
  chatName: ChatGroupModel["name"],
  size: number,
  page: number,
  signal: AbortSignal,
): Promise<MessagesPageModel> => {
  if (!chatName) throw new Error("Missing required parameter: chatName");

  const data = await http.get<{ message: MessagesPageDTO }>(
    PATHS.CHAT.LIST_MESSAGES(chatName, size, page),
    {
      signal,
    },
  );

  if (data.message.next) {
    data.message.next = page + 1;
  }

  return {
    ...data.message,
    messages: data.message.messages.map(fromMessageDTO),
  };
};

export const uploadChatImages = async (
  http: HttpClient,
  chatName: ChatGroupModel["name"],
  images: File[],
): Promise<ApiResponse> => {
  if (!chatName) throw new Error("Missing required parameter: chatName");

  const formData = new FormData();

  images.forEach((image) => {
    formData.append("images", image);
  });

  return await http.post(PATHS.CHAT.UPLOAD_CHAT_IMAGES(chatName), formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
