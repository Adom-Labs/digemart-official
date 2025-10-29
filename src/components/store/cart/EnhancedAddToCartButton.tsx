"use client";

import React, { useState } from "react";
import { ShoppingCart, Plus, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEnhancedAddToCart } from "@/lib/api/hooks/enhanced-cart";
import { useStoreCartContext } from "./StoreCartProvider";
import { cn } from "@/lib/utils";

interface EnhancedAddToCartButtonProps {
  productId: number;
  quantity?: number;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  className?: string;
  disabled?: boolean;
  showIcon?: boolean;
  children?: React.ReactNode;
}

export function EnhancedAddToCartButton({
  productId,
  quantity = 1,
  variant = "default",
  size = "default",
  className,
  disabled = false,
  showIcon = true,
  children,
}: EnhancedAddToCartButtonProps) {
  const { storeId } = useStoreCartContext();
  const addToCart = useEnhancedAddToCart();
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = async () => {
    try {
      await addToCart.mutateAsync({
        storeId,
        productId,
        quantity,
      });

      // Show success state briefly
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    } catch (error) {
      // Error is handled by the hook
      console.error("Add to cart failed:", error);
    }
  };

  const isLoading = addToCart.isPending;
  const isDisabled = disabled || isLoading;

  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        "transition-all duration-200",
        justAdded && "bg-green-600 hover:bg-green-700",
        className
      )}
      onClick={handleAddToCart}
      disabled={isDisabled}
      style={
        !justAdded
          ? {
              backgroundColor: "var(--store-color-primary, #3B82F6)",
              color: "white",
            }
          : undefined
      }
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Adding...
        </>
      ) : justAdded ? (
        <>
          <Check className="w-4 h-4 mr-2" />
          Added!
        </>
      ) : (
        <>
          {showIcon && <ShoppingCart className="w-4 h-4 mr-2" />}
          {children || "Add to Cart"}
        </>
      )}
    </Button>
  );
}

/**
 * Compact version for product grids
 */
export function CompactAddToCartButton({
  productId,
  quantity = 1,
  className,
  disabled = false,
}: {
  productId: number;
  quantity?: number;
  className?: string;
  disabled?: boolean;
}) {
  const { storeId } = useStoreCartContext();
  const addToCart = useEnhancedAddToCart();
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await addToCart.mutateAsync({
        storeId,
        productId,
        quantity,
      });

      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    } catch (error) {
      console.error("Add to cart failed:", error);
    }
  };

  const isLoading = addToCart.isPending;
  const isDisabled = disabled || isLoading;

  return (
    <Button
      size="icon"
      variant="secondary"
      className={cn(
        "h-8 w-8 rounded-full transition-all duration-200",
        justAdded && "bg-green-600 hover:bg-green-700 text-white",
        className
      )}
      onClick={handleAddToCart}
      disabled={isDisabled}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : justAdded ? (
        <Check className="w-4 h-4" />
      ) : (
        <Plus className="w-4 h-4" />
      )}
    </Button>
  );
}
