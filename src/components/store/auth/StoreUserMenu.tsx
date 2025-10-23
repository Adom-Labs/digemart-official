"use client";

import React from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  User,
  ShoppingBag,
  Heart,
  Settings,
  LogOut,
  Package,
  MapPin,
  ChevronDown,
} from "lucide-react";
import { useStoreAuth } from "./StoreAuthProvider";
import { useStore } from "../StoreProvider";

interface StoreUserMenuProps {
  className?: string;
}

export function StoreUserMenu({ className }: StoreUserMenuProps) {
  const { user, storeProfile, isStoreCustomer, isAuthenticated } =
    useStoreAuth();
  const { store } = useStore();
  const router = useRouter();

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut({
      callbackUrl: window.location.origin + window.location.pathname,
    });
  };

  const navigateToAccount = () => {
    router.push(`/store/${store.subdomain}/account`);
  };

  const navigateToOrders = () => {
    router.push(`/store/${store.subdomain}/account/orders`);
  };

  const navigateToPreferences = () => {
    router.push(`/store/${store.subdomain}/account/preferences`);
  };

  const navigateToAddresses = () => {
    router.push(`/store/${store.subdomain}/account/addresses`);
  };

  const navigateToWishlist = () => {
    router.push(`/store/${store.subdomain}/wishlist`);
  };

  const navigateToMainDashboard = () => {
    router.push("/findyourplug/dashboard");
  };

  // Get user initials for avatar fallback
  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={`flex items-center space-x-2 h-auto p-2 ${className}`}
        >
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user.image || undefined}
              alt={user.name || "User"}
            />
            <AvatarFallback className="text-xs">
              {getUserInitials(user.name || "User")}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:flex flex-col items-start">
            <span className="text-sm font-medium truncate max-w-24">
              {user.name || "User"}
            </span>
            {isStoreCustomer && storeProfile && (
              <span className="text-xs text-muted-foreground">
                {storeProfile.totalOrders} orders
              </span>
            )}
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
            {isStoreCustomer && storeProfile && (
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="secondary" className="text-xs">
                  Customer since{" "}
                  {new Date(storeProfile.createdAt).getFullYear()}
                </Badge>
                {storeProfile.totalOrders > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {storeProfile.totalOrders} orders
                  </Badge>
                )}
              </div>
            )}
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Store-specific account actions */}
        <DropdownMenuItem onClick={navigateToAccount}>
          <User className="mr-2 h-4 w-4" />
          <span>Account Dashboard</span>
        </DropdownMenuItem>

        {isStoreCustomer && (
          <DropdownMenuItem onClick={navigateToOrders}>
            <Package className="mr-2 h-4 w-4" />
            <span>My Orders</span>
            {storeProfile && storeProfile.totalOrders > 0 && (
              <Badge variant="secondary" className="ml-auto text-xs">
                {storeProfile.totalOrders}
              </Badge>
            )}
          </DropdownMenuItem>
        )}

        <DropdownMenuItem onClick={navigateToWishlist}>
          <Heart className="mr-2 h-4 w-4" />
          <span>Wishlist</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={navigateToAddresses}>
          <MapPin className="mr-2 h-4 w-4" />
          <span>Addresses</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={navigateToPreferences}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Store Preferences</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Global platform actions */}
        <DropdownMenuItem onClick={navigateToMainDashboard}>
          <ShoppingBag className="mr-2 h-4 w-4" />
          <span>Main Dashboard</span>
        </DropdownMenuItem>

        {/* Show store management link if user has stores */}
        {user.stores && user.stores.length > 0 && (
          <DropdownMenuItem
            onClick={() => router.push("/findyourplug/dashboard/stores")}
          >
            <Package className="mr-2 h-4 w-4" />
            <span>My Stores</span>
            <Badge variant="secondary" className="ml-auto text-xs">
              {user.stores.length}
            </Badge>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        {/* Store-specific customer info */}
        {isStoreCustomer && storeProfile && (
          <>
            <DropdownMenuLabel className="font-normal">
              <div className="text-xs text-muted-foreground">
                At {store.storeName}
              </div>
            </DropdownMenuLabel>

            <div className="px-2 py-1.5">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-center p-2 bg-muted/50 rounded">
                  <div className="font-medium">{storeProfile.totalOrders}</div>
                  <div className="text-muted-foreground">Orders</div>
                </div>
                <div className="text-center p-2 bg-muted/50 rounded">
                  <div className="font-medium">
                    ${storeProfile.totalSpent.toFixed(2)}
                  </div>
                  <div className="text-muted-foreground">Spent</div>
                </div>
              </div>
            </div>

            <DropdownMenuSeparator />
          </>
        )}

        {/* Sign out */}
        <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Simplified version for mobile or compact displays
export function StoreUserMenuCompact({ className }: StoreUserMenuProps) {
  const { user, isAuthenticated } = useStoreAuth();
  const router = useRouter();

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut({
      callbackUrl: window.location.origin + window.location.pathname,
    });
  };

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className={`p-1 ${className}`}>
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user.image || undefined}
              alt={user.name || "User"}
            />
            <AvatarFallback className="text-xs">
              {getUserInitials(user.name || "User")}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none truncate">
              {user.name}
            </p>
            <p className="text-xs leading-none text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() =>
            router.push(
              `/store/${window.location.hostname.split(".")[0]}/account`
            )
          }
        >
          <User className="mr-2 h-4 w-4" />
          <span>Account</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => router.push("/findyourplug/dashboard")}
        >
          <ShoppingBag className="mr-2 h-4 w-4" />
          <span>Dashboard</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
