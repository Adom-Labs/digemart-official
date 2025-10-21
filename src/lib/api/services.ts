/**
 * API Services - Centralized API calls using axios
 * Following the repository pattern for clean separation of concerns
 */

import apiClient from './client';
import {
  ApiResponse,
  StoreDiscoveryDto,
  TrendingStoreDto,
  TopVendorDto,
  MarketplaceStatsDto,
  CategoryResponseDto,
  ReviewResponseDto,
  EntryPageDataDto,
  DiscoveryQueryParams,
  TrendingQueryParams,
  EntryPageQueryParams,
  DashboardOverviewDto,
} from './types';

// Discovery API Services
export const discoveryApi = {
  getFeaturedStores: async (
    params?: DiscoveryQueryParams
  ): Promise<ApiResponse<StoreDiscoveryDto[]>> => {
    const response = await apiClient.get('/discovery/featured-stores', {
      params,
    });
    return response.data;
  },

  getTrendingStores: async (
    params?: TrendingQueryParams
  ): Promise<ApiResponse<TrendingStoreDto[]>> => {
    const response = await apiClient.get('/discovery/trending-stores', {
      params,
    });
    return response.data;
  },

  getTopVendors: async (
    params?: DiscoveryQueryParams
  ): Promise<ApiResponse<TopVendorDto[]>> => {
    const response = await apiClient.get('/discovery/top-vendors', { params });
    return response.data;
  },

  getMarketplaceStats: async (): Promise<ApiResponse<MarketplaceStatsDto>> => {
    const response = await apiClient.get('/discovery/stats');
    return response.data;
  },
};

// Entry Page API Services
export const entryPageApi = {
  getEntryPageData: async (
    params?: EntryPageQueryParams
  ): Promise<ApiResponse<EntryPageDataDto>> => {
    const response = await apiClient.get('/entry-page', { params });
    return response.data;
  },

  getMinimalEntryPageData: async (): Promise<ApiResponse<EntryPageDataDto>> => {
    const response = await apiClient.get('/entry-page/minimal');
    return response.data;
  },
};

// Category API Services
export const categoryApi = {
  getAll: async (
    params?: Record<string, unknown>
  ): Promise<ApiResponse<CategoryResponseDto[]>> => {
    const response = await apiClient.get('/categories', { params });
    return response.data;
  },

  getFeatured: async (
    params?: Record<string, unknown>
  ): Promise<ApiResponse<CategoryResponseDto[]>> => {
    const response = await apiClient.get('/categories/featured', { params });
    return response.data;
  },

  getTrending: async (
    params?: Record<string, unknown>
  ): Promise<ApiResponse<CategoryResponseDto[]>> => {
    const response = await apiClient.get('/categories/trending', { params });
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<CategoryResponseDto>> => {
    const response = await apiClient.get(`/categories/${id}`);
    return response.data;
  },

  getBySlug: async (
    slug: string
  ): Promise<ApiResponse<CategoryResponseDto>> => {
    const response = await apiClient.get(`/categories/slug/${slug}`);
    return response.data;
  },
};

// Review API Services
export const reviewApi = {
  getAll: async (
    params?: Record<string, unknown>
  ): Promise<ApiResponse<ReviewResponseDto[]>> => {
    const response = await apiClient.get('/reviews', { params });
    return response.data;
  },

  getRecent: async (
    limit?: number
  ): Promise<ApiResponse<ReviewResponseDto[]>> => {
    const response = await apiClient.get('/reviews/recent', {
      params: limit ? { limit } : undefined,
    });
    return response.data;
  },

  getByStore: async (
    storeId: number,
    params?: Record<string, unknown>
  ): Promise<ApiResponse<ReviewResponseDto[]>> => {
    const response = await apiClient.get(`/reviews/store/${storeId}`, {
      params,
    });
    return response.data;
  },

  getByProduct: async (
    productId: number,
    params?: Record<string, unknown>
  ): Promise<ApiResponse<ReviewResponseDto[]>> => {
    const response = await apiClient.get(`/reviews/product/${productId}`, {
      params,
    });
    return response.data;
  },
};

// Store API Services
export const storeApi = {
  getAll: async (
    params?: Record<string, unknown>
  ): Promise<ApiResponse<StoreDiscoveryDto[]>> => {
    const response = await apiClient.get('/stores', { params });
    return response.data;
  },

  getFeatured: async (
    params?: Record<string, unknown>
  ): Promise<ApiResponse<StoreDiscoveryDto[]>> => {
    const response = await apiClient.get('/stores/featured', { params });
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<StoreDiscoveryDto>> => {
    const response = await apiClient.get(`/stores/${id}`);
    return response.data;
  },

  getBySlug: async (slug: string): Promise<ApiResponse<StoreDiscoveryDto>> => {
    const response = await apiClient.get(`/stores/slug/${slug}`);
    return response.data;
  },
};

// Dashboard API Services
export const dashboardApi = {
  getOverview: async (): Promise<ApiResponse<DashboardOverviewDto>> => {
    const response = await apiClient.post('/dashboard/overview');
    return response.data;
  },
};
