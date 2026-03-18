import type { MessagesPageModel } from "@bump/core/models";
import { useLocation } from "react-router";
import { useListMessages } from "../../../hooks/chat/useListMessages";

import { useMemo } from "react";
import Spinner from "../../../components/Spinner";
import MessageDateDivider from "./MessageDateDivider";
import MessagesList from "./MessagesList";

type MessagesContentProps = {
  chat: string;
};

const MessagesContent = ({ chat }: MessagesContentProps) => {
  const location = useLocation();

  const createdAt = useMemo(() => {
    const raw = location.state?.createdAt;
    const d = raw ? new Date(raw) : new Date();
    return Number.isNaN(d.getTime()) ? new Date() : d;
  }, [location.state?.createdAt]);

  const {
    isLoading,
    isFetchingNextPage,
    isError,
    fetchNextPage,
    hasNextPage,
    data,
  } = useListMessages(chat);

  const pages: MessagesPageModel[] = data?.pages || [];

  if (isError) {
    return (
      <div className='abs-center'>
        <h4 className='fc-red-500 ta-center '>
          Hiba történt az üzenetek betöltése közben.
        </h4>
      </div>
    );
  }

  if (isLoading) {
    return <Spinner />;
  }

  return (
    pages.length > 0 && (
      <>
        {pages[0].messages.length > 0 ? (
          <MessagesList
            pages={pages}
            fetchNextPage={fetchNextPage}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
          />
        ) : (
          <div className='messages__list'>
            <MessageDateDivider
              date={createdAt}
              detail='Beszélgetés létrehozva'
            />
          </div>
        )}
      </>
    )
  );
};

export default MessagesContent;
