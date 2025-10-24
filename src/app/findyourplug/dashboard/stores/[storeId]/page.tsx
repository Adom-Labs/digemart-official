'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StoreOverview } from '@/components/dashboard/stores/StoreOverview';

interface StoreManagementPageProps {
  params: {
    storeId: string;
  };
}

export default function StoreManagementPage({ params }: StoreManagementPageProps) {
  const router = useRouter();
  const storeId = parseInt(params.storeId);

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

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Back Navigation */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/findyourplug/dashboard/stores')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Stores
        </Button>
      </div>

      {/* Store Overview */}
      <StoreOverview storeId={storeId} />
    </div>
  );
}