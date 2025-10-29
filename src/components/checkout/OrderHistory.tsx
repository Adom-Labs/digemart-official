"use client";

import { useState } from "react";
import {
  Package,
  Search,
  Filter,
  Calendar,
  ChevronDown,
  Eye,
  Download,
  RefreshCw,
  ExternalLink,
  ShoppingBag,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  getOrderStatusColor,
  getOrderStatusText,
  formatOrderNumber,
  canCancelOrder,
  canReturnOrder,
} from "@/lib/utils/order-tracking";

interface OrderHistoryItem {
  id: number;
  orderNumber: string;
  status: string;
  totalAmount: number;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  store: {
    id: number;
    storeName: string;
    storeSlug: string;
    logo?: string;
  };
  orderItems: Array<{
    id: number;
    quantity: number;
    product: {
      name: string;
      images?: string[];
    };
    variant?: {
      name: string;
    };
  }>;
  trackingNumber?: string;
  carrier?: string;
}

interface OrderHistoryProps {
  orders: OrderHistoryItem[];
  isLoading?: boolean;
  onViewOrder?: (orderId: number) => void;
  onTrackOrder?: (orderNumber: string) => void;
  onDownloadReceipt?: (orderNumber: string) => void;
  onCancelOrder?: (orderId: number) => void;
  onReturnOrder?: (orderId: number) => void;
  onReorder?: (orderId: number) => void;
  onRefresh?: () => void;
  showFilters?: boolean;
  showActions?: boolean;
}

const ORDER_STATUS_OPTIONS = [
  { value: "all", label: "All Orders" },
  { value: "PENDING", label: "Pending" },
  { value: "PROCESSING", label: "Processing" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];

const TIME_FILTER_OPTIONS = [
  { value: "all", label: "All Time" },
  { value: "30days", label: "Last 30 Days" },
  { value: "90days", label: "Last 3 Months" },
  { value: "1year", label: "Last Year" },
];

export function OrderHistory({
  orders,
  isLoading = false,
  onViewOrder,
  onTrackOrder,
  onDownloadReceipt,
  onCancelOrder,
  onReturnOrder,
  onReorder,
  onRefresh,
  showFilters = true,
  showActions = true,
}: OrderHistoryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

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
    });
  };

  const getFilteredOrders = () => {
    let filtered = [...orders];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.store.storeName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          order.orderItems.some((item) =>
            item.product.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Time filter
    if (timeFilter !== "all") {
      const now = new Date();
      const filterDate = new Date();

      switch (timeFilter) {
        case "30days":
          filterDate.setDate(now.getDate() - 30);
          break;
        case "90days":
          filterDate.setDate(now.getDate() - 90);
          break;
        case "1year":
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      filtered = filtered.filter(
        (order) => new Date(order.createdAt) >= filterDate
      );
    }

    // Sort orders
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "amount-high":
          return b.totalAmount - a.totalAmount;
        case "amount-low":
          return a.totalAmount - b.totalAmount;
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredOrders = getFilteredOrders();

  const getOrderPreviewImages = (
    orderItems: OrderHistoryItem["orderItems"]
  ) => {
    return orderItems
      .slice(0, 3)
      .map((item) => item.product.images?.[0])
      .filter(Boolean);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
                <div className="w-20 h-8 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order History</h1>
          <p className="text-gray-600 mt-1">
            {filteredOrders.length} of {orders.length} orders
          </p>
        </div>
        {onRefresh && (
          <Button
            variant="outline"
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center space-x-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </Button>
        )}
      </div>

      {/* Filters */}
      {showFilters && (
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  {ORDER_STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by time" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_FILTER_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="amount-high">Highest Amount</SelectItem>
                  <SelectItem value="amount-low">Lowest Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery || statusFilter !== "all" || timeFilter !== "all"
                ? "No orders found"
                : "No orders yet"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || statusFilter !== "all" || timeFilter !== "all"
                ? "Try adjusting your filters to see more results."
                : "When you place orders, they will appear here."}
            </p>
            {(searchQuery ||
              statusFilter !== "all" ||
              timeFilter !== "all") && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setTimeFilter("all");
                }}
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const statusColors = getOrderStatusColor(order.status);
            const statusText = getOrderStatusText(order.status);
            const previewImages = getOrderPreviewImages(order.orderItems);

            return (
              <Card
                key={order.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Order Images */}
                    <div className="flex-shrink-0">
                      {previewImages.length > 0 ? (
                        <div className="flex -space-x-2">
                          {previewImages.map((image, index) => (
                            <img
                              key={index}
                              src={image || "/api/placeholder/40/40"}
                              alt="Order item"
                              className="w-10 h-10 rounded-lg border-2 border-white object-cover"
                            />
                          ))}
                          {order.itemCount > 3 && (
                            <div className="w-10 h-10 rounded-lg border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                              +{order.itemCount - 3}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Package className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Order Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {formatOrderNumber(order.orderNumber)}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {order.store.storeName} •{" "}
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <Badge
                          className={`${statusColors.bg} ${statusColors.text} ${statusColors.border}`}
                          variant="outline"
                        >
                          {statusText}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Total:</span>
                          <p className="font-medium">
                            {formatPrice(order.totalAmount)}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600">Items:</span>
                          <p className="font-medium">{order.itemCount} items</p>
                        </div>
                        <div>
                          <span className="text-gray-600">
                            {order.actualDelivery
                              ? "Delivered:"
                              : "Est. Delivery:"}
                          </span>
                          <p
                            className={`font-medium ${
                              order.actualDelivery ? "text-green-600" : ""
                            }`}
                          >
                            {formatDate(
                              order.actualDelivery ||
                                order.estimatedDelivery ||
                                order.createdAt
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Tracking Info */}
                      {order.trackingNumber && (
                        <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-800">
                            <span className="font-medium">Tracking:</span>{" "}
                            {order.trackingNumber}
                            {order.carrier && ` (${order.carrier})`}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    {showActions && (
                      <div className="flex-shrink-0">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              Actions
                              <ChevronDown className="h-4 w-4 ml-1" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            {onViewOrder && (
                              <DropdownMenuItem
                                onClick={() => onViewOrder(order.id)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                            )}

                            {onTrackOrder && (
                              <DropdownMenuItem
                                onClick={() => onTrackOrder(order.orderNumber)}
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Track Order
                              </DropdownMenuItem>
                            )}

                            {onDownloadReceipt && (
                              <DropdownMenuItem
                                onClick={() =>
                                  onDownloadReceipt(order.orderNumber)
                                }
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Download Receipt
                              </DropdownMenuItem>
                            )}

                            {onReorder && (
                              <DropdownMenuItem
                                onClick={() => onReorder(order.id)}
                              >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Reorder
                              </DropdownMenuItem>
                            )}

                            <Separator />

                            {canCancelOrder(order.status) && onCancelOrder && (
                              <DropdownMenuItem
                                onClick={() => onCancelOrder(order.id)}
                                className="text-red-600"
                              >
                                <AlertCircle className="h-4 w-4 mr-2" />
                                Cancel Order
                              </DropdownMenuItem>
                            )}

                            {canReturnOrder(
                              order.status,
                              order.actualDelivery
                            ) &&
                              onReturnOrder && (
                                <DropdownMenuItem
                                  onClick={() => onReturnOrder(order.id)}
                                >
                                  <Package className="h-4 w-4 mr-2" />
                                  Return Items
                                </DropdownMenuItem>
                              )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
