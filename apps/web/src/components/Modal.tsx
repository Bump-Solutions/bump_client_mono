import { ENUM } from "@bump/utils";

import { AnimatePresence, motion } from "framer-motion";
import { useRef, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";
import { useMediaQuery } from "react-responsive";

import { useBodyScrollLock } from "../hooks/common/useBodyScrollLock";
import { useFocusTrap } from "../hooks/common/useFocusTrap";
import Button from "./Button";

import { X } from "lucide-react";
import { useClickAway } from "react-use";
import Drawer from "./Drawer";

const FADE_TRANSITION = {
  duration: 0.2,
  ease: [0.25, 0.46, 0.45, 0.94],
} as const;

const FADE_INITIAL = { opacity: 0 };
const FADE_ANIMATE = { opacity: 1 };

type ModalContentProps = {
  children: ReactNode;
  close: () => void;
  className?: string;
  size?: "xsm" | "sm" | "md" | "lg";
  dark?: boolean;
  modalRef: RefObject<HTMLDivElement | null>;
};

const ModalContent = ({
  children,
  close,
  className,
  size,
  dark = false,
  modalRef,
}: ModalContentProps) => {
  useFocusTrap(modalRef, { active: true, onEscape: close });

  return createPortal(
    <motion.section
      className={`modal__wrapper ${dark ? "dark" : ""}`}
      initial={FADE_INITIAL}
      animate={FADE_ANIMATE}
      exit={FADE_INITIAL}
      transition={FADE_TRANSITION}>
      <motion.div
        className={`modal ${className ? className : ""} ${size || "sm"}`}
        ref={modalRef}
        role='dialog'
        aria-modal='true'
        initial={FADE_INITIAL}
        animate={FADE_ANIMATE}
        exit={FADE_INITIAL}
        transition={FADE_TRANSITION}>
        {size !== "xsm" && (
          <Button
            className='secondary close'
            aria-label='Bezárás'
            onClick={close}>
            <X />
          </Button>
        )}
        {children}
      </motion.div>
    </motion.section>,
    document.body,
  );
};

type ModalProps = Omit<ModalContentProps, "modalRef"> & {
  isOpen: boolean;
};

const Modal = ({ children, isOpen, close, className, size }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useMediaQuery({
    query: `(max-width: ${ENUM.MEDIA_MOBILE}px)`,
  });

  useClickAway(modalRef, close);

  useBodyScrollLock(isOpen);

  return (
    <AnimatePresence mode='wait'>
      {isOpen &&
        (isMobile ? (
          <Drawer close={close} className={className}>
            {children}
          </Drawer>
        ) : (
          <ModalContent
            children={children}
            close={close}
            className={className}
            size={size}
            modalRef={modalRef}
          />
        ))}
    </AnimatePresence>
  );
};

export default Modal;
