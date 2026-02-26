import { logout } from "@bump/core/services";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "../../context/auth/useAuth";
import { usePublicHttpClient } from "../../http/useHttpClient";

export const useLogout = (): (() => Promise<void>) => {
  const http = usePublicHttpClient();

  const { setAuth } = useAuth();
  const queryClient = useQueryClient();

  const handleLogout = async (): Promise<void> => {
    toast.promise(
      (async () => {
        await logout(http);

        setAuth(null);

        queryClient.clear();
      })(),
      {
        loading: "Kijelentkezés...",
        success: "Kijelentkeztél.",
        error: "Hiba történt a kijelentkezés során.",
      },
    );
  };

  return handleLogout;
};
