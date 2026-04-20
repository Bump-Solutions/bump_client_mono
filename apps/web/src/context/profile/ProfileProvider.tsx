import type { UserModel } from "@bump/core/models";
import { queryKeys } from "@bump/core/queries";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, type ReactNode } from "react";
import { Navigate, useParams } from "react-router";
import Spinner from "../../components/Spinner";
import { useGetUser } from "../../hooks/user/useGetUser";
import { ROUTES } from "../../routes/routes";
import { useAuth } from "../auth/useAuth";
import { ProfileContext } from "./context";
import type { ProfileContextValue, ProfileProviderProps } from "./types";

const ProfileProvider = ({ children }: ProfileProviderProps) => {
  const { uname } = useParams();

  if (!uname)
    return (
      <Navigate
        to={ROUTES.NOTFOUND}
        replace
        state={{
          error: {
            code: 404,
            title: "Hibás felhasználónév",
            message: `Sajnáljuk, a megadott felhasználónév nem található. Megeshet, hogy elírás van a felhasználónévben, vagy a felhasználó törölve lett.`,
          },
        }}
      />
    );

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

  const isOwnProfile = auth?.user?.username === uname;

  const setUser = useCallback(
    (data: Partial<UserModel>) => {
      queryClient.setQueryData<UserModel>(queryKeys.user.get(uname), (prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          ...data,
        };
      });
    },
    [queryClient, uname],
  );

  const contextValue = useMemo<ProfileContextValue | undefined>(() => {
    if (!user) return undefined;

    return {
      user,
      setUser,
      isOwnProfile,
    };
  }, [user, setUser, isOwnProfile]);

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

  if (isLoading || !user || !contextValue) {
    return <Spinner />;
  }

  return <ProfileContext value={contextValue}>{children}</ProfileContext>;
};

export default ProfileProvider;
