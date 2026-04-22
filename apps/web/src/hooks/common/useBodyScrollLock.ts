import { useEffect } from "react";

// Ref-counted locks so stacked consumers (modal + context menu, etc.)
// don't clobber each other on unmount.
let overflowCount = 0;
let pointerEventsCount = 0;
let prevOverflow = "";
let prevPointerEvents = "";

const lockOverflow = () => {
  if (overflowCount === 0) {
    prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
  overflowCount++;
};

const unlockOverflow = () => {
  overflowCount = Math.max(0, overflowCount - 1);
  if (overflowCount === 0) {
    document.body.style.overflow = prevOverflow;
  }
};

const lockPointerEvents = () => {
  if (pointerEventsCount === 0) {
    prevPointerEvents = document.body.style.pointerEvents;
    document.body.style.pointerEvents = "none";
  }
  pointerEventsCount++;
};

const unlockPointerEvents = () => {
  pointerEventsCount = Math.max(0, pointerEventsCount - 1);
  if (pointerEventsCount === 0) {
    document.body.style.pointerEvents = prevPointerEvents;
  }
};

type Options = {
  disablePointerEvents?: boolean;
};

export const useBodyScrollLock = (locked: boolean, options?: Options) => {
  const disablePointerEvents = options?.disablePointerEvents ?? false;

  useEffect(() => {
    if (!locked) return;

    lockOverflow();
    if (disablePointerEvents) lockPointerEvents();

    return () => {
      unlockOverflow();
      if (disablePointerEvents) unlockPointerEvents();
    };
  }, [locked, disablePointerEvents]);
};
