import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface BannerHeroProps {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundImage?: string;
  store?: any;
}

export default function BannerHero({
  title,
  subtitle,
  ctaText = 'Shop Now',
  ctaLink = '/products',
  backgroundImage,
  store,
}: BannerHeroProps) {
  return (
    <section className="relative h-96 md:h-[500px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <Image
            src={backgroundImage}
            alt={title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
      )}
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 
          className="text-4xl md:text-6xl font-bold mb-4"
          style={{ 
            color: backgroundImage ? 'white' : 'var(--store-color-text, #1F2937)',
            fontFamily: 'var(--store-heading-font, var(--store-font-family, inherit))'
          }}
        >
          {title}
        </h1>
        
        {subtitle && (
          <p 
            className="text-lg md:text-xl mb-8 max-w-2xl mx-auto"
            style={{ 
              color: backgroundImage ? 'rgba(255, 255, 255, 0.9)' : 'var(--store-color-secondary, #64748B)',
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
            className="px-8 py-3 text-lg"
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
      
      {/* Gradient overlay for better text readability */}
      {!backgroundImage && (
        <div 
          className="absolute inset-0 z-0"
          style={{
            background: `linear-gradient(135deg, var(--store-color-background, #FFFFFF) 0%, var(--store-color-primary, #3B82F6)10 100%)`,
            opacity: 0.05,
          }}
        ></div>
      )}
    </section>
  );
}