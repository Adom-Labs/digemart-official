/**
 * Server Actions for Stores Page
 * These run on the server for SEO and initial page load
 */
'use server';

import { storeApi, categoryApi } from '@/lib/api';

export async function getStoresPageData(params?: Record<string, unknown>) {
    try {
        const [storesResponse, categoriesResponse] = await Promise.all([
            storeApi.getAll({
                limit: 20,
                ...params,
            }),
            categoryApi.getAll(),
        ]);

        return {
            success: true,
            data: {
                stores: storesResponse.data || [],
                categories: categoriesResponse.data || [],
            },
        };
    } catch (error) {
        console.error('Failed to fetch stores page data:', error);
        return {
            success: false,
            data: {
                stores: [],
                categories: [],
            },
        };
    }
}

export async function searchStores(query: string, filters?: Record<string, unknown>) {
    try {
        const response = await storeApi.getAll({
            search: query,
            ...filters,
        });

        return {
            success: true,
            data: response.data || [],
        };
    } catch (error) {
        console.error('Failed to search stores:', error);
        return {
            success: false,
            data: [],
        };
    }
}