import { PATHS } from "@bump/core/api";

// Replace with your local IP or production URL
const BASE_URL = "https://api.bumpmarket.hu";

export const API = {
  BASE_URL: BASE_URL,
  WS_BASE_URL: `${BASE_URL.replace("http", "ws")}/ws`,
  MEDIA_URL: "",

  PATHS: PATHS,
} as const;
