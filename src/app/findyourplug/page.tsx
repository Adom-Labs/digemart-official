import HeroSearch from '@/components/FindYourPlug/HeroSearch';
import TopCategories from '@/components/FindYourPlug/TopCategories';
import FeaturedStores from '@/components/FindYourPlug/FeaturedStores';
import RecentReviews from '@/components/FindYourPlug/RecentReviews';
import StoreCTA from '@/components/FindYourPlug/StoreCTA';
import { getPlugsLandingPageData } from './actions';

export default async function FindYourPlugPage() {
  // Fetch data on server for SEO
  const pageData = await getPlugsLandingPageData();

  const popularCategories = pageData?.data?.categories
    ?.filter((cat) => cat.featured || cat.trending)
    ?.slice(0, 5);

  return (
    <>
      <HeroSearch popularCategories={popularCategories} />
      <TopCategories categories={pageData?.data?.categories} />
      <FeaturedStores stores={pageData?.data?.featuredStores} />
      <RecentReviews reviews={pageData?.data?.recentReviews} />
      <StoreCTA />
    </>
  );
}
