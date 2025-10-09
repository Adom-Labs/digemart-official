/**
 * React Query Hooks - Standard patterns for data fetching
 * Following TanStack Query best practices with proper error handling and caching
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { queryKeys } from './query-keys';
import {
  discoveryApi,
  entryPageApi,
  categoryApi,
  reviewApi,
  storeApi,
} from './services';
import { searchApi } from './search';
import {
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
  SearchResponseDto,
  SearchQueryParams,
} from './types';

// Discovery Hooks
export const useFeaturedStores = (
  params?: DiscoveryQueryParams,
  options?: UseQueryOptions<StoreDiscoveryDto[], Error>
) => {
  return useQuery({
    queryKey: queryKeys.discovery.featuredStores(params),
    queryFn: () =>
      discoveryApi.getFeaturedStores(params).then((res) => res.data),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

export const useTrendingStores = (
  params?: TrendingQueryParams,
  options?: UseQueryOptions<TrendingStoreDto[], Error>
) => {
  return useQuery({
    queryKey: queryKeys.discovery.trendingStores(params),
    queryFn: () =>
      discoveryApi.getTrendingStores(params).then((res) => res.data),
    staleTime: 2 * 60 * 1000, // 2 minutes (trending data changes frequently)
    ...options,
  });
};

export const useTopVendors = (
  params?: DiscoveryQueryParams,
  options?: UseQueryOptions<TopVendorDto[], Error>
) => {
  return useQuery({
    queryKey: queryKeys.discovery.topVendors(params),
    queryFn: () => discoveryApi.getTopVendors(params).then((res) => res.data),
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};

export const useMarketplaceStats = (
  options?: UseQueryOptions<MarketplaceStatsDto, Error>
) => {
  return useQuery({
    queryKey: queryKeys.discovery.stats,
    queryFn: () => discoveryApi.getMarketplaceStats().then((res) => res.data),
    staleTime: 15 * 60 * 1000, // 15 minutes (stats don't change often)
    ...options,
  });
};

// Entry Page Hooks
export const useEntryPageData = (
  params?: EntryPageQueryParams,
  options?: UseQueryOptions<EntryPageDataDto, Error>
) => {
  return useQuery({
    queryKey: queryKeys.entryPage.data(params),
    queryFn: () =>
      entryPageApi.getEntryPageData(params).then((res) => res.data),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

export const useMinimalEntryPageData = (
  options?: UseQueryOptions<EntryPageDataDto, Error>
) => {
  return useQuery({
    queryKey: queryKeys.entryPage.minimal,
    queryFn: () =>
      entryPageApi.getMinimalEntryPageData().then((res) => res.data),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

// Category Hooks
export const useCategories = (
  params?: Record<string, unknown>,
  options?: UseQueryOptions<CategoryResponseDto[], Error>
) => {
  return useQuery({
    queryKey: queryKeys.categories.all(params),
    queryFn: () => categoryApi.getAll(params).then((res) => res.data),
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};

export const useFeaturedCategories = (
  params?: Record<string, unknown>,
  options?: UseQueryOptions<CategoryResponseDto[], Error>
) => {
  return useQuery({
    queryKey: queryKeys.categories.featured(params),
    queryFn: () => categoryApi.getFeatured(params).then((res) => res.data),
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};

export const useTrendingCategories = (
  params?: Record<string, unknown>,
  options?: UseQueryOptions<CategoryResponseDto[], Error>
) => {
  return useQuery({
    queryKey: queryKeys.categories.trending(params),
    queryFn: () => categoryApi.getTrending(params).then((res) => res.data),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

export const useCategoryById = (
  id: number,
  options?: UseQueryOptions<CategoryResponseDto, Error>
) => {
  return useQuery({
    queryKey: queryKeys.categories.byId(id),
    queryFn: () => categoryApi.getById(id).then((res) => res.data),
    staleTime: 15 * 60 * 1000, // 15 minutes
    enabled: !!id,
    ...options,
  });
};

export const useCategoryBySlug = (
  slug: string,
  options?: UseQueryOptions<CategoryResponseDto, Error>
) => {
  return useQuery({
    queryKey: queryKeys.categories.bySlug(slug),
    queryFn: () => categoryApi.getBySlug(slug).then((res) => res.data),
    staleTime: 15 * 60 * 1000, // 15 minutes
    enabled: !!slug,
    ...options,
  });
};

// Review Hooks
export const useRecentReviews = (
  limit?: number,
  options?: UseQueryOptions<ReviewResponseDto[], Error>
) => {
  return useQuery({
    queryKey: queryKeys.reviews.recent(limit),
    queryFn: () => reviewApi.getRecent(limit).then((res) => res.data),
    staleTime: 2 * 60 * 1000, // 2 minutes (reviews change frequently)
    ...options,
  });
};

export const useReviewsByStore = (
  storeId: number,
  params?: Record<string, unknown>,
  options?: UseQueryOptions<ReviewResponseDto[], Error>
) => {
  return useQuery({
    queryKey: queryKeys.reviews.byStore(storeId, params),
    queryFn: () =>
      reviewApi.getByStore(storeId, params).then((res) => res.data),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!storeId,
    ...options,
  });
};

// Store Hooks
export const useStores = (
  params?: Record<string, unknown>,
  options?: UseQueryOptions<StoreDiscoveryDto[], Error>
) => {
  return useQuery({
    queryKey: queryKeys.stores.all(params),
    queryFn: () => storeApi.getAll(params).then((res) => res.data),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

export const useStoreById = (
  id: number,
  options?: UseQueryOptions<StoreDiscoveryDto, Error>
) => {
  return useQuery({
    queryKey: queryKeys.stores.byId(id),
    queryFn: () => storeApi.getById(id).then((res) => res.data),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!id,
    ...options,
  });
};

export const useStoreBySlug = (
  slug: string,
  options?: UseQueryOptions<StoreDiscoveryDto, Error>
) => {
  return useQuery({
    queryKey: queryKeys.stores.bySlug(slug),
    queryFn: () => storeApi.getBySlug(slug).then((res) => res.data),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!slug,
    ...options,
  });
};

// Search Hooks
export const useSearch = (
  params: SearchQueryParams,
  options?: UseQueryOptions<SearchResponseDto, Error>
) => {
  return useQuery({
    queryKey: queryKeys.search.unified(params),
    queryFn: () => searchApi.search(params).then((res) => res.data),
    staleTime: 1 * 60 * 1000, // 1 minute (search results change frequently)
    enabled: !!params.query && params.query.length >= 2,
    ...options,
  });
};

export const useSearchStores = (
  query: string,
  params?: Record<string, unknown>,
  options?: UseQueryOptions<StoreDiscoveryDto[], Error>
) => {
  return useQuery({
    queryKey: queryKeys.search.stores(query, params),
    queryFn: () =>
      searchApi.searchStores(query, params).then((res) => res.data),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!query && query.length >= 2,
    ...options,
  });
};

export const useSearchSuggestions = (
  query: string,
  limit = 10,
  options?: UseQueryOptions<SearchResponseDto, Error>
) => {
  return useQuery({
    queryKey: queryKeys.search.suggestions(query, limit),
    queryFn: () => searchApi.suggestions(query, limit).then((res) => res.data),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!query && query.length >= 2,
    ...options,
  });
};
