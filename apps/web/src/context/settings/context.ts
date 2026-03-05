import { createContext } from "react";
import type { PersonalSettingsContextValue } from "./types";

export const PersonalSettingsContext = createContext<
  PersonalSettingsContextValue | undefined
>(undefined);
