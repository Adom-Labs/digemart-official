/**
 * Store Authentication Context Utilities (diagnostic build)
 * Manages cookies for cross-subdomain authentication context
 */

import * as cookie from "cookie";

const STORE_AUTH_CONTEXT_KEY = "digemart_store_auth_context";
const COOKIE_MAX_AGE = 10 * 60; // 10 minutes

export interface StoreAuthContext {
  storeSubdomain: string;
  storeName: string;
  redirectUrl?: string;
  timestamp: number;
  fullUrl?: string;
}

/**
 * Determine root domain for cross-subdomain cookie sharing
 */
const getRootDomain = (): string | undefined => {
  if (typeof window === "undefined") return undefined;
  const hostname = window.location.hostname;

  // Localhost and *.localhost → undefined (no domain attribute)
  if (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    /^\d+\.\d+\.\d+\.\d+$/.test(hostname)
  ) {
    return undefined;
  }

  // Production: extract root domain (last two segments)
  const parts = hostname.split(".");
  return parts.length >= 2 ? `.${parts.slice(-2).join(".")}` : undefined;
};

/**
 * Set a cookie using `cookie.serialize`
 */
const setCookie = (name: string, value: string, maxAge: number): void => {
  if (typeof document === "undefined") {
    console.warn("[setCookie] document undefined (SSR)");
    return;
  }

  const domain = getRootDomain();
  const serialized = cookie.serialize(name, value, {
    path: "/",
    domain,
    maxAge,
    sameSite: "lax",
    secure: location.protocol === "https:",
  });

  document.cookie = serialized;
  console.debug("[setCookie] wrote:", serialized);
  console.debug("[setCookie] document.cookie now:", document.cookie);
};

/**
 * Get a cookie value using `cookie.parse`
 */
const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") {
    console.warn("[getCookie] document undefined (SSR)");
    return null;
  }

  const cookies = cookie.parse(document.cookie || "");
  console.debug("[getCookie] parsed:", cookies);
  return cookies[name] || null;
};

/**
 * Delete a cookie
 */
const deleteCookie = (name: string): void => {
  if (typeof document === "undefined") {
    console.warn("[deleteCookie] document undefined (SSR)");
    return;
  }

  const domain = getRootDomain();
  const serialized = cookie.serialize(name, "", {
    path: "/",
    domain,
    maxAge: 0,
    sameSite: "lax",
    secure: location.protocol === "https:",
  });

  document.cookie = serialized;
  console.debug("[deleteCookie] cleared:", serialized);
  console.debug("[deleteCookie] document.cookie now:", document.cookie);
};

/**
 * Set store authentication context
 */
export const setStoreAuthContext = (
  context: Omit<StoreAuthContext, "timestamp">
) => {
  if (typeof window === "undefined") {
    console.warn("[setStoreAuthContext] window undefined (SSR)");
    return;
  }

  const contextWithTimestamp: StoreAuthContext = {
    ...context,
    timestamp: Date.now(),
  };

  console.debug("[setStoreAuthContext] input:", contextWithTimestamp);
  setCookie(
    STORE_AUTH_CONTEXT_KEY,
    JSON.stringify(contextWithTimestamp),
    COOKIE_MAX_AGE
  );
};

/**
 * Get store authentication context
 */
export const getStoreAuthContext = (): StoreAuthContext | null => {
  if (typeof window === "undefined") {
    console.warn("[getStoreAuthContext] window undefined (SSR)");
    return null;
  }

  try {
    const stored = getCookie(STORE_AUTH_CONTEXT_KEY);
    console.debug("[getStoreAuthContext] raw:", stored);

    if (!stored) return null;

    const context: StoreAuthContext = JSON.parse(stored);
    const expired = Date.now() - context.timestamp > COOKIE_MAX_AGE * 1000;

    if (expired) {
      console.debug("[getStoreAuthContext] expired, clearing...");
      clearStoreAuthContext();
      return null;
    }

    console.debug("[getStoreAuthContext] valid context:", context);
    return context;
  } catch (error) {
    console.error("[getStoreAuthContext] parse error:", error);
    clearStoreAuthContext();
    return null;
  }
};

/**
 * Clear store authentication context
 */
export const clearStoreAuthContext = () => {
  if (typeof window === "undefined") return;
  deleteCookie(STORE_AUTH_CONTEXT_KEY);
  console.debug("[clearStoreAuthContext] done");
};

/**
 * Check if context exists
 */
export const hasStoreAuthContext = (): boolean =>
  getStoreAuthContext() !== null;

/**
 * Get redirect URL from context or fallback
 */
export const getStoreRedirectUrl = (fallbackUrl?: string): string => {
  const context = getStoreAuthContext();
  if (context.fullUrl) return context.fullUrl;
  if (context?.redirectUrl) return context.redirectUrl;
  if (context?.storeSubdomain) return `/store/${context.storeSubdomain}`;
  return fallbackUrl || "/findyourplug/dashboard";
};

/**
 * Manual browser test sequence
 * Run in console after importing this module
 */
export const __testCookieFlow = () => {
  console.group("== Cookie Test ==");

  console.log("Step 1: set context");
  setStoreAuthContext({
    storeSubdomain: "alpha",
    storeName: "Alpha Store",
    redirectUrl: "/store/alpha/dashboard",
  });

  console.log("Step 2: immediate read");
  console.log("document.cookie:", document.cookie);
  console.log("context:", getStoreAuthContext());

  setTimeout(() => {
    console.log("Step 3: delayed read (5s)");
    console.log(getStoreAuthContext());
  }, 5000);

  setTimeout(() => {
    console.log("Step 4: clear context (10s)");
    clearStoreAuthContext();
    console.log("document.cookie after clear:", document.cookie);
    console.groupEnd();
  }, 10000);
};
