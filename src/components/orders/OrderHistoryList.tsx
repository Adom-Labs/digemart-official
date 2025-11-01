"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useOrderHistory } from "@/lib/api/hooks/order-tracking";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
  Eye,
  MapPin,
} from "lucide-react";

// Simple currency formatter
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

// Order type definition
interface Order {
  id: number;
  status: keyof typeof statusIcons;
  createdAt: string;
  totalAmount: number;
  orderItems: Array<{
    product: { name: string };
    variant?: { name: string };
    quantity: number;
    unitPrice: number;
  }>;
  store: { storeName: string };
  shippingAddress?: {
    fullName: string;
    city: string;
    state: string;
    postalCode: string;
  };
  tracking?: Array<{
    description: string;
    location?: string;
  }>;
}

const statusIcons = {
  PENDING: Clock,
  PROCESSING: Package,
  TRANSIT: Truck,
  DELIVERED: CheckCircle,
  COMPLETED: CheckCircle,
  CANCELLED: AlertCircle,
  RETURNED: AlertCircle,
};

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  TRANSIT: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  RETURNED: "bg-gray-100 text-gray-800",
};

interface OrderHistoryListProps {
  className?: string;
}

export function OrderHistoryList({ className }: OrderHistoryListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: orders, isLoading, error } = useOrderHistory();

  const filteredOrders = ((orders as unknown as Order[]) || []).filter(
    (order: Order) =>
      order.id.toString().includes(searchTerm) ||
      order.store.storeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Failed to Load Orders</h3>
          <p className="text-gray-600">Please try again later.</p>
        </CardContent>
      </Card>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="text-center py-8">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Orders Yet</h3>
          <p className="text-gray-600">
            Your order history will appear here once you make your first
            purchase.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search orders by number or store name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order: Order) => {
          const StatusIcon = statusIcons[order.status] || Clock;

          return (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">Order #{order.id}</h3>
                      <Badge className={statusColors[order.status]}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {order.status.replace("_", " ")}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">
                      {formatCurrency(order.totalAmount)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.orderItems.length} item
                      {order.orderItems.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-3">
                  {/* Store Info */}
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">
                      {order.store.storeName}
                    </span>
                  </div>

                  {/* Order Items Preview */}
                  <div className="space-y-2">
                    {order.orderItems.slice(0, 2).map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center text-sm"
                      >
                        <span className="text-gray-700">
                          {item.product.name}
                          {item.variant && (
                            <span className="text-gray-500">
                              {" "}
                              ({item.variant.name})
                            </span>
                          )}
                        </span>
                        <span className="text-gray-600">
                          {item.quantity}x {formatCurrency(item.unitPrice)}
                        </span>
                      </div>
                    ))}
                    {order.orderItems.length > 2 && (
                      <p className="text-sm text-gray-500">
                        +{order.orderItems.length - 2} more item
                        {order.orderItems.length - 2 !== 1 ? "s" : ""}
                      </p>
                    )}
                  </div>

                  {/* Shipping Address */}
                  {order.shippingAddress && (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                      <div className="text-sm text-gray-600">
                        <p>{order.shippingAddress.fullName}</p>
                        <p>
                          {order.shippingAddress.city},{" "}
                          {order.shippingAddress.state}{" "}
                          {order.shippingAddress.postalCode}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <Separator className="my-4" />

                {/* Actions */}
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Link href={`/orders/${order.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </Link>
                    <Link href={`/orders/${order.id}/track`}>
                      <Button variant="outline" size="sm">
                        <Truck className="h-4 w-4 mr-1" />
                        Track Order
                      </Button>
                    </Link>
                  </div>

                  {/* Latest Tracking Info */}
                  {order.tracking && order.tracking.length > 0 && (
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Latest Update</p>
                      <p className="text-sm font-medium">
                        {order.tracking[0].description}
                      </p>
                      {order.tracking[0].location && (
                        <p className="text-xs text-gray-500">
                          {order.tracking[0].location}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredOrders.length === 0 && searchTerm && (
        <Card>
          <CardContent className="text-center py-8">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Orders Found</h3>
            <p className="text-gray-600">
              No orders match your search for &quot;{searchTerm}&quot;. Try a
              different search term.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
