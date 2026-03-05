import { use } from "react";
import { ProfileContext } from "./context";

export const useProfile = () => {
  const context = use(ProfileContext);

  if (!context) {
    throw new Error("useProfile must be used within an ProfileProvider");
  }

  return context;
};
