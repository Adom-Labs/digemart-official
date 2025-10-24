"use client";

import { useState } from "react";
import {
  ShoppingBag,
  Minus,
  Plus,
  X,
  Tag,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
  availability?: {
    inStock: boolean;
    stockLevel?: number;
  };
}

interface OrderTotals {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  savings?: number;
}

interface Discount {
  type: "coupon" | "promotion" | "bulk";
  code?: string;
  name: string;
  amount: number;
  percentage?: number;
}

interface OrderSummaryProps {
  items: CartItem[];
  totals: OrderTotals;
  discounts?: Discount[];
  onUpdateQuantity?: (itemId: string, quantity: number) => void;
  onRemoveItem?: (itemId: string) => void;
  onRemoveDiscount?: (discountCode: string) => void;
  isEditable?: boolean;
  showItemDetails?: boolean;
  className?: string;
}

export function OrderSummary({
  items,
  totals,
  discounts = [],
  onUpdateQuantity,
  onRemoveItem,
  onRemoveDiscount,
  isEditable = false,
  showItemDetails = true,
  className,
}: OrderSummaryProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showAllItems, setShowAllItems] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const displayItems = showAllItems ? items : items.slice(0, 3);
  const hasMoreItems = items.length > 3;
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1 || !onUpdateQuantity) return;
    onUpdateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId: string) => {
    if (!onRemoveItem) return;
    onRemoveItem(itemId);
  };

  return (
    <div
      className={cn("bg-white rounded-lg border border-gray-200", className)}
    >
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-base md:text-lg font-semibold text-gray-900 flex items-center">
            <ShoppingBag className="h-4 w-4 md:h-5 md:w-5 mr-2" />
            Order Summary
          </h2>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-xs">
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </Badge>
            {showItemDetails && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-gray-500 hover:text-gray-700 md:hidden"
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Cart Items */}
      {showItemDetails && (
        <div
          className={cn(
            "border-b border-gray-200",
            isExpanded ? "block" : "hidden md:block"
          )}
        >
          <div className="p-4 md:p-6 max-h-96 overflow-y-auto">
            <div className="space-y-4">
              {displayItems.map((item) => (
                <div key={item.id} className="flex items-start space-x-3">
                  {/* Product Image */}
                  <div className="flex-shrink-0 relative">
                    <img
                      src={item.image || "/api/placeholder/60/60"}
                      alt={item.name}
                      className="w-15 h-15 rounded-md object-cover"
                    />
                    {!item.availability?.inStock && (
                      <div className="absolute inset-0 bg-red-500 bg-opacity-20 rounded-md flex items-center justify-center">
                        <Badge variant="destructive" className="text-xs">
                          Out of Stock
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {item.name}
                    </h4>
                    {item.variant && (
                      <p className="text-xs text-gray-500 mt-1">
                        {item.variant.name}
                      </p>
                    )}

                    {/* Stock Level Warning */}
                    {item.availability?.stockLevel &&
                      item.availability.stockLevel < 5 &&
                      item.availability.inStock && (
                        <p className="text-xs text-orange-600 mt-1">
                          Only {item.availability.stockLevel} left in stock
                        </p>
                      )}

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Controls */}
                      {isEditable ? (
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity + 1)
                            }
                            disabled={
                              !item.availability?.inStock ||
                              (item.availability?.stockLevel &&
                                item.quantity >= item.availability.stockLevel)
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-600">
                          Qty: {item.quantity}
                        </span>
                      )}

                      {/* Price and Remove */}
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                        {isEditable && onRemoveItem && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {hasMoreItems && !showAllItems && (
                <div className="text-center py-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAllItems(true)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Show {items.length - 3} more items
                  </Button>
                </div>
              )}

              {showAllItems && hasMoreItems && (
                <div className="text-center py-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAllItems(false)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    Show less
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Applied Discounts */}
      {discounts.length > 0 && (
        <div className="p-4 md:p-6 border-b border-gray-200">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-900">
              Applied Discounts
            </h4>
            {discounts.map((discount, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-green-50 rounded-md"
              >
                <div className="flex items-center space-x-2">
                  <Tag className="h-4 w-4 text-green-600" />
                  <div>
                    <span className="text-sm font-medium text-green-800">
                      {discount.name}
                    </span>
                    {discount.code && (
                      <span className="text-xs text-green-600 ml-1">
                        ({discount.code})
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-green-800">
                    -{formatPrice(discount.amount)}
                  </span>
                  {isEditable && onRemoveDiscount && discount.code && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveDiscount(discount.code!)}
                      className="text-green-600 hover:text-green-800 h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Order Totals */}
      <div className="p-4 md:p-6">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"})
            </span>
            <span className="text-gray-900">
              {formatPrice(totals.subtotal)}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping</span>
            <span className="text-gray-900">
              {totals.shipping === 0 ? (
                <span className="text-green-600 font-medium">Free</span>
              ) : (
                formatPrice(totals.shipping)
              )}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax</span>
            <span className="text-gray-900">{formatPrice(totals.tax)}</span>
          </div>

          {totals.discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Discount</span>
              <span className="text-green-600 font-medium">
                -{formatPrice(totals.discount)}
              </span>
            </div>
          )}

          <Separator />

          <div className="flex justify-between text-lg font-semibold">
            <span className="text-gray-900">Total</span>
            <span className="text-gray-900">{formatPrice(totals.total)}</span>
          </div>

          {totals.savings && totals.savings > 0 && (
            <div className="text-center p-2 bg-green-50 rounded-md">
              <p className="text-sm text-green-800 font-medium">
                You're saving {formatPrice(totals.savings)} on this order!
              </p>
            </div>
          )}
        </div>

        {/* Free Shipping Indicator */}
        {totals.shipping === 0 && totals.subtotal > 100 && (
          <div className="mt-4 p-3 bg-green-50 rounded-md">
            <p className="text-sm text-green-800 flex items-center">
              <Tag className="h-4 w-4 mr-2" />
              You qualify for free shipping!
            </p>
          </div>
        )}

        {/* Free Shipping Progress */}
        {totals.shipping > 0 && totals.subtotal < 100 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-800">
              Add {formatPrice(100 - totals.subtotal)} more to qualify for free
              shipping
            </p>
            <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min((totals.subtotal / 100) * 100, 100)}%`,
                }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
