import "../../styles/css/profile.css";

import { Outlet } from "react-router";
import { useNavbarTheme } from "../../context/navbartheme/useNavbarTheme";

import { useEffect } from "react";
import ProfileCard from "./card/ProfileCard";
import ProfileBanner from "./ProfileBanner";
import ProfileTabs from "./ProfileTabs";

const Profile = () => {
  const { setIsSolid } = useNavbarTheme(false);

  useEffect(() => {
    return () => {
      setIsSolid(true);
    };
  }, [setIsSolid]);

  return (
    <section className='profile'>
      <ProfileBanner />
      <div className='profile__wrapper'>
        <ProfileCard />
        <div className='profile__content'>
          <ProfileTabs />
          <Outlet />
        </div>
      </div>
    </section>
  );
};

export default Profile;
