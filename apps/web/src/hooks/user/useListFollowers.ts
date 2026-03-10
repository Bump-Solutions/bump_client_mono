import type { ApiError } from "@bump/core/api";
import type { FollowersPageModel, UserModel } from "@bump/core/models";
import { queryKeys } from "@bump/core/queries";
import { listFollowers } from "@bump/core/services";
import { ENUM } from "@bump/utils";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuthHttpClient } from "../../http/useHttpClient";

const MAX_FOLLOWERS_PER_PAGE = 10;

export const useListFollowers = (uid: UserModel["id"], searchKey: string) => {
  const http = useAuthHttpClient();

  return useInfiniteQuery<FollowersPageModel, ApiError>({
    queryKey: queryKeys.follow.followersInfinite(uid, searchKey),
    queryFn: ({ signal, pageParam }) =>
      listFollowers(
        http,
        uid,
        MAX_FOLLOWERS_PER_PAGE,
        pageParam as number,
        searchKey,
        signal,
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next ?? undefined,
    enabled: Boolean(uid),
    staleTime: ENUM.GLOBALS.staleTime5,
  });
};
