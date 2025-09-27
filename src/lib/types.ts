export interface StoreCategory {
  name: string;
  id: number;
  description: string;
}

export enum StoreType {
  EXTERNAL = "EXTERNAL",
  INTERNAL = "INTERNAL",
}

export interface FeaturedStore {
  id: number;
  storeAddress: string;
  storeName: string;
  storeUrl: string;
  logo: string;
  verified: boolean;
  featured: boolean;
  averageRating: number;
  totalRatings: number;
  storeCategory: StoreCategory;
  storeType: StoreType;
}

export interface FeaturedVendor {
  image: string;
  name: string;
  stores: Array<{
    storeUrl: string;
    storeName: string;
    storeAddress: string;
    storeDescription: string;
    storeType: StoreType;
    storeCategory: {
      name: string;
      id: string;
    };
  }>;
  twitter?: string;
  facebook?: string;
  whatsapp?: string;
}

export interface FeaturedData {
  stores: FeaturedStore[];
  vendors: FeaturedVendor[];
}
