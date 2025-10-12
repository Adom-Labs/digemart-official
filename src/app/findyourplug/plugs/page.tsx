'use client';

import { Suspense, useState } from 'react';
import { Metadata } from 'next';
import { useStores, useCategories, StoreDiscoveryDto, CategoryResponseDto } from '@/lib/api';
import StoresClientPage from './StoresClientPage';
import { getStoresPageData } from './actions';
import Loader from '@/components/Loader';
import StoreGrid from '@/components/StoreGrid';
import WrapContent from '@/components/WrapContent';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, Grid, List } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Discover Amazing Stores | Digemart',
  description: 'Find the perfect products from verified stores and trusted vendors. Browse through our collection of top-rated stores and discover unique products.',
  keywords: 'online stores, shopping, vendors, marketplace, products',
};

interface SearchParams {
  search?: string;
  category?: string;
  sortBy?: string;
}

export default async function StoresPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // Fetch initial data server-side for SEO
  const initialData = await getStoresPageData({
    ...(searchParams.search && { search: searchParams.search }),
    ...(searchParams.category && { categoryId: searchParams.category }),
    ...(searchParams.sortBy && { sortBy: searchParams.sortBy }),
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<string>('featured');

  // Build query parameters
  const queryParams = {
    ...(searchQuery && { search: searchQuery }),
    ...(selectedCategory && { categoryId: selectedCategory }),
    ...(sortBy && { sortBy }),
    limit: 20,
  };

  // Fetch data using the established API hooks
  const { data: stores, isLoading: storesLoading, error: storesError } = useStores(queryParams);
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  if (storesLoading && !stores) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (storesError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600">Failed to load stores. Please try again later.</p>
        </div>
      </div>
    );
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The search will automatically trigger via the useStores hook
  };

  return (
    <Suspense fallback={<Loader />}>
      <StoresClientPage 
        initialStores={initialData.data.stores} 
        initialCategories={initialData.data.categories}
        searchParams={searchParams}
      />
      <main className="min-h-screen bg-gray-50 pt-24">
        <WrapContent>
          {/* Header Section */}
          <div className="py-8 md:py-12">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Discover Amazing Stores
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Find the perfect products from verified stores and trusted vendors in your area
              </p>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm border space-y-4">
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Search stores, products, or categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button type="submit" className="px-6">
                  Search
                </Button>
              </form>

              {/* Filters Row */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-3 flex-1">
                  {/* Category Filter */}
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm min-w-[150px]"
                    disabled={categoriesLoading}
                  >
                    <option value="">All Categories</option>
                    {categories?.map((category: CategoryResponseDto) => (
                      <option key={category.id} value={category.id.toString()}>
                        {category.name} ({category.storeCount})
                      </option>
                    ))}
                  </select>

                  {/* Sort Filter */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm min-w-[150px]"
                  >
                    <option value="featured">Featured</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Newest First</option>
                    <option value="name">Name A-Z</option>
                  </select>
                </div>

                {/* View Mode Toggle */}
                <div className="flex gap-1 bg-gray-100 rounded-md p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="px-3 py-1.5"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="px-3 py-1.5"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="pb-12">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {searchQuery ? `Search Results for "${searchQuery}"` : 'All Stores'}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {stores ? `${stores.length} stores found` : 'Loading...'}
                </p>
              </div>
            </div>

            {/* Loading State */}
            {storesLoading && (
              <div className="flex justify-center py-12">
                <Loader />
              </div>
            )}

            {/* Empty State */}
            {!storesLoading && (!stores || stores.length === 0) && (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <div className="mb-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Filter className="h-8 w-8 text-gray-400" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No stores found</h3>
                  <p className="text-gray-600 mb-4">
                    {searchQuery || selectedCategory
                      ? 'Try adjusting your search criteria or filters'
                      : 'No stores are currently available'}
                  </p>
                  {(searchQuery || selectedCategory) && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('');
                      }}
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Stores Grid */}
            {!storesLoading && stores && stores.length > 0 && (
              <StoreGrid
                stores={stores}
                showViewAllButton={false}
                className="pt-0"
                showTags="both"
              />
            )}
          </div>
        </WrapContent>
      </main>
    </Suspense>
  );
}