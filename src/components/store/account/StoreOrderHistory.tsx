"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  RotateCcw,
  Download,
  Eye,
  ShoppingCart,
} from "lucide-react";

// Mock order interface - to be replaced with actual API types
interface StoreOrder {
  id: string;
  orderNumber: string;
  status:
    | "PENDING"
    | "PROCESSING"
    | "TRANSIT"
    | "DELIVERED"
    | "COMPLETED"
    | "CANCELLED"
    | "RETURNED";
  total: number;
  currency: string;
  orderDate: string;
  deliveryDate?: string;
  items: Array<{
    id: string;
    productName: string;
    productImage?: string;
    quantity: number;
    price: number;
    sku?: string;
  }>;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  trackingNumber?: string;
}

interface StoreOrderHistoryProps {
  storeId: number;
}

// Mock data - to be replaced with actual API call
const mockOrders: StoreOrder[] = [
  {
    id: "1",
    orderNumber: "ORD-2024-001",
    status: "DELIVERED",
    total: 129.99,
    currency: "USD",
    orderDate: "2024-01-15T10:30:00Z",
    deliveryDate: "2024-01-18T14:20:00Z",
    trackingNumber: "TRK123456789",
    items: [
      {
        id: "1",
        productName: "Premium Wireless Headphones",
        quantity: 1,
        price: 99.99,
        sku: "WH-001",
      },
      {
        id: "2",
        productName: "Phone Case",
        quantity: 1,
        price: 29.99,
        sku: "PC-002",
      },
    ],
    shippingAddress: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
    },
  },
  {
    id: "2",
    orderNumber: "ORD-2024-002",
    status: "PROCESSING",
    total: 79.99,
    currency: "USD",
    orderDate: "2024-01-20T09:15:00Z",
    items: [
      {
        id: "3",
        productName: "Bluetooth Speaker",
        quantity: 1,
        price: 79.99,
        sku: "BS-003",
      },
    ],
  },
];

const getStatusIcon = (status: StoreOrder["status"]) => {
  switch (status) {
    case "PENDING":
      return <Package className="h-4 w-4" />;
    case "PROCESSING":
      return <Package className="h-4 w-4" />;
    case "TRANSIT":
      return <Truck className="h-4 w-4" />;
    case "DELIVERED":
    case "COMPLETED":
      return <CheckCircle className="h-4 w-4" />;
    case "CANCELLED":
      return <XCircle className="h-4 w-4" />;
    case "RETURNED":
      return <RotateCcw className="h-4 w-4" />;
    default:
      return <Package className="h-4 w-4" />;
  }
};

const getStatusColor = (status: StoreOrder["status"]) => {
  switch (status) {
    case "PENDING":
      return "secondary";
    case "PROCESSING":
      return "default";
    case "TRANSIT":
      return "default";
    case "DELIVERED":
    case "COMPLETED":
      return "default";
    case "CANCELLED":
      return "destructive";
    case "RETURNED":
      return "secondary";
    default:
      return "secondary";
  }
};

export function StoreOrderHistory({ storeId }: StoreOrderHistoryProps) {
  const [selectedOrder, setSelectedOrder] = useState<StoreOrder | null>(null);

  // Mock loading state - replace with actual loading from API
  const isLoading = false;
  const orders = mockOrders;

  const handleViewOrder = (order: StoreOrder) => {
    setSelectedOrder(order);
  };

  const handleReorder = (order: StoreOrder) => {
    // TODO: Implement reorder functionality
    console.log("Reorder:", order.id);
  };

  const handleDownloadInvoice = (order: StoreOrder) => {
    // TODO: Implement invoice download
    console.log("Download invoice:", order.id);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="h-5 w-5 mr-2" />
            Order History
          </CardTitle>
          <CardDescription>Your order history for this store</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No orders yet
            </h3>
            <p className="text-gray-600 mb-4">
              You haven't placed any orders at this store yet
            </p>
            <Button>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Start Shopping
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="h-5 w-5 mr-2" />
            Order History
          </CardTitle>
          <CardDescription>
            Your order history for this store ({orders.length} orders)
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="font-semibold text-lg">
                      Order #{order.orderNumber}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Placed on {new Date(order.orderDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge
                    variant={getStatusColor(order.status)}
                    className="flex items-center space-x-1"
                  >
                    {getStatusIcon(order.status)}
                    <span>{order.status}</span>
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">
                    ${order.total.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.items.length} item
                    {order.items.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Order Items */}
              <div className="space-y-3 mb-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                        <Package className="h-6 w-6 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity}{" "}
                          {item.sku && `• SKU: ${item.sku}`}
                        </p>
                      </div>
                    </div>
                    <p className="font-medium">${item.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Order Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-2">
                  {order.trackingNumber && (
                    <p className="text-sm text-gray-600">
                      Tracking: {order.trackingNumber}
                    </p>
                  )}
                  {order.deliveryDate && (
                    <p className="text-sm text-gray-600">
                      Delivered:{" "}
                      {new Date(order.deliveryDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewOrder(order)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadInvoice(order)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Invoice
                  </Button>
                  {(order.status === "DELIVERED" ||
                    order.status === "COMPLETED") && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReorder(order)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Reorder
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Order Details Modal/Drawer would go here */}
      {selectedOrder && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Order Details - #{selectedOrder.orderNumber}</CardTitle>
            <CardDescription>
              Complete information about your order
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Order Information */}
              <div>
                <h4 className="font-semibold mb-3">Order Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Number:</span>
                    <span>{selectedOrder.orderNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <Badge variant={getStatusColor(selectedOrder.status)}>
                      {selectedOrder.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Date:</span>
                    <span>
                      {new Date(selectedOrder.orderDate).toLocaleDateString()}
                    </span>
                  </div>
                  {selectedOrder.deliveryDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Date:</span>
                      <span>
                        {new Date(
                          selectedOrder.deliveryDate
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {selectedOrder.trackingNumber && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tracking:</span>
                      <span>{selectedOrder.trackingNumber}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Shipping Address */}
              {selectedOrder.shippingAddress && (
                <div>
                  <h4 className="font-semibold mb-3">Shipping Address</h4>
                  <div className="text-sm text-gray-600">
                    <p>{selectedOrder.shippingAddress.street}</p>
                    <p>
                      {selectedOrder.shippingAddress.city},{" "}
                      {selectedOrder.shippingAddress.state}{" "}
                      {selectedOrder.shippingAddress.zipCode}
                    </p>
                    <p>{selectedOrder.shippingAddress.country}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t">
              <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                Close Details
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
