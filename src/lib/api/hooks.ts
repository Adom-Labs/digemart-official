/**
 * React Query Hooks - Standard patterns for data fetching
 * Following TanStack Query best practices with proper error handling and caching
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { queryKeys } from "./query-keys";
import {
  discoveryApi,
  entryPageApi,
  categoryApi,
  reviewApi,
  storeApi,
  dashboardApi,
  settingsApi,
  cartApi,
  wishlistApi,
  productApi,
  auditApi,
  notificationApi,
} from "./services";
import { searchApi } from "./search";
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
  DashboardOverviewDto,
  Store,
  UserProfile,
  AddToCartDto,
  UpdateCartItemDto,
  ShareCartDto,
  WishlistType,
  WishlistResponse,
  AddToWishlistDto,
  IsInWishlistResponse,
  MoveToCartDto,
  NotificationQueryParams,
  NotificationListResponse,
  NotificationDto,
} from "./types";

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
  options?: UseQueryOptions<{ data: CategoryResponseDto[] }, Error>
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
  options?: UseQueryOptions<Store[], Error>
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

// Dashboard Hooks
export const useDashboardOverview = (
  options?: UseQueryOptions<DashboardOverviewDto, Error>
) => {
  return useQuery({
    queryKey: queryKeys.dashboard.overview,
    queryFn: () => dashboardApi.getOverview().then((res) => res.data),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    retry: (failureCount, error) => {
      // Don't retry on auth errors (401, 403)
      if (error?.message?.includes("401") || error?.message?.includes("403")) {
        return false;
      }
      return failureCount < 3;
    },
    ...options,
  });
};

// Settings Hooks

/**
 * Hook to get user profile
 */
export const useUserProfile = (
  options?: UseQueryOptions<UserProfile, Error>
) => {
  return useQuery({
    queryKey: queryKeys.auth.profile(),
    queryFn: settingsApi.getUserProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

/**
 * Hook to update user profile
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: settingsApi.updateProfile,
    onSuccess: (data) => {
      // Invalidate profile cache
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile() });
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.profile() });
    },
    onError: (error) => {
      console.error("Profile update error:", error);
    },
  });
};

/**
 * Hook to change password
 */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: settingsApi.changePassword,
  });
};

/**
 * Hook to fetch user identities
 */
export const useUserIdentities = () => {
  return useQuery({
    queryKey: queryKeys.settings.identities(),
    queryFn: settingsApi.getUserIdentities,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

/**
 * Hook to request identity removal
 */
export const useRequestRemoveIdentity = () => {
  return useMutation({
    mutationFn: settingsApi.requestRemoveIdentity,
  });
};

/**
 * Hook to confirm identity removal
 */
export const useConfirmRemoveIdentity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: settingsApi.confirmRemoveIdentity,
    onSuccess: () => {
      // Invalidate identities cache
      queryClient.invalidateQueries({
        queryKey: queryKeys.settings.identities(),
      });
    },
  });
};

/**
 * Hook to set primary identity
 */
export const useSetPrimaryIdentity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: settingsApi.setPrimaryIdentity,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.settings.identities(),
      });
    },
  });
};

// ============================================
// CART HOOKS
// ============================================

/**
 * Get all user carts across stores
 * Only fetches if user is authenticated
 */
export const useUserCarts = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: queryKeys.cart.userCarts(),
    queryFn: () => cartApi.getUserCarts().then((res) => res.data),
    staleTime: 1 * 60 * 1000, // 1 minute
    enabled: options?.enabled !== false, // Allow explicit disabling
    retry: false, // Don't retry on auth failures
  });
};

/**
 * Get cart for specific store
 * Only fetches if user is authenticated and storeId is provided
 */
export const useStoreCart = (
  storeId: number,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: queryKeys.cart.storeCart(storeId),
    queryFn: () => cartApi.getStoreCart(storeId).then((res) => res.data),
    staleTime: 30 * 1000, // 30 seconds
    enabled: !!storeId && options?.enabled !== false,
    retry: false, // Don't retry on auth failures
  });
};

/**
 * Add item to cart
 */
export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ storeId, data }: { storeId: number; data: AddToCartDto }) =>
      cartApi.addToCart(storeId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.cart.storeCart(variables.storeId),
      });
    },
  });
};

/**
 * Update cart item quantity
 */
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      itemId,
      data,
    }: {
      itemId: number;
      data: UpdateCartItemDto;
    }) => cartApi.updateCartItem(itemId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
    },
  });
};

/**
 * Remove item from cart
 */
export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: number) => cartApi.removeFromCart(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
    },
  });
};

/**
 * Clear entire cart
 */
export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cartId: number) => cartApi.clearCart(cartId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
    },
  });
};

/**
 * Share cart via link
 */
export const useShareCart = () => {
  return useMutation({
    mutationFn: ({ cartId, data }: { cartId: number; data: ShareCartDto }) =>
      cartApi.shareCart(cartId, data),
  });
};

/**
 * Get shared cart (public)
 */
export const useSharedCart = (
  shareId: string,
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: queryKeys.cart.sharedCart(shareId),
    queryFn: () => cartApi.getSharedCart(shareId).then((res) => res.data),
    enabled: !!shareId,
    retry: false,
    ...options,
  });
};

/**
 * Merge guest cart to user cart
 */
export const useMergeGuestCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (guestCartData: any[]) => cartApi.mergeGuestCart(guestCartData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
    },
  });
};

// ============================================
// WISHLIST HOOKS
// ============================================

/**
 * Get user wishlist
 * Only fetches if user is authenticated
 */
export const useWishlist = (
  type?: WishlistType,
  options?: UseQueryOptions<WishlistResponse, Error> & { enabled?: boolean }
) => {
  return useQuery({
    queryKey: queryKeys.wishlist.byType(type),
    queryFn: () => wishlistApi.getWishlist(type).then((res) => res.data),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: options?.enabled !== false,
    retry: false, // Don't retry on auth failures
    ...options,
  });
};

/**
 * Get wishlist count
 * Only fetches if user is authenticated
 */
export const useWishlistCount = (
  options?: UseQueryOptions<{ count: number }, Error> & { enabled?: boolean }
) => {
  return useQuery({
    queryKey: queryKeys.wishlist.count(),
    queryFn: () => wishlistApi.getWishlistCount().then((res) => res.data),
    staleTime: 1 * 60 * 1000, // 1 minute
    enabled: options?.enabled !== false,
    retry: false, // Don't retry on auth failures
    ...options,
  });
};

/**
 * Check if item is in wishlist
 * Only fetches if user is authenticated and itemId is provided
 */
export const useIsInWishlist = (
  type: WishlistType,
  itemId: number,
  options?: UseQueryOptions<IsInWishlistResponse, Error> & { enabled?: boolean }
) => {
  return useQuery({
    queryKey: queryKeys.wishlist.check(type, itemId),
    queryFn: () =>
      wishlistApi.isInWishlist(type, itemId).then((res) => res.data),
    enabled: !!itemId && options?.enabled !== false,
    retry: false, // Don't retry on auth failures
    ...options,
  });
};

/**
 * Add item to wishlist
 */
export const useAddToWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddToWishlistDto) => wishlistApi.addToWishlist(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.count() });
    },
  });
};

/**
 * Remove item from wishlist
 */
export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (wishlistId: number) =>
      wishlistApi.removeFromWishlist(wishlistId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.count() });
    },
  });
};

/**
 * Move wishlist items to cart
 */
export const useMoveToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MoveToCartDto) => wishlistApi.moveToCart(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
    },
  });
};

// ============================================================================
// Product Management Hooks
// ============================================================================

/**
 * Toggle product status (active/inactive)
 */
export const useToggleProductStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      storeId,
      productId,
      active,
    }: {
      storeId: number;
      productId: number;
      active: boolean;
    }) => productApi.toggleProductStatus(storeId, productId, active),
    onSuccess: (_, { storeId }) => {
      queryClient.invalidateQueries({
        queryKey: ["stores", storeId, "products"],
      });
    },
  });
};

/**
 * Toggle product featured status
 */
export const useToggleFeaturedStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      storeId,
      productId,
      featured,
    }: {
      storeId: number;
      productId: number;
      featured: boolean;
    }) => productApi.toggleFeaturedStatus(storeId, productId, featured),
    onSuccess: (_, { storeId }) => {
      queryClient.invalidateQueries({
        queryKey: ["stores", storeId, "products"],
      });
    },
  });
};

/**
 * Delete product
 */
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      storeId,
      productId,
    }: {
      storeId: number;
      productId: number;
    }) => productApi.deleteProduct(storeId, productId),
    onSuccess: (_, { storeId }) => {
      queryClient.invalidateQueries({
        queryKey: ["stores", storeId, "products"],
      });
    },
  });
};

/**
 * Get single product
 */
export const useProduct = (
  storeId: number,
  productId: number,
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: ["stores", storeId, "products", productId],
    queryFn: () =>
      productApi.getProduct(storeId, productId).then((res) => res.data),
    enabled: !!storeId && !!productId,
    ...options,
  });
};

/**
 * Update product
 */
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      storeId,
      productId,
      data,
    }: {
      storeId: number;
      productId: number;
      data: any;
    }) => productApi.updateProduct(storeId, productId, data),
    onSuccess: (_, variables) => {
      // Invalidate product query
      queryClient.invalidateQueries({
        queryKey: [
          "stores",
          variables.storeId,
          "products",
          variables.productId,
        ],
      });
      // Invalidate store products list
      queryClient.invalidateQueries({
        queryKey: ["stores", variables.storeId, "products"],
      });
    },
  });
};

// ============================================================================
// Audit Log Hooks
// ============================================================================

/**
 * Get recent store activity logs
 */
export const useStoreRecentActivity = (
  storeId: number,
  limit: number = 10,
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: ["audit", "store", storeId, "recent", limit],
    queryFn: () =>
      auditApi.getStoreRecentActivity(storeId, limit).then((res) => res),
    enabled: !!storeId,
    staleTime: 30 * 1000, // 30 seconds - activities should be fairly fresh
    ...options,
  });
};

// ============================================================================
// Notification Hooks
// ============================================================================

/**
 * Get user notifications with pagination and filtering
 */
export const useNotifications = (
  params?: NotificationQueryParams,
  options?: UseQueryOptions<NotificationListResponse, Error>
) => {
  return useQuery({
    queryKey: queryKeys.notifications.list(params),
    queryFn: () => notificationApi.getAll(params).then((res) => res.data),
    staleTime: 30 * 1000, // 30 seconds
    ...options,
  });
};

/**
 * Get unread notification count
 */
export const useUnreadNotificationCount = (
  options?: UseQueryOptions<{ unreadCount: number }, Error>
) => {
  return useQuery({
    queryKey: queryKeys.notifications.unreadCount(),
    queryFn: () => notificationApi.getUnreadCount().then((res) => res.data),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
    ...options,
  });
};

/**
 * Get single notification by ID
 */
export const useNotification = (
  id: number,
  options?: UseQueryOptions<NotificationDto, Error>
) => {
  return useQuery({
    queryKey: queryKeys.notifications.byId(id),
    queryFn: () => notificationApi.getById(id).then((res) => res.data),
    enabled: !!id,
    ...options,
  });
};

/**
 * Mark notification as read
 */
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => notificationApi.markAsRead(id),
    onSuccess: () => {
      // Invalidate notifications list and unread count
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.unreadCount(),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.overview });
    },
  });
};

/**
 * Mark all notifications as read
 */
export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationApi.markAllAsRead(),
    onSuccess: () => {
      // Invalidate all notification queries
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.overview });
    },
  });
};

/**
 * Delete notification
 */
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => notificationApi.deleteNotification(id),
    onSuccess: () => {
      // Invalidate notifications list and unread count
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.unreadCount(),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.overview });
    },
  });
};
