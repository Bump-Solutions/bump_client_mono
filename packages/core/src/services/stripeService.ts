import { PATHS } from "../api";
import type { HttpClient } from "../http/types";

export const stripeConnect = async (http: HttpClient, signal?: AbortSignal) => {
  const data = await http.get<{ url: string }>(PATHS.STRIPE.CONNECT, {
    signal,
  });

  return data.url;
};
