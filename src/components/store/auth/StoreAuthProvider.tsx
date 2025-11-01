"use client";

import React, { createContext, useContext, ReactNode, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { User } from "next-auth";
import { useStore } from "../StoreProvider";
import {
  StoreCustomerProfile,
  StorePreferences,
  storeCustomerApi,
} from "@/lib/api/store-customers";

interface StoreAuthContextType {
  // Authentication state
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Store-specific data
  storeId: number;
  storeProfile: StoreCustomerProfile | null;
  isStoreCustomer: boolean;
  preferences: StorePreferences | null;

  // Loading states
  isProfileLoading: boolean;
  profileError: Error | null;

  // Helper methods
  hasStoreProfile: boolean;
  isFirstTimeCustomer: boolean;
}

const StoreAuthContext = createContext<StoreAuthContextType | undefined>(
  undefined
);

interface StoreAuthProviderProps {
  children: ReactNode;
}

export function StoreAuthProvider({ children }: StoreAuthProviderProps) {
  const { data: session, status } = useSession();
  const { store } = useStore();

  // Only get user's store profile if we have a session
  const shouldFetchProfile = !!session?.user && status === "authenticated";

  const {
    data: storeProfile,
    isLoading: isProfileLoading,
    error: profileError,
  } = useQuery({
    queryKey: ["store-customer-profile", store.id],
    queryFn: async () => {
      const response = await storeCustomerApi.getUserStoreProfile(store.id);
      return response.data;
    },
    enabled: shouldFetchProfile && !!store.id && store.id > 0,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const contextValue = useMemo<StoreAuthContextType>(() => {
    const user = session?.user || null;
    const isAuthenticated = !!user && status === "authenticated";
    const isLoading = status === "loading";

    // Store-specific authentication state
    const isStoreCustomer = isAuthenticated && !!storeProfile;
    const hasStoreProfile = !!storeProfile;
    const isFirstTimeCustomer = isAuthenticated && !storeProfile;

    // Extract preferences from store profile
    const preferences = storeProfile?.preferences || null;

    return {
      // Authentication state
      user,
      isAuthenticated,
      isLoading,

      // Store-specific data
      storeId: store.id,
      storeProfile: storeProfile || null,
      isStoreCustomer,
      preferences,

      // Loading states
      isProfileLoading,
      profileError: profileError as Error | null,

      // Helper methods
      hasStoreProfile,
      isFirstTimeCustomer,
    };
  }, [session, status, store.id, storeProfile, isProfileLoading, profileError]);

  return (
    <StoreAuthContext.Provider value={contextValue}>
      {children}
    </StoreAuthContext.Provider>
  );
}

export function useStoreAuth() {
  const context = useContext(StoreAuthContext);
  if (context === undefined) {
    throw new Error("useStoreAuth must be used within a StoreAuthProvider");
  }
  return context;
}

// Convenience hooks for common use cases
export function useStoreUser() {
  const { user, isAuthenticated, isLoading } = useStoreAuth();
  return { user, isAuthenticated, isLoading };
}

export function useStoreCustomerProfile() {
  const {
    storeProfile,
    isStoreCustomer,
    hasStoreProfile,
    isFirstTimeCustomer,
    isProfileLoading,
    profileError,
  } = useStoreAuth();

  return {
    profile: storeProfile,
    isStoreCustomer,
    hasStoreProfile,
    isFirstTimeCustomer,
    isLoading: isProfileLoading,
    error: profileError,
  };
}

export function useStorePreferences() {
  const { preferences, storeId } = useStoreAuth();
  return { preferences, storeId };
}

// Helper hook to check authentication requirements
export function useStoreAuthRequirement() {
  const { isAuthenticated, isLoading, user } = useStoreAuth();

  return {
    requiresAuth: !isAuthenticated && !isLoading,
    canProceed: isAuthenticated,
    isCheckingAuth: isLoading,
    user,
  };
}
