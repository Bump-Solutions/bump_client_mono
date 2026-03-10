import type { ApiError } from "@bump/core/api";
import type { FollowingsPageModel, UserModel } from "@bump/core/models";
import { queryKeys } from "@bump/core/queries";
import { listFollowing } from "@bump/core/services";
import { ENUM } from "@bump/utils";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuthHttpClient } from "../../http/useHttpClient";

const MAX_FOLLOWINGS_PER_PAGE = 10;

export const useListFollowings = (uid: UserModel["id"], searchKey: string) => {
  const http = useAuthHttpClient();

  return useInfiniteQuery<FollowingsPageModel, ApiError>({
    queryKey: queryKeys.follow.followingsInfinite(uid, searchKey),
    queryFn: ({ signal, pageParam }) =>
      listFollowing(
        http,
        uid,
        MAX_FOLLOWINGS_PER_PAGE,
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
