import type { Dispatch, ReactNode, SetStateAction } from "react";

export type AuthProviderProps = {
  children: ReactNode;
};

export type AuthContextValue = {
  auth: boolean | null; // TODO: replace with actual auth model
  setAuth: Dispatch<SetStateAction<boolean | null>>;
};
