import { useQueryClient } from "@tanstack/react-query";
import type { MouseEvent } from "react";
import { useNavigate } from "react-router";
import { useProfile } from "../../../context/profile/useProfile";
import { useCreateChatGroup } from "../../../hooks/chat/useCreateChatGroup";
import { useFollow } from "../../../hooks/user/useFollow";
import { useUnfollow } from "../../../hooks/user/useUnfollow";
import { ROUTES } from "../../../routes/routes";

import { queryKeys } from "@bump/core/queries";

import Button from "../../../components/Button";
import Tooltip from "../../../components/Tooltip";

import { Bell, Mail, UserPlus, UserX } from "lucide-react";

const UserInteractions = () => {
  const navigate = useNavigate();
  const { user, setUser } = useProfile();

  const queryClient = useQueryClient();

  const followMutation = useFollow(() => {
    setUser({
      ...user,
      following: true,
      followersCount: user.followersCount,
    });

    // Ha bekövetünk valakit, akkor az összes listFollowers és listFollowings-et frissiteni kell
    queryClient.invalidateQueries({
      queryKey: queryKeys.follow.all,
      exact: false,
      refetchType: "all",
    });
  });

  const unfollowMutation = useUnfollow(() => {
    setUser({
      ...user,
      following: false,
      followersCount: user.followersCount,
    });

    // Ha kikövetünk valakit, akkor az összes listFollowers és listFollowings-et frissiteni kell
    queryClient.invalidateQueries({
      queryKey: queryKeys.follow.all,
      exact: false,
      refetchType: "all",
    });
  });

  const createChatGroupMutation = useCreateChatGroup((response) => {
    navigate(ROUTES.INBOX.CHAT(response.data.message), {
      state: {
        partner: {
          id: user.id,
          username: user.username,
          profilePicture: user?.profilePicture,
        },
      },
    });
  });

  const handleFollow = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (followMutation.isPending) return;

    return followMutation.mutateAsync(user?.id);
  };

  const handleUnfollow = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (unfollowMutation.isPending) return;

    return unfollowMutation.mutateAsync(user?.id);
  };

  const handleSendMessage = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (user.chatName) {
      navigate(ROUTES.INBOX.CHAT(user.chatName), {
        state: {
          partner: {
            id: user.id,
            username: user.username,
            profilePicture: user.profilePicture,
          },
        },
      });
    } else {
      if (createChatGroupMutation.isPending) return;

      createChatGroupMutation.mutateAsync(user?.id);
    }
  };

  return (
    <div className='user__interactions '>
      {/* IF FOLLOWING DISPLAY TOOLTIP */}
      <div className='user__interaction--tooltip'>
        <Tooltip content='Értesíts' showDelay={750} placement='top'>
          <Button className='secondary'>
            <Bell />
          </Button>
        </Tooltip>
      </div>

      <div className='user__interaction--follow'>
        {user && user.following ? (
          <Button
            className='secondary red'
            text='Követés leállítása'
            onClick={handleUnfollow}
            loading={unfollowMutation.isPending}>
            <UserX />
          </Button>
        ) : (
          <Button
            className='primary'
            text='Követés'
            onClick={handleFollow}
            loading={followMutation.isPending}>
            <UserPlus />
          </Button>
        )}
      </div>

      <div className='user__interaction--message'>
        <Button
          className='secondary blue'
          text='Üzenet'
          onClick={handleSendMessage}
          loading={createChatGroupMutation.isPending}>
          <Mail />
        </Button>
      </div>
    </div>
  );
};

export default UserInteractions;
