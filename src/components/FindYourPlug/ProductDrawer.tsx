"use client";

import { useState } from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
    ExternalLink,
    ShoppingCart,
    Star,
    MapPin,
    Store,
    Package,
    X,
} from "lucide-react";
import { SearchResultDto } from "@/lib/api/types";

interface ProductDrawerProps {
    product: SearchResultDto | null;
    isOpen: boolean;
    onClose: () => void;
}

export function ProductDrawer({ product, isOpen, onClose }: ProductDrawerProps) {
    const [imageError, setImageError] = useState(false);

    if (!product) return null;

    // Extract store subdomain or slug from the product URL
    const getStoreUrl = () => {
        // If the product URL is like /store/subdomain/products/123
        // we extract the store part
        const urlParts = product.url.split("/");
        const storeIndex = urlParts.indexOf("store");
        if (storeIndex !== -1 && urlParts[storeIndex + 1]) {
            return `/store/${urlParts[storeIndex + 1]}`;
        }
        return product.url;
    };

    const handleVisitStore = () => {
        window.open(getStoreUrl(), "_blank");
    };

    const handleBuyNow = () => {
        window.open(product.url, "_blank");
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
                <SheetHeader className="mb-6">
                    <div className="flex items-start justify-between">
                        <SheetTitle className="text-2xl font-bold pr-8">
                            Product Details
                        </SheetTitle>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="absolute right-4 top-4"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </SheetHeader>

                <div className="space-y-6">
                    {/* Product Image */}
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100">
                        {product.image && !imageError ? (
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover"
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-24 h-24 text-gray-300" />
                            </div>
                        )}
                        {product.featured && (
                            <Badge className="absolute top-3 left-3 bg-yellow-500">
                                Featured
                            </Badge>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                {product.name}
                            </h2>
                            {product.category && (
                                <Badge variant="outline" className="mb-3">
                                    {product.category}
                                </Badge>
                            )}
                        </div>

                        {/* Price */}
                        {product.price && (
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-green-600">
                                    {product.currency || "₦"} {product.price.toLocaleString()}
                                </span>
                            </div>
                        )}

                        {/* Description */}
                        {product.description && (
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {product.description}
                                </p>
                            </div>
                        )}

                        {/* Store Info */}
                        {product.storeName && (
                            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                                <Store className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm text-gray-500 mb-1">Sold by</p>
                                    <p className="font-semibold text-gray-900">{product.storeName}</p>
                                    {product.verified && (
                                        <Badge variant="outline" className="mt-1 text-xs">
                                            ✓ Verified Store
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Location */}
                        {product.location && (
                            <div className="flex items-center gap-2 text-gray-600">
                                <MapPin className="w-4 h-4" />
                                <span className="text-sm">{product.location}</span>
                            </div>
                        )}

                        {/* Rating */}
                        {product.rating !== undefined && product.rating > 0 && (
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                                    <span className="font-semibold">{product.rating.toFixed(1)}</span>
                                </div>
                                {product.reviewCount !== undefined && (
                                    <span className="text-sm text-gray-500">
                                        ({product.reviewCount} reviews)
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3 pt-4 border-t">
                        <Button
                            onClick={handleBuyNow}
                            className="w-full flex items-center justify-center gap-2"
                            size="lg"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            Buy Now
                            <ExternalLink className="w-4 h-4" />
                        </Button>

                        <Button
                            onClick={handleVisitStore}
                            variant="outline"
                            className="w-full flex items-center justify-center gap-2"
                            size="lg"
                        >
                            <Store className="w-5 h-5" />
                            Visit Store
                            <ExternalLink className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Additional Info */}
                    <div className="text-xs text-gray-500 text-center pt-4 border-t">
                        Clicking &quot;Buy Now&quot; or &quot;Visit Store&quot; will take you to the store&apos;s page
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
