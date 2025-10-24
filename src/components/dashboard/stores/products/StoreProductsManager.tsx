"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Search,
  Filter,
  Grid,
  List,
  Plus,
  Package,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Star,
  AlertTriangle,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Store } from "@/lib/api/hooks/stores";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import {

  useDeleteProduct,
  useToggleProductStatus,
  useToggleFeaturedStatus,
} from "@/lib/api/hooks";
import { type Product, type StoreProductQuery } from "@/lib/api/products";
import toast from "react-hot-toast";

import { useStoreProducts } from "@/lib/api/hooks/products";

interface StoreProductsManagerProps {
  store: Store;
}

export function StoreProductsManager({ store }: StoreProductsManagerProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  // Build query parameters
  const queryParams: StoreProductQuery = {
    page,
    limit,
    ...(searchQuery && { search: searchQuery }),
    ...(selectedCategory !== "all" && {
      categoryId: parseInt(selectedCategory),
    }),
    ...(selectedStatus !== "all" && { status: selectedStatus as any }),
  };

  // Fetch products
  const {
    data: productsResponse,
    isLoading,
    error,
  } = useStoreProducts(store.id, queryParams);

  // Mutations
  const deleteProductMutation = useDeleteProduct();
  const toggleStatusMutation = useToggleProductStatus();
  const toggleFeaturedMutation = useToggleFeaturedStatus();

  const products = productsResponse?.data || [];
  const meta = productsResponse?.meta;

  // Calculate statistics from the current page data
  const stats = {
    total: meta?.total || 0,
    active: products.filter((p) => p.status === "active").length,
    outOfStock: products.filter((p) => p.inventory === 0).length,
    draft: products.filter((p) => p.status === "draft").length,
    totalViews: products.reduce((sum, p) => sum + p.views, 0),
    featured: products.filter((p) => p.featured).length,
  };

  const handleDeleteProduct = async (productId: number) => {
    try {
      await deleteProductMutation.mutateAsync({ storeId: store.id, productId });
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast.error("Failed to delete product");
    }
  };

  const handleToggleStatus = async (
    productId: number,
    currentStatus: string
  ) => {
    try {
      const active = currentStatus !== "active";
      await toggleStatusMutation.mutateAsync({ storeId: store.id, productId, active });
      toast.success(`Product ${active ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error("Failed to toggle status:", error);
      toast.error("Failed to update product status");
    }
  };

  const handleToggleFeatured = async (
    productId: number,
    currentFeatured: boolean
  ) => {
    try {
      const featured = !currentFeatured;
      await toggleFeaturedMutation.mutateAsync({ storeId: store.id, productId, featured });
      toast.success(`Product ${featured ? 'featured' : 'unfeatured'} successfully`);
    } catch (error) {
      console.error("Failed to toggle featured:", error);
      toast.error("Failed to update featured status");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "archived":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getInventoryStatus = (inventory: number) => {
    if (inventory === 0)
      return { label: "Out of Stock", color: "bg-red-100 text-red-800" };
    if (inventory <= 5)
      return { label: "Low Stock", color: "bg-yellow-100 text-yellow-800" };
    return { label: "In Stock", color: "bg-green-100 text-green-800" };
  };

  const ProductCard = ({ product }: { product: Product }) => {
    const inventoryStatus = getInventoryStatus(product.inventory);
    const primaryImage =
      product.images?.find((img) => img.isPrimary) || product.images?.[0];

    return (
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <div className="aspect-square relative">
          {primaryImage ? (
            <img
              src={primaryImage.url}
              alt={primaryImage.altText || product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
          )}
          <div className="absolute top-2 right-2 flex gap-1">
            {product.featured && (
              <Badge className="bg-yellow-100 text-yellow-800">
                <Star className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link
                    href={`/findyourplug/dashboard/stores/${store.id}/products/${product.id}`}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href={`/findyourplug/dashboard/stores/${store.id}/products/${product.id}/edit`}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleToggleStatus(product.id, product.status)}
                >
                  {product.status === "active" ? "Deactivate" : "Activate"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    handleToggleFeatured(product.id, product.featured)
                  }
                >
                  {product.featured ? "Unfeature" : "Feature"}
                </DropdownMenuItem>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem
                      onSelect={(e) => e.preventDefault()}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Product</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{product.name}"? This
                        action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteProduct(product.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-sm line-clamp-2">
              {product.name}
            </h3>
            <Badge className={getStatusColor(product.status)}>
              {product.status}
            </Badge>
          </div>
          <p className="text-xs text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-lg">
                ${product.price.toFixed(2)}
              </span>
              <Badge className={inventoryStatus.color}>
                {inventoryStatus.label}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Stock: {product.inventory}</span>
              <span>{product.views} views</span>
            </div>
            {product.category && (
              <div className="text-xs text-gray-500">
                Category: {product.category.name}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const ProductListItem = ({ product }: { product: Product }) => {
    const inventoryStatus = getInventoryStatus(product.inventory);
    const primaryImage =
      product.images?.find((img) => img.isPrimary) || product.images?.[0];

    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 relative">
              {primaryImage ? (
                <img
                  src={primaryImage.url}
                  alt={primaryImage.altText || product.name}
                  className="w-full h-full object-cover rounded"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded">
                  <Package className="w-6 h-6 text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold truncate">{product.name}</h3>
                  {product.featured && (
                    <Star className="w-4 h-4 text-yellow-500" />
                  )}
                </div>
                <div className="flex gap-2">
                  <Badge className={getStatusColor(product.status)}>
                    {product.status}
                  </Badge>
                  <Badge className={inventoryStatus.color}>
                    {inventoryStatus.label}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-gray-600 line-clamp-1 mb-2">
                {product.description}
              </p>
              <div className="flex items-center gap-6 text-sm">
                <span className="font-bold">${product.price.toFixed(2)}</span>
                <span className="text-gray-500">
                  Stock: {product.inventory}
                </span>
                <span className="text-gray-500">{product.views} views</span>
                <span className="text-gray-500">
                  Rating: {product.averageRating.toFixed(1)}
                </span>
                {product.category && (
                  <span className="text-gray-500">{product.category.name}</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" asChild>
                <Link
                  href={`/findyourplug/dashboard/stores/${store.id}/products/${product.id}`}
                >
                  <Eye className="w-4 h-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link
                  href={`/findyourplug/dashboard/stores/${store.id}/products/${product.id}/edit`}
                >
                  <Edit className="w-4 h-4" />
                </Link>
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Product</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{product.name}"? This
                      action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDeleteProduct(product.id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Error loading products
          </h3>
          <p className="text-gray-600 mb-4">
            There was an error loading your products. Please try again.
          </p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {stats.total}
            </div>
            <div className="text-sm text-gray-600">Total Products</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {stats.active}
            </div>
            <div className="text-sm text-gray-600">Active</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">
              {stats.outOfStock}
            </div>
            <div className="text-sm text-gray-600">Out of Stock</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-600">
              {stats.draft}
            </div>
            <div className="text-sm text-gray-600">Draft</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {stats.featured}
            </div>
            <div className="text-sm text-gray-600">Featured</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-indigo-600">
              {stats.totalViews.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Views</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>

              {/* View Mode Toggle */}
              <Tabs
                value={viewMode}
                onValueChange={(v) => setViewMode(v as "grid" | "list")}
              >
                <TabsList>
                  <TabsTrigger value="grid">
                    <Grid className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="list">
                    <List className="h-4 w-4" />
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <Button asChild>
                <Link
                  href={`/findyourplug/dashboard/stores/${store.id}/products/create`}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading products...</p>
          </CardContent>
        </Card>
      )}

      {/* Products Grid/List */}
      {!isLoading && products.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || selectedStatus !== "all"
                ? "Try adjusting your filters to see more results."
                : "Get started by adding your first product."}
            </p>
            <Button asChild>
              <Link
                href={`/findyourplug/dashboard/stores/${store.id}/products/create`}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        !isLoading && (
          <>
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }
            >
              {products.map((product) =>
                viewMode === "grid" ? (
                  <ProductCard key={product.id} product={product} />
                ) : (
                  <ProductListItem key={product.id} product={product} />
                )
              )}
            </div>

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {(meta.page - 1) * meta.limit + 1} to{" "}
                  {Math.min(meta.page * meta.limit, meta.total)} of {meta.total}{" "}
                  products
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page - 1)}
                    disabled={page <= 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <span className="text-sm text-gray-600">
                    Page {meta.page} of {meta.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={page >= meta.totalPages}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )
      )}
    </div>
  );
}
