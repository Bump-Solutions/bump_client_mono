import { logoutMobile } from "@bump/core/services";
import { useAuth } from "../../context/auth/AuthContext";
import { useAuthHttpClient } from "../../http/useHttpClient";
import * as SecureStore from "expo-secure-store";
import { useToast } from "../../context/notification/ToastContext";

export const useLogout = () => {
  const { logout: localLogout } = useAuth();
  const http = useAuthHttpClient();
  const toast = useToast();

  const performLogout = async () => {
    try {
      const refreshToken = await SecureStore.getItemAsync("refreshToken");
      if (refreshToken) {
        await logoutMobile(http, refreshToken);
      }
      toast.success("Kijelentkeztél.");
    } catch (e) {
      console.error("Logout service error", e);
      // Even if API fails, we show local success usually as we clear state anyway
      toast.error("Hiba történt a kijelentkezés során.");
    } finally {
      // Always perform local logout
      await localLogout();
    }
  };

  return performLogout;
};
