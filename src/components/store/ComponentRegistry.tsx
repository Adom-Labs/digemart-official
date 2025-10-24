'use client';

import React, { Suspense, lazy } from 'react';
import { ComponentSkeleton } from './ComponentSkeleton';

// Lazy load components for better performance
const HERO_COMPONENTS = {
  BannerHero: lazy(() => import('./heroes/BannerHero')),
  CarouselHero: lazy(() => import('./heroes/CarouselHero')),
  VideoHero: lazy(() => import('./heroes/VideoHero')),
  MinimalHero: lazy(() => import('./heroes/MinimalHero')),
} as const;

const PRODUCT_COMPONENTS = {
  ProductGrid: lazy(() => import('./products/ProductGrid')),
  ProductCarousel: lazy(() => import('./products/ProductCarousel')),
  ProductList: lazy(() => import('./products/ProductList')),
} as const;

const CONTENT_COMPONENTS = {
  AboutSection: lazy(() => import('./sections/AboutSection')),
  TestimonialsSection: lazy(() => import('./sections/TestimonialsSection')),
  CTASection: lazy(() => import('./sections/CTASection')),
  CustomSection: lazy(() => import('./sections/CustomSection')),
} as const;

const ALL_COMPONENTS = {
  ...HERO_COMPONENTS,
  ...PRODUCT_COMPONENTS,
  ...CONTENT_COMPONENTS,
} as const;

interface ComponentRegistryProps {
  type: string;
  component: string;
  props: Record<string, any>;
}

export function ComponentRegistry({ type, component, props }: ComponentRegistryProps) {
  // Get the component from registry
  const Component = ALL_COMPONENTS[component as keyof typeof ALL_COMPONENTS];

  if (!Component) {
    console.warn(`Component "${component}" not found in registry`);
    return (
      <div className="p-8 text-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
        <p className="text-gray-600">Component "{component}" not found</p>
        <p className="text-sm text-gray-500 mt-2">
          Available components: {Object.keys(ALL_COMPONENTS).join(', ')}
        </p>
      </div>
    );
  }

  return (
    <Suspense fallback={<ComponentSkeleton type={type} />}>
      <Component {...props as any} />
    </Suspense>
  );
}

// Helper function to get available components by type
export function getAvailableComponents(type: string): string[] {
  switch (type) {
    case 'hero':
      return Object.keys(HERO_COMPONENTS);
    case 'products':
      return Object.keys(PRODUCT_COMPONENTS);
    case 'content':
      return Object.keys(CONTENT_COMPONENTS);
    default:
      return Object.keys(ALL_COMPONENTS);
  }
}