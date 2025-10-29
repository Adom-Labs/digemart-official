"use client";

import { useState } from "react";
import { ShoppingBag, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MobileCheckoutButtonProps {
  total: number;
  itemCount: number;
  onToggleSummary: () => void;
  showSummary: boolean;
  className?: string;
}

export function MobileCheckoutButton({
  total,
  itemCount,
  onToggleSummary,
  showSummary,
  className,
}: MobileCheckoutButtonProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <div className={cn("lg:hidden", className)}>
      {/* Mobile Summary Toggle */}
      <Button
        variant="outline"
        onClick={onToggleSummary}
        className="w-full flex items-center justify-between p-4 h-auto border-gray-300"
      >
        <div className="flex items-center space-x-2">
          <ShoppingBag className="h-4 w-4" />
          <span className="text-sm font-medium">
            {showSummary ? "Hide" : "Show"} order summary
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </span>
          <span className="font-semibold">{formatPrice(total)}</span>
          {showSummary ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </div>
      </Button>
    </div>
  );
}
