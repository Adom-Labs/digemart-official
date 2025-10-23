"use client";

import { ShoppingCart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAddToCart } from "@/lib/api/hooks";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { addToGuestCart } from "@/lib/utils/guest-cart";
import { useState } from "react";

interface AddToCartButtonProps {
    productId: number;
    storeId: number;
    quantity?: number;
    variant?: "default" | "outline" | "ghost";
    size?: "default" | "sm" | "lg" | "icon";
    className?: string;
    showIcon?: boolean;
    children?: React.ReactNode;
}

export function AddToCartButton({
    productId,
    storeId,
    quantity = 1,
    variant = "default",
    size = "default",
    className,
    showIcon = true,
    children,
}: AddToCartButtonProps) {
    const { data: session, status } = useSession();
    const isAuthenticated = status === "authenticated";
    const addToCart = useAddToCart();
    const [isAddingToGuest, setIsAddingToGuest] = useState(false);

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            // Add to guest cart (localStorage)
            try {
                setIsAddingToGuest(true);
                addToGuestCart(storeId, productId, quantity);
                toast.success("Added to cart");
                // Trigger custom event to update cart count
                window.dispatchEvent(new Event('guestCartUpdated'));
            } catch (error) {
                toast.error("Failed to add to cart");
            } finally {
                setIsAddingToGuest(false);
            }
            return;
        }

        // Add to authenticated user cart (API)
        try {
            await addToCart.mutateAsync({
                storeId,
                data: { productId, quantity },
            });
            toast.success("Added to cart");
        } catch (error: any) {
            const message = error?.response?.data?.message || "Failed to add to cart";
            toast.error(message);
        }
    };

    const isPending = isAuthenticated ? addToCart.isPending : isAddingToGuest;

    return (
        <Button
            variant={variant}
            size={size}
            className={cn(className)}
            onClick={handleAddToCart}
            disabled={isPending}
        >
            {isPending ? (
                <Loader2 className={cn("h-4 w-4 animate-spin", children && "mr-2")} />
            ) : showIcon ? (
                <ShoppingCart className={cn("h-4 w-4", children && "mr-2")} />
            ) : null}
            {children || "Add to Cart"}
        </Button>
    );
}
