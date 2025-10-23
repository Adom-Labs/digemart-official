"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { StoreSubdomainData } from "@/lib/api/subdomain";
import { MiniCart, CartDrawer } from "@/components/cart";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useStoreAuth } from "../auth/StoreAuthProvider";
import { StoreUserMenu } from "../auth/StoreUserMenu";
import { StoreAuthModal } from "../auth/StoreAuthModal";

interface StoreHeaderProps {
  store: StoreSubdomainData;
  headerStyle?: "classic" | "modern" | "minimal" | "centered";
}

export function StoreHeader({
  store,
  headerStyle = "modern",
}: StoreHeaderProps) {
  const [cartOpen, setCartOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { isAuthenticated, isLoading, user } = useStoreAuth();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const handleSignInClick = () => {
    setAuthModalOpen(true);
  };

  return (
    <header
      className="sticky top-0 z-50 bg-white border-b shadow-sm"
      style={{ borderColor: "var(--store-color-primary, #3B82F6)20" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            {store.logo && (
              <div className="relative h-8 w-8">
                <Image
                  src={store.logo}
                  alt={`${store.storeName} logo`}
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <span
              className="text-xl font-bold"
              style={{
                color: "var(--store-color-text, #1F2937)",
                fontFamily:
                  "var(--store-heading-font, var(--store-font-family, inherit))",
              }}
            >
              {store.storeName}
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium hover:opacity-75 transition-opacity"
                style={{ color: "var(--store-color-text, #1F2937)" }}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Button */}
            <button
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              style={{ color: "var(--store-color-text, #1F2937)" }}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {/* Authentication */}
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
            ) : isAuthenticated && user ? (
              <StoreUserMenu />
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignInClick}
                className="flex items-center space-x-2"
                style={{ color: "var(--store-color-text, #1F2937)" }}
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Sign In</span>
              </Button>
            )}

            {/* Cart Button with Integrated Cart Drawer */}
            <MiniCart onOpenCart={() => setCartOpen(true)} storeId={store.id} />
          </div>

          {/* Cart Drawer */}
          <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} storeId={store.id} />

          {/* Authentication Modal */}
          <StoreAuthModal
            isOpen={authModalOpen}
            onClose={() => setAuthModalOpen(false)}
            redirectUrl={
              typeof window !== "undefined" ? window.location.pathname : "/"
            }
          />
        </div>
      </div>
    </header>
  );
}
