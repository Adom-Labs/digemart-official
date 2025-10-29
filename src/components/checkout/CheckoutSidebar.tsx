"use client";

import { ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useStoreCart } from "@/lib/api/hooks";
import { CartItem } from "@/lib/api/types";


interface CheckoutSidebarProps {
  storeId: number;
  className?: string;
}

export function CheckoutSidebar({ storeId, className }: CheckoutSidebarProps) {
  const { data: session } = useSession()

  const { data: storeCart } = useStoreCart(storeId || 0, { enabled: session?.user ? true : false });

  const cart = storeCart?.data;

  if (!session?.user) {
    return <h1>User not authenticated</h1>
  }


  if (!cart || cart.cartItems.length === 0) {
    return <h1>No cart available to process</h1>
  }

  const items: CartItem[] = cart.cartItems || [];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const totals = {
    subtotal: items.reduce((acc: number, item: CartItem) => acc + item.product.price * item.quantity, 0),
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

        </div>
      </div>

      {/* Cart Items */}
      <div className={cn(
        "p-4 md:p-6 border-b border-gray-200 max-h-96 overflow-y-auto")}>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <img
                  src={item.product.images[0] ? item.product.images[0].url : "/api/placeholder/60/60"}
                  alt={item.product.name}
                  className="w-15 h-15 rounded-md object-cover"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {item.product.name}
                </h4>


                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium w-8 text-center">
                      {item.quantity}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>

                  </div>
                </div>
              </div>
            </div>
          ))}
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
        </div>


      </div>
    </div>
  );
}
