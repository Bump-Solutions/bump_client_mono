import type { ProfileModel } from "@bump/core/models";
import { queryKeys } from "@bump/core/queries";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { Navigate } from "react-router";
import { useGetProfile } from "../../hooks/profile/useGetProfile";
import { ROUTES } from "../../routes/routes";
import { PersonalSettingsContext } from "./context";
import type {
  BasicSettingsProviderProps,
  PersonalSettingsContextValue,
} from "./types";

const PersonalSettingsProvider = ({ children }: BasicSettingsProviderProps) => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useGetProfile();

  const setData = useCallback(
    (data: Partial<ProfileModel>) => {
      queryClient.setQueryData(
        queryKeys.profile.get(),
        (prev: ProfileModel | undefined) => ({
          ...prev,
          ...data,
        }),
      );
    },
    [queryClient],
  );

  const contextValue = useMemo<PersonalSettingsContextValue>(
    () => ({
      data,
      setData,
      isLoading,
    }),
    [data, setData, isLoading],
  );

  if (isError) {
    return (
      <Navigate
        to={ROUTES.NOTFOUND}
        replace
        state={{
          error: {
            code: 500,
            title: "Hiba a profil betöltése során",
            message:
              "Nem sikerült betölteni a profilodat. Kérjük, próbáld meg később újra.",
          },
        }}
      />
    );
  }

  return (
    <PersonalSettingsContext value={contextValue}>
      {children}
    </PersonalSettingsContext>
  );
};

export default PersonalSettingsProvider;
