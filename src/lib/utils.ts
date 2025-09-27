import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ROUTES } from "./routes";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof TypeError && error.message === "Failed to fetch") {
    return "Network connection failed. Please check your internet connection.";
  }

  if (error && typeof error === "object" && "isAxiosError" in error) {
    // allow any type here since we are checking for isAxiosError
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const axiosError = error as any;
    return (
      axiosError.response?.data?.message ||
      axiosError.response?.data?.error ||
      axiosError.message ||
      "Request failed"
    );
  }

  if (error instanceof DOMException) {
    return error.message;
  }

  if (error instanceof SyntaxError) {
    return "Failed to parse response";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred";
}

export function navVariantByPath(path: string) {
  if (path.includes(ROUTES.CONTACT) || path === "/") {
    return "white";
  }
  return "black";
}

export const getStoreUrl = (
  storeUrl: string,
  type: "EXTERNAL" | "INTERNAL" = "INTERNAL"
) => {
  if (type === "EXTERNAL") {
    console.log(``);
    return `${ROUTES.FINDYOURPLUG}/${storeUrl}`;
  }
  return `/${storeUrl}`;
};
