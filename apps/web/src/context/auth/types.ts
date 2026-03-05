import type { AuthModel } from "@bump/core/models";
import type { Dispatch, ReactNode, SetStateAction } from "react";

export type AuthProviderProps = {
  children: ReactNode;
};

export type AuthContextValue = {
  auth: AuthModel | null;
  setAuth: Dispatch<SetStateAction<AuthModel | null>>;
  didLogout: boolean;
  setDidLogout: Dispatch<SetStateAction<boolean>>;
};
