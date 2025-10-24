"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "../client";

// Types
export interface OrderItem {
  productId: number;
  variantId?: number;
  quantity: number;
  unitPrice: number;
}

export interface CustomerInfo {
  isGuest: boolean;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createAccount?: boolean;
}

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface PaymentMethod {
  type: "card" | "bank_transfer" | "wallet";
  gateway: "paystack" | "flutterwave" | "basepay";
}

export interface CreateOrderData {
  storeId: number;
  items: OrderItem[];
  customerInfo: CustomerInfo;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  couponCode?: string;
  specialInstructions?: string;
}

export interface OrderValidationData {
  storeId: number;
  items: OrderItem[];
  shippingAddress?: ShippingAddress;
  couponId?: number;
}

export interface OrderValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface OrderTotals {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
}

export interface OrderResponse {
  id: number;
  orderNumber: string;
  status: string;
  totalAmount: number;
  paymentReference?: string;
  paymentUrl?: string;
  trackingUrl?: string;
  createdAt: string;
  customer: {
    id: number;
    name: string;
    email: string;
    phone?: string;
  };
  store: {
    id: number;
    storeName: string;
    storeSlug: string;
    logo?: string;
  };
  orderItems: Array<{
    id: number;
    productId: number;
    variantId?: number;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    product: {
      id: number;
      name: string;
      slug: string;
      images?: string[];
    };
    variant?: {
      id: number;
      name: string;
      attributes: Record<string, any>;
    };
  }>;
  shippingAddress?: {
    id: number;
    fullName: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string;
  };
  payments: Array<{
    id: number;
    amount: number;
    method: string;
    status: string;
    reference: string;
    gateway?: string;
    createdAt: string;
  }>;
}

export interface InventoryValidationResult {
  valid: boolean;
  errors: string[];
  availableItems: Array<{
    productId: number;
    variantId?: number;
    availableQuantity: number;
    requestedQuantity: number;
  }>;
}

export interface OrderTrackingInfo {
  orderId: number;
  orderNumber: string;
  status: string;
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: string;
  trackingEvents: Array<{
    id: number;
    status: string;
    description: string;
    location?: string;
    createdAt: string;
  }>;
}

// API functions
const validateOrder = async (
  data: OrderValidationData
): Promise<OrderValidationResult> => {
  const response = await apiClient.post("/checkout/validate", data);
  return response.data;
};

const calculateOrderTotals = async (data: {
  items: OrderItem[];
  storeId: number;
  shippingAddress?: ShippingAddress;
  couponCode?: string;
}): Promise<OrderTotals> => {
  const response = await apiClient.post("/checkout/calculate-totals", data);
  return response.data;
};

const validateInventory = async (data: {
  items: OrderItem[];
  storeId: number;
}): Promise<InventoryValidationResult> => {
  const response = await apiClient.post("/checkout/validate-inventory", data);
  return response.data;
};

const createOrder = async (data: CreateOrderData): Promise<OrderResponse> => {
  const response = await apiClient.post("/orders", data);
  return response.data;
};

const createGuestOrder = async (
  data: CreateOrderData
): Promise<OrderResponse> => {
  const response = await apiClient.post("/checkout/complete-guest", data);
  return response.data;
};

const getOrderById = async (orderId: number): Promise<OrderResponse> => {
  const response = await apiClient.get(`/orders/${orderId}`);
  return response.data;
};

const getGuestOrder = async (
  orderId: number,
  email: string
): Promise<OrderResponse> => {
  const response = await apiClient.get(
    `/orders/guest/${orderId}?email=${encodeURIComponent(email)}`
  );
  return response.data;
};

const getOrderTracking = async (
  orderNumber: string
): Promise<OrderTrackingInfo> => {
  const response = await apiClient.get(`/orders/track/${orderNumber}`);
  return response.data;
};

const cancelOrder = async (orderId: number): Promise<OrderResponse> => {
  const response = await apiClient.patch(`/orders/${orderId}/cancel`);
  return response.data;
};

// React Query hooks
export const useValidateOrder = () => {
  return useMutation({
    mutationFn: validateOrder,
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Order validation failed");
    },
  });
};

export const useCalculateOrderTotals = () => {
  return useMutation({
    mutationFn: calculateOrderTotals,
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to calculate order totals"
      );
    },
  });
};

export const useValidateInventory = () => {
  return useMutation({
    mutationFn: validateInventory,
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Inventory validation failed"
      );
    },
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrder,
    onSuccess: (data) => {
      // Invalidate orders queries
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });

      toast.success(`Order #${data.orderNumber} created successfully!`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create order");
    },
  });
};

export const useCreateGuestOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGuestOrder,
    onSuccess: (data) => {
      // Invalidate cart queries
      queryClient.invalidateQueries({ queryKey: ["cart"] });

      toast.success(`Order #${data.orderNumber} created successfully!`);
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to create guest order"
      );
    },
  });
};

export const useOrder = (orderId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["orders", orderId],
    queryFn: () => getOrderById(orderId),
    enabled: enabled && !!orderId,
    staleTime: 30 * 1000, // 30 seconds
    retry: (failureCount, error: any) => {
      // Don't retry if order not found
      if (error.response?.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

export const useGuestOrder = (
  orderId: number,
  email: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["orders", "guest", orderId, email],
    queryFn: () => getGuestOrder(orderId, email),
    enabled: enabled && !!orderId && !!email,
    staleTime: 30 * 1000, // 30 seconds
    retry: (failureCount, error: any) => {
      // Don't retry if order not found
      if (error.response?.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

export const useOrderTracking = (
  orderNumber: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["orders", "tracking", orderNumber],
    queryFn: () => getOrderTracking(orderNumber),
    enabled: enabled && !!orderNumber,
    refetchInterval: (data) => {
      // Stop polling if order is delivered or cancelled
      if (data?.status === "DELIVERED" || data?.status === "CANCELLED") {
        return false;
      }
      // Poll every 30 seconds for active orders
      return 30 * 1000;
    },
    staleTime: 15 * 1000, // 15 seconds
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelOrder,
    onSuccess: (data) => {
      // Invalidate orders queries
      queryClient.invalidateQueries({ queryKey: ["orders"] });

      toast.success(`Order #${data.orderNumber} cancelled successfully`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to cancel order");
    },
  });
};

// Composite hooks for order placement flow
export const useOrderPlacementFlow = () => {
  const validateOrder = useValidateOrder();
  const calculateTotals = useCalculateOrderTotals();
  const validateInventory = useValidateInventory();
  const createOrder = useCreateOrder();
  const createGuestOrder = useCreateGuestOrder();

  const placeOrder = async (orderData: CreateOrderData) => {
    try {
      // Step 1: Validate order data
      const validation = await validateOrder.mutateAsync({
        storeId: orderData.storeId,
        items: orderData.items,
        shippingAddress: orderData.shippingAddress,
      });

      if (!validation.isValid) {
        throw new Error(
          `Order validation failed: ${validation.errors.join(", ")}`
        );
      }

      // Step 2: Validate inventory
      const inventoryCheck = await validateInventory.mutateAsync({
        items: orderData.items,
        storeId: orderData.storeId,
      });

      if (!inventoryCheck.valid) {
        throw new Error(
          `Inventory validation failed: ${inventoryCheck.errors.join(", ")}`
        );
      }

      // Step 3: Create order
      const order = orderData.customerInfo.isGuest
        ? await createGuestOrder.mutateAsync(orderData)
        : await createOrder.mutateAsync(orderData);

      return order;
    } catch (error) {
      throw error;
    }
  };

  return {
    placeOrder,
    isValidating: validateOrder.isPending || validateInventory.isPending,
    isCreating: createOrder.isPending || createGuestOrder.isPending,
    isLoading:
      validateOrder.isPending ||
      validateInventory.isPending ||
      createOrder.isPending ||
      createGuestOrder.isPending,
    error:
      validateOrder.error ||
      validateInventory.error ||
      createOrder.error ||
      createGuestOrder.error,
  };
};

// Utility hooks
export const useOrderValidationWithTotals = () => {
  const validateOrder = useValidateOrder();
  const calculateTotals = useCalculateOrderTotals();

  const validateAndCalculate = async (data: {
    storeId: number;
    items: OrderItem[];
    shippingAddress?: ShippingAddress;
    couponCode?: string;
  }) => {
    const [validation, totals] = await Promise.all([
      validateOrder.mutateAsync({
        storeId: data.storeId,
        items: data.items,
        shippingAddress: data.shippingAddress,
      }),
      calculateTotals.mutateAsync(data),
    ]);

    return { validation, totals };
  };

  return {
    validateAndCalculate,
    isLoading: validateOrder.isPending || calculateTotals.isPending,
    error: validateOrder.error || calculateTotals.error,
  };
};

export const useOrderStatusPolling = (
  orderId: number,
  onStatusChange?: (order: OrderResponse) => void
) => {
  const { data: order, isLoading, error } = useOrder(orderId, !!orderId);

  // Call callback when status changes
  React.useEffect(() => {
    if (order && onStatusChange) {
      onStatusChange(order);
    }
  }, [order?.status, onStatusChange]);

  return {
    order,
    isLoading,
    error,
    isPending:
      order?.status === "PENDING" || order?.status === "PENDING_PAYMENT",
    isProcessing: order?.status === "PROCESSING",
    isCompleted: order?.status === "COMPLETED" || order?.status === "DELIVERED",
    isCancelled: order?.status === "CANCELLED",
  };
};
