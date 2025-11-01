/**
 * Checkout API Integration Services
 * Handles all checkout-related API calls with error handling and retry logic
 */

import apiClient from "./client";
import {
  CheckoutData,
  CheckoutItem,
  CheckoutValidationData,
  CheckoutValidationResult,
  CheckoutTotals,
  CheckoutSession,
  CheckoutCompletionData,
  CheckoutCompletionResult,
} from "./hooks/checkout";

// Types for API responses
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface CheckoutSessionResponse {
  success: boolean;
  data: CheckoutSession;
  message?: string;
  errors?: string[];
}

export interface CheckoutValidationResponse {
  success: boolean;
  data: CheckoutValidationResult;
  message?: string;
  errors?: string[];
}

export interface CheckoutTotalsResponse {
  success: boolean;
  data: CheckoutTotals;
  message?: string;
  errors?: string[];
}

export interface CheckoutCompletionResponse {
  success: boolean;
  data: CheckoutCompletionResult;
  message?: string;
  errors?: string[];
}

export interface StoreCheckoutConfig {
  storeId: number;
  storeName: string;
  logo?: string;
  branding: {
    primaryColor: string;
    secondaryColor: string;
    logoUrl?: string;
  };
  paymentMethods: Array<{
    type: "card" | "bank_transfer" | "wallet";
    gateway: "paystack" | "flutterwave" | "basepay";
    enabled: boolean;
    config?: Record<string, unknown>;
  }>;
  shippingOptions: Array<{
    id: string;
    name: string;
    description?: string;
    cost: number;
    estimatedDays: number;
    enabled: boolean;
  }>;
  taxConfig: {
    enabled: boolean;
    rate: number;
    inclusive: boolean;
  };
  policies: {
    termsUrl?: string;
    privacyUrl?: string;
    returnPolicy?: string;
    shippingPolicy?: string;
  };
}

export interface OrderTrackingData {
  orderId: number;
  orderNumber: string;
  status: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  events: Array<{
    id: number;
    status: string;
    description: string;
    location?: string;
    timestamp: string;
  }>;
}

// Error handling utility
class CheckoutApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public errors?: string[],
    public retryable: boolean = false
  ) {
    super(message);
    this.name = "CheckoutApiError";
  }
}

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  retryableStatusCodes: [408, 429, 500, 502, 503, 504],
};

// Retry utility function
async function withRetry<T>(
  operation: () => Promise<T>,
  retries: number = RETRY_CONFIG.maxRetries
): Promise<T> {
  try {
    return await operation();
  } catch (error: unknown) {
    const errorObj = error as { response?: { status?: number }; code?: string };
    const isRetryable =
      retries > 0 &&
      (RETRY_CONFIG.retryableStatusCodes.includes(
        errorObj.response?.status || 0
      ) ||
        errorObj.code === "NETWORK_ERROR" ||
        errorObj.code === "TIMEOUT");

    if (!isRetryable) {
      throw error;
    }

    const delay = Math.min(
      RETRY_CONFIG.baseDelay * Math.pow(2, RETRY_CONFIG.maxRetries - retries),
      RETRY_CONFIG.maxDelay
    );

    await new Promise((resolve) => setTimeout(resolve, delay));
    return withRetry(operation, retries - 1);
  }
}

// API error handler
function handleApiError(error: unknown): never {
  const errorObj = error as {
    response?: {
      status?: number;
      data?: { message?: string; errors?: string[] };
    };
    message?: string;
  };
  const statusCode = errorObj.response?.status;
  const message =
    errorObj.response?.data?.message || errorObj.message || "An error occurred";
  const errors = errorObj.response?.data?.errors || [];
  const retryable = RETRY_CONFIG.retryableStatusCodes.includes(statusCode || 0);

  throw new CheckoutApiError(message, statusCode, errors, retryable);
}

// Checkout API service class
export class CheckoutApiService {
  /**
   * Validate checkout data including inventory and pricing
   */
  static async validateCheckout(
    data: CheckoutValidationData
  ): Promise<CheckoutValidationResult> {
    try {
      return await withRetry(async () => {
        const response = await apiClient.post<CheckoutValidationResponse>(
          "/checkout/validate",
          data
        );
        return response.data.data;
      });
    } catch (error) {
      handleApiError(error);
    }
  }

  /**
   * Calculate checkout totals with shipping, tax, and discounts
   */
  static async calculateTotals(data: {
    storeId: number;
    items: CheckoutItem[];
    shippingAddress?: CheckoutValidationData["shippingAddress"];
    couponCode?: string;
  }): Promise<CheckoutTotals> {
    try {
      return await withRetry(async () => {
        const response = await apiClient.post<CheckoutTotalsResponse>(
          "/checkout/calculate",
          data
        );
        return response.data.data;
      });
    } catch (error) {
      handleApiError(error);
    }
  }

  /**
   * Create a new checkout session
   */
  static async createSession(data: {
    storeId: number;
    items: CheckoutItem[];
  }): Promise<CheckoutSession> {
    try {
      return await withRetry(async () => {
        const response = await apiClient.post<CheckoutSessionResponse>(
          "/checkout/session",
          data
        );
        return response.data.data;
      });
    } catch (error) {
      handleApiError(error);
    }
  }

  /**
   * Get checkout session by ID
   */
  static async getSession(sessionId: string): Promise<CheckoutSession> {
    try {
      return await withRetry(async () => {
        const response = await apiClient.get<CheckoutSessionResponse>(
          `/checkout/session/${sessionId}`
        );
        return response.data.data;
      });
    } catch (error) {
      handleApiError(error);
    }
  }

  /**
   * Update checkout session data
   */
  static async updateSession(
    sessionId: string,
    data: Partial<CheckoutData>
  ): Promise<CheckoutSession> {
    try {
      return await withRetry(async () => {
        const response = await apiClient.patch<CheckoutSessionResponse>(
          `/checkout/session/${sessionId}`,
          data
        );
        return response.data.data;
      });
    } catch (error) {
      handleApiError(error);
    }
  }

  /**
   * Complete checkout and create order
   */
  static async completeCheckout(
    data: CheckoutCompletionData
  ): Promise<CheckoutCompletionResult> {
    try {
      return await withRetry(async () => {
        const response = await apiClient.post<CheckoutCompletionResponse>(
          "/checkout/complete",
          data
        );
        return response.data.data;
      });
    } catch (error) {
      handleApiError(error);
    }
  }

  /**
   * Get store-specific checkout configuration
   */
  static async getStoreConfig(storeId: number): Promise<StoreCheckoutConfig> {
    try {
      return await withRetry(async () => {
        const response = await apiClient.get<ApiResponse<StoreCheckoutConfig>>(
          `/checkout/store/${storeId}/config`
        );
        return response.data.data;
      });
    } catch (error) {
      handleApiError(error);
    }
  }

  /**
   * Validate inventory for checkout items
   */
  static async validateInventory(data: {
    storeId: number;
    items: CheckoutItem[];
  }): Promise<{
    valid: boolean;
    errors: string[];
    availableItems: Array<{
      productId: number;
      variantId?: number;
      availableQuantity: number;
      requestedQuantity: number;
    }>;
  }> {
    try {
      return await withRetry(async () => {
        const response = await apiClient.post(
          "/checkout/validate-inventory",
          data
        );
        return response.data.data;
      });
    } catch (error) {
      handleApiError(error);
    }
  }

  /**
   * Apply coupon code to checkout
   */
  static async applyCoupon(data: {
    sessionId: string;
    couponCode: string;
  }): Promise<{
    valid: boolean;
    discount: number;
    message: string;
  }> {
    try {
      return await withRetry(async () => {
        const response = await apiClient.post("/checkout/apply-coupon", data);
        return response.data.data;
      });
    } catch (error) {
      handleApiError(error);
    }
  }

  /**
   * Remove coupon from checkout
   */
  static async removeCoupon(sessionId: string): Promise<void> {
    try {
      await withRetry(async () => {
        await apiClient.delete(`/checkout/session/${sessionId}/coupon`);
      });
    } catch (error) {
      handleApiError(error);
    }
  }

  /**
   * Get available shipping options for address
   */
  static async getShippingOptions(data: {
    storeId: number;
    address: CheckoutValidationData["shippingAddress"];
    items: CheckoutItem[];
  }): Promise<
    Array<{
      id: string;
      name: string;
      description?: string;
      cost: number;
      estimatedDays: number;
    }>
  > {
    try {
      return await withRetry(async () => {
        const response = await apiClient.post(
          "/checkout/shipping-options",
          data
        );
        return response.data.data;
      });
    } catch (error) {
      handleApiError(error);
    }
  }

  /**
   * Estimate taxes for checkout
   */
  static async estimateTaxes(data: {
    storeId: number;
    items: CheckoutItem[];
    address: CheckoutValidationData["shippingAddress"];
  }): Promise<{
    taxAmount: number;
    taxRate: number;
    breakdown: Array<{
      type: string;
      rate: number;
      amount: number;
    }>;
  }> {
    try {
      return await withRetry(async () => {
        const response = await apiClient.post("/checkout/estimate-taxes", data);
        return response.data.data;
      });
    } catch (error) {
      handleApiError(error);
    }
  }
}

// Payment processing API service
export class PaymentApiService {
  /**
   * Initialize payment for order
   */
  static async initializePayment(data: {
    orderId: number;
    amount: number;
    currency?: string;
    method: "CARD" | "BANK_TRANSFER" | "WALLET";
    gateway: "PAYSTACK" | "FLUTTERWAVE" | "BASEPAY";
    callbackUrl?: string;
    metadata?: Record<string, unknown>;
  }): Promise<{
    success: boolean;
    reference: string;
    authorizationUrl?: string;
    accessCode?: string;
    paymentData?: Record<string, unknown>;
  }> {
    try {
      return await withRetry(async () => {
        const response = await apiClient.post("/payments/initialize", data);
        return response.data.data;
      });
    } catch (error) {
      handleApiError(error);
    }
  }

  /**
   * Verify payment status
   */
  static async verifyPayment(reference: string): Promise<{
    success: boolean;
    reference: string;
    amount: number;
    currency: string;
    status: string;
    paidAt?: string;
  }> {
    try {
      return await withRetry(async () => {
        const response = await apiClient.get(`/payments/verify/${reference}`);
        return response.data.data;
      });
    } catch (error) {
      handleApiError(error);
    }
  }

  /**
   * Get payment status
   */
  static async getPaymentStatus(reference: string): Promise<{
    reference: string;
    status: "pending" | "processing" | "success" | "failed" | "cancelled";
    amount: number;
    method: string;
    gateway?: string;
    createdAt: string;
    updatedAt: string;
  }> {
    try {
      return await withRetry(async () => {
        const response = await apiClient.get(`/payments/status/${reference}`);
        return response.data.data;
      });
    } catch (error) {
      handleApiError(error);
    }
  }

  /**
   * Retry failed payment
   */
  static async retryPayment(
    reference: string,
    data: {
      preferredGateway?: string;
      callbackUrl?: string;
    }
  ): Promise<{
    success: boolean;
    reference: string;
    authorizationUrl?: string;
  }> {
    try {
      return await withRetry(async () => {
        const response = await apiClient.post(
          `/payments/retry/${reference}`,
          data
        );
        return response.data.data;
      });
    } catch (error) {
      handleApiError(error);
    }
  }
}

// Order tracking API service
export class OrderTrackingApiService {
  /**
   * Get order tracking information
   */
  static async getOrderTracking(
    orderNumber: string
  ): Promise<OrderTrackingData> {
    try {
      return await withRetry(async () => {
        const response = await apiClient.get(`/orders/track/${orderNumber}`);
        return response.data.data;
      });
    } catch (error) {
      handleApiError(error);
    }
  }

  /**
   * Update order status (for store owners)
   */
  static async updateOrderStatus(
    orderId: number,
    status: string,
    notes?: string
  ): Promise<void> {
    try {
      await withRetry(async () => {
        await apiClient.patch(`/orders/${orderId}/status`, {
          status,
          notes,
        });
      });
    } catch (error) {
      handleApiError(error);
    }
  }

  /**
   * Add tracking information to order
   */
  static async addTrackingInfo(
    orderId: number,
    data: {
      trackingNumber: string;
      carrier: string;
      trackingUrl?: string;
    }
  ): Promise<void> {
    try {
      await withRetry(async () => {
        await apiClient.post(`/orders/${orderId}/tracking`, data);
      });
    } catch (error) {
      handleApiError(error);
    }
  }

  /**
   * Cancel order
   */
  static async cancelOrder(orderId: number, reason?: string): Promise<void> {
    try {
      await withRetry(async () => {
        await apiClient.patch(`/orders/${orderId}/cancel`, {
          reason,
        });
      });
    } catch (error) {
      handleApiError(error);
    }
  }
}

// Utility functions for error handling
export const isRetryableError = (error: unknown): boolean => {
  return error instanceof CheckoutApiError && error.retryable;
};

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof CheckoutApiError) {
    return error.message;
  }
  const errorObj = error as { message?: string };
  return errorObj.message || "An unexpected error occurred";
};

export const getErrorDetails = (error: unknown): string[] => {
  if (error instanceof CheckoutApiError && error.errors) {
    return error.errors;
  }
  return [];
};

// Export the main API service
export const checkoutApi = CheckoutApiService;
export const paymentApi = PaymentApiService;
export const orderTrackingApi = OrderTrackingApiService;

// Export error class for type checking
export { CheckoutApiError };

// Default export
const checkoutApiDefault = {
  checkout: CheckoutApiService,
  payment: PaymentApiService,
  orderTracking: OrderTrackingApiService,
  errors: {
    CheckoutApiError,
    isRetryableError,
    getErrorMessage,
    getErrorDetails,
  },
};

export default checkoutApiDefault;
