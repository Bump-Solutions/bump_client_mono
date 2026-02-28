import type { NotificationsPageModel } from "@bump/core/models";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { useClickAway } from "react-use";
import type { NotificationType } from "../../context/notification/types";
import { useListNotifications } from "../../hooks/notification/useListNotifications";

import Empty from "../../components/Empty";
import Spinner from "../../components/Spinner";
import NotificationMenuList from "./NotificationMenuList";
import NotificationMenuNav from "./NotificationMenuNav";

import { BellOff } from "lucide-react";

type NotificationMenuProps = {
  toggleNotificationMenu: (bool: boolean) => void;
};

const NotificationMenu = ({
  toggleNotificationMenu,
}: NotificationMenuProps) => {
  const [activeTabIndex, setActiveTabIndex] = useState<NotificationType>(1);

  const ref = useRef<HTMLDivElement>(null);

  useClickAway(ref, () => {
    toggleNotificationMenu(false);
  });

  const { data, isLoading, isError } = useListNotifications(activeTabIndex);

  const pages: NotificationsPageModel[] = data?.pages || [];

  const activeUnreadCount = data?.pages?.[0]?.unreadCount ?? 0;

  return (
    <motion.div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.2)",
        zIndex: 100,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.2,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}>
      <motion.div ref={ref} className='notification-menu'>
        <header className='notification-menu__header'>
          <h4 className='fw-600'>Értesítések</h4>
          <button type='button'>Összes megjelölése olvasottként</button>
        </header>

        <NotificationMenuNav
          activeTabIndex={activeTabIndex}
          setActiveTabIndex={setActiveTabIndex}
          activeUnreadCount={activeUnreadCount}
        />

        {isError && (
          <h4 className='fc-red-500 ta-center py-3'>
            Hiba történt az értesítések betöltése közben.
          </h4>
        )}

        {isLoading && (
          <div className='relative py-5'>
            <Spinner />
          </div>
        )}

        {pages.length > 0 && (
          <>
            {pages[0].notifications.length > 0 ? (
              <NotificationMenuList
                pages={pages}
                activeTabIndex={activeTabIndex}
                toggleNotificationMenu={toggleNotificationMenu}
              />
            ) : (
              <Empty
                icon={<BellOff className='svg-32' />}
                title='Nincsenek értesítések'
                description={
                  activeTabIndex === 1
                    ? "Az értesítések itt jelennek meg, amikor valaki kapcsolatba lép veled. Térj vissza később."
                    : "Az értesítések itt jelennek meg, amikor valaki reagál a termékeidre vagy a profilodra. Térj vissza később."
                }
              />
            )}
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default NotificationMenu;
