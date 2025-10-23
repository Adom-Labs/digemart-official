/**
 * Store Authentication Context Utilities
 *
 * Manages localStorage flags to track user authentication intent
 * when using OAuth providers that require server-side redirects.
 */

const STORE_AUTH_CONTEXT_KEY = "digemart_store_auth_context";

export interface StoreAuthContext {
  storeSubdomain: string;
  storeName: string;
  redirectUrl?: string;
  timestamp: number;
}

/**
 * Set store authentication context before OAuth redirect
 */
export const setStoreAuthContext = (
  context: Omit<StoreAuthContext, "timestamp">
) => {
  if (typeof window === "undefined") return;

  const contextWithTimestamp: StoreAuthContext = {
    ...context,
    timestamp: Date.now(),
  };

  localStorage.setItem(
    STORE_AUTH_CONTEXT_KEY,
    JSON.stringify(contextWithTimestamp)
  );
};

/**
 * Get store authentication context after OAuth callback
 */
export const getStoreAuthContext = (): StoreAuthContext | null => {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(STORE_AUTH_CONTEXT_KEY);
    if (!stored) return null;

    const context: StoreAuthContext = JSON.parse(stored);

    // Check if context is expired (older than 10 minutes)
    const isExpired = Date.now() - context.timestamp > 10 * 60 * 1000;
    if (isExpired) {
      clearStoreAuthContext();
      return null;
    }

    return context;
  } catch (error) {
    console.error("Error parsing store auth context:", error);
    clearStoreAuthContext();
    return null;
  }
};

/**
 * Clear store authentication context
 */
export const clearStoreAuthContext = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORE_AUTH_CONTEXT_KEY);
};

/**
 * Check if there's an active store authentication context
 */
export const hasStoreAuthContext = (): boolean => {
  return getStoreAuthContext() !== null;
};

/**
 * Get the redirect URL from store context or fallback
 */
export const getStoreRedirectUrl = (fallbackUrl?: string): string => {
  const context = getStoreAuthContext();

  if (context?.redirectUrl) {
    return context.redirectUrl;
  }

  if (context?.storeSubdomain) {
    return `/store/${context.storeSubdomain}`;
  }

  return fallbackUrl || "/findyourplug/dashboard";
};
