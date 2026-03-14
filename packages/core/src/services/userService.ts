import { PATHS, type ApiResponse } from "../api";
import type {
  FetchedUserDTO,
  FollowersPageDTO,
  FollowingsPageDTO,
} from "../dtos";
import type { HttpClient } from "../http/types";
import {
  fromFetchedUserDTO,
  fromFollowerDTO,
  fromFollowingDTO,
} from "../mappers";
import type {
  FollowersPageModel,
  FollowingsPageModel,
  UserModel,
} from "../models";

export const listUsers = async (
  http: HttpClient,
  signal?: AbortSignal,
): Promise<UserModel[]> => {
  const data = await http.get<{ message: FetchedUserDTO[] }>(
    PATHS.USER.LIST_USERS,
    {
      signal,
    },
  );

  return data.message.map(fromFetchedUserDTO);
};

export const getUser = async (
  http: HttpClient,
  username?: UserModel["username"],
  signal?: AbortSignal,
): Promise<UserModel> => {
  if (!username) throw new Error("Missing required parameter: username");

  const data = await http.get<{ message: FetchedUserDTO }>(
    PATHS.USER.GET_USER(username),
    {
      signal,
    },
  );

  return fromFetchedUserDTO(data.message);
};

export const listFollowers = async (
  http: HttpClient,
  uid: UserModel["id"],
  size: number,
  page: number,
  searchKey: string,
  signal: AbortSignal,
): Promise<FollowersPageModel> => {
  if (!uid) throw new Error("Missing required parameter: uid");

  const data = await http.get<{ message: FollowersPageDTO }>(
    PATHS.USER.LIST_FOLLOWERS(uid, size, page, searchKey),
    {
      signal,
    },
  );

  if (data.message.next) {
    data.message.next = page + 1;
  }

  return {
    ...data.message,
    followers: data.message.followers.map(fromFollowerDTO),
  };
};

export const listFollowing = async (
  http: HttpClient,
  uid: UserModel["id"],
  size: number,
  page: number,
  searchKey: string,
  signal: AbortSignal,
): Promise<FollowingsPageModel> => {
  if (!uid) throw new Error("Missing required parameter: uid");

  const data = await http.get<{ message: FollowingsPageDTO }>(
    PATHS.USER.LIST_FOLLOWING(uid, size, page, searchKey),
    {
      signal,
    },
  );

  if (data.message.next) {
    data.message.next = page + 1;
  }

  return {
    ...data.message,
    followings: data.message.followings.map(fromFollowingDTO),
  };
};

export const follow = async (
  http: HttpClient,
  uid: UserModel["id"],
): Promise<ApiResponse> => {
  if (!uid) throw new Error("Missing required parameter: uid");

  return await http.post(PATHS.USER.FOLLOW, {
    following_user_id: uid,
  });
};

export const unfollow = async (
  http: HttpClient,
  uid: UserModel["id"],
): Promise<ApiResponse> => {
  if (!uid) throw new Error("Missing required parameter: uid");

  return await http.delete(PATHS.USER.UNFOLLOW, {
    following_user_id: uid,
  });
};

export const deleteFollower = async (
  http: HttpClient,
  uid: UserModel["id"],
): Promise<ApiResponse> => {
  if (!uid) throw new Error("Missing required parameter: uid");

  return await http.delete(PATHS.USER.DELETE_FOLLOWER, {
    user_id: uid,
  });
};
