"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useStore } from "@/lib/api/hooks/stores";
import { StoreCustomerAnalytics } from "@/components/dashboard/stores/customers/StoreCustomerAnalytics";
import { StoreCustomersList } from "@/components/dashboard/stores/customers/StoreCustomersList";

interface StoreCustomersPageProps {
  params: {
    storeId: string;
  };
}

function CustomerAnalyticsSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <Skeleton className="h-6 w-48" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}

function CustomersListSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
          <Skeleton className="h-10 w-full" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function StoreCustomersPage({
  params,
}: StoreCustomersPageProps) {
  const router = useRouter();
  const storeId = parseInt(params.storeId);

  const { data: store, isLoading, error } = useStore(storeId);

  if (isNaN(storeId)) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Invalid Store ID
          </h1>
          <p className="text-gray-600 mb-4">
            The store ID provided is not valid.
          </p>
          <Button onClick={() => router.push("/findyourplug/dashboard/stores")}>
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Store Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            The store you&apos;re looking for doesn&apos;t exist or you
            don&apos;t have access to it.
          </p>
          <Button onClick={() => router.push("/findyourplug/dashboard/stores")}>
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
            onClick={() =>
              router.push(`/findyourplug/dashboard/stores/${storeId}`)
            }
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Store
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-gray-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Customer Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage customers for {store.storeName}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Analytics Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Customer Analytics
          </h2>
          <Suspense fallback={<CustomerAnalyticsSkeleton />}>
            <StoreCustomerAnalytics storeId={storeId} />
          </Suspense>
        </div>

        {/* Customer List Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Customer List
          </h2>
          <Suspense fallback={<CustomersListSkeleton />}>
            <StoreCustomersList storeId={storeId} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
