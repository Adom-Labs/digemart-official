'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BellIcon, SearchIcon, SettingsIcon, UserIcon, LogOutIcon } from 'lucide-react';
import { ViewModeToggle, ViewMode } from './ViewModeToggle';

interface HeaderProps {
    sidebarCollapsed: boolean;
    viewMode?: ViewMode;
    onViewModeChange?: (mode: ViewMode) => void;
}

export function Header({ sidebarCollapsed, viewMode, onViewModeChange }: HeaderProps) {
    const router = useRouter();
    const { data: session } = useSession();
    const [searchQuery, setSearchQuery] = useState('');

    const userName = session?.user?.name || 'User';
    const unreadNotificationsCount = 0; // TODO: get from API

    return (
        <header
            className={`fixed top-0 right-0 h-16 bg-background border-b border-border z-40 transition-all duration-200 ${sidebarCollapsed ? 'left-16' : 'left-[280px]'
                }`}
        >
            <div className="h-full px-6 flex items-center justify-between gap-4">
                <div className="flex-1 max-w-md">
                    <div className="relative">
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

                <div className="flex items-center gap-3">
                    {onViewModeChange && viewMode && (
                        <ViewModeToggle
                            viewMode={viewMode}
                            onViewModeChange={onViewModeChange}
                            listingsCount={3} // TODO: get from API
                            storesCount={2} // TODO: get from API
                        />
                    )}

                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative hover:bg-accent"
                        aria-label="Notifications"
                        onClick={() => router.push('/findyourplug/dashboard/notifications')}
                    >
                        <BellIcon size={20} strokeWidth={2} />
                        {unreadNotificationsCount > 0 && (
                            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                                {unreadNotificationsCount}
                            </Badge>
                        )}
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-accent"
                        aria-label="Settings"
                        onClick={() => router.push('/findyourplug/dashboard/settings')}
                    >
                        <SettingsIcon size={20} strokeWidth={2} />
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="relative h-10 w-10 rounded-full hover:bg-accent"
                            >
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={session?.user?.image || ''} alt={userName} />
                                    <AvatarFallback className="bg-primary text-primary-foreground">
                                        {userName.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel className="text-foreground">My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer"
                                onClick={() => router.push('/findyourplug/dashboard/identity')}
                            >
                                <UserIcon className="mr-2" size={16} strokeWidth={2} />
                                Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="text-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer"
                                onClick={() => router.push('/findyourplug/dashboard/settings')}
                            >
                                <SettingsIcon className="mr-2" size={16} strokeWidth={2} />
                                Settings
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer"
                                onClick={() => signOut({ callbackUrl: '/findyourplug/login' })}
                            >
                                <LogOutIcon className="mr-2" size={16} strokeWidth={2} />
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}