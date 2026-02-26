import { PATHS } from "../api/paths";
import { type FetchedProfileMetaDTO } from "../dtos/ProfileDTO";
import type { HttpClient } from "../http/types";
import { fromFetchedProfileMetaDTO } from "../mappers/profileMapper";
import { type ProfileMetaModel } from "../models/profileModel";

export const getProfile = async () => {};

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
