"use client";

import React, { useEffect, useState } from "react";
import {
  ShoppingCart,
  X,
  Minus,
  Plus,
  Trash2,
  Loader2,
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUpdateCartItem, useRemoveFromCart } from "@/lib/api/hooks";
import {
  useEnhancedUpdateCartItem,
  useEnhancedRemoveFromCart,
  useSyncGuestCart,
} from "@/lib/api/hooks/enhanced-cart";
import { useStoreCartContext } from "./StoreCartProvider";
import toast from "react-hot-toast";

import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";

interface StoreCartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function StoreCartDrawer({ open, onClose }: StoreCartDrawerProps) {
  const {
    cart,
    guestCart,
    storeId,
    isLoading,
    itemCount,
    totalAmount,
    isAuthenticated,
  } = useStoreCartContext();

  const enhancedUpdateCartItem = useEnhancedUpdateCartItem();
  const enhancedRemoveFromCart = useEnhancedRemoveFromCart();
  const syncGuestCart = useSyncGuestCart();

  // Local state for guest cart updates
  const [localGuestCart, setLocalGuestCart] = useState(guestCart);

  // Update local guest cart when context changes
  useEffect(() => {
    setLocalGuestCart(guestCart);
  }, [guestCart]);

  // Listen for guest cart updates
  useEffect(() => {
    const handleGuestCartUpdate = () => {
      // Force re-render by updating local state
      setLocalGuestCart((prev) => ({ ...prev }));
    };

    window.addEventListener("guestCartUpdated", handleGuestCartUpdate);
    return () =>
      window.removeEventListener("guestCartUpdated", handleGuestCartUpdate);
  }, []);

  const handleUpdateQuantity = async (
    itemId: number | undefined,
    productId: number,
    quantity: number
  ) => {
    await enhancedUpdateCartItem.mutateAsync({
      itemId,
      storeId,
      productId,
      quantity,
    });
  };

  const handleRemoveItem = async (
    itemId: number | undefined,
    productId: number
  ) => {
    await enhancedRemoveFromCart.mutateAsync({
      itemId,
      storeId,
      productId,
    });
  };

  const handleSyncGuestCart = async () => {
    await syncGuestCart.mutateAsync(storeId);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose}>
      <div
        className="fixed right-0 top-0 h-full w-full max-w-md bg-background shadow-xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            <h2 className="text-lg font-semibold">
              {cart?.store?.storeName || "Shopping Cart"}
            </h2>
            {itemCount > 0 && (
              <Badge variant="secondary">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading cart...</p>
            </div>
          ) : (!isAuthenticated &&
            (!localGuestCart || localGuestCart.items.length === 0)) ||
            (isAuthenticated && (!cart || cart.cartItems.length === 0)) ? (
            <div className="text-center py-8">
              <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-lg font-medium mb-2">Your cart is empty</p>
              <p className="text-sm text-gray-600 mb-4">
                Add items from {cart?.store?.storeName || "this store"} to get
                started
              </p>
              <Button onClick={onClose} variant="outline">
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Guest Cart Notice */}
              {!isAuthenticated &&
                localGuestCart &&
                localGuestCart.items.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <LogIn className="h-4 w-4 text-blue-600" />
                      <p className="text-sm font-medium text-blue-800">
                        Sign in to save your cart
                      </p>
                    </div>
                    <p className="text-xs text-blue-600 mb-2">
                      Your cart items are temporarily stored. Sign in to save
                      them permanently.
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-blue-600 border-blue-300 hover:bg-blue-100"
                      onClick={() => signIn()}
                    >
                      Sign In
                    </Button>
                  </div>
                )}

              {/* Render Cart Items */}
              {isAuthenticated
                ? // Authenticated user cart items
                cart?.cartItems.map((item) => {
                  const primaryImage =
                    item.product.images?.find((img) => img.isPrimary) ||
                    item.product.images?.[0];

                  return (
                    <div
                      key={item.id}
                      className="flex gap-4 p-3 border rounded-lg"
                    >
                      {/* Product Image */}
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border">
                        {primaryImage ? (
                          <Image
                            src={primaryImage.url}
                            alt={primaryImage.altText || item.product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full bg-gray-100">
                            <ShoppingCart className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between gap-2 mb-2">
                          <h3 className="font-medium text-sm line-clamp-2">
                            {item.product.name}
                          </h3>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 flex-shrink-0"
                            onClick={() =>
                              handleRemoveItem(item.id, item.product.id)
                            }
                            disabled={enhancedRemoveFromCart.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <p className="text-sm text-gray-600 mb-2">
                          ${item.product.price.toFixed(2)} each
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.id,
                                  item.product.id,
                                  item.quantity - 1
                                )
                              }
                              disabled={
                                item.quantity <= 1 ||
                                enhancedUpdateCartItem.isPending
                              }
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm font-medium w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.id,
                                  item.product.id,
                                  item.quantity + 1
                                )
                              }
                              disabled={
                                item.quantity >= item.product.inventory ||
                                enhancedUpdateCartItem.isPending
                              }
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          <p className="text-sm font-semibold">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>

                        {/* Stock Warning */}
                        {item.product.inventory < 5 && (
                          <p className="text-xs text-orange-600 mt-1">
                            Only {item.product.inventory} left in stock
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })
                : // Guest cart items (simplified display)
                localGuestCart?.items.map((item) => (
                  <div
                    key={`guest-${item.productId}`}
                    className="flex gap-4 p-3 border rounded-lg bg-gray-50"
                  >
                    {/* Placeholder Image */}
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border bg-gray-200">
                      <div className="flex items-center justify-center h-full">
                        <ShoppingCart className="w-6 h-6 text-gray-400" />
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-2 mb-2">
                        <h3 className="font-medium text-sm">
                          Product #{item.productId}
                        </h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 flex-shrink-0"
                          onClick={() =>
                            handleRemoveItem(undefined, item.productId)
                          }
                          disabled={enhancedRemoveFromCart.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <p className="text-sm text-gray-600 mb-2">
                        Sign in to see product details
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() =>
                              handleUpdateQuantity(
                                undefined,
                                item.productId,
                                item.quantity - 1
                              )
                            }
                            disabled={
                              item.quantity <= 1 ||
                              enhancedUpdateCartItem.isPending
                            }
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() =>
                              handleUpdateQuantity(
                                undefined,
                                item.productId,
                                item.quantity + 1
                              )
                            }
                            disabled={enhancedUpdateCartItem.isPending}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Footer with Totals */}
        {((isAuthenticated && cart && cart.cartItems.length > 0) ||
          (!isAuthenticated &&
            localGuestCart &&
            localGuestCart.items.length > 0)) && (
            <div className="border-t p-4 space-y-3">
              {isAuthenticated && cart ? (
                // Authenticated user - show totals
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>${cart.totals?.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax</span>
                      <span>${cart.totals?.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span>Total</span>
                      <span>${cart.totals?.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button
                      className="w-full"
                      size="lg"
                      style={{
                        backgroundColor: "var(--store-color-primary, #3B82F6)",
                        color: "white",
                      }}
                      asChild
                    >
                      <Link href={`/checkout?store=${storeId}`}>
                        Proceed to Checkout
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={onClose}
                    >
                      Continue Shopping
                    </Button>
                  </div>
                </>
              ) : (
                // Guest user - prompt to sign in
                <div className="space-y-3">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">
                      {localGuestCart?.items.length} item(s) in cart
                    </p>
                    <p className="text-xs text-gray-500">
                      Sign in to see prices and checkout
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={() => signIn()}
                      style={{
                        backgroundColor: "var(--store-color-primary, #3B82F6)",
                        color: "white",
                      }}
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign In to Checkout
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={onClose}
                    >
                      Continue Shopping
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
      </div>
    </div>
  );
}
