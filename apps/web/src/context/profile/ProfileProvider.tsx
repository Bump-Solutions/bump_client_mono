import type { UserModel } from "@bump/core/models";
import { queryKeys } from "@bump/core/queries";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, type ReactNode } from "react";
import { Navigate, useParams } from "react-router";
import { useGetUser } from "../../hooks/user/useGetUser";
import { ROUTES } from "../../routes/routes";
import { useAuth } from "../auth/useAuth";
import { ProfileContext } from "./context";
import type { ProfileContextValue, ProfileProviderProps } from "./types";

const ProfileProvider = ({ children }: ProfileProviderProps) => {
  const { uname } = useParams();

  if (!uname) return null; // or <NotFound />

  return <ProfileProviderInner uname={uname}>{children}</ProfileProviderInner>;
};

const ProfileProviderInner = ({
  uname,
  children,
}: {
  uname: string;
  children: ReactNode;
}) => {
  const { auth } = useAuth();
  const queryClient = useQueryClient();

  const { data: user, isLoading, isError } = useGetUser(uname);

  const setUser = useCallback(
    (data: Partial<UserModel>) => {
      queryClient.setQueryData(
        queryKeys.user.get(uname),
        (prev: UserModel | undefined) => ({
          ...prev,
          ...data,
        }),
      );
    },
    [queryClient, uname],
  );

  const isOwnProfile = auth?.user?.username === uname;

  const contextValue = useMemo<ProfileContextValue>(
    () => ({
      user,
      setUser,
      isOwnProfile,
      isLoading,
    }),
    [user, setUser, isOwnProfile, isLoading],
  );

  if (isError) {
    return (
      <Navigate
        to={ROUTES.NOTFOUND}
        replace
        state={{
          error: {
            code: 404,
            title: "Hibás felhasználónév",
            message: `Sajnáljuk, a(z) "${uname}" nevű felhasználó nem található. Megeshet, hogy elírás van a felhasználónévben, vagy a felhasználó törölve lett.`,
          },
        }}
      />
    );
  }

  return <ProfileContext value={contextValue}>{children}</ProfileContext>;
};

export default ProfileProvider;
