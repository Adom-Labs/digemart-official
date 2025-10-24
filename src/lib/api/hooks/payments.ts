"use client";

import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Types
export interface PaymentInitializationData {
  orderId: number;
  amount: number;
  currency?: string;
  method: "CARD" | "BANK_TRANSFER" | "WALLET";
  callbackUrl?: string;
  preferredGateway?: "PAYSTACK" | "FLUTTERWAVE" | "BASEPAY";
  metadata?: Record<string, any>;
}

export interface PaymentInitializationResponse {
  success: boolean;
  reference: string;
  authorizationUrl?: string;
  accessCode?: string;
  paymentData?: any;
  message?: string;
}

export interface PaymentVerificationResponse {
  success: boolean;
  reference: string;
  amount: number;
  currency: string;
  status: string;
  paidAt?: string;
  message?: string;
}

export interface PaymentStatusResponse {
  reference: string;
  status: "pending" | "processing" | "success" | "failed" | "cancelled";
  amount: number;
  method: string;
  gateway?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupportedPaymentMethods {
  methods: string[];
  gateways: Array<{
    type: string;
    name: string;
    supportedMethods: string[];
  }>;
}

// API functions
const initializePayment = async (
  data: PaymentInitializationData
): Promise<PaymentInitializationResponse> => {
  const response = await fetch("/api/payments/initialize", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Payment initialization failed");
  }

  return response.json();
};

const verifyPayment = async (
  reference: string
): Promise<PaymentVerificationResponse> => {
  const response = await fetch(`/api/payments/verify/${reference}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Payment verification failed");
  }

  return response.json();
};

const getPaymentStatus = async (
  reference: string
): Promise<PaymentStatusResponse> => {
  const response = await fetch(`/api/payments/status/${reference}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to get payment status");
  }

  return response.json();
};

const retryPayment = async (
  reference: string,
  data: { preferredGateway?: string; callbackUrl?: string }
): Promise<PaymentInitializationResponse> => {
  const response = await fetch(`/api/payments/retry/${reference}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Payment retry failed");
  }

  return response.json();
};

const getSupportedPaymentMethods =
  async (): Promise<SupportedPaymentMethods> => {
    const response = await fetch("/api/payments/methods", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to get payment methods");
    }

    return response.json();
  };

// React Query hooks
export const useInitializePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: initializePayment,
    onSuccess: (data) => {
      // Invalidate payment-related queries
      queryClient.invalidateQueries({ queryKey: ["payments"] });

      if (data.success) {
        toast.success("Payment initialized successfully");
      } else {
        toast.error(data.message || "Payment initialization failed");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Payment initialization failed");
    },
  });
};

export const useVerifyPayment = () => {
  return useMutation({
    mutationFn: verifyPayment,
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Payment verified successfully");
      } else {
        toast.error(data.message || "Payment verification failed");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Payment verification failed");
    },
  });
};

export const usePaymentStatus = (
  reference: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["payment", "status", reference],
    queryFn: () => getPaymentStatus(reference),
    enabled: enabled && !!reference,
    refetchInterval: (data) => {
      // Stop polling if payment is completed or failed
      if (
        data?.status === "success" ||
        data?.status === "failed" ||
        data?.status === "cancelled"
      ) {
        return false;
      }
      // Poll every 5 seconds for pending/processing payments
      return 5000;
    },
    retry: (failureCount, error) => {
      // Don't retry if payment not found
      if (error.message.includes("not found")) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

export const useRetryPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reference,
      data,
    }: {
      reference: string;
      data: { preferredGateway?: string; callbackUrl?: string };
    }) => retryPayment(reference, data),
    onSuccess: (data) => {
      // Invalidate payment-related queries
      queryClient.invalidateQueries({ queryKey: ["payments"] });

      if (data.success) {
        toast.success("Payment retry initialized successfully");
      } else {
        toast.error(data.message || "Payment retry failed");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Payment retry failed");
    },
  });
};

export const useSupportedPaymentMethods = () => {
  return useQuery({
    queryKey: ["payments", "methods"],
    queryFn: getSupportedPaymentMethods,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Utility hooks
export const usePaymentPolling = (
  reference: string,
  onStatusChange?: (status: PaymentStatusResponse) => void
) => {
  const {
    data: paymentStatus,
    isLoading,
    error,
  } = usePaymentStatus(reference, !!reference);

  // Call callback when status changes
  React.useEffect(() => {
    if (paymentStatus && onStatusChange) {
      onStatusChange(paymentStatus);
    }
  }, [paymentStatus, onStatusChange]);

  return {
    paymentStatus,
    isLoading,
    error,
    isCompleted: paymentStatus?.status === "success",
    isFailed:
      paymentStatus?.status === "failed" ||
      paymentStatus?.status === "cancelled",
    isPending:
      paymentStatus?.status === "pending" ||
      paymentStatus?.status === "processing",
  };
};

// Payment gateway specific hooks
export const usePaystackPayment = () => {
  const initializePayment = useInitializePayment();

  const processPaystackPayment = async (
    data: Omit<PaymentInitializationData, "preferredGateway">
  ) => {
    return initializePayment.mutateAsync({
      ...data,
      preferredGateway: "PAYSTACK",
    });
  };

  return {
    processPayment: processPaystackPayment,
    isLoading: initializePayment.isPending,
    error: initializePayment.error,
  };
};

export const useFlutterwavePayment = () => {
  const initializePayment = useInitializePayment();

  const processFlutterwavePayment = async (
    data: Omit<PaymentInitializationData, "preferredGateway">
  ) => {
    return initializePayment.mutateAsync({
      ...data,
      preferredGateway: "FLUTTERWAVE",
    });
  };

  return {
    processPayment: processFlutterwavePayment,
    isLoading: initializePayment.isPending,
    error: initializePayment.error,
  };
};

export const useBasepayPayment = () => {
  const initializePayment = useInitializePayment();

  const processBasepayPayment = async (
    data: Omit<PaymentInitializationData, "preferredGateway">
  ) => {
    return initializePayment.mutateAsync({
      ...data,
      preferredGateway: "BASEPAY",
    });
  };

  return {
    processPayment: processBasepayPayment,
    isLoading: initializePayment.isPending,
    error: initializePayment.error,
  };
};
