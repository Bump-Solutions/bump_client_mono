import "../../styles/css/navbar.css";

import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { useToggle } from "react-use";
import { useNavbarTheme } from "../../context/navbartheme/useNavbarTheme";

import NotificationMenu from "../notification/NotificationMenu";
import NavMenu from "./NavMenu";
import NavMenuMobile from "./NavMenuMobile";
import NavProfileMenu from "./NavProfileMenu";
import NavSearch from "./NavSearch";
import ProfileMenuActions from "./ProfileMenuActions";

const Navbar = () => {
  const { isSolid } = useNavbarTheme();

  const [isProfileMenuOpen, toggleProfileMenu] = useToggle(false);
  const [isNotificationMenuOpen, toggleNotificationMenu] = useToggle(false);

  useEffect(() => {
    document.body.style.overflow =
      isProfileMenuOpen || isNotificationMenuOpen ? "hidden" : "auto";
    // document.body.style.pointerEvents = isProfileMenuOpen || isNotificationMenuOpen ? 'none' : 'auto';

    return () => {
      document.body.style.overflow = "auto";
      // document.body.style.pointerEvents = 'auto';
    };
  }, [isProfileMenuOpen, isNotificationMenuOpen]);

  return (
    <>
      <nav className={`navbar ${isSolid ? "solid" : ""}`}>
        <NavMenuMobile />
        <NavMenu />
        <NavSearch />
        <NavProfileMenu
          toggleNotificationMenu={toggleNotificationMenu}
          toggleProfileMenu={toggleProfileMenu}
        />

        <AnimatePresence mode='wait'>
          {isNotificationMenuOpen && (
            <NotificationMenu toggleNotificationMenu={toggleNotificationMenu} />
          )}
        </AnimatePresence>

        <AnimatePresence mode='wait'>
          {isProfileMenuOpen && (
            <ProfileMenuActions toggleProfileMenu={toggleProfileMenu} />
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Navbar;
