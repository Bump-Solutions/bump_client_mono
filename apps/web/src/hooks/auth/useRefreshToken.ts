import { fromRefreshResponseDTO } from "@bump/core/mappers";
import type { AuthModel } from "@bump/core/models";

import axios from "axios";

import { useAuth } from "../../context/auth/useAuth";
import { API } from "../../utils/api";

export const useRefreshToken = (): (() => Promise<string>) => {
  const { setAuth } = useAuth();

  const refresh = async (): Promise<string> => {
    const response = await axios.get(API.PATHS.AUTH.REFRESH, {
      withCredentials: true,
      baseURL: API.BASE_URL,
    });

    const authModel: AuthModel = fromRefreshResponseDTO(
      response.data.access_token,
    );
    setAuth((prev: AuthModel | null) => {
      return prev ? { ...prev, ...authModel } : authModel;
    });

    return response.data.accessToken;
  };

  return refresh;
};
