import React from 'react';

interface ProductListProps {
  title?: string;
  products: any[];
  store?: any;
}

export default function ProductList({ title = 'Products', products, store }: ProductListProps) {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">
          {title}
        </h2>
        
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <p className="text-gray-600">Product List implementation coming soon...</p>
          <div className="mt-4 text-sm text-gray-500">
            {products.length} products available
          </div>
        </div>
      </div>
    </section>
  );
}