import type { FollowersPageModel } from "@bump/core/models";
import type { PaginatedListProps } from "@bump/types";
import { Fragment, useEffect } from "react";
import { useInView } from "react-intersection-observer";

import Spinner from "../../components/Spinner";
import FollowerListItem from "./FollowerListItem";

const FollowerList = ({
  pages,
  fetchNextPage,
  isFetchingNextPage,
}: PaginatedListProps<FollowersPageModel>) => {
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView, isFetchingNextPage]);

  return (
    <>
      <ul className='user__list'>
        {pages.map((page, index) => (
          <Fragment key={index}>
            {page.followers.map((follower, idx) => (
              <FollowerListItem key={idx} follower={follower} />
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

export default FollowerList;
