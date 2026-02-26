import { ROUTES } from "../../routes/routes";

import type { AuthModel } from "@bump/core/models";
import { googleLogin } from "@bump/core/services";
import type { ApiError } from "../../types/api";

import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/auth/useAuth";
import { usePublicHttpClient } from "../../http/useHttpClient";

export const useLoginWithGoogle = () => {
  const http = usePublicHttpClient();
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  return useMutation<AuthModel, ApiError, string>({
    mutationFn: (code) => googleLogin(http, code),
    onSuccess: (authModel) => {
      setAuth(authModel);
      navigate(ROUTES.HOME, { replace: true });
    },
    onError: (error) => {
      return Promise.reject(error);
    },
  });
};
