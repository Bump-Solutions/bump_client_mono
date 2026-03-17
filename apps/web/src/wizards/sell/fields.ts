export const SELL_FIELDS = {
  select: ["select.isCatalog"],
  details: [
    "details.title",
    "details.description",
    "details.product.id",
    "details.product.brand",
    "details.product.model",
    "details.product.colorWay",
  ],
  items: ["items.items"],
  upload: ["upload.images"],
} as const;

export type SellStepId = keyof typeof SELL_FIELDS; // "select" | "details" | "items" | "upload"
