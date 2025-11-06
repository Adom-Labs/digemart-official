# Store View System

## Overview
The single store page (`/findyourplug/plugs/[slug]`) now uses a dynamic view manager that renders different UI layouts based on the store category. There are now **4 distinct view styles** that cater to different business types.

## Architecture

### Components

1. **StoreViewManager** (`/components/FindYourPlug/StoreView/StoreViewManager.tsx`)
   - Main manager component that decides which view to render
   - Checks store category against predefined lists
   - Routes to appropriate view component

2. **LargeMagazineView** (`/components/FindYourPlug/StoreView/LargeMagazineView.tsx`) ⭐ NEW
   - Editorial-style layout with hero banner and sidebar
   - **Used for**: Blog, Media, News, Art, Gallery, Photography, Design, Studio, Agency, Services, Consulting
   - **Features**:
     - Large gradient hero banner with overlay
     - Three-column stats cards (rating, awards, products)
     - Detailed "Our Story" section with prose styling
     - Photo gallery grid (2 columns + full width)
     - Featured products in 2-column grid
     - Customer reviews with avatar initials
     - Sticky sidebar with contact info, map, and store info
     - Social sharing and favorites in header

3. **ModernGridView** (`/components/FindYourPlug/StoreView/ModernGridView.tsx`)
   - Modern card-based grid layout with interactive elements
   - **Used for**: Food, Restaurant, Cafe, Retail, Clothing, Home, Beauty, Health, Fitness, Sports
   - **Features**:
     - Sticky header with share and favorite buttons
     - Two-column store header (image + details)
     - Quick info grid with icons (shipping, returns, support, payment)
     - Featured products in responsive grid
     - Location map with business hours
     - Reviews with rating breakdown and interactive list
     - Social sharing and favorites functionality

4. **AppleMinimalView** (`/components/FindYourPlug/StoreView/AppleMinimalView.tsx`)
   - Clean, minimal design inspired by Apple's aesthetic
   - **Used for**: Fashion, Electronics, Tech, Gadgets, Luxury, Jewelry, Watches
   - **Features**:
     - Large hero section with centered content
     - Minimal typography and generous whitespace
     - Clean image gallery grid
     - Rounded full-width buttons
     - Subtle animations on product hover
     - Clean reviews section with large ratings
     - Location section with icon-based information

5. **MagazineView** (`/components/FindYourPlug/StoreView/MagazineView.tsx`)
   - Rich, colorful design with more visual hierarchy
   - **Used for**: All other categories (default fallback)
   - **Features**:
     - Gradient hero banner with overlay
     - Featured product cards with tags
     - Grid-based reviews layout
     - Contact info with colored icon backgrounds
     - More visual separation between sections
     - Call-to-action cards with gradients

## Category Mapping

### Large Magazine View Categories (Priority 1)
```typescript
const LARGE_MAGAZINE_CATEGORIES = [
    "blog", "media", "news", "magazine", "publishing", "books",
    "art", "gallery", "photography",
    "design", "creative", "studio", "agency",
    "services", "professional", "consulting",
];
```

### Modern Grid View Categories (Priority 2)
```typescript
const MODERN_GRID_CATEGORIES = [
    "food", "restaurant", "cafe", "bakery", "grocery",
    "retail", "store", "shop",
    "clothing", "apparel", "accessories",
    "home", "furniture", "decor",
    "beauty", "cosmetics",
    "health", "fitness", "sports",
];
```

### Apple Minimal View Categories (Priority 3)
```typescript
const APPLE_MINIMAL_CATEGORIES = [
    "fashion", "electronics", "tech", "technology",
    "gadgets", "luxury", "jewelry", "watches",
];
```

### Magazine View (Default Fallback)
All other categories default to the Magazine view.

## Priority Order

The manager checks views in this order:
1. **LargeMagazineView** - Checked first for editorial/content-heavy businesses
2. **ModernGridView** - Checked second for retail/service categories
3. **AppleMinimalView** - Checked third for premium/tech categories  
4. **MagazineView** - Default fallback for all other categories

## Usage

The page component automatically uses the manager:

```tsx
import { StoreViewManager } from "@/components/FindYourPlug/StoreView";

export default function SingleStorePage() {
    const { data: store } = useStoreBySlug(slug);
    
    if (!store) return <LoadingOrError />;
    
    return <StoreViewManager store={store} />;
}
```

## Adding New Views

To add a new view style:

1. Create a new view component in `/components/FindYourPlug/StoreView/`
2. Import it in `StoreViewManager.tsx`
3. Add logic to determine when to use it
4. Export from `index.ts`

Example:
```tsx
// LuxuryView.tsx
export function LuxuryView({ store }: { store: StoreDiscoveryDto }) {
    // ... implementation
}

// StoreViewManager.tsx
import { LuxuryView } from "./LuxuryView";

const LUXURY_CATEGORIES = ["jewelry", "watches", "luxury"];

export function StoreViewManager({ store }: StoreViewManagerProps) {
    const useLuxury = LUXURY_CATEGORIES.some(...);
    const useAppleMinimal = APPLE_MINIMAL_CATEGORIES.some(...);
    
    if (useLuxury) return <LuxuryView store={store} />;
    if (useAppleMinimal) return <AppleMinimalView store={store} />;
    return <MagazineView store={store} />;
}
```

## Features

### Both Views Include:
- ✅ Store logo and cover photo display
- ✅ Verified and featured badges
- ✅ Rating and review count
- ✅ Store description and hero content
- ✅ Featured products section (mock data)
- ✅ Customer reviews (mock data)
- ✅ Contact information (address, phone, email)
- ✅ Business hours
- ✅ Visit Store CTA buttons
- ✅ Back navigation
- ✅ Responsive design

### Future Enhancements:
- [ ] Connect to real products API
- [ ] Connect to real reviews API
- [ ] Add image gallery lightbox
- [ ] Add social media links
- [ ] Add map integration for location
- [ ] Add store follow/favorite functionality
- [ ] Add share functionality
- [ ] Add similar stores section

## Styling Notes

### Apple Minimal View
- Font sizes: 6xl for main heading, 5xl for section titles
- Colors: Neutral grays with minimal accent colors
- Spacing: Generous padding (py-20 for sections)
- Buttons: Rounded full (rounded-full)
- Typography: Clean, minimal, large

### Magazine View
- Font sizes: 4xl-6xl for headings, varied sizing
- Colors: Gradients, colored backgrounds, rich palette
- Spacing: Moderate padding with clear sections
- Buttons: Standard rounding
- Typography: More varied, dynamic

## Data Requirements

Both views expect a `StoreDiscoveryDto` object with:
- `storeName`, `storeDescription`
- `logo`, `storeCoverPhoto`, `storeHeroImage`
- `storeCategory` (with `name` and `slug`)
- `verified`, `featured` flags
- `averageRating`, `totalRatings`
- `storeAddress`, `storeLocationCity`, `storeLocationState`
- `phone`, `email`
- `storeTimeOpen`, `storeTimeClose`, `storeWeekOpen`, `storeWeekClose`
- `storeHeroHeadline`, `storeHeroTagline`
- `subdomain`, `subdomainActive`, `storeUrl`, `storeSlug`

## Testing

To test different views:
1. Create stores with different categories
2. Navigate to `/findyourplug/plugs/[slug]`
3. Verify correct view renders based on category
4. Test all interactive elements (buttons, links)
5. Verify responsive behavior on mobile

## Notes

- Currently uses mock data for products and reviews
- Images use Next.js Image component for optimization
- All external links open in new tabs
- Both views fully responsive
- Loading and error states handled in parent page component
