'use client';

import { UserPlus, Bell, Truck, Wallet } from 'lucide-react';

const steps = [
  {
    number: '1',
    icon: UserPlus,
    title: 'Register',
    description: 'Create account and complete KYC verification',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  {
    number: '2',
    icon: Bell,
    title: 'Get Requests',
    description: 'Receive delivery requests in your dashboard',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  {
    number: '3',
    icon: Truck,
    title: 'Deliver',
    description: 'Pick up and deliver with real-time tracking',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
  },
  {
    number: '4',
    icon: Wallet,
    title: 'Earn',
    description: 'Receive instant payment after delivery',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
  },
];

export default function HowItWorks() {
  return (
    <div id="how-it-works">
      {/* Section Header */}
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
          How It Works
        </h2>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Get started in four simple steps
        </p>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 relative">
        {/* Connection Lines (Desktop) */}
        <div className="hidden lg:block absolute top-20 left-0 right-0 h-0.5 bg-linear-to-r from-blue-200 to-orange-200" 
          style={{ width: 'calc(100% - 8rem)', marginLeft: '4rem' }} 
        />

        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={index} className="relative">
              <div className="bg-white rounded-2xl p-6 md:p-8 border-2 border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all text-center group">
                {/* Number Badge */}
                <div className={`${step.bgColor} ${step.color} w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto relative z-10 border-4 border-white shadow-lg`}>
                  {step.number}
                </div>

                {/* Icon */}
                <div className={`${step.bgColor} ${step.color} w-14 h-14 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform`}>
                  <Icon className="h-7 w-7" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
