import { PATHS } from "../api/paths";
import type { HttpClient } from "../http/types";

import {
  type GoogleResponseDTO,
  type LoginRequestDTO,
  type LoginResponseDTO,
  type SignupRequestDTO,
} from "../dtos/AuthDTO";
import {
  fromGoogleResponseDTO,
  fromLoginResponseDTO,
  toSignupRequestDTO,
} from "../mappers/authMapper";
import { type AuthModel, type SignupModel } from "../models/authModel";

// ======================================== LOGIN ========================================

export const login = async (
  http: HttpClient,
  payload: LoginRequestDTO,
): Promise<AuthModel> => {
  const data = await http.post<LoginResponseDTO, LoginRequestDTO>(
    PATHS.AUTH.LOGIN,
    payload,
  );

  return fromLoginResponseDTO({ ...data, email: payload.email });
};

// ======================================== SIGNUP ========================================

export const signup = async (
  http: HttpClient,
  model: SignupModel,
): Promise<unknown> => {
  const payload: SignupRequestDTO = toSignupRequestDTO(model);
  const data = await http.post(PATHS.AUTH.REGISTER, payload, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });

  return data;
};

// ======================================== GOOGLE LOGIN ========================================

export const googleLogin = async (
  http: HttpClient,
  code: string,
): Promise<AuthModel> => {
  const data = await http.post<GoogleResponseDTO>(
    PATHS.AUTH.GOOGLE_AUTH,
    code,
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    },
  );

  return fromGoogleResponseDTO(data.access_token);
};

// ======================================== LOGOUT ========================================

export const logout = async (http: HttpClient): Promise<void> => {
  await http.get(PATHS.AUTH.LOGOUT, { withCredentials: true });
};
