import type { FollowerModel, FollowingModel } from "@bump/core/models";
import { useQueryClient } from "@tanstack/react-query";
import type { Dispatch, MouseEvent, SetStateAction } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { useProfile } from "../../context/profile/useProfile";
import { useUnfollow } from "../../hooks/user/useUnfollow";
import { ROUTES } from "../../routes/routes";

import Button from "../../components/Button";
import Image from "../../components/Image";
import Modal from "../../components/Modal";
import StateButton from "../../components/StateButton";

import { queryKeys } from "@bump/core/queries";
import { UserX } from "lucide-react";

type ConfirmUnfollowProps = {
  userToUnfollow: FollowerModel | FollowingModel | null;
  setUserToUnfollow: Dispatch<
    SetStateAction<FollowerModel | FollowingModel | null>
  >;
  isOpen: boolean;
  close: () => void;
};

const ConfirmUnfollow = ({
  userToUnfollow,
  setUserToUnfollow,
  isOpen,
  close,
}: ConfirmUnfollowProps) => {
  const { user, setUser, isOwnProfile } = useProfile();

  const queryClient = useQueryClient();

  const unfollowMutation = useUnfollow(() => {
    // Adott felhasználó (user) követői és követései listáját frissítjük
    queryClient.invalidateQueries({
      queryKey: queryKeys.follow.followers(user.id),
      exact: false,
      refetchType: "all",
    });

    queryClient.invalidateQueries({
      queryKey: queryKeys.follow.followings(user.id),
      exact: false,
      refetchType: "all",
    });

    // A kikövetett felhasználó követőinek listáját is frissítjük
    queryClient.invalidateQueries({
      queryKey: queryKeys.follow.followers(userToUnfollow?.userId ?? 0),
      exact: false,
      refetchType: "all",
    });

    if (isOwnProfile) {
      setUser({ followingsCount: user.followingsCount - 1 });
    }

    setUserToUnfollow(null);
    close();
  });

  const handleUnfollow = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (unfollowMutation.isPending || !userToUnfollow) return;

    const unfollowPromise = unfollowMutation.mutateAsync(userToUnfollow.userId);

    toast.promise(unfollowPromise, {
      loading: "Követés leállítása folyamatban...",
      success: () => (
        <span>
          <Link
            target='_blank'
            className='link fc-green-600 underline fw-700'
            to={
              ROUTES.PROFILE(userToUnfollow.username).ROOT
            }>{`@${userToUnfollow.username}`}</Link>{" "}
          követése leállítva.
        </span>
      ),
      error: (err) =>
        (err?.response?.data?.message as string) ||
        "Hiba a követés leállítása közben.",
    });

    return unfollowPromise;
  };

  return (
    <Modal
      isOpen={isOpen}
      close={close}
      size='xsm'
      className='confirm-unfollow'>
      {userToUnfollow && (
        <>
          <div className='modal__content'>
            <div>
              <Image
                src={userToUnfollow.profilePicture || ""}
                alt={userToUnfollow.username}
              />
            </div>
            <p>
              Biztosan leállítod{" "}
              <b className='fc-blue-500'>@{userToUnfollow.username}</b>{" "}
              követését?
            </p>
          </div>
          <div className='modal__actions'>
            <Button
              className='secondary'
              text='Mégsem'
              disabled={unfollowMutation.isPending}
              onClick={close}
            />
            <StateButton
              className='secondary red'
              text='Igen, leállítom'
              onClick={handleUnfollow}>
              <UserX />
            </StateButton>
          </div>
        </>
      )}
    </Modal>
  );
};

export default ConfirmUnfollow;
