export interface ProductImage {
    id: number;
    url: string;
    altText?: string;
    position: number;
}

export interface ProductCategory {
    id: number;
    name: string;
    slug: string;
}

export interface ProductDimensions {
    length: number;
    width: number;
    height: number;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    features?: string;
    price: number;
    inventory: number;
    featured: boolean;
    sku: string | null;
    weight: number | null;
    dimensions: ProductDimensions | null;
    averageRating: number;
    totalRatings: number;
    views: number;
    status: "active" | "inactive" | "draft" | "archived";
    metaTitle: string | null;
    metaDescription: string | null;
    slug: string;
    minStockLevel: number | null;
    trackInventory: boolean;
    storeId: number;
    category: ProductCategory | null;
    images: ProductImage[];
    createdAt: string;
    updatedAt: string;
    salesCount: number;
    revenue: number;
}

export interface ProductFormData {
    name: string;
    description: string;
    price: number;
    inventory: number;
    sku?: string;
    weight?: number;
    dimensions?: {
        length?: number;
        width?: number;
        height?: number;
    };
    featured: boolean;
    status: "active" | "inactive" | "draft" | "archived";
    categoryId?: number;
    minStockLevel?: number;
    metaTitle?: string;
    metaDescription?: string;
}

export interface ProductStats {
    totalViews: number;
    viewsTrend: number;
    totalSales: number;
    salesTrend: number;
    conversionRate: number;
    conversionTrend: number;
    revenue: number;
    revenueTrend: number;
}
