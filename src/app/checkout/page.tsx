import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { CheckoutLayout } from "@/components/checkout/CheckoutLayout";
import { CheckoutWizard } from "@/components/checkout/CheckoutWizard";
import { CheckoutSidebar } from "@/components/checkout/CheckoutSidebar";

interface CheckoutPageProps {
  searchParams: Promise<{
    store?: string;
    storeId?: string;
    [key: string]: string | string[] | undefined;
  }>;
}

export const metadata: Metadata = {
  title: "Checkout - Digemart",
  description: "Complete your purchase on Digemart",
  robots: {
    index: false, // Don't index checkout pages
    follow: false,
  },
};

export default async function CheckoutPage({
  searchParams,
}: CheckoutPageProps) {
  const params = await searchParams;
  const storeParam = params.store || params.storeId;

  // If no store is specified, redirect to main marketplace
  if (!storeParam) {
    redirect("/findyourplug");
  }

  // Parse store ID from parameter
  const storeId =
    typeof storeParam === "string" ? parseInt(storeParam, 10) : null;

  if (!storeId || isNaN(storeId)) {
    redirect("/findyourplug");
  }

  return (
    <CheckoutLayout>
      <div className="checkout-container max-w-7xl mx-auto px-4 py-4 md:py-8">
        {/* Mobile: Stack layout, Desktop: Side-by-side */}
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 md:gap-8">
          {/* Main checkout content */}
          <div className="order-2 lg:order-1 lg:col-span-2">
            <Suspense fallback={<CheckoutWizardSkeleton />}>
              <CheckoutWizard storeId={storeId} />
            </Suspense>
          </div>

          {/* Order summary sidebar - Show first on mobile */}
          <div className="order-1 lg:order-2 lg:col-span-1">
            <Suspense fallback={<CheckoutSidebarSkeleton />}>
              <CheckoutSidebar storeId={storeId} />
            </Suspense>
          </div>
        </div>
      </div>
    </CheckoutLayout>
  );
}

// Loading skeletons
function CheckoutWizardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 bg-gray-200 rounded animate-pulse" />
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
      </div>
    </div>
  );
}

function CheckoutSidebarSkeleton() {
  return (
    <div className="space-y-4 p-6 bg-gray-50 rounded-lg">
      <div className="h-6 bg-gray-200 rounded animate-pulse" />
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3" />
      </div>
    </div>
  );
}
