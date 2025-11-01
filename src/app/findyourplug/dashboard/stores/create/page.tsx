'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CreateStoreWizard } from '@/components/dashboard/stores/CreateStoreWizard';

export default function CreateStorePage() {
  const router = useRouter();

  const handleStoreCreated = (storeId: number) => {
    // Navigate to the newly created store's management page
    router.push(`/findyourplug/dashboard/stores/${storeId}`);
  };

  const handleCancel = () => {
    // Navigate back to stores list
    router.push('/findyourplug/dashboard/stores');
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Stores
          </Button>
        </div>
        
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Store</h1>
          <p className="text-gray-600 mt-2">
            Set up your online store in just a few simple steps
          </p>
        </div>
      </div>

      {/* Wizard */}
      <CreateStoreWizard
        onComplete={handleStoreCreated}
        onCancel={handleCancel}
      />
    </div>
  );
}