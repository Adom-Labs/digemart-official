'use client';

import React from 'react';
import { StoresList } from '@/components/dashboard/stores/StoresList';
import { Store } from '@/lib/api/hooks/stores';
import { toast } from 'react-hot-toast';

export default function StoresPage() {
  const handleStoreEdit = (store: Store) => {
    // Navigate to store edit page
    window.location.href = `/findyourplug/dashboard/stores/${store.id}/settings`;
  };

  const handleStoreDelete = (store: Store) => {
    // Show confirmation dialog
    if (window.confirm(`Are you sure you want to delete "${store.storeName}"? This action cannot be undone.`)) {
      // TODO: Implement delete functionality
      toast.error('Delete functionality will be implemented soon');
    }
  };

  const handleStoreAnalytics = (store: Store) => {
    // Navigate to analytics page
    window.location.href = `/findyourplug/dashboard/stores/${store.id}/analytics`;
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <StoresList
        onStoreEdit={handleStoreEdit}
        onStoreDelete={handleStoreDelete}
        onStoreAnalytics={handleStoreAnalytics}
      />
    </div>
  );
}
