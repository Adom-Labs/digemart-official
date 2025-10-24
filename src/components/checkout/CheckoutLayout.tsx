"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, Shield, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Store {
  id: number;
  storeName: string;
  logo?: string;
  themeConfig?: {
    primaryColor?: string;
    secondaryColor?: string;
    fontFamily?: string;
  };
}

interface CheckoutLayoutProps {
  children: ReactNode;
  store?: Store;
}

export function CheckoutLayout({ children, store }: CheckoutLayoutProps) {
  const primaryColor = store?.themeConfig?.primaryColor || "#3b82f6";
  const fontFamily = store?.themeConfig?.fontFamily || "Inter";

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={
        {
          fontFamily,
          "--checkout-primary": primaryColor,
        } as React.CSSProperties
      }
    >
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            {/* Back button and store branding */}
            <div className="flex items-center space-x-2 md:space-x-4 min-w-0 flex-1">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-gray-600 hover:text-gray-900 flex-shrink-0"
              >
                <Link href={store ? `/store/${store.id}` : "/findyourplug"}>
                  <ArrowLeft className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">
                    Back to {store ? "Store" : "Marketplace"}
                  </span>
                </Link>
              </Button>

              {store && (
                <>
                  <div className="hidden md:block h-6 w-px bg-gray-300" />
                  <div className="flex items-center space-x-2 md:space-x-3 min-w-0">
                    {store.logo && (
                      <img
                        src={store.logo}
                        alt={`${store.storeName} logo`}
                        className="h-6 w-6 md:h-8 md:w-8 rounded object-cover flex-shrink-0"
                      />
                    )}
                    <div className="min-w-0">
                      <h1 className="text-sm md:text-lg font-semibold text-gray-900 truncate">
                        {store.storeName}
                      </h1>
                      <p className="text-xs md:text-sm text-gray-500">
                        Checkout
                      </p>
                    </div>
                  </div>
                </>
              )}

              {!store && (
                <div className="min-w-0">
                  <h1 className="text-sm md:text-lg font-semibold text-gray-900">
                    Digemart Checkout
                  </h1>
                  <p className="text-xs md:text-sm text-gray-500">
                    Secure checkout
                  </p>
                </div>
              )}
            </div>

            {/* Security indicators */}
            <div className="flex items-center space-x-2 md:space-x-4 text-xs md:text-sm text-gray-600 flex-shrink-0">
              <div className="flex items-center space-x-1">
                <Shield className="h-3 w-3 md:h-4 md:w-4 text-green-600" />
                <span className="hidden sm:inline">Secure</span>
              </div>
              <div className="flex items-center space-x-1">
                <Lock className="h-3 w-3 md:h-4 md:w-4 text-green-600" />
                <span className="hidden sm:inline">SSL</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-600">
              © 2024 {store ? store.storeName : "Digemart"}. All rights
              reserved.
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <Link
                href="/privacy"
                className="hover:text-gray-900 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="hover:text-gray-900 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/support"
                className="hover:text-gray-900 transition-colors"
              >
                Support
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
