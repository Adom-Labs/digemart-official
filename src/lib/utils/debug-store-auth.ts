/**
 * Debug utilities for store authentication context
 * Only available in development mode
 */

import {
  getStoreAuthContext,
  clearStoreAuthContext,
  setStoreAuthContext,
} from "./store-auth-context";

export const debugStoreAuth = {
  /**
   * Log current store auth context to console
   */
  logContext: () => {
    if (process.env.NODE_ENV !== "development") return;

    const context = getStoreAuthContext();
    console.log("🏪 Store Auth Context:", context);
  },

  /**
   * Simulate setting store context (for testing)
   */
  setTestContext: (storeSubdomain: string, storeName: string) => {
    if (process.env.NODE_ENV !== "development") return;

    setStoreAuthContext({
      storeSubdomain,
      storeName,
      redirectUrl: `/store/${storeSubdomain}`,
    });
    console.log("🧪 Test context set for:", storeName);
  },

  /**
   * Clear context and log
   */
  clearContext: () => {
    if (process.env.NODE_ENV !== "development") return;

    clearStoreAuthContext();
    console.log("🧹 Store auth context cleared");
  },

  /**
   * Check if context exists
   */
  hasContext: () => {
    if (process.env.NODE_ENV !== "development") return false;

    const hasContext = getStoreAuthContext() !== null;
    console.log("🔍 Has store context:", hasContext);
    return hasContext;
  },
};

// Make available globally in development
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  (window as any).debugStoreAuth = debugStoreAuth;
}
