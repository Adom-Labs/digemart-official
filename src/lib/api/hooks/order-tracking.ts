"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderTrackingApi } from "../order-tracking";
import { QUERY_KEYS } from "../query-keys";

// Types
export interface OrderTrackingEvent {
  id: number;
  orderId: number;
  status: string;
  description: string;
  location?: string;
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderTrackingTimeline {
  orderId: number;
  currentStatus: string;
  orderDate: string;
  estimatedDelivery?: string;
  timeline: OrderTrackingEvent[];
  order: {
    id: number;
    totalAmount: number;
    customerName: string;
    customerEmail: string;
    storeName: string;
    orderItems: Array<{
      productName: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
      variantName?: string;
    }>;
    shippingAddress?: {
      fullName: string;
      address: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
  };
}

export interface CreateTrackingData {
  status: string;
  description: string;
  location?: string;
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: string;
  notes?: string;
}

export interface UpdateTrackingData extends Partial<CreateTrackingData> {}

export interface GuestTrackingRequest {
  orderId: number;
  email: string;
}

// Hooks for authenticated users
export function useOrderTracking(
  orderId: number,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: QUERY_KEYS.orderTracking(orderId),
    queryFn: () => orderTrackingApi.getOrderTracking(orderId),
    enabled: options?.enabled !== false,
    staleTime: 30000, // 30 seconds
    retry: (failureCount, error: any) => {
      // Don't retry on 404 or 403 errors
      if (error?.response?.status === 404 || error?.response?.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

export function useAddOrderTracking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      data,
    }: {
      orderId: number;
      data: CreateTrackingData;
    }) => orderTrackingApi.addOrderTracking(orderId, data),
    onSuccess: (_, { orderId }) => {
      // Invalidate and refetch order tracking
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.orderTracking(orderId),
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.order(orderId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders() });
    },
  });
}

export function useUpdateOrderTracking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      trackingId,
      data,
    }: {
      trackingId: number;
      data: UpdateTrackingData;
    }) => orderTrackingApi.updateOrderTracking(trackingId, data),
    onSuccess: (data) => {
      // Invalidate and refetch order tracking
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.orderTracking(data.orderId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.order(data.orderId),
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders() });
    },
  });
}

// Hooks for guest users
export function useGuestOrderTracking(
  request: GuestTrackingRequest,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: QUERY_KEYS.guestOrderTracking(request.orderId, request.email),
    queryFn: () => orderTrackingApi.getGuestOrderTracking(request),
    enabled: options?.enabled !== false && !!request.email,
    staleTime: 30000, // 30 seconds
    retry: (failureCount, error: any) => {
      // Don't retry on 404 errors
      if (error?.response?.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

// Hook for store owners to manage order tracking
export function useStoreOrderTracking(
  storeId: number,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: QUERY_KEYS.storeOrders(storeId),
    queryFn: () => orderTrackingApi.getStoreOrders(storeId),
    enabled: options?.enabled !== false,
    staleTime: 60000, // 1 minute
  });
}

// Hook for order history with tracking
export function useOrderHistory(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: QUERY_KEYS.orderHistory(),
    queryFn: () => orderTrackingApi.getOrderHistory(),
    enabled: options?.enabled !== false,
    staleTime: 60000, // 1 minute
  });
}

// Utility hook for tracking status formatting
export function useTrackingStatus() {
  const formatStatus = (status: string) => {
    return status
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: "bg-yellow-100 text-yellow-800",
      PROCESSING: "bg-blue-100 text-blue-800",
      TRANSIT: "bg-purple-100 text-purple-800",
      DELIVERED: "bg-green-100 text-green-800",
      COMPLETED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800",
      RETURNED: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, string> = {
      PENDING: "⏳",
      PROCESSING: "📦",
      TRANSIT: "🚚",
      DELIVERED: "✅",
      COMPLETED: "🎉",
      CANCELLED: "❌",
      RETURNED: "↩️",
    };
    return icons[status] || "📋";
  };

  return {
    formatStatus,
    getStatusColor,
    getStatusIcon,
  };
}
