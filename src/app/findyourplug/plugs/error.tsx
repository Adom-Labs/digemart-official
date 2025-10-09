'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import WrapContent from '@/components/WrapContent';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Stores page error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <WrapContent>
        <div className="text-center py-20">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Something went wrong!
            </h2>
            <p className="text-gray-600 mb-6">
              We encountered an error while loading the stores. Please try again.
            </p>
            <div className="space-y-3">
              <Button onClick={reset} className="w-full">
                Try again
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/findyourplug'}
                className="w-full"
              >
                Go back to Find Your Plug
              </Button>
            </div>
          </div>
        </div>
      </WrapContent>
    </div>
  );
}