import apiClient from "./client";
import { createServerClient } from "./server-client";

// Types
export interface Product {
  id: number;
  name: string;
  description?: string;
  features?: string;
  price: number;
  compareAtPrice?: number;
  inventory: number;
  minStockLevel?: number;
  featured: boolean;
  sku?: string;
  slug?: string;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  status: "draft" | "active" | "inactive" | "archived";
  trackInventory: boolean;
  allowBackorders: boolean;
  metaTitle?: string;
  metaDescription?: string;
  archived: boolean;
  averageRating: number;
  totalRatings: number;
  views: number;
  createdAt: string;
  updatedAt: string;
  storeId: number;
  categoryId?: number;
  parentProductId?: number;

  // Relations
  store?: {
    id: number;
    storeName: string;
    storeSlug: string;
    verified?: boolean;
  };
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  images?: ProductImage[];
  variants?: ProductVariant[];
  tags?: Tag[];
}

export interface ProductVariant {
  id: number;
  name: string;
  sku?: string;
  price?: number;
  compareAtPrice?: number;
  inventory: number;
  minStockLevel?: number;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  isActive: boolean;
  trackInventory: boolean;
  allowBackorders: boolean;
  barcode?: string;
  taxCode?: string;
  displayOrder: number;
  archived: boolean;
  attributes: Record<string, any>;
  productId: number;
  createdAt: string;
  updatedAt: string;

  // Relations
  images?: ProductImage[];
}

export interface ProductImage {
  id: number;
  url: string;
  altText?: string;
  order: number;
  isPrimary: boolean;
  fileSize?: number;
  mimeType?: string;
  originalName?: string;
  productId?: number;
  variantId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductQuery {
  page?: number;
  limit?: number;
  search?: string;
  storeId?: number;
  categoryId?: number;
  featured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?:
  | "name"
  | "price"
  | "createdAt"
  | "updatedAt"
  | "averageRating"
  | "views";
  sortOrder?: "asc" | "desc";
}

export interface StoreProductQuery {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: number;
  status?: "draft" | "active" | "inactive" | "archived";
  featured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  minInventory?: number;
  lowStock?: boolean;
  outOfStock?: boolean;
  tags?: string;
  sortBy?:
  | "name"
  | "price"
  | "inventory"
  | "views"
  | "rating"
  | "sales"
  | "createdAt"
  | "updatedAt";
  sortOrder?: "asc" | "desc";
  includeArchived?: boolean;
  dateFrom?: string;
  dateTo?: string;
}

export interface CreateProductData {
  name: string;
  description?: string;
  features?: string;
  price: number;
  compareAtPrice?: number;
  inventory?: number;
  minStockLevel?: number;
  featured?: boolean;
  sku?: string;
  slug?: string;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  status?: "draft" | "active" | "inactive";
  trackInventory?: boolean;
  allowBackorders?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  categoryId?: number;
  parentProductId?: number;
  tags?: string[];
  metadata?: Record<string, any>;
  images?: Array<{
    url: string;
    altText?: string;
    order?: number;
    isPrimary?: boolean;
    fileSize?: number;
    mimeType?: string;
    originalName?: string;
  }>;
}

export interface UpdateProductData extends Partial<CreateProductData> { }

export interface CreateVariantData {
  name: string;
  sku?: string;
  price?: number;
  compareAtPrice?: number;
  inventory: number;
  minStockLevel?: number;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  isActive?: boolean;
  trackInventory?: boolean;
  allowBackorders?: boolean;
  barcode?: string;
  taxCode?: string;
  displayOrder?: number;
  attributes?: Record<string, any>;
  images?: string[];
}

export interface UpdateVariantData extends Partial<CreateVariantData> { }

export interface InventoryUpdate {
  quantity: number;
  movementType: "adjustment" | "sale" | "restock" | "return" | "damage";
  reason?: string;
  reference?: string;
  unitCost?: number;
}

export interface BulkInventoryUpdate {
  items: Array<{
    productId?: number;
    variantId?: number;
    sku?: string;
    quantity: number;
    movementType: "adjustment" | "sale" | "restock" | "return" | "damage";
    reason?: string;
    reference?: string;
    unitCost?: number;
  }>;
  globalReason?: string;
  globalReference?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Public Product APIs
export const productApi = {
  // Get all products (public)
  getAll: async (
    params?: ProductQuery
  ): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get("/products", { params });
    return response.data;
  },

  // Get featured products (public)
  getFeatured: async (limit?: number, storeId?: number): Promise<Product[]> => {
    const response = await apiClient.get("/products/featured", {
      params: { limit, storeId },
    });
    return response.data;
  },

  // Get products by store (public)
  getByStore: async (
    storeId: number,
    params?: ProductQuery
  ): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get(`/products/store/${storeId}`, {
      params,
    });
    return response.data;
  },

  // Get single product (public)
  getById: async (id: number): Promise<Product> => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },
};

// Store Product Management APIs
export const storeProductApi = {
  // Create product
  create: async (
    storeId: number,
    data: CreateProductData
  ): Promise<Product> => {
    const response = await apiClient.post(`/stores/${storeId}/products`, data);
    return response.data;
  },

  // Get store products
  getAll: async (
    storeId: number,
    params?: StoreProductQuery
  ): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get(`/stores/${storeId}/products`, {
      params,
    });
    return response.data;
  },

  // Get single store product
  getById: async (storeId: number, productId: number): Promise<Product> => {
    const response = await apiClient.get(
      `/stores/${storeId}/products/${productId}`
    );
    return response.data;
  },

  // Update product
  update: async (
    storeId: number,
    productId: number,
    data: UpdateProductData
  ): Promise<Product> => {
    const response = await apiClient.patch(
      `/stores/${storeId}/products/${productId}`,
      data
    );
    return response.data;
  },

  // Delete product
  delete: async (
    storeId: number,
    productId: number
  ): Promise<{ message: string }> => {
    const response = await apiClient.delete(
      `/stores/${storeId}/products/${productId}`
    );
    return response.data;
  },

  // Toggle product status
  toggleStatus: async (
    storeId: number,
    productId: number,
    active: boolean
  ): Promise<Product> => {
    const response = await apiClient.patch(
      `/stores/${storeId}/products/${productId}/status`,
      { active }
    );
    return response.data;
  },

  // Toggle featured status
  toggleFeatured: async (
    storeId: number,
    productId: number,
    featured: boolean
  ): Promise<Product> => {
    const response = await apiClient.patch(
      `/stores/${storeId}/products/${productId}/featured`,
      { featured }
    );
    return response.data;
  },
};

// Product Variants APIs
export const variantApi = {
  // Create variant
  create: async (
    productId: number,
    data: CreateVariantData
  ): Promise<ProductVariant> => {
    const response = await apiClient.post(
      `/products/${productId}/variants`,
      data
    );
    return response.data;
  },

  // Get product variants
  getByProduct: async (
    productId: number,
    params?: {
      page?: number;
      limit?: number;
      search?: string;
      isActive?: boolean;
      trackInventory?: boolean;
      allowBackorders?: boolean;
      minPrice?: number;
      maxPrice?: number;
      minInventory?: number;
      maxInventory?: number;
      lowStock?: boolean;
      outOfStock?: boolean;
      attributes?: string[];
      sortBy?:
      | "name"
      | "price"
      | "inventory"
      | "createdAt"
      | "updatedAt"
      | "displayOrder";
      sortOrder?: "asc" | "desc";
      includeArchived?: boolean;
      skuPattern?: string;
      barcode?: string;
    }
  ): Promise<PaginatedResponse<ProductVariant>> => {
    const response = await apiClient.get(`/products/${productId}/variants`, {
      params,
    });
    return response.data;
  },

  // Get single variant
  getById: async (variantId: number): Promise<ProductVariant> => {
    const response = await apiClient.get(`/variants/${variantId}`);
    return response.data;
  },

  // Update variant
  update: async (
    variantId: number,
    data: UpdateVariantData
  ): Promise<ProductVariant> => {
    const response = await apiClient.put(`/variants/${variantId}`, data);
    return response.data;
  },

  // Delete variant
  delete: async (variantId: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/variants/${variantId}`);
    return response.data;
  },
};

// Inventory Management APIs
export const inventoryApi = {
  // Get product inventory
  getProduct: async (productId: number) => {
    const response = await apiClient.get(`/products/${productId}/inventory`);
    return response.data;
  },

  // Update product inventory
  updateProduct: async (productId: number, data: InventoryUpdate) => {
    const response = await apiClient.put(
      `/products/${productId}/inventory`,
      data
    );
    return response.data;
  },

  // Update variant inventory
  updateVariant: async (variantId: number, data: InventoryUpdate) => {
    const response = await apiClient.put(
      `/variants/${variantId}/inventory`,
      data
    );
    return response.data;
  },

  // Bulk update inventory
  bulkUpdate: async (storeId: number, data: BulkInventoryUpdate) => {
    const response = await apiClient.post(
      `/stores/${storeId}/inventory/bulk-update`,
      data
    );
    return response.data;
  },

  // Get low stock alerts
  getLowStock: async (storeId: number, threshold?: number) => {
    const response = await apiClient.get(
      `/stores/${storeId}/inventory/low-stock`,
      {
        params: { threshold },
      }
    );
    return response.data;
  },

  // Get inventory movements
  getMovements: async (productId: number, page = 1, limit = 20) => {
    const response = await apiClient.get(
      `/products/${productId}/inventory/movements`,
      {
        params: { page, limit },
      }
    );
    return response.data;
  },
};

// Server-side APIs (for SSR/SSG)
export const serverProductApi = {
  getAll: async (
    params?: ProductQuery
  ): Promise<PaginatedResponse<Product>> => {
    const serverClient = await createServerClient();
    const response = await serverClient.get("/products", { params });
    return response.data;
  },

  getFeatured: async (limit?: number, storeId?: number): Promise<Product[]> => {
    const serverClient = await createServerClient();

    const response = await serverClient.get("/products/featured", {
      params: { limit, storeId },
    });
    return response.data;
  },

  getByStore: async (
    storeId: number,
    params?: ProductQuery
  ): Promise<PaginatedResponse<Product>> => {
    const serverClient = await createServerClient();

    const response = await serverClient.get(`/products/store/${storeId}`, {
      params,
    });
    return response.data;
  },

  getById: async (id: number): Promise<Product> => {
    const serverClient = await createServerClient();

    const response = await serverClient.get(`/products/${id}`);
    return response.data;
  },
};
