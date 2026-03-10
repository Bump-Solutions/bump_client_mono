import "../../styles/css/profile.css";

import { Outlet } from "react-router";
import { useNavbarTheme } from "../../context/navbartheme/useNavbarTheme";

import ProfileCard from "./card/ProfileCard";
import ProfileBanner from "./ProfileBanner";
import ProfileTabs from "./ProfileTabs";

const Profile = () => {
  useNavbarTheme(false);

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
