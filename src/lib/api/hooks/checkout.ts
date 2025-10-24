"use client";

import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import { apiClient } from "../client";
import { queryKeys } from "../query-keys";
import {
  getGuestCart,
  clearGuestCart,
  getGuestCartForSync,
} from "@/lib/utils/guest-cart";

// Types
export interface CheckoutData {
  storeId: number;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    isGuest: boolean;
  };
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string;
  };
  paymentMethod: {
    type: "card" | "bank_transfer" | "wallet";
    gateway: "paystack" | "flutterwave" | "basepay";
  };
  items: CheckoutItem[];
  totals: {
    subtotal: number;
    shipping: number;
    tax: number;
    discount: number;
    total: number;
  };
}

export interface CheckoutItem {
  productId: number;
  variantId?: number;
  quantity: number;
  unitPrice: number;
}

export interface CheckoutValidationData {
  storeId: number;
  items: CheckoutItem[];
  shippingAddress?: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string;
  };
  couponCode?: string;
}

export interface CheckoutValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  availableItems: Array<{
    productId: number;
    variantId?: number;
    availableQuantity: number;
    requestedQuantity: number;
  }>;
}

export interface CheckoutTotals {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  breakdown: {
    itemsTotal: number;
    shippingCost: number;
    taxAmount: number;
    discountAmount: number;
    couponDiscount?: number;
  };
}

export interface CheckoutSession {
  id: string;
  storeId: number;
  expiresAt: string;
  data: CheckoutData;
  step: "customer_info" | "shipping" | "payment" | "review";
  createdAt: string;
  updatedAt: string;
}

export interface CheckoutCompletionData {
  sessionId: string;
  paymentReference?: string;
  paymentMethod: {
    type: "card" | "bank_transfer" | "wallet";
    gateway: "paystack" | "flutterwave" | "basepay";
  };
}

export interface CheckoutCompletionResult {
  orderId: number;
  orderNumber: string;
  paymentReference?: string;
  paymentUrl?: string;
  status: "pending" | "processing" | "completed";
}

// API functions
const validateCheckout = async (
  data: CheckoutValidationData
): Promise<CheckoutValidationResult> => {
  const response = await apiClient.post("/checkout/validate", data);
  return response.data;
};

const calculateCheckoutTotals = async (data: {
  storeId: number;
  items: CheckoutItem[];
  shippingAddress?: CheckoutValidationData["shippingAddress"];
  couponCode?: string;
}): Promise<CheckoutTotals> => {
  const response = await apiClient.post("/checkout/calculate", data);
  return response.data;
};

const createCheckoutSession = async (data: {
  storeId: number;
  items: CheckoutItem[];
}): Promise<CheckoutSession> => {
  const response = await apiClient.post("/checkout/session", data);
  return response.data;
};

const updateCheckoutSession = async (
  sessionId: string,
  data: Partial<CheckoutData>
): Promise<CheckoutSession> => {
  const response = await apiClient.patch(
    `/checkout/session/${sessionId}`,
    data
  );
  return response.data;
};

const getCheckoutSession = async (
  sessionId: string
): Promise<CheckoutSession> => {
  const response = await apiClient.get(`/checkout/session/${sessionId}`);
  return response.data;
};

const completeCheckout = async (
  data: CheckoutCompletionData
): Promise<CheckoutCompletionResult> => {
  const response = await apiClient.post("/checkout/complete", data);
  return response.data;
};

const getStoreCheckoutConfig = async (storeId: number) => {
  const response = await apiClient.get(`/checkout/store/${storeId}/config`);
  return response.data;
};

// Cart synchronization for checkout
const syncCartForCheckout = async (
  storeId: number
): Promise<CheckoutItem[]> => {
  const { data: session } = useSession();

  if (session?.user) {
    // Authenticated user - get cart from API
    const response = await apiClient.get(`/cart/store/${storeId}`);
    return response.data.items.map((item: any) => ({
      productId: item.productId,
      variantId: item.variantId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    }));
  } else {
    // Guest user - get cart from localStorage
    const guestCart = getGuestCart(storeId);
    return guestCart.items.map((item) => ({
      productId: item.productId,
      variantId: item.variantId,
      quantity: item.quantity,
      unitPrice: item.unitPrice || 0, // Will be calculated on backend
    }));
  }
};

// React Query hooks

/**
 * Validate checkout data including inventory and pricing
 */
export const useValidateCheckout = () => {
  return useMutation({
    mutationFn: validateCheckout,
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Checkout validation failed"
      );
    },
  });
};

/**
 * Calculate checkout totals with shipping, tax, and discounts
 */
export const useCalculateCheckoutTotals = () => {
  return useMutation({
    mutationFn: calculateCheckoutTotals,
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to calculate checkout totals"
      );
    },
  });
};

/**
 * Create a new checkout session
 */
export const useCreateCheckoutSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCheckoutSession,
    onSuccess: (session) => {
      // Cache the session
      queryClient.setQueryData(["checkout", "session", session.id], session);

      toast.success("Checkout session created");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to create checkout session"
      );
    },
  });
};

/**
 * Update checkout session data
 */
export const useUpdateCheckoutSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sessionId,
      data,
    }: {
      sessionId: string;
      data: Partial<CheckoutData>;
    }) => updateCheckoutSession(sessionId, data),
    onSuccess: (session) => {
      // Update cached session
      queryClient.setQueryData(["checkout", "session", session.id], session);
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update checkout session"
      );
    },
  });
};

/**
 * Get checkout session by ID
 */
export const useCheckoutSession = (
  sessionId: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["checkout", "session", sessionId],
    queryFn: () => getCheckoutSession(sessionId),
    enabled: enabled && !!sessionId,
    staleTime: 30 * 1000, // 30 seconds
    retry: (failureCount, error: any) => {
      // Don't retry if session not found or expired
      if (error.response?.status === 404 || error.response?.status === 410) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

/**
 * Complete checkout and create order
 */
export const useCompleteCheckout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: completeCheckout,
    onSuccess: (result) => {
      // Invalidate cart and order queries
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
      queryClient.invalidateQueries({ queryKey: ["orders"] });

      // Clear guest cart if applicable
      const sessionData = queryClient.getQueryData<CheckoutSession>([
        "checkout",
        "session",
        result.orderId.toString(),
      ]);

      if (sessionData?.data.customerInfo.isGuest) {
        clearGuestCart(sessionData.storeId);
      }

      toast.success(`Order #${result.orderNumber} created successfully!`);
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to complete checkout"
      );
    },
  });
};

/**
 * Get store-specific checkout configuration
 */
export const useStoreCheckoutConfig = (
  storeId: number,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["checkout", "store-config", storeId],
    queryFn: () => getStoreCheckoutConfig(storeId),
    enabled: enabled && !!storeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Sync cart data for checkout initialization
 */
export const useSyncCartForCheckout = () => {
  return useMutation({
    mutationFn: syncCartForCheckout,
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to sync cart for checkout"
      );
    },
  });
};

// Composite hooks for checkout flow

/**
 * Initialize checkout with cart synchronization and validation
 */
export const useInitializeCheckout = () => {
  const syncCart = useSyncCartForCheckout();
  const createSession = useCreateCheckoutSession();
  const validateCheckout = useValidateCheckout();
  const calculateTotals = useCalculateCheckoutTotals();

  const initializeCheckout = async (storeId: number) => {
    try {
      // Step 1: Sync cart items
      const items = await syncCart.mutateAsync(storeId);

      if (items.length === 0) {
        throw new Error("Cart is empty");
      }

      // Step 2: Validate items and inventory
      const validation = await validateCheckout.mutateAsync({
        storeId,
        items,
      });

      if (!validation.isValid) {
        throw new Error(
          `Checkout validation failed: ${validation.errors.join(", ")}`
        );
      }

      // Step 3: Calculate initial totals
      const totals = await calculateTotals.mutateAsync({
        storeId,
        items,
      });

      // Step 4: Create checkout session
      const session = await createSession.mutateAsync({
        storeId,
        items,
      });

      return {
        session,
        items,
        totals,
        validation,
      };
    } catch (error) {
      throw error;
    }
  };

  return {
    initializeCheckout,
    isLoading:
      syncCart.isPending ||
      createSession.isPending ||
      validateCheckout.isPending ||
      calculateTotals.isPending,
    error:
      syncCart.error ||
      createSession.error ||
      validateCheckout.error ||
      calculateTotals.error,
  };
};

/**
 * Validate and calculate totals for checkout step
 */
export const useCheckoutStepValidation = () => {
  const validateCheckout = useValidateCheckout();
  const calculateTotals = useCalculateCheckoutTotals();

  const validateStep = async (data: CheckoutValidationData) => {
    const [validation, totals] = await Promise.all([
      validateCheckout.mutateAsync(data),
      calculateTotals.mutateAsync(data),
    ]);

    return { validation, totals };
  };

  return {
    validateStep,
    isLoading: validateCheckout.isPending || calculateTotals.isPending,
    error: validateCheckout.error || calculateTotals.error,
  };
};

/**
 * Complete checkout flow with payment processing
 */
export const useCheckoutCompletion = () => {
  const completeCheckout = useCompleteCheckout();
  const updateSession = useUpdateCheckoutSession();

  const completeCheckoutFlow = async (
    sessionId: string,
    completionData: CheckoutCompletionData
  ) => {
    try {
      // Update session with final data
      await updateSession.mutateAsync({
        sessionId,
        data: {
          paymentMethod: completionData.paymentMethod,
        },
      });

      // Complete checkout
      const result = await completeCheckout.mutateAsync(completionData);

      return result;
    } catch (error) {
      throw error;
    }
  };

  return {
    completeCheckoutFlow,
    isLoading: completeCheckout.isPending || updateSession.isPending,
    error: completeCheckout.error || updateSession.error,
  };
};

/**
 * Real-time checkout session management
 */
export const useCheckoutSessionManager = (sessionId: string) => {
  const queryClient = useQueryClient();
  const updateSession = useUpdateCheckoutSession();
  const { data: session, isLoading, error } = useCheckoutSession(sessionId);

  const updateSessionData = async (data: Partial<CheckoutData>) => {
    return updateSession.mutateAsync({ sessionId, data });
  };

  const updateStep = async (step: CheckoutSession["step"]) => {
    return updateSession.mutateAsync({
      sessionId,
      data: { step } as unknown,
    });
  };

  // Auto-save session data periodically
  const autoSave = React.useCallback(
    (data: Partial<CheckoutData>) => {
      const timeoutId = setTimeout(() => {
        updateSessionData(data);
      }, 1000); // Debounce auto-save by 1 second

      return () => clearTimeout(timeoutId);
    },
    [sessionId]
  );

  return {
    session,
    isLoading: isLoading || updateSession.isPending,
    error: error || updateSession.error,
    updateSessionData,
    updateStep,
    autoSave,
    isExpired: session ? new Date(session.expiresAt) < new Date() : false,
  };
};
