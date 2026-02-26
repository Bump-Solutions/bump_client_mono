import { useAuth } from "../../context/auth/useAuth";
import { useGetProfileMeta } from "../profile/useGetProfileMeta";

export const useAuthWithMeta = () => {
  const { auth } = useAuth();
  const metaQuery = useGetProfileMeta();

  return {
    id: auth?.user.id,
    username: auth?.user.username,
    role: auth?.role,

    meta: metaQuery.data,
    isLoading: metaQuery.isLoading,
    isError: metaQuery.isError,
    error: metaQuery.error,
  };
};
