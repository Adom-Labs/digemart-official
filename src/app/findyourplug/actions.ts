/**
 * Server Actions for Find Your Plug Page
 * These run on the server for SEO and initial page load
 */
'use server';

import { landingPageApi } from '@/lib/api';

export async function getPlugsLandingPageData() {
    try {
        const response = await landingPageApi.getPlugsLandingPage();
        return response;
    } catch (error) {
        console.error('Failed to fetch plugs landing page data:', error);
        return {
            success: false,
            data: {
                categories: [],
                featuredStores: [],
                recentReviews: [],
            },
        };
    }
}
