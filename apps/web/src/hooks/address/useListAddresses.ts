import type { AddressModel } from "@bump/core/models";
import { queryKeys } from "@bump/core/queries";
import { listAddresses } from "@bump/core/services";
import { useQuery } from "@tanstack/react-query";
import { useAuthHttpClient } from "../../http/useHttpClient";

export const useListAddresses = () => {
  const http = useAuthHttpClient();

  return useQuery<AddressModel[]>({
    queryKey: queryKeys.address.list(),
    queryFn: ({ signal }) => listAddresses(http, signal),
    staleTime: Infinity, // Keep data fresh indefinitely unless manually invalidated (e.g. Add, Modify, Delete operations)
  });
};
