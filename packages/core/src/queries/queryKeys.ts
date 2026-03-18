import type { ChatGroupModel, UserModel } from "../models";

export const queryKeys = {
  profile: {
    all: ["profile"] as const,
    get: () => [...queryKeys.profile.all, "get"] as const,
    meta: () => [...queryKeys.profile.all, "meta"] as const,
    pictureColors: () => [...queryKeys.profile.all, "pictureColors"] as const,
  },

  user: {
    all: ["user"] as const,
    get: (username: UserModel["username"]) =>
      [...queryKeys.user.all, "get", username] as const,
  },

  follow: {
    all: ["follow"] as const,
    followers: (uid: UserModel["id"]) =>
      [...queryKeys.follow.all, "followers", uid] as const,
    followersInfinite: (uid: UserModel["id"], searchKey: string) =>
      [...queryKeys.follow.followers(uid), "infinite", { searchKey }] as const,
    followings: (uid: UserModel["id"]) =>
      [...queryKeys.follow.all, "followings", uid] as const,
    followingsInfinite: (uid: UserModel["id"], searchKey: string) =>
      [...queryKeys.follow.followings(uid), "infinite", { searchKey }] as const,
  },

  product: {
    all: ["product"] as const,

    availableBrands: (params: { searchKey: string }) =>
      [...queryKeys.product.all, "availableBrands", params] as const,

    availableModels: (params: { brand: string; searchKey: string }) =>
      [...queryKeys.product.all, "availableModels", params] as const,

    availableColorways: (params: {
      brand: string;
      model: string;
      searchKey: string;
    }) => [...queryKeys.product.all, "availableColorways", params] as const,

    list: (uid: UserModel["id"]) =>
      [...queryKeys.product.all, "list", uid] as const,

    get: (pid: number) => [...queryKeys.product.all, "get", pid] as const,

    saved: () => [...queryKeys.product.all, "saved"] as const,

    categories: () => [...queryKeys.product.all, "categories"] as const,
  },

  cart: {
    all: ["cart"] as const,
    get: () => [...queryKeys.cart.all, "get"] as const,
  },

  order: {
    all: ["order"] as const,
    lists: () => [...queryKeys.order.all, "list"] as const,
    list: (params: { pageNumber: number; pageSize: number }) =>
      [...queryKeys.order.lists(), params] as const,
    get: (uuid: string) => [...queryKeys.order.all, "get", uuid] as const,
  },

  chat: {
    all: ["chat"] as const,
    groups: (searchKey: string) =>
      [...queryKeys.chat.all, "groups", { searchKey }] as const,
    messages: (chat: ChatGroupModel["name"]) =>
      [...queryKeys.chat.all, "messages", chat] as const,
  },

  notification: {
    all: ["notification"] as const,
    list: (type: number) =>
      [...queryKeys.notification.all, "list", type] as const,
  },

  search: {
    all: ["search"] as const,
    history: () => [...queryKeys.search.all, "history"] as const,
    products: (params: { key: string }) =>
      [...queryKeys.search.all, "products", params] as const,
    users: (params: { key: string }) =>
      [...queryKeys.search.all, "users", params] as const,
  },

  address: {
    all: ["address"] as const,
    list: () => [...queryKeys.address.all, "list"] as const,
  },

  stripe: {
    all: ["stripe"] as const,
    connect: () => [...queryKeys.stripe.all, "connect"] as const,
  },
} as const;
