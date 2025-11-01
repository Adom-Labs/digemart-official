import React from 'react';
import { StoreSubdomainData } from '@/lib/api/subdomain';

interface StoreProductsPageProps {
  store: StoreSubdomainData;
  products: any;
  categories: any;
  searchParams: any;
}

export function StoreProductsPage({ store, products, categories, searchParams }: StoreProductsPageProps) {
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Products</h1>
        
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <p className="text-gray-600">Store Products Page implementation coming soon...</p>
          <div className="mt-4 text-sm text-gray-500">
            Store: {store.storeName}
          </div>
        </div>
      </div>
    </div>
  );
}