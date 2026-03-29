import { useState, useEffect } from "react";
import { getUser as getUserService } from "@bump/core/services";
import { useAuthHttpClient } from "../../http/useHttpClient";
import type { UserModel } from "@bump/core/models";
import type { ApiError } from "@bump/core/api";

export const useGetUser = (username?: string) => {
  const http = useAuthHttpClient();
  const [user, setUser] = useState<UserModel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchUser = async () => {
    if (!username) return;
    setIsLoading(true);
    try {
      const data = await getUserService(http, username);
      setUser(data);
    } catch (e: any) {
      setError(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [username, http]);

  return { user, setUser, isLoading, error, refetch: fetchUser };
};
