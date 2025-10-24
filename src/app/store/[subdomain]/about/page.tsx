import { Suspense } from 'react';
import { StoreAboutPage } from '@/components/store/StoreAboutPage';
import { StorePageSkeleton } from '@/components/store/StorePageSkeleton';
import { getStoreBySubdomain, getStoreReviews } from '../actions';

interface StoreAboutPageProps {
  params: Promise<{ subdomain: string }>;
}

export default async function AboutPage({ params }: StoreAboutPageProps) {
  const { subdomain } = await params;
  
  const [store, reviews] = await Promise.all([
    getStoreBySubdomain(subdomain),
    getStoreReviews(subdomain, 10),
  ]);

  return (
    <Suspense fallback={<StorePageSkeleton />}>
      <StoreAboutPage store={store} reviews={reviews} />
    </Suspense>
  );
}