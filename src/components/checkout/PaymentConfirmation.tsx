"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle,
  Download,
  Mail,
  Copy,
  ExternalLink,
  Receipt,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { usePaymentStatus } from "@/lib/api/hooks/payments";

export interface PaymentConfirmationProps {
  paymentReference: string;
  orderDetails: {
    orderId: number;
    amount: number;
    currency: string;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
    customerInfo: {
      name: string;
      email: string;
      phone?: string;
    };
    shippingAddress?: {
      fullName: string;
      address: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
  };
  onDownloadReceipt?: () => void;
  onEmailReceipt?: () => void;
  className?: string;
}

export function PaymentConfirmation({
  paymentReference,
  orderDetails,
  onDownloadReceipt,
  onEmailReceipt,
  className = "",
}: PaymentConfirmationProps) {
  const [copied, setCopied] = useState(false);
  const { paymentStatus, isLoading } = usePaymentStatus(paymentReference);

  // Copy reference to clipboard
  const copyReference = async () => {
    try {
      await navigator.clipboard.writeText(paymentReference);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy reference:", err);
    }
  };

  // Calculate totals
  const subtotal = orderDetails.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.075; // 7.5% VAT (example)
  const shipping = subtotal > 10000 ? 0 : 1500; // Free shipping over 10k
  const total = subtotal + tax + shipping;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: orderDetails.currency,
    }).format(amount);
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-NG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <Card className={className}>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-green-100 rounded-full">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <CardTitle className="text-2xl text-green-900">
          Payment Successful!
        </CardTitle>
        <p className="text-gray-600">
          Your payment has been processed successfully. You will receive a
          confirmation email shortly.
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Payment Status */}
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-green-900">Payment Status</span>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {paymentStatus?.status === "success" ? "Completed" : "Processing"}
            </Badge>
          </div>
          <div className="text-sm text-green-700 space-y-1">
            <p>
              <strong>Reference:</strong> {paymentReference}
            </p>
            <p>
              <strong>Order ID:</strong> #{orderDetails.orderId}
            </p>
            <p>
              <strong>Amount:</strong> {formatCurrency(orderDetails.amount)}
            </p>
            <p>
              <strong>Date:</strong> {formatDate(new Date())}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={copyReference}
            variant="outline"
            size="sm"
            className="flex-1 min-w-0"
          >
            <Copy className="h-4 w-4 mr-2" />
            {copied ? "Copied!" : "Copy Reference"}
          </Button>

          {onDownloadReceipt && (
            <Button
              onClick={onDownloadReceipt}
              variant="outline"
              size="sm"
              className="flex-1 min-w-0"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Receipt
            </Button>
          )}

          {onEmailReceipt && (
            <Button
              onClick={onEmailReceipt}
              variant="outline"
              size="sm"
              className="flex-1 min-w-0"
            >
              <Mail className="h-4 w-4 mr-2" />
              Email Receipt
            </Button>
          )}
        </div>

        {/* Order Summary */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center">
            <Receipt className="h-4 w-4 mr-2" />
            Order Summary
          </h3>

          <div className="space-y-3">
            {orderDetails.items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-2"
              >
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {formatCurrency(item.price)} each
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Separator />

          {/* Totals */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax (7.5%)</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : formatCurrency(shipping)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Customer Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">
                Contact Details
              </h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <strong>Name:</strong> {orderDetails.customerInfo.name}
                </p>
                <p>
                  <strong>Email:</strong> {orderDetails.customerInfo.email}
                </p>
                {orderDetails.customerInfo.phone && (
                  <p>
                    <strong>Phone:</strong> {orderDetails.customerInfo.phone}
                  </p>
                )}
              </div>
            </div>

            {orderDetails.shippingAddress && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2">
                  Shipping Address
                </h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>{orderDetails.shippingAddress.fullName}</p>
                  <p>{orderDetails.shippingAddress.address}</p>
                  <p>
                    {orderDetails.shippingAddress.city},{" "}
                    {orderDetails.shippingAddress.state}{" "}
                    {orderDetails.shippingAddress.postalCode}
                  </p>
                  <p>{orderDetails.shippingAddress.country}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Next Steps */}
        <Alert>
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">What happens next?</p>
              <ul className="text-sm space-y-1 ml-4">
                <li>
                  • You'll receive an order confirmation email within 5 minutes
                </li>
                <li>• Your order will be processed within 1-2 business days</li>
                <li>
                  • You'll receive tracking information once your order ships
                </li>
                <li>• Estimated delivery: 3-7 business days</li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>

        {/* Support Information */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Need Help?</h4>
          <div className="text-sm text-gray-600 space-y-2">
            <p>
              If you have any questions about your order, please contact our
              support team:
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="mailto:support@digemart.com"
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <Mail className="h-3 w-3 mr-1" />
                support@digemart.com
              </a>
              <a
                href="/contact"
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Contact Support
              </a>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Reference this payment ID when contacting support:{" "}
              {paymentReference}
            </p>
          </div>
        </div>

        {/* Continue Shopping */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => (window.location.href = "/findyourplug")}
            className="flex-1"
          >
            Continue Shopping
          </Button>
          <Button
            onClick={() => (window.location.href = "/findyourplug/dashboard")}
            variant="outline"
            className="flex-1"
          >
            View My Orders
          </Button>
        </div>

        {/* Security Notice */}
        <div className="text-xs text-gray-500 text-center border-t pt-4">
          <p>
            🔒 This transaction was processed securely using industry-standard
            encryption
          </p>
          <p>
            Your payment information was not stored and cannot be accessed by
            unauthorized parties
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
