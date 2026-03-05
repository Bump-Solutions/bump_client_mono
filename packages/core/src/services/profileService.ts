import type { ApiResponse } from "../api";
import { PATHS } from "../api/paths";
import type {
  FetchedProfileDTO,
  FetchedProfileMetaDTO,
  UpdateProfileDTO,
} from "../dtos/ProfileDTO";
import type { HttpClient } from "../http/types";
import {
  fromFetchedProfileDTO,
  fromFetchedProfileMetaDTO,
  toUpdateProfileDTO,
} from "../mappers/profileMapper";
import {
  type ProfileMetaModel,
  type ProfileModel,
} from "../models/profileModel";

export const getProfile = async (
  http: HttpClient,
  signal?: AbortSignal,
): Promise<ProfileModel> => {
  const data = await http.get<{ message: FetchedProfileDTO }>(
    PATHS.PROFILE.GET_PROFILE,
    { signal },
  );

  return fromFetchedProfileDTO(data.message);
};

export const getProfileMeta = async (
  http: HttpClient,
  signal?: AbortSignal,
): Promise<ProfileMetaModel> => {
  const data = await http.get<{ message: FetchedProfileMetaDTO }>(
    PATHS.PROFILE.GET_PROFILE_META,
    { signal },
  );

  return fromFetchedProfileMetaDTO(data.message);
};

export const updateProfile = async (
  http: HttpClient,
  newProfile: Partial<ProfileModel>,
): Promise<ApiResponse> => {
  const payload: UpdateProfileDTO = toUpdateProfileDTO(newProfile);

  return await http.put(PATHS.PROFILE.UPDATE_PROFILE, payload);
};

export const uploadProfilePicture = async (
  http: HttpClient,
  payload: Record<string, unknown>,
): Promise<{ message: string }> => {
  return await http.put(PATHS.PROFILE.UPLOAD_PROFILE_PICTURE, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const setProfileBackgroundColor = async (
  http: HttpClient,
  color: string,
): Promise<ApiResponse> => {
  return await http.put(PATHS.PROFILE.SET_PROFILE_BACKGROUND_COLOR, {
    profile_background_color: color,
  });
};
