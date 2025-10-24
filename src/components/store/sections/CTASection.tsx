import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface CTASectionProps {
  title?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundColor?: string;
}

export default function CTASection({ 
  title = 'Ready to Get Started?', 
  description = 'Join thousands of satisfied customers',
  ctaText = 'Get Started',
  ctaLink = '/contact',
  backgroundColor = '#3B82F6'
}: CTASectionProps) {
  return (
    <section 
      className="py-16"
      style={{ backgroundColor }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {title}
        </h2>
        
        <p className="text-xl text-white/90 mb-8">
          {description}
        </p>
        
        <Button 
          asChild 
          size="lg"
          className="bg-white text-gray-900 hover:bg-gray-100"
        >
          <Link href={ctaLink}>
            {ctaText}
          </Link>
        </Button>
      </div>
    </section>
  );
}