import type {
  MessageGroupModel,
  MessageModel,
  MessagesPageModel,
  UserModel,
} from "@bump/core/models";
import type { PaginatedListProps } from "@bump/types";
import { useCallback, useEffect, useMemo, useState, type JSX } from "react";
import { useInView } from "react-intersection-observer";
import { useLocation } from "react-router";
import { useToggle } from "react-use";
import { useAuth } from "../../../context/auth/useAuth";

import {
  differenceInMinutes,
  formatDate,
  isSameDay,
  startOfDay,
} from "@bump/utils";
import Image from "../../../components/Image";
import Lightbox from "../../../components/Lightbox";
import Spinner from "../../../components/Spinner";
import MessageDateDivider from "./MessageDateDivider";
import MessageListItem from "./MessageListItem";

const GROUP_TIMEOUT = 10; // 10 perc

const groupMessages = (
  messages: MessageModel[],
  me: string | undefined,
  partner: Partial<UserModel> | null,
  openLightbox: (src: string, messageId: number) => void,
): JSX.Element[] => {
  const elements: JSX.Element[] = [];
  let lastDay: Date | null = null;
  let currentGroup: MessageGroupModel | null = null;

  const reversed = [...messages].reverse(); // Feldolgozás: legrégebbitől a legfrissebbig

  for (let i = 0; i < reversed.length; i++) {
    const message = reversed[i];
    const createdAt = new Date(message.createdAt);
    const msgDay = startOfDay(createdAt);
    const isOwn = message.authorUsername === me;
    const timestamp = formatDate(createdAt, "hh:mm");

    // Ha új nap következik, akkor:
    // 1. lezárjuk az aktuális üzenetcsoportot (ha van)
    // 2. beszúrunk egy dátumelválasztót
    if (!lastDay || !isSameDay(msgDay, lastDay)) {
      if (currentGroup) {
        elements.push(renderGroup(currentGroup, i, openLightbox));
        currentGroup = null;
      }

      const detail = i === 0 ? "Beszélgetés létrehozva" : null;
      elements.push(
        <MessageDateDivider
          key={`divider-${i}`}
          date={createdAt}
          detail={detail}
        />,
      );

      lastDay = msgDay;
    }

    // Attachmentek száma
    const attachmentsCount = message.attachment
      ? message.attachment.split(";;").filter((x) => x).length
      : 0;

    // --- bontás: switch a type+attachmentsCount alapján ---
    let splitMessages: MessageModel[] = [];
    switch (true) {
      // csak szöveg
      case message.type === 0 || attachmentsCount === 0:
        splitMessages = [message];
        break;

      // több kép: mindig külön group, text+pics két feldolgozott üzenetben
      case attachmentsCount > 1:
        // flush előző csoport
        if (currentGroup) {
          elements.push(renderGroup(currentGroup, i, openLightbox));
          currentGroup = null;
        }

        if (message.body.trim()) {
          splitMessages.push({ ...message, type: 0, attachment: "" });
        }
        splitMessages.push({ ...message, type: 1, body: "" });

        // és azonnal ki is rendereljük
        elements.push(
          renderGroup(
            {
              author: message.authorUsername,
              partner: isOwn ? null : partner,
              isOwn,
              timestamp,
              messages: splitMessages,
              lastAt: createdAt,
              attachmentsCount,
            },
            i,
            openLightbox,
          ),
        );
        continue;

      // pontosan 1 kép + szöveg
      case message.type === 2 && attachmentsCount === 1:
        if (message.body.trim()) {
          splitMessages.push({ ...message, type: 0, attachment: "" });
        }
        splitMessages.push({ ...message, type: 1, body: "" });
        break;

      // csak kép
      case message.type === 1:
        splitMessages = [message];
        break;
    }

    // Eldöntjük, kell-e új batch/csoport
    const mustBreak =
      !currentGroup || // nincs csoport
      currentGroup.isOwn !== isOwn || // más a szerzője
      differenceInMinutes(currentGroup.lastAt, createdAt) > GROUP_TIMEOUT; // több mint x perc telt el

    if (mustBreak) {
      if (currentGroup) {
        elements.push(renderGroup(currentGroup, i, openLightbox));
      }

      currentGroup = {
        author: message.authorUsername,
        partner: isOwn ? null : partner,
        isOwn,
        timestamp,
        messages: splitMessages,
        lastAt: createdAt,
      };
    } else {
      if (currentGroup) {
        currentGroup.messages.push(...splitMessages);
        currentGroup.lastAt = createdAt;
      }
    }
  }

  // Utolsó üzenetcsoport lezárása, ha maradt feldolgozatlan
  if (currentGroup) {
    elements.push(renderGroup(currentGroup, reversed.length, openLightbox));
  }

  return elements.reverse();
};

const renderGroup = (
  group: MessageGroupModel,
  index: number,
  openLightbox: (src: string, messageId: number) => void,
) => {
  return (
    <div
      key={`group-${group.lastAt.getTime()}-${index}`}
      className={`message__group ${group.isOwn ? "own" : ""}`}>
      {group.partner && (
        <div className='group__avatar'>
          <Image
            src={group.partner.profilePicture || ""}
            alt={group.partner.username?.slice(0, 2)}
          />
        </div>
      )}

      <div className='group__wrapper'>
        <div className='group__header'>
          {!group.isOwn && (
            <span className='fw-700 mr-0_5'>{group.author}</span>
          )}

          {group.attachmentsCount && (
            <span className='mr-0_5'>
              {group.attachmentsCount} képet{" "}
              {group.isOwn ? "küldtél" : "küldött"}
            </span>
          )}

          <span>{group.timestamp}</span>
        </div>

        <div className='group__messages'>
          {group.messages.map((msg, idx) => (
            <MessageListItem
              key={`msg-${msg.id}-${msg.createdAt}-${idx}`}
              message={msg}
              onImageClick={openLightbox}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const MessagesList = ({
  pages,
  fetchNextPage,
  isFetchingNextPage,
  hasNextPage,
}: PaginatedListProps<MessagesPageModel>) => {
  const location = useLocation() as {
    state?: { partner?: Partial<UserModel> };
  };
  const partner = location.state?.partner ?? null;

  const { auth } = useAuth();
  const me = auth?.user?.username;

  // Lightbox state
  const [lightboxOpen, toggleLightbox] = useToggle(false);
  const [lightboxAttachments, setLightboxAttachments] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Infinite scroll
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView, hasNextPage, isFetchingNextPage]);

  // Flatten messages
  const allMessages = useMemo(
    () => pages.flatMap((page) => page.messages),
    [pages],
  );

  // Get all attachments
  const { allAttachments, attachmentIndexes } = useMemo(() => {
    const attachments: string[] = [];
    const indexes: Record<string, number> = {};

    for (const msg of allMessages) {
      if (!msg.attachment) continue;

      const parts = msg.attachment.split(";;").filter(Boolean);
      for (const src of parts) {
        indexes[`${msg.id}-${src}`] = attachments.length;
        attachments.push(src);
      }
    }

    return { allAttachments: attachments, attachmentIndexes: indexes };
  }, [allMessages]);

  const openLightbox = useCallback(
    (src: string, messageId: number) => {
      const key = `${messageId}-${src}`;
      const index = attachmentIndexes[key] ?? 0;
      setLightboxAttachments(allAttachments);
      setCurrentIndex(index);
      toggleLightbox(true);
    },
    [attachmentIndexes, allAttachments, toggleLightbox],
  );

  const groupedElements = useMemo(
    () => groupMessages(allMessages, me, partner, openLightbox),
    [allMessages, me, partner, openLightbox],
  );

  return (
    <div className='messages__list'>
      {groupedElements}

      <div ref={ref}>
        {isFetchingNextPage && (
          <div className='relative py-3'>
            <Spinner />
          </div>
        )}
      </div>

      {lightboxOpen && (
        <Lightbox
          attachments={lightboxAttachments}
          initialIndex={currentIndex}
          onClose={() => toggleLightbox(false)}
        />
      )}
    </div>
  );
};

export default MessagesList;
