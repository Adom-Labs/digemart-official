"use client";

import React, { useState } from "react";
import { Check, Crown, Star, Download, Eye } from "lucide-react";
import {
  useThemeTemplates,
  useIncrementThemeDownloads,
} from "@/lib/api/hooks/theme-templates";
import {
  getThemeCategories,
  type ThemeTemplate,
} from "@/lib/api/theme-templates";

interface ThemeTemplateSelectorProps {
  selectedThemeId?: number;
  onThemeSelect: (theme: ThemeTemplate) => void;
  className?: string;
}

export function ThemeTemplateSelector({
  selectedThemeId,
  onThemeSelect,
  className = "",
}: ThemeTemplateSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);

  const { data: themesData, isLoading } = useThemeTemplates({
    category: selectedCategory || undefined,
    isPremium: showPremiumOnly || undefined,
    isActive: true,
    limit: 50,
  });

  const incrementDownloadsMutation = useIncrementThemeDownloads();
  const categories = getThemeCategories();

  const handleThemeSelect = async (theme: ThemeTemplate) => {
    onThemeSelect(theme);

    // Increment download count
    try {
      await incrementDownloadsMutation.mutateAsync(theme.id);
    } catch (error) {
      console.error("Failed to increment download count:", error);
    }
  };

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Choose a Theme
        </h3>
        <p className="text-gray-600">
          Select a pre-designed theme for your store. You can customize it
          later.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showPremiumOnly}
            onChange={(e) => setShowPremiumOnly(e.target.checked)}
            className="rounded border-gray-300 text-primary focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">Premium themes only</span>
        </label>
      </div>

      {/* Theme Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {themesData?.data.map((theme) => (
          <div
            key={theme.id}
            className={`relative bg-white rounded-lg border-2 cursor-pointer transition-all hover:shadow-lg ${
              selectedThemeId === theme.id
                ? "border-blue-500 ring-2 ring-blue-200"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => handleThemeSelect(theme)}
          >
            {/* Selection Indicator */}
            {selectedThemeId === theme.id && (
              <div className="absolute top-2 right-2 z-10 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}

            {/* Preview Image */}
            <div className="aspect-video bg-gray-100 rounded-t-lg relative overflow-hidden">
              {theme.preview ? (
                <img
                  src={theme.preview}
                  alt={theme.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Eye className="w-8 h-8" />
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-2 left-2 flex gap-2">
                {theme.isDefault && (
                  <span className="px-2 py-1 bg-primary text-white text-xs rounded-full">
                    Default
                  </span>
                )}
                {theme.isPremium && (
                  <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded-full flex items-center">
                    <Crown className="w-3 h-3 mr-1" />
                    Premium
                  </span>
                )}
              </div>

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                <div className="opacity-0 hover:opacity-100 transition-opacity">
                  <span className="bg-white text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
                    Select Theme
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-gray-900 truncate">
                  {theme.name}
                </h4>
                <div className="flex items-center text-sm text-gray-500">
                  <Star className="w-3 h-3 mr-1 fill-current text-yellow-400" />
                  {theme.rating.toFixed(1)}
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {theme.description}
              </p>

              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                  {categories.find((c) => c.value === theme.category)?.label ||
                    theme.category}
                </span>
                <div className="flex items-center text-sm text-gray-500">
                  <Download className="w-3 h-3 mr-1" />
                  {theme.downloads}
                </div>
              </div>

              {theme.isPremium && theme.price && (
                <div className="text-lg font-bold text-green-600 mb-3">
                  ${theme.price}
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {theme.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
                  >
                    {tag}
                  </span>
                ))}
                {theme.tags.length > 3 && (
                  <span className="px-2 py-1 bg-gray-50 text-gray-500 text-xs rounded">
                    +{theme.tags.length - 3}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {themesData?.data.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Eye className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No themes found
          </h3>
          <p className="text-gray-600">
            Try adjusting your filters to see more theme options.
          </p>
        </div>
      )}

      {/* Selected Theme Info */}
      {selectedThemeId && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <Check className="w-5 h-5 text-primary mr-2" />
            <span className="text-blue-800 font-medium">
              Theme selected:{" "}
              {themesData?.data.find((t) => t.id === selectedThemeId)?.name}
            </span>
          </div>
          <p className="text-blue-700 text-sm mt-1">
            You can customize colors, fonts, and layout after creating your
            store.
          </p>
        </div>
      )}
    </div>
  );
}
