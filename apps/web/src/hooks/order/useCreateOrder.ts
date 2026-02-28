import type { ApiError, ApiResponse } from "@bump/core/api";
import type { CartModel, CreateOrderModel } from "@bump/core/models";
import { queryKeys } from "@bump/core/queries";
import { createOrder } from "@bump/core/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthHttpClient } from "../../http/useHttpClient";

type CreateOrderVariables = {
  newOrder: CreateOrderModel;
};

type CreateOrderCtx = {
  prevCart?: CartModel;
};

export const useCreateOrder = (
  onSuccess?: (resp: ApiResponse, variables: CreateOrderVariables) => void,
  onError?: (error: ApiError, variables: CreateOrderVariables) => void,
) => {
  const http = useAuthHttpClient();
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse,
    ApiError,
    CreateOrderVariables,
    CreateOrderCtx
  >({
    mutationFn: ({ newOrder }) => createOrder(http, newOrder),

    onMutate: async ({ newOrder }) => {
      // TODO: consider also invalidating orders list query

      await Promise.all([
        queryClient.cancelQueries({
          queryKey: queryKeys.cart.get(),
        }),
        /*
        queryClient.cancelQueries({
          queryKey: queryKeys.order.lists(),
        }),
        */
      ]);

      const prevCart = queryClient.getQueryData<CartModel>(
        queryKeys.cart.get(),
      );

      // 1) If hook is called from cart, remove package by sellerId
      switch (newOrder.source) {
        case "cart":
          queryClient.setQueryData(
            queryKeys.cart.get(),
            (old: CartModel | undefined) => {
              if (!old) return old;

              const updatedPackages = old.packages.filter(
                (pkg) => pkg.seller.id !== newOrder.sellerId,
              );

              return { ...old, packages: updatedPackages };
            },
          );

          break;

        // case "product": just invalidate the cart query onSettled

        default:
          return { prevCart };
      }

      return { prevCart };
    },

    onError: (error, variables, context) => {
      const newOrder = variables.newOrder;

      switch (newOrder.source) {
        case "cart":
          if (context?.prevCart) {
            queryClient.setQueryData(queryKeys.cart.get(), context.prevCart);
          }
          break;

        case "product":
          if (context?.prevCart) {
            queryClient.setQueryData(queryKeys.cart.get(), context.prevCart);
          }
          break;

        default:
          break;
      }

      if (onError) {
        onError(error, variables);
      }

      return Promise.reject(error);
    },

    onSuccess: (resp, variables) => {
      if (onSuccess) {
        onSuccess(resp, variables);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.cart.get(),
        refetchType: "active",
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.order.lists(),
        refetchType: "active",
      });
    },
  });
};
