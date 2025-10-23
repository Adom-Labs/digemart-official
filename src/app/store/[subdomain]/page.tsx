import { Suspense } from "react";
import { notFound } from "next/navigation";
import { StoreHomepage } from "@/components/store/StoreHomepage";
import { StorePageSkeleton } from "@/components/store/StorePageSkeleton";
import { getStoreBySubdomain, getStoreProducts } from "./actions";

interface StorePageProps {
  params: Promise<{ subdomain: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function StorePage({
  params,
  searchParams,
}: StorePageProps) {
  try {
    const { subdomain } = await params;
    const resolvedSearchParams = await searchParams;

    const [store, products] = await Promise.all([
      getStoreBySubdomain(subdomain),
      getStoreProducts(subdomain, {
        page: 1,
        limit: 12,
        featured: true,
      }),
    ]);

    if (!store || store.status !== "ACTIVE") {
      notFound();
    }

    return (
      <Suspense fallback={<StorePageSkeleton />}>
        <StoreHomepage
          store={store}
          products={products}
          searchParams={resolvedSearchParams}
        />
      </Suspense>
    );
  } catch (error) {
    console.error("Error loading store page:", error);
    notFound();
  }
}
