import type { FollowerModel, FollowersPageModel } from "@bump/core/models";
import { queryKeys } from "@bump/core/queries";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import type { MouseEvent } from "react";
import { Link, useOutletContext } from "react-router";
import { useAuth } from "../../context/auth/useAuth";
import { useProfile } from "../../context/profile/useProfile";
import { useDeleteFollower } from "../../hooks/user/useDeleteFollower";
import { useFollow } from "../../hooks/user/useFollow";
import { ROUTES } from "../../routes/routes";

import Button from "../../components/Button";
import Image from "../../components/Image";

type FollowerListItemProps = {
  follower: FollowerModel;
};

interface OutletContextType {
  toggleConfirmUnfollow: () => void;
  setUserToUnfollow: (user: FollowerModel) => void;
}

const FollowerListItem = ({ follower }: FollowerListItemProps) => {
  const { auth } = useAuth();
  const { user, setUser, isOwnProfile } = useProfile();

  const queryClient = useQueryClient();

  const { toggleConfirmUnfollow, setUserToUnfollow } =
    useOutletContext<OutletContextType>();

  const followMutation = useFollow((_response, followerId: number) => {
    // Frissítjük a user-hez tartozó követők listáját (annak a usernek, akinek az oldalán vagyunk)
    queryClient.setQueriesData<InfiniteData<FollowersPageModel>>(
      { queryKey: queryKeys.follow.followers(user.id), exact: false },
      (prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          pages: prev.pages.map((page: FollowersPageModel) => {
            return {
              ...page,
              followers: page.followers.map((follower: FollowerModel) => {
                if (follower.userId === followerId) {
                  return {
                    ...follower,
                    myFollowing: true,
                  };
                }
                return follower;
              }),
            };
          }),
        };
      },
    );

    // A bekövetett user követőinek frissítése, hogy a session user megjelenjen
    queryClient.invalidateQueries({
      queryKey: queryKeys.follow.followers(followerId),
      exact: false,
      refetchType: "all",
    });

    // Frissítjük a követéseket, ha saját profil oldalon vagyunk
    if (isOwnProfile) {
      setUser({
        ...user,
        followingsCount: user.followingsCount + 1,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.follow.followings(user.id),
        exact: false,
        refetchType: "all",
      });
    }
  });

  const deleteFollowerMutation = useDeleteFollower(
    (_response, followerId: number) => {
      queryClient.setQueriesData<InfiniteData<FollowersPageModel>>(
        {
          queryKey: queryKeys.follow.followers(user.id),
          exact: false,
        },
        (prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            pages: prev.pages.map((page: FollowersPageModel) => {
              return {
                ...page,
                followers: page.followers.filter(
                  (follower: FollowerModel) => follower.userId !== followerId,
                ),
              };
            }),
          };
        },
      );

      // Ez mindig csak a saját profil oldalon történik
      setUser({
        ...user,
        followersCount: user.followersCount - 1,
      });

      // A user követéseinek frissítése
      queryClient.invalidateQueries({
        queryKey: queryKeys.follow.followings(followerId),
        exact: false,
        refetchType: "all",
      });
    },
  );

  const handleFollow = (e: MouseEvent<HTMLSpanElement>, followerId: number) => {
    e.preventDefault();

    if (followMutation.isPending) return;

    followMutation.mutateAsync(followerId);
  };

  const handleDeleteFollower = (
    e: MouseEvent<HTMLButtonElement>,
    followerId: number,
  ) => {
    e.preventDefault();

    if (deleteFollowerMutation.isPending) return;

    deleteFollowerMutation.mutateAsync(followerId);
  };

  return (
    <li className='user__list-item'>
      <div className='item__user-info'>
        <Image
          src={follower.profilePicture || ""}
          alt={follower.username.slice(0, 2)}
        />

        <div className='user__text'>
          <Link
            to={ROUTES.PROFILE(follower.username!).ROOT}
            className='username fs-18 link black'>
            {follower.username}
          </Link>

          {/* Ha a session user a sajat oldalan van, es nem koveti */}
          {isOwnProfile && !follower.myFollowing && (
            <span
              onClick={(e) => handleFollow(e, follower.userId)}
              className='link fs-15 ml-0_5'>
              Követés
            </span>
          )}

          <p className='fc-gray-600 fs-14 truncate'>{follower.role}</p>
        </div>

        {/* Gomb: ha saját profilon vagyunk, Eltávolítás */}
        {isOwnProfile ? (
          <Button
            className='secondary red'
            text='Eltávolítás'
            onClick={(e) => handleDeleteFollower(e, follower.userId)}
            loading={deleteFollowerMutation.isPending}
          />
        ) : (
          <>
            {/* Ha nem saját oldalon vagyunk, magunkat nem vesszük figyelembe */}
            {auth?.user?.username !== follower.username && (
              <>
                {/* Egyébként gomb státusz alapján: már követjük? */}
                {follower.myFollowing ? (
                  <Button
                    className='primary'
                    text='Követed'
                    onClick={(e) => {
                      e.preventDefault();
                      setUserToUnfollow(follower);
                      toggleConfirmUnfollow();
                    }}
                  />
                ) : (
                  <Button
                    className='secondary blue'
                    text='Követés'
                    onClick={(e) => handleFollow(e, follower.userId)}
                    loading={followMutation.isPending}
                  />
                )}
              </>
            )}
          </>
        )}
      </div>
    </li>
  );
};

export default FollowerListItem;
