// --- Enums: tükör a backendhez (IntEnum-ekhez illesztve) ---

export const OrderUserRole = {
  SELLER: "seller",
  BUYER: "buyer",
} as const;
export type OrderUserRole = (typeof OrderUserRole)[keyof typeof OrderUserRole];

export const OrderAction = {
  CONFIRM_ORDER: 0,
  INITIATE_CHECKOUT: 1,
  GET_ORDER_PAYMENT_STATUS: 2,
  GET_SHIPMENT_DETAILS: 3,
  SUBMIT_SELLER_RATING: 4,
  SUBMIT_BUYER_RATING: 5,
  CANCEL_ORDER: 10,
} as const;
export type OrderAction = (typeof OrderAction)[keyof typeof OrderAction];

export const OrderState = {
  SELLER_CONFIRMATION: 0,
  WAITING_FOR_INITIATE_CHECKOUT: 1,
  WAITING_FOR_EXTERNAL_TASKS: 2,
  CHECKOUT_SUCCESSFUL_NOT_PAID: 3,
  PAID_WAITING_FOR_SHIPMENT: 4,
  SHIPPED_WAITING_FOR_ARRIVAL: 5,
  ARRIVED_WAITING_FOR_PICKUP: 6,
  RECEIVED_WAITING_FOR_RESPONSE: 7,
  COMPLETED: 8,
  CANCELLED: 9,
  EXPIRED: 10,
  FAILED: 11,
} as const;
export type OrderState = (typeof OrderState)[keyof typeof OrderState];

// --- Közös, kis típusok ---
export type OrderId = number;
export type OrderUUID = string;

export type OrderParty = {
  id: number;
  username: string;
  profilePicture: string | null;
};

export type OrderProductItem = {
  id: number;
  condition: number;
  gender: number;
  size: string;

  totalPrice: number;

  product: {
    id: number;
    brand: string;
    model: string;
    colorWay: string;
  };

  image: string;
};

export type OrderPillVariant =
  | "success"
  | "warning"
  | "critical"
  | "info"
  | "neutral";

// --- A szerver által visszaadott modellek (kliens oldali) ---

export interface OrderListModel {
  id: OrderId;
  uuid: OrderUUID;

  state: OrderState; // numeric enum
  validActions: OrderAction[]; // numeric enum lista a szervertől

  // A session user szemszögéből:
  isSeller: boolean;
  party: OrderParty;

  createdAt: string; // ISO
  expiresAt: string; // ISO
}

export interface OrderModel extends OrderListModel {
  productItems: OrderProductItem[];
}

// Oldalazás

export interface OrdersPageModel {
  orders: OrderListModel[];
  next: number | null;
  previous: string | null;
  count: number;
  totalPages: number;
}

// --- Order létrehozás modellek ---

export type CreateOrderFromProduct = {
  source: "product";
  sellerId: number;
  itemIds: number[];
};

export type CreateOrderFromCart = {
  source: "cart";
  sellerId: number;
  itemIds?: never;
};

export type CreateOrderModel = CreateOrderFromProduct | CreateOrderFromCart;

export const TERMINAL_STATES: readonly OrderState[] = [
  OrderState.COMPLETED,
  OrderState.CANCELLED,
  OrderState.EXPIRED,
  OrderState.FAILED,
];

export const isTerminalOrderState = (state: OrderState): boolean =>
  TERMINAL_STATES.includes(state);

export const getOrderUserRole = (
  order: Pick<OrderModel, "isSeller">,
): OrderUserRole =>
  order.isSeller ? OrderUserRole.SELLER : OrderUserRole.BUYER;
