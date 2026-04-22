import "@/styles/css/follow.css";

import type { FollowerModel, FollowingModel } from "@bump/core/models";
import { ENUM } from "@bump/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { NavLink, Outlet, useNavigate } from "react-router";
import { useToggle } from "react-use";
import { useProfile } from "@/context/profile/useProfile";
import { useBodyScrollLock } from "@/hooks/common/useBodyScrollLock";
import { useFocusTrap } from "@/hooks/common/useFocusTrap";
import { ROUTES } from "@/routes/routes";

import Button from "@/components/Button";
import Drawer from "@/components/Drawer";
import ConfirmUnfollow from "./ConfirmUnfollow";

import { X } from "lucide-react";

type FollowProps = {
  background: Location;
};

const Follow = ({ background }: FollowProps) => {
  const isMobile = useMediaQuery({
    query: `(max-width: ${ENUM.MEDIA_MOBILE}px)`,
  });
  const navigate = useNavigate();

  const { user } = useProfile();

  const [userToUnfollow, setUserToUnfollow] = useState<
    FollowerModel | FollowingModel | null
  >(null);
  const [confirmUnfollow, toggleConfirmUnfollow] = useToggle(false);

  const modalRef = useRef<HTMLDivElement | null>(null);
  const close = useCallback(
    () => navigate(background.pathname),
    [navigate, background.pathname],
  );

  useBodyScrollLock(true);
  useFocusTrap(modalRef, { active: !isMobile, onEscape: close });

  return (
    <>
      <AnimatePresence mode='wait'>
        {isMobile ? (
          <Drawer close={close} className='follow'>
            <h1 className='modal__title'>
              <NavLink
                to={ROUTES.PROFILE(user.username).FOLLOWERS}
                state={{ background: background }}
                className='link black'>
                Követők
              </NavLink>
              <NavLink
                to={ROUTES.PROFILE(user.username).FOLLOWINGS}
                state={{ background: background }}
                className='link black'>
                Követések
              </NavLink>
            </h1>

            <Outlet context={{ toggleConfirmUnfollow, setUserToUnfollow }} />
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
              className='modal follow'>
              <Button
                className={`secondary close`}
                aria-label='Bezárás'
                onClick={close}>
                <X />
              </Button>

              <h1 className='modal__title'>
                <NavLink
                  to={ROUTES.PROFILE(user.username).FOLLOWERS}
                  state={{ background: background }}
                  className='link black mr-2'>
                  Követők
                </NavLink>
                <NavLink
                  to={ROUTES.PROFILE(user.username).FOLLOWINGS}
                  state={{ background: background }}
                  className='link black'>
                  Követések
                </NavLink>
              </h1>

              <Outlet context={{ toggleConfirmUnfollow, setUserToUnfollow }} />
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>

      <ConfirmUnfollow
        userToUnfollow={userToUnfollow}
        setUserToUnfollow={setUserToUnfollow}
        isOpen={confirmUnfollow}
        close={toggleConfirmUnfollow}
      />
    </>
  );
};

export default Follow;
