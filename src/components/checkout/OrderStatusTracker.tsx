"use client";

import { useState, useEffect } from "react";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  Phone,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  getOrderStatusColor,
  getOrderStatusText,
  formatOrderNumber,
  canCancelOrder,
  canReturnOrder,
} from "@/lib/utils/order-tracking";

interface TrackingEvent {
  id: number;
  status: string;
  description: string;
  location?: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

interface OrderTrackingData {
  orderId: number;
  orderNumber: string;
  status: string;
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  createdAt: string;
  updatedAt: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
  store: {
    id: number;
    storeName: string;
    storeSlug: string;
    logo?: string;
    phone?: string;
    email?: string;
  };
  shippingAddress?: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  trackingEvents: TrackingEvent[];
  totalAmount: number;
  itemCount: number;
}

interface OrderStatusTrackerProps {
  orderData: OrderTrackingData;
  onRefresh?: () => void;
  onCancel?: () => void;
  onReturn?: () => void;
  onContactSupport?: () => void;
  isLoading?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

const ORDER_STATUSES = [
  { key: "PENDING", label: "Order Placed", icon: Package },
  { key: "PROCESSING", label: "Processing", icon: Clock },
  { key: "SHIPPED", label: "Shipped", icon: Truck },
  { key: "DELIVERED", label: "Delivered", icon: CheckCircle },
];

export function OrderStatusTracker({
  orderData,
  onRefresh,
  onCancel,
  onReturn,
  onContactSupport,
  isLoading = false,
  autoRefresh = false,
  refreshInterval = 30000, // 30 seconds
}: OrderStatusTrackerProps) {
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const statusColors = getOrderStatusColor(orderData.status);
  const statusText = getOrderStatusText(orderData.status);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60)
      );
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
    }
  };

  const getProgressPercentage = () => {
    const statusIndex = ORDER_STATUSES.findIndex(
      (s) => s.key === orderData.status
    );
    if (statusIndex === -1) return 0;
    return ((statusIndex + 1) / ORDER_STATUSES.length) * 100;
  };

  const getCurrentStatusIndex = () => {
    return ORDER_STATUSES.findIndex((s) => s.key === orderData.status);
  };

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
      setLastRefresh(new Date());
    }
  };

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh || !onRefresh) return;

    const interval = setInterval(() => {
      onRefresh();
      setLastRefresh(new Date());
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, onRefresh, refreshInterval]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">
                Order {formatOrderNumber(orderData.orderNumber)}
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Placed on {formatDate(orderData.createdAt)}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge
                className={`${statusColors.bg} ${statusColors.text} ${statusColors.border}`}
                variant="outline"
              >
                {statusText}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
                className="flex items-center space-x-2"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                />
                <span>Refresh</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Total Amount:</span>
              <p className="font-medium">
                {formatPrice(orderData.totalAmount)}
              </p>
            </div>
            <div>
              <span className="text-gray-600">Items:</span>
              <p className="font-medium">{orderData.itemCount} items</p>
            </div>
            <div>
              <span className="text-gray-600">Last Updated:</span>
              <p className="font-medium">
                {formatRelativeTime(orderData.updatedAt)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Tracker */}
      <Card>
        <CardHeader>
          <CardTitle>Order Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Progress Bar */}
            <div className="space-y-2">
              <Progress value={getProgressPercentage()} className="h-2" />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Order Placed</span>
                <span>Delivered</span>
              </div>
            </div>

            {/* Status Steps */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {ORDER_STATUSES.map((status, index) => {
                const Icon = status.icon;
                const isActive = index <= getCurrentStatusIndex();
                const isCurrent = status.key === orderData.status;

                return (
                  <div
                    key={status.key}
                    className={`flex flex-col items-center space-y-2 p-3 rounded-lg transition-colors ${isCurrent
                        ? "bg-blue-50 border-2 border-blue-200"
                        : isActive
                          ? "bg-green-50"
                          : "bg-gray-50"
                      }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${isCurrent
                          ? "bg-blue-600 text-white"
                          : isActive
                            ? "bg-green-600 text-white"
                            : "bg-gray-300 text-gray-600"
                        }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span
                      className={`text-xs font-medium text-center ${isCurrent
                          ? "text-blue-900"
                          : isActive
                            ? "text-green-900"
                            : "text-gray-600"
                        }`}
                    >
                      {status.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tracking Information */}
      {(orderData.trackingNumber || orderData.carrier) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Truck className="h-5 w-5" />
              <span>Shipping Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {orderData.trackingNumber && (
                <div>
                  <span className="text-sm text-gray-600">
                    Tracking Number:
                  </span>
                  <p className="font-mono font-medium">
                    {orderData.trackingNumber}
                  </p>
                </div>
              )}
              {orderData.carrier && (
                <div>
                  <span className="text-sm text-gray-600">Carrier:</span>
                  <p className="font-medium">{orderData.carrier}</p>
                </div>
              )}
              {orderData.estimatedDelivery && (
                <div>
                  <span className="text-sm text-gray-600">
                    Estimated Delivery:
                  </span>
                  <p className="font-medium">
                    {formatDate(orderData.estimatedDelivery)}
                  </p>
                </div>
              )}
              {orderData.actualDelivery && (
                <div>
                  <span className="text-sm text-gray-600">Delivered On:</span>
                  <p className="font-medium text-green-600">
                    {formatDate(orderData.actualDelivery)}
                  </p>
                </div>
              )}
            </div>

            {orderData.trackingNumber && (
              <div className="mt-4">
                <Button
                  variant="outline"
                  className="flex items-center space-x-2"
                  onClick={() => {
                    // Open carrier tracking page
                    const trackingUrl = `https://tracking.example.com/${orderData.trackingNumber}`;
                    window.open(trackingUrl, "_blank");
                  }}
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Track with {orderData.carrier || "Carrier"}</span>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tracking Events */}
      <Card>
        <CardHeader>
          <CardTitle>Tracking History</CardTitle>
        </CardHeader>
        <CardContent>
          {orderData.trackingEvents.length > 0 ? (
            <div className="space-y-4">
              {orderData.trackingEvents.map((event, index) => (
                <div key={event.id} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div
                      className={`w-3 h-3 rounded-full mt-2 ${index === 0 ? "bg-blue-600" : "bg-gray-300"
                        }`}
                    />
                    {index < orderData.trackingEvents.length - 1 && (
                      <div className="w-px h-8 bg-gray-200 ml-1 mt-1" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        {event.description}
                      </p>
                      <span className="text-xs text-gray-500">
                        {formatRelativeTime(event.createdAt)}
                      </span>
                    </div>
                    {event.location && (
                      <p className="text-xs text-gray-600 flex items-center space-x-1 mt-1">
                        <MapPin className="h-3 w-3" />
                        <span>{event.location}</span>
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(event.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No tracking events available yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Tracking information will appear here once your order is
                processed
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Shipping Address */}
      {orderData.shippingAddress && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Delivery Address</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-1">
              <p className="font-medium">
                {orderData.shippingAddress.fullName}
              </p>
              <p>{orderData.shippingAddress.address}</p>
              <p>
                {orderData.shippingAddress.city},{" "}
                {orderData.shippingAddress.state}{" "}
                {orderData.shippingAddress.postalCode}
              </p>
              <p>{orderData.shippingAddress.country}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Order Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {canCancelOrder(orderData.status) && onCancel && (
              <Button
                variant="outline"
                onClick={onCancel}
                className="flex items-center space-x-2"
              >
                <AlertCircle className="h-4 w-4" />
                <span>Cancel Order</span>
              </Button>
            )}

            {canReturnOrder(orderData.status, orderData.actualDelivery) &&
              onReturn && (
                <Button
                  variant="outline"
                  onClick={onReturn}
                  className="flex items-center space-x-2"
                >
                  <Package className="h-4 w-4" />
                  <span>Return Items</span>
                </Button>
              )}

            {onContactSupport && (
              <Button
                variant="outline"
                onClick={onContactSupport}
                className="flex items-center space-x-2"
              >
                <Phone className="h-4 w-4" />
                <span>Contact Support</span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Store Contact */}
      <Card>
        <CardHeader>
          <CardTitle>Store Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            {orderData.store.logo && (
              <img
                src={orderData.store.logo}
                alt={orderData.store.storeName}
                className="w-12 h-12 rounded-lg object-cover"
              />
            )}
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">
                {orderData.store.storeName}
              </h3>
              <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                {orderData.store.phone && (
                  <span className="flex items-center space-x-1">
                    <Phone className="h-3 w-3" />
                    <span>{orderData.store.phone}</span>
                  </span>
                )}
                {orderData.store.email && (
                  <span className="flex items-center space-x-1">
                    <Mail className="h-3 w-3" />
                    <span>{orderData.store.email}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Auto-refresh indicator */}
      {autoRefresh && (
        <Alert>
          <RefreshCw className="h-4 w-4" />
          <AlertDescription>
            This page automatically refreshes every {refreshInterval / 1000}{" "}
            seconds. Last updated: {lastRefresh.toLocaleTimeString()}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
