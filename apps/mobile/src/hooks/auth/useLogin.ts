import { useState } from "react";
import * as SecureStore from "expo-secure-store";
import type { LoginRequestDTO } from "@bump/core/dtos";
import type { AuthModel } from "@bump/core/models";
import { loginMobile } from "@bump/core/services";
import { useAuth } from "../../context/auth/AuthContext";
import { usePublicHttpClient } from "../../http/useHttpClient";
import { useToast } from "../../context/notification/ToastContext";

export const useLogin = () => {
  const http = usePublicHttpClient();
  const { setAuth } = useAuth();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performLogin = async (payload: LoginRequestDTO) => {
    setIsLoading(true);
    setError(null);
    try {
      const authModel: AuthModel = await loginMobile(http, payload);
      
      // Persist auth state
      if (authModel.accessToken) {
        await SecureStore.setItemAsync("accessToken", authModel.accessToken);
      }
      if (authModel.refreshToken) {
        await SecureStore.setItemAsync("refreshToken", authModel.refreshToken);
      }
      
      await SecureStore.setItemAsync("auth", JSON.stringify(authModel));

      setAuth(authModel);
      toast.success("Bejelentkeztél.");
      return authModel;
    } catch (e: any) {
      const message = e?.response?.data?.message || "Hiba a bejelentkezés során.";
      setError(message);
      toast.error(message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  return { performLogin, isLoading, error };
};
