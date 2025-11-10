'use client';

import { TrendingUp, Package, Star } from 'lucide-react';

const stats = [
  {
    icon: TrendingUp,
    value: '1000+',
    label: 'Active Partners',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    icon: Package,
    value: '50K+',
    label: 'Monthly Deliveries',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    icon: Star,
    value: '4.8★',
    label: 'Average Rating',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
  },
];

export default function LogisticsStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 -mt-16 relative z-20">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 hover:shadow-2xl transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className={`${stat.bgColor} ${stat.color} p-3 rounded-xl`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
