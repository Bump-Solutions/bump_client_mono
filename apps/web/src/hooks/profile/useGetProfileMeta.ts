import { queryKeys } from "@bump/core/queries";

import type { ApiError } from "@bump/core/api";
import type { ProfileMetaModel } from "@bump/core/models";
import { getProfileMeta } from "@bump/core/services";
import { ENUM } from "@bump/utils";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/auth/useAuth";
import { useAuthHttpClient } from "@/http/useHttpClient";

export const useGetProfileMeta = () => {
  const http = useAuthHttpClient();
  const { auth } = useAuth();

  return useQuery<ProfileMetaModel, ApiError>({
    queryKey: queryKeys.profile.meta(),
    queryFn: ({ signal }) => getProfileMeta(http, signal),
    enabled: Boolean(auth?.accessToken),
    refetchOnWindowFocus: false,
    staleTime: ENUM.GLOBALS.staleTime5,
  });
};
