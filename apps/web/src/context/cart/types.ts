import type { CartModel, CartPackageModel } from "@bump/core/models";
import type { ReactNode } from "react";
import type {
  useAddItems,
  useClearCart,
  useRemovePackage,
} from "../../hooks/cart/useCartMutations";
import type { HighlightIndex } from "../../utils/highlight";

export type CartProviderProps = {
  children: ReactNode;
};

export type CartContextValue = {
  cart: CartModel | undefined;
  isLoading: boolean;

  productsCount: number;
  itemsCount: number;

  actions?: {
    addItems: ReturnType<typeof useAddItems>;
    removePackage: ReturnType<typeof useRemovePackage>;
    clearCart: ReturnType<typeof useClearCart>;
  };
};

export type PackageContextValue = {
  pkg: CartPackageModel;
  highlightIndex?: HighlightIndex;
};
