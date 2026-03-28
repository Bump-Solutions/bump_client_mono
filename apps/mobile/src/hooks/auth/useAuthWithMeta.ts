import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { getProfileMeta } from "@bump/core/services";
import { useAuth } from "../../context/auth/AuthContext";
import { useAuthHttpClient } from "../../http/useHttpClient";

export const useAuthWithMeta = () => {
  const { auth, meta, setMeta } = useAuth();
  const http = useAuthHttpClient();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchMeta = async () => {
      if (!auth?.accessToken || meta) return;

      setIsLoading(true);
      try {
        const profileMeta = await getProfileMeta(http);
        setMeta(profileMeta);
        // Persist meta
        await SecureStore.setItemAsync("meta", JSON.stringify(profileMeta));
      } catch (e) {
        console.error("Failed to fetch profile meta", e);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeta();
  }, [auth?.accessToken, meta, setMeta, http]);

  return {
    id: auth?.user.id,
    username: auth?.user.username,
    role: auth?.role,

    meta,
    isLoading,
    isError,
  };
};
