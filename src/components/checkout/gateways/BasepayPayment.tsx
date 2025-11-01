"use client";

import { useState, useEffect } from "react";
import { Wallet, Loader2, ExternalLink, Bitcoin, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useBasepayPayment } from "@/lib/api/hooks/payments";

export interface BasepayPaymentProps {
  orderId: number;
  amount: number;
  currency?: string;
  method: "wallet";
  customerEmail: string;
  onSuccess: (reference: string) => void;
  onError: (error: string) => void;
  onCancel?: () => void;
  disabled?: boolean;
}

const SUPPORTED_CRYPTOCURRENCIES = [
  { symbol: "ETH", name: "Ethereum", icon: "🔷" },
  { symbol: "BTC", name: "Bitcoin", icon: "₿" },
  { symbol: "USDC", name: "USD Coin", icon: "💵" },
  { symbol: "USDT", name: "Tether", icon: "💰" },
];

export function BasepayPayment({
  orderId,
  amount,
  currency = "USD",
  method,
  customerEmail,
  onSuccess,
  onError,
  onCancel,
  disabled = false,
}: BasepayPaymentProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [estimatedNetworkFee, setEstimatedNetworkFee] = useState<string | null>(
    null
  );
  const { processPayment, isLoading, error } = useBasepayPayment();

  const handlePayment = async () => {
    if (disabled || isProcessing) return;

    setIsProcessing(true);
    setPaymentUrl(null);

    try {
      const result = await processPayment({
        orderId,
        amount,
        currency,
        method: "WALLET",
        callbackUrl: `${window.location.origin}/checkout/callback`,
        metadata: {
          customerEmail,
          paymentMethod: method,
          cryptoPayment: true,
        },
      });

      if (result.success && result.authorizationUrl) {
        setPaymentUrl(result.authorizationUrl);

        // Extract network fee estimate if available
        if (result.paymentData?.estimatedNetworkFee) {
          setEstimatedNetworkFee(result.paymentData.estimatedNetworkFee);
        }

        // Open BasePay payment window
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
      "basepay_payment",
      "width=400,height=600,scrollbars=yes,resizable=yes"
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

      if (type === "basepay_callback") {
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
      <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <div className="flex items-center space-x-3 mb-2">
          <Wallet className="h-5 w-5 text-purple-600" />
          <div>
            <h4 className="font-medium text-purple-900">
              Pay with Crypto Wallet
            </h4>
            <p className="text-sm text-purple-700">
              Decentralized payment via BasePay
            </p>
          </div>
        </div>

        <div className="text-sm text-purple-800 space-y-1">
          <p>
            <strong>Amount:</strong> ${amount.toLocaleString()}
          </p>
          <p>
            <strong>Gateway:</strong> BasePay
          </p>
          {estimatedNetworkFee && (
            <p>
              <strong>Est. Network Fee:</strong> {estimatedNetworkFee}
            </p>
          )}
        </div>
      </div>

      {/* Supported Cryptocurrencies */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h5 className="font-medium text-gray-900 mb-3">
          Supported Cryptocurrencies
        </h5>
        <div className="grid grid-cols-2 gap-2">
          {SUPPORTED_CRYPTOCURRENCIES.map((crypto) => (
            <div key={crypto.symbol} className="flex items-center space-x-2">
              <span className="text-lg">{crypto.icon}</span>
              <div>
                <Badge variant="outline" className="text-xs">
                  {crypto.symbol}
                </Badge>
                <p className="text-xs text-gray-600">{crypto.name}</p>
              </div>
            </div>
          ))}
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
          className="w-full bg-purple-600 hover:bg-purple-700"
          size="lg"
        >
          {isProcessing || isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Connecting to BasePay...
            </>
          ) : (
            <>
              <Wallet className="h-4 w-4 mr-2" />
              Connect Wallet & Pay ${amount.toLocaleString()}
            </>
          )}
        </Button>

        {paymentUrl && (
          <div className="text-center">
            <p className="text-sm text-gray-600">
              BasePay window opened. Connect your wallet and complete the
              payment.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => openPaymentWindow(paymentUrl)}
              className="mt-2"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Reopen BasePay Window
            </Button>
          </div>
        )}
      </div>

      {/* Payment Instructions */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h5 className="font-medium text-gray-900 mb-2">Payment Instructions</h5>
        <div className="text-sm text-gray-600 space-y-1">
          <p>• Click "Connect Wallet" to open BasePay</p>
          <p>
            • Connect your preferred crypto wallet (MetaMask, WalletConnect,
            etc.)
          </p>
          <p>• Select your preferred cryptocurrency</p>
          <p>• Review the transaction details and network fees</p>
          <p>• Confirm the transaction in your wallet</p>
          <p>• Wait for blockchain confirmation (5-15 minutes)</p>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-2 gap-4 text-xs">
        <div className="p-3 bg-white border border-gray-200 rounded">
          <div className="flex items-center space-x-2 mb-1">
            <Bitcoin className="h-3 w-3 text-purple-600" />
            <span className="font-medium">Decentralized</span>
          </div>
          <p className="text-gray-600">
            No intermediaries, direct blockchain payment
          </p>
        </div>
        <div className="p-3 bg-white border border-gray-200 rounded">
          <div className="flex items-center space-x-2 mb-1">
            <Coins className="h-3 w-3 text-purple-600" />
            <span className="font-medium">Multi-Chain</span>
          </div>
          <p className="text-gray-600">Supports multiple blockchain networks</p>
        </div>
      </div>

      {/* Important Notes */}
      <Alert>
        <AlertDescription className="text-sm">
          <strong>Important:</strong> Network fees are determined by the
          blockchain and may vary. Ensure you have sufficient balance to cover
          both the payment amount and network fees.
        </AlertDescription>
      </Alert>

      {/* Security Notice */}
      <div className="text-xs text-gray-500 text-center">
        <p>🔒 Secured by BasePay • Non-custodial • Blockchain Verified</p>
      </div>
    </div>
  );
}
