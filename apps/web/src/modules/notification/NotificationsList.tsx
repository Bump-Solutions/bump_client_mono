import type { NotificationsPageModel } from "@bump/core/models";
import type { PaginatedListProps } from "@bump/types";
import { Fragment, useEffect } from "react";
import { useInView } from "react-intersection-observer";

import Spinner from "../../components/Spinner";
import NotificationsListItem from "./NotificationsListItem";

const NotificationsList = ({
  pages,
  fetchNextPage,
  isFetchingNextPage,
}: PaginatedListProps<NotificationsPageModel>) => {
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView, isFetchingNextPage]);

  return (
    <>
      <ul className='notifications__list'>
        {pages.map((page, index) => (
          <Fragment key={index}>
            {page.notifications.map((notification, idx) => (
              <NotificationsListItem key={idx} notification={notification} />
            ))}
          </Fragment>
        ))}
      </ul>

      <div ref={ref}>
        {isFetchingNextPage && (
          <div className='relative py-3'>
            <Spinner />
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationsList;
