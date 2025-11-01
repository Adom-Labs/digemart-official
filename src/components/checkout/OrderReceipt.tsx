"use client";

import { forwardRef } from "react";
import {
  Calendar,
  MapPin,
  Phone,
  Mail,
  Package,
  CreditCard,
  FileText,
  Building,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  formatOrderNumber,
  getOrderStatusColor,
  getOrderStatusText,
} from "@/lib/utils/order-tracking";

interface OrderReceiptData {
  id: number;
  orderNumber: string;
  status: string;
  totalAmount: number;
  createdAt: string;
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
    address?: string;
    phone?: string;
    email?: string;
    taxId?: string;
  };
  orderItems: Array<{
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
      sku?: string;
    };
    variant?: {
      id: number;
      name: string;
      sku?: string;
      attributes: Record<string, any>;
    };
  }>;
  shippingAddress?: {
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
  totals: {
    subtotal: number;
    shipping: number;
    tax: number;
    discount: number;
    total: number;
  };
  specialInstructions?: string;
}

interface OrderReceiptProps {
  order: OrderReceiptData;
  showHeader?: boolean;
  showFooter?: boolean;
  className?: string;
}

export const OrderReceipt = forwardRef<HTMLDivElement, OrderReceiptProps>(
  ({ order, showHeader = true, showFooter = true, className = "" }, ref) => {
    const statusColors = getOrderStatusColor(order.status);
    const statusText = getOrderStatusText(order.status);

    const formatPrice = (price: number) => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price);
    };

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    return (
      <div ref={ref} className={`bg-white p-8 max-w-4xl mx-auto ${className}`}>
        {/* Header */}
        {showHeader && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              {order.store.logo ? (
                <img
                  src={order.store.logo}
                  alt={order.store.storeName}
                  className="h-12 w-auto"
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <Building className="h-8 w-8 text-gray-600" />
                  <span className="text-xl font-bold text-gray-900">
                    {order.store.storeName}
                  </span>
                </div>
              )}

              <div className="text-right">
                <h1 className="text-2xl font-bold text-gray-900">RECEIPT</h1>
                <p className="text-sm text-gray-600">Order Receipt</p>
              </div>
            </div>

            {/* Store Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  From:
                </h3>
                <div className="text-sm text-gray-700 space-y-1">
                  <p className="font-medium">{order.store.storeName}</p>
                  {order.store.address && <p>{order.store.address}</p>}
                  {order.store.phone && (
                    <p className="flex items-center space-x-1">
                      <Phone className="h-3 w-3" />
                      <span>{order.store.phone}</span>
                    </p>
                  )}
                  {order.store.email && (
                    <p className="flex items-center space-x-1">
                      <Mail className="h-3 w-3" />
                      <span>{order.store.email}</span>
                    </p>
                  )}
                  {order.store.taxId && (
                    <p className="text-xs text-gray-500">
                      Tax ID: {order.store.taxId}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  To:
                </h3>
                <div className="text-sm text-gray-700 space-y-1">
                  <p className="font-medium">{order.customer.name}</p>
                  <p className="flex items-center space-x-1">
                    <Mail className="h-3 w-3" />
                    <span>{order.customer.email}</span>
                  </p>
                  {order.customer.phone && (
                    <p className="flex items-center space-x-1">
                      <Phone className="h-3 w-3" />
                      <span>{order.customer.phone}</span>
                    </p>
                  )}
                  {order.customer.id > 0 && (
                    <p className="text-xs text-gray-500">
                      Customer ID: {order.customer.id}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Separator />
          </div>
        )}

        {/* Order Information */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Order Details
              </h3>
              <div className="text-sm space-y-1">
                <p>
                  <span className="text-gray-600">Order #:</span>{" "}
                  <span className="font-mono font-medium">
                    {formatOrderNumber(order.orderNumber)}
                  </span>
                </p>
                <p>
                  <span className="text-gray-600">Date:</span>{" "}
                  <span>{formatDate(order.createdAt)}</span>
                </p>
                <p className="flex items-center space-x-2">
                  <span className="text-gray-600">Status:</span>
                  <Badge
                    className={`${statusColors.bg} ${statusColors.text} ${statusColors.border} text-xs`}
                    variant="outline"
                  >
                    {statusText}
                  </Badge>
                </p>
              </div>
            </div>

            {order.shippingAddress && (
              <div className="md:col-span-2">
                <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>Shipping Address</span>
                </h3>
                <div className="text-sm text-gray-700 space-y-1">
                  <p className="font-medium">
                    {order.shippingAddress.fullName}
                  </p>
                  <p>{order.shippingAddress.address}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    {order.shippingAddress.postalCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                  {order.shippingAddress.phone && (
                    <p className="flex items-center space-x-1">
                      <Phone className="h-3 w-3" />
                      <span>{order.shippingAddress.phone}</span>
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <Separator />
        </div>

        {/* Order Items */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <span>Items Ordered</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 text-sm font-semibold text-gray-900">
                    Item
                  </th>
                  <th className="text-center py-3 px-2 text-sm font-semibold text-gray-900">
                    SKU
                  </th>
                  <th className="text-center py-3 px-2 text-sm font-semibold text-gray-900">
                    Qty
                  </th>
                  <th className="text-right py-3 px-2 text-sm font-semibold text-gray-900">
                    Unit Price
                  </th>
                  <th className="text-right py-3 px-2 text-sm font-semibold text-gray-900">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {order.orderItems.map((item, index) => (
                  <tr
                    key={item.id}
                    className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="py-3 px-2">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {item.product.name}
                        </p>
                        {item.variant && (
                          <p className="text-xs text-gray-600 mt-1">
                            {item.variant.name}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <p className="text-xs font-mono text-gray-600">
                        {item.variant?.sku || item.product.sku || "-"}
                      </p>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <p className="text-sm text-gray-900">{item.quantity}</p>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <p className="text-sm text-gray-900">
                        {formatPrice(item.unitPrice)}
                      </p>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {formatPrice(item.totalPrice)}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Totals */}
        <div className="mb-8">
          <div className="flex justify-end">
            <div className="w-full max-w-sm">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="text-gray-900">
                    {formatPrice(order.totals.subtotal)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="text-gray-900">
                    {order.totals.shipping === 0
                      ? "Free"
                      : formatPrice(order.totals.shipping)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax:</span>
                  <span className="text-gray-900">
                    {formatPrice(order.totals.tax)}
                  </span>
                </div>

                {order.totals.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount:</span>
                    <span className="text-green-600">
                      -{formatPrice(order.totals.discount)}
                    </span>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-gray-900">Total:</span>
                  <span className="text-gray-900">
                    {formatPrice(order.totals.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        {order.payments.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Payment Information</span>
            </h3>

            <div className="space-y-3">
              {order.payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900">
                      {payment.method}{" "}
                      {payment.gateway && `(${payment.gateway})`}
                    </p>
                    <p className="text-xs text-gray-600">
                      Reference: {payment.reference}
                    </p>
                    <p className="text-xs text-gray-600">
                      Date: {formatDate(payment.createdAt)}
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
            </div>
          </div>
        )}

        {/* Special Instructions */}
        {order.specialInstructions && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Special Instructions</span>
            </h3>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">
                {order.specialInstructions}
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        {showFooter && (
          <div className="pt-8 border-t border-gray-200">
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                Thank you for your business!
              </p>
              <p className="text-xs text-gray-500">
                This is an official receipt for your order. Please keep this for
                your records.
              </p>
              <p className="text-xs text-gray-500">
                Generated on{" "}
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }
);

OrderReceipt.displayName = "OrderReceipt";
