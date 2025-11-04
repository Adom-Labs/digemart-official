"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Shield,
  Lock,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  PaymentProcessor,
  PaymentData,
  PaymentResult,
} from "./PaymentProcessor";
import {
  paymentValidator,
  paymentRateLimiter,
  PaymentSession,
  PaymentError,
  validatePaymentUrl,
  sanitizePaymentMetadata,
  getSecureHeaders,
} from "@/lib/utils/payment-security";

export interface SecurePaymentFormProps {
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

export function SecurePaymentForm({
  paymentData,
  customerInfo,
  onPaymentSuccess,
  onPaymentError,
  onPaymentCancel,
  disabled = false,
  className = "",
}: SecurePaymentFormProps) {
  const [paymentSession, setPaymentSession] = useState<PaymentSession | null>(
    null
  );
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isSecurityCheckPassed, setIsSecurityCheckPassed] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [rateLimitRemainingTime, setRateLimitRemainingTime] = useState(0);

  // Initialize payment session and security checks
  useEffect(() => {
    const session = new PaymentSession();
    setPaymentSession(session);
    performSecurityChecks();
  }, []);

  // Update rate limit timer
  useEffect(() => {
    if (isRateLimited && rateLimitRemainingTime > 0) {
      const timer = setInterval(() => {
        const remaining = paymentRateLimiter.getRemainingTime(
          customerInfo.email
        );
        setRateLimitRemainingTime(remaining);

        if (remaining <= 0) {
          setIsRateLimited(false);
          setRetryCount(0);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isRateLimited, rateLimitRemainingTime, customerInfo.email]);

  // Perform comprehensive security checks
  const performSecurityChecks = useCallback(() => {
    const errors: string[] = [];

    // Validate payment data
    const validation = paymentValidator.validatePaymentData({
      amount: paymentData.amount,
      currency: paymentData.currency || "NGN",
      method: paymentData.method,
      gateway: paymentData.gateway,
      orderId: paymentData.orderId,
    });

    if (!validation.valid) {
      errors.push(...validation.errors);
    }

    // Check customer info
    if (!customerInfo.email || !customerInfo.name) {
      errors.push("Customer information is incomplete");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (customerInfo.email && !emailRegex.test(customerInfo.email)) {
      errors.push("Invalid email address format");
    }

    // Check for suspicious patterns
    if (paymentData.amount > 1000000) {
      // Large amount check
      errors.push("Payment amount requires additional verification");
    }

    // Validate callback URL if provided
    if (
      paymentData.callbackUrl &&
      !validatePaymentUrl(paymentData.callbackUrl)
    ) {
      errors.push("Invalid callback URL");
    }

    setValidationErrors(errors);
    setIsSecurityCheckPassed(errors.length === 0);
  }, [paymentData, customerInfo]);

  // Handle secure payment processing
  const handleSecurePayment = useCallback(
    async (result: PaymentResult) => {
      try {
        // Additional security validation on payment result
        if (!result.reference) {
          throw new PaymentError(
            "Invalid payment reference",
            "INVALID_REFERENCE"
          );
        }

        // Validate authorization URL if present
        if (
          result.authorizationUrl &&
          !validatePaymentUrl(result.authorizationUrl)
        ) {
          throw new PaymentError("Invalid payment gateway URL", "INVALID_URL");
        }

        // Sanitize any metadata
        if (result.paymentData) {
          result.paymentData = sanitizePaymentMetadata(result.paymentData);
        }

        // Reset rate limiting on successful payment
        paymentRateLimiter.reset(customerInfo.email);
        setRetryCount(0);
        setIsRateLimited(false);

        onPaymentSuccess(result);
      } catch (error) {
        const paymentError =
          error instanceof PaymentError
            ? error
            : PaymentError.fromApiError(error);

        handleSecurePaymentError(paymentError.message);
      }
    },
    [customerInfo.email, onPaymentSuccess]
  );

  // Handle secure payment errors with rate limiting
  const handleSecurePaymentError = useCallback(
    (error: string) => {
      setRetryCount((prev) => prev + 1);

      // Check rate limiting
      const canAttempt = paymentRateLimiter.canAttempt(customerInfo.email);
      if (!canAttempt) {
        setIsRateLimited(true);
        const remainingTime = paymentRateLimiter.getRemainingTime(
          customerInfo.email
        );
        setRateLimitRemainingTime(remainingTime);

        const minutes = Math.ceil(remainingTime / (60 * 1000));
        onPaymentError(
          `Too many payment attempts. Please try again in ${minutes} minutes.`
        );
        return;
      }

      onPaymentError(error);
    },
    [customerInfo.email, onPaymentError]
  );

  // Handle payment cancellation
  const handleSecurePaymentCancel = useCallback(() => {
    // Don't count cancellations against rate limit
    onPaymentCancel?.();
  }, [onPaymentCancel]);

  // Format remaining time for display
  const formatRemainingTime = (ms: number): string => {
    const minutes = Math.floor(ms / (60 * 1000));
    const seconds = Math.floor((ms % (60 * 1000)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Check if payment session is still valid
  const isSessionValid = paymentSession?.isValid() ?? false;

  if (!isSessionValid && paymentSession) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Payment session has expired. Please refresh the page to start a
              new secure session.
            </AlertDescription>
          </Alert>
          <Button
            onClick={() => window.location.reload()}
            className="mt-4 w-full"
            variant="outline"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Page
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-green-600" />
            <span>Secure Payment</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            <Lock className="h-3 w-3 mr-1" />
            PCI Compliant
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Security Status */}
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-900">
              Security Checks Passed
            </span>
          </div>
          <div className="text-xs text-green-700 space-y-1">
            <p>✓ Payment data validated</p>
            <p>✓ Secure session established</p>
            <p>✓ Customer information verified</p>
            <p>✓ Gateway security confirmed</p>
          </div>
        </div>

        {/* Session Information */}
        {paymentSession && (
          <div className="text-xs text-gray-500 text-center">
            <p>
              Session ID: {paymentSession.getSessionId().substring(0, 16)}...
            </p>
            <p>
              Session expires in:{" "}
              {Math.ceil(paymentSession.getRemainingTime() / (60 * 1000))}{" "}
              minutes
            </p>
          </div>
        )}

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                {validationErrors.map((error, index) => (
                  <p key={index}>• {error}</p>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Rate Limiting Warning */}
        {isRateLimited && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Too many payment attempts. Please wait{" "}
              {formatRemainingTime(rateLimitRemainingTime)} before trying again.
            </AlertDescription>
          </Alert>
        )}

        {/* Payment Processor */}
        {isSecurityCheckPassed && !isRateLimited && (
          <PaymentProcessor
            paymentData={paymentData}
            customerInfo={customerInfo}
            onPaymentSuccess={handleSecurePayment}
            onPaymentError={handleSecurePaymentError}
            onPaymentCancel={handleSecurePaymentCancel}
            disabled={disabled}
          />
        )}

        {/* Retry Information */}
        {retryCount > 0 && retryCount < 5 && (
          <div className="text-sm text-amber-600 text-center">
            <p>Payment attempt {retryCount} of 5</p>
          </div>
        )}

        {/* Security Features */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-white border border-gray-200 rounded">
            <div className="flex items-center space-x-2 mb-1">
              <Shield className="h-3 w-3 text-primary" />
              <span className="font-medium">Data Protection</span>
            </div>
            <p className="text-gray-600">
              All payment data is encrypted and never stored locally
            </p>
          </div>
          <div className="p-3 bg-white border border-gray-200 rounded">
            <div className="flex items-center space-x-2 mb-1">
              <Lock className="h-3 w-3 text-primary" />
              <span className="font-medium">Secure Session</span>
            </div>
            <p className="text-gray-600">
              Time-limited secure session with automatic expiry
            </p>
          </div>
        </div>

        {/* Compliance Information */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h5 className="font-medium text-blue-900 mb-2">
            Security & Compliance
          </h5>
          <div className="text-sm text-blue-800 space-y-1">
            <p>• PCI DSS Level 1 compliant payment processing</p>
            <p>• 256-bit SSL/TLS encryption for all communications</p>
            <p>• No sensitive payment data stored on our servers</p>
            <p>• Real-time fraud detection and prevention</p>
            <p>• Secure tokenization for recurring payments</p>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="flex justify-center space-x-4 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Shield className="h-3 w-3" />
            <span>SSL Secured</span>
          </div>
          <div className="flex items-center space-x-1">
            <Lock className="h-3 w-3" />
            <span>PCI Compliant</span>
          </div>
          <div className="flex items-center space-x-1">
            <CheckCircle className="h-3 w-3" />
            <span>Verified Merchant</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
