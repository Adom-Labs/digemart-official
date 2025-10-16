'use client';

import { LayoutGrid, Store, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type ViewMode = 'all' | 'listings' | 'ecommerce';

interface ViewModeToggleProps {
    viewMode: ViewMode;
    onViewModeChange: (mode: ViewMode) => void;
    listingsCount?: number;
    storesCount?: number;
}

const viewModeConfig = {
    all: {
        label: 'All Views',
        icon: LayoutGrid,
        description: 'Business Listings & E-commerce',
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-50',
        borderColor: 'border-indigo-200',
        badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-200'
    },
    listings: {
        label: 'Listings Only',
        icon: Store,
        description: 'Business Listings',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        badgeColor: 'bg-green-100 text-green-700 border-green-200'
    },
    ecommerce: {
        label: 'E-commerce Only',
        icon: ShoppingCart,
        description: 'E-commerce Stores',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        badgeColor: 'bg-orange-100 text-orange-700 border-orange-200'
    }
};

export function ViewModeToggle({
    viewMode,
    onViewModeChange,
    listingsCount = 0,
    storesCount = 0
}: ViewModeToggleProps) {
    const currentView = viewModeConfig[viewMode];
    const CurrentIcon = currentView.icon;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    className={`gap-2 ${currentView.bgColor} ${currentView.borderColor} border-2 hover:shadow-md transition-all`}
                >
                    <CurrentIcon className={`h-4 w-4 ${currentView.color}`} />
                    <span className={currentView.color}>{currentView.label}</span>
                    {viewMode === 'all' && (
                        <Badge variant="secondary" className="ml-1">
                            {listingsCount + storesCount}
                        </Badge>
                    )}
                    {viewMode === 'listings' && (
                        <Badge variant="secondary" className={`ml-1 ${currentView.badgeColor}`}>
                            {listingsCount}
                        </Badge>
                    )}
                    {viewMode === 'ecommerce' && (
                        <Badge variant="secondary" className={`ml-1 ${currentView.badgeColor}`}>
                            {storesCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
                <DropdownMenuItem
                    onClick={() => onViewModeChange('all')}
                    className={`flex items-start gap-3 p-3 cursor-pointer ${viewMode === 'all' ? 'bg-indigo-50 border-l-4 border-l-indigo-500' : ''
                        }`}
                >
                    <LayoutGrid className={`h-5 w-5 mt-0.5 ${viewMode === 'all' ? 'text-indigo-600' : 'text-muted-foreground'}`} />
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                            <span className={viewMode === 'all' ? 'text-indigo-900' : ''}>All Views</span>
                            <Badge variant="secondary" className="text-xs">
                                {listingsCount + storesCount} total
                            </Badge>
                        </div>
                        <p className="text-muted-foreground">
                            Show both business listings and e-commerce stores
                        </p>
                    </div>
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => onViewModeChange('listings')}
                    className={`flex items-start gap-3 p-3 cursor-pointer ${viewMode === 'listings' ? 'bg-green-50 border-l-4 border-l-green-500' : ''
                        }`}
                >
                    <Store className={`h-5 w-5 mt-0.5 ${viewMode === 'listings' ? 'text-green-600' : 'text-muted-foreground'}`} />
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                            <span className={viewMode === 'listings' ? 'text-green-900' : ''}>Listings Only</span>
                            <Badge variant="secondary" className={`text-xs ${viewModeConfig.listings.badgeColor}`}>
                                {listingsCount} listings
                            </Badge>
                        </div>
                        <p className="text-muted-foreground">
                            Focus on external business directory listings
                        </p>
                    </div>
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => onViewModeChange('ecommerce')}
                    className={`flex items-start gap-3 p-3 cursor-pointer ${viewMode === 'ecommerce' ? 'bg-orange-50 border-l-4 border-l-orange-500' : ''
                        }`}
                >
                    <ShoppingCart className={`h-5 w-5 mt-0.5 ${viewMode === 'ecommerce' ? 'text-orange-600' : 'text-muted-foreground'}`} />
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                            <span className={viewMode === 'ecommerce' ? 'text-orange-900' : ''}>E-commerce Only</span>
                            <Badge variant="secondary" className={`text-xs ${viewModeConfig.ecommerce.badgeColor}`}>
                                {storesCount} stores
                            </Badge>
                        </div>
                        <p className="text-muted-foreground">
                            Focus on online store management and sales
                        </p>
                    </div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}