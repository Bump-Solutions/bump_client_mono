import { useState } from "react";
import { follow as followService } from "@bump/core/services";
import { useAuthHttpClient } from "../../http/useHttpClient";

export const useFollow = () => {
  const http = useAuthHttpClient();
  const [isLoading, setIsLoading] = useState(false);

  const performFollow = async (uid: number) => {
    setIsLoading(true);
    try {
      await followService(http, uid);
    } catch (e) {
      console.error("Follow error", e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  return { performFollow, isLoading };
};
