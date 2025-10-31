"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { HomeIcon, ArrowLeftIcon, SearchIcon } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 p-4">
      <div className="max-w-lg w-full">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-8 sm:p-12">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="text-9xl sm:text-10xl font-black text-primary/20 select-none">
                  404
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <SearchIcon
                    className="text-primary/40"
                    size={36}
                    strokeWidth={2.5}
                  />
                </div>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-3">
              Page Not Found
            </h1>
            <p className="text-gray-600 text-center text-sm sm:text-base max-w-md mx-auto">
              The page you&apos;re looking for doesn&apos;t exist, has been
              moved, or you don&apos;t have permission to access it.
            </p>
          </div>

          {/* Actions Section */}
          <div className="p-6 sm:p-8 space-y-3 grid grid-cols-3 gap-3">
            <button
              onClick={handleGoBack}
              className="flex items-center col-span-2 justify-center gap-2 w-full px-6 py-3 h-16 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
            >
              <ArrowLeftIcon size={18} strokeWidth={2} />
              Go Back
            </button>
            <Link
              href="/"
              className="flex items-center justify-center gap-2 w-full px-6 py-3 h-16 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium"
            >
              <HomeIcon size={18} strokeWidth={2} />
              Home
            </Link>
          </div>

          {/* Footer Section */}
          <div className="px-6 sm:px-8 pb-6 sm:pb-8">
            <div className="border-t border-gray-200 pt-6">
              <p className="text-sm text-gray-500 text-center">
                Need help?{" "}
                <Link
                  href="/contact"
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Contact Support
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-3">Popular Pages</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/findyourplug/dashboard"
              className="text-sm px-4 py-2 bg-white text-gray-700 rounded-full hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm"
            >
              Dashboard
            </Link>
            <Link
              href="/findyourplug"
              className="text-sm px-4 py-2 bg-white text-gray-700 rounded-full hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm"
            >
              Find Stores
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
