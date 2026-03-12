import type { ProductModel } from "@bump/core/models";
import type { ReactNode } from "react";

export type ProductProviderProps = {
  children: ReactNode;
};

export type ProductContextValue = {
  product: ProductModel;
  setProduct: (data: Partial<ProductModel>) => void;
};
