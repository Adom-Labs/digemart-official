import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, CheckCircle } from "lucide-react";
import { StoreDiscoveryDto } from "@/lib/api/types";

interface StoreGridProps {
  stores: StoreDiscoveryDto[];
  title?: string;
  subtitle?: string;
  showViewAllButton?: boolean;
  viewAllUrl?: string;
  className?: string;
  showTags?: 'none' | 'both' | 'featured' | 'verified';
}

const StoreGrid = ({
  stores,
  title,
  subtitle,
  showViewAllButton = false,
  viewAllUrl = "/findyourplug/plugs",
  className = "",
  showTags = 'both'
}: StoreGridProps) => {
  return (
    <section className={`pt-8 md:pt-16 ${className}`}>
      {(title || subtitle || showViewAllButton) && (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3 sm:gap-4">
          <div>
            {title && (
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-0.5 sm:mb-1">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-gray-500 text-sm sm:text-base">{subtitle}</p>
            )}
          </div>
          {showViewAllButton && (
            <Link
              href={viewAllUrl}
              className="ml-0 md:ml-auto w-fit sm:w-fit px-3 py-1.5 border border-blue-600 text-blue-700 rounded-lg font-medium flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base hover:bg-blue-50 transition-all"
            >
              View All Stores{" "}
              <span className="ml-1">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                  <path
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 12h14m-4-4 4 4-4 4"
                  />
                </svg>
              </span>
            </Link>
          )}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {stores.map((store) => (
          <div
            key={store.id}
            className="bg-white rounded-xl shadow-sm border flex flex-col overflow-hidden transition-transform hover:shadow-lg"
          >
            <div className="relative w-full h-48">
              <Image
                src={store.storeLogo || store.storeCover || "/placeholder.svg"}
                alt={store.storeName}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 100vw"
              />
              {store.featured && (showTags === 'both' || showTags === 'featured') && (
                <span className="absolute top-2 left-2 bg-yellow-400 text-white text-xs px-2 py-0.5 rounded font-semibold shadow">
                  Featured
                </span>
              )}
              {store.verified && (showTags === 'both' || showTags === 'verified') && (
                <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded flex items-center gap-1 font-semibold shadow">
                  <CheckCircle size={14} /> Verified
                </span>
              )}
            </div>
            <div className="flex-1 flex flex-col p-4 gap-2">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg text-gray-900 flex-1 truncate">
                  {store.storeName}
                </h3>
                <span className="flex items-center gap-1 text-yellow-500 text-sm font-medium">
                  <Star size={16} className="inline-block" fill="#FACC15" />
                  {store.averageRating?.toFixed(1) ?? "-"}
                  {store.totalRatings !== undefined && (
                    <span className="ml-1 text-gray-400">
                      ({store.totalRatings})
                    </span>
                  )}
                </span>
              </div>
              {store.category && (
                <span className="inline-block text-xs px-2 py-1 rounded bg-purple-100 text-purple-700 mb-1 w-fit">
                  {store.category.name}
                </span>
              )}
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <MapPin size={14} />
                <span className="truncate">{store.storeAddress}</span>
              </div>
              <Link
                href={`/findyourplug/plugs/${store.storeSlug}`}
                className="mt-3 inline-block px-4 py-2 bg-blue-50 text-blue-700 rounded-md font-medium text-sm hover:bg-blue-100 transition-all"
              >
                Visit Store
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StoreGrid;
