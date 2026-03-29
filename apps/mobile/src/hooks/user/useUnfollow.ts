import { useState } from "react";
import { unfollow as unfollowService } from "@bump/core/services";
import { useAuthHttpClient } from "../../http/useHttpClient";

export const useUnfollow = () => {
  const http = useAuthHttpClient();
  const [isLoading, setIsLoading] = useState(false);

  const performUnfollow = async (uid: number) => {
    setIsLoading(true);
    try {
      await unfollowService(http, uid);
    } catch (e) {
      console.error("Unfollow error", e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  return { performUnfollow, isLoading };
};
