'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Layout, Eye, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/api/hooks/stores';
import { StoreLayoutBuilder } from '@/components/dashboard/stores/layout/StoreLayoutBuilder';

interface StoreLayoutPageProps {
  params: {
    storeId: string;
  };
}

export default function StoreLayoutPage({ params }: StoreLayoutPageProps) {
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
          <div className="h-96 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Store Not Found</h1>
          <p className="text-gray-600 mb-4">The store you're looking for doesn't exist or you don't have access to it.</p>
          <Button onClick={() => router.push('/findyourplug/dashboard/stores')}>
            Back to Stores
          </Button>
        </div>
      </div>
    );
  }

  const storeUrl = store.subdomain 
    ? `${window.location.protocol}//${store.subdomain}.${window.location.host.split('.').slice(-2).join('.')}`
    : store.storeUrl;

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/findyourplug/dashboard/stores/${storeId}`)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Store
          </Button>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Layout className="w-8 h-8 text-gray-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Store Layout Builder</h1>
              <p className="text-gray-600 mt-1">
                Design the layout and sections for {store.storeName}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {storeUrl && (
              <Button variant="outline" asChild>
                <a href={storeUrl} target="_blank" rel="noopener noreferrer">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview Store
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Layout Builder */}
      <StoreLayoutBuilder store={store} />
    </div>
  );
}