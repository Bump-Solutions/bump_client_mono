export const queryKeys = {
  profile: {
    all: ["profile"] as const,
    get: () => [...queryKeys.profile.all, "get"] as const,
    meta: () => [...queryKeys.profile.all, "meta"] as const,
    pictureColors: () => [...queryKeys.profile.all, "pictureColors"] as const,
  },

  user: {
    all: ["user"] as const,
    get: (username: string) =>
      [...queryKeys.user.all, "get", username] as const,
  },

  follow: {
    all: ["follow"] as const,
    followers: (params?: unknown) =>
      [...queryKeys.follow.all, "followers", params] as const,
    followings: (params?: unknown) =>
      [...queryKeys.follow.all, "followings", params] as const,
  },

  product: {
    all: ["product"] as const,

    availableBrands: (params?: unknown) =>
      [...queryKeys.product.all, "availableBrands", params] as const,

    availableModels: (params?: unknown) =>
      [...queryKeys.product.all, "availableModels", params] as const,

    availableColorways: (params?: unknown) =>
      [...queryKeys.product.all, "availableColorways", params] as const,

    list: (params?: unknown) =>
      [...queryKeys.product.all, "list", params] as const,

    listWithoutDiscount: (params?: unknown) =>
      [...queryKeys.product.all, "listWithoutDiscount", params] as const,

    detail: (pid: number) => [...queryKeys.product.all, "detail", pid] as const,

    saved: (params?: unknown) =>
      [...queryKeys.product.all, "saved", params] as const,

    categories: () => [...queryKeys.product.all, "categories"] as const,
    sizes: (params?: unknown) =>
      [...queryKeys.product.all, "sizes", params] as const,
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
    groups: (params?: unknown) =>
      [...queryKeys.chat.all, "groups", params] as const,
    messages: (chatId: string, params?: unknown) =>
      [...queryKeys.chat.all, "messages", chatId, params] as const,
  },

  notification: {
    all: ["notification"] as const,
    list: (type: number) =>
      [...queryKeys.notification.all, "list", type] as const,
  },

  search: {
    all: ["search"] as const,
    history: () => [...queryKeys.search.all, "history"] as const,
    products: (params?: unknown) =>
      [...queryKeys.search.all, "products", params] as const,
    users: (params?: unknown) =>
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
