import { PATHS, type ApiResponse } from "../api";
import type { ProductSearchDTO, UserSearchDTO } from "../dtos";
import type { HttpClient } from "../http/types";
import { fromProductSearchDTO, fromUserSearchDTO } from "../mappers";
import type {
  ProductSearchModel,
  SearchHistoryItemModel,
  SearchPageModel,
  UserSearchModel,
} from "../models";

export const listSearchHistory = async (
  http: HttpClient,
  signal?: AbortSignal,
): Promise<SearchHistoryItemModel[]> => {
  const data = await http.get<{ message: SearchHistoryItemModel[] }>(
    PATHS.SEARCH.LIST_HISTORY,
    { signal },
  );

  return data.message;
};

export const deleteSearchHistoryItem = async (
  http: HttpClient,
  id: SearchHistoryItemModel["id"],
): Promise<ApiResponse> => {
  if (!id) throw new Error("Missing required parameter: id");

  return await http.delete(PATHS.SEARCH.DELETE_HISTORY(id));
};

export const searchProducts = async (
  http: HttpClient,
  size: number,
  page: number,
  searchKey: string,
  signal?: AbortSignal,
): Promise<SearchPageModel<ProductSearchModel>> => {
  const data = await http.get<{
    message: SearchPageModel<ProductSearchDTO>;
  }>(PATHS.SEARCH.PRODUCTS(size, page, searchKey), { signal });

  if (data.message.next) {
    data.message.next = page + 1;
  }

  return {
    ...data.message,
    search_result: data.message.search_result.map(fromProductSearchDTO),
  };
};

export const searchUsers = async (
  http: HttpClient,
  size: number,
  page: number,
  searchKey: string,
  signal?: AbortSignal,
): Promise<SearchPageModel<UserSearchModel>> => {
  const data = await http.get<{
    message: SearchPageModel<UserSearchDTO>;
  }>(PATHS.SEARCH.USERS(size, page, searchKey), { signal });

  if (data.message.next) {
    data.message.next = page + 1;
  }

  return {
    ...data.message,
    search_result: data.message.search_result.map(fromUserSearchDTO),
  };
};
