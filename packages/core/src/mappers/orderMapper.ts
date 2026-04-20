import type {
  CreateOrderDTO,
  FetchedOrderDTO,
  InventoryItemDTO,
  ListOrderDTO,
  OrdersPageDTO,
} from "../dtos/OrderDTO";
import type {
  CreateOrderModel,
  OrderListModel,
  OrderModel,
  OrderProductItem,
  OrdersPageModel,
} from "../models/orderModel";

export function fromOrdersPageDTO(dto: OrdersPageDTO): OrdersPageModel {
  return {
    orders: dto.orders.map(fromListOrderDTO),
    next: dto.next,
    previous: dto.previous,
    count: dto.count,
    totalPages: dto.total_pages,
  };
}

export function fromListOrderDTO(dto: ListOrderDTO): OrderListModel {
  return {
    id: dto.id,
    uuid: dto.uuid,

    state: dto.state,
    validActions: dto.valid_actions,

    isSeller: dto.is_seller,
    party: {
      id: dto.party.id,
      username: dto.party.username,
      profilePicture: dto.party.profile_picture,
    },

    createdAt: dto.created_at,
    expiresAt: dto.expires_at,
  };
}

export function fromOrderDTOProductItems(
  inventoryItems: InventoryItemDTO[],
): OrderProductItem[] {
  return inventoryItems.map((item) => ({
    id: item.id,
    condition: item.condition,
    gender: item.gender,
    size: item.size,

    totalPrice: item.total_price,

    product: {
      id: item.inventory.id,
      brand: item.inventory.brand,
      model: item.inventory.model,
      colorWay: item.inventory.color_way,
    },

    image: item.image,
  }));
}

export function fromOrderDTO(dto: FetchedOrderDTO): OrderModel {
  return {
    id: dto.id,
    uuid: dto.uuid,

    state: dto.state,
    validActions: dto.valid_actions,

    isSeller: dto.is_seller,
    party: {
      id: dto.party.id,
      username: dto.party.username,
      profilePicture: dto.party.profile_picture,
    },

    productItems: fromOrderDTOProductItems(dto.inventory_items),

    createdAt: dto.created_at,
    expiresAt: dto.expires_at,
  };
}

export function toCreateOrderDTO(newOrder: CreateOrderModel): CreateOrderDTO {
  switch (newOrder.source) {
    case "cart":
      return {
        seller: newOrder.sellerId,
      };

    // case "product":
    default:
      return {
        seller: newOrder.sellerId,
        inventory_item_ids: newOrder.itemIds,
      };
  }
}
