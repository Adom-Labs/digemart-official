"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle,
  Download,
  Mail,
  Phone,
  MapPin,
  Package,
  CreditCard,
  ExternalLink,
  Copy,
  Share2,
  Calendar,
  Truck,
  Star,
  ArrowRight,
  Home,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import {
  generateTrackingUrl,
  generateReceiptUrl,
  generateSupportUrl,
  formatOrderNumber,
  getOrderStatusColor,
  getOrderStatusText,
  getEstimatedDeliveryDate,
  formatDeliveryDate,
} from "@/lib/utils/order-tracking";

interface OrderItem {
  id: number;
  productId: number;
  variantId?: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product: {
    id: number;
    name: string;
    slug: string;
    images?: string[];
  };
  variant?: {
    id: number;
    name: string;
    attributes: Record<string, any>;
  };
}

interface OrderData {
  id: number;
  orderNumber: string;
  status: string;
  totalAmount: number;
  paymentReference?: string;
  paymentUrl?: string;
  trackingUrl?: string;
  createdAt: string;
  estimatedDelivery?: string;
  customer: {
    id: number;
    name: string;
    email: string;
    phone?: string;
  };
  store: {
    id: number;
    storeName: string;
    storeSlug: string;
    logo?: string;
  };
  orderItems: OrderItem[];
  shippingAddress?: {
    id: number;
    fullName: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string;
  };
  payments: Array<{
    id: number;
    amount: number;
    method: string;
    status: string;
    reference: string;
    gateway?: string;
    createdAt: string;
  }>;
  totals?: {
    subtotal: number;
    shipping: number;
    tax: number;
    discount: number;
    total: number;
  };
}

interface OrderConfirmationProps {
  order: OrderData;
  isGuest?: boolean;
  onContinueShopping?: () => void;
  onViewOrderHistory?: () => void;
  onDownloadReceipt?: () => void;
}

export function OrderConfirmation({
  order,
  isGuest = false,
  onContinueShopping,
  onViewOrderHistory,
  onDownloadReceipt,
}: OrderConfirmationProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const statusColors = getOrderStatusColor(order.status);
  const statusText = getOrderStatusText(order.status);
  const estimatedDelivery = order.estimatedDelivery
    ? new Date(order.estimatedDelivery)
    : getEstimatedDeliveryDate(order.createdAt);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const copyOrderNumber = async () => {
    try {
      await navigator.clipboard.writeText(order.orderNumber);
      toast.success("Order number copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy order number");
    }
  };

  const shareOrder = async () => {
    setIsSharing(true);
    try {
      const trackingUrl = generateTrackingUrl(
        order.orderNumber,
        order.store.storeSlug
      );

      if (navigator.share) {
        await navigator.share({
          title: `Order ${formatOrderNumber(order.orderNumber)}`,
          text: `My order from ${order.store.storeName}`,
          url: trackingUrl,
        });
      } else {
        await navigator.clipboard.writeText(trackingUrl);
        toast.success("Order tracking link copied to clipboard");
      }
    } catch (error) {
      toast.error("Failed to share order");
    } finally {
      setIsSharing(false);
    }
  };

  const downloadReceipt = () => {
    if (onDownloadReceipt) {
      onDownloadReceipt();
    } else {
      const receiptUrl = generateReceiptUrl(
        order.orderNumber,
        order.store.storeSlug,
        "pdf"
      );
      window.open(receiptUrl, "_blank");
    }
  };

  const openTrackingPage = () => {
    const trackingUrl =
      order.trackingUrl ||
      generateTrackingUrl(order.orderNumber, order.store.storeSlug);
    window.open(trackingUrl, "_blank");
  };

  const contactSupport = () => {
    const supportUrl = generateSupportUrl(
      order.orderNumber,
      order.store.storeSlug
    );
    window.open(supportUrl, "_blank");
  };

  // Simulate email confirmation
  useEffect(() => {
    const timer = setTimeout(() => {
      setEmailSent(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      {/* Success Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Order Confirmed!
          </h1>
          <p className="text-gray-600">
            Thank you for your purchase. Your order has been successfully
            placed.
          </p>
        </div>

        {/* Order Number */}
        <div className="flex items-center justify-center space-x-2 p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">
            Order Number:
          </span>
          <span className="text-lg font-bold text-gray-900">
            {formatOrderNumber(order.orderNumber)}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={copyOrderNumber}
            className="h-8 w-8 p-0"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Email Confirmation Alert */}
      {emailSent && (
        <Alert>
          <Mail className="h-4 w-4" />
          <AlertDescription>
            Order confirmation email has been sent to {order.customer.email}
          </AlertDescription>
        </Alert>
      )}

      {/* Order Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Order Status</span>
            <Badge
              className={`${statusColors.bg} ${statusColors.text} ${statusColors.border}`}
              variant="outline"
            >
              {statusText}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Order Date:</span>
                <span className="font-medium">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center space-x-2 text-sm">
                <Truck className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Estimated Delivery:</span>
                <span className="font-medium text-green-600">
                  {formatDeliveryDate(estimatedDelivery)}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Package className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Items:</span>
                <span className="font-medium">
                  {order.orderItems.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                  )}{" "}
                  items
                </span>
              </div>

              <div className="flex items-center space-x-2 text-sm">
                <CreditCard className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Total:</span>
                <span className="font-medium text-lg">
                  {formatPrice(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4">
            <Button
              onClick={openTrackingPage}
              className="flex items-center space-x-2"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Track Order</span>
            </Button>

            <Button
              variant="outline"
              onClick={downloadReceipt}
              className="flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Download Receipt</span>
            </Button>

            <Button
              variant="outline"
              onClick={shareOrder}
              disabled={isSharing}
              className="flex items-center space-x-2"
            >
              <Share2 className="h-4 w-4" />
              <span>{isSharing ? "Sharing..." : "Share Order"}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.orderItems.map((item) => (
              <div
                key={item.id}
                className="flex items-start space-x-4 p-4 border rounded-lg"
              >
                <div className="flex-shrink-0">
                  <img
                    src={item.product.images?.[0] || "/api/placeholder/80/80"}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-md object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {item.product.name}
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
                      {formatPrice(item.totalPrice)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Totals */}
          {order.totals && (
            <div className="mt-6 pt-4 border-t">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">
                    {formatPrice(order.totals.subtotal)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">
                    {order.totals.shipping === 0
                      ? "Free"
                      : formatPrice(order.totals.shipping)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">
                    {formatPrice(order.totals.tax)}
                  </span>
                </div>

                {order.totals.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-green-600">
                      -{formatPrice(order.totals.discount)}
                    </span>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">
                    {formatPrice(order.totals.total)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Shipping Information */}
      {order.shippingAddress && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Shipping Address</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-1">
              <p className="font-medium text-gray-900">
                {order.shippingAddress.fullName}
              </p>
              <p className="text-gray-700">{order.shippingAddress.address}</p>
              <p className="text-gray-700">
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.postalCode}
              </p>
              <p className="text-gray-700">{order.shippingAddress.country}</p>
              {order.shippingAddress.phone && (
                <p className="text-gray-700 flex items-center space-x-1 mt-2">
                  <Phone className="h-4 w-4" />
                  <span>{order.shippingAddress.phone}</span>
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Store Information */}
      <Card>
        <CardHeader>
          <CardTitle>Store Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            {order.store.logo && (
              <img
                src={order.store.logo}
                alt={order.store.storeName}
                className="w-12 h-12 rounded-lg object-cover"
              />
            )}
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">
                {order.store.storeName}
              </h3>
              <p className="text-sm text-gray-600">
                Store ID: {order.store.id}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={contactSupport}>
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payment Information */}
      {order.payments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent>
            {order.payments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-900">
                    {payment.method} {payment.gateway && `(${payment.gateway})`}
                  </p>
                  <p className="text-xs text-gray-500">
                    Reference: {payment.reference}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {formatPrice(payment.amount)}
                  </p>
                  <Badge
                    variant={
                      payment.status === "success" ? "default" : "secondary"
                    }
                    className="text-xs"
                  >
                    {payment.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>What's Next?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-blue-600">1</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Order Processing
                </p>
                <p className="text-xs text-gray-600">
                  We'll prepare your items and send you tracking information
                  once shipped.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-blue-600">2</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Shipping Updates
                </p>
                <p className="text-xs text-gray-600">
                  You'll receive email notifications about your order status and
                  tracking updates.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-blue-600">3</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Delivery</p>
                <p className="text-xs text-gray-600">
                  Your order will be delivered by{" "}
                  {formatDeliveryDate(estimatedDelivery)}.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-6">
        <Button
          onClick={onContinueShopping}
          className="flex items-center justify-center space-x-2 flex-1"
        >
          <ShoppingBag className="h-4 w-4" />
          <span>Continue Shopping</span>
        </Button>

        {!isGuest && (
          <Button
            variant="outline"
            onClick={onViewOrderHistory}
            className="flex items-center justify-center space-x-2 flex-1"
          >
            <Package className="h-4 w-4" />
            <span>View Order History</span>
          </Button>
        )}

        <Button
          variant="outline"
          onClick={() => (window.location.href = "/")}
          className="flex items-center justify-center space-x-2 flex-1"
        >
          <Home className="h-4 w-4" />
          <span>Go Home</span>
        </Button>
      </div>

      {/* Review Prompt */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900">
                Love your purchase?
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Share your experience and help other customers by leaving a
                review.
              </p>
            </div>
            <Button className="flex items-center space-x-2">
              <span>Leave Review</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
