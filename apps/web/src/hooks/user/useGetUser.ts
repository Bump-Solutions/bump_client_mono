import type { ApiError } from "@bump/core/api";
import type { UserModel } from "@bump/core/models";
import { queryKeys } from "@bump/core/queries";
import { getUser } from "@bump/core/services";
import { ENUM } from "@bump/utils";
import { useQuery } from "@tanstack/react-query";
import { useAuthHttpClient } from "../../http/useHttpClient";

export const useGetUser = (username: UserModel["username"]) => {
  const http = useAuthHttpClient();

  return useQuery<UserModel, ApiError>({
    queryKey: queryKeys.user.get(username),
    queryFn: ({ signal }) => getUser(http, username, signal),
    staleTime: ENUM.GLOBALS.staleTime5,
    retry: 1,
  });
};
