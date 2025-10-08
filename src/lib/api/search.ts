/**
 * Search API Services
 */

import apiClient from './client';
import { ApiResponse, StoreDiscoveryDto } from './types';

export interface SearchQueryParams {
    query: string;
    entityType?: 'all' | 'store' | 'product' | 'category';
    location?: string;
    limit?: number;
}

export interface SearchResult {
    id: string;
    name: string;
    category: string;
    rating: number;
    reviewCount: number;
    verified: boolean;
    image?: string;
    type: 'store' | 'product' | 'category';
    url?: string;
    price?: string;
}

export interface SearchResponseDto {
    results: SearchResult[];
    total: number;
    query: string;
}

// Search API Services
export const searchApi = {
    /**
     * Search across stores, products, and categories
     */
    search: async (params: SearchQueryParams): Promise<ApiResponse<SearchResponseDto>> => {
        const response = await apiClient.get('/search', { params });
        return response.data;
    },

    /**
     * Search only stores
     */
    searchStores: async (query: string, params?: Record<string, unknown>): Promise<ApiResponse<StoreDiscoveryDto[]>> => {
        const response = await apiClient.get('/stores', {
            params: { search: query, ...params },
        });
        return response.data;
    },

    /**
     * Quick suggestions for autocomplete
     */
    suggestions: async (query: string): Promise<ApiResponse<SearchResult[]>> => {
        const response = await apiClient.get('/search/suggestions', {
            params: { q: query, limit: 10 },
        });
        return response.data;
    },
};
