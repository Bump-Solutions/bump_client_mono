import { useAuth } from "../../context/auth/useAuth";

export const useAuthWithMeta = () => {
  const { auth } = useAuth();

  return {};
};
