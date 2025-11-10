import { Metadata } from 'next';
import LogisticsHero from '@/components/Logistics/LogisticsHero';
import LogisticsStats from '@/components/Logistics/LogisticsStats';
import WhyPartner from '@/components/Logistics/WhyPartner';
import HowItWorks from '@/components/Logistics/HowItWorks';
import PlatformFeatures from '@/components/Logistics/PlatformFeatures';
import LogisticsCTA from '@/components/Logistics/LogisticsCTA';
import WrapContent from '@/components/WrapContent';

export const metadata: Metadata = {
  title: 'Logistics Network - Partner with Digemart | Grow Your Delivery Business',
  description: 'Join Digemart\'s logistics network. Access more orders, increase revenue, and deliver excellence with our advanced platform. 1000+ active partners, 50K+ monthly deliveries.',
  keywords: 'logistics partner, delivery business, courier services, last-mile delivery, logistics network',
};

export default function LogisticsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <LogisticsHero />
      
      <WrapContent>
        <LogisticsStats />
      </WrapContent>

      <section className="py-16 md:py-24 bg-white">
        <WrapContent>
          <WhyPartner />
        </WrapContent>
      </section>

      <section className="py-16 md:py-24 bg-gray-50">
        <WrapContent>
          <HowItWorks />
        </WrapContent>
      </section>

      <section className="py-16 md:py-24 bg-white">
        <WrapContent>
          <PlatformFeatures />
        </WrapContent>
      </section>

      <section className="py-16 md:py-20 bg-linear-to-br from-blue-600 to-blue-800">
        <WrapContent>
          <LogisticsCTA />
        </WrapContent>
      </section>
    </main>
  );
}
