/**
 * Landing Page API Services
 * Specific services for landing page data
 * Can be used both client-side and server-side (server actions)
 */

import apiClient from './client';
import { ApiResponse, StoreDiscoveryDto, TopVendorDto, CategoryResponseDto, ReviewResponseDto } from './types';

// Main Landing Page Response Types
export interface MainLandingPageData {
  stores: StoreDiscoveryDto[];
  vendors: TopVendorDto[];
}

export interface PlugsLandingPageData {
  categories: CategoryResponseDto[];
  featuredStores: StoreDiscoveryDto[];
  recentReviews: ReviewResponseDto[];
}

// Landing Page API Services
export const landingPageApi = {
  getMainLandingPage: async (
    params?: Record<string, unknown>
  ): Promise<ApiResponse<MainLandingPageData>> => {
    const response = await apiClient.get('/landing-page/main', { params });
    return response.data;
  },

  getPlugsLandingPage: async (
    params?: Record<string, unknown>
  ): Promise<ApiResponse<PlugsLandingPageData>> => {
    const response = await apiClient.get('/landing-page', { params });
    return response.data;
  },
};
