import { logout as logoutService } from "@bump/core/services";
import { useAuth } from "../../context/auth/AuthContext";
import { useAuthHttpClient } from "../../http/useHttpClient";

export const useLogout = () => {
  const { logout: localLogout } = useAuth();
  const http = useAuthHttpClient();

  const performLogout = async () => {
    try {
      // Call backend logout (if it handles it)
      await logoutService(http);
    } catch (e) {
      console.error("Logout service error", e);
    } finally {
      // Always perform local logout
      await localLogout();
    }
  };

  return performLogout;
};
