import "../../styles/css/profile.css";

import { Outlet } from "react-router";
import { useNavbarTheme } from "../../context/navbartheme/useNavbarTheme";
import { useProfile } from "../../context/profile/useProfile";

import Spinner from "../../components/Spinner";
import ProfileCard from "./card/ProfileCard";
import ProfileBanner from "./ProfileBanner";
import ProfileTabs from "./ProfileTabs";

const Profile = () => {
  const { isLoading } = useProfile();

  useNavbarTheme(isLoading ? true : false);

  return isLoading ? (
    <Spinner />
  ) : (
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
