"use client";

import { ArrowLeft, Edit, Copy, Archive, Share2, MoreVertical, Star, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ProductStats {
  totalViews: number;
  viewsTrend: number;
  totalSales: number;
  salesTrend: number;
  conversionRate: number;
  conversionTrend: number;
  revenue: number;
  revenueTrend: number;
}

interface ProductHeroProps {
  productName: string;
  productId: number;
  storeId: number;
  price: number;
  compareAtPrice?: number;
  sku: string;
  status: "active" | "draft" | "archived" | "out_of_stock";
  rating?: number;
  reviewCount?: number;
  totalSold?: number;
  stats?: ProductStats;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onArchive?: () => void;
  onShare?: () => void;
}

export function ProductHero({
  productName,
  productId,
  storeId,
  price,
  compareAtPrice,
  sku,
  status,
  rating,
  reviewCount = 0,
  totalSold = 0,
  stats,
  onEdit,
  onDuplicate,
  onArchive,
  onShare,
}: ProductHeroProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "active":
        return {
          label: "Active",
          className: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
        };
      case "draft":
        return {
          label: "Draft",
          className: "bg-amber-500/10 text-amber-700 border-amber-500/20",
        };
      case "archived":
        return {
          label: "Archived",
          className: "bg-gray-500/10 text-gray-700 border-gray-500/20",
        };
      case "out_of_stock":
        return {
          label: "Out of Stock",
          className: "bg-red-500/10 text-red-700 border-red-500/20",
        };
      default:
        return {
          label: status,
          className: "bg-gray-500/10 text-gray-700 border-gray-500/20",
        };
    }
  };

  const statusConfig = getStatusConfig(status);

  const formatTrend = (value: number) => {
    const isPositive = value >= 0;
    const Icon = isPositive ? TrendingUp : TrendingDown;
    const colorClass = isPositive ? "text-emerald-600" : "text-red-600";

    return (
      <div className={cn("flex items-center gap-1 text-sm font-medium", colorClass)}>
        <Icon className="w-4 h-4" />
        {Math.abs(value)}%
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Actions */}
      <div className="flex items-center justify-between">
        <Link
          href={`/findyourplug/dashboard/stores/${storeId}/products`}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" size="sm" onClick={onShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onDuplicate}>
                <Copy className="w-4 h-4 mr-2" />
                Duplicate Product
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onArchive} className="text-red-600">
                <Archive className="w-4 h-4 mr-2" />
                Archive Product
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Product Title & Status */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{productName}</h1>
            <Badge className={cn("border", statusConfig.className)}>
              {statusConfig.label}
            </Badge>
          </div>

          <div className="flex items-center gap-4 text-gray-600">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">${price.toFixed(2)}</span>
              {compareAtPrice && compareAtPrice > price && (
                <span className="text-lg line-through text-gray-400">
                  ${compareAtPrice.toFixed(2)}
                </span>
              )}
            </div>
            <span>·</span>
            <code className="text-sm bg-gray-100 px-2 py-1 rounded">{sku}</code>
          </div>

          {/* Rating & Sales */}
          <div className="flex items-center gap-4 mt-3">
            {rating && (
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{rating.toFixed(1)}</span>
                <span className="text-gray-600">({reviewCount} reviews)</span>
              </div>
            )}
            {totalSold > 0 && (
              <>
                <span className="text-gray-300">·</span>
                <span className="text-gray-600">{totalSold.toLocaleString()} sold</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Views</p>
                  <p className="text-2xl font-bold mt-1">{stats.totalViews.toLocaleString()}</p>
                </div>
                {formatTrend(stats.viewsTrend)}
              </div>
              <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: "60%" }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Sales</p>
                  <p className="text-2xl font-bold mt-1">{stats.totalSales.toLocaleString()}</p>
                </div>
                {formatTrend(stats.salesTrend)}
              </div>
              <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: "45%" }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600">Conversion Rate</p>
                  <p className="text-2xl font-bold mt-1">{stats.conversionRate.toFixed(1)}%</p>
                </div>
                {formatTrend(stats.conversionTrend)}
              </div>
              <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 transition-all duration-300"
                  style={{ width: `${Math.min(stats.conversionRate, 100)}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600">Revenue</p>
                  <p className="text-2xl font-bold mt-1">${stats.revenue.toLocaleString()}</p>
                </div>
                {formatTrend(stats.revenueTrend)}
              </div>
              <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 transition-all duration-300"
                  style={{ width: "75%" }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
