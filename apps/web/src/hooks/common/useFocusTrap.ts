import { useEffect, type RefObject } from "react";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "area[href]",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "button:not([disabled])",
  "iframe",
  "object",
  "embed",
  "[tabindex]:not([tabindex='-1'])",
  "[contenteditable='true']",
].join(",");

type Options = {
  active: boolean;
  onEscape?: () => void;
};

export const useFocusTrap = (
  ref: RefObject<HTMLElement | null>,
  { active, onEscape }: Options,
) => {
  useEffect(() => {
    if (!active) return;

    const container = ref.current;
    if (!container) return;

    const prevActive = document.activeElement as HTMLElement | null;

    const getFocusable = () =>
      Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter(
        (el) => !el.hasAttribute("disabled") && el.offsetParent !== null,
      );

    const first = getFocusable()[0];
    if (first) {
      first.focus();
    } else {
      container.setAttribute("tabindex", "-1");
      container.focus();
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onEscape) {
        e.stopPropagation();
        onEscape();
        return;
      }

      if (e.key !== "Tab") return;

      const focusable = getFocusable();
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }

      const firstEl = focusable[0];
      const lastEl = focusable[focusable.length - 1];
      const current = document.activeElement as HTMLElement | null;

      if (e.shiftKey) {
        if (current === firstEl || !container.contains(current)) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        if (current === lastEl || !container.contains(current)) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (prevActive && typeof prevActive.focus === "function") {
        prevActive.focus();
      }
    };
  }, [active, onEscape, ref]);
};
