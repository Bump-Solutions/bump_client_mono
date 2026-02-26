import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import { toast } from "sonner";

import { useAuth } from "../../context/auth/useAuth";
import { useRefreshToken } from "../../hooks/auth/useRefreshToken";

import axios from "axios";
import Spinner from "../../components/Spinner";

const PersistLogin = () => {
  const [loading, setLoading] = useState<boolean>(true);

  const { auth } = useAuth();
  const refresh = useRefreshToken();

  useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          const msg =
            (error.response?.data as { message?: string } | undefined)
              ?.message ?? "Szerverhiba. Próbáld újra később.";
          toast.error(msg);
        } else {
          toast.error("Szerverhiba. Próbáld újra később.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (!auth?.accessToken) {
      void verifyRefreshToken();
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [auth?.accessToken, refresh, setLoading]);

  return loading ? <Spinner /> : <Outlet />;
};

export default PersistLogin;
