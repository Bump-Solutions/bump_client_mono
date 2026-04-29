import {
  motion,
  useAnimate,
  useDragControls,
  useMotionValue,
} from "framer-motion";
import { useRef, type PointerEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import useMeasure from "react-use-measure";

import { useFocusTrap } from "../hooks/common/useFocusTrap";

type DrawerProps = {
  children: ReactNode;
  close: () => void;
  className?: string;
  dragVisible?: boolean;
};

const Drawer = ({
  children,
  close,
  className,
  dragVisible = true,
}: DrawerProps) => {
  const [scope, animate] = useAnimate();
  const [drawerRef, { height }] = useMeasure();
  const contentRef = useRef<HTMLDivElement | null>(null);

  const y = useMotionValue(0);
  const controls = useDragControls();

  const handleClose = async () => {
    animate(scope.current, { opacity: 0 });

    const yStart = typeof y.get() === "number" ? y.get() : 0;

    await animate("#drawer", {
      y: [yStart, height],
    });

    close();
  };

  useFocusTrap(contentRef, { active: true, onEscape: handleClose });

  return createPortal(
    <motion.section
      ref={scope}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      onClick={handleClose}
      className='drawer__wrapper'>
      <motion.div
        id='drawer'
        ref={(el) => {
          drawerRef(el);
          contentRef.current = el;
        }}
        role='dialog'
        aria-modal='true'
        onClick={(e) => e.stopPropagation()}
        initial={{ y: "100%" }}
        animate={{ y: "0%" }}
        exit={{ y: "100%" }}
        transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`drawer ${className || ""}`}
        style={{ y }}
        drag='y'
        dragControls={controls}
        onDragEnd={() => {
          if (y.get() > 100) {
            handleClose();
          }
        }}
        dragListener={false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.5 }}>
        {dragVisible && (
          <div className='drawer__dragger'>
            <button
              type='button'
              aria-label='Húzd lefelé a bezáráshoz'
              title='Húzd lefelé a bezáráshoz'
              onPointerDown={(e: PointerEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                controls.start(e);
              }}></button>
          </div>
        )}

        <div className='drawer__content'>{children}</div>
      </motion.div>
    </motion.section>,
    document.body,
  );
};

export default Drawer;
