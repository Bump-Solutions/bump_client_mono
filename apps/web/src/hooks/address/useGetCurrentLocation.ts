import { getAddressFromCoords } from "@bump/core/services";
import type { NominatimReverseResponse } from "@bump/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useGeolocation } from "react-use";
import { toast } from "sonner";

const reverseGeoKey = (lat: number, lon: number) =>
  ["geo", "reverse", lat, lon] as const;

export const useGetCurrentLocation = (
  onSuccess?: (resp: NominatimReverseResponse) => void,
  onError?: (error: unknown) => void,
) => {
  const geo = useGeolocation({ enableHighAccuracy: true });

  const hasCoords = geo.latitude != null && geo.longitude != null;

  const query = useQuery<NominatimReverseResponse, unknown>({
    queryKey: hasCoords
      ? reverseGeoKey(geo.latitude!, geo.longitude!)
      : ["geo", "reverse", "none"],
    queryFn: ({ signal }) =>
      getAddressFromCoords(geo.latitude!, geo.longitude!, signal),
    enabled: hasCoords,
    retry: 0,
    staleTime: 0,
  });

  useEffect(() => {
    if (query.data?.address) onSuccess?.(query.data);
  }, [query.data, onSuccess]);

  useEffect(() => {
    if (!query.error) return;
    if (onError) onError(query.error);
    else toast.error("Nem sikerült meghatározni a címet.");
  }, [query.error, onError]);

  return {
    loading: geo.loading || query.isFetching,
    data: query.data,
    error: query.error,
  };
};
