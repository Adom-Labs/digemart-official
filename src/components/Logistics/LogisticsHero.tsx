'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LogisticsHero() {
  return (
    <section className="relative bg-linear-to-br from-blue-600 via-blue-700 to-blue-900 text-white pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
            <CheckCircle className="h-4 w-4 text-green-300" />
            <span className="text-sm font-medium">Now accepting logistics partners</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Join Our <span className="text-blue-200">Logistics Network</span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
            Partner with Digemart to expand your delivery business. Access more orders, increase revenue, and deliver excellence with our advanced platform.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/logistics/register">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all w-full sm:w-auto"
              >
                Register Your Company
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            
            <Link href="#how-it-works">
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold px-8 py-6 text-lg w-full sm:w-auto"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="#F9FAFB"/>
        </svg>
      </div>
    </section>
  );
}
