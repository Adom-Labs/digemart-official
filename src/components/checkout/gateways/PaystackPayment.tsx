"use client";

import { useState, useEffect } from "react";
import { CreditCard, Building2, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { usePaystackPayment } from "@/lib/api/hooks/payments";

export interface PaystackPaymentProps {
  orderId: number;
  amount: number;
  currency?: string;
  method: "card" | "bank_transfer";
  customerEmail: string;
  onSuccess: (reference: string) => void;
  onError: (error: string) => void;
  onCancel?: () => void;
  disabled?: boolean;
}

export function PaystackPayment({
  orderId,
  amount,
  currency = "NGN",
  method,
  customerEmail,
  onSuccess,
  onError,
  onCancel,
  disabled = false,
}: PaystackPaymentProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const { processPayment, isLoading, error } = usePaystackPayment();

  const handlePayment = async () => {
    if (disabled || isProcessing) return;

    setIsProcessing(true);
    setPaymentUrl(null);

    try {
      const result = await processPayment({
        orderId,
        amount,
        currency,
        method: method === "card" ? "CARD" : "BANK_TRANSFER",
        callbackUrl: `${window.location.origin}/checkout/callback`,
        metadata: {
          customerEmail,
          paymentMethod: method,
        },
      });

      if (result.success && result.authorizationUrl) {
        setPaymentUrl(result.authorizationUrl);

        // For card payments, redirect immediately
        if (method === "card") {
          window.location.href = result.authorizationUrl;
        }
      } else {
        throw new Error(result.message || "Payment initialization failed");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Payment failed";
      onError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const openPaymentWindow = () => {
    if (!paymentUrl) return;

    const paymentWindow = window.open(
      paymentUrl,
      "paystack_payment",
      "width=600,height=700,scrollbars=yes,resizable=yes"
    );

    if (!paymentWindow) {
      onError("Please allow popups for this site to complete payment");
      return;
    }

    // Monitor payment window
    const checkClosed = setInterval(() => {
      if (paymentWindow.closed) {
        clearInterval(checkClosed);
        // Payment window closed - check for success via callback
        // The actual success handling will be done via the callback URL
      }
    }, 1000);
  };

  // Listen for payment callback messages
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      const { type, reference, status } = event.data;

      if (type === "paystack_callback") {
        if (status === "success" && reference) {
          onSuccess(reference);
        } else if (status === "cancelled") {
          onCancel?.();
        } else {
          onError("Payment failed or was cancelled");
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onSuccess, onError, onCancel]);

  const getMethodIcon = () => {
    return method === "card" ? (
      <CreditCard className="h-5 w-5" />
    ) : (
      <Building2 className="h-5 w-5" />
    );
  };

  const getMethodTitle = () => {
    return method === "card" ? "Pay with Card" : "Bank Transfer";
  };

  const getMethodDescription = () => {
    return method === "card"
      ? "Secure card payment via Paystack"
      : "Direct bank transfer via Paystack";
  };

  return (
    <div className="space-y-4">
      {/* Payment Method Info */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center space-x-3 mb-2">
          {getMethodIcon()}
          <div>
            <h4 className="font-medium text-blue-900">{getMethodTitle()}</h4>
            <p className="text-sm text-blue-700">{getMethodDescription()}</p>
          </div>
        </div>

        <div className="text-sm text-blue-800">
          <p>
            <strong>Amount:</strong> {currency} {amount.toLocaleString()}
          </p>
          <p>
            <strong>Gateway:</strong> Paystack
          </p>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            {error.message || "Payment processing failed"}
          </AlertDescription>
        </Alert>
      )}

      {/* Payment Actions */}
      <div className="space-y-3">
        {!paymentUrl ? (
          <Button
            onClick={handlePayment}
            disabled={disabled || isProcessing || isLoading}
            className="w-full"
            size="lg"
          >
            {isProcessing || isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Initializing Payment...
              </>
            ) : (
              <>
                {getMethodIcon()}
                <span className="ml-2">
                  Pay {currency} {amount.toLocaleString()}
                </span>
              </>
            )}
          </Button>
        ) : (
          <div className="space-y-3">
            {method === "bank_transfer" && (
              <Button
                onClick={openPaymentWindow}
                disabled={disabled}
                className="w-full"
                size="lg"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Payment Page
              </Button>
            )}

            <div className="text-center">
              <p className="text-sm text-gray-600">
                {method === "card"
                  ? "Redirecting to Paystack..."
                  : "Click above to open the payment page"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Payment Instructions */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h5 className="font-medium text-gray-900 mb-2">Payment Instructions</h5>
        <div className="text-sm text-gray-600 space-y-1">
          {method === "card" ? (
            <>
              <p>• You'll be redirected to Paystack's secure payment page</p>
              <p>• Enter your card details and complete the payment</p>
              <p>• You'll be redirected back after payment completion</p>
              <p>• Payment is processed instantly</p>
            </>
          ) : (
            <>
              <p>• Click "Open Payment Page" to get bank transfer details</p>
              <p>• Transfer the exact amount to the provided account</p>
              <p>• Your payment will be confirmed automatically</p>
              <p>• Processing time: 1-2 business days</p>
            </>
          )}
        </div>
      </div>

      {/* Security Notice */}
      <div className="text-xs text-gray-500 text-center">
        <p>🔒 Secured by Paystack • PCI DSS Compliant</p>
      </div>
    </div>
  );
}
