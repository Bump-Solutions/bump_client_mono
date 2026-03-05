import { API } from "../../utils/api";

import { fromRefreshResponseDTO } from "@bump/core/mappers";
import type { AuthModel } from "@bump/core/models";
import { useAuth } from "../../context/auth/useAuth";
import { usePublicHttpClient } from "../../http/useHttpClient";

export const useRefreshToken = (): (() => Promise<string>) => {
  const http = usePublicHttpClient();
  const { setAuth, setDidLogout } = useAuth();

  const refresh = async (): Promise<string> => {
    const data = await http.get<{ access_token: string }>(
      API.PATHS.AUTH.REFRESH,
      {
        withCredentials: true,
      },
    );

    const authModel: AuthModel = fromRefreshResponseDTO(data.access_token);
    setAuth((prev: AuthModel | null) => {
      return prev ? { ...prev, ...authModel } : authModel;
    });
    setDidLogout(false);

    return data.access_token;
  };

  return refresh;
};
