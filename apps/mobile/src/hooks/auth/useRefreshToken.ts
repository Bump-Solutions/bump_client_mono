import { API } from "../../utils/api";
import * as SecureStore from "expo-secure-store";
import { fromRefreshResponseDTO } from "@bump/core/mappers";
import type { AuthModel } from "@bump/core/models";
import { useAuth } from "../../context/auth/AuthContext";
import { usePublicHttpClient } from "../../http/useHttpClient";

export const useRefreshToken = (): (() => Promise<string>) => {
  const http = usePublicHttpClient();
  const { setAuth } = useAuth();

  const refresh = async (): Promise<string> => {
    try {
      const refreshToken = await SecureStore.getItemAsync("refreshToken");

      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      // Updated to use the mobile-specific refresh path
      const data = await http.get<{ access_token: string }>(
        API.PATHS.AUTH.MOBILE_REFRESH(refreshToken)
      );

      const authModel: AuthModel = fromRefreshResponseDTO(data.access_token);
      
      setAuth((prev) => {
        const newAuth = prev ? { ...prev, ...authModel } : authModel;
        // Also update stored auth object
        SecureStore.setItemAsync("auth", JSON.stringify(newAuth));
        return newAuth;
      });

      await SecureStore.setItemAsync("accessToken", data.access_token);

      return data.access_token;
    } catch (e) {
      console.error("Refresh token failed", e);
      throw e;
    }
  };

  return refresh;
};
