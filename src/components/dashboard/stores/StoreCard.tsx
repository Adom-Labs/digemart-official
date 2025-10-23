'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Eye, 
  Heart, 
  Star, 
  ShoppingBag, 
  DollarSign, 
  Package, 
  TrendingUp, 
  TrendingDown, 
  MoreVertical,
  ExternalLink,
  Settings,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Store } from '@/lib/api/hooks/stores';

interface StoreCardProps {
  store: Store;
  onEdit?: (store: Store) => void;
  onDelete?: (store: Store) => void;
  onViewAnalytics?: (store: Store) => void;
}

export function StoreCard({ store, onEdit, onDelete, onViewAnalytics }: StoreCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'SUSPENDED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'INTERNAL':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'EXTERNAL':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const storeUrl = store.subdomain 
    ? `${window.location.protocol}//${store.subdomain}.${window.location.host.split('.').slice(-2).join('.')}`
    : store.storeUrl;

  return (
    <Card className="overflow-hidden group hover:border-primary/50 transition-all duration-200 hover:shadow-lg">
      {/* Store Image/Cover */}
      <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        {store.storeCoverPhoto || store.storeHeroImage ? (
          <img
            src={store.storeCoverPhoto || store.storeHeroImage}
            alt={store.storeName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No cover image</p>
            </div>
          </div>
        )}
        
        {/* Status and Type Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className={getStatusColor(store.status)}>
            {store.status}
          </Badge>
          <Badge className={getTypeColor(store.storeType)}>
            {store.storeType}
          </Badge>
        </div>

        {/* Verified Badge */}
        {store.verified && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-green-600 text-white">
              ✓ Verified
            </Badge>
          </div>
        )}
      </div>

      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate">{store.storeName}</CardTitle>
            <p className="text-sm text-muted-foreground truncate">
              {store.storeCategory?.name || 'Uncategorized'}
            </p>
            {store.storeDescription && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {store.storeDescription}
              </p>
            )}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/findyourplug/dashboard/stores/${store.id}`}>
                  <Settings className="h-4 w-4 mr-2" />
                  Manage Store
                </Link>
              </DropdownMenuItem>
              {storeUrl && (
                <DropdownMenuItem asChild>
                  <a href={storeUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Live Store
                  </a>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => onViewAnalytics?.(store)}>
                <BarChart3 className="h-4 w-4 mr-2" />
                View Analytics
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEdit?.(store)}>
                Edit Store
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete?.(store)}
                className="text-red-600 focus:text-red-600"
              >
                Delete Store
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Store Metrics */}
        <div className="grid grid-cols-3 gap-4">
          <MetricItem 
            icon={Eye} 
            label="Views" 
            value={store.views.toLocaleString()} 
          />
          <MetricItem 
            icon={Heart} 
            label="Likes" 
            value={store.likes.toLocaleString()} 
          />
          <MetricItem 
            icon={Star} 
            label="Rating" 
            value={store.averageRating.toFixed(1)} 
            subValue={`${store.totalRatings} reviews`}
          />
        </div>

        {/* Store Info */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Location:</span>
            <span className="font-medium">{store.storeLocationCity}, {store.storeLocationState}</span>
          </div>
          {store.subdomain && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Subdomain:</span>
              <span className="font-medium text-blue-600">{store.subdomain}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Created:</span>
            <span className="font-medium">
              {new Date(store.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            asChild
          >
            <Link href={`/findyourplug/dashboard/stores/${store.id}`}>
              Manage
            </Link>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onViewAnalytics?.(store)}
          >
            Analytics
          </Button>
          {storeUrl && (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              asChild
            >
              <a href={storeUrl} target="_blank" rel="noopener noreferrer">
                View Live
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface MetricItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
  trend?: number;
  subValue?: string;
}

function MetricItem({ icon: Icon, label, value, trend, subValue }: MetricItemProps) {
  return (
    <div>
      <div className="flex items-center gap-1 text-muted-foreground mb-1">
        <Icon className="h-3 w-3" />
        <span className="text-xs">{label}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-sm font-bold">{value}</span>
        {trend !== undefined && (
          <span className={`text-xs font-semibold flex items-center ${
            trend >= 0 ? "text-green-600" : "text-red-600"
          }`}>
            {trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      {subValue && <p className="text-xs text-muted-foreground">{subValue}</p>}
    </div>
  );
}