/**
 * Search API Services - Unified Search Integration
 */

import apiClient from './client';
import {
  ApiResponse,
  SearchResponseDto,
  SearchQueryParams,
  StoreDiscoveryDto,
} from './types';

// Search API Services
export const searchApi = {
  /**
   * Unified search across stores, products, and categories
   * Uses the new unified search endpoint
   */
  search: async (
    params: SearchQueryParams
  ): Promise<ApiResponse<SearchResponseDto>> => {
    const response = await apiClient.get('/search', { params });
    return response.data;
  },

  /**
   * Search only stores (legacy method for backward compatibility)
   * Now uses the unified search endpoint with entityType=store
   */
  searchStores: async (
    query: string,
    params?: Record<string, unknown>
  ): Promise<ApiResponse<StoreDiscoveryDto[]>> => {
    const searchParams: SearchQueryParams = {
      query,
      entityType: 'store',
      ...params,
    };

    const response = await apiClient.get('/search', { params: searchParams });
    return response.data;
  },

  /**
   * Search only products
   */
  searchProducts: async (
    query: string,
    params?: Record<string, unknown>
  ): Promise<ApiResponse<SearchResponseDto>> => {
    const searchParams: SearchQueryParams = {
      query,
      entityType: 'product',
      ...params,
    };

    const response = await apiClient.get('/search', { params: searchParams });
    return response.data;
  },

  /**
   * Search only categories
   */
  searchCategories: async (
    query: string,
    params?: Record<string, unknown>
  ): Promise<ApiResponse<SearchResponseDto>> => {
    const searchParams: SearchQueryParams = {
      query,
      entityType: 'category',
      ...params,
    };

    const response = await apiClient.get('/search', { params: searchParams });
    return response.data;
  },

  /**
   * Quick suggestions for autocomplete
   * Uses unified search with small limit for suggestions
   */
  suggestions: async (
    query: string,
    limit = 10
  ): Promise<ApiResponse<SearchResponseDto>> => {
    const searchParams: SearchQueryParams = {
      query,
      entityType: 'all',
      limit,
    };

    const response = await apiClient.get('/search', { params: searchParams });
    return response.data;
  },
};
