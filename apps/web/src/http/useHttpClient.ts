import type { HttpClient, RequestOpts } from "@bump/core/http";
import type { AxiosInstance } from "axios";
import axios from "axios";
import { useAxiosPrivate } from "../hooks/auth/useAxiosPrivate";

function adaptAxios(axios: AxiosInstance): HttpClient {
  return {
    async get<T>(url: string, opts?: RequestOpts) {
      const { data } = await axios.get<T>(url, { signal: opts?.signal });
      return data;
    },

    async post<T, B = unknown>(url: string, body?: B, opts?: RequestOpts) {
      const { data } = await axios.post<T>(url, body, { signal: opts?.signal });
      return data;
    },

    async put<T, B = unknown>(url: string, body?: B, opts?: RequestOpts) {
      const { data } = await axios.put<T>(url, body, { signal: opts?.signal });
      return data;
    },

    async delete<T>(url: string, opts?: RequestOpts) {
      const { data } = await axios.delete<T>(url, { signal: opts?.signal });
      return data;
    },
  };
}

export const usePublicHttpClient = (): HttpClient => {
  return adaptAxios(axios);
};

export const useAuthHttpClient = (): HttpClient => {
  const axiosPrivate = useAxiosPrivate();
  return adaptAxios(axiosPrivate);
};
