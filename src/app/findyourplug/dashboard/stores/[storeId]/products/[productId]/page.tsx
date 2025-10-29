"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useProduct } from "@/lib/api/hooks";
import { ProductHero } from "@/components/dashboard/products/ProductHero";
import { ProductGallery } from "@/components/dashboard/products/ProductGallery";
import { VariantTable } from "@/components/dashboard/products/VariantTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Package,
    Truck,
    Clock,
    Loader2,
    AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";


export default function ProductViewPage() {
    const params = useParams();
    const router = useRouter();
    const storeId = Number(params.storeId);
    const productId = Number(params.productId);

    const [selectedTab, setSelectedTab] = useState("overview");

    const { data: productData, isLoading, error } = useProduct(storeId, productId);
    console.log(productData);


    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">Loading product details...</p>
                </div>
            </div>
        );
    }

    if (error || !productData) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Card className="max-w-md">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Failed to Load Product</h3>
                            <p className="text-gray-600 mb-4">
                                {error instanceof Error ? error.message : "Product not found"}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const product = productData;

    // Use real data from backend
    const stats = {
        totalViews: product.views || 0,
        viewsTrend: 12.5, // TODO: Calculate from historical data
        totalSales: product.salesCount || 0,
        salesTrend: 8.3, // TODO: Calculate from historical data
        conversionRate: product.views > 0 ? ((product.salesCount || 0) / product.views) * 100 : 0,
        conversionTrend: -1.2, // TODO: Calculate from historical data
        revenue: product.revenue || 0,
        revenueTrend: 15.7, // TODO: Calculate from historical data
    };

    const handleEdit = () => {
        router.push(`/findyourplug/dashboard/stores/${storeId}/products/${productId}/edit`);
    };

    const handleDuplicate = () => {
        toast("Duplicate feature coming soon");
    };

    const handleArchive = () => {
        toast("Archive feature coming soon");
    };

    const handleShare = () => {
        const url = `${window.location.origin}/products/${product.slug}`;
        navigator.clipboard.writeText(url);
        toast.success("Product link copied to clipboard");
    };

    return (
        <div className="container mx-auto py-6 px-4 space-y-6">
            {/* Hero Section */}
            <ProductHero
                productName={product.name}
                productId={productId}
                storeId={storeId}
                price={product.price}
                compareAtPrice={undefined} // Not in current API response
                sku={product.sku || "N/A"}
                status={product.status}
                rating={product.averageRating || undefined}
                reviewCount={product.totalRatings || 0}
                totalSold={product.salesCount || 0}
                stats={stats}
                onEdit={handleEdit}
                onDuplicate={handleDuplicate}
                onArchive={handleArchive}
                onShare={handleShare}
            />

            <Separator />

            {/* Tabbed Content */}
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList className="grid w-full grid-cols-6 max-w-4xl">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="inventory">Inventory</TabsTrigger>
                    <TabsTrigger value="pricing">Pricing</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6 mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Gallery */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Product Images</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ProductGallery images={product.images} />
                                </CardContent>
                            </Card>

                            {/* Description */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Description</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="prose max-w-none">
                                        <p className="whitespace-pre-wrap">{product.description}</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Features */}
                            {product.features && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Features</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="prose max-w-none">
                                            <p className="whitespace-pre-wrap">{product.features}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Variants */}
                            {product.productVariants && product.productVariants.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Variants</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <VariantTable variants={product.productVariants} />
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Inventory Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Package className="w-5 h-5" />
                                        Inventory
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Stock Quantity</p>
                                        <p className="text-2xl font-bold">{product.inventory}</p>
                                    </div>
                                    {product.minStockLevel && (
                                        <div>
                                            <p className="text-sm text-gray-600">Low Stock Alert</p>
                                            <Badge variant="outline" className="mt-1">
                                                {product.minStockLevel} units
                                            </Badge>
                                        </div>
                                    )}
                                    {product.weight && (
                                        <div>
                                            <p className="text-sm text-gray-600">Weight</p>
                                            <p className="font-medium">{product.weight} kg</p>
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-sm text-gray-600">Track Inventory</p>
                                        <Badge variant={product.trackInventory ? "default" : "secondary"} className="mt-1">
                                            {product.trackInventory ? "Enabled" : "Disabled"}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Shipping Card */}
                            {product.dimensions && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Truck className="w-5 h-5" />
                                            Shipping
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div className="grid grid-cols-3 gap-2 text-sm">
                                            {product.dimensions.length && (
                                                <div>
                                                    <p className="text-gray-600">Length</p>
                                                    <p className="font-medium">{product.dimensions.length} cm</p>
                                                </div>
                                            )}
                                            {product.dimensions.width && (
                                                <div>
                                                    <p className="text-gray-600">Width</p>
                                                    <p className="font-medium">{product.dimensions.width} cm</p>
                                                </div>
                                            )}
                                            {product.dimensions.height && (
                                                <div>
                                                    <p className="text-gray-600">Height</p>
                                                    <p className="font-medium">{product.dimensions.height} cm</p>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Category & Collections */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Organization</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {product.category && (
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Category</p>
                                            <Badge>{product.category.name}</Badge>
                                        </div>
                                    )}
                                    {/* {product.productCollections && product.productCollections.length > 0 && (
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Collections</p>
                                            <div className="flex flex-wrap gap-1">
                                                {product.productCollections.map((pc: any) => (
                                                    <Badge key={pc.collection.id} variant="outline">
                                                        {pc.collection.name}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )} */}
                                    {product.tags && product.tags.length > 0 && (
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Tags</p>
                                            <div className="flex flex-wrap gap-1">
                                                {product.tags.map((tag: string, idx: number) => (
                                                    <Badge key={idx} variant="secondary">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Metadata */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Clock className="w-5 h-5" />
                                        Metadata
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2 text-sm">
                                    <div>
                                        <p className="text-gray-600">Created</p>
                                        <p className="font-medium">
                                            {new Date(product.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Last Updated</p>
                                        <p className="font-medium">
                                            {new Date(product.updatedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                {/* Other Tabs - Placeholder */}
                <TabsContent value="inventory" className="mt-6">
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-gray-600 text-center py-12">
                                Inventory management coming soon
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="pricing" className="mt-6">
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-gray-600 text-center py-12">Pricing history coming soon</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="analytics" className="mt-6">
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-gray-600 text-center py-12">
                                Analytics dashboard coming soon
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="reviews" className="mt-6">
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-gray-600 text-center py-12">Reviews section coming soon</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="activity" className="mt-6">
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-gray-600 text-center py-12">Activity log coming soon</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
