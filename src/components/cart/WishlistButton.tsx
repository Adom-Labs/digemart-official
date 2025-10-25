"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsInWishlist, useAddToWishlist, useRemoveFromWishlist } from "@/lib/api/hooks";
import { WishlistType } from "@/lib/api/types";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
    type: WishlistType;
    itemId: number;
    className?: string;
    showLabel?: boolean;
}

export function WishlistButton({
    type,
    itemId,
    className,
    showLabel = false
}: WishlistButtonProps) {
    const { data: session, status } = useSession();
    const isAuthenticated = status === "authenticated";

    const { data: wishlistStatus } = useIsInWishlist(type, itemId, {
        enabled: isAuthenticated,
        queryKey: ['wishlist-status', type, itemId],
    });
    const addToWishlist = useAddToWishlist();
    const removeFromWishlist = useRemoveFromWishlist();

    const isInWishlist = wishlistStatus?.inWishlist || false;
    const isPending = addToWishlist.isPending || removeFromWishlist.isPending;

    const handleToggleWishlist = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            toast.error("Please sign in to add items to your wishlist");
            return;
        }

        try {
            if (isInWishlist && wishlistStatus?.wishlistId) {
                await removeFromWishlist.mutateAsync(wishlistStatus.wishlistId);
                toast.success("Removed from wishlist");
            } else {
                await addToWishlist.mutateAsync({ type, itemId });
                toast.success("Added to wishlist");
            }
        } catch (error) {
            toast.error(isInWishlist ? "Failed to remove from wishlist" : "Failed to add to wishlist");
        }
    };

    return (
        <Button
            variant={isInWishlist ? "default" : "outline"}
            size={showLabel ? "default" : "icon"}
            className={cn(className)}
            onClick={handleToggleWishlist}
            disabled={isPending}
            aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
            <Heart
                className={cn(
                    "h-4 w-4",
                    isInWishlist && "fill-current",
                    showLabel && "mr-2"
                )}
            />
            {showLabel && (isInWishlist ? "In Wishlist" : "Add to Wishlist")}
        </Button>
    );
}
