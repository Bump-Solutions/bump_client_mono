import { useMounted } from "@bump/hooks";
import { useCallback } from "react";

export const useDelayedClose = (cb: () => void, delayMs = 500) => {
  const isMounted = useMounted();

  return useCallback(() => {
    setTimeout(() => {
      if (isMounted()) cb();
    }, delayMs);
  }, [cb, delayMs, isMounted]);
};
