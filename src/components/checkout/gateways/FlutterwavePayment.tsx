"use client";

import { useState, useEffect } from "react";
import { CreditCard, Loader2, ExternalLink, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useFlutterwavePayment } from "@/lib/api/hooks/payments";

export interface FlutterwavePaymentProps {
  orderId: number;
  amount: number;
  currency?: string;
  method: "card";
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  onSuccess: (reference: string) => void;
  onError: (error: string) => void;
  onCancel?: () => void;
  disabled?: boolean;
}

export function FlutterwavePayment({
  orderId,
  amount,
  currency = "NGN",
  method,
  customerEmail,
  customerName,
  customerPhone,
  onSuccess,
  onError,
  onCancel,
  disabled = false,
}: FlutterwavePaymentProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const { processPayment, isLoading, error } = useFlutterwavePayment();

  const handlePayment = async () => {
    if (disabled || isProcessing) return;

    setIsProcessing(true);
    setPaymentUrl(null);

    try {
      const result = await processPayment({
        orderId,
        amount,
        currency,
        method: "CARD",
        callbackUrl: `${window.location.origin}/checkout/callback`,
        metadata: {
          customerEmail,
          customerName,
          customerPhone,
          paymentMethod: method,
        },
      });

      if (result.success && result.authorizationUrl) {
        setPaymentUrl(result.authorizationUrl);

        // For Flutterwave, we'll open in a popup window
        openPaymentWindow(result.authorizationUrl);
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

  const openPaymentWindow = (url: string) => {
    const paymentWindow = window.open(
      url,
      "flutterwave_payment",
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
      }
    }, 1000);
  };

  // Listen for payment callback messages
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      const { type, reference, status } = event.data;

      if (type === "flutterwave_callback") {
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

  return (
    <div className="space-y-4">
      {/* Payment Method Info */}
      <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
        <div className="flex items-center space-x-3 mb-2">
          <CreditCard className="h-5 w-5 text-orange-600" />
          <div>
            <h4 className="font-medium text-orange-900">
              Pay with Card (International)
            </h4>
            <p className="text-sm text-orange-700">
              Secure international card payment via Flutterwave
            </p>
          </div>
        </div>

        <div className="text-sm text-orange-800">
          <p>
            <strong>Amount:</strong> {currency} {amount.toLocaleString()}
          </p>
          <p>
            <strong>Gateway:</strong> Flutterwave
          </p>
          <p>
            <strong>Supports:</strong> International cards, multiple currencies
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
        <Button
          onClick={handlePayment}
          disabled={disabled || isProcessing || isLoading}
          className="w-full bg-orange-600 hover:bg-orange-700"
          size="lg"
        >
          {isProcessing || isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Initializing Payment...
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4 mr-2" />
              Pay {currency} {amount.toLocaleString()}
            </>
          )}
        </Button>

        {paymentUrl && (
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Payment window opened. Complete your payment in the popup window.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => openPaymentWindow(paymentUrl)}
              className="mt-2"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Reopen Payment Window
            </Button>
          </div>
        )}
      </div>

      {/* Payment Instructions */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h5 className="font-medium text-gray-900 mb-2">Payment Instructions</h5>
        <div className="text-sm text-gray-600 space-y-1">
          <p>• A secure payment window will open</p>
          <p>• Enter your card details in the Flutterwave form</p>
          <p>• Complete any additional verification steps</p>
          <p>• You'll be notified when payment is complete</p>
          <p>• International cards and multiple currencies supported</p>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-2 gap-4 text-xs">
        <div className="p-3 bg-white border border-gray-200 rounded">
          <div className="flex items-center space-x-2 mb-1">
            <Globe className="h-3 w-3 text-orange-600" />
            <span className="font-medium">International</span>
          </div>
          <p className="text-gray-600">
            Supports cards from anywhere in the world
          </p>
        </div>
        <div className="p-3 bg-white border border-gray-200 rounded">
          <div className="flex items-center space-x-2 mb-1">
            <CreditCard className="h-3 w-3 text-orange-600" />
            <span className="font-medium">Multi-Currency</span>
          </div>
          <p className="text-gray-600">
            Accept payments in multiple currencies
          </p>
        </div>
      </div>

      {/* Security Notice */}
      <div className="text-xs text-gray-500 text-center">
        <p>🔒 Secured by Flutterwave • PCI DSS Compliant</p>
      </div>
    </div>
  );
}
