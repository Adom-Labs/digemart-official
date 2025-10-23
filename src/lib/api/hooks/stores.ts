import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../client";

export interface Store {
  id: number;
  storeName: string;
  storeSlug: string;
  email: string;
  phone?: string;
  storeAddress: string;
  storeLocationState: string;
  storeLocationCity: string;
  storeTimeOpen?: string;
  storeTimeClose?: string;
  storeWeekOpen?: string;
  storeWeekClose?: string;
  logo?: string;
  storeHeroHeadline?: string;
  storeHeroTagline?: string;
  storeHeroImage?: string;
  storeCoverPhoto?: string;
  storeDescription?: string;
  storeUrl?: string;
  storeType: "INTERNAL" | "EXTERNAL";
  status: "ACTIVE" | "PENDING" | "SUSPENDED";
  verified: boolean;
  featured: boolean;
  averageRating: number;
  totalRatings: number;
  views: number;
  likes: number;
  subdomain?: string;
  customDomain?: string;
  isSubdomainActive: boolean;
  themeConfig?: Record<string, any>;
  layoutConfig?: Record<string, any>;
  seoConfig?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  owner: {
    id: number;
    name: string;
    image?: string;
    identities: Array<{
      email: string;
    }>;
  };
  storeCategory?: {
    id: number;
    name: string;
    slug: string;
  };
}

export interface StoreStats {
  products: number;
  orders: number;
  reviews: number;
  revenue: number;
  views: number;
  averageRating: number;
  totalRatings: number;
}

export interface CreateStoreData {
  storeName: string;
  email: string;
  phone?: string;
  storeAddress: string;
  storeLocationState: string;
  storeLocationCity: string;
  storeDescription?: string;
  storeType: "INTERNAL" | "EXTERNAL";
  storeCategoryId?: number;
  subdomain?: string;
  storeTimeOpen?: string;
  storeTimeClose?: string;
  storeWeekOpen?: string;
  storeWeekClose?: string;
}

export interface UpdateStoreData extends Partial<CreateStoreData> {}

export interface StoreQuery {
  search?: string;
  storeType?: "INTERNAL" | "EXTERNAL";
  status?: "ACTIVE" | "PENDING" | "SUSPENDED";
  categoryId?: number;
  state?: string;
  city?: string;
  verified?: boolean;
  featured?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

// Query keys
export const storeKeys = {
  all: ["stores"] as const,
  lists: () => [...storeKeys.all, "list"] as const,
  list: (params?: StoreQuery) => [...storeKeys.lists(), params] as const,
  details: () => [...storeKeys.all, "detail"] as const,
  detail: (id: number) => [...storeKeys.details(), id] as const,
  stats: (id: number) => [...storeKeys.all, "stats", id] as const,
  myStores: () => [...storeKeys.all, "my-stores"] as const,
};

// Get user's stores
export function useMyStores(params?: StoreQuery) {
  return useQuery({
    queryKey: storeKeys.list(params),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, value.toString());
          }
        });
      }

      const response = await client.get(
        `/stores/my-stores?${searchParams.toString()}`
      );
      return response.data.data.stores as Store[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get store by ID
export function useStore(id: number) {
  return useQuery({
    queryKey: storeKeys.detail(id),
    queryFn: async () => {
      const response = await client.get(`/stores/${id}`);
      return response.data.data as Store;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Get store statistics
export function useStoreStats(id: number) {
  return useQuery({
    queryKey: storeKeys.stats(id),
    queryFn: async () => {
      const response = await client.get(`/stores/${id}/stats`);
      return response.data as StoreStats;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Create store mutation
export function useCreateStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateStoreData) => {
      const response = await client.post("/stores", data);
      return response.data as Store;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storeKeys.lists() });
    },
  });
}

// Update store mutation
export function useUpdateStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateStoreData }) => {
      const response = await client.patch(`/stores/${id}`, data);
      return response.data as Store;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: storeKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: storeKeys.lists() });
    },
  });
}

// Delete store mutation
export function useDeleteStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await client.delete(`/stores/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storeKeys.lists() });
    },
  });
}
