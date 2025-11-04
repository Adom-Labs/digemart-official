"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Package, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";

interface PaymentSuccessDialogProps {
  isOpen: boolean;
  orderNumber: string;
  orderReference: string;
  totalAmount: number;
  trackingUrl?: string;
}

export function PaymentSuccessDialog({
  isOpen,
  orderNumber,
  orderReference,
  totalAmount,
  trackingUrl,
}: PaymentSuccessDialogProps) {
  const router = useRouter();

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);

  const handleClose = () => {
    // Navigate to orders page
    router.push("/account");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <div className="flex flex-col items-center justify-center space-y-6 py-8">
          {/* Success Icon */}
          <div className="relative">
            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-75" />
            <div className="relative bg-green-100 rounded-full p-6">
              <CheckCircle2 className="h-16 w-16 text-green-600" />
            </div>
          </div>

          {/* Success Message */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">
              Payment Successful!
            </h2>
            <p className="text-gray-600">
              Your order has been placed and payment confirmed
            </p>
          </div>

          {/* Order Details */}
          <div className="w-full bg-gray-50 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Order Number</span>
              <span className="font-mono font-semibold text-gray-900">
                {orderNumber}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Payment Reference</span>
              <span className="font-mono text-xs text-gray-700">
                {orderReference}
              </span>
            </div>

            <div className="pt-4 border-t flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">
                Amount Paid
              </span>
              <span className="text-lg font-bold text-green-600">
                {formatPrice(totalAmount)}
              </span>
            </div>
          </div>

          {/* Track Order Link */}
          {trackingUrl && (
            <a
              href={trackingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-primary hover:text-blue-700 hover:underline"
            >
              <Package className="h-4 w-4" />
              <span>Track your order</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          )}

          {/* Action Buttons */}
          <div className="w-full flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={handleClose}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              View My Orders
            </Button>
          </div>

          {/* Additional Info */}
          <p className="text-xs text-gray-500 text-center">
            A confirmation email has been sent to your inbox with order details
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
