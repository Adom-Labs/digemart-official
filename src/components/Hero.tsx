import { ROUTES } from '@/lib/routes';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

const Hero = () => {
  return (
    <div className="bg-gradient-to-b from-[#302e71] via-[#1a1a2e] to-[#0f1523] pt-16">
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 inline-block rounded-full bg-white/10 px-6 py-2 text-sm text-white">
            The future of digital shopping
          </div>

          <h1 className="mb-4 text-5xl md:text-7xl font-bold text-white">
            Experience
          </h1>

          <h2 className="mb-6 text-5xl md:text-7xl font-bold">
            <span className="bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
              E-markets
            </span>
            <span className="text-white">, all in one place</span>
          </h2>

          <p className="mx-auto mb-12 max-w-2xl text-lg text-white/80">
            Discover premium products crafted with precision and elegance. Shop
            the future, delivered today.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href={ROUTES.EXTERNAL_LINK_TO_VENDORS}
              className="inline-flex min-w-[200px] items-center justify-center rounded-md bg-white px-8 py-4 text-lg font-medium  hover:bg-white/90"
            >
              Create Store
            </Link>
            <Link
              href={ROUTES.FINDYOURPLUG}
              className="inline-flex min-w-[200px] items-center justify-center gap-2 rounded-md border border-white/20 px-8 py-4 text-lg font-medium text-white hover:bg-white/10"
            >
              Explore <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero