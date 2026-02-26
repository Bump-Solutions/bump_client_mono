import type { ApiError } from "@bump/core/api";
import type { CartModel } from "@bump/core/models";
import { queryKeys } from "@bump/core/queries";
import { getCart } from "@bump/core/services";
import { ENUM } from "@bump/utils";
import { useQuery } from "@tanstack/react-query";

import { useAuth } from "../../context/auth/useAuth";
import { useAuthHttpClient } from "../../http/useHttpClient";

export const useGetCart = () => {
  const http = useAuthHttpClient();
  const { auth } = useAuth();

  return useQuery<CartModel, ApiError>({
    queryKey: queryKeys.cart.get(),
    queryFn: ({ signal }) => getCart(http, signal),
    enabled: Boolean(auth?.accessToken),
    retry: 1,
    staleTime: ENUM.GLOBALS.staleTime5,
  });
};
