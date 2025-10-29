'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useStore } from '@/lib/api/hooks/stores';
import { BasicInfoTab } from '@/components/dashboard/stores/settings/BasicInfoTab';
import { LocationTab } from '@/components/dashboard/stores/settings/LocationTab';
import { BrandingTab } from '@/components/dashboard/stores/settings/BrandingTab';

interface StoreSettingsPageProps {
  params: {
    storeId: string;
  };
}

export default function StoreSettingsPage({ params }: StoreSettingsPageProps) {
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
          <p className="text-gray-600 mb-4">The store you&apos;`re looking for doesn&apos;`t exist or you don&apos;`t have access to it.</p>
          <Button onClick={() => router.push('/findyourplug/dashboard/stores')}>
            Back to Stores
          </Button>
        </div>
      </div>
    );
  }

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

        <div className="flex items-center gap-3">
          <Settings className="w-8 h-8 text-gray-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{store.storeName} Settings</h1>
            <p className="text-gray-600 mt-1">
              Manage your store information and configuration
            </p>
          </div>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="location">Location & Hours</TabsTrigger>
          <TabsTrigger value="subdomain">Subdomain</TabsTrigger>
          <TabsTrigger value="social">Social Links</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <BasicInfoTab store={store} />
        </TabsContent>

        <TabsContent value="branding">
          <BrandingTab store={store} />
        </TabsContent>

        <TabsContent value="location">
          <LocationTab store={store} />
        </TabsContent>

        <TabsContent value="subdomain">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Subdomain Management</h3>
            <p className="text-gray-600 mb-4">
              Subdomain management features will be available soon.
            </p>
            <p className="text-sm text-gray-500">
              Current subdomain: <strong>{store.subdomain || 'Not set'}</strong>
            </p>
          </div>
        </TabsContent>

        <TabsContent value="social">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Social Links</h3>
            <p className="text-gray-600 mb-4">
              Social media integration features will be available soon.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}