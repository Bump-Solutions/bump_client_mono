import { createContext } from "react";
import type { ProfileContextValue } from "./types";

export const ProfileContext = createContext<ProfileContextValue | undefined>(
  undefined,
);
