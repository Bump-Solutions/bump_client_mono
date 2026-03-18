import { PATHS } from "@bump/core/api";

// const VERSION = import.meta.env.VITE_API_VERSION ?? "v1"; // pl. v1, v2
const ORIGIN = import.meta.env.VITE_API_ORIGIN ?? ""; // "" => same-origin
const WS_ORIGIN = import.meta.env.VITE_WS_ORIGIN ?? ""; // "" => auto from location

// HTTP és WS bázisok
const HTTP_ORIGIN =
  ORIGIN || `${window.location.protocol}//${window.location.host}`;

const WS_BASE_URL = WS_ORIGIN
  ? WS_ORIGIN
  : `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${
      window.location.host
    }/ws`;

export const API = {
  BASE_URL: HTTP_ORIGIN,
  WS_BASE_URL: WS_BASE_URL,
  MEDIA_URL: "",

  PATHS: PATHS,
} as const;
