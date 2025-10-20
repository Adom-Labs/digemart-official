// app/stores/page.tsx
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { Suspense } from 'react';
import { getStoresPageData } from './actions';
import { categoryApi } from '@/lib/api';
import StoresClientPage from './StoresClientPage';
import Loader from '@/components/Loader';

export default async function StoresPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string; sortBy?: string }>;
}) {
  const params = await searchParams
  const queryClient = new QueryClient();

  // Prefetch the data for SSR
  const initialData = await getStoresPageData(params);

  // Set the prefetched data in the query client
  await queryClient.prefetchQuery({
    queryKey: ['stores', params],
    queryFn: () => Promise.resolve(initialData),
  });

  await queryClient.prefetchQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getAll(),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <Suspense fallback={<Loader />}>
        <StoresClientPage
          searchParams={params}
        />
      </Suspense>
    </HydrationBoundary>
  );
}
