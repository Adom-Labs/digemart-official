"use client";

import { ShoppingCart, X, Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserCarts, useStoreCart, useUpdateCartItem, useRemoveFromCart } from "@/lib/api/hooks";
import { Cart, Cart as CartType } from "@/lib/api/types";
import { useState, useEffect } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { getTotalGuestCartItems, getGuestCarts, getGuestCart, getGuestCartItemCount } from "@/lib/utils/guest-cart";

interface MiniCartProps {
    onOpenCart?: () => void;
    storeId?: number; // Optional: if provided, show only this store's cart
}

export function MiniCart({ onOpenCart, storeId }: MiniCartProps) {
    const { status } = useSession();
    const isAuthenticated = status === "authenticated";
    const [guestItemCount, setGuestItemCount] = useState(0);

    // Use store-specific cart if storeId provided, otherwise get all carts
    const storeCartEnabled = isAuthenticated && !!storeId;
    const allCartsEnabled = isAuthenticated && !storeId;

    const { data: storeCart } = useStoreCart(storeId || 0, { enabled: storeCartEnabled });
    const { data: allCarts } = useUserCarts({ enabled: allCartsEnabled });

    const carts = storeId ? (storeCart ? [storeCart.data] : []) : allCarts;

    // Update guest cart count when component mounts or localStorage changes
    useEffect(() => {
        if (!isAuthenticated) {
            const updateGuestCount = () => {
                if (storeId) {
                    // Get count for specific store
                    setGuestItemCount(getGuestCartItemCount(storeId));
                } else {
                    // Get total count across all stores
                    setGuestItemCount(getTotalGuestCartItems());
                }
            };

            updateGuestCount();

            // Listen for localStorage changes (cross-tab sync)
            window.addEventListener('storage', updateGuestCount);
            // Listen for custom cart update events
            window.addEventListener('guestCartUpdated', updateGuestCount);

            return () => {
                window.removeEventListener('storage', updateGuestCount);
                window.removeEventListener('guestCartUpdated', updateGuestCount);
            };
        }
    }, [isAuthenticated, storeId]);

    const totalItems = isAuthenticated
        ? (Array.isArray(carts) ? carts.reduce((sum, cart) => sum + (cart.cartItems.length || 0), 0) : 0)
        : guestItemCount;

    return (
        <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={onOpenCart}
            aria-label="Shopping cart"
        >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems > 99 ? "99+" : totalItems}
                </span>
            )}
        </Button>
    );
}

interface CartDrawerProps {
    open: boolean;
    onClose: () => void;
    storeId?: number; // Optional: if provided, show only this store's cart
}

export function CartDrawer({ open, onClose, storeId }: CartDrawerProps) {
    const { status } = useSession();
    const isAuthenticated = status === "authenticated";
    const [guestCarts, setGuestCarts] = useState<any[]>([]);

    // Use store-specific cart if storeId provided, otherwise get all carts
    const storeCartEnabled = isAuthenticated && open && !!storeId;
    const allCartsEnabled = isAuthenticated && open && !storeId;

    const { data: storeCart } = useStoreCart(storeId || 0, { enabled: storeCartEnabled });
    const { data: allCarts, isLoading } = useUserCarts({ enabled: allCartsEnabled });
    // eslint-diasble-next-line will fix refrence type
    const carts = storeId ? (storeCart ? [storeCart.data] : []) : allCarts;

    const updateCartItem = useUpdateCartItem();
    const removeFromCart = useRemoveFromCart();

    // Load guest carts when not authenticated
    useEffect(() => {
        if (!isAuthenticated && open) {
            if (storeId) {
                // Get specific store cart
                const storeCart = getGuestCart(storeId);
                setGuestCarts(storeCart ? [storeCart] : []);
            } else {
                // Get all guest carts
                const loadedGuestCarts = getGuestCarts();
                setGuestCarts(loadedGuestCarts);
            }
        }
    }, [isAuthenticated, open, storeId]);


    const cart = isAuthenticated ? carts?.[0] : null;

    console.log("Cart:", cart);

    const hasItems = isAuthenticated
        ? (cart?.cartItems?.length || 0) > 0
        : Array.isArray(guestCarts) && guestCarts.some(c => c.items.length > 0);

    const totalItems = isAuthenticated
        ? (cart?.totals?.itemCount || 0)
        : Array.isArray(guestCarts) ? guestCarts.reduce((sum, c) => sum + c.items.reduce((s: number, i: any) => s + i.quantity, 0), 0) : 0;

    const handleUpdateQuantity = async (itemId: number, quantity: number) => {
        try {
            await updateCartItem.mutateAsync({ itemId, data: { quantity } });
            toast.success("Cart updated");
        } catch (error) {
            toast.error("Failed to update cart");
        }
    };

    const handleRemoveItem = async (itemId: number) => {
        try {
            await removeFromCart.mutateAsync(itemId);
            toast.success("Item removed from cart");
        } catch (error) {
            toast.error("Failed to remove item");
        }
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
                        <h2 className="text-lg font-semibold">Shopping Cart</h2>
                        {totalItems > 0 && (
                            <span className="text-sm text-muted-foreground">
                                ({totalItems} items)
                            </span>
                        )}
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-4">
                    {isLoading ? (
                        <div className="text-center py-8 text-muted-foreground">
                            Loading cart...
                        </div>
                    ) : !hasItems ? (
                        <div className="text-center py-8">
                            <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                            <p className="text-lg font-medium mb-2">Your cart is empty</p>
                            <p className="text-sm text-muted-foreground mb-4">
                                Add items to get started
                            </p>
                            <Button onClick={onClose}>Continue Shopping</Button>
                        </div>
                    ) : !isAuthenticated ? (
                        /* Guest Cart Display */
                        <div className="space-y-4">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                                <p className="text-sm text-blue-800">
                                    Sign in to sync your cart and checkout
                                </p>
                            </div>
                            {guestCarts.map((guestCart) =>
                                guestCart.items.map((item: any) => (
                                    <div key={`${guestCart.storeId}-${item.productId}`} className="flex gap-4 p-3 border rounded-lg">
                                        <div className="flex-1">
                                            <p className="font-medium">Product ID: {item.productId}</p>
                                            <p className="text-sm text-muted-foreground">Store ID: {guestCart.storeId}</p>
                                            <p className="text-sm">Quantity: {item.quantity}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cart.cartItems.map((item) => (
                                <div key={item.id} className="flex gap-4 p-3 border rounded-lg">
                                    {/* Product Image */}
                                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border">
                                        <Image
                                            src={item.product.images[0]?.url || "/placeholder-product.png"}
                                            alt={item.product.name}
                                            fill
                                            className="object-cover"
                                        />
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
                                                onClick={() => handleRemoveItem(item.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        <p className="text-sm text-muted-foreground mb-2">
                                            ${item.product.price.toFixed(2)} each
                                        </p>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-7 w-7"
                                                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                    disabled={item.quantity <= 1 || updateCartItem.isPending}
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
                                                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                    disabled={
                                                        item.quantity >= item.product.inventory ||
                                                        updateCartItem.isPending
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
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer with Totals */}
                {cart && cart.cartItems.length > 0 && (
                    <div className="border-t p-4 space-y-3">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Subtotal</span>
                                <span>${cart.cartItems.reduce((acc: number, item: Cart['cartItems'][number]) => acc + item.product.price * item.quantity, 0).toFixed(2)}</span>
                            </div>
                            {/* <div className="flex justify-between text-sm">
                                <span>Tax</span>
                                <span>${cart.totals?.tax.toFixed(2)}</span>
                            </div> */}
                            {/* <div className="flex justify-between text-lg font-bold border-t pt-2">
                                <span>Total</span>
                                <span>${cart.totals?.total.toFixed(2)}</span>
                            </div> */}
                        </div>

                        <Button className="w-full" size="lg">
                            Proceed to Checkout
                        </Button>
                        <Button variant="outline" className="w-full" onClick={onClose}>
                            Continue Shopping
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
