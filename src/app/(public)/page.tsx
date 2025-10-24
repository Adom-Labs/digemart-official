import CallToAction from '@/components/CallToAction';
// import ContactSection from '@/components/ContactSection';
import Faq from '@/components/Faq';
import Hero from '@/components/Hero';
import Overview from '@/components/Overview';
// import Reviews from '@/components/Reviews';
// import StoresSection from '@/components/StoreSection';
// import TopSellersSection from '@/components/TopSellersSection';
// import { getMainLandingPageData } from './actions';

export default async function Home() {
  // const featuredData = await getMainLandingPageData();

  return (
    <div>
      <Hero />
      <Overview />
      {/* <StoresSection stores={featuredData?.data?.stores ?? []} />
      <TopSellersSection vendors={featuredData?.data?.vendors ?? []} />
      <Reviews /> */}
      <Faq />
      <CallToAction />
      {/* <ContactSection /> */}
    </div>
  );
}
