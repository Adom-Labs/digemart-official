"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BellIcon,
  SearchIcon,
  SettingsIcon,
  UserIcon,
  LogOutIcon,
  MenuIcon,
} from "lucide-react";
import { ViewModeToggle, ViewMode } from "./ViewModeToggle";
import WrapContent from "../WrapContent";

interface HeaderProps {
  onMobileMenuToggle: () => void;
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
}

export function Header({
  onMobileMenuToggle,
  viewMode,
  onViewModeChange,
}: HeaderProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");

  const userName = session?.user?.name || "User";
  const unreadNotificationsCount = 0; // TODO: get from API

  return (
    <header className="fixed top-0 right-0 h-16 bg-background border-b border-border z-40 left-0 lg:left-[280px]">
      <WrapContent>
        <div className="h-full flex items-center justify-between gap-2 sm:gap-4">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onMobileMenuToggle}
            className="lg:hidden hover:bg-accent"
            aria-label="Toggle menu"
          >
            <MenuIcon size={20} strokeWidth={2} />
          </Button>

          {/* Search bar - hidden on small mobile, visible on sm+ */}
          <div className="hidden sm:flex flex-1 max-w-md">
            <div className="relative w-full">
              <SearchIcon
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                size={20}
                strokeWidth={2}
              />
              <Input
                type="search"
                placeholder="Search stores, tasks, analytics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>

          {/* Spacer for mobile */}
          <div className="flex-1 sm:hidden" />

          <div className="flex items-center gap-1 sm:gap-3">
            {/* View mode toggle - hidden on mobile */}
            {onViewModeChange && viewMode && (
              <div className="hidden md:block">
                <ViewModeToggle
                  viewMode={viewMode}
                  onViewModeChange={onViewModeChange}
                  listingsCount={3} // TODO: get from API
                  storesCount={2} // TODO: get from API
                />
              </div>
            )}

            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-accent"
              aria-label="Notifications"
              onClick={() =>
                router.push("/findyourplug/dashboard/notifications")
              }
            >
              <BellIcon size={18} strokeWidth={2} className="sm:w-5 sm:h-5" />
              {unreadNotificationsCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center p-0 bg-red-500 text-white text-[10px] sm:text-xs">
                  {unreadNotificationsCount}
                </Badge>
              )}
            </Button>

            {/* Settings - hidden on small mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-accent hidden sm:flex"
              aria-label="Settings"
              onClick={() => router.push("/findyourplug/dashboard/settings")}
            >
              <SettingsIcon size={20} strokeWidth={2} />
            </Button>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 mr-3 rounded-full hover:bg-accent"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={session?.user?.image || ""}
                      alt={userName}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {userName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="text-foreground">
                  My Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer"
                  onClick={() =>
                    router.push("/findyourplug/dashboard/identity")
                  }
                >
                  <UserIcon className="mr-2" size={16} strokeWidth={2} />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer"
                  onClick={() =>
                    router.push("/findyourplug/dashboard/settings")
                  }
                >
                  <SettingsIcon className="mr-2" size={16} strokeWidth={2} />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer"
                  onClick={() =>
                    signOut({ callbackUrl: "/findyourplug/login" })
                  }
                >
                  <LogOutIcon className="mr-2" size={16} strokeWidth={2} />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </WrapContent>
    </header>
  );
}
