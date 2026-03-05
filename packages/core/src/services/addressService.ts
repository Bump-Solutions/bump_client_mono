import axios from "axios";
import type { NominatimReverseResponse } from "../../../types/src/address";
import { PATHS, type ApiResponse } from "../api";
import type { CreateAddressDTO, FetchedAddressDTO } from "../dtos";
import type { HttpClient } from "../http/types";
import { fromFetchedAddressDTO, toCreateAddressDTO } from "../mappers";
import type { AddressModel } from "../models";

export const getAddressFromCoords = async (
  lat: number,
  lon: number,
  signal?: AbortSignal,
): Promise<NominatimReverseResponse> => {
  const { data } = await axios.get<NominatimReverseResponse>(
    "https://nominatim.openstreetmap.org/reverse",
    {
      signal,
      params: {
        format: "json",
        lat,
        lon,
      },
    },
  );

  return data;
};

export const listAddresses = async (
  http: HttpClient,
  signal?: AbortSignal,
): Promise<AddressModel[]> => {
  const data = await http.get<{ message: FetchedAddressDTO[] }>(
    PATHS.ADDRESS.LIST_ADDRESSES,
    {
      signal,
    },
  );

  return data.message.map(fromFetchedAddressDTO);
};

export const addAddress = async (
  http: HttpClient,
  newAddress: Omit<AddressModel, "id">,
): Promise<ApiResponse> => {
  const payload: CreateAddressDTO = toCreateAddressDTO(newAddress);

  return await http.post(PATHS.ADDRESS.ADD_ADDRESS, payload);
};

export const modifyAddress = async (
  http: HttpClient,
  address: AddressModel,
): Promise<ApiResponse> => {
  if (!address.id) throw new Error("Missing required parameter: address.id");

  const payload: CreateAddressDTO = toCreateAddressDTO(address);

  return await http.put(PATHS.ADDRESS.UPDATE_ADDRESS(address.id), payload);
};

export const deleteAddress = async (
  http: HttpClient,
  addressId: AddressModel["id"],
): Promise<ApiResponse> => {
  if (!addressId) throw new Error("Missing required parameter: addressId");

  return await http.delete(PATHS.ADDRESS.DELETE_ADDRESS(addressId));
};
