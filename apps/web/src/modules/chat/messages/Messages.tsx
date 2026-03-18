import type { MessageDTO } from "@bump/core/dtos";
import { fromMessageDTO } from "@bump/core/mappers";
import type {
  ChatGroupModel,
  InboxModel,
  LastMessageModel,
  MessageModel,
  MessagesPageModel,
} from "@bump/core/models";
import { queryKeys } from "@bump/core/queries";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { useOutletContext } from "react-router";
import useWebSocket from "react-use-websocket";
import { useAuth } from "../../../context/auth/useAuth";
import { API } from "../../../utils/api";

import MessagesContent from "./MessagesContent";
import MessagesFooter from "./MessagesFooter";
import MessagesHeader from "./MessagesHeader";

interface OutletContextType {
  chat: string;
}

// HELPERS
const markChatReadInInbox = (
  prev: InfiniteData<InboxModel> | undefined,
  chat: string,
) => {
  if (!prev) return prev;

  return {
    ...prev,
    pages: prev.pages.map((page) => ({
      ...page,
      messages: page.messages.map((group: ChatGroupModel) => {
        if (group.name !== chat) return group;

        const last = group.lastMessage;
        if (!last || last.isRead || last.ownMessage) return group;

        return {
          ...group,
          lastMessage: {
            ...last,
            isRead: true,
          },
        };
      }),
    })),
  };
};

const pushMessageToChat = (
  prev: InfiniteData<MessagesPageModel> | undefined,
  msg: MessageModel,
) => {
  if (!prev) return prev;

  return {
    ...prev,
    pages: [
      {
        ...prev.pages[0],
        messages: [msg, ...prev.pages[0].messages],
      },
      ...prev.pages.slice(1),
    ],
  };
};

const updateInboxLastMessage = (
  prev: InfiniteData<InboxModel> | undefined,
  chat: string,
  msg: MessageModel,
  isOwn: boolean,
) => {
  if (!prev) return prev;

  return {
    ...prev,
    pages: prev.pages.map((page) => ({
      ...page,
      messages: page.messages.map((group: ChatGroupModel) => {
        if (group.name !== chat) return group;

        const nextLast: LastMessageModel = {
          attachment: msg.attachment,
          type: msg.type,

          id: msg.id,
          authorUsername: msg.authorUsername,
          body: msg.body,
          createdAt: msg.createdAt,

          isRead: isOwn,
          ownMessage: isOwn,
        };

        return {
          ...group,
          lastMessage: nextLast,
        };
      }),
    })),
  };
};

const Messages = () => {
  const { chat } = useOutletContext<OutletContextType>();
  const { auth } = useAuth();

  const queryClient = useQueryClient();

  const token = auth?.accessToken ?? "";

  // Force reconnect when token changes by changing the URL
  const socketUrl = useMemo(() => {
    if (!chat || !token) return null;
    return `${API.WS_BASE_URL}/chat/${chat}/?token=${encodeURIComponent(token)}`;
  }, [chat, token]);

  const onOpen = useCallback(() => {
    // mark read immediately when opening the chat
    queryClient.setQueriesData<InfiniteData<InboxModel>>(
      {
        queryKey: queryKeys.chat.groups(""),
        exact: false,
      },
      (prev) => markChatReadInInbox(prev, chat),
    );
  }, [queryClient, chat]);

  const onMessage = useCallback(
    (event: MessageEvent) => {
      let dto: MessageDTO;
      try {
        dto = JSON.parse(event.data) as MessageDTO;
      } catch {
        return; // ignore non-JSON frames
      }

      const msg = fromMessageDTO(dto);
      const isOwn = auth?.user.username === msg.authorUsername;

      // Update messages for this chat
      queryClient.setQueryData<InfiniteData<MessagesPageModel>>(
        queryKeys.chat.messages(chat),
        (prev) => pushMessageToChat(prev, msg),
      );

      // Update inbox “lastMessage” for this chat (all searchKey variants)
      queryClient.setQueriesData<InfiniteData<InboxModel>>(
        {
          queryKey: queryKeys.chat.groups(""),
          exact: false,
        },
        (prev) => updateInboxLastMessage(prev, chat, msg, isOwn),
      );
    },
    [auth?.user.username, queryClient, chat],
  );

  const { sendJsonMessage } = useWebSocket(
    socketUrl,
    {
      share: false,
      shouldReconnect: () => Boolean(token),
      reconnectAttempts: 10,
      reconnectInterval: 2000,
      retryOnError: true,

      onOpen,
      onMessage,
      // onClose: (e) => console.log("WS closed", e.code, e.reason),
      // onError: (e) => console.log("WS error", e),
    },
    Boolean(socketUrl && token), // only connect when we have a URL and token
  );

  return (
    <div className='messages__panel'>
      <MessagesHeader />
      <div className='messages__content'>
        <MessagesContent chat={chat} />
      </div>
      <MessagesFooter chat={chat} onSend={sendJsonMessage} />
    </div>
  );
};

export default Messages;
