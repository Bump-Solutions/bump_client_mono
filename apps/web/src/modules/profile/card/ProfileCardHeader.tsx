import Image from "../../../components/Image";
import { useProfile } from "../../../context/profile/useProfile";
import UserDetails from "./UserDetails";

const ProfileCardHeader = () => {
  const { user } = useProfile();

  return (
    <div className='profile__card__header'>
      <div className='avatar__wrapper'>
        <Image
          src={user.profilePicture ?? undefined}
          alt={user.username.slice(0, 2)}
        />
      </div>

      <h1>{user.username}</h1>

      {/* TODO: BADGES, BIO, ETC */}

      <UserDetails />
    </div>
  );
};

export default ProfileCardHeader;
