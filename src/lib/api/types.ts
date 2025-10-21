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


export interface Store {
  id: number;
  email: string;
  phone: string;
  storeName: string;
  storeSlug: string;
  storeAddress: string;
  storeLocationState: string;
  storeLocationCity: string;
  storeTimeOpen: string;
  storeTimeClose: string;
  storeWeekOpen: string;
  storeWeekClose: string;
  logo: string | null;
  storeHeroHeadline: string | null;
  storeHeroTagline: string | null;
  storeHeroImage: string | null;
  storeCoverPhoto: string | null;
  storeLayout: string | null;
  storeHeroLayout: string | null;
  storeMobileNav: string | null;
  storeDescription: string;
  storeUrl: string | null;
  storeType: 'EXTERNAL' | 'INTERNAL';
  createdAt: string;
  updatedAt: string;
  mintingStatus: 'NOT_ATTEMPTED' | 'PENDING' | 'SUCCESS' | 'FAILED';
  mintTransactionHash: string | null;
  mintedAt: string | null;
  nftContractAddress: string | null;
  nftTokenId: string | null;
  storeCategoryId: number;
  userId: number;
  userImageId: string | null;
  verified: boolean;
  featured: boolean;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  averageRating: number;
  totalRatings: number;
  ratingBreakdown: Record<'1' | '2' | '3' | '4' | '5', number>;
  views: number;
  lastActive: string;
  socialLinks: Record<string, string>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  businessHours: Record<string, any>;
  likes: number;
  owner: {
    id: number;
    name: string;
    image: string | null;
    phone: string;
    identities: { email: string }[];
  };
  storeCategory: {
    id: number;
    name: string;
    description: string;
    categoryType: string;
    categoryImage: string | null;
    createdAt: string;
    updatedAt: string;
    slug: string;
    icon: string;
    featured: boolean;
    trending: boolean;
    displayOrder: number;
    storeCount: number;
    productCount: number;
    parentId: number | null;
    level: number;
    metadata: Record<string, any>;
  };
  _count: {
    products: number;
    reviews: number;
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

// Search Types (Unified Search API)
export interface SearchResultDto {
  id: string;
  name: string;
  description: string;
  type: 'store' | 'product' | 'category';
  image?: string;
  url: string;
  rating?: number;
  reviewCount?: number;
  price?: number;
  currency?: string;
  location?: string;
  category?: string;
  storeName?: string;
  verified?: boolean;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SearchResponseDto {
  results: SearchResultDto[];
  total: number;
  count: number;
  offset: number;
  query: string;
  entityType: string;
  executionTime: number;
}

export interface SearchQueryParams {
  query: string;
  entityType?: 'all' | 'store' | 'product' | 'category';
  location?: string;
  categoryId?: number;
  storeId?: number;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
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

// Dashboard Types
// Dashboard Types - Matching backend Prisma schema
export enum StoreType {
  INTERNAL = 'INTERNAL', // On-platform stores (business listings)
  EXTERNAL = 'EXTERNAL', // External stores (e-commerce)
}

export interface DashboardStoreDto {
  id: number;
  name: string;
  slug: string;
  type: StoreType;
  views: number;
  averageRating: number | null;
  totalRatings: number;
  status: string;
  orders?: number;
  revenue?: number;
  products?: number;
  trend: number;
  likes?: number;
}

export interface StoresStatsDto {
  totalStores: number;
  totalListings: number;
  totalEcommerce: number;
  totalViews: number;
  totalRevenue: number;
}

export interface TaskSummaryDto {
  id: string;
  title: string;
  description: string;
  type: string;
  priority: string;
  isCompleted: boolean;
  actionUrl: string | null;
  createdAt: Date | string;
}

export interface TaskStatsDto {
  total: number;
  completed: number;
  pending: number;
  completionRate: number;
}

export interface NotificationSummaryDto {
  id: number;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date | string;
  actionUrl: string | null;
}

export interface DashboardOverviewDto {
  listings: DashboardStoreDto[];
  ecommerce: DashboardStoreDto[];
  storesStats: StoresStatsDto;
  taskStats: TaskStatsDto;
  recentTasks: TaskSummaryDto[];
  unreadNotificationsCount: number;
  recentNotifications: NotificationSummaryDto[];
}

// Settings Types
export interface UpdateProfileDto {
  name?: string;
  phone?: string;
  address?: string;
  state?: string;
  lga?: string;
  image?: string;
  twitter?: string;
  facebook?: string;
  whatsapp?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface RemoveIdentityDto {
  verificationToken?: string;
}

export interface Identity {
  id: number;
  provider: 'EMAIL' | 'GOOGLE' | 'WALLET';
  email: string;
  isPrimary: boolean;
  isVerified: boolean;
  createdAt: string;
}

export interface IdentityRemovalResponse {
  message: string;
  identityId: number;
}

export interface RemovalConfirmationResponse {
  message: string;
  removedIdentityId: number;
}

