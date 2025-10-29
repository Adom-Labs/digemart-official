/**
 * Store Customer API Services
 * Following the repository pattern for store customer operations
 */

import apiClient from "./client";
import { ApiResponse } from "./types";

// Store Customer Types
export interface StoreCustomerUser {
  id: number;
  name: string;
  phone?: string;
  image?: string;
  createdAt: string;
}

export interface StoreCustomer {
  id: number;
  userId: number;
  storeId: number;
  firstOrderAt?: string;
  lastOrderAt?: string;
  totalOrders: number;
  totalSpent: number;
  preferences: Record<string, any>;
  marketingConsent: boolean;
  createdAt: string;
  updatedAt: string;
  user: StoreCustomerUser;
}

export interface StoreCustomerMetrics {
  totalCustomers: number;
  newCustomersThisMonth: number;
  repeatCustomerRate: number;
  averageOrderValue: number;
  averageCustomerValue: number;
  topSpendingCustomers: StoreCustomer[];
}

export interface StoreCustomerListResponse {
  data: StoreCustomer[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface StoreCustomerQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?:
    | "totalSpent"
    | "totalOrders"
    | "lastOrderAt"
    | "firstOrderAt"
    | "createdAt";
  sortOrder?: "asc" | "desc";
  minSpent?: number;
  minOrders?: number;
}

export interface StoreCustomerProfile {
  id: number;
  userId: number;
  storeId: number;
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lastOrderDate: string | null;
  firstOrderDate: string;
  preferences: StorePreferences;
  marketingConsent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StorePreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
  orderUpdates: boolean;
  promotionalOffers: boolean;
  preferredShippingMethod?: string;
  preferredPaymentMethod?: string;
  notes?: string;
}

// Store Customer API Services
export const storeCustomerApi = {
  /**
   * Get store customers with pagination and filtering
   */
  getStoreCustomers: async (
    storeId: number,
    query?: StoreCustomerQuery
  ): Promise<ApiResponse<StoreCustomerListResponse>> => {
    const response = await apiClient.get(`/stores/${storeId}/customers`, {
      params: query,
    });
    return response.data;
  },

  /**
   * Get store customer metrics and analytics
   */
  getStoreCustomerMetrics: async (
    storeId: number
  ): Promise<ApiResponse<StoreCustomerMetrics>> => {
    const response = await apiClient.get(
      `/stores/${storeId}/customers/metrics`
    );
    return response.data;
  },

  /**
   * Get current user's store profile
   */
  getUserStoreProfile: async (
    storeId: number
  ): Promise<ApiResponse<StoreCustomerProfile>> => {
    const response = await apiClient.get(
      `/stores/${storeId}/customers/profile`
    );
    return response.data;
  },

  /**
   * Update store-specific preferences
   */
  updateStorePreferences: async (
    storeId: number,
    preferences: Record<string, any>
  ): Promise<ApiResponse<void>> => {
    const response = await apiClient.put(
      `/stores/${storeId}/customers/preferences`,
      preferences
    );
    return response.data;
  },

  /**
   * Update marketing consent for store
   */
  updateMarketingConsent: async (
    storeId: number,
    consent: boolean
  ): Promise<ApiResponse<void>> => {
    const response = await apiClient.put(
      `/stores/${storeId}/customers/marketing-consent`,
      { consent }
    );
    return response.data;
  },

  /**
   * Get customer details by customer ID (for store owners)
   */
  getCustomerById: async (
    storeId: number,
    customerId: number
  ): Promise<ApiResponse<StoreCustomer>> => {
    const response = await apiClient.get(
      `/stores/${storeId}/customers/${customerId}`
    );
    return response.data;
  },

  /**
   * Export customer data (for store owners)
   */
  exportCustomers: async (
    storeId: number,
    query?: StoreCustomerQuery
  ): Promise<ApiResponse<{ downloadUrl: string }>> => {
    const response = await apiClient.get(
      `/stores/${storeId}/customers/export`,
      {
        params: query,
      }
    );
    return response.data;
  },
};
