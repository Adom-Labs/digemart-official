"use client";

import { useState, useEffect } from "react";
import {
  AlertTriangle,
  RefreshCw,
  CreditCard,
  HelpCircle,
  Mail,
  Phone,
  Clock,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export interface PaymentErrorInfo {
  code: string;
  message: string;
  retryable: boolean;
  details?: any;
  reference?: string;
  timestamp: Date;
}

export interface PaymentErrorHandlerProps {
  error: PaymentErrorInfo;
  paymentData: {
    amount: number;
    currency: string;
    method: string;
    gateway: string;
    orderId: number;
  };
  onRetry?: () => void;
  onChangePaymentMethod?: () => void;
  onContactSupport?: () => void;
  onCancel?: () => void;
  retryCount?: number;
  maxRetries?: number;
  className?: string;
}

// Error code mappings for user-friendly messages
const ERROR_MESSAGES: Record<
  string,
  { title: string; description: string; action: string }
> = {
  INSUFFICIENT_FUNDS: {
    title: "Insufficient Funds",
    description:
      "Your card or account doesn't have enough funds for this transaction.",
    action:
      "Please check your account balance or try a different payment method.",
  },
  CARD_DECLINED: {
    title: "Card Declined",
    description: "Your card was declined by your bank or card issuer.",
    action: "Please contact your bank or try a different card.",
  },
  EXPIRED_CARD: {
    title: "Card Expired",
    description: "The card you're trying to use has expired.",
    action: "Please use a different card or update your card information.",
  },
  INVALID_CARD: {
    title: "Invalid Card Details",
    description: "The card information provided is incorrect or invalid.",
    action: "Please check your card details and try again.",
  },
  NETWORK_ERROR: {
    title: "Network Connection Error",
    description: "There was a problem connecting to the payment service.",
    action: "Please check your internet connection and try again.",
  },
  GATEWAY_ERROR: {
    title: "Payment Gateway Error",
    description: "The payment gateway is temporarily unavailable.",
    action:
      "Please try again in a few minutes or use a different payment method.",
  },
  RATE_LIMITED: {
    title: "Too Many Attempts",
    description: "You've made too many payment attempts in a short time.",
    action: "Please wait a few minutes before trying again.",
  },
  FRAUD_DETECTED: {
    title: "Security Check Failed",
    description: "This transaction was flagged by our security system.",
    action:
      "Please contact support to verify your identity and complete the payment.",
  },
  CURRENCY_NOT_SUPPORTED: {
    title: "Currency Not Supported",
    description: "The selected payment method doesn't support this currency.",
    action: "Please try a different payment method.",
  },
  AMOUNT_TOO_LARGE: {
    title: "Amount Exceeds Limit",
    description: "The payment amount exceeds the maximum allowed limit.",
    action:
      "Please contact support for large transactions or split into smaller amounts.",
  },
  PAYMENT_TIMEOUT: {
    title: "Payment Timeout",
    description: "The payment took too long to process and timed out.",
    action: "Please try again. If the problem persists, contact support.",
  },
  UNKNOWN_ERROR: {
    title: "Payment Failed",
    description: "An unexpected error occurred while processing your payment.",
    action: "Please try again or contact support if the problem continues.",
  },
};

export function PaymentErrorHandler({
  error,
  paymentData,
  onRetry,
  onChangePaymentMethod,
  onContactSupport,
  onCancel,
  retryCount = 0,
  maxRetries = 3,
  className = "",
}: PaymentErrorHandlerProps) {
  const [countdown, setCountdown] = useState(0);

  // Get error details
  const errorInfo = ERROR_MESSAGES[error.code] || ERROR_MESSAGES.UNKNOWN_ERROR;
  const canRetry = error.retryable && retryCount < maxRetries && onRetry;
  const isRateLimited = error.code === "RATE_LIMITED";

  // Countdown timer for rate limited errors
  useEffect(() => {
    if (isRateLimited && error.details?.retryAfter) {
      setCountdown(error.details.retryAfter);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isRateLimited, error.details?.retryAfter]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: paymentData.currency,
    }).format(amount);
  };

  // Format countdown time
  const formatCountdown = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Get error severity
  const getErrorSeverity = () => {
    const criticalErrors = [
      "FRAUD_DETECTED",
      "CARD_DECLINED",
      "INSUFFICIENT_FUNDS",
    ];
    const warningErrors = ["NETWORK_ERROR", "GATEWAY_ERROR", "PAYMENT_TIMEOUT"];

    if (criticalErrors.includes(error.code)) return "critical";
    if (warningErrors.includes(error.code)) return "warning";
    return "info";
  };

  const severity = getErrorSeverity();

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle
            className={`h-5 w-5 ${
              severity === "critical"
                ? "text-red-600"
                : severity === "warning"
                ? "text-amber-600"
                : "text-primary"
            }`}
          />
          <span>Payment Failed</span>
          <Badge
            variant={severity === "critical" ? "destructive" : "secondary"}
          >
            Error {error.code}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Error Details */}
        <Alert variant={severity === "critical" ? "destructive" : "default"}>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">{errorInfo.title}</p>
              <p>{errorInfo.description}</p>
              <p className="text-sm">{errorInfo.action}</p>
            </div>
          </AlertDescription>
        </Alert>

        {/* Payment Information */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">Payment Details</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Amount:</span>
              <span className="ml-2 font-medium">
                {formatCurrency(paymentData.amount)}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Method:</span>
              <span className="ml-2 font-medium capitalize">
                {paymentData.method.replace("_", " ")}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Gateway:</span>
              <span className="ml-2 font-medium capitalize">
                {paymentData.gateway}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Order:</span>
              <span className="ml-2 font-medium">#{paymentData.orderId}</span>
            </div>
          </div>

          {error.reference && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <span className="text-gray-600 text-sm">Reference:</span>
              <span className="ml-2 font-mono text-sm">{error.reference}</span>
            </div>
          )}
        </div>

        {/* Retry Information */}
        {canRetry && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <RefreshCw className="h-4 w-4 text-primary" />
              <span className="font-medium text-blue-900">Retry Available</span>
            </div>
            <p className="text-sm text-blue-700">
              You can retry this payment. Attempt {retryCount + 1} of{" "}
              {maxRetries}.
            </p>
            {isRateLimited && countdown > 0 && (
              <p className="text-sm text-blue-700 mt-1">
                Please wait {formatCountdown(countdown)} before retrying.
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Primary Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            {canRetry && (
              <Button
                onClick={onRetry}
                disabled={isRateLimited && countdown > 0}
                className="flex-1"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {isRateLimited && countdown > 0
                  ? `Retry in ${formatCountdown(countdown)}`
                  : `Retry Payment (${maxRetries - retryCount} left)`}
              </Button>
            )}

            {onChangePaymentMethod && (
              <Button
                onClick={onChangePaymentMethod}
                variant="outline"
                className="flex-1"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Try Different Method
              </Button>
            )}
          </div>

          {/* Secondary Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            {onContactSupport && (
              <Button
                onClick={onContactSupport}
                variant="outline"
                className="flex-1"
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            )}

            {onCancel && (
              <Button onClick={onCancel} variant="ghost" className="flex-1">
                Cancel Payment
              </Button>
            )}
          </div>
        </div>

        <Separator />

        {/* Troubleshooting Tips */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Troubleshooting Tips</h4>

          <div className="space-y-3 text-sm">
            {error.code === "CARD_DECLINED" && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded">
                <p className="font-medium text-amber-900">
                  Card Declined Solutions:
                </p>
                <ul className="mt-1 space-y-1 text-amber-800 ml-4">
                  <li>• Contact your bank to authorize the transaction</li>
                  <li>
                    • Check if your card has international transaction
                    restrictions
                  </li>
                  <li>
                    • Verify your card hasn't reached its daily spending limit
                  </li>
                  <li>• Try using a different card</li>
                </ul>
              </div>
            )}

            {error.code === "NETWORK_ERROR" && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                <p className="font-medium text-blue-900">Connection Issues:</p>
                <ul className="mt-1 space-y-1 text-blue-800 ml-4">
                  <li>• Check your internet connection</li>
                  <li>• Try refreshing the page</li>
                  <li>• Disable VPN if you're using one</li>
                  <li>• Try a different browser or device</li>
                </ul>
              </div>
            )}

            {error.code === "FRAUD_DETECTED" && (
              <div className="p-3 bg-red-50 border border-red-200 rounded">
                <p className="font-medium text-red-900">
                  Security Check Required:
                </p>
                <ul className="mt-1 space-y-1 text-red-800 ml-4">
                  <li>• This is for your protection</li>
                  <li>• Contact support to verify your identity</li>
                  <li>• Have your order details and ID ready</li>
                  <li>• Verification usually takes 5-10 minutes</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Support Contact Information */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">Need Help?</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2 text-gray-600">
              <Mail className="h-4 w-4" />
              <span>Email: support@digemart.com</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Phone className="h-4 w-4" />
              <span>Phone: +234 (0) 800 123 4567</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Clock className="h-4 w-4" />
              <span>Support Hours: 24/7</span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              When contacting support, please provide:
            </p>
            <ul className="text-xs text-gray-500 mt-1 ml-4 space-y-1">
              <li>• Order ID: #{paymentData.orderId}</li>
              {error.reference && (
                <li>• Payment Reference: {error.reference}</li>
              )}
              <li>• Error Code: {error.code}</li>
              <li>• Time: {error.timestamp.toLocaleString()}</li>
            </ul>
          </div>
        </div>

        {/* Security Notice */}
        <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 border-t pt-4">
          <Shield className="h-3 w-3" />
          <span>Your payment information is secure and was not stored</span>
        </div>
      </CardContent>
    </Card>
  );
}
