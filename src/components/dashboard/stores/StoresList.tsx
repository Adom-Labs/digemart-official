"use client";

import React, { useState } from "react";
import { Plus, Search, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { StoreCard } from "./StoreCard";
import { useMyStores, Store } from "@/lib/api/hooks/stores";
import Link from "next/link";

interface StoresListProps {
  onStoreEdit?: (store: Store) => void;
  onStoreDelete?: (store: Store) => void;
  onStoreAnalytics?: (store: Store) => void;
}

export function StoresList({ }: StoresListProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [storeType, setStoreType] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");

  // Build query parameters
  const queryParams = {
    search: searchQuery || undefined,
    storeType:
      storeType !== "all" ? (storeType as "INTERNAL" | "EXTERNAL") : undefined,
    status:
      status !== "all"
        ? (status as "ACTIVE" | "PENDING" | "SUSPENDED")
        : undefined,
    sortBy: sortBy === "recent" ? "createdAt" : sortBy,
    sortOrder: "desc" as const,
  };

  const { data: stores = [], isLoading, error } = useMyStores(queryParams);

  console.log(stores);

  // Calculate statistics
  const stats = {
    total: stores.length,
    active: stores.filter((s) => s.status === "ACTIVE").length,
    internal: stores.filter((s) => s.storeType === "INTERNAL").length,
    external: stores.filter((s) => s.storeType === "EXTERNAL").length,
    totalViews: stores.reduce((sum, s) => sum + s.views, 0),
    totalLikes: stores.reduce((sum, s) => sum + s.likes, 0),
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <p>Failed to load stores. Please try again.</p>
        </div>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Stores</h1>
          <p className="text-gray-600">
            Manage your {stats.total} store{stats.total !== 1 ? "s" : ""}
          </p>
        </div>
        <Button asChild>
          <Link href="/findyourplug/dashboard/stores/create">
            <Plus className="w-4 h-4 mr-2" />
            Create Store
          </Link>
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Stores</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {stats.active}
            </div>
            <div className="text-sm text-gray-600">Active</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {stats.internal}
            </div>
            <div className="text-sm text-gray-600">Internal</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">
              {stats.external}
            </div>
            <div className="text-sm text-gray-600">External</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-indigo-600">
              {stats.totalViews.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Views</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-pink-600">
              {stats.totalLikes.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Likes</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search stores..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={storeType} onValueChange={setStoreType}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Store Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="INTERNAL">Internal</SelectItem>
              <SelectItem value="EXTERNAL">External</SelectItem>
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="SUSPENDED">Suspended</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="storeName">Name A-Z</SelectItem>
              <SelectItem value="views">Most Views</SelectItem>
              <SelectItem value="averageRating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>

          {/* View Mode Toggle */}
          <Tabs
            value={viewMode}
            onValueChange={(v) => setViewMode(v as "grid" | "list")}
          >
            <TabsList>
              <TabsTrigger value="grid">
                <Grid className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="list">
                <List className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Stores Grid/List */}
      {stores.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Plus className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No stores found
          </h3>
          <p className="text-gray-600 mb-4">
            {searchQuery || storeType !== "all" || status !== "all"
              ? "Try adjusting your filters to see more results."
              : "Get started by creating your first store."}
          </p>
          <Button asChild>
            <Link href="/findyourplug/dashboard/stores/create">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Store
            </Link>
          </Button>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {stores.map((store) => (
            <StoreCard
              key={store.id}
              store={store}
            />
          ))}
        </div>
      )}

      {/* Results Info */}
      {stores.length > 0 && (
        <div className="text-center text-sm text-gray-600">
          Showing {stores.length} store{stores.length !== 1 ? "s" : ""}
          {(searchQuery || storeType !== "all" || status !== "all") &&
            " matching your filters"}
        </div>
      )}
    </div>
  );
}
