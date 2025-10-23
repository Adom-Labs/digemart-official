"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Save, ArrowLeft, Upload, X, Plus, Loader2, ImagePlus, Star, Trash2 } from "lucide-react";
import Link from "next/link";
import { useCreateProduct } from "@/lib/api/hooks/products";
import { type CreateProductData } from "@/lib/api/products";
import { Store } from "@/lib/api/hooks/stores";
import { useCategories } from "@/lib/api/hooks";
import { uploadToCloudinary, type CloudinaryUploadResponse } from "@/lib/cloudinary";
import toast from "react-hot-toast";

// Helper function to generate URL-friendly slug
const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
};

// Helper function to truncate text to a specific length
const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
};

const productSchema = z.object({
  name: z.string().min(1, "Product name is required").max(255, "Name too long"),
  description: z.string().optional(),
  features: z.string().optional(),
  price: z.number().min(0, "Price must be positive"),
  compareAtPrice: z
    .number()
    .min(0, "Compare price must be positive")
    .optional(),
  inventory: z.number().min(0, "Inventory must be non-negative").optional(),
  minStockLevel: z
    .number()
    .min(0, "Min stock level must be non-negative")
    .optional(),
  featured: z.boolean().optional(),
  sku: z.string().optional(),
  slug: z.string().optional(),
  weight: z.number().min(0, "Weight must be positive").optional(),
  status: z.enum(["draft", "active", "inactive"]).optional(),
  trackInventory: z.boolean().optional(),
  allowBackorders: z.boolean().optional(),
  metaTitle: z
    .string()
    .max(60, "Meta title should be under 60 characters")
    .optional(),
  metaDescription: z
    .string()
    .max(160, "Meta description should be under 160 characters")
    .optional(),
  categoryId: z.number().optional(),
  // Dimensions
  dimensionLength: z.number().min(0).optional(),
  dimensionWidth: z.number().min(0).optional(),
  dimensionHeight: z.number().min(0).optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface CreateProductFormProps {
  store: Store;
}

export function CreateProductForm({ store }: CreateProductFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("basic");
  const [images, setImages] = useState<Array<CloudinaryUploadResponse & { isPrimary?: boolean }>>([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [manualSlug, setManualSlug] = useState(false);
  const [manualMetaTitle, setManualMetaTitle] = useState(false);
  const [manualMetaDescription, setManualMetaDescription] = useState(false);

  const createProductMutation = useCreateProduct(store.id);

  // Fetch product categories from API
  const { data: categories, isLoading: categoriesLoading } = useCategories({
    categoryType: "PRODUCT",
  });

  console.log(categories);


  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      features: "",
      price: 0,
      inventory: 0,
      featured: false,
      status: "active",
      trackInventory: true,
      allowBackorders: false,
    },
  });

  // Watch form values for auto-generation
  const watchName = form.watch("name");
  const watchDescription = form.watch("description");
  const watchPrice = form.watch("price");

  // Auto-generate slug from product name
  useEffect(() => {
    if (!manualSlug && watchName) {
      const generatedSlug = generateSlug(watchName);
      form.setValue("slug", generatedSlug, { shouldValidate: false });
    }
  }, [watchName, manualSlug, form]);

  // Auto-generate meta title from product name
  useEffect(() => {
    if (!manualMetaTitle && watchName) {
      const metaTitle = truncateText(watchName, 60);
      form.setValue("metaTitle", metaTitle, { shouldValidate: false });
    }
  }, [watchName, manualMetaTitle, form]);

  // Auto-generate meta description from product name, description, and price
  useEffect(() => {
    if (!manualMetaDescription && watchName) {
      let metaDesc = watchName;

      if (watchDescription) {
        // Combine name and description
        metaDesc = `${watchName} - ${watchDescription}`;
      }

      if (watchPrice && watchPrice > 0) {
        // Add price info
        metaDesc = `${metaDesc} | Starting at $${watchPrice}`;
      }

      const finalMetaDesc = truncateText(metaDesc, 160);
      form.setValue("metaDescription", finalMetaDesc, { shouldValidate: false });
    }
  }, [watchName, watchDescription, watchPrice, manualMetaDescription, form]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setIsUploadingImage(true);

    try {
      const uploadPromises = files.map(async (file) => {
        const fileId = `${file.name}-${Date.now()}`;

        return uploadToCloudinary(file, {
          folder: `products/${store.id}/temp`,
          tags: [`store_${store.id}`, 'product_temp'],
          onProgress: (progress) => {
            setUploadProgress((prev) => ({ ...prev, [fileId]: progress }));
          },
        });
      });

      const uploadedImages = await Promise.all(uploadPromises);

      // Add new images, marking first one as primary if no images exist
      const newImages = uploadedImages.map((img, idx) => ({
        ...img,
        isPrimary: images.length === 0 && idx === 0,
      }));

      setImages((prev) => [...prev, ...newImages]);
      setUploadProgress({});
      toast.success(`${uploadedImages.length} image(s) uploaded successfully`);
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Failed to upload images. Please try again.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSetPrimaryImage = (index: number) => {
    setImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      }))
    );
  };

  const removeImage = (index: number) => {
    const removedImage = images[index];
    const newImages = images.filter((_, i) => i !== index);

    // If removed image was primary and there are remaining images, make first one primary
    if (removedImage.isPrimary && newImages.length > 0) {
      newImages[0].isPrimary = true;
    }

    setImages(newImages);
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      // Prepare the product data
      const productData: CreateProductData = {
        name: data.name,
        description: data.description,
        features: data.features,
        price: data.price,
        compareAtPrice: data.compareAtPrice,
        inventory: data.inventory,
        minStockLevel: data.minStockLevel,
        featured: data.featured,
        sku: data.sku,
        slug: data.slug,
        weight: data.weight,
        status: data.status,
        trackInventory: data.trackInventory,
        allowBackorders: data.allowBackorders,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        categoryId: data.categoryId,
        // Combine dimensions into object
        ...(data.dimensionLength || data.dimensionWidth || data.dimensionHeight
          ? {
            dimensions: {
              length: data.dimensionLength,
              width: data.dimensionWidth,
              height: data.dimensionHeight,
            },
          }
          : {}),
      };

      // Add uploaded images
      if (images.length > 0) {
        productData.images = images.map((img, index) => ({
          url: img.secure_url,
          altText: data.name,
          order: index,
          isPrimary: img.isPrimary || false,
          fileSize: img.bytes,
          mimeType: `image/${img.format}`,
          originalName: img.original_filename || `image-${index}`,
        }));
      }

      await createProductMutation.mutateAsync(productData);

      // Redirect to products list
      router.push(`/findyourplug/dashboard/stores/${store.id}/products`);
    } catch (error) {
      console.error("Failed to create product:", error);
    }
  };

  // Manual slug generation when user clicks the button
  const handleGenerateSlug = () => {
    const name = form.getValues("name");
    if (name) {
      const slug = generateSlug(name);
      form.setValue("slug", slug);
      setManualSlug(false); // Re-enable auto-generation
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => form.setValue("status", "draft")}
            disabled={createProductMutation.isPending}
          >
            Save as Draft
          </Button>
          <Button
            onClick={() => {
              form.setValue("status", "active");
              form.handleSubmit(onSubmit)();
            }}
            disabled={createProductMutation.isPending}
          >
            {createProductMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Publish Product
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="pricing">Pricing</TabsTrigger>
                  <TabsTrigger value="inventory">Inventory</TabsTrigger>
                  <TabsTrigger value="seo">SEO</TabsTrigger>
                </TabsList>

                {/* Basic Information */}
                <TabsContent value="basic" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Product Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product Name *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter product name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe your product..."
                                rows={4}
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Provide a detailed description of your product
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="features"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Key Features</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="List key features (one per line)"
                                rows={3}
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              List the main features or benefits of your product
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  {/* Images */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Product Images</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Image Upload */}
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <ImagePlus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600 mb-2">
                            {isUploadingImage
                              ? "Uploading images..."
                              : "Drag and drop images here, or click to select"}
                          </p>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="image-upload"
                            disabled={isUploadingImage}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              document.getElementById("image-upload")?.click()
                            }
                            disabled={isUploadingImage}
                          >
                            {isUploadingImage ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Upload className="mr-2 h-4 w-4" />
                                Select Images
                              </>
                            )}
                          </Button>
                        </div>

                        {/* Upload Progress */}
                        {Object.keys(uploadProgress).length > 0 && (
                          <div className="space-y-2">
                            {Object.entries(uploadProgress).map(([fileId, progress]) => (
                              <div key={fileId} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">
                                    {fileId.split('-')[0]}
                                  </span>
                                  <span className="text-gray-600">{progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-blue-600 h-2 rounded-full transition-all"
                                    style={{ width: `${progress}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Image Previews */}
                        {images.length > 0 && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {images.map((image, index) => (
                              <div key={image.public_id} className="relative group">
                                <img
                                  src={image.secure_url}
                                  alt={image.original_filename || `Image ${index + 1}`}
                                  className="w-full h-32 object-cover rounded border"
                                />

                                {/* Action Buttons */}
                                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button
                                    type="button"
                                    variant={image.isPrimary ? "default" : "secondary"}
                                    size="sm"
                                    className="h-7 w-7 p-0"
                                    onClick={() => handleSetPrimaryImage(index)}
                                    title="Set as primary image"
                                  >
                                    <Star
                                      className={`w-3.5 h-3.5 ${image.isPrimary ? "fill-current" : ""
                                        }`}
                                    />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    className="h-7 w-7 p-0"
                                    onClick={() => removeImage(index)}
                                    title="Remove image"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </Button>
                                </div>

                                {/* Primary Badge */}
                                {image.isPrimary && (
                                  <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-current" />
                                    Primary
                                  </div>
                                )}

                                {/* Image Info */}
                                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                                  {image.width}×{image.height}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {images.length === 0 && !isUploadingImage && (
                          <p className="text-sm text-gray-500 text-center py-4">
                            No images uploaded yet. Add at least one image to showcase your product.
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Pricing */}
                <TabsContent value="pricing" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Pricing Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Price *</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.01"
                                  placeholder="0.00"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="compareAtPrice"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Compare at Price</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.01"
                                  placeholder="0.00"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      parseFloat(e.target.value) || undefined
                                    )
                                  }
                                />
                              </FormControl>
                              <FormDescription>
                                Original price for showing discounts
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="weight"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Weight (kg)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    parseFloat(e.target.value) || undefined
                                  )
                                }
                              />
                            </FormControl>
                            <FormDescription>
                              Product weight for shipping calculations
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Dimensions */}
                      <div>
                        <Label className="text-sm font-medium">
                          Dimensions (cm)
                        </Label>
                        <div className="grid grid-cols-3 gap-4 mt-2">
                          <FormField
                            control={form.control}
                            name="dimensionLength"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="Length"
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(
                                        parseFloat(e.target.value) || undefined
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="dimensionWidth"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="Width"
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(
                                        parseFloat(e.target.value) || undefined
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="dimensionHeight"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="Height"
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(
                                        parseFloat(e.target.value) || undefined
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Inventory */}
                <TabsContent value="inventory" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Inventory Management</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="trackInventory"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Track Inventory
                              </FormLabel>
                              <FormDescription>
                                Monitor stock levels for this product
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      {form.watch("trackInventory") && (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="inventory"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Current Stock</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      placeholder="0"
                                      {...field}
                                      onChange={(e) =>
                                        field.onChange(
                                          parseInt(e.target.value) || 0
                                        )
                                      }
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="minStockLevel"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Low Stock Alert</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      placeholder="5"
                                      {...field}
                                      onChange={(e) =>
                                        field.onChange(
                                          parseInt(e.target.value) || undefined
                                        )
                                      }
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Alert when stock falls below this level
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name="allowBackorders"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">
                                    Allow Backorders
                                  </FormLabel>
                                  <FormDescription>
                                    Allow customers to order when out of stock
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </>
                      )}

                      <FormField
                        control={form.control}
                        name="sku"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>SKU (Stock Keeping Unit)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., TSH-001-RED-L"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Unique identifier for inventory tracking
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* SEO */}
                <TabsContent value="seo" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Search Engine Optimization</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>URL Slug</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="product-url-slug"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  setManualSlug(true); // Disable auto-generation when manually edited
                                }}
                              />
                            </FormControl>
                            <FormDescription>
                              URL-friendly version of the product name (auto-generated)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="metaTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Meta Title</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="SEO title for search engines"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  setManualMetaTitle(true); // Disable auto-generation when manually edited
                                }}
                              />
                            </FormControl>
                            <FormDescription>
                              {field.value?.length || 0}/60 characters (auto-generated from product name)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="metaDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Meta Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Brief description for search engine results"
                                rows={3}
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  setManualMetaDescription(true); // Disable auto-generation when manually edited
                                }}
                              />
                            </FormControl>
                            <FormDescription>
                              {field.value?.length || 0}/160 characters (auto-generated from product details)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Product Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Featured */}
              {/* <Card>
                <CardHeader>
                  <CardTitle>Product Visibility</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="featured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Featured Product
                          </FormLabel>
                          <FormDescription>
                            Show this product in featured sections
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card> */}

              {/* Category */}
              <Card>
                <CardHeader>
                  <CardTitle>Organization</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(parseInt(value))
                          }
                          value={field.value?.toString()}
                          disabled={categoriesLoading}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={categoriesLoading ? "Loading categories..." : "Select category"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories && categories.data.length > 0 ? (
                              categories.data.map((category) => (
                                <SelectItem
                                  key={category.id}
                                  value={category.id.toString()}
                                >
                                  {category.name}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="none" disabled>
                                No categories available
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
