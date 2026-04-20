import type { ApiResponse } from "../api";
import { PATHS } from "../api/paths";
import type {
  CreateOrderDTO,
  FetchedOrderDTO,
  OrdersPageDTO,
} from "../dtos/OrderDTO";
import type { HttpClient } from "../http/types";
import {
  fromOrderDTO,
  fromOrdersPageDTO,
  toCreateOrderDTO,
} from "../mappers/orderMapper";
import type {
  CreateOrderModel,
  OrderModel,
  OrdersPageModel,
} from "../models/orderModel";

export const listOrders = async (
  http: HttpClient,
  size: number,
  page: number,
  signal?: AbortSignal,
): Promise<OrdersPageModel> => {
  const data = await http.get<{ message: OrdersPageDTO }>(
    PATHS.ORDERS.LIST_ORDERS(size, page),
    {
      signal,
    },
  );

  if (data.message.next) {
    data.message.next = page + 1;
  }

  return fromOrdersPageDTO(data.message);
};

export const getOrder = async (
  http: HttpClient,
  uuid: string,
  signal?: AbortSignal,
): Promise<OrderModel> => {
  if (!uuid) throw new Error("Missing required parameter: uuid");

  const data = await http.get<{ message: FetchedOrderDTO }>(
    PATHS.ORDERS.GET_ORDER(uuid),
    {
      signal,
    },
  );

  return fromOrderDTO(data.message);
};

export const createOrder = async (
  http: HttpClient,
  newOrder: CreateOrderModel,
): Promise<ApiResponse> => {
  if (!newOrder) throw new Error("Missing required parameter: newOrder");

  const payload: CreateOrderDTO = toCreateOrderDTO(newOrder);

  return await http.post(PATHS.ORDERS.CREATE_ORDER, payload);
};

/*
export const confirmOrder = async (
  http: HttpClient,
  orderId: number,
): Promise<void> => {};

export const cancelOrder = async (
  http: HttpClient,
  orderId: number,
): Promise<void> => {};
*/
