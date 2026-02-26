import { useMemo } from "react";
import {
  useAddItems,
  useClearCart,
  useRemovePackage,
} from "../../hooks/cart/useCartMutations";
import { useGetCart } from "../../hooks/cart/useGetCart";
import { CartContext } from "./context";
import type { CartContextValue, CartProviderProps } from "./types";

const CartProvider = ({ children }: CartProviderProps) => {
  const { data: cart, isLoading, isError, error } = useGetCart();

  // Mutations
  const addItems = useAddItems();
  const removePackage = useRemovePackage();
  const clearCart = useClearCart();

  const contextValue = useMemo(() => {
    let out: CartContextValue = {
      cart,
      isLoading,

      itemsCount: cart
        ? cart.packages.reduce((sum, pkg) => {
            return (
              sum +
              pkg.products.reduce((pSum, prod) => pSum + prod.items.length, 0)
            );
          }, 0)
        : 0,

      actions: { addItems, removePackage, clearCart },
    };

    if (isError) {
      // Prevent blocking the entire app if cart fetch fails
      console.error("Failed to fetch cart:", error);
      out = {
        cart: undefined,
        isLoading: false,
        itemsCount: 0,
        actions: undefined,
      };
    }

    return out;
  }, [cart, isLoading, isError, error, addItems, removePackage, clearCart]);

  return <CartContext value={contextValue}>{children}</CartContext>;
};

export default CartProvider;
