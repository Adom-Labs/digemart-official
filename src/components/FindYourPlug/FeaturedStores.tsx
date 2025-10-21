'use client';

import StoreGrid from '@/components/StoreGrid';
import { Store } from '@/lib/api/types';
import WrapContent from '@/components/WrapContent';

export default function FeaturedStores({ stores }: { stores: Store[] | undefined }) {
    if (!stores) return null;

    return (
        <WrapContent>
            <StoreGrid
                stores={stores}
                title="Featured Stores"
                subtitle="Discover our top-rated and trusted stores"
                showViewAllButton={true}
                viewAllUrl="/findyourplug/plugs"
                showTags={'none'}
            />
        </WrapContent>
    );
}
