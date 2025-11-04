"use client";

import { useState } from "react";
import HeroVariant1 from "@/components/hero-variants/HeroVariant1";
import HeroVariant2 from "@/components/hero-variants/HeroVariant2";
import HeroVariant3 from "@/components/hero-variants/HeroVariant3";
import HeroVariant4 from "@/components/hero-variants/HeroVariant4";

export default function HeroDemoPage() {
  const [activeVariant, setActiveVariant] = useState(1);

  const variants = [
    {
      id: 1,
      name: "Alternating Color Highlight",
      description: "Each word changes color with a subtle glow effect",
      component: HeroVariant1,
    },
    {
      id: 2,
      name: "Gradient Wave",
      description: "Continuous gradient animation across all words",
      component: HeroVariant2,
    },
    {
      id: 3,
      name: "Pulse Glow",
      description: "Words pulse with glow and scale effect",
      component: HeroVariant3,
    },
    {
      id: 4,
      name: "Background Highlight Slide",
      description: "Background highlight slides behind each word",
      component: HeroVariant4,
    },
  ];

  const ActiveComponent = variants.find(
    (v) => v.id === activeVariant
  )?.component;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Variant Selector */}
      <div className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h2 className="text-lg font-semibold mb-3 text-gray-900">
            Hero Animation Variants - Choose Your Favorite
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {variants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => setActiveVariant(variant.id)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  activeVariant === variant.id
                    ? "border-blue-600 bg-blue-50 shadow-md"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      activeVariant === variant.id
                        ? "bg-blue-600"
                        : "bg-gray-300"
                    }`}
                  />
                  <span className="font-medium text-gray-900">
                    Variant {variant.id}
                  </span>
                </div>
                <div className="text-sm font-semibold text-gray-700 mb-1">
                  {variant.name}
                </div>
                <div className="text-xs text-gray-500">
                  {variant.description}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Variant Display */}
      <div className="bg-white">{ActiveComponent && <ActiveComponent />}</div>

      {/* Instructions */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-900">
            How to Use
          </h3>
          <ol className="space-y-2 text-gray-700">
            <li className="flex gap-2">
              <span className="font-semibold">1.</span>
              <span>Click on each variant above to preview the animation</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold">2.</span>
              <span>Choose your favorite animation style</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold">3.</span>
              <span>
                To apply: Replace the Hero component import in{" "}
                <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                  src/app/(public)/page.tsx
                </code>
              </span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold">4.</span>
              <span>Delete the variant files you don't want to keep</span>
            </li>
          </ol>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-900">
              <strong>💡 Tip:</strong> All variants are in{" "}
              <code className="bg-blue-100 px-2 py-1 rounded">
                src/components/hero-variants/
              </code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
