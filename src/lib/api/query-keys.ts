/**
 * Centralized query keys for React Query
 * Following the standard pattern: ['entity', 'action', params]
 * This ensures consistent cache invalidation and key management
 */
export const queryKeys = {
  // Landing page queries
  landingPage: {
    main: ['landing-page', 'main'] as const,
    plugs: ['landing-page', 'plugs'] as const,
  },

  // Discovery queries
  discovery: {
    featuredStores: (params?: any) =>
      ['discovery', 'featured-stores', params] as const,
    trendingStores: (params?: any) =>
      ['discovery', 'trending-stores', params] as const,
    topVendors: (params?: any) => ['discovery', 'top-vendors', params] as const,
    stats: ['discovery', 'stats'] as const,
  },

  // Entry page queries
  entryPage: {
    data: (params?: any) => ['entry-page', 'data', params] as const,
    minimal: ['entry-page', 'minimal'] as const,
  },

  // Category queries
  categories: {
    all: (params?: Record<string, unknown>) =>
      ['categories', 'all', params] as const,
    featured: (params?: Record<string, unknown>) =>
      ['categories', 'featured', params] as const,
    trending: (params?: Record<string, unknown>) =>
      ['categories', 'trending', params] as const,
    byId: (id: number) => ['categories', 'by-id', id] as const,
    bySlug: (slug: string) => ['categories', 'by-slug', slug] as const,
  },

  // Store queries
  stores: {
    all: (params?: Record<string, unknown>) =>
      ['stores', 'all', params] as const,
    featured: (params?: Record<string, unknown>) =>
      ['stores', 'featured', params] as const,
    byId: (id: number) => ['stores', 'by-id', id] as const,
    bySlug: (slug: string) => ['stores', 'by-slug', slug] as const,
  },

  // Review queries
  reviews: {
    all: (params?: Record<string, unknown>) =>
      ['reviews', 'all', params] as const,
    recent: (limit?: number) => ['reviews', 'recent', { limit }] as const,
    byStore: (storeId: number, params?: Record<string, unknown>) =>
      ['reviews', 'by-store', storeId, params] as const,
    byProduct: (productId: number, params?: Record<string, unknown>) =>
      ['reviews', 'by-product', productId, params] as const,
  },
} as const;
