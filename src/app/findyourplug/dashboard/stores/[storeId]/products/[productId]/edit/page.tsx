"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useProduct, useUpdateProduct } from "@/lib/api/hooks";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    ArrowLeft,
    Save,
    Loader2,
    AlertTriangle,
    Eye,
    Monitor,
    Smartphone,
    Trash2,
    Star,
    ImagePlus,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { uploadToCloudinary, type CloudinaryUploadResponse } from "@/lib/cloudinary";
import toast from "react-hot-toast";

interface ProductFormData {
    name: string;
    description: string;
    features?: string;
    price: number;
    sku?: string;
    inventory: number;
    minStockLevel?: number;
    weight?: number;
    dimensions?: {
        length?: number;
        width?: number;
        height?: number;
    };
    categoryId?: number;
    status: string;
    featured: boolean;
    trackInventory: boolean;
    metaTitle?: string;
    metaDescription?: string;
}export default function ProductEditPage() {
    const params = useParams();
    const router = useRouter();
    const storeId = Number(params.storeId);
    const productId = Number(params.productId);

    const [formData, setFormData] = useState<ProductFormData>({
        name: "",
        description: "",
        price: 0,
        inventory: 0,
        status: "active",
        featured: false,
        trackInventory: true,
    });

    const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [images, setImages] = useState<any[]>([]);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

    const { data: productData, isLoading, error } = useProduct(storeId, productId);
    const updateProductMutation = useUpdateProduct();

    console.log(productData);


    // Initialize form data when product loads
    useEffect(() => {
        if (productData) {
            const product = productData;
            setFormData({
                name: product.name || "",
                description: product.description || "",
                features: product.features || undefined,
                price: product.price || 0,
                sku: product.sku || undefined,
                inventory: product.inventory || 0,
                minStockLevel: product.minStockLevel || undefined,
                weight: product.weight || undefined,
                dimensions: product.dimensions ? {
                    length: product.dimensions.length || undefined,
                    width: product.dimensions.width || undefined,
                    height: product.dimensions.height || undefined,
                } : undefined,
                categoryId: product.category?.id || undefined,
                status: product.status || "active",
                featured: product.featured || false,
                trackInventory: product.trackInventory ?? true,
                metaTitle: product.metaTitle || undefined,
                metaDescription: product.metaDescription || undefined,
            });

            // Initialize images
            if (product.images && Array.isArray(product.images)) {
                setImages(product.images);
            }
        }
    }, [productData]);

    // Track unsaved changes
    useEffect(() => {
        if (productData) {
            const product = productData;
            const originalData = {
                name: product.name || "",
                description: product.description || "",
                features: product.features || undefined,
                price: product.price || 0,
                sku: product.sku || undefined,
                inventory: product.inventory || 0,
                minStockLevel: product.minStockLevel || undefined,
                weight: product.weight || undefined,
                dimensions: product.dimensions ? {
                    length: product.dimensions.length || undefined,
                    width: product.dimensions.width || undefined,
                    height: product.dimensions.height || undefined,
                } : undefined,
                categoryId: product.category?.id || undefined,
                status: product.status || "active",
                featured: product.featured || false,
                trackInventory: product.trackInventory ?? true,
                metaTitle: product.metaTitle || undefined,
                metaDescription: product.metaDescription || undefined,
            };
            const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);
            setHasUnsavedChanges(hasChanges);
        }
    }, [formData, productData]);

    const handleInputChange = (field: keyof ProductFormData, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateProductMutation.mutateAsync({
                storeId,
                productId,
                data: formData,
            });
            toast.success("Product updated successfully");
            setHasUnsavedChanges(false);
        } catch (error) {
            toast.error("Failed to update product");
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    // Image handling functions
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploadingImage(true);
        const uploadedImages: any[] = [];
        const failedUploads: string[] = [];

        try {
            toast(`Uploading ${files.length} image(s)...`);

            // Upload files one by one to show progress
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const fileKey = `${file.name}_${i}`;

                try {
                    const result: CloudinaryUploadResponse = await uploadToCloudinary(file, {
                        folder: `products/${storeId}/${productId}`,
                        tags: [`product_${productId}`, `store_${storeId}`],
                        onProgress: (progress) => {
                            setUploadProgress((prev) => ({ ...prev, [fileKey]: progress }));
                        },
                    });

                    // Create image object with uploaded data
                    const newImage = {
                        id: Date.now() + i, // Temporary ID until saved to DB
                        url: result.secure_url,
                        altText: result.original_filename,
                        order: images.length + uploadedImages.length,
                        isPrimary: images.length === 0 && uploadedImages.length === 0, // First image is primary
                        // Store image metadata
                        publicId: result.public_id,
                        width: result.width,
                        height: result.height,
                        format: result.format,
                        bytes: result.bytes,
                        originalFilename: result.original_filename,
                    };

                    uploadedImages.push(newImage);

                    // Clear progress for this file
                    setUploadProgress((prev) => {
                        const newProgress = { ...prev };
                        delete newProgress[fileKey];
                        return newProgress;
                    });
                } catch (error) {
                    console.error(`Failed to upload ${file.name}:`, error);
                    failedUploads.push(file.name);

                    // Clear progress for this file
                    setUploadProgress((prev) => {
                        const newProgress = { ...prev };
                        delete newProgress[fileKey];
                        return newProgress;
                    });
                }
            }

            if (uploadedImages.length > 0) {
                setImages((prev) => [...prev, ...uploadedImages]);
                toast.success(`${uploadedImages.length} image(s) uploaded successfully`);
            }

            if (failedUploads.length > 0) {
                toast.error(`Failed to upload: ${failedUploads.join(", ")}`);
            }
        } catch (error) {
            toast.error("Failed to upload images");
            console.error(error);
        } finally {
            setIsUploadingImage(false);
            setUploadProgress({});
            // Reset file input
            e.target.value = "";
        }
    };

    const handleSetPrimaryImage = (imageId: number) => {
        setImages((prev) =>
            prev.map((img) => ({
                ...img,
                isPrimary: img.id === imageId,
            }))
        );
        toast.success("Primary image updated");
    };

    const handleRemoveImage = (imageId: number) => {
        setImages((prev) => {
            const filtered = prev.filter((img) => img.id !== imageId);
            // If we removed the primary image, make the first remaining image primary
            if (filtered.length > 0 && !filtered.some((img) => img.isPrimary)) {
                filtered[0].isPrimary = true;
            }
            return filtered;
        });
        toast.success("Image removed");
    };

    const handleReorderImages = (fromIndex: number, toIndex: number) => {
        setImages((prev) => {
            const newImages = [...prev];
            const [removed] = newImages.splice(fromIndex, 1);
            newImages.splice(toIndex, 0, removed);
            // Update order values
            return newImages.map((img, index) => ({ ...img, order: index }));
        });
    };

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

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                href={`/findyourplug/dashboard/stores/${storeId}/products/${productId}`}
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span>Back</span>
                            </Link>
                            <div>
                                <h1 className="text-xl font-bold">Edit Product</h1>
                                <p className="text-sm text-gray-600">{product.name}</p>
                            </div>
                            {hasUnsavedChanges && (
                                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                    Unsaved Changes
                                </Badge>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                onClick={() => router.push(`/findyourplug/dashboard/stores/${storeId}/products/${productId}`)}
                            >
                                Cancel
                            </Button>
                            <Button onClick={handleSave} disabled={!hasUnsavedChanges || isSaving}>
                                {isSaving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Split Screen Layout */}
            <div className="container mx-auto p-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left: Form */}
                    <div className="space-y-6">
                        <Tabs defaultValue="basic" className="w-full">
                            <TabsList className="grid w-full grid-cols-5">
                                <TabsTrigger value="basic">Basic</TabsTrigger>
                                <TabsTrigger value="images">Images</TabsTrigger>
                                <TabsTrigger value="pricing">Pricing</TabsTrigger>
                                <TabsTrigger value="inventory">Inventory</TabsTrigger>
                                <TabsTrigger value="shipping">Shipping</TabsTrigger>
                            </TabsList>

                            {/* Basic Info Tab */}
                            <TabsContent value="basic" className="space-y-4 mt-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Basic Information</CardTitle>
                                        <CardDescription>
                                            Essential product details visible to customers
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <Label htmlFor="name">Product Name *</Label>
                                            <Input
                                                id="name"
                                                value={formData.name}
                                                onChange={(e) => handleInputChange("name", e.target.value)}
                                                placeholder="Enter product name"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="description">Description</Label>
                                            <Textarea
                                                id="description"
                                                value={formData.description}
                                                onChange={(e) => handleInputChange("description", e.target.value)}
                                                placeholder="Describe your product"
                                                rows={6}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="sku">SKU</Label>
                                            <Input
                                                id="sku"
                                                value={formData.sku}
                                                onChange={(e) => handleInputChange("sku", e.target.value)}
                                                placeholder="e.g., PROD-001"
                                            />
                                            <p className="text-sm text-gray-500 mt-1">
                                                Stock Keeping Unit for inventory tracking
                                            </p>
                                        </div>

                                        <div>
                                            <Label htmlFor="status">Status</Label>
                                            <Select
                                                value={formData.status}
                                                onValueChange={(value) => handleInputChange("status", value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="active">Active</SelectItem>
                                                    <SelectItem value="draft">Draft</SelectItem>
                                                    <SelectItem value="archived">Archived</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id="featured"
                                                checked={formData.featured}
                                                onChange={(e) => handleInputChange("featured", e.target.checked)}
                                                className="rounded"
                                            />
                                            <Label htmlFor="featured" className="cursor-pointer">
                                                Feature this product
                                            </Label>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Images Tab */}
                            <TabsContent value="images" className="space-y-4 mt-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Product Images</CardTitle>
                                        <CardDescription>
                                            Upload and manage product images. The first image or marked primary image will be the main display.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {/* Upload Button */}
                                        <div>
                                            <Label htmlFor="image-upload" className="cursor-pointer">
                                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                                                    {isUploadingImage ? (
                                                        <div className="flex flex-col items-center gap-2">
                                                            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                                                            <p className="text-sm font-medium text-gray-900">Uploading images...</p>
                                                            {Object.keys(uploadProgress).length > 0 && (
                                                                <div className="w-full max-w-xs space-y-1">
                                                                    {Object.entries(uploadProgress).map(([key, progress]) => (
                                                                        <div key={key} className="space-y-1">
                                                                            <div className="flex justify-between text-xs text-gray-600">
                                                                                <span className="truncate max-w-[200px]">{key.split('_')[0]}</span>
                                                                                <span>{progress}%</span>
                                                                            </div>
                                                                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                                                <div
                                                                                    className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                                                                                    style={{ width: `${progress}%` }}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center gap-2">
                                                            <ImagePlus className="w-8 h-8 text-gray-400" />
                                                            <p className="text-sm font-medium">Click to upload images</p>
                                                            <p className="text-xs text-gray-500">PNG, JPG, WebP up to 10MB</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </Label>
                                            <input
                                                id="image-upload"
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                className="hidden"
                                                onChange={handleImageUpload}
                                                disabled={isUploadingImage}
                                            />
                                        </div>

                                        {/* Image Grid */}
                                        {images.length > 0 && (
                                            <div className="space-y-2">
                                                <Label>Uploaded Images ({images.length})</Label>
                                                <div className="grid grid-cols-2 gap-4">
                                                    {images.map((image, index) => (
                                                        <div
                                                            key={image.id}
                                                            className="relative group border rounded-lg overflow-hidden bg-gray-50"
                                                        >
                                                            {/* Image Preview */}
                                                            <div className="aspect-square relative">
                                                                <img
                                                                    src={image.url}
                                                                    alt={image.altText || `Product image ${index + 1}`}
                                                                    className="w-full h-full object-cover"
                                                                />

                                                                {/* Primary Badge */}
                                                                {image.isPrimary && (
                                                                    <Badge className="absolute top-2 left-2 bg-blue-500">
                                                                        Primary
                                                                    </Badge>
                                                                )}

                                                                {/* Order Badge */}
                                                                <Badge variant="secondary" className="absolute top-2 right-2">
                                                                    {index + 1}
                                                                </Badge>

                                                                {/* Actions Overlay */}
                                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                                    {!image.isPrimary && (
                                                                        <Button
                                                                            size="sm"
                                                                            variant="secondary"
                                                                            onClick={() => handleSetPrimaryImage(image.id)}
                                                                            title="Set as primary"
                                                                        >
                                                                            <Star className="w-4 h-4" />
                                                                        </Button>
                                                                    )}
                                                                    <Button
                                                                        size="sm"
                                                                        variant="destructive"
                                                                        onClick={() => handleRemoveImage(image.id)}
                                                                        title="Remove image"
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </Button>
                                                                </div>
                                                            </div>

                                                            {/* Image Info */}
                                                            <div className="p-2 border-t">
                                                                <p className="text-xs text-gray-600 truncate">
                                                                    {image.altText || `Image ${index + 1}`}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {images.length === 0 && (
                                            <div className="text-center py-8 text-gray-500">
                                                <ImagePlus className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                                <p className="text-sm">No images uploaded yet</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Pricing Tab */}
                            <TabsContent value="pricing" className="space-y-4 mt-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Pricing</CardTitle>
                                        <CardDescription>Set your product pricing</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <Label htmlFor="price">Price *</Label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                                    $
                                                </span>
                                                <Input
                                                    id="price"
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={formData.price}
                                                    onChange={(e) => handleInputChange("price", parseFloat(e.target.value) || 0)}
                                                    className="pl-8"
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Inventory Tab */}
                            <TabsContent value="inventory" className="space-y-4 mt-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Inventory</CardTitle>
                                        <CardDescription>Manage stock levels</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id="trackInventory"
                                                checked={formData.trackInventory}
                                                onChange={(e) => handleInputChange("trackInventory", e.target.checked)}
                                                className="rounded"
                                            />
                                            <Label htmlFor="trackInventory" className="cursor-pointer">
                                                Track inventory for this product
                                            </Label>
                                        </div>

                                        <div>
                                            <Label htmlFor="inventory">Stock Quantity *</Label>
                                            <Input
                                                id="inventory"
                                                type="number"
                                                min="0"
                                                value={formData.inventory}
                                                onChange={(e) =>
                                                    handleInputChange("inventory", parseInt(e.target.value) || 0)
                                                }
                                                disabled={!formData.trackInventory}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="minStockLevel">Low Stock Alert</Label>
                                            <Input
                                                id="minStockLevel"
                                                type="number"
                                                min="0"
                                                value={formData.minStockLevel || ""}
                                                onChange={(e) =>
                                                    handleInputChange("minStockLevel", e.target.value ? parseInt(e.target.value) : undefined)
                                                }
                                                placeholder="e.g., 10"
                                                disabled={!formData.trackInventory}
                                            />
                                            <p className="text-sm text-gray-500 mt-1">
                                                Get notified when stock falls below this level
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Shipping Tab */}
                            <TabsContent value="shipping" className="space-y-4 mt-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Shipping Details</CardTitle>
                                        <CardDescription>Physical product information</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <Label htmlFor="weight">Weight (kg)</Label>
                                            <Input
                                                id="weight"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={formData.weight || ""}
                                                onChange={(e) =>
                                                    handleInputChange("weight", e.target.value ? parseFloat(e.target.value) : undefined)
                                                }
                                                placeholder="0.00"
                                            />
                                        </div>

                                        <Separator />

                                        <div>
                                            <Label>Dimensions (cm)</Label>
                                            <div className="grid grid-cols-3 gap-2 mt-2">
                                                <div>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        value={formData.dimensions?.length || ""}
                                                        onChange={(e) => {
                                                            const value = e.target.value ? parseFloat(e.target.value) : undefined;
                                                            handleInputChange("dimensions", {
                                                                ...formData.dimensions,
                                                                length: value,
                                                            });
                                                        }}
                                                        placeholder="Length"
                                                    />
                                                </div>
                                                <div>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        value={formData.dimensions?.width || ""}
                                                        onChange={(e) => {
                                                            const value = e.target.value ? parseFloat(e.target.value) : undefined;
                                                            handleInputChange("dimensions", {
                                                                ...formData.dimensions,
                                                                width: value,
                                                            });
                                                        }}
                                                        placeholder="Width"
                                                    />
                                                </div>
                                                <div>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        value={formData.dimensions?.height || ""}
                                                        onChange={(e) => {
                                                            const value = e.target.value ? parseFloat(e.target.value) : undefined;
                                                            handleInputChange("dimensions", {
                                                                ...formData.dimensions,
                                                                height: value,
                                                            });
                                                        }}
                                                        placeholder="Height"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Right: Preview */}
                    <div className="lg:sticky lg:top-24 h-fit">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <Eye className="w-5 h-5" />
                                        Live Preview
                                    </CardTitle>
                                    <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                                        <Button
                                            variant={previewMode === "desktop" ? "secondary" : "ghost"}
                                            size="sm"
                                            onClick={() => setPreviewMode("desktop")}
                                            className="h-8"
                                        >
                                            <Monitor className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant={previewMode === "mobile" ? "secondary" : "ghost"}
                                            size="sm"
                                            onClick={() => setPreviewMode("mobile")}
                                            className="h-8"
                                        >
                                            <Smartphone className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                                <CardDescription>
                                    See how your product will appear to customers
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div
                                    className={cn(
                                        "border rounded-lg bg-white transition-all duration-300",
                                        previewMode === "mobile" ? "max-w-[375px] mx-auto" : "w-full"
                                    )}
                                >
                                    {/* Product Card Preview */}
                                    <div className="p-4">
                                        {images.length > 0 && (
                                            <div className="aspect-square bg-gray-100 rounded-lg mb-4 relative overflow-hidden">
                                                <img
                                                    src={images.find(img => img.isPrimary)?.url || images[0]?.url}
                                                    alt={formData.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}

                                        {images.length === 0 && (
                                            <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                                                <ImagePlus className="w-12 h-12 text-gray-300" />
                                            </div>
                                        )}

                                        <div className="space-y-2">
                                            <div className="flex items-start justify-between gap-2">
                                                <h3 className="font-semibold line-clamp-2">{formData.name || "Product Name"}</h3>
                                                {formData.featured && (
                                                    <Badge className="bg-amber-500 shrink-0">Featured</Badge>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <span className="text-2xl font-bold">${formData.price.toFixed(2)}</span>
                                            </div>

                                            {formData.description && (
                                                <p className="text-sm text-gray-600 line-clamp-3">
                                                    {formData.description}
                                                </p>
                                            )}

                                            <div className="flex items-center gap-2 text-sm">
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        formData.inventory > 0
                                                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                            : "bg-red-50 text-red-700 border-red-200"
                                                    )}
                                                >
                                                    {formData.inventory > 0 ? `${formData.inventory} in stock` : "Out of Stock"}
                                                </Badge>
                                                {formData.sku && (
                                                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                                                        {formData.sku}
                                                    </code>
                                                )}
                                            </div>

                                            <Button className="w-full" disabled={formData.inventory === 0}>
                                                Add to Cart
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
