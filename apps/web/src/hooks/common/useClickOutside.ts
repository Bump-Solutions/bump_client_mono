import { type RefObject, useEffect } from "react";

type UseClickOutsideProps = {
  ref: RefObject<HTMLElement | null>;
  callback: () => void;
  ignoreRefs?: RefObject<HTMLElement | null>[];
};

export const useClickOutside = ({
  ref,
  callback,
  ignoreRefs = [],
}: UseClickOutsideProps) => {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node;

      // Check if the click is outside the `ref` and not on any `ignoreRefs`
      if (
        ref.current &&
        !ref.current.contains(target) &&
        !ignoreRefs.some((ignoreRef) => ignoreRef.current?.contains(target))
      ) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [ref, callback, ignoreRefs]);
};
