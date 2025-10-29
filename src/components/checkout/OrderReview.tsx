"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  CheckCircle,
  Edit,
  Package,
  MapPin,
  CreditCard,
  FileText,
  ShoppingBag,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckoutFormData } from "./CheckoutWizard";

interface CartItem {
  id: string;
  productId: number;
  variantId?: number;
  name: string;
  image?: string;
  price: number;
  quantity: number;
  variant?: {
    name: string;
    options: Record<string, string>;
  };
}

interface OrderTotals {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
}

interface OrderReviewProps {
  items: CartItem[];
  totals: OrderTotals;
  onEditStep: (step: string) => void;
  onSubmit: (data: CheckoutFormData) => Promise<void>;
  isSubmitting?: boolean;
}

export function OrderReview({
  items,
  totals,
  onEditStep,
  onSubmit,
  isSubmitting = false,
}: OrderReviewProps) {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useFormContext<CheckoutFormData>();

  const [showAllItems, setShowAllItems] = useState(false);
  const formData = watch();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const formatPaymentMethod = (method: CheckoutFormData["paymentMethod"]) => {
    // const _methodNames = {
    //   card: "Credit/Debit Card",
    //   bank_transfer: "Bank Transfer",
    //   wallet: "Crypto Wallet",
    //   basepay: "BasePay",
    // };

    const gatewayNames = {
      paystack: "Paystack",
      flutterwave: "Flutterwave",
      basepay: "BasePay",
      wallet: "Digemart SmartContract",
    };

    return `${gatewayNames[method.gateway]}`;
  };

  const displayItems = showAllItems ? items : items.slice(0, 3);
  const hasMoreItems = items.length > 3;

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
          Review Your Order
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Please review all details before placing your order.
        </p>
      </div>

      {/* Order Items Summary */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <ShoppingBag className="h-4 w-4 mr-2" />
            Order Items ({items.length})
          </h3>
          {hasMoreItems && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAllItems(!showAllItems)}
              className="text-blue-600 hover:text-blue-800"
            >
              {showAllItems ? "Show Less" : `Show All (${items.length})`}
            </Button>
          )}
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="space-y-3">
            {displayItems.map((item) => (
              <div key={item.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <img
                    src={item.image || "/api/placeholder/60/60"}
                    alt={item.name}
                    className="w-15 h-15 rounded-md object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900">
                    {item.name}
                  </h4>
                  {item.variant && (
                    <p className="text-xs text-gray-500 mt-1">
                      {item.variant.name}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gray-600">
                      Qty: {item.quantity}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {hasMoreItems && !showAllItems && (
              <div className="text-center py-2">
                <span className="text-sm text-gray-500">
                  ... and {items.length - 3} more items
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Customer Information */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Package className="h-4 w-4 mr-2" />
            Customer Information
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEditStep("customer-info")}
            className="text-blue-600 hover:text-blue-800"
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Name:</span>
              <p className="text-gray-900">
                {formData.customerInfo.firstName}{" "}
                {formData.customerInfo.lastName}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Email:</span>
              <p className="text-gray-900">{formData.customerInfo.email}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Phone:</span>
              <p className="text-gray-900">{formData.customerInfo.phone}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Account:</span>
              <p className="text-gray-900">
                {formData.customerInfo.isGuest
                  ? "Guest Checkout"
                  : "Creating Account"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            Shipping Address
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEditStep("shipping-address")}
            className="text-blue-600 hover:text-blue-800"
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm">
            <p className="font-medium text-gray-900">
              {formData.shippingAddress.fullName}
            </p>
            <p className="text-gray-700">{formData.shippingAddress.address}</p>
            <p className="text-gray-700">
              {formData.shippingAddress.city}, {formData.shippingAddress.state}{" "}
              {formData.shippingAddress.postalCode}
            </p>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <CreditCard className="h-4 w-4 mr-2" />
            Payment Method
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEditStep("payment-method")}
            className="text-blue-600 hover:text-blue-800"
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-900 font-medium">
            {formatPaymentMethod(formData.paymentMethod)}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            You will be redirected to complete your payment securely.
          </p>
        </div>
      </div>

      {/* Pricing Breakdown */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Order Summary</h3>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                Subtotal ({items.length} items)
              </span>
              <span className="text-gray-900">
                {formatPrice(totals.subtotal)}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className="text-gray-900">
                {totals.shipping === 0 ? "Free" : formatPrice(totals.shipping)}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax</span>
              <span className="text-gray-900">{formatPrice(totals.tax)}</span>
            </div>

            {totals.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Discount</span>
                <span className="text-green-600">
                  -{formatPrice(totals.discount)}
                </span>
              </div>
            )}

            <Separator />

            <div className="flex justify-between text-lg font-semibold">
              <span className="text-gray-900">Total</span>
              <span className="text-gray-900">{formatPrice(totals.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Special Instructions */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <FileText className="h-4 w-4 mr-2" />
          Special Instructions (Optional)
        </h3>

        <div className="space-y-2">
          <Label htmlFor="specialInstructions" className="text-sm font-medium">
            Add any special delivery instructions or notes
          </Label>
          <Textarea
            id="specialInstructions"
            {...register("specialInstructions")}
            placeholder="e.g., Leave package at front door, Call before delivery, etc."
            rows={3}
            className="resize-none"
          />
          {errors.specialInstructions && (
            <p className="text-sm text-red-600">
              {errors.specialInstructions.message}
            </p>
          )}
          <p className="text-xs text-gray-500">
            These instructions will be shared with the delivery team.
          </p>
        </div>
      </div>

      {/* Order Terms */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">
          Order Terms & Conditions
        </h4>
        <div className="text-sm text-blue-700 space-y-1">
          <p>
            • By placing this order, you agree to our Terms of Service and
            Privacy Policy
          </p>
          <p>
            • You will receive an order confirmation email after successful
            payment
          </p>
          <p>
            • Estimated delivery time will be provided in your confirmation
            email
          </p>
          <p>• You can track your order status in your account dashboard</p>
        </div>
      </div>

      {/* Marketing Opt-in Display */}
      {formData.marketingOptIn && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            ✓ You&apos;ve opted in to receive marketing updates and exclusive offers.
          </p>
        </div>
      )}

      {/* Inventory Warning */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Items in your cart are reserved for 15 minutes. Complete your order to
          secure your items.
        </AlertDescription>
      </Alert>

      {/* Final Confirmation */}
      <div className="p-6 bg-gray-900 text-white rounded-lg">
        <div className="text-center space-y-4">
          <h3 className="text-lg font-semibold">Ready to Place Your Order?</h3>
          <p className="text-gray-300 text-sm">
            Once you click &quot;Place Order&quot;, we&apos;ll process your payment and begin
            preparing your items for shipment.
          </p>

          <Button
            type="submit"
            size="lg"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3"
            disabled={isSubmitting}
            onClick={handleSubmit(onSubmit)}
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Processing Order...</span>
              </div>
            ) : (
              `Place Order • ${formatPrice(totals.total)}`
            )}
          </Button>

          <p className="text-xs text-gray-400">
            Your payment information is secure and encrypted.
          </p>
        </div>
      </div>
    </div>
  );
}
