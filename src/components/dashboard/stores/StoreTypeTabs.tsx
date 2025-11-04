"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Building2, Store } from "lucide-react";

export type StoreTypeFilter = "all" | "EXTERNAL" | "INTERNAL";

interface StoreTypeTabsProps {
  activeTab: StoreTypeFilter;
  onTabChange: (tab: StoreTypeFilter) => void;
  counts: {
    total: number;
    ecommerce: number;
    listings: number;
  };
}

export function StoreTypeTabs({
  activeTab,
  onTabChange,
  counts,
}: StoreTypeTabsProps) {
  const showEcommerceTab = counts.ecommerce > 0;
  const showListingsTab = counts.listings > 0;

  return (
    <Tabs
      value={activeTab}
      onValueChange={(v) => onTabChange(v as StoreTypeFilter)}
    >
      <TabsList className="grid w-full grid-cols-3 lg:w-auto">
        <TabsTrigger value="all" className="flex items-center gap-2">
          <Store className="w-4 h-4" />
          <span>All</span>
          <span className="ml-1 text-xs opacity-70">({counts.total})</span>
        </TabsTrigger>

        {showEcommerceTab && (
          <TabsTrigger value="EXTERNAL" className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">E-commerce</span>
            <span className="sm:hidden">Stores</span>
            <span className="ml-1 text-xs opacity-70">
              ({counts.ecommerce})
            </span>
          </TabsTrigger>
        )}

        {showListingsTab && (
          <TabsTrigger value="INTERNAL" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            <span className="hidden sm:inline">Listings</span>
            <span className="sm:hidden">Business</span>
            <span className="ml-1 text-xs opacity-70">({counts.listings})</span>
          </TabsTrigger>
        )}
      </TabsList>
    </Tabs>
  );
}
