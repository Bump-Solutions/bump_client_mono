import type { ReportType } from "@bump/types";
import { ENUM } from "@bump/utils";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useCallback, useRef } from "react";
import { useMediaQuery } from "react-responsive";
import { useNavigate, useParams } from "react-router";
import { ROUTES } from "@/routes/routes";

import Button from "@/components/Button";
import Drawer from "@/components/Drawer";
import { useBodyScrollLock } from "@/hooks/common/useBodyScrollLock";
import { useFocusTrap } from "@/hooks/common/useFocusTrap";
import ReportForm from "./ReportForm";

const REPORT_TYPES: ReportType[] = ["product", "user"];

const Report = () => {
  const { type, id } = useParams<{ type: ReportType; id: string }>();

  const navigate = useNavigate();
  const isMobile = useMediaQuery({
    query: `(max-width: ${ENUM.MEDIA_MOBILE}px)`,
  });

  const modalRef = useRef<HTMLDivElement | null>(null);
  const close = useCallback(() => navigate(-1), [navigate]);

  useBodyScrollLock(true);
  useFocusTrap(modalRef, { active: !isMobile, onEscape: close });

  if (type === undefined || !REPORT_TYPES.includes(type)) {
    navigate(ROUTES.NOTFOUND, { replace: true });
    return null;
  }

  return (
    <AnimatePresence mode='wait'>
      {isMobile ? (
        <Drawer className='report' close={close}>
          <ReportForm id={id} type={type} />
        </Drawer>
      ) : (
        <motion.section
          className='modal__wrapper'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.2,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}>
          <motion.div
            ref={modalRef}
            role='dialog'
            aria-modal='true'
            className='modal report'>
            <Button
              className={`secondary close`}
              aria-label='Bezárás'
              onClick={close}>
              <X />
            </Button>

            <ReportForm id={id} type={type} />
          </motion.div>
        </motion.section>
      )}
    </AnimatePresence>
  );
};

export default Report;
