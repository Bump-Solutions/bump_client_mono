import type { ApiError } from "@bump/core/api";
import { queryKeys } from "@bump/core/queries";
import { stripeConnect } from "@bump/core/services";
import { useQuery } from "@tanstack/react-query";
import { useAuthHttpClient } from "../../http/useHttpClient";

export const useStripeConnect = () => {
  const http = useAuthHttpClient();

  return useQuery<string, ApiError>({
    queryKey: queryKeys.stripe.connect(),
    queryFn: ({ signal }) => stripeConnect(http, signal),
    enabled: false, // Disable automatic fetching; call refetch() on button click
    staleTime: 0,
    refetchOnWindowFocus: false,
    retry: false,
  });
};
