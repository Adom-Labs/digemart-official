// app/stores/page.tsx
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { Suspense } from 'react';
import { getStoresPageData } from './actions';
import StoresClientPage from './StoresClientPage';
import Loader from '@/components/Loader';

export default async function StoresPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string; sortBy?: string }>;
}) {
  const params = await searchParams
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['stores', params],
    queryFn: () => getStoresPageData(params),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <Suspense fallback={<Loader />}>
        <StoresClientPage />
      </Suspense>
    </HydrationBoundary>
  );
}
