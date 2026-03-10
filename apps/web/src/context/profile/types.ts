import type { UserModel } from "@bump/core/models";
import type { ReactNode } from "react";

export type ProfileProviderProps = {
  children: ReactNode;
};

export type ProfileContextValue = {
  user: UserModel;
  setUser: (data: Partial<UserModel>) => void;
  isOwnProfile: boolean;
};
