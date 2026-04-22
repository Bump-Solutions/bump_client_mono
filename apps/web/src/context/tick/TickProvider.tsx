import { useEffect, useState } from "react";
import { useHarmonicIntervalFn } from "react-use";
import { TickContext } from "./context";
import type { TickProviderProps } from "./types";

// Shared tick so consumers don't each run their own setInterval.
// Emits Date.now() at `intervalMs` cadence while the tab is visible.

export const TickProvider = ({
  children,
  intervalMs = 1000,
}: TickProviderProps) => {
  const [now, setNow] = useState(() => Date.now());
  const [visible, setVisible] = useState(
    () =>
      typeof document === "undefined" || document.visibilityState === "visible",
  );

  useEffect(() => {
    if (typeof document === "undefined") return;
    const onChange = () => {
      const isVisible = document.visibilityState === "visible";
      setVisible(isVisible);
      if (isVisible) setNow(Date.now());
    };
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
  }, []);

  useHarmonicIntervalFn(() => setNow(Date.now()), visible ? intervalMs : null);

  return <TickContext value={now}>{children}</TickContext>;
};
