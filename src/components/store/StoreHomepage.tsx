'use client';

import React from 'react';
import { StoreSubdomainData } from '@/lib/api/subdomain';
import { ComponentRegistry } from './ComponentRegistry';
import { StoreHeader } from './navigation/StoreHeader';
import { StoreFooter } from './navigation/StoreFooter';
import { useStoreData } from './StoreProvider';

interface StoreHomepageProps {
  store: StoreSubdomainData;
  products: any;
  searchParams: { [key: string]: string | string[] | undefined };
}

export function StoreHomepage({ store, products, searchParams }: StoreHomepageProps) {
  const layoutConfig = store.layoutConfig || {};
  const sections = layoutConfig.sections || [];
  const globalSettings = layoutConfig.globalSettings || {};

  // Default sections if none configured
  const defaultSections = [
    {
      id: 'hero-default',
      type: 'hero',
      component: 'BannerHero',
      props: {
        title: store.storeHeroHeadline || `Welcome to ${store.storeName}`,
        subtitle: store.storeHeroTagline || store.storeDescription || 'Discover amazing products',
        backgroundImage: store.storeHeroImage || store.storeCoverPhoto,
        ctaText: 'Shop Now',
        ctaLink: '/products',
      },
      order: 1,
      visible: true,
    },
    {
      id: 'products-default',
      type: 'products',
      component: 'ProductGrid',
      props: {
        title: 'Featured Products',
        products: products?.data || [],
        limit: 8,
        columns: 4,
      },
      order: 2,
      visible: true,
    },
  ];

  const sectionsToRender = sections.length > 0 ? sections : defaultSections;
  const sortedSections = sectionsToRender
    .filter((section: any) => section.visible)
    .sort((a: any, b: any) => a.order - b.order);

  return (
    <div className="store-homepage">
      {globalSettings.showHeader !== false && (
        <StoreHeader 
          store={store}
          headerStyle={layoutConfig.layout?.headerStyle || 'modern'}
        />
      )}
      
      <main className="store-main">
        {sortedSections.map((section: any) => (
          <ComponentRegistry
            key={section.id}
            type={section.type}
            component={section.component}
            props={{
              ...section.props,
              store,
              searchParams,
            }}
          />
        ))}
      </main>
      
      {globalSettings.showFooter !== false && (
        <StoreFooter 
          store={store}
          footerStyle={layoutConfig.layout?.footerStyle || 'detailed'}
        />
      )}
    </div>
  );
}