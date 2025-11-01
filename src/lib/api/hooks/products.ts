import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import {
  productApi,
  storeProductApi,
  variantApi,
  inventoryApi,
  type Product,
  type ProductVariant,
  type ProductQuery,
  type StoreProductQuery,
  type CreateProductData,
  type UpdateProductData,
  type CreateVariantData,
  type UpdateVariantData,
  type InventoryUpdate,
  type BulkInventoryUpdate,
  type PaginatedResponse,
} from "../products";
import { QUERY_KEYS } from "../query-keys";

// Public Product Hooks
export function useProducts(params?: ProductQuery) {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, params],
    queryFn: () => productApi.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useFeaturedProducts(limit?: number, storeId?: number) {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, "featured", { limit, storeId }],
    queryFn: () => productApi.getFeatured(limit, storeId),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useProductsByStore(storeId: number, params?: ProductQuery) {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, "store", storeId, params],
    queryFn: () => productApi.getByStore(storeId, params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, id],
    queryFn: () => productApi.getById(id),
    staleTime: 5 * 60 * 1000,
  });
}

// Store Product Management Hooks
export function useStoreProducts(storeId: number, params?: StoreProductQuery) {
  return useQuery({
    queryKey: [QUERY_KEYS.STORE_PRODUCTS, storeId, params],
    queryFn: () => storeProductApi.getAll(storeId, params),
    staleTime: 2 * 60 * 1000, // 2 minutes for management data
  });
}

export function useStoreProduct(storeId: number, productId: number) {
  return useQuery({
    queryKey: [QUERY_KEYS.STORE_PRODUCTS, storeId, productId],
    queryFn: () => storeProductApi.getById(storeId, productId),
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateProduct(storeId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductData) =>
      storeProductApi.create(storeId, data),
    onSuccess: (newProduct) => {
      // Invalidate store products list
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.STORE_PRODUCTS, storeId],
      });

      // Add to cache
      queryClient.setQueryData(
        [QUERY_KEYS.STORE_PRODUCTS, storeId, newProduct.id],
        newProduct
      );

      toast.success("Product created successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create product");
    },
  });
}

export function useUpdateProduct(storeId: number, productId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProductData) =>
      storeProductApi.update(storeId, productId, data),
    onSuccess: (updatedProduct) => {
      // Update cache
      queryClient.setQueryData(
        [QUERY_KEYS.STORE_PRODUCTS, storeId, productId],
        updatedProduct
      );

      // Invalidate lists
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.STORE_PRODUCTS, storeId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PRODUCTS],
      });

      toast.success("Product updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update product");
    },
  });
}

export function useDeleteProduct(storeId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: number) =>
      storeProductApi.delete(storeId, productId),
    onSuccess: (_, productId) => {
      // Remove from cache
      queryClient.removeQueries({
        queryKey: [QUERY_KEYS.STORE_PRODUCTS, storeId, productId],
      });

      // Invalidate lists
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.STORE_PRODUCTS, storeId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PRODUCTS],
      });

      toast.success("Product deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete product");
    },
  });
}

export function useToggleProductStatus(storeId: number, productId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (active: boolean) =>
      storeProductApi.toggleStatus(storeId, productId, active),
    onSuccess: (updatedProduct) => {
      // Update cache
      queryClient.setQueryData(
        [QUERY_KEYS.STORE_PRODUCTS, storeId, productId],
        updatedProduct
      );

      // Invalidate lists
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.STORE_PRODUCTS, storeId],
      });

      toast.success(
        `Product ${updatedProduct.status === "active" ? "activated" : "deactivated"
        } successfully!`
      );
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update product status"
      );
    },
  });
}

export function useToggleProductFeatured(storeId: number, productId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (featured: boolean) =>
      storeProductApi.toggleFeatured(storeId, productId, featured),
    onSuccess: (updatedProduct) => {
      // Update cache
      queryClient.setQueryData(
        [QUERY_KEYS.STORE_PRODUCTS, storeId, productId],
        updatedProduct
      );

      // Invalidate lists
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.STORE_PRODUCTS, storeId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PRODUCTS, "featured"],
      });

      toast.success(
        `Product ${updatedProduct.featured ? "featured" : "unfeatured"
        } successfully!`
      );
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update featured status"
      );
    },
  });
}

// Product Variants Hooks
export function useProductVariants(productId: number, params?: any) {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCT_VARIANTS, productId, params],
    queryFn: () => variantApi.getByProduct(productId, params),
    staleTime: 2 * 60 * 1000,
  });
}

export function useProductVariant(variantId: number) {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCT_VARIANTS, variantId],
    queryFn: () => variantApi.getById(variantId),
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateVariant(productId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateVariantData) => variantApi.create(productId, data),
    onSuccess: (newVariant) => {
      // Invalidate variants list
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PRODUCT_VARIANTS, productId],
      });

      toast.success("Product variant created successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create variant");
    },
  });
}

export function useUpdateVariant(variantId: number, productId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateVariantData) => variantApi.update(variantId, data),
    onSuccess: (updatedVariant) => {
      // Update cache
      queryClient.setQueryData(
        [QUERY_KEYS.PRODUCT_VARIANTS, variantId],
        updatedVariant
      );

      // Invalidate lists
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PRODUCT_VARIANTS, productId],
      });

      toast.success("Variant updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update variant");
    },
  });
}

export function useDeleteVariant(productId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variantId: number) => variantApi.delete(variantId),
    onSuccess: (_, variantId) => {
      // Remove from cache
      queryClient.removeQueries({
        queryKey: [QUERY_KEYS.PRODUCT_VARIANTS, variantId],
      });

      // Invalidate lists
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PRODUCT_VARIANTS, productId],
      });

      toast.success("Variant deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete variant");
    },
  });
}

// Inventory Management Hooks
export function useProductInventory(productId: number) {
  return useQuery({
    queryKey: [QUERY_KEYS.INVENTORY, productId],
    queryFn: () => inventoryApi.getProduct(productId),
    staleTime: 1 * 60 * 1000, // 1 minute for inventory data
  });
}

export function useUpdateProductInventory(productId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InventoryUpdate) =>
      inventoryApi.updateProduct(productId, data),
    onSuccess: () => {
      // Invalidate inventory data
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.INVENTORY, productId],
      });

      // Invalidate product data
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PRODUCTS, productId],
      });

      toast.success("Inventory updated successfully!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update inventory"
      );
    },
  });
}

export function useUpdateVariantInventory(
  variantId: number,
  productId: number
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InventoryUpdate) =>
      inventoryApi.updateVariant(variantId, data),
    onSuccess: () => {
      // Invalidate inventory data
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.INVENTORY, productId],
      });

      // Invalidate variant data
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PRODUCT_VARIANTS, variantId],
      });

      toast.success("Variant inventory updated successfully!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update variant inventory"
      );
    },
  });
}

export function useBulkUpdateInventory(storeId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BulkInventoryUpdate) =>
      inventoryApi.bulkUpdate(storeId, data),
    onSuccess: (result) => {
      // Invalidate all inventory data for the store
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.INVENTORY],
      });

      // Invalidate store products
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.STORE_PRODUCTS, storeId],
      });

      toast.success(
        `Bulk update completed! ${result.updated} items updated, ${result.failed} failed.`
      );
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to perform bulk update"
      );
    },
  });
}

export function useLowStockAlerts(storeId: number, threshold?: number) {
  return useQuery({
    queryKey: [QUERY_KEYS.INVENTORY, "low-stock", storeId, threshold],
    queryFn: () => inventoryApi.getLowStock(storeId, threshold),
    staleTime: 2 * 60 * 1000,
  });
}

export function useInventoryMovements(productId: number, page = 1, limit = 20) {
  return useQuery({
    queryKey: [QUERY_KEYS.INVENTORY, "movements", productId, page, limit],
    queryFn: () => inventoryApi.getMovements(productId, page, limit),
    staleTime: 5 * 60 * 1000,
  });
}
