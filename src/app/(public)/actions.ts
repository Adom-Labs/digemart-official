/**
 * Server Actions for Main Landing Page
 * These run on the server for SEO and initial page load
 */
'use server';

import { landingPageApi } from '@/lib/api';

export async function getMainLandingPageData() {
    try {
        const response = await landingPageApi.getMainLandingPage();
        return response;
    } catch (error) {
        console.error('Failed to fetch main landing page data:', error);
        return {
            success: false,
            data: {
                stores: [],
                vendors: [],
            },
        };
    }
}
