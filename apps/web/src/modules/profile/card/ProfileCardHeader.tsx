import { useProfile } from "../../../context/profile/useProfile";

import Image from "../../../components/Image";
import UserDetails from "./UserDetails";

const ProfileCardHeader = () => {
  const { user, isOwnProfile } = useProfile();

  return (
    <div className='profile__card__header'>
      <div className='avatar__wrapper'>
        <Image
          src={user.profilePicture ?? undefined}
          alt={user.username.slice(0, 2)}
        />
      </div>

      <h1>{user.username + (isOwnProfile ? " (Te)" : "")}</h1>

      {/* TODO: BADGES, BIO, ETC */}

      <UserDetails />
    </div>
  );
};

export default ProfileCardHeader;
