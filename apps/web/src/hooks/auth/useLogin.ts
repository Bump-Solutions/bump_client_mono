import { ROUTES } from "../../routes/routes";

import type { ApiError } from "@bump/core/api";
import type { LoginRequestDTO } from "@bump/core/dtos";
import type { AuthModel } from "@bump/core/models";
import { login } from "@bump/core/services";

import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/auth/useAuth";
import { usePublicHttpClient } from "../../http/useHttpClient";

export const useLogin = () => {
  const http = usePublicHttpClient();
  const navigate = useNavigate();
  const { setAuth, setDidLogout } = useAuth();

  return useMutation<AuthModel, ApiError, LoginRequestDTO>({
    mutationFn: (payload) => login(http, payload),
    onSuccess: (authModel) => {
      setDidLogout(false);
      setAuth(authModel);
      navigate(ROUTES.HOME, { replace: true });
    },
    onError: (error) => {
      return Promise.reject(error);
    },
  });
};
