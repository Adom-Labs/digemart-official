/**
 * Centralized query keys for React Query
 * Following the standard pattern: ['entity', 'action', params]
 * This ensures consistent cache invalidation and key management
 */
export const queryKeys = {
  // Landing page queries
  landingPage: {
    main: ["landing-page", "main"] as const,
    plugs: ["landing-page", "plugs"] as const,
  },

  // Discovery queries
  discovery: {
    featuredStores: <T = Record<string, unknown>>(params?: T) =>
      ["discovery", "featured-stores", params] as const,
    trendingStores: <T = Record<string, unknown>>(params?: T) =>
      ["discovery", "trending-stores", params] as const,
    topVendors: <T = Record<string, unknown>>(params?: T) =>
      ["discovery", "top-vendors", params] as const,
    stats: ["discovery", "stats"] as const,
  },

  // Search queries
  search: {
    unified: <T = Record<string, unknown>>(params?: T) =>
      ["search", "unified", params] as const,
    stores: <T = Record<string, unknown>>(query: string, params?: T) =>
      ["search", "stores", query, params] as const,
    products: <T = Record<string, unknown>>(query: string, params?: T) =>
      ["search", "products", query, params] as const,
    categories: <T = Record<string, unknown>>(query: string, params?: T) =>
      ["search", "categories", query, params] as const,
    suggestions: (query: string, limit?: number) =>
      ["search", "suggestions", query, { limit }] as const,
  },

  // Entry page queries
  entryPage: {
    data: <T = Record<string, unknown>>(params?: T) =>
      ["entry-page", "data", params] as const,
    minimal: ["entry-page", "minimal"] as const,
  },

  // Category queries
  categories: {
    all: <T = Record<string, unknown>>(params?: T) =>
      ["categories", "all", params] as const,
    featured: <T = Record<string, unknown>>(params?: T) =>
      ["categories", "featured", params] as const,
    trending: <T = Record<string, unknown>>(params?: T) =>
      ["categories", "trending", params] as const,
    byId: (id: number) => ["categories", "by-id", id] as const,
    bySlug: (slug: string) => ["categories", "by-slug", slug] as const,
  },

  // Store queries
  stores: {
    all: <T = Record<string, unknown>>(params?: T) =>
      ["stores", "all", params] as const,
    featured: <T = Record<string, unknown>>(params?: T) =>
      ["stores", "featured", params] as const,
    byId: (id: number) => ["stores", "by-id", id] as const,
    bySlug: (slug: string) => ["stores", "by-slug", slug] as const,
    bySubdomain: (subdomain: string) =>
      ["stores", "by-subdomain", subdomain] as const,
    publicData: (storeId: number) =>
      ["stores", "public-data", storeId] as const,
    subdomainAvailability: (subdomain: string) =>
      ["stores", "subdomain-availability", subdomain] as const,
    theme: (storeId: number) => ["stores", "theme", storeId] as const,
    layout: (storeId: number) => ["stores", "layout", storeId] as const,
  },

  // Review queries
  reviews: {
    all: <T = Record<string, unknown>>(params?: T) =>
      ["reviews", "all", params] as const,
    recent: (limit?: number) => ["reviews", "recent", { limit }] as const,
    byStore: <T = Record<string, unknown>>(storeId: number, params?: T) =>
      ["reviews", "by-store", storeId, params] as const,
    byProduct: <T = Record<string, unknown>>(productId: number, params?: T) =>
      ["reviews", "by-product", productId, params] as const,
  },

  // Dashboard queries
  dashboard: {
    overview: ["dashboard", "overview"] as const,
  },

  // Auth queries
  auth: {
    profile: () => ["auth", "profile"] as const,
  },

  // Settings queries
  settings: {
    all: ["settings"] as const,
    profile: () => ["settings", "profile"] as const,
    identities: () => ["settings", "identities"] as const,
  },
  // Theme queries
  themes: {
    templates: ["themes", "templates"] as const,
  },

  // Content queries
  content: {
    templates: ["content", "templates"] as const,
  },

  // Cart queries
  cart: {
    all: ["cart"] as const,
    userCarts: () => ["cart", "user"] as const,
    storeCart: (storeId: number) => ["cart", "store", storeId] as const,
    sharedCart: (shareId: string) => ["cart", "shared", shareId] as const,
  },

  // Wishlist queries
  wishlist: {
    all: ["wishlist"] as const,
    byType: (type?: string) => ["wishlist", type] as const,
    count: () => ["wishlist", "count"] as const,
    check: (type: string, itemId: number) =>
      ["wishlist", "check", type, itemId] as const,
  },

  // Product queries
  products: {
    all: <T = Record<string, unknown>>(params?: T) =>
      ["products", "all", params] as const,
    featured: <T = Record<string, unknown>>(params?: T) =>
      ["products", "featured", params] as const,
    byId: (id: number) => ["products", "by-id", id] as const,
    byStore: <T = Record<string, unknown>>(storeId: number, params?: T) =>
      ["products", "by-store", storeId, params] as const,
    variants: <T = Record<string, unknown>>(productId: number, params?: T) =>
      ["products", "variants", productId, params] as const,
    variant: (variantId: number) => ["products", "variant", variantId] as const,
    inventory: (productId: number) =>
      ["products", "inventory", productId] as const,
    inventoryMovements: (productId: number, page?: number, limit?: number) =>
      [
        "products",
        "inventory",
        "movements",
        productId,
        { page, limit },
      ] as const,
  },

  // Store product management queries
  storeProducts: {
    all: <T = Record<string, unknown>>(storeId: number, params?: T) =>
      ["store-products", storeId, "all", params] as const,
    byId: (storeId: number, productId: number) =>
      ["store-products", storeId, "by-id", productId] as const,
    lowStock: (storeId: number, threshold?: number) =>
      ["store-products", storeId, "low-stock", { threshold }] as const,
  },

  // Store customer management queries
  storeCustomers: {
    // Base key for all store customer queries
    all: (storeId: number) => ["store-customers", storeId] as const,

    // Customer list queries with pagination and filtering
    lists: (storeId: number) => ["store-customers", storeId, "list"] as const,
    list: <T = Record<string, unknown>>(storeId: number, params?: T) =>
      ["store-customers", storeId, "list", params] as const,

    // Individual customer detail queries
    details: (storeId: number) =>
      ["store-customers", storeId, "detail"] as const,
    detail: (storeId: number, customerId: number) =>
      ["store-customers", storeId, "detail", customerId] as const,

    // Customer analytics and metrics
    metrics: (storeId: number) =>
      ["store-customers", storeId, "metrics"] as const,
    analytics: (storeId: number) =>
      ["store-customers", storeId, "analytics"] as const,

    // User store profile (for authenticated users)
    profile: (storeId: number) =>
      ["store-customers", storeId, "profile"] as const,

    // Customer preferences and settings
    preferences: (storeId: number) =>
      ["store-customers", storeId, "preferences"] as const,

    // Marketing consent tracking
    marketingConsent: (storeId: number) =>
      ["store-customers", storeId, "marketing-consent"] as const,

    // Export functionality
    export: (storeId: number, params?: Record<string, unknown>) =>
      ["store-customers", storeId, "export", params] as const,

    // Customer segmentation and filtering
    segments: (storeId: number) =>
      ["store-customers", storeId, "segments"] as const,

    // Customer order history (store-specific)
    orders: (storeId: number, customerId?: number) =>
      customerId
        ? (["store-customers", storeId, "orders", customerId] as const)
        : (["store-customers", storeId, "orders"] as const),

    // Customer lifetime value calculations
    lifetimeValue: (storeId: number) =>
      ["store-customers", storeId, "lifetime-value"] as const,

    // Top customers and rankings
    topCustomers: (storeId: number, params?: Record<string, unknown>) =>
      ["store-customers", storeId, "top-customers", params] as const,

    // Customer growth and trends
    growth: (storeId: number, period?: string) =>
      ["store-customers", storeId, "growth", { period }] as const,

    // Customer retention metrics
    retention: (storeId: number) =>
      ["store-customers", storeId, "retention"] as const,
  },
} as const;

// Legacy QUERY_KEYS for backward compatibility
export const QUERY_KEYS = {
  STORES: "stores",
  STORE: "store",
  STORE_SUBDOMAIN: "store-subdomain",
  THEME_TEMPLATES: "theme-templates",
  PRODUCTS: "products",
  STORE_PRODUCTS: "store-products",
  PRODUCT_VARIANTS: "product-variants",
  INVENTORY: "inventory",
  STORE_CUSTOMERS: "store-customers",
} as const;
