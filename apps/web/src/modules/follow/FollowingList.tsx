import type { FollowingsPageModel } from "@bump/core/models";
import type { PaginatedListProps } from "@bump/types";
import { Fragment, useEffect } from "react";
import { useInView } from "react-intersection-observer";

import Spinner from "../../components/Spinner";
import FollowingListItem from "./FollowingListItem";

const FollowingList = ({
  pages,
  fetchNextPage,
  isFetchingNextPage,
  hasNextPage,
}: PaginatedListProps<FollowingsPageModel>) => {
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView, hasNextPage, isFetchingNextPage]);

  return (
    <>
      <ul className='user__list'>
        {pages.map((page, index) => (
          <Fragment key={index}>
            {page.followings.map((following, idx) => (
              <FollowingListItem key={idx} following={following} />
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

export default FollowingList;
