'use client';

import { Check } from 'lucide-react';

const features = [
  'Real-time request notifications',
  'GPS-enabled delivery tracking',
  'Automated payment processing',
  'Performance analytics',
  'Multi-region coverage',
  '24/7 support',
];

export default function PlatformFeatures() {
  return (
    <div>
      {/* Section Header */}
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
          Everything You Need
        </h2>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Powerful features designed for logistics partners
        </p>
      </div>

      {/* Features List */}
      <div className="max-w-3xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-4 bg-white rounded-xl p-4 md:p-6 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all group"
            >
              <div className="bg-blue-50 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Check className="h-5 w-5 font-bold" strokeWidth={3} />
              </div>
              <span className="text-lg font-semibold text-gray-800">
                {feature}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
