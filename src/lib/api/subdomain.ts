/**
 * Subdomain API Services
 * Handles store subdomain operations and public store data
 */

import apiClient from "./client";
import { createServerClient } from "./server-client";

export interface StoreSubdomainData {
  id: number;
  storeName: string;
  storeSlug: string;
  subdomain: string;
  customDomain?: string;
  isSubdomainActive: boolean;
  themeConfig?: Record<string, any>;
  layoutConfig?: Record<string, any>;
  seoConfig?: Record<string, any>;
  customCss?: string;
  status: string;
  verified: boolean;
  storeDescription?: string;
  logo?: string;
  storeCoverPhoto?: string;
  storeHeroHeadline?: string;
  storeHeroTagline?: string;
  storeHeroImage?: string;
  storeCategory?: {
    id: number;
    name: string;
    slug: string;
  };
  owner: {
    id: number;
    name: string;
    image?: string;
  };
  socialLinks?: Record<string, string>;
  businessHours?: Record<string, any>;
  averageRating: number;
  totalRatings: number;
  _count: {
    products: number;
    reviews: number;
  };
}

export interface SubdomainAvailability {
  available: boolean;
  subdomain: string;
  message: string;
  suggestions?: string[];
}

export const subdomainApi = {
  /**
   * Get store by subdomain (public endpoint)
   */
  getStoreBySubdomain: async (
    subdomain: string
  ): Promise<StoreSubdomainData> => {
    const response = await apiClient.get(`/stores/subdomain/${subdomain}`);
    return response.data;
  },

  /**
   * Get store by subdomain (server-side)
   */
  getStoreBySubdomainServer: async (
    subdomain: string
  ): Promise<StoreSubdomainData> => {
    const serverClient = await createServerClient();
    const response = await serverClient.get(`/stores/subdomain/${subdomain}`);
    return response.data;
  },

  /**
   * Get public store data (no authentication required)
   */
  getPublicStoreData: async (storeId: number): Promise<StoreSubdomainData> => {
    const response = await apiClient.get(`/stores/${storeId}/public-data`);
    return response.data;
  },

  /**
   * Check subdomain availability
   */
  checkSubdomainAvailability: async (
    subdomain: string
  ): Promise<SubdomainAvailability> => {
    const response = await apiClient.post(
      "/stores/check-subdomain-availability",
      {
        subdomain,
      }
    );
    return response.data;
  },

  /**
   * Update store subdomain (authenticated)
   */
  updateStoreSubdomain: async (
    storeId: number,
    subdomain: string
  ): Promise<StoreSubdomainData> => {
    const response = await apiClient.patch(`/stores/${storeId}/subdomain`, {
      subdomain,
    });
    return response.data;
  },

  /**
   * Activate or deactivate store subdomain (authenticated)
   */
  activateSubdomain: async (
    storeId: number,
    isActive: boolean
  ): Promise<StoreSubdomainData> => {
    const response = await apiClient.post(
      `/stores/${storeId}/activate-subdomain`,
      {
        isActive,
      }
    );
    return response.data;
  },
};

// Helper functions for subdomain validation
export const subdomainUtils = {
  /**
   * Validate subdomain format
   */
  validateSubdomain: (
    subdomain: string
  ): { valid: boolean; error?: string } => {
    if (!subdomain) {
      return { valid: false, error: "Subdomain is required" };
    }

    if (subdomain.length < 3) {
      return {
        valid: false,
        error: "Subdomain must be at least 3 characters long",
      };
    }

    if (subdomain.length > 63) {
      return {
        valid: false,
        error: "Subdomain must be less than 63 characters long",
      };
    }

    if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(subdomain)) {
      return {
        valid: false,
        error:
          "Subdomain can only contain lowercase letters, numbers, and hyphens. Cannot start or end with hyphen.",
      };
    }

    return { valid: true };
  },

  /**
   * Generate subdomain from store name
   */
  generateSubdomainFromName: (storeName: string): string => {
    return storeName
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
  },

  /**
   * Get full subdomain URL
   */
  getSubdomainUrl: (subdomain: string, customDomain?: string): string => {
    if (customDomain) {
      return `https://${customDomain}`;
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://digemart.com";
    const domain = new URL(baseUrl).hostname;
    return `https://${subdomain}.${domain}`;
  },
};
