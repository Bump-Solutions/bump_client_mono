import { use } from "react";
import { PersonalSettingsContext } from "./context";

export const usePersonalSettings = () => {
  const context = use(PersonalSettingsContext);

  if (!context) {
    throw new Error(
      "usePersonalSettings must be used within a PersonalSettingsProvider",
    );
  }

  return context;
};
