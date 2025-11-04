"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useOrderTracking,
  useGuestOrderTracking,
} from "@/lib/api/hooks/order-tracking";
// Simple currency formatter
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "NGN",
  }).format(amount);
};
import {
  Package,
  Truck,
  MapPin,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Mail,
  LucideIcon,
} from "lucide-react";
import Loader from "@/components/Loader";

const statusIcons: Record<string, LucideIcon> = {
  PENDING: Clock,
  PROCESSING: Package,
  TRANSIT: Truck,
  DELIVERED: CheckCircle,
  COMPLETED: CheckCircle,
  CANCELLED: AlertCircle,
  RETURNED: AlertCircle,
};

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  TRANSIT: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  RETURNED: "bg-gray-100 text-gray-800",
};

export default function OrderTrackingPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const orderId = parseInt(params.orderId as string);

  const [isGuest, setIsGuest] = useState(false);
  const [guestEmail, setGuestEmail] = useState("");
  const [showGuestForm, setShowGuestForm] = useState(false);

  // Check if this is a guest tracking request
  useEffect(() => {
    const email = searchParams.get("email");
    const guest = searchParams.get("guest");

    if (email || guest === "true") {
      setIsGuest(true);
      setShowGuestForm(true);
      if (email) {
        setGuestEmail(email);
      }
    }
  }, [searchParams]);

  // Hooks for authenticated and guest tracking
  const {
    data: authTracking,
    isLoading: authLoading,
    error: authError,
  } = useOrderTracking(orderId, { enabled: !isGuest });

  const {
    data: guestTracking,
    isLoading: guestLoading,
    error: guestError,
    refetch: refetchGuest,
  } = useGuestOrderTracking(
    { orderId, email: guestEmail },
    { enabled: isGuest && !!guestEmail }
  );

  const tracking = isGuest ? guestTracking : authTracking;
  const isLoading = isGuest ? guestLoading : authLoading;
  const error = isGuest ? guestError : authError;

  const handleGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guestEmail) {
      setShowGuestForm(false);
      refetchGuest();
    }
  };

  if (showGuestForm) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Track Your Order</CardTitle>
            <p className="text-sm text-gray-600 text-center">
              Enter your email address to track order #{orderId}
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGuestSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Track Order
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <Loader />
        </div>
      </div>
    );
  }

  if (error || !tracking) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardContent className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Order Not Found</h2>
            <p className="text-gray-600 mb-4">
              We couldn&apos;t find tracking information for this order. Please
              check your order number and email address.
            </p>
            {isGuest && (
              <Button onClick={() => setShowGuestForm(true)}>Try Again</Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  const StatusIcon = statusIcons[tracking.currentStatus] || Clock;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Order Tracking</h1>
        <p className="text-gray-600">Track your order #{tracking.orderId}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Tracking Timeline */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <StatusIcon className="h-5 w-5" />
                  Current Status
                </CardTitle>
                <Badge className={statusColors[tracking.currentStatus]}>
                  {tracking.currentStatus.replace("_", " ")}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {/* Timeline */}
              <div className="space-y-6">
                {tracking.timeline.map((event, index) => {
                  const EventIcon = statusIcons[event.status] || Clock;
                  const isLatest = index === tracking.timeline.length - 1;

                  return (
                    <div key={event.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`p-2 rounded-full ${
                            isLatest ? "bg-blue-100" : "bg-gray-100"
                          }`}
                        >
                          <EventIcon
                            className={`h-4 w-4 ${
                              isLatest ? "text-primary" : "text-gray-600"
                            }`}
                          />
                        </div>
                        {index < tracking.timeline.length - 1 && (
                          <div className="w-px h-8 bg-gray-200 mt-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <h3
                            className={`font-medium ${
                              isLatest ? "text-primary" : "text-gray-900"
                            }`}
                          >
                            {event.description}
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            {event.status.replace("_", " ")}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(event.createdAt).toLocaleString()}
                          </div>
                          {event.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {event.location}
                            </div>
                          )}
                          {event.carrier && (
                            <div className="text-xs">
                              Carrier: {event.carrier}
                            </div>
                          )}
                          {event.notes && (
                            <div className="text-xs bg-gray-50 p-2 rounded">
                              {event.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Estimated Delivery */}
              {tracking.estimatedDelivery && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-800">
                    <Truck className="h-4 w-4" />
                    <span className="font-medium">Estimated Delivery</span>
                  </div>
                  <p className="text-blue-700 mt-1">
                    {new Date(tracking.estimatedDelivery).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary Sidebar */}
        <div className="space-y-6">
          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Order Date</p>
                <p className="font-medium">
                  {new Date(tracking.orderDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Store</p>
                <p className="font-medium">{tracking.order.storeName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="font-medium text-lg">
                  {formatCurrency(tracking.order.totalAmount)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{tracking.order.customerEmail}</span>
              </div>
              <div>
                <p className="font-medium">{tracking.order.customerName}</p>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          {tracking.order.shippingAddress && (
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-1">
                  <p className="font-medium">
                    {tracking.order.shippingAddress.fullName}
                  </p>
                  <p>{tracking.order.shippingAddress.address}</p>
                  <p>
                    {tracking.order.shippingAddress.city},{" "}
                    {tracking.order.shippingAddress.state}{" "}
                    {tracking.order.shippingAddress.postalCode}
                  </p>
                  <p>{tracking.order.shippingAddress.country}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tracking.order.orderItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.productName}</p>
                      {item.variantName && (
                        <p className="text-xs text-gray-600">
                          {item.variantName}
                        </p>
                      )}
                      <p className="text-xs text-gray-600">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-medium">
                      {formatCurrency(item.totalPrice)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
