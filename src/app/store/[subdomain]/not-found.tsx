import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function StoreNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Store Not Found</h2>
          <p className="text-gray-600">
            The store you&apos;`re looking for doesn&apos;`t exist or is currently unavailable.
          </p>
        </div>

        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/findyourplug">
              Browse All Stores
            </Link>
          </Button>

          <Button variant="outline" asChild className="w-full">
            <Link href="/">
              Go to Homepage
            </Link>
          </Button>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>If you believe this is an error, please contact support.</p>
        </div>
      </div>
    </div>
  );
}