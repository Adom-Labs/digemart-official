"use client";

import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";

import dynamic from "next/dynamic";

// Lazy load payment gateway components for better performance
const PaystackPayment = dynamic(
  () =>
    import("./gateways/PaystackPayment").then((mod) => ({
      default: mod.PaystackPayment,
    })),
  {
    loading: () => <PaymentGatewaySkeleton />,
    ssr: false, // Payment gateways are client-side only
  }
);

const FlutterwavePayment = dynamic(
  () =>
    import("./gateways/FlutterwavePayment").then((mod) => ({
      default: mod.FlutterwavePayment,
    })),
  {
    loading: () => <PaymentGatewaySkeleton />,
    ssr: false,
  }
);

const BasepayPayment = dynamic(
  () =>
    import("./gateways/BasepayPayment").then((mod) => ({
      default: mod.BasepayPayment,
    })),
  {
    loading: () => <PaymentGatewaySkeleton />,
    ssr: false,
  }
);

export interface PaymentData {
  orderId: number;
  amount: number;
  currency?: string;
  method: "card" | "bank_transfer" | "wallet";
  gateway: "paystack" | "flutterwave" | "basepay";
  callbackUrl?: string;
  metadata?: Record<string, any>;
}

export interface PaymentResult {
  success: boolean;
  reference: string;
  authorizationUrl?: string;
  accessCode?: string;
  paymentData?: any;
  message?: string;
}

export interface PaymentProcessorProps {
  paymentData: PaymentData;
  customerInfo: {
    email: string;
    name: string;
    phone?: string;
  };
  onPaymentSuccess: (result: PaymentResult) => void;
  onPaymentError: (error: string) => void;
  onPaymentCancel?: () => void;
  disabled?: boolean;
  className?: string;
}

export function PaymentProcessor({
  paymentData,
  customerInfo,
  onPaymentSuccess,
  onPaymentError,
  onPaymentCancel,
  disabled = false,
  className = "",
}: PaymentProcessorProps) {
  const handlePaymentSuccess = (reference: string) => {
    onPaymentSuccess({
      success: true,
      reference,
      message: "Payment completed successfully",
    });
  };

  const handlePaymentError = (error: string) => {
    onPaymentError(error);
  };

  const handlePaymentCancel = () => {
    onPaymentCancel?.();
  };

  // Render gateway-specific payment component
  const renderPaymentGateway = () => {
    const commonProps = {
      orderId: paymentData.orderId,
      amount: paymentData.amount,
      currency: paymentData.currency || "NGN",
      customerEmail: customerInfo.email,
      onSuccess: handlePaymentSuccess,
      onError: handlePaymentError,
      onCancel: handlePaymentCancel,
      disabled,
    };

    switch (paymentData.gateway) {
      case "paystack":
        return (
          <PaystackPayment
            {...commonProps}
            method={paymentData.method as "card" | "bank_transfer"}
          />
        );

      case "flutterwave":
        return (
          <FlutterwavePayment
            {...commonProps}
            method="card"
            customerName={customerInfo.name}
            customerPhone={customerInfo.phone}
          />
        );

      case "basepay":
        return (
          <BasepayPayment
            {...commonProps}
            method="wallet"
            currency={paymentData.currency || "USD"} // BasePay typically uses USD
          />
        );

      default:
        return (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Unsupported payment gateway: {paymentData.gateway}
            </AlertDescription>
          </Alert>
        );
    }
  };

  return (
    <Card className={className}>
      <CardContent className="p-6">{renderPaymentGateway()}</CardContent>
    </Card>
  );
}

// Payment gateway loading skeleton
function PaymentGatewaySkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-6 bg-gray-200 rounded animate-pulse" />
      <div className="space-y-3">
        <div className="h-10 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-10 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
      <div className="h-12 bg-gray-200 rounded animate-pulse" />
    </div>
  );
}
