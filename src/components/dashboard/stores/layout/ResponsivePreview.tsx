"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Store } from "@/lib/api/hooks/stores";

interface LayoutConfig {
  sections: any[];
  layout: {
    heroType: string;
    productGridType: string;
    headerStyle: string;
    footerStyle: string;
    gridColumns: number;
    showSidebar: boolean;
    showSearch: boolean;
    showCart: boolean;
  };
  globalSettings: {
    showHeader: boolean;
    showFooter: boolean;
    headerPosition: string;
    maxWidth: number;
  };
}

interface ResponsivePreviewProps {
  store: Store;
  layoutConfig: LayoutConfig;
  previewMode: "desktop" | "mobile";
}

export function ResponsivePreview({
  store,
  layoutConfig,
  previewMode,
}: ResponsivePreviewProps) {
  const getPreviewStyles = () => {
    if (previewMode === "mobile") {
      return {
        width: "375px",
        height: "600px",
        transform: "scale(0.8)",
        transformOrigin: "top center",
      };
    }
    return {
      width: "100%",
      height: "600px",
    };
  };

  const renderMockSection = (section: any, index: number) => {
    const sectionStyles = {
      padding: previewMode === "mobile" ? "8px" : "16px",
      fontSize: previewMode === "mobile" ? "12px" : "14px",
    };

    switch (section.type) {
      case "hero":
        return (
          <div
            key={section.id}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded"
            style={{
              ...sectionStyles,
              minHeight: previewMode === "mobile" ? "120px" : "200px",
            }}
          >
            <div className="font-bold">
              {section.props.title || "Hero Title"}
            </div>
            <div className="opacity-90 text-xs mt-1">
              {section.props.subtitle || "Hero subtitle"}
            </div>
            <div className="mt-2">
              <div className="inline-block bg-white text-blue-600 px-2 py-1 rounded text-xs">
                {section.props.ctaText || "Button"}
              </div>
            </div>
          </div>
        );

      case "products":
        const cols =
          previewMode === "mobile"
            ? 2
            : Math.min(layoutConfig.layout.gridColumns, 4);
        return (
          <div
            key={section.id}
            className="bg-gray-50 rounded"
            style={sectionStyles}
          >
            <div className="font-semibold mb-2">
              {section.props.title || "Products"}
            </div>
            <div
              className={`grid gap-1`}
              style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
            >
              {Array.from({ length: cols * 2 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded aspect-square border"
                ></div>
              ))}
            </div>
          </div>
        );

      case "about":
        return (
          <div
            key={section.id}
            className="bg-white border rounded"
            style={sectionStyles}
          >
            <div className="font-semibold mb-2">
              {section.props.title || "About Us"}
            </div>
            <div className="text-gray-600 text-xs">
              {section.props.content?.substring(0, 100) ||
                "About section content..."}
            </div>
          </div>
        );

      case "testimonials":
        return (
          <div
            key={section.id}
            className="bg-yellow-50 rounded"
            style={sectionStyles}
          >
            <div className="font-semibold mb-2">
              {section.props.title || "Testimonials"}
            </div>
            <div className="text-xs text-gray-600">
              ⭐⭐⭐⭐⭐ Customer reviews
            </div>
          </div>
        );

      case "cta":
        return (
          <div
            key={section.id}
            className="text-white text-center rounded"
            style={{
              ...sectionStyles,
              backgroundColor: section.props.backgroundColor || "#3b82f6",
            }}
          >
            <div className="font-semibold">
              {section.props.title || "Call to Action"}
            </div>
            <div className="mt-2">
              <div className="inline-block bg-white text-gray-900 px-2 py-1 rounded text-xs">
                {section.props.ctaText || "Click Here"}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div
            key={section.id}
            className="bg-gray-100 rounded"
            style={sectionStyles}
          >
            <div className="font-semibold text-xs">{section.component}</div>
            <div className="text-xs text-gray-600">Custom section</div>
          </div>
        );
    }
  };

  const sortedSections = [...(layoutConfig.sections || [])]
    .filter((section) => section.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="flex justify-center">
      <div
        className="border rounded-lg overflow-hidden bg-white shadow-sm"
        style={getPreviewStyles()}
      >
        {/* Mock Header */}
        {layoutConfig.globalSettings.showHeader && (
          <div className="bg-white border-b px-2 py-1 flex items-center justify-between text-xs">
            <div className="font-semibold">{store.storeName}</div>
            <div className="flex items-center gap-1">
              {layoutConfig.layout.showSearch && (
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
              )}
              {layoutConfig.layout.showCart && (
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
              )}
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-1 p-1">
            {sortedSections.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-xs">
                <div className="text-lg mb-2">📄</div>
                <div>No sections added</div>
              </div>
            ) : (
              sortedSections.map((section, index) =>
                renderMockSection(section, index)
              )
            )}
          </div>
        </div>

        {/* Mock Footer */}
        {layoutConfig.globalSettings.showFooter && (
          <div className="bg-gray-800 text-white px-2 py-1 text-xs text-center">
            <div>© 2024 {store.storeName}</div>
          </div>
        )}
      </div>
    </div>
  );
}
