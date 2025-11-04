"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Store } from "@/lib/api/hooks/stores";
import {
  ShoppingCart,
  Building2,
  ExternalLink,
  Settings,
  TrendingUp,
  Eye,
  Package,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface StoreCardProps {
  store: Store;
  showTypeBadge?: boolean;
}

export function StoreCard({ store, showTypeBadge = false }: StoreCardProps) {
  const router = useRouter();
  const isEcommerce = store.storeType === "EXTERNAL";

  const handleManage = () => {
    router.push(`/findyourplug/dashboard/stores/${store.id}`);
  };

  const handleView = () => {
    if (store.storeUrl) {
      window.open(store.storeUrl, "_blank");
    } else {
      router.push(`/stores/slug/${store.storeSlug}`);
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all border-2 hover:border-primary/50">
      <CardHeader className="space-y-3">
        {/* Store Logo/Image */}
        <div className="relative w-full h-32 bg-muted rounded-lg overflow-hidden">
          {store.storeCoverPhoto ? (
            <Image
              src={store.storeCoverPhoto}
              alt={store.storeName}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {isEcommerce ? (
                <ShoppingCart className="w-12 h-12 text-muted-foreground/30" />
              ) : (
                <Building2 className="w-12 h-12 text-muted-foreground/30" />
              )}
            </div>
          )}

          {/* Status Badge */}
          <div className="absolute top-2 right-2">
            <Badge
              variant={store.status === "ACTIVE" ? "default" : "secondary"}
            >
              {store.status}
            </Badge>
          </div>
        </div>

        {/* Store Info */}
        <div>
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-lg line-clamp-1">
              {store.storeName}
            </h3>
            {showTypeBadge && (
              <Badge variant="outline" className="flex-shrink-0">
                {isEcommerce ? (
                  <>
                    <ShoppingCart className="w-3 h-3 mr-1" />
                    Store
                  </>
                ) : (
                  <>
                    <Building2 className="w-3 h-3 mr-1" />
                    Listing
                  </>
                )}
              </Badge>
            )}
          </div>

          {store.storeDescription && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {store.storeDescription}
            </p>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1">
              <Eye className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Views</span>
            </div>
            <p className="text-sm font-semibold">{store.views || 0}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1">
              <TrendingUp className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Rating</span>
            </div>
            <p className="text-sm font-semibold">
              {store.averageRating ? store.averageRating.toFixed(1) : "N/A"}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1">
              <Package className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Items</span>
            </div>
            <p className="text-sm font-semibold">0</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button onClick={handleManage} className="flex-1" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Manage
          </Button>
          <Button onClick={handleView} variant="outline" size="sm">
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
