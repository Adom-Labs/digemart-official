"use client";

import { useFormContext } from "react-hook-form";
import {
  CheckCircle,
  Edit,
  Package,
  MapPin,
  CreditCard,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { CheckoutFormData } from "../CheckoutWizard";

interface OrderReviewStepProps {
  onSubmit: (data: CheckoutFormData) => Promise<void>;
}

export function OrderReviewStep({ onSubmit }: OrderReviewStepProps) {
  const {
    register,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = useFormContext<CheckoutFormData>();

  const formData = watch();

  const formatPaymentMethod = (method: CheckoutFormData["paymentMethod"]) => {
    const methodNames = {
      card: "Credit/Debit Card",
      bank_transfer: "Bank Transfer",
      wallet: "Crypto Wallet",
    };

    const gatewayNames = {
      paystack: "Paystack",
      flutterwave: "Flutterwave",
      basepay: "BasePay",
    };

    return `${methodNames[method.type]} via ${gatewayNames[method.gateway]}`;
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          Review Your Order
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Please review all details before placing your order.
        </p>
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
            <p className="text-gray-700">{formData.shippingAddress.country}</p>
            {formData.shippingAddress.phone && (
              <p className="text-gray-700 mt-1">
                {formData.shippingAddress.phone}
              </p>
            )}
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
            ✓ You've opted in to receive marketing updates and exclusive offers.
          </p>
        </div>
      )}

      {/* Final Confirmation */}
      <div className="p-6 bg-gray-900 text-white rounded-lg">
        <div className="text-center space-y-4">
          <h3 className="text-lg font-semibold">Ready to Place Your Order?</h3>
          <p className="text-gray-300 text-sm">
            Once you click "Place Order", we'll process your payment and begin
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
              "Place Order"
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
