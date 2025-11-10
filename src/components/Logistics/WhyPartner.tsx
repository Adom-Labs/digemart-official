'use client';

import { 
  DollarSign, 
  MapPin, 
  BarChart3, 
  Shield, 
  Clock, 
  Network 
} from 'lucide-react';

const features = [
  {
    icon: DollarSign,
    title: 'Competitive Earnings',
    description: 'Transparent pricing with attractive fees for every delivery',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    icon: MapPin,
    title: 'Real-time Tracking',
    description: 'Advanced GPS tracking for seamless delivery monitoring',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Track performance, earnings, and optimize operations',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    icon: Shield,
    title: 'Secure Payments',
    description: 'Fast payouts with multiple payment options',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
  {
    icon: Clock,
    title: 'Flexible Schedule',
    description: 'Accept requests on your terms and manage availability',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
  },
  {
    icon: Network,
    title: 'Growing Network',
    description: 'Connect with hundreds of vendors across regions',
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
  },
];

export default function WhyPartner() {
  return (
    <div>
      {/* Section Header */}
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
          Why Partner with Us?
        </h2>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Everything you need to grow your logistics business
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl p-6 md:p-8 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all group"
            >
              <div className={`${feature.bgColor} ${feature.color} w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
