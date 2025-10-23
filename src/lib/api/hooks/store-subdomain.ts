/**
 * React Query Hooks for Store Subdomain Operations
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import {
  subdomainApi,
  StoreSubdomainData,
  SubdomainAvailability,
} from "../subdomain";
import { storeThemeApi, StoreTheme } from "../store-themes";
import { storeContentApi, StoreLayout } from "../store-content";
import { queryKeys } from "../query-keys";

// Subdomain Hooks
export const useStoreBySubdomain = (
  subdomain: string,
  options?: UseQueryOptions<StoreSubdomainData, Error>
) => {
  return useQuery({
    queryKey: queryKeys.stores.bySubdomain(subdomain),
    queryFn: () => subdomainApi.getStoreBySubdomain(subdomain),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!subdomain && subdomain.length >= 3,
    ...options,
  });
};

export const usePublicStoreData = (
  storeId: number,
  options?: UseQueryOptions<StoreSubdomainData, Error>
) => {
  return useQuery({
    queryKey: queryKeys.stores.publicData(storeId),
    queryFn: () => subdomainApi.getPublicStoreData(storeId),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!storeId,
    ...options,
  });
};

export const useCheckSubdomainAvailability = (subdomain: string) => {
  return useQuery({
    queryKey: queryKeys.stores.subdomainAvailability(subdomain),
    queryFn: () => subdomainApi.checkSubdomainAvailability(subdomain),
    staleTime: 30 * 1000, // 30 seconds
    enabled: !!subdomain && subdomain.length >= 3,
    retry: false, // Don't retry availability checks
  });
};

export const useUpdateStoreSubdomain = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      storeId,
      subdomain,
    }: {
      storeId: number;
      subdomain: string;
    }) => subdomainApi.updateStoreSubdomain(storeId, subdomain),
    onSuccess: (data, { storeId, subdomain }) => {
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.stores.byId(storeId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.stores.bySubdomain(subdomain),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.stores.subdomainAvailability(subdomain),
      });
    },
    onError: (error) => {
      console.error("Failed to update subdomain:", error);
    },
  });
};

export const useActivateSubdomain = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      storeId,
      isActive,
    }: {
      storeId: number;
      isActive: boolean;
    }) => subdomainApi.activateSubdomain(storeId, isActive),
    onSuccess: (data, { storeId }) => {
      // Invalidate store queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.stores.byId(storeId),
      });
      if (data.subdomain) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.stores.bySubdomain(data.subdomain),
        });
      }
    },
    onError: (error) => {
      console.error("Failed to activate subdomain:", error);
    },
  });
};

// Theme Hooks
export const useStoreTheme = (
  storeId: number,
  options?: UseQueryOptions<StoreTheme, Error>
) => {
  return useQuery({
    queryKey: queryKeys.stores.theme(storeId),
    queryFn: () => storeThemeApi.getStoreTheme(storeId),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!storeId,
    ...options,
  });
};

export const useThemeTemplates = () => {
  return useQuery({
    queryKey: queryKeys.themes.templates,
    queryFn: () => storeThemeApi.getThemeTemplates(),
    staleTime: 60 * 60 * 1000, // 1 hour (templates don't change often)
  });
};

export const useUpdateStoreTheme = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ storeId, theme }: { storeId: number; theme: StoreTheme }) =>
      storeThemeApi.updateStoreTheme(storeId, theme),
    onSuccess: (_, { storeId }) => {
      // Invalidate theme and store queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.stores.theme(storeId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.stores.byId(storeId),
      });
    },
    onError: (error) => {
      console.error("Failed to update theme:", error);
    },
  });
};

// Layout Hooks
export const useStoreLayout = (
  storeId: number,
  options?: UseQueryOptions<StoreLayout, Error>
) => {
  return useQuery({
    queryKey: queryKeys.stores.layout(storeId),
    queryFn: () => storeContentApi.getStoreLayout(storeId),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!storeId,
    ...options,
  });
};

export const useComponentTemplates = () => {
  return useQuery({
    queryKey: queryKeys.content.templates,
    queryFn: () => storeContentApi.getComponentTemplates(),
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

export const useUpdateStoreLayout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      storeId,
      layout,
    }: {
      storeId: number;
      layout: StoreLayout;
    }) => storeContentApi.updateStoreLayout(storeId, layout),
    onSuccess: (_, { storeId }) => {
      // Invalidate layout and store queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.stores.layout(storeId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.stores.byId(storeId),
      });
    },
    onError: (error) => {
      console.error("Failed to update layout:", error);
    },
  });
};

export const useCreateSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ storeId, section }: { storeId: number; section: any }) =>
      storeContentApi.createSection(storeId, section),
    onSuccess: (_, { storeId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.stores.layout(storeId),
      });
    },
  });
};

export const useUpdateSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      storeId,
      sectionId,
      updates,
    }: {
      storeId: number;
      sectionId: string;
      updates: any;
    }) => storeContentApi.updateSection(storeId, sectionId, updates),
    onSuccess: (_, { storeId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.stores.layout(storeId),
      });
    },
  });
};

export const useDeleteSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      storeId,
      sectionId,
    }: {
      storeId: number;
      sectionId: string;
    }) => storeContentApi.deleteSection(storeId, sectionId),
    onSuccess: (_, { storeId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.stores.layout(storeId),
      });
    },
  });
};

export const useReorderSections = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      storeId,
      sectionIds,
    }: {
      storeId: number;
      sectionIds: string[];
    }) => storeContentApi.reorderSections(storeId, sectionIds),
    onSuccess: (_, { storeId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.stores.layout(storeId),
      });
    },
  });
};
