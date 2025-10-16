import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EyeIcon, HeartIcon, ShoppingBagIcon, DollarSignIcon, TrendingUpIcon, TrendingDownIcon, EditIcon, BarChart3Icon } from 'lucide-react';
import { ViewMode } from './ViewModeToggle';
import { DashboardStoreDto, StoresStatsDto, StoreType } from '@/lib/api/types';

interface StoreOverviewProps {
    viewMode?: ViewMode;
    listings: DashboardStoreDto[];
    ecommerce: DashboardStoreDto[];
    stats: StoresStatsDto;
}

export function StoreOverview({ viewMode = 'all', listings, ecommerce, stats }: StoreOverviewProps) {
    const showListings = viewMode === 'all' || viewMode === 'listings';
    const showEcommerce = viewMode === 'all' || viewMode === 'ecommerce';

    const renderStoreCard = (store: DashboardStoreDto) => {
        const isPositiveTrend = store.trend > 0;
        const isBusiness = store.type === StoreType.INTERNAL; // INTERNAL = business listings

        return (
            <Card key={store.id} className="border-border bg-card text-card-foreground">
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <CardTitle className="text-lg text-foreground mb-2">{store.name}</CardTitle>
                            <Badge
                                className={
                                    isBusiness
                                        ? 'bg-green-500 text-white'
                                        : 'bg-orange-500 text-white'
                                }
                            >
                                {isBusiness ? 'Business Listing' : 'E-commerce'}
                            </Badge>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                size="icon"
                                variant="ghost"
                                className="hover:bg-accent"
                            >
                                <EditIcon size={16} strokeWidth={2} />
                            </Button>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="hover:bg-accent"
                            >
                                <BarChart3Icon size={16} strokeWidth={2} />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                                <EyeIcon className="text-muted-foreground" size={20} strokeWidth={2} />
                                <div>
                                    <p className="text-sm text-muted-foreground">Views</p>
                                    <p className="text-lg font-semibold text-foreground">{store.views.toLocaleString()}</p>
                                </div>
                            </div>
                            {isBusiness && store.likes !== undefined && (
                                <div className="flex items-center gap-2">
                                    <HeartIcon className="text-muted-foreground" size={20} strokeWidth={2} />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Likes</p>
                                        <p className="text-lg font-semibold text-foreground">{store.likes}</p>
                                    </div>
                                </div>
                            )}
                            {!isBusiness && store.orders !== undefined && (
                                <div className="flex items-center gap-2">
                                    <ShoppingBagIcon className="text-muted-foreground" size={20} strokeWidth={2} />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Orders</p>
                                        <p className="text-lg font-semibold text-foreground">{store.orders}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {!isBusiness && store.revenue !== undefined && (
                            <div className="flex items-center gap-2">
                                <DollarSignIcon className="text-muted-foreground" size={20} strokeWidth={2} />
                                <div>
                                    <p className="text-sm text-muted-foreground">Revenue</p>
                                    <p className="text-lg font-semibold text-foreground">
                                        ${store.revenue.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-2">
                            {isPositiveTrend ? (
                                <TrendingUpIcon className="text-green-600" size={20} strokeWidth={2} />
                            ) : (
                                <TrendingDownIcon className="text-red-600" size={20} strokeWidth={2} />
                            )}
                            <span
                                className={`text-sm font-medium ${isPositiveTrend ? 'text-green-600' : 'text-red-600'
                                    }`}
                            >
                                {isPositiveTrend ? '+' : ''}
                                {store.trend}%
                            </span>
                            <span className="text-sm text-muted-foreground">vs last week</span>
                        </div>

                        {/* Placeholder for chart */}
                        <div className="h-16 bg-muted rounded flex items-center justify-center text-muted-foreground text-sm">
                            Chart Placeholder
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-6">Store Overview</h2>

            <div className="space-y-8">
                {showListings && (
                    <div>
                        <h3 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            Business Listings
                        </h3>
                        {listings.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {listings.map(renderStoreCard)}
                            </div>
                        ) : (
                            <Card className="border-border bg-card text-card-foreground p-8 text-center">
                                <p className="text-muted-foreground mb-4">No business listings yet</p>
                                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                                    Create Your First Listing
                                </Button>
                            </Card>
                        )}
                    </div>
                )}

                {showEcommerce && (
                    <div>
                        <h3 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                            E-commerce Stores
                        </h3>
                        {ecommerce.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {ecommerce.map(renderStoreCard)}
                            </div>
                        ) : (
                            <Card className="border-border bg-card text-card-foreground p-8 text-center">
                                <p className="text-muted-foreground mb-4">No e-commerce stores yet</p>
                                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                                    Create Your First Store
                                </Button>
                            </Card>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}
