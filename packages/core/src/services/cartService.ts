import type { ApiResponse } from "../api";
import { PATHS } from "../api/paths";
import type { CartDTO } from "../dtos";
import type { HttpClient } from "../http/types";
import { fromCartDTO } from "../mappers/cartMapper";

export const getCart = async (http: HttpClient, signal?: AbortSignal) => {
  const data = await http.get<{ message: CartDTO }>(PATHS.CART.GET_CART, {
    signal,
  });

  return fromCartDTO(data.message);
};

export const addItems = async (
  http: HttpClient,
  itemIds: number[],
): Promise<ApiResponse> => {
  if (!itemIds || itemIds.length === 0)
    throw new Error("Missing required parameter: itemIds");

  return await http.post(PATHS.CART.ADD_ITEMS, {
    inventory_item_id_list: itemIds,
  });
};

export const removeItem = async (
  http: HttpClient,
  itemId: number,
): Promise<ApiResponse> => {
  if (!itemId) throw new Error("Missing required parameter: itemId");

  return await http.delete(PATHS.CART.REMOVE_ITEM(itemId));
};

export const removePackage = async (
  http: HttpClient,
  sellerId: number,
): Promise<ApiResponse> => {
  if (!sellerId) throw new Error("Missing required parameter: sellerId");

  return await http.delete(PATHS.CART.REMOVE_PACKAGE(sellerId));
};

export const clearCart = async (http: HttpClient): Promise<ApiResponse> => {
  return await http.delete(PATHS.CART.CLEAR);
};
