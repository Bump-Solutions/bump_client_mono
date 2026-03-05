import type { ProfileModel } from "@bump/core/models";
import type { ReactNode } from "react";

export type PersonalSettingsContextValue = {
  data: ProfileModel | undefined;
  setData: (data: Partial<ProfileModel>) => void;
  isLoading: boolean;
};

export type BasicSettingsProviderProps = {
  children: ReactNode;
};
