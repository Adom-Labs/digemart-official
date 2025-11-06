"use client";

import type { StoreDiscoveryDto } from "@/lib/api/types";
import { AppleMinimalView } from "./AppleMinimalView";
import { MagazineView } from "./MagazineView";
import { ModernGridView } from "./ModernGridView";
import { LargeMagazineView } from "./LargeMagazineView";

interface StoreViewManagerProps {
    store: StoreDiscoveryDto;
}

// Categories that should use the Apple Minimal view (premium, tech-focused)
const APPLE_MINIMAL_CATEGORIES = [
    "fashion",
    "electronics",
    "tech",
    "technology",
    "gadgets",
    "luxury",
    "jewelry",
    "watches",
];

// Categories that should use the Modern Grid view (retail, service-based)
const MODERN_GRID_CATEGORIES = [
    "food",
    "restaurant",
    "cafe",
    "bakery",
    "grocery",
    "retail",
    "store",
    "shop",
    "clothing",
    "apparel",
    "accessories",
    "home",
    "furniture",
    "decor",
    "beauty",
    "cosmetics",
    "health",
    "fitness",
    "sports",
];

// Categories that should use the Large Magazine view (editorial, content-heavy)
const LARGE_MAGAZINE_CATEGORIES = [
    "blog",
    "media",
    "news",
    "magazine",
    "publishing",
    "books",
    "art",
    "gallery",
    "photography",
    "design",
    "creative",
    "studio",
    "agency",
    "services",
    "professional",
    "consulting",
];

export function StoreViewManager({ store }: StoreViewManagerProps) {
    const storeCategoryName = store.storeCategory?.name?.toLowerCase() || "";
    const storeCategorySlug = store.storeCategory?.slug?.toLowerCase() || "";

    // Check for Large Magazine view first (editorial/content-heavy)
    const useLargeMagazine = LARGE_MAGAZINE_CATEGORIES.some((category) => {
        return (
            storeCategoryName.includes(category) ||
            storeCategorySlug.includes(category)
        );
    });

    if (useLargeMagazine) {
        return <LargeMagazineView store={store} />;
    }

    // Check for Modern Grid view (retail/service)
    const useModernGrid = MODERN_GRID_CATEGORIES.some((category) => {
        return (
            storeCategoryName.includes(category) ||
            storeCategorySlug.includes(category)
        );
    });

    if (useModernGrid) {
        return <ModernGridView store={store} />;
    }

    // Check for Apple Minimal view (premium/tech)
    const useAppleMinimal = APPLE_MINIMAL_CATEGORIES.some((category) => {
        return (
            storeCategoryName.includes(category) ||
            storeCategorySlug.includes(category)
        );
    });

    if (useAppleMinimal) {
        return <AppleMinimalView store={store} />;
    }

    // Default to Magazine view for all others
    return <MagazineView store={store} />;
}
