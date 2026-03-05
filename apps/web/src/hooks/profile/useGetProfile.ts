import type { ProfileModel } from "@bump/core/models";
import { queryKeys } from "@bump/core/queries";
import { getProfile } from "@bump/core/services";
import { ENUM } from "@bump/utils";
import { useQuery } from "@tanstack/react-query";
import { useAuthHttpClient } from "../../http/useHttpClient";

export const useGetProfile = () => {
  const http = useAuthHttpClient();

  return useQuery<ProfileModel, string>({
    queryKey: queryKeys.profile.get(),
    queryFn: ({ signal }) => getProfile(http, signal),
    staleTime: ENUM.GLOBALS.staleTime5,
    retry: 0,
  });
};
