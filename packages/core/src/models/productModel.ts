/* (PRODUCT) BADGES */
export interface Badge {
  text: string;
  type: string;
  priority: number;
  value?: string | number;
}

export type BadgeType = "new" | "discount" | "recommended" | "popular";

export type BadgeCollection = Partial<Record<BadgeType, Badge>>;
