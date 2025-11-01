"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AddToCartButton, WishlistButton } from "@/components/cart";

interface Product {
  id: number;
  name: string;
  price: number;
  image?: string;
  description?: string;
}

interface ProductGridProps {
  title?: string;
  products: Product[];
  columns?: number;
  limit?: number;
  showViewAll?: boolean;
  store?: any;
}

export default function ProductGrid({
  title = "Products",
  products,
  columns = 4,
  limit,
  showViewAll = true,
  store,
}: ProductGridProps) {
  const displayProducts = limit ? products.slice(0, limit) : products;

  const gridCols =
    {
      2: "grid-cols-1 md:grid-cols-2",
      3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
      6: "grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
    }[columns] || "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2
            className="text-2xl md:text-3xl font-bold"
            style={{
              color: "var(--store-color-text, #1F2937)",
              fontFamily:
                "var(--store-heading-font, var(--store-font-family, inherit))",
            }}
          >
            {title}
          </h2>

          {showViewAll && (
            <Button
              asChild
              variant="outline"
              style={{
                borderColor: "var(--store-color-primary, #3B82F6)",
                color: "var(--store-color-primary, #3B82F6)",
              }}
            >
              <Link href="/products">View All</Link>
            </Button>
          )}
        </div>

        {displayProducts.length > 0 ? (
          <div className={`grid ${gridCols} gap-6`}>
            {displayProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
              >
                <div className="aspect-square relative overflow-hidden rounded-t-lg bg-gray-100">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3
                    className="font-semibold mb-2 line-clamp-2"
                    style={{ color: "var(--store-color-text, #1F2937)" }}
                  >
                    {product.name}
                  </h3>

                  {product.description && (
                    <p
                      className="text-sm mb-3 line-clamp-2"
                      style={{ color: "var(--store-color-secondary, #64748B)" }}
                    >
                      {product.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="text-lg font-bold"
                      style={{ color: "var(--store-color-primary, #3B82F6)" }}
                    >
                      ${product.price.toFixed(2)}
                    </span>

                    {store?.id && (
                      <WishlistButton
                        type="PRODUCT"
                        itemId={product.id}
                        className="hover:scale-110 transition-transform"
                      />
                    )}
                  </div>

                  <div className="flex gap-2">
                    {store?.id ? (
                      <AddToCartButton
                        productId={product.id}
                        storeId={store.id}
                        size="sm"
                        className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                      >
                        Add to Cart
                      </AddToCartButton>
                    ) : (
                      <Button
                        size="sm"
                        className="flex-1"
                        style={{
                          backgroundColor:
                            "var(--store-color-primary, #3B82F6)",
                          color: "white",
                        }}
                      >
                        Add to Cart
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p
              className="text-lg"
              style={{ color: "var(--store-color-secondary, #64748B)" }}
            >
              No products available at the moment.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
