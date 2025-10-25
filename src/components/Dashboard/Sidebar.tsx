'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    LayoutDashboardIcon,
    StoreIcon,
    ShoppingCartIcon,
    BarChart3Icon,
    SettingsIcon,
    HelpCircleIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    PlusIcon,
    FileTextIcon,
    BellIcon,
    CheckSquareIcon,
} from 'lucide-react';

import { ViewMode } from './ViewModeToggle';
import Logo from '../Logo';

interface SidebarProps {
    collapsed: boolean;
    onToggle: () => void;
    userName: string;
    userIntent: 'business-listings' | 'ecommerce' | 'mixed' | 'new-user';
    pendingTasksCount?: number;
    unreadNotificationsCount?: number;
    viewMode?: ViewMode;
}

export function Sidebar({
    collapsed,
    onToggle,
    userName,
    userIntent,
    pendingTasksCount = 0,
    unreadNotificationsCount = 0,
    viewMode = 'all',
}: SidebarProps) {
    const router = useRouter();
    const pathname = usePathname();

    const showListings = viewMode === 'all' || viewMode === 'listings';
    const showEcommerce = viewMode === 'all' || viewMode === 'ecommerce';

    const getIntentBadge = () => {
        switch (userIntent) {
            case 'business-listings':
                return { label: 'findYourPlug', color: 'bg-green-500 text-white' };
            case 'ecommerce':
                return { label: 'E-commerce', color: 'bg-orange-500 text-white' };
            case 'mixed':
                return { label: 'All', color: 'bg-indigo-500 text-white' };
            default:
                return { label: 'New User', color: 'bg-purple-500 text-white' };
        }
    };

    const intentBadge = getIntentBadge();

    const navItems = [
        { icon: LayoutDashboardIcon, label: 'Dashboard', path: '/findyourplug/dashboard' },
        ...(showListings ? [{ icon: StoreIcon, label: 'Business Listings', path: '/findyourplug/dashboard/listings' }] : []),
        ...(showEcommerce ? [{ icon: ShoppingCartIcon, label: 'E-commerce Stores', path: '/findyourplug/dashboard/stores' }] : []),
        {
            icon: CheckSquareIcon,
            label: 'Tasks',
            path: '/findyourplug/dashboard/tasks',
            badge: pendingTasksCount,
        },
        {
            icon: BellIcon,
            label: 'Notifications',
            path: '/findyourplug/dashboard/notifications',
            badge: unreadNotificationsCount,
        },
        { icon: BarChart3Icon, label: 'Analytics', path: '/findyourplug/dashboard/analytics' },
        { icon: SettingsIcon, label: 'Settings', path: '/findyourplug/dashboard/settings' },
    ];

    const quickActions = [
        ...(showEcommerce ? [{ icon: PlusIcon, label: 'Create Store', path: '/findyourplug/dashboard/stores/create' }] : []),
        ...(showListings ? [{ icon: FileTextIcon, label: 'New Listing', path: '/findyourplug/dashboard/listings/create' }] : []),
    ];

    return (
        <aside
            className={`fixed left-0 top-0 h-screen bg-background border-r border-border transition-all duration-300 z-50 ${collapsed ? 'w-16' : 'w-[280px]'
                }`}
        >
            <ScrollArea className="h-full">
                <div className="flex flex-col h-full">
                    <div className="p-4 flex items-center justify-between min-h-[80px]">
                        {!collapsed && (
                            <Logo />
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onToggle}
                            className="hover:bg-accent"
                            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        >
                            {collapsed ? (
                                <ChevronRightIcon size={20} strokeWidth={2} />
                            ) : (
                                <ChevronLeftIcon size={20} strokeWidth={2} />
                            )}
                        </Button>
                    </div>

                    <div className="px-4 pb-4">
                        <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                                <AvatarImage src="" alt={userName} />
                                <AvatarFallback className="bg-primary text-primary-foreground">
                                    {userName.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            {!collapsed && (
                                <div className="flex-1 transition-opacity duration-200">
                                    <p className="font-medium text-sm text-foreground">{userName}</p>
                                    <Badge className={`${intentBadge.color} text-xs mt-1`}>{intentBadge.label}</Badge>
                                </div>
                            )}
                        </div>
                    </div>

                    <Separator />

                    <nav className="flex-1 px-3 py-4">
                        <div className="space-y-1">
                            {navItems.map((item) => {
                                const isActive =
                                    pathname === item.path ||
                                    (item.path !== '/findyourplug/dashboard' && pathname?.startsWith(item.path));

                                return (
                                    <Button
                                        key={item.label}
                                        variant="ghost"
                                        onClick={() => router.push(item.path)}
                                        className={`w-full justify-start gap-3 h-12 relative ${isActive ? 'bg-accent text-accent-foreground' : 'hover:bg-accent'
                                            }`}
                                    >
                                        <item.icon size={20} strokeWidth={2} />
                                        {!collapsed && (
                                            <>
                                                <span className="font-normal flex-1 text-left transition-opacity duration-200">
                                                    {item.label}
                                                </span>
                                                {item.badge && item.badge > 0 && (
                                                    <Badge className="bg-red-500 text-white h-5 min-w-5 flex items-center justify-center px-1.5">
                                                        {item.badge}
                                                    </Badge>
                                                )}
                                            </>
                                        )}
                                        {collapsed && item.badge && item.badge > 0 && (
                                            <Badge className="absolute -top-1 -right-1 bg-red-500 text-white h-4 w-4 flex items-center justify-center p-0 text-xs">
                                                {item.badge}
                                            </Badge>
                                        )}
                                    </Button>
                                );
                            })}
                        </div>
                    </nav>

                    <Separator />

                    <div className="p-3 space-y-2">
                        {!collapsed && (
                            <p className="text-xs font-medium text-muted-foreground px-3 mb-2 transition-opacity duration-200">
                                Quick Actions
                            </p>
                        )}
                        {quickActions.map((action) => (
                            <Button
                                key={action.label}
                                variant="ghost"
                                onClick={() => router.push(action.path)}
                                className="w-full justify-start gap-3 h-12 hover:bg-accent"
                            >
                                <action.icon size={20} strokeWidth={2} />
                                {!collapsed && (
                                    <span className="font-normal transition-opacity duration-200">{action.label}</span>
                                )}
                            </Button>
                        ))}
                    </div>

                    <Separator />

                    <div className="p-3">
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-3 h-12 hover:bg-accent"
                        >
                            <HelpCircleIcon size={20} strokeWidth={2} />
                            {!collapsed && (
                                <span className="font-normal transition-opacity duration-200">Help & Support</span>
                            )}
                        </Button>
                    </div>
                </div>
            </ScrollArea>
        </aside>
    );
}
