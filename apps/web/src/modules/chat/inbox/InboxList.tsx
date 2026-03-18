import type { InboxModel } from "@bump/core/models";
import type { PaginatedListProps } from "@bump/types";
import { Fragment, useEffect } from "react";
import { useInView } from "react-intersection-observer";

import Spinner from "../../../components/Spinner";
import InboxListItem from "./InboxListItem";

const InboxList = ({
  pages,
  fetchNextPage,
  isFetchingNextPage,
  hasNextPage,
}: PaginatedListProps<InboxModel>) => {
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView, hasNextPage, isFetchingNextPage]);

  return (
    <>
      <ul className='inbox__list'>
        {pages.map((page, index) => (
          <Fragment key={index}>
            {page.messages.map((group, idx) => (
              <InboxListItem key={idx} group={group} />
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

export default InboxList;
