import { useMemo } from "react";
import type { HttpClient, RequestOpts } from "@bump/core/http";
import type { AxiosInstance } from "axios";

import { useAxiosPrivate } from "../hooks/auth/useAxiosPrivate";
import { axiosPublic } from "./Axios";

function adaptAxios(axios: AxiosInstance): HttpClient {
  return {
    async get<T>(url: string, opts?: RequestOpts) {
      const { data } = await axios.get<T>(url, {
        signal: opts?.signal,
        headers: opts?.headers,
        withCredentials: opts?.withCredentials,
      });
      return data;
    },

    async post<T, B = unknown>(url: string, body?: B, opts?: RequestOpts) {
      const { data } = await axios.post<T>(url, body, {
        signal: opts?.signal,
        headers: opts?.headers,
        withCredentials: opts?.withCredentials,
      });
      return data;
    },

    async put<T, B = unknown>(url: string, body?: B, opts?: RequestOpts) {
      const { data } = await axios.put<T>(url, body, {
        signal: opts?.signal,
        headers: opts?.headers,
        withCredentials: opts?.withCredentials,
      });
      return data;
    },

    async delete<T, B = unknown>(url: string, body?: B, opts?: RequestOpts) {
      const { data } = await axios.delete<T>(url, {
        data: body,
        signal: opts?.signal,
        headers: opts?.headers,
        withCredentials: opts?.withCredentials,
      });
      return data;
    },
  };
}

export const usePublicHttpClient = (): HttpClient => {
  return useMemo(() => adaptAxios(axiosPublic), []);
};

export const useAuthHttpClient = (): HttpClient => {
  const axiosPrivate = useAxiosPrivate();
  return useMemo(() => adaptAxios(axiosPrivate), [axiosPrivate]);
};
