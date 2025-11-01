import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface MinimalHeroProps {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
}

export default function MinimalHero({ title, subtitle, ctaText, ctaLink }: MinimalHeroProps) {
  return (
    <section className="py-20 md:py-32 text-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 
          className="text-3xl md:text-5xl font-bold mb-6"
          style={{ 
            color: 'var(--store-color-text, #1F2937)',
            fontFamily: 'var(--store-heading-font, var(--store-font-family, inherit))'
          }}
        >
          {title}
        </h1>
        
        {subtitle && (
          <p 
            className="text-lg md:text-xl mb-8 max-w-2xl mx-auto"
            style={{ 
              color: 'var(--store-color-secondary, #64748B)',
              fontFamily: 'var(--store-font-family, inherit)'
            }}
          >
            {subtitle}
          </p>
        )}
        
        {ctaText && ctaLink && (
          <Button 
            asChild 
            size="lg"
            style={{
              backgroundColor: 'var(--store-color-primary, #3B82F6)',
              color: 'white',
            }}
          >
            <Link href={ctaLink}>
              {ctaText}
            </Link>
          </Button>
        )}
      </div>
    </section>
  );
}