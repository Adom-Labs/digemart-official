/**
 * Central API Layer - Single entry point for all API functionality
 * Following the barrel export pattern for clean imports
 */

// Core exports
export { default as apiClient } from './client';
export { queryKeys } from './query-keys';

// Type exports
export type {
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
  SearchResultDto,
  SearchResponseDto,
  SearchQueryParams,
} from './types';

// Service exports
export {
  discoveryApi,
  entryPageApi,
  categoryApi,
  reviewApi,
  storeApi,
} from './services';

export { landingPageApi } from './landing-page';
export { searchApi } from './search';
export { contactApi } from './contact';
export type { ContactFormData, ContactResponse } from './contact';

// Hook exports
export {
  // Discovery hooks
  useFeaturedStores,
  useTrendingStores,
  useTopVendors,
  useMarketplaceStats,

  // Entry page hooks
  useEntryPageData,
  useMinimalEntryPageData,

  // Category hooks
  useCategories,
  useFeaturedCategories,
  useTrendingCategories,
  useCategoryById,
  useCategoryBySlug,

  // Review hooks
  useRecentReviews,
  useReviewsByStore,

  // Store hooks
  useStores,
  useStoreById,
  useStoreBySlug,

  // Search hooks
  useSearch,
  useSearchStores,
  useSearchSuggestions,
} from './hooks';
