/**
 * Enhanced Cart Hooks with Guest Cart Support
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

import { cartApi } from "@/lib/api/services";
import { queryKeys } from "@/lib/api/query-keys";
import { AddToCartDto, UpdateCartItemDto } from "@/lib/api/types";
import {
  addToGuestCart,
  updateGuestCartItem,
  removeFromGuestCart,
  clearGuestCart,
  getGuestCartForSync,
} from "@/lib/utils/guest-cart";

/**
 * Enhanced add to cart that supports both authenticated and guest users
 */
export const useEnhancedAddToCart = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const isAuthenticated = !!session?.user;

  return useMutation({
    mutationFn: async ({
      storeId,
      productId,
      quantity,
    }: {
      storeId: number;
      productId: number;
      quantity: number;
    }) => {
      if (isAuthenticated) {
        // Authenticated user - use API
        return cartApi.addToCart(storeId, { productId, quantity });
      } else {
        // Guest user - use localStorage
        addToGuestCart(storeId, productId, quantity);
        return { success: true };
      }
    },
    onSuccess: (_, variables) => {
      if (isAuthenticated) {
        // Invalidate React Query cache for authenticated users
        queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
        queryClient.invalidateQueries({
          queryKey: queryKeys.cart.storeCart(variables.storeId),
        });
      } else {
        // Trigger a custom event for guest cart updates
        window.dispatchEvent(
          new CustomEvent("guestCartUpdated", {
            detail: { storeId: variables.storeId },
          })
        );
      }

      toast.success("Added to cart");
    },
    onError: (error) => {
      console.error("Add to cart error:", error);
      toast.error("Failed to add to cart");
    },
  });
};

/**
 * Enhanced update cart item for both authenticated and guest users
 */
export const useEnhancedUpdateCartItem = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const isAuthenticated = !!session?.user;

  return useMutation({
    mutationFn: async ({
      itemId,
      storeId,
      productId,
      quantity,
    }: {
      itemId?: number;
      storeId: number;
      productId: number;
      quantity: number;
    }) => {
      if (isAuthenticated && itemId) {
        // Authenticated user - use API
        return cartApi.updateCartItem(itemId, { quantity });
      } else {
        // Guest user - use localStorage
        updateGuestCartItem(storeId, productId, quantity);
        return { success: true };
      }
    },
    onSuccess: (_, variables) => {
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
      } else {
        window.dispatchEvent(
          new CustomEvent("guestCartUpdated", {
            detail: { storeId: variables.storeId },
          })
        );
      }

      toast.success("Cart updated");
    },
    onError: (error) => {
      console.error("Update cart error:", error);
      toast.error("Failed to update cart");
    },
  });
};

/**
 * Enhanced remove from cart for both authenticated and guest users
 */
export const useEnhancedRemoveFromCart = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const isAuthenticated = !!session?.user;

  return useMutation({
    mutationFn: async ({
      itemId,
      storeId,
      productId,
    }: {
      itemId?: number;
      storeId: number;
      productId: number;
    }) => {
      if (isAuthenticated && itemId) {
        // Authenticated user - use API
        return cartApi.removeFromCart(itemId);
      } else {
        // Guest user - use localStorage
        removeFromGuestCart(storeId, productId);
        return { success: true };
      }
    },
    onSuccess: (_, variables) => {
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
      } else {
        window.dispatchEvent(
          new CustomEvent("guestCartUpdated", {
            detail: { storeId: variables.storeId },
          })
        );
      }

      toast.success("Item removed from cart");
    },
    onError: (error) => {
      console.error("Remove from cart error:", error);
      toast.error("Failed to remove item");
    },
  });
};

/**
 * Enhanced clear cart for both authenticated and guest users
 */
export const useEnhancedClearCart = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const isAuthenticated = !!session?.user;

  return useMutation({
    mutationFn: async ({
      cartId,
      storeId,
    }: {
      cartId?: number;
      storeId: number;
    }) => {
      if (isAuthenticated && cartId) {
        // Authenticated user - use API
        return cartApi.clearCart(cartId);
      } else {
        // Guest user - use localStorage
        clearGuestCart(storeId);
        return { success: true };
      }
    },
    onSuccess: (_, variables) => {
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
      } else {
        window.dispatchEvent(
          new CustomEvent("guestCartUpdated", {
            detail: { storeId: variables.storeId },
          })
        );
      }

      toast.success("Cart cleared");
    },
    onError: (error) => {
      console.error("Clear cart error:", error);
      toast.error("Failed to clear cart");
    },
  });
};

/**
 * Sync guest cart with user cart after authentication
 */
export const useSyncGuestCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (storeId: number) => {
      const guestItems = getGuestCartForSync(storeId);

      if (guestItems.length === 0) {
        return { synced: 0 };
      }

      // Add each guest cart item to user's cart
      const syncPromises = guestItems.map((item) =>
        cartApi.addToCart(storeId, {
          productId: item.productId,
          quantity: item.quantity,
        })
      );

      await Promise.all(syncPromises);

      // Clear guest cart after successful sync
      clearGuestCart(storeId);

      return { synced: guestItems.length };
    },
    onSuccess: (result, storeId) => {
      if (result.synced > 0) {
        queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
        queryClient.invalidateQueries({
          queryKey: queryKeys.cart.storeCart(storeId),
        });

        toast.success(`Synced ${result.synced} items to your cart`);
      }
    },
    onError: (error) => {
      console.error("Cart sync error:", error);
      toast.error("Failed to sync cart items");
    },
  });
};
