import { Suspense } from 'react';
import { StoreProductsPage } from '@/components/store/StoreProductsPage';
import { StorePageSkeleton } from '@/components/store/StorePageSkeleton';
import { getStoreBySubdomain, getStoreProducts, getStoreCategories } from '../actions';

interface StoreProductsPageProps {
  params: Promise<{ subdomain: string }>;
  searchParams: Promise<{ 
    category?: string;
    search?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function ProductsPage({ params, searchParams }: StoreProductsPageProps) {
  const { subdomain } = await params;
  const resolvedSearchParams = await searchParams;
  
  const page = parseInt(resolvedSearchParams.page || '1');
  const limit = 12;

  const [store, products, categories] = await Promise.all([
    getStoreBySubdomain(subdomain),
    getStoreProducts(subdomain, {
      page,
      limit,
      category: resolvedSearchParams.category,
      search: resolvedSearchParams.search,
    }),
    getStoreCategories(subdomain),
  ]);

  return (
    <Suspense fallback={<StorePageSkeleton />}>
      <StoreProductsPage
        store={store}
        products={products}
        categories={categories}
        searchParams={resolvedSearchParams}
      />
    </Suspense>
  );
}