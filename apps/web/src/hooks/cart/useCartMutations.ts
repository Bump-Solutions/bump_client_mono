import type { ApiError, ApiResponse } from "@bump/core/api";
import type { CartModel } from "@bump/core/models";
import { queryKeys } from "@bump/core/queries";
import {
  addItems,
  clearCart,
  removeItem,
  removePackage,
} from "@bump/core/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthHttpClient } from "../../http/useHttpClient";

type MutationCtx = {
  prev?: CartModel;
};

export const useAddItems = () => {
  const http = useAuthHttpClient();
  const queryClient = useQueryClient();

  return useMutation<ApiResponse, ApiError, number[], MutationCtx>({
    mutationFn: (itemIds: number[]) => addItems(http, itemIds),

    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.cart.get(),
      });

      const prev = queryClient.getQueryData<CartModel>(queryKeys.cart.get());

      // Optional optimistic update can go here later
      // if (prev) { ... }

      return { prev };
    },

    onError: (error, _variables, context) => {
      if (context?.prev) {
        queryClient.setQueryData(queryKeys.cart.get(), context.prev);
      }

      return Promise.reject(error);
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.cart.get(),
      });
      // or queryKeys.cart.all if you add more cart queries later
    },
  });
};

export const useRemoveItem = () => {
  const http = useAuthHttpClient();
  const queryClient = useQueryClient();

  return useMutation<ApiResponse, ApiError, number, MutationCtx>({
    mutationFn: (itemId: number) => removeItem(http, itemId),

    onMutate: async (itemId) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.cart.get(),
      });

      const prev = queryClient.getQueryData<CartModel>(queryKeys.cart.get());
      if (!prev) return { prev };

      const nextPackages = prev.packages
        .map((pkg) => ({
          ...pkg,
          products: pkg.products
            .map((prod) => ({
              ...prod,
              items: prod.items.filter((item) => item.id !== itemId),
            }))
            .filter((prod) => prod.items.length > 0),
        }))
        .filter((pkg) => pkg.products.length > 0);

      queryClient.setQueryData<CartModel>(queryKeys.cart.get(), {
        ...prev,
        packages: nextPackages,
      });

      return { prev };
    },

    onError: (error, _variables, context) => {
      if (context?.prev) {
        queryClient.setQueryData(queryKeys.cart.get(), context.prev);
      }

      return Promise.reject(error);
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.cart.get(),
      });
      // or queryKeys.cart.all if you later have multiple cart queries
    },
  });
};

export const useRemovePackage = () => {
  const http = useAuthHttpClient();
  const queryClient = useQueryClient();

  return useMutation<ApiResponse, ApiError, number, MutationCtx>({
    mutationFn: (sellerId: number) => removePackage(http, sellerId),

    onMutate: async (sellerId: number) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.cart.get(),
      });

      const prev = queryClient.getQueryData<CartModel>(queryKeys.cart.get());
      if (!prev) return { prev };

      const nextPackages = prev.packages.filter(
        (pkg) => pkg.seller.id !== sellerId,
      );

      queryClient.setQueryData<CartModel>(queryKeys.cart.get(), {
        ...prev,
        packages: nextPackages,
      });

      return { prev };
    },

    onError: (error, _variables, context) => {
      if (context?.prev) {
        queryClient.setQueryData(queryKeys.cart.get(), context.prev);
      }

      return Promise.reject(error);
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.cart.get(),
      });
    },
  });
};

export const useClearCart = () => {
  const http = useAuthHttpClient();
  const queryClient = useQueryClient();

  return useMutation<ApiResponse, ApiError, void, MutationCtx>({
    mutationFn: () => clearCart(http),

    // 1) Optimista üresítés
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.cart.get(),
      });

      const prev = queryClient.getQueryData<CartModel>(queryKeys.cart.get());

      const EMPTY: CartModel = {
        packages: [],
      };

      queryClient.setQueryData(queryKeys.cart.get(), EMPTY);

      return { prev };
    },

    // 2) Hiba esetén visszaállítjuk
    onError: (err, _variables, context) => {
      if (context?.prev) {
        queryClient.setQueryData(queryKeys.cart.get(), context.prev);
      }

      return Promise.reject(err);
    },

    // 3) Siker
    /* onSuccess: (resp) => {}, */

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.cart.get(),
      });
    },
  });
};
