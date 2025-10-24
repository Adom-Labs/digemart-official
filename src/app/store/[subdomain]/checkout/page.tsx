import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { getStoreBySubdomain } from "../actions";

// Dynamic imports for performance optimization
const CheckoutLayout = dynamic(
  () =>
    import("@/components/checkout/CheckoutLayout").then((mod) => ({
      default: mod.CheckoutLayout,
    })),
  {
    loading: () => <CheckoutLayoutSkeleton />,
    ssr: true,
  }
);

const CheckoutWizard = dynamic(
  () =>
    import("@/components/checkout/CheckoutWizard").then((mod) => ({
      default: mod.CheckoutWizard,
    })),
  {
    loading: () => <CheckoutWizardSkeleton />,
  }
);

const CheckoutSidebar = dynamic(
  () =>
    import("@/components/checkout/CheckoutSidebar").then((mod) => ({
      default: mod.CheckoutSidebar,
    })),
  {
    loading: () => <CheckoutSidebarSkeleton />,
    ssr: true, // Order summary can be server-rendered
  }
);

interface CheckoutPageProps {
  params: Promise<{ subdomain: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}): Promise<Metadata> {
  try {
    const { subdomain } = await params;
    const store = await getStoreBySubdomain(subdomain);

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://digemart.com";
    const storeUrl = `https://${subdomain}.${new URL(baseUrl).hostname}`;

    return {
      title: `Checkout - ${store.storeName}`,
      description: `Complete your purchase at ${store.storeName}`,
      robots: {
        index: false, // Don't index checkout pages
        follow: false,
      },
      openGraph: {
        title: `Checkout - ${store.storeName}`,
        description: `Complete your purchase at ${store.storeName}`,
        url: `${storeUrl}/checkout`,
        siteName: store.storeName,
        images: [
          {
            url: store.logo || "/default-store-image.jpg",
            width: 1200,
            height: 630,
            alt: `${store.storeName} logo`,
          },
        ],
      },
    };
  } catch (error) {
    return {
      title: "Checkout",
      description: "Complete your purchase",
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}

export default async function CheckoutPage({
  params,
}: CheckoutPageProps) {
  try {
    const { subdomain } = await params;
    const store = await getStoreBySubdomain(subdomain);

    if (!store || store.status !== "ACTIVE") {
      notFound();
    }


    return (
      <CheckoutLayout store={store}>
        <div className="checkout-container max-w-7xl mx-auto px-4 py-4 md:py-8">
          {/* Mobile: Stack layout, Desktop: Side-by-side */}
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 md:gap-8">
            {/* Main checkout content */}
            <div className="order-2 lg:order-1 lg:col-span-2">
              <Suspense fallback={<CheckoutWizardSkeleton />}>
                <CheckoutWizard storeId={store.id} />
              </Suspense>
            </div>

            {/* Order summary sidebar - Show first on mobile */}
            <div className="order-1 lg:order-2 lg:col-span-1">
              <Suspense fallback={<CheckoutSidebarSkeleton />}>
                <CheckoutSidebar storeId={store.id} />
              </Suspense>
            </div>
          </div>
        </div>
      </CheckoutLayout>
    );
  } catch (error) {
    console.error("Checkout page error:", error);
    notFound();
  }
}

// Loading skeletons for performance optimization
function CheckoutLayoutSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-16 bg-white border-b animate-pulse" />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="h-8 bg-gray-200 rounded animate-pulse mb-6" />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CheckoutWizardSkeleton />
          </div>
          <div className="lg:col-span-1">
            <CheckoutSidebarSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckoutWizardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Progress indicator skeleton */}
      <div className="flex justify-between items-center mb-8">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex items-center">
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
            {step < 4 && (
              <div className="w-16 h-0.5 bg-gray-200 animate-pulse ml-2" />
            )}
          </div>
        ))}
      </div>

      {/* Form skeleton */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="h-6 bg-gray-200 rounded animate-pulse mb-4" />
        <div className="space-y-4">
          <div className="h-10 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 bg-gray-200 rounded animate-pulse w-3/4" />
        </div>
        <div className="flex justify-between mt-6">
          <div className="h-10 w-20 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}

function CheckoutSidebarSkeleton() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm sticky top-4">
      <div className="h-6 bg-gray-200 rounded animate-pulse mb-4" />

      {/* Order items skeleton */}
      <div className="space-y-3 mb-6">
        {[1, 2].map((item) => (
          <div key={item} className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-200 rounded animate-pulse" />
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-1" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
            </div>
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>

      {/* Totals skeleton */}
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between">
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="flex justify-between">
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="flex justify-between font-semibold border-t pt-2">
          <div className="h-5 w-12 bg-gray-200 rounded animate-pulse" />
          <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
