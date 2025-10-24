"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, Minus, Plus, X, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
}

interface OrderTotals {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
}

interface CheckoutSidebarProps {
  storeId: number;
  className?: string;
}

export function CheckoutSidebar({ storeId, className }: CheckoutSidebarProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [totals, setTotals] = useState<OrderTotals>({
    subtotal: 0,
    shipping: 0,
    tax: 0,
    discount: 0,
    total: 0,
  });
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [showItems, setShowItems] = useState(true);

  // Mock data - replace with actual cart data
  useEffect(() => {
    // This would be replaced with actual cart fetching logic
    const mockItems: CartItem[] = [
      {
        id: "1",
        productId: 1,
        name: "Premium Wireless Headphones",
        image: "/api/placeholder/80/80",
        price: 199.99,
        quantity: 1,
        variant: {
          name: "Black - Large",
          options: { color: "Black", size: "Large" },
        },
      },
      {
        id: "2",
        productId: 2,
        name: "Smart Watch Series 5",
        image: "/api/placeholder/80/80",
        price: 299.99,
        quantity: 2,
      },
    ];

    setItems(mockItems);

    // Calculate totals
    const subtotal = mockItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shipping = subtotal > 100 ? 0 : 15.99;
    const tax = subtotal * 0.08; // 8% tax
    const discount = appliedCoupon ? subtotal * 0.1 : 0; // 10% discount if coupon applied
    const total = subtotal + shipping + tax - discount;

    setTotals({ subtotal, shipping, tax, discount, total });
  }, [appliedCoupon]);

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setItems(
      items.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (itemId: string) => {
    setItems(items.filter((item) => item.id !== itemId));
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;

    setIsApplyingCoupon(true);
    // Mock coupon application - replace with actual API call
    setTimeout(() => {
      if (couponCode.toLowerCase() === "save10") {
        setAppliedCoupon(couponCode);
        setCouponCode("");
      }
      setIsApplyingCoupon(false);
    }, 1000);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <div
      className={cn(
        "bg-white rounded-lg border border-gray-200 lg:sticky lg:top-24",
        className
      )}
    >
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-base md:text-lg font-semibold text-gray-900 flex items-center">
            <ShoppingBag className="h-4 w-4 md:h-5 md:w-5 mr-2" />
            Order Summary
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowItems(!showItems)}
            className="text-gray-500 hover:text-gray-700 lg:hidden"
          >
            {showItems ? "Hide" : "Show"} ({items.length})
          </Button>
        </div>
      </div>

      {/* Cart Items */}
      <div className={cn(
        "p-4 md:p-6 border-b border-gray-200 max-h-96 overflow-y-auto",
        showItems ? "block" : "hidden lg:block"
      )}>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-start space-x-3">
                {/* Product Image */}
                <div className="flex-shrink-0">
                  <img
                    src={item.image || "/api/placeholder/60/60"}
                    alt={item.name}
                    className="w-15 h-15 rounded-md object-cover"
                  />
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

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
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
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                        onClick={() => removeItem(item.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Coupon Code */}
      <div className="p-4 md:p-6 border-b border-gray-200">
        <div className="space-y-3">
          {appliedCoupon ? (
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-md">
              <div className="flex items-center space-x-2">
                <Tag className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  Coupon "{appliedCoupon}" applied
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={removeCoupon}
                className="text-green-600 hover:text-green-800"
              >
                Remove
              </Button>
            </div>
          ) : (
            <div className="flex space-x-2">
              <Input
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={applyCoupon}
                disabled={!couponCode.trim() || isApplyingCoupon}
                size="sm"
              >
                {isApplyingCoupon ? "Applying..." : "Apply"}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Order Totals */}
      <div className="p-4 md:p-6">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
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

        {totals.shipping === 0 && totals.subtotal > 100 && (
          <div className="mt-4 p-3 bg-green-50 rounded-md">
            <p className="text-sm text-green-800 flex items-center">
              <Tag className="h-4 w-4 mr-2" />
              You qualify for free shipping!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
