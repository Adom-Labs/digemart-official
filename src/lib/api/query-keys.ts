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
    featuredStores: <T = Record<string, unknown>>(params?: T) =>
      ['discovery', 'featured-stores', params] as const,
    trendingStores: <T = Record<string, unknown>>(params?: T) =>
      ['discovery', 'trending-stores', params] as const,
    topVendors: <T = Record<string, unknown>>(params?: T) =>
      ['discovery', 'top-vendors', params] as const,
    stats: ['discovery', 'stats'] as const,
  },

  // Search queries
  search: {
    unified: <T = Record<string, unknown>>(params?: T) =>
      ['search', 'unified', params] as const,
    stores: <T = Record<string, unknown>>(query: string, params?: T) =>
      ['search', 'stores', query, params] as const,
    products: <T = Record<string, unknown>>(query: string, params?: T) =>
      ['search', 'products', query, params] as const,
    categories: <T = Record<string, unknown>>(query: string, params?: T) =>
      ['search', 'categories', query, params] as const,
    suggestions: (query: string, limit?: number) =>
      ['search', 'suggestions', query, { limit }] as const,
  },

  // Entry page queries
  entryPage: {
    data: <T = Record<string, unknown>>(params?: T) =>
      ['entry-page', 'data', params] as const,
    minimal: ['entry-page', 'minimal'] as const,
  },

  // Category queries
  categories: {
    all: <T = Record<string, unknown>>(params?: T) =>
      ['categories', 'all', params] as const,
    featured: <T = Record<string, unknown>>(params?: T) =>
      ['categories', 'featured', params] as const,
    trending: <T = Record<string, unknown>>(params?: T) =>
      ['categories', 'trending', params] as const,
    byId: (id: number) => ['categories', 'by-id', id] as const,
    bySlug: (slug: string) => ['categories', 'by-slug', slug] as const,
  },

  // Store queries
  stores: {
    all: <T = Record<string, unknown>>(params?: T) =>
      ['stores', 'all', params] as const,
    featured: <T = Record<string, unknown>>(params?: T) =>
      ['stores', 'featured', params] as const,
    byId: (id: number) => ['stores', 'by-id', id] as const,
    bySlug: (slug: string) => ['stores', 'by-slug', slug] as const,
  },

  // Review queries
  reviews: {
    all: <T = Record<string, unknown>>(params?: T) =>
      ['reviews', 'all', params] as const,
    recent: (limit?: number) => ['reviews', 'recent', { limit }] as const,
    byStore: <T = Record<string, unknown>>(storeId: number, params?: T) =>
      ['reviews', 'by-store', storeId, params] as const,
    byProduct: <T = Record<string, unknown>>(productId: number, params?: T) =>
      ['reviews', 'by-product', productId, params] as const,
  },
} as const;
