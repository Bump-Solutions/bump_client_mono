import type { AxiosError, AxiosResponse } from "axios";

export type ApiResponse<T = unknown, D = unknown> = AxiosResponse<T, D>;
export type ApiError<T = unknown, D = unknown> = AxiosError<T, D>;
