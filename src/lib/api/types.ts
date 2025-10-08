/**
 * Central Type Repository - Single source of truth for all types
 * Following backend schema exactly to ensure type safety
 */

// Base API Response Structure
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    fetchedAt: string;
    dataFreshness: string;
    cacheHit?: boolean;
  };
}

// Discovery Types (from backend DTOs)
export interface StoreDiscoveryDto {
  id: number;
  storeName: string;
  storeSlug: string;
  storeTagline?: string;
  storeDescription?: string;
  storeLogo?: string;
  storeCover?: string;
  storeAddress: string;
  storeLocationState: string;
  storeLocationCity: string;
  storeType: string;
  socialLinks?: {
    twitter?: string;
    facebook?: string;
    whatsapp?: string;
    instagram?: string;
    linkedin?: string;
  };
  verified: boolean;
  featured: boolean;
  status: string;
  averageRating: number;
  totalRatings: number;
  views: number;
  likes: number;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  owner: {
    id: number;
    firstName: string;
    lastName: string;
    avatar?: string;
    socialLinks?: {
      twitter?: string;
      facebook?: string;
      whatsapp?: string;
    };
  };
  lastActive: string;
  createdAt: string;
}

export interface TrendingStoreDto extends StoreDiscoveryDto {
  trending: {
    score: number;
    rank: number;
    recentViews: number;
    recentOrders: number;
    recentReviews: number;
    growth: string;
  };
}

export interface TopVendorDto extends StoreDiscoveryDto {
  metrics: {
    totalProducts: number;
    totalOrders: number;
    totalReviews: number;
    responseRate: number;
    responseTime: string;
    successRate: number;
  };
}

export interface MarketplaceStatsDto {
  stores: {
    total: number;
    active: number;
    verified: number;
    featured: number;
  };
  products: {
    total: number;
    featured: number;
  };
  categories: {
    total: number;
    storeCategories: number;
    productCategories: number;
  };
  reviews: {
    total: number;
    averageRating: number;
    last24Hours: number;
  };
  users: {
    total: number;
    vendors: number;
    buyers: number;
  };
}

// Category Types
export interface CategoryResponseDto {
  id: number;
  name: string;
  description?: string;
  slug: string;
  icon?: string;
  featured: boolean;
  trending: boolean;
  displayOrder: number;
  storeCount: number;
  productCount: number;
  categoryType: 'STORE' | 'PRODUCT';
  createdAt: string;
  updatedAt: string;
}

// Review Types
export interface ReviewResponseDto {
  id: number;
  rating: number;
  title: string;
  review: string;
  helpful: number;
  reported: number;
  verified: boolean;
  purchaseVerified: boolean;
  images: string[];
  createdAt: string;
  user: {
    id: number;
    name: string;
    image?: string;
  };
  store: {
    id: number;
    storeName: string;
    storeUrl: string;
    logo?: string;
  };
  product?: {
    id: number;
    name: string;
    images: Array<{
      id: number;
      url: string;
      isMain: boolean;
    }>;
  };
}

// Entry Page Types
export interface EntryPageDataDto {
  featuredCategories: CategoryResponseDto[];
  featuredStores: StoreDiscoveryDto[];
  trendingStores: TrendingStoreDto[];
  topVendors: TopVendorDto[];
  recentReviews: ReviewResponseDto[];
  marketplaceStats: MarketplaceStatsDto;
}

// Query Parameters
export interface DiscoveryQueryParams {
  limit?: number;
  offset?: number;
  categoryId?: number;
  minRating?: number;
  verified?: boolean;
}

export interface TrendingQueryParams extends DiscoveryQueryParams {
  days?: 7 | 14 | 30;
}

export interface EntryPageQueryParams {
  categoriesLimit?: number;
  featuredStoresLimit?: number;
  trendingStoresLimit?: number;
  topVendorsLimit?: number;
  recentReviewsLimit?: number;
  includeStats?: boolean;
  useCache?: boolean;
}
