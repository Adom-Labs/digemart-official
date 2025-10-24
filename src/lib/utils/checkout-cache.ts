/**
 * Checkout data caching utilities for performance optimization
 */

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface CheckoutCacheData {
  customerInfo?: {
    name: string;
    email: string;
    phone?: string;
  };
  shippingAddress?: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string;
  };
  paymentMethod?: {
    type: "card" | "bank_transfer" | "wallet";
    gateway: "paystack" | "flutterwave" | "basepay";
  };
  storeContext?: {
    storeId: number;
    storeName: string;
    currency: string;
    policies: Record<string, unknown>;
  };
}

export class CheckoutCache {
  private static readonly CACHE_PREFIX = "checkout_cache_";
  private static readonly DEFAULT_TTL = 30 * 60 * 1000; // 30 minutes
  private static readonly STORAGE_KEY = "checkout_session_data";

  /**
   * Cache checkout data with automatic expiration
   */
  static set<K extends keyof CheckoutCacheData>(
    key: K,
    data: CheckoutCacheData[K],
    ttl: number = this.DEFAULT_TTL
  ): void {
    try {
      const cacheItem: CacheItem<CheckoutCacheData[K]> = {
        data,
        timestamp: Date.now(),
        expiresAt: Date.now() + ttl,
      };

      const cacheKey = `${this.CACHE_PREFIX}${key}`;

      // Use sessionStorage for checkout data (cleared when tab closes)
      if (typeof window !== "undefined") {
        sessionStorage.setItem(cacheKey, JSON.stringify(cacheItem));
      }
    } catch (error) {
      console.warn("Failed to cache checkout data:", error);
    }
  }

  /**
   * Retrieve cached checkout data
   */
  static get<K extends keyof CheckoutCacheData>(
    key: K
  ): CheckoutCacheData[K] | null {
    try {
      if (typeof window === "undefined") {
        return null;
      }

      const cacheKey = `${this.CACHE_PREFIX}${key}`;
      const cached = sessionStorage.getItem(cacheKey);

      if (!cached) {
        return null;
      }

      const cacheItem: CacheItem<CheckoutCacheData[K]> = JSON.parse(cached);

      // Check if cache has expired
      if (Date.now() > cacheItem.expiresAt) {
        this.remove(key);
        return null;
      }

      return cacheItem.data;
    } catch (error) {
      console.warn("Failed to retrieve cached checkout data:", error);
      return null;
    }
  }

  /**
   * Remove cached data
   */
  static remove<K extends keyof CheckoutCacheData>(key: K): void {
    try {
      if (typeof window !== "undefined") {
        const cacheKey = `${this.CACHE_PREFIX}${key}`;
        sessionStorage.removeItem(cacheKey);
      }
    } catch (error) {
      console.warn("Failed to remove cached checkout data:", error);
    }
  }

  /**
   * Clear all checkout cache
   */
  static clear(): void {
    try {
      if (typeof window !== "undefined") {
        const keys = Object.keys(sessionStorage);
        keys.forEach((key) => {
          if (key.startsWith(this.CACHE_PREFIX)) {
            sessionStorage.removeItem(key);
          }
        });
      }
    } catch (error) {
      console.warn("Failed to clear checkout cache:", error);
    }
  }

  /**
   * Cache entire checkout session data
   */
  static setSessionData(data: Partial<CheckoutCacheData>): void {
    try {
      if (typeof window !== "undefined") {
        const sessionData = {
          ...data,
          timestamp: Date.now(),
          expiresAt: Date.now() + this.DEFAULT_TTL,
        };
        sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessionData));
      }
    } catch (error) {
      console.warn("Failed to cache session data:", error);
    }
  }

  /**
   * Retrieve entire checkout session data
   */
  static getSessionData(): Partial<CheckoutCacheData> | null {
    try {
      if (typeof window === "undefined") {
        return null;
      }

      const cached = sessionStorage.getItem(this.STORAGE_KEY);
      if (!cached) {
        return null;
      }

      const sessionData = JSON.parse(cached);

      // Check if session has expired
      if (Date.now() > sessionData.expiresAt) {
        this.clearSessionData();
        return null;
      }

      // Remove metadata before returning
      const { timestamp, expiresAt, ...data } = sessionData;
      return data;
    } catch (error) {
      console.warn("Failed to retrieve session data:", error);
      return null;
    }
  }

  /**
   * Clear session data
   */
  static clearSessionData(): void {
    try {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem(this.STORAGE_KEY);
      }
    } catch (error) {
      console.warn("Failed to clear session data:", error);
    }
  }

  /**
   * Update session data partially
   */
  static updateSessionData(updates: Partial<CheckoutCacheData>): void {
    const existing = this.getSessionData() || {};
    const updated = { ...existing, ...updates };
    this.setSessionData(updated);
  }

  /**
   * Check if cache is available
   */
  static isAvailable(): boolean {
    try {
      if (typeof window === "undefined") {
        return false;
      }

      const testKey = "checkout_cache_test";
      sessionStorage.setItem(testKey, "test");
      sessionStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get cache statistics
   */
  static getStats(): {
    totalItems: number;
    totalSize: number;
    oldestItem: number | null;
    newestItem: number | null;
  } {
    const stats = {
      totalItems: 0,
      totalSize: 0,
      oldestItem: null as number | null,
      newestItem: null as number | null,
    };

    try {
      if (typeof window === "undefined") {
        return stats;
      }

      const keys = Object.keys(sessionStorage);
      const checkoutKeys = keys.filter((key) =>
        key.startsWith(this.CACHE_PREFIX)
      );

      stats.totalItems = checkoutKeys.length;

      checkoutKeys.forEach((key) => {
        const value = sessionStorage.getItem(key);
        if (value) {
          stats.totalSize += value.length;

          try {
            const cacheItem = JSON.parse(value);
            if (cacheItem.timestamp) {
              if (
                stats.oldestItem === null ||
                cacheItem.timestamp < stats.oldestItem
              ) {
                stats.oldestItem = cacheItem.timestamp;
              }
              if (
                stats.newestItem === null ||
                cacheItem.timestamp > stats.newestItem
              ) {
                stats.newestItem = cacheItem.timestamp;
              }
            }
          } catch {
            // Ignore invalid cache items
          }
        }
      });
    } catch (error) {
      console.warn("Failed to get cache stats:", error);
    }

    return stats;
  }
}

/**
 * React hook for checkout caching
 */
export function useCheckoutCache() {
  const setCache = <K extends keyof CheckoutCacheData>(
    key: K,
    data: CheckoutCacheData[K],
    ttl?: number
  ) => {
    CheckoutCache.set(key, data, ttl);
  };

  const getCache = <K extends keyof CheckoutCacheData>(
    key: K
  ): CheckoutCacheData[K] | null => {
    return CheckoutCache.get(key);
  };

  const removeCache = <K extends keyof CheckoutCacheData>(key: K) => {
    CheckoutCache.remove(key);
  };

  const clearCache = () => {
    CheckoutCache.clear();
  };

  const setSessionData = (data: Partial<CheckoutCacheData>) => {
    CheckoutCache.setSessionData(data);
  };

  const getSessionData = (): Partial<CheckoutCacheData> | null => {
    return CheckoutCache.getSessionData();
  };

  const updateSessionData = (updates: Partial<CheckoutCacheData>) => {
    CheckoutCache.updateSessionData(updates);
  };

  return {
    setCache,
    getCache,
    removeCache,
    clearCache,
    setSessionData,
    getSessionData,
    updateSessionData,
    isAvailable: CheckoutCache.isAvailable(),
    stats: CheckoutCache.getStats(),
  };
}
