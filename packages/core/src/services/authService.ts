import { PATHS } from "../api/paths";
import type { HttpClient } from "../http/types";

import type { LoginRequestDTO, LoginResponseDTO } from "../dtos/AuthDTO";
import { fromLoginResponseDTO } from "../mappers/authMapper";
import { type AuthModel } from "../models/authModel";

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
