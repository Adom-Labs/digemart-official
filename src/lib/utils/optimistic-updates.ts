/**
 * Optimistic UI updates for checkout flow
 * Provides immediate feedback while API calls are in progress
 */

import { useCallback, useState } from 'react';

export interface OptimisticState<T> {
  data: T;
  isOptimistic: boolean;
  isPending: boolean;
  error: string | null;
}

export interface OptimisticAction<T, P = unknown> {
  optimisticUpdate: (current: T, params: P) => T;
  apiCall: (params: P) => Promise<T>;
  rollback?: (current: T, params: P) => T;
}

/**
 * Hook for managing optimistic updates
 */
export function useOptimisticUpdate<T>(initialData: T) {
  const [state, setState] = useState<OptimisticState<T>>({
    data: initialData,
    isOptimistic: false,
    isPending: false,
    error: null,
  });

  const executeOptimistic = useCallback(
    async <P>(action: OptimisticAction<T, P>, params: P) => {
      // Apply optimistic update immediately
      setState(prev => ({
        ...prev,
        data: action.optimisticUpdate(prev.data, params),
        isOptimistic: true,
        isPending: true,
        error: null,
      }));

      try {
        // Execute API call
        const result = await action.apiCall(params);

        // Update with real data
        setState(prev => ({
          ...prev,
          data: result,
          isOptimistic: false,
          isPending: false,
          error: null,
        }));

        return result;
      } catch (error) {
        // Rollback optimistic update
        setState(prev => ({
          ...prev,
          data: action.rollback ? action.rollback(prev.data, params) : initialData,
          isOptimistic: false,
          isPending: false,
          error: error instanceof Error ? error.message : 'An error occurred',
        }));

        throw error;
      }
    },
    [initialData]
  );

  const reset = useCallback(() => {
    setState({
      data: initialData,
      isOptimistic: false,
      isPending: false,
      error: null,
    });
  }, [initialData]);

  return {
    ...state,
    executeOptimistic,
    reset,
  };
}

/**
 * Checkout-specific optimistic updates
 */
export interface CheckoutTotals {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
}

export interface CartItem {
  id: number;
  productId: number;
  variantId?: number;
  quantity: number;
  price: number;
  name: string;
}

export interface CheckoutData {
  items: CartItem[];
  totals: CheckoutTotals;
  customerInfo?: {
    name: string;
    email: string;
    phone?: string;
  };
  shippingAddress?: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

/**
 * Optimistic actions for checkout operations
 */
export const checkoutOptimisticActions = {
  /**
   * Update item quantity optimistically
   */
  updateQuantity: {
    optimisticUpdate: (current: CheckoutData, params: { itemId: number; quantity: number }) => {
      const updatedItems = current.items.map(item =>
        item.id === params.itemId ? { ...item, quantity: params.quantity } : item
      );

      // Recalculate totals optimistically
      const subtotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const shipping = current.totals.shipping; // Keep existing shipping
      const tax = subtotal * 0.1; // Estimate 10% tax
      const discount = current.totals.discount; // Keep existing discount
      const total = subtotal + shipping + tax - discount;

      return {
        ...current,
        items: updatedItems,
        totals: { subtotal, shipping, tax, discount, total },
      };
    },
    apiCall: async (params: { itemId: number; quantity: number }) => {
      // This would be replaced with actual API call
      const response = await fetch('/api/checkout/update-quantity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      return response.json();
    },
    rollback: (current: CheckoutData, params: { itemId: number; quantity: number }) => {
      // Rollback to previous quantity (this would need to be stored)
      return current;
    },
  } as OptimisticAction<CheckoutData, { itemId: number; quantity: number }>,

  /**
   * Remove item optimistically
   */
  removeItem: {
    optimisticUpdate: (current: CheckoutData, params: { itemId: number }) => {
      const updatedItems = current.items.filter(item => item.id !== params.itemId);

      // Recalculate totals
      const subtotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const shipping = updatedItems.length > 0 ? current.totals.shipping : 0;
      const tax = subtotal * 0.1;
      const discount = current.totals.discount;
      const total = subtotal + shipping + tax - discount;

      return {
        ...current,
        items: updatedItems,
        totals: { subtotal, shipping, tax, discount, total },
      };
    },
    apiCall: async (params: { itemId: number }) => {
      const response = await fetch(`/api/checkout/remove-item/${params.itemId}`, {
        method: 'DELETE',
      });
      return response.json();
    },
  } as OptimisticAction<CheckoutData, { itemId: number }>,

  /**
   * Apply coupon optimistically
   */
  applyCoupon: {
    optimisticUpdate: (current: CheckoutData, params: { couponCode: string; discountAmount: number }) => {
      const discount = current.totals.discount + params.discountAmount;
      const total = current.totals.subtotal + current.totals.shipping + current.totals.tax - discount;

      return {
        ...current,
        totals: {
          ...current.totals,
          discount,
          total,
        },
      };
    },
    apiCall: async (params: { couponCode: string }) => {
      const response = await fetch('/api/checkout/apply-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ couponCode: params.couponCode }),
      });
      return response.json();
    },
    rollback: (current: CheckoutData) => {
      // Remove the discount
      const total = current.totals.subtotal + current.totals.shipping + current.totals.tax;
      return {
        ...current,
        totals: {
          ...current.totals,
          discount: 0,
          total,
        },
      };
    },
  } as OptimisticAction<CheckoutData, { couponCode: string; discountAmount: number }>,

  /**
   * Update shipping address optimistically
   */
  updateShippingAddress: {
    optimisticUpdate: (current: CheckoutData, params: { address: CheckoutData['shippingAddress'] }) => {
      return {
        ...current,
        shippingAddress: params.address,
      };
    },
    apiCall: async (params: { address: CheckoutData['shippingAddress'] }) => {
      const response = await fetch('/api/checkout/update-shipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shippingAddress: params.address }),
      });
      return response.json();
    },
  } as OptimisticAction<CheckoutData, { address: CheckoutData['shippingAddress'] }>,
};

/**
 * Hook for checkout optimistic updates
 */
export function useCheckoutOptimistic(initialData: CheckoutData) {
  const optimistic = useOptimisticUpdate(initialData);

  const updateQuantity = useCallback(
    (itemId: number, quantity: number) => {
      return optimistic.executeOptimistic(
        checkoutOptimisticActions.updateQuantity,
        { itemId, quantity }
      );
    },
    [optimistic]
  );

  const removeItem = useCallback(
    (itemId: number) => {
      return optimistic.executeOptimistic(
        checkoutOptimisticActions.removeItem,
        { itemId }
      );
    },
    [optimistic]
  );

  const applyCoupon = useCallback(
    (couponCode: string, discountAmount: number = 0) => {
      return optimistic.executeOptimistic(
        checkoutOptimisticActions.applyCoupon,
        { couponCode, discountAmount }
      );
    },
    [optimistic]
  );

  const updateShippingAddress = useCallback(
    (address: CheckoutData['shippingAddress']) => {
      return optimistic.executeOptimistic(
        checkoutOptimisticActions.updateShippingAddress,
        { address }
      );
    },
    [optimistic]
  );

  return {
    ...optimistic,
    updateQuantity,
    removeItem,
    applyCoupon,
    updateShippingAddress,
  };
}

/**
 * Visual feedback component for optimistic updates
 */
export interface OptimisticFeedbackProps {
  isOptimistic: boolean;
  isPending: boolean;
  error: string | null;
  children: React.ReactNode;
  className?: string;
}
