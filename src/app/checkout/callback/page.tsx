"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useVerifyPayment } from "@/lib/api/hooks/payments";

export default function PaymentCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<
    "loading" | "success" | "failed" | "cancelled"
  >("loading");
  const [message, setMessage] = useState("");
  const [paymentReference, setPaymentReference] = useState("");

  const verifyPayment = useVerifyPayment();

  useEffect(() => {
    const handlePaymentCallback = async () => {
      try {
        // Get parameters from URL
        const reference =
          searchParams.get("reference") ||
          searchParams.get("tx_ref") ||
          searchParams.get("trxref");
        const status = searchParams.get("status");
        const gateway = searchParams.get("gateway") || "paystack"; // Default to paystack

        if (!reference) {
          setStatus("failed");
          setMessage("Payment reference not found in callback URL");
          return;
        }

        setPaymentReference(reference);

        // Handle different gateway callback formats
        if (status === "cancelled" || status === "canceled") {
          setStatus("cancelled");
          setMessage("Payment was cancelled by user");

          // Notify parent window if in popup
          if (window.opener) {
            window.opener.postMessage(
              {
                type: `${gateway}_callback`,
                reference,
                status: "cancelled",
              },
              window.location.origin
            );
            window.close();
          }
          return;
        }

        // Verify payment with backend
        const result = await verifyPayment.mutateAsync(reference);

        if (result.success && result.status === "success") {
          setStatus("success");
          setMessage("Payment verified successfully");

          // Notify parent window if in popup
          if (window.opener) {
            window.opener.postMessage(
              {
                type: `${gateway}_callback`,
                reference,
                status: "success",
              },
              window.location.origin
            );
            window.close();
          } else {
            // Redirect to success page after a delay
            setTimeout(() => {
              router.push(`/checkout/success?reference=${reference}`);
            }, 2000);
          }
        } else {
          setStatus("failed");
          setMessage(result.message || "Payment verification failed");

          // Notify parent window if in popup
          if (window.opener) {
            window.opener.postMessage(
              {
                type: `${gateway}_callback`,
                reference,
                status: "failed",
              },
              window.location.origin
            );
            window.close();
          }
        }
      } catch (error) {
        console.error("Payment callback error:", error);
        setStatus("failed");
        setMessage(
          error instanceof Error ? error.message : "Payment verification failed"
        );

        // Notify parent window if in popup
        if (window.opener) {
          window.opener.postMessage(
            {
              type: "payment_callback",
              reference: paymentReference,
              status: "failed",
            },
            window.location.origin
          );
          window.close();
        }
      }
    };

    handlePaymentCallback();
  }, [searchParams, verifyPayment, router, paymentReference]);

  const getStatusIcon = () => {
    switch (status) {
      case "loading":
        return <Loader2 className="h-8 w-8 text-primary animate-spin" />;
      case "success":
        return <CheckCircle className="h-8 w-8 text-green-600" />;
      case "failed":
        return <XCircle className="h-8 w-8 text-red-600" />;
      case "cancelled":
        return <AlertTriangle className="h-8 w-8 text-amber-600" />;
      default:
        return <Loader2 className="h-8 w-8 text-primary animate-spin" />;
    }
  };

  const getStatusTitle = () => {
    switch (status) {
      case "loading":
        return "Processing Payment...";
      case "success":
        return "Payment Successful!";
      case "failed":
        return "Payment Failed";
      case "cancelled":
        return "Payment Cancelled";
      default:
        return "Processing Payment...";
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case "loading":
        return "Please wait while we verify your payment...";
      case "success":
        return "Your payment has been processed successfully. You will be redirected shortly.";
      case "failed":
        return (
          message ||
          "There was an error processing your payment. Please try again."
        );
      case "cancelled":
        return "You cancelled the payment. You can close this window and try again.";
      default:
        return "Please wait while we process your payment...";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gray-100 rounded-full">
              {getStatusIcon()}
            </div>
          </div>
          <CardTitle className="text-xl">{getStatusTitle()}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-gray-600">{getStatusMessage()}</p>

            {paymentReference && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Payment Reference:</p>
                <p className="font-mono text-sm">{paymentReference}</p>
              </div>
            )}
          </div>

          {status === "failed" && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {message ||
                  "Payment verification failed. Please contact support if you were charged."}
              </AlertDescription>
            </Alert>
          )}

          {status === "cancelled" && (
            <Alert>
              <AlertDescription>
                Your payment was cancelled. No charges were made to your
                account.
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          {status !== "loading" && (
            <div className="space-y-3">
              {status === "success" && (
                <Button
                  onClick={() =>
                    router.push(
                      `/checkout/success?reference=${paymentReference}`
                    )
                  }
                  className="w-full"
                >
                  View Order Details
                </Button>
              )}

              {(status === "failed" || status === "cancelled") && (
                <div className="flex space-x-3">
                  <Button
                    onClick={() => router.push("/checkout")}
                    className="flex-1"
                  >
                    Try Again
                  </Button>
                  <Button
                    onClick={() => router.push("/findyourplug")}
                    variant="outline"
                    className="flex-1"
                  >
                    Continue Shopping
                  </Button>
                </div>
              )}

              {window.opener && (
                <Button
                  onClick={() => window.close()}
                  variant="outline"
                  className="w-full"
                >
                  Close Window
                </Button>
              )}
            </div>
          )}

          {/* Loading State */}
          {status === "loading" && (
            <div className="text-center">
              <div className="animate-pulse space-y-2">
                <div className="h-2 bg-gray-200 rounded"></div>
                <div className="h-2 bg-gray-200 rounded w-3/4 mx-auto"></div>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                This may take a few seconds...
              </p>
            </div>
          )}

          {/* Security Notice */}
          <div className="text-xs text-gray-500 text-center border-t pt-4">
            <p>🔒 Secure payment processing</p>
            <p>Your payment information is protected</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
