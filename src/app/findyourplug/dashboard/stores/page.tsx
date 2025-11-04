"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUserStores, useStoreTypeStats } from "@/lib/api/hooks/stores";
import {
  StoreTypeTabs,
  StoreTypeFilter,
} from "@/components/dashboard/stores/StoreTypeTabs";
import { StoreCard } from "@/components/dashboard/stores/StoreCard";
import { EmptyStoreState } from "@/components/dashboard/stores/EmptyStoreState";

export default function MyStoresPage() {
  const router = useRouter();
  const { data: stores, isLoading, error } = useUserStores();
  const stats = useStoreTypeStats();
  const [activeTab, setActiveTab] = useState<StoreTypeFilter>("all");

  // Filter stores based on active tab
  const filteredStores = useMemo(() => {
    if (!stores) return [];
    if (activeTab === "all") return stores;
    return stores.filter((store) => store.storeType === activeTab);
  }, [stores, activeTab]);

  // Auto-select tab if user has only one type
  useEffect(() => {
    if (stats.ecommerce > 0 && stats.listings === 0 && activeTab === "all") {
      setActiveTab("EXTERNAL");
    } else if (
      stats.listings > 0 &&
      stats.ecommerce === 0 &&
      activeTab === "all"
    ) {
      setActiveTab("INTERNAL");
    }
  }, [stats, activeTab]);

  const handleCreateNew = () => {
    router.push("/findyourplug/dashboard/new-listing");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <h3 className="text-red-800 dark:text-red-200 font-semibold mb-2">
          Failed to load stores
        </h3>
        <p className="text-red-600 dark:text-red-300 text-sm">
          {error instanceof Error
            ? error.message
            : "An unexpected error occurred"}
        </p>
      </div>
    );
  }

  const showTypeBadge = activeTab === "all";
  const hasStores = stores && stores.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Stores</h1>
          <p className="text-muted-foreground mt-1">
            Manage your e-commerce stores and business listings
          </p>
        </div>
        <Button onClick={handleCreateNew} size="lg">
          <Plus className="w-4 h-4 mr-2" />
          New Store
        </Button>
      </div>

      {/* Tabs - Only show if user has stores */}
      {hasStores && (
        <StoreTypeTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          counts={stats}
        />
      )}

      {/* Store Grid or Empty State */}
      {filteredStores.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStores.map((store) => (
            <StoreCard
              key={store.id}
              store={store}
              showTypeBadge={showTypeBadge}
            />
          ))}
        </div>
      ) : (
        <EmptyStoreState type={activeTab} />
      )}
    </div>
  );
}
