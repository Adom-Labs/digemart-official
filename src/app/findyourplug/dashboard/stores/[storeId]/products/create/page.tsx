'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/api/hooks/stores';
import { CreateProductForm } from '@/components/dashboard/stores/products/CreateProductForm';

interface CreateProductPageProps {
  params: {
    storeId: string;
  };
}

export default function CreateProductPage({ params }: CreateProductPageProps) {
  const router = useRouter();
  const storeId = parseInt(params.storeId);

  const { data: store, isLoading, error } = useStore(storeId);

  if (isNaN(storeId)) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Store ID</h1>
          <p className="text-gray-600 mb-4">The store ID provided is not valid.</p>
          <Button onClick={() => router.push('/findyourplug/dashboard/stores')}>
            Back to Stores
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Store Not Found</h1>
          <p className="text-gray-600 mb-4">
            The store you&apos;`re looking for doesn&apos;`t exist or you don&apos;`t have access to it.
          </p>
          <Button onClick={() => router.push('/findyourplug/dashboard/stores')}>
            Back to Stores
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/findyourplug/dashboard/stores/${storeId}/products`)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Create New Product</h1>
        <p className="text-gray-600 mt-2">Add a new product to {store.storeName}</p>
      </div>

      <CreateProductForm store={store} />
    </div>
  );
}
