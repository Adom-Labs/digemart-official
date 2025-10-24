"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { useSession } from "next-auth/react";
import { useStoreCart } from "@/lib/api/hooks";
import { Cart } from "@/lib/api/types";
import {
  getGuestCart,
  getGuestCartItemCount,
  GuestCart,
} from "@/lib/utils/guest-cart";

interface StoreCartContextType {
  cart: Cart | undefined;
  guestCart: GuestCart | null;
  storeId: number;
  isLoading: boolean;
  error: Error | null;
  itemCount: number;
  totalAmount: number;
  isAuthenticated: boolean;
}

const StoreCartContext = createContext<StoreCartContextType | undefined>(
  undefined
);

interface StoreCartProviderProps {
  children: ReactNode;
  storeId: number;
}

export function StoreCartProvider({
  children,
  storeId,
}: StoreCartProviderProps) {
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;

  // Only fetch user cart if authenticated
  const {
    data: cart,
    isLoading,
    error,
  } = useStoreCart(storeId, {
    enabled: isAuthenticated,
  });

  // Guest cart state
  const [guestCart, setGuestCart] = useState<GuestCart | null>(null);
  const [guestItemCount, setGuestItemCount] = useState(0);

  // Update guest cart state when storeId changes or on mount
  useEffect(() => {
    if (!isAuthenticated) {
      const currentGuestCart = getGuestCart(storeId);
      setGuestCart(currentGuestCart);
      setGuestItemCount(getGuestCartItemCount(storeId));
    }
  }, [storeId, isAuthenticated]);

  // Listen for localStorage changes (cross-tab synchronization)
  useEffect(() => {
    if (!isAuthenticated) {
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === "digemart_guest_cart") {
          const currentGuestCart = getGuestCart(storeId);
          setGuestCart(currentGuestCart);
          setGuestItemCount(getGuestCartItemCount(storeId));
        }
      };

      window.addEventListener("storage", handleStorageChange);
      return () => window.removeEventListener("storage", handleStorageChange);
    }
  }, [storeId, isAuthenticated]);

  const contextValue: StoreCartContextType = {
    cart,
    guestCart,
    storeId,
    isLoading,
    error,
    itemCount: isAuthenticated ? cart?.totals?.itemCount || 0 : guestItemCount,
    totalAmount: isAuthenticated ? cart?.totals?.total || 0 : 0, // Guest cart doesn't calculate totals (no pricing data)
    isAuthenticated,
  };

  return (
    <StoreCartContext.Provider value={contextValue}>
      {children}
    </StoreCartContext.Provider>
  );
}

export function useStoreCartContext() {
  const context = useContext(StoreCartContext);
  if (context === undefined) {
    throw new Error(
      "useStoreCartContext must be used within a StoreCartProvider"
    );
  }
  return context;
}

// Hook for components that need store ID
export function useCurrentStoreId() {
  const context = useContext(StoreCartContext);
  return context?.storeId;
}
