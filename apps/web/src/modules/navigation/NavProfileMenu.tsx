import { NavLink, useNavigate } from "react-router";
import { toast } from "sonner";
import { useAuthWithMeta } from "../../hooks/auth/useAuthWithMeta";
import { ROUTES } from "../../routes/routes";

import Image from "../../components/Image";
import Tooltip from "../../components/Tooltip";

import { ArrowUpRight, Bell, ShoppingBag } from "lucide-react";

type NavProfileMenuProps = {
  toggleNotificationMenu: (bool: boolean) => void;
  toggleProfileMenu: (bool: boolean) => void;
};

const NavProfileMenu = ({
  toggleNotificationMenu,
  toggleProfileMenu,
}: NavProfileMenuProps) => {
  const navigate = useNavigate();

  const { username, meta, isError, error } = useAuthWithMeta();
  // const { itemsCount } = useCart();
  const itemsCount = 10;

  if (isError) {
    toast.error(
      `Hiba a profil betöltése közben: ${error?.message || "Ismeretlen hiba"}`,
    );
    return null;
  }

  return (
    <div className='navbar__profile-menu'>
      <div className='profile-menu__wrapper'>
        <div className='profile-menu__item '>
          <NavLink
            to={ROUTES.PROFILE(username!).SAVED}
            className='link black fw-600'>
            Mentett
          </NavLink>
        </div>

        <div className='profile-menu__item '>
          <NavLink to='' className='link no-anim icon--reverse fw-600'>
            <ArrowUpRight />
            <span>Pro</span>
          </NavLink>
        </div>

        <Tooltip content='Értesítések' showDelay={250} placement='bottom'>
          <div className='profile-menu__item no-hide '>
            <div onClick={() => toggleNotificationMenu(true)}>
              {!!meta?.unreadNotifications && meta.unreadNotifications > 0 && (
                <span className='badge fw-600'>
                  {meta.unreadNotifications > 99
                    ? "99+"
                    : meta.unreadNotifications}
                </span>
              )}
              <Bell />
            </div>
          </div>
        </Tooltip>

        <Tooltip content='Kosár' showDelay={250} placement='bottom'>
          <div className='profile-menu__item no-hide'>
            <div onClick={() => navigate(ROUTES.CART)}>
              {itemsCount > 0 && (
                <span className='badge fw-600'>
                  {itemsCount > 99 ? "99+" : itemsCount}
                </span>
              )}

              <ShoppingBag />
            </div>
          </div>
        </Tooltip>

        <Tooltip content='Profil' showDelay={250} placement='bottom'>
          <button
            type='button'
            onClick={() => toggleProfileMenu(true)}
            aria-label='Profil'>
            <Image src={meta?.profilePicture} alt={username?.slice(0, 2)} />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default NavProfileMenu;
