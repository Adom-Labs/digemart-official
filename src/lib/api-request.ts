import { getErrorMessage } from "./utils";

export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface RequestOptions {
  method?: RequestMethod;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any; //will be typed, generic
  headers?: HeadersInit;
  cache?: RequestCache;
  tags?: string[];
}

interface ApiResult<T> {
  statusCode: number;
  status: boolean;
  message: string;
  error?: string;
  timestamp: string;
  path: string;
  details?: {
    name: string;
    message: string;
  };
  data?: T;
}

export type ApiResponse<T> = {
  success: boolean;
  data: T | null;
  error?: string;
};

export async function apiRequest<T>(
  endpoint: string,
  { method = "GET", data, headers, ...options }: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...options,
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const apiResult: ApiResult<T> = await response.json();

    if (!apiResult.status || apiResult.error) {
      const error =
        apiResult.message || apiResult.details?.message || "API Error";
      throw new Error(error);
    }

    return { success: true, data: apiResult.data as T };
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}
