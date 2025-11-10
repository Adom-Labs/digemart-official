'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LogisticsCTA() {
  return (
    <div className="text-center text-white">
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
        Ready to Get Started?
      </h2>
      <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
        Join hundreds of logistics partners already earning with Digemart
      </p>
      
      <Link href="/logistics/register">
        <Button 
          size="lg" 
          className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-10 py-6 text-lg shadow-2xl hover:shadow-3xl transition-all"
        >
          Register Your Company Now
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </Link>

      {/* Footer Links */}
      <div className="mt-12 pt-8 border-t border-white/20">
        <div className="flex flex-wrap justify-center gap-6 text-sm text-blue-100 mb-6">
          <Link href="/logistics/privacy" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
          <Link href="/logistics/terms" className="hover:text-white transition-colors">
            Terms of Service
          </Link>
          <Link href="/logistics/agreement" className="hover:text-white transition-colors">
            Partner Agreement
          </Link>
          <Link href="/logistics/login" className="hover:text-white transition-colors">
            Partner Login
          </Link>
        </div>
        <p className="text-sm text-blue-200">
          © 2025 Digemart Logistics. All rights reserved.
        </p>
      </div>
    </div>
  );
}
