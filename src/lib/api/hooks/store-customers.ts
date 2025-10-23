import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  storeCustomerApi,
  StoreCustomer,
  StoreCustomerMetrics,
  StoreCustomerQuery,
} from "../store-customers";
import { queryKeys } from "../query-keys";

// Use centralized query keys
export const storeCustomerKeys = queryKeys.storeCustomers;

/**
 * Hook to get store customers with pagination and filtering
 * Follows existing patterns from stores.ts with proper caching
 */
export function useStoreCustomers(
  storeId: number,
  params?: StoreCustomerQuery
) {
  return useQuery({
    queryKey: storeCustomerKeys.list(storeId, params),
    queryFn: async () => {
      const response = await storeCustomerApi.getStoreCustomers(
        storeId,
        params
      );
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes - frequent updates for customer data
    enabled: !!storeId && storeId > 0,
  });
}

/**
 * Hook to get store customer metrics and analytics
 * Longer cache time for metrics as they change less frequently
 */
export function useStoreCustomerMetrics(storeId: number) {
  return useQuery({
    queryKey: storeCustomerKeys.metrics(storeId),
    queryFn: async () => {
      const response = await storeCustomerApi.getStoreCustomerMetrics(storeId);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - metrics update less frequently
    enabled: !!storeId && storeId > 0,
  });
}

/**
 * Hook to get current user's store profile
 * Longer cache time for user profile data
 */
export function useUserStoreProfile(storeId: number) {
  return useQuery({
    queryKey: storeCustomerKeys.profile(storeId),
    queryFn: async () => {
      const response = await storeCustomerApi.getUserStoreProfile(storeId);
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - user profile changes infrequently
    enabled: !!storeId && storeId > 0,
  });
}

/**
 * Hook to get individual customer details (for store owners)
 * Used in customer management interfaces
 */
export function useStoreCustomer(storeId: number, customerId: number) {
  return useQuery({
    queryKey: storeCustomerKeys.detail(storeId, customerId),
    queryFn: async () => {
      const response = await storeCustomerApi.getCustomerById(
        storeId,
        customerId
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - individual customer data
    enabled: !!storeId && storeId > 0 && !!customerId && customerId > 0,
  });
}

/**
 * Mutation hook to update store preferences
 * Follows existing mutation patterns with proper cache invalidation
 */
export function useUpdateStorePreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      storeId,
      preferences,
    }: {
      storeId: number;
      preferences: Record<string, any>;
    }) => {
      return await storeCustomerApi.updateStorePreferences(
        storeId,
        preferences
      );
    },
    onSuccess: (_, { storeId }) => {
      // Invalidate user store profile to refresh preferences
      queryClient.invalidateQueries({
        queryKey: storeCustomerKeys.profile(storeId),
      });
      // Also invalidate customer lists as preferences might affect display
      queryClient.invalidateQueries({
        queryKey: storeCustomerKeys.lists(storeId),
      });
    },
  });
}

/**
 * Mutation hook to update marketing consent
 * Invalidates related customer data and metrics
 */
export function useUpdateMarketingConsent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      storeId,
      consent,
    }: {
      storeId: number;
      consent: boolean;
    }) => {
      return await storeCustomerApi.updateMarketingConsent(storeId, consent);
    },
    onSuccess: (_, { storeId }) => {
      // Invalidate user store profile and customer metrics
      queryClient.invalidateQueries({
        queryKey: storeCustomerKeys.profile(storeId),
      });
      queryClient.invalidateQueries({
        queryKey: storeCustomerKeys.metrics(storeId),
      });
      // Also invalidate customer lists as consent affects customer data
      queryClient.invalidateQueries({
        queryKey: storeCustomerKeys.lists(storeId),
      });
    },
  });
}

/**
 * Mutation hook to export customer data
 * Returns download URL for customer data export
 */
export function useExportCustomers() {
  return useMutation({
    mutationFn: async ({
      storeId,
      query,
    }: {
      storeId: number;
      query?: StoreCustomerQuery;
    }) => {
      const response = await storeCustomerApi.exportCustomers(storeId, query);
      return response.data;
    },
    // No cache invalidation needed for export operations
  });
}

/**
 * Helper hook to prefetch store customer data
 * Useful for optimistic loading when navigating to customer pages
 */
export function usePrefetchStoreCustomers() {
  const queryClient = useQueryClient();

  return {
    prefetchCustomers: (storeId: number, params?: StoreCustomerQuery) => {
      if (!storeId || storeId <= 0) return;

      queryClient.prefetchQuery({
        queryKey: storeCustomerKeys.list(storeId, params),
        queryFn: async () => {
          const response = await storeCustomerApi.getStoreCustomers(
            storeId,
            params
          );
          return response.data;
        },
        staleTime: 2 * 60 * 1000,
      });
    },
    prefetchMetrics: (storeId: number) => {
      if (!storeId || storeId <= 0) return;

      queryClient.prefetchQuery({
        queryKey: storeCustomerKeys.metrics(storeId),
        queryFn: async () => {
          const response = await storeCustomerApi.getStoreCustomerMetrics(
            storeId
          );
          return response.data;
        },
        staleTime: 5 * 60 * 1000,
      });
    },
    prefetchProfile: (storeId: number) => {
      if (!storeId || storeId <= 0) return;

      queryClient.prefetchQuery({
        queryKey: storeCustomerKeys.profile(storeId),
        queryFn: async () => {
          const response = await storeCustomerApi.getUserStoreProfile(storeId);
          return response.data;
        },
        staleTime: 10 * 60 * 1000,
      });
    },
  };
}

/**
 * Helper hook to invalidate store customer cache
 * Provides granular cache invalidation for different scenarios
 */
export function useInvalidateStoreCustomers() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: (storeId: number) => {
      if (!storeId || storeId <= 0) return;

      queryClient.invalidateQueries({
        queryKey: storeCustomerKeys.all(storeId),
      });
    },
    invalidateList: (storeId: number) => {
      if (!storeId || storeId <= 0) return;

      queryClient.invalidateQueries({
        queryKey: storeCustomerKeys.lists(storeId),
      });
    },
    invalidateMetrics: (storeId: number) => {
      if (!storeId || storeId <= 0) return;

      queryClient.invalidateQueries({
        queryKey: storeCustomerKeys.metrics(storeId),
      });
    },
    invalidateProfile: (storeId: number) => {
      if (!storeId || storeId <= 0) return;

      queryClient.invalidateQueries({
        queryKey: storeCustomerKeys.profile(storeId),
      });
    },
    invalidateCustomer: (storeId: number, customerId: number) => {
      if (!storeId || storeId <= 0 || !customerId || customerId <= 0) return;

      queryClient.invalidateQueries({
        queryKey: storeCustomerKeys.detail(storeId, customerId),
      });
    },
  };
}

/**
 * Hook for optimistic customer data updates
 * Useful for immediate UI feedback while mutations are processing
 */
export function useOptimisticCustomerUpdates() {
  const queryClient = useQueryClient();

  return {
    updateCustomerOptimistically: (
      storeId: number,
      customerId: number,
      updater: (old: StoreCustomer | undefined) => StoreCustomer | undefined
    ) => {
      queryClient.setQueryData(
        storeCustomerKeys.detail(storeId, customerId),
        updater
      );
    },
    updateMetricsOptimistically: (
      storeId: number,
      updater: (
        old: StoreCustomerMetrics | undefined
      ) => StoreCustomerMetrics | undefined
    ) => {
      queryClient.setQueryData(storeCustomerKeys.metrics(storeId), updater);
    },
  };
}

/**
 * Hook to check if customer data is loading
 * Useful for showing loading states across multiple components
 */
export function useStoreCustomerLoadingState(storeId: number) {
  const queryClient = useQueryClient();

  const customersQueryState = queryClient.getQueryState(
    storeCustomerKeys.lists(storeId)
  );

  const metricsQueryState = queryClient.getQueryState(
    storeCustomerKeys.metrics(storeId)
  );

  return {
    isLoadingCustomers: customersQueryState?.fetchStatus === "fetching",
    isLoadingMetrics: metricsQueryState?.fetchStatus === "fetching",
    isLoadingAny:
      customersQueryState?.fetchStatus === "fetching" ||
      metricsQueryState?.fetchStatus === "fetching",
    hasCustomersData: !!customersQueryState?.data,
    hasMetricsData: !!metricsQueryState?.data,
  };
}

/**
 * Compound hook that provides all customer-related data for a store
 * Useful for dashboard components that need multiple data sources
 */
export function useStoreCustomerData(
  storeId: number,
  customerQuery?: StoreCustomerQuery
) {
  const customers = useStoreCustomers(storeId, customerQuery);
  const metrics = useStoreCustomerMetrics(storeId);
  const profile = useUserStoreProfile(storeId);

  return {
    customers,
    metrics,
    profile,
    isLoading: customers.isLoading || metrics.isLoading || profile.isLoading,
    isError: customers.isError || metrics.isError || profile.isError,
    error: customers.error || metrics.error || profile.error,
  };
}
