import React from 'react';

export function StorePageSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Skeleton */}
      <div className="animate-pulse border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="h-8 w-32 bg-gray-200 rounded"></div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-8 w-20 bg-gray-200 rounded"></div>
              <div className="h-8 w-20 bg-gray-200 rounded"></div>
              <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Skeleton */}
      <div className="animate-pulse">
        <div className="h-96 bg-gray-200"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="h-12 w-96 bg-gray-300 rounded mx-auto"></div>
            <div className="h-6 w-64 bg-gray-300 rounded mx-auto"></div>
            <div className="h-12 w-32 bg-gray-300 rounded mx-auto"></div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-12">
          {/* Section Title */}
          <div className="text-center">
            <div className="h-8 w-64 bg-gray-200 rounded mx-auto mb-4"></div>
            <div className="h-4 w-96 bg-gray-200 rounded mx-auto"></div>
          </div>

          {/* Product Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="h-48 bg-gray-200 rounded-lg"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Another Section */}
          <div className="space-y-6">
            <div className="h-8 w-48 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-6 border rounded-lg space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Skeleton */}
      <div className="animate-pulse bg-gray-50 border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="h-6 w-24 bg-gray-200 rounded"></div>
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
                  <div className="h-4 w-28 bg-gray-200 rounded"></div>
                  <div className="h-4 w-36 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}