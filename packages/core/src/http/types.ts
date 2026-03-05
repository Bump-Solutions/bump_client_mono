export type RequestOpts = {
  signal?: AbortSignal;
  headers?: Record<string, string>;
  withCredentials?: boolean;
};

export interface HttpClient {
  get<T>(url: string, opts?: RequestOpts): Promise<T>;
  post<T, B = unknown>(url: string, body?: B, opts?: RequestOpts): Promise<T>;
  put<T, B = unknown>(url: string, body?: B, opts?: RequestOpts): Promise<T>;
  delete<T, B = unknown>(url: string, body?: B, opts?: RequestOpts): Promise<T>;
}
