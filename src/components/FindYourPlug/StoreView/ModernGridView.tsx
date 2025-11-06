"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import {
    ArrowLeft,
    Star,
    MapPin,
    Clock,
    Phone,
    Heart,
    Share2,
    CheckCircle,
    MessageCircle,
    Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { StoreDiscoveryDto } from "@/lib/api/types";

interface ModernGridViewProps {
    store: StoreDiscoveryDto;
}

export function ModernGridView({ store }: ModernGridViewProps) {
    const router = useRouter();

    const hasSubdomain = store.subdomain && store.subdomainActive;
    const storeUrl = hasSubdomain
        ? `/store/${store.subdomain}`
        : store.storeUrl || `/stores/${store.storeSlug}`;

    // Mock data for products
    const featuredProducts = [
        {
            id: "1",
            name: "Premium Product",
            description: "High-quality craftsmanship and design",
            price: 299,
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
        },
        {
            id: "2",
            name: "Bestseller Item",
            description: "Customer favorite choice",
            price: 399,
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
        },
        {
            id: "3",
            name: "New Arrival",
            description: "Latest addition to our collection",
            price: 499,
            image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500",
        },
        {
            id: "4",
            name: "Featured Item",
            description: "Top rated by customers",
            price: 599,
            image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=500",
        },
    ];

    // Mock reviews
    const reviews = [
        {
            id: "1",
            rating: 5,
            comment:
                "Excellent service and great products! The quality exceeded my expectations. Highly recommended!",
            userName: "Sarah Johnson",
            date: "2024-10-20",
        },
        {
            id: "2",
            rating: 5,
            comment: "Amazing experience from start to finish. Will definitely be back!",
            userName: "Michael Chen",
            date: "2024-10-18",
        },
        {
            id: "3",
            rating: 4,
            comment: "Good quality products and friendly staff. Very satisfied with my purchase.",
            userName: "Emma Davis",
            date: "2024-10-15",
        },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b z-10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
                            <ArrowLeft className="h-4 w-4" /> Back
                        </Button>
                        <div className="flex gap-2">
                            <Button variant="outline" size="icon">
                                <Share2 className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon">
                                <Heart className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Store Header Card */}
                <Card className="mb-8 overflow-hidden">
                    <div className="grid md:grid-cols-2 gap-0">
                        <div className="aspect-square md:aspect-auto relative">
                            {store.logo || store.storeCoverPhoto ? (
                                <Image
                                    src={store.logo || store.storeCoverPhoto || ""}
                                    alt={store.storeName}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-400" />
                            )}
                        </div>
                        <div className="p-8">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <h1 className="text-3xl font-bold">{store.storeName}</h1>
                                        {store.verified && <CheckCircle className="h-6 w-6 text-blue-500" />}
                                    </div>
                                    {store.storeCategory && (
                                        <Badge className="mb-4">{store.storeCategory.name}</Badge>
                                    )}
                                </div>
                            </div>

                            <p className="text-gray-600 mb-6">
                                {store.storeDescription || "Discover quality products and exceptional service"}
                            </p>

                            <div className="flex items-center gap-2 mb-6">
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-5 w-5 ${i < Math.floor(store.averageRating || 0)
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-gray-300"
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-lg font-semibold">
                                    {store.averageRating?.toFixed(1) || "N/A"}
                                </span>
                                <span className="text-gray-500">• {store.totalRatings || 0} reviews</span>
                            </div>

                            <div className="space-y-3 mb-6">
                                {(store.storeLocationCity || store.storeAddress) && (
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <MapPin className="h-5 w-5" />
                                        <span>
                                            {store.storeLocationCity || store.storeAddress}
                                            {store.storeLocationState && `, ${store.storeLocationState}`}
                                        </span>
                                    </div>
                                )}
                                {(store.storeTimeOpen || store.storeTimeClose) && (
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <Clock className="h-5 w-5" />
                                        <span className="text-green-600">Open</span>
                                        <span>
                                            • {store.storeTimeOpen || "9:00 AM"} - {store.storeTimeClose || "9:00 PM"}
                                        </span>
                                    </div>
                                )}
                                {store.phone && (
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <Phone className="h-5 w-5" />
                                        <a href={`tel:${store.phone}`} className="hover:text-primary">
                                            {store.phone}
                                        </a>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    className="flex-1"
                                    onClick={() => {
                                        if (hasSubdomain) {
                                            router.push(storeUrl);
                                        } else {
                                            window.open(storeUrl, "_blank");
                                        }
                                    }}
                                >
                                    <Globe className="h-4 w-4 mr-2" />
                                    Visit Store
                                </Button>
                                {store.email && (
                                    <Button
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => window.open(`mailto:${store.email}`, "_blank")}
                                    >
                                        Contact
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Quick Info Grid */}
                <div className="grid md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: "Free Shipping", icon: "🚚" },
                        { label: "30-Day Returns", icon: "↩️" },
                        { label: "24/7 Support", icon: "💬" },
                        { label: "Secure Payment", icon: "🔒" },
                    ].map((item, i) => (
                        <Card key={i}>
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl mb-2">{item.icon}</div>
                                <p className="text-sm font-medium">{item.label}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* About Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-6">About This Store</h2>
                    <Card>
                        <CardContent className="p-6">
                            <p className="text-gray-600 mb-4">
                                {store.storeDescription || "Welcome to our store!"}
                            </p>
                            {store.storeHeroHeadline && (
                                <p className="text-lg font-semibold text-gray-900 mb-2">
                                    {store.storeHeroHeadline}
                                </p>
                            )}
                            {store.storeHeroTagline && <p className="text-gray-600 mb-4">{store.storeHeroTagline}</p>}
                            <p className="text-gray-600">
                                We pride ourselves on offering premium products with exceptional customer service. Our
                                team is dedicated to ensuring your satisfaction with every purchase.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Products Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">Featured Products</h2>
                        <Button
                            variant="link"
                            onClick={() => {
                                if (hasSubdomain) {
                                    router.push(storeUrl);
                                } else {
                                    window.open(storeUrl, "_blank");
                                }
                            }}
                        >
                            View All →
                        </Button>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredProducts.map((product) => (
                            <Card key={product.id} className="group hover:shadow-xl transition-all">
                                <CardContent className="p-0">
                                    <div className="aspect-square overflow-hidden relative">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h4 className="font-semibold mb-2 line-clamp-1">{product.name}</h4>
                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                            {product.description}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xl font-bold">${product.price}</span>
                                            <Button size="sm">Add</Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Location Map */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-6">Location & Hours</h2>
                    <Card>
                        <CardContent className="p-0">
                            <div className="grid md:grid-cols-2 gap-0">
                                <div className="aspect-video md:aspect-auto relative">
                                    <Image
                                        src="https://images.unsplash.com/photo-1548345680-f5475ea5df84?w=800"
                                        alt="Map"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="p-6">
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold mb-3">Address</h3>
                                        <p className="text-gray-600 mb-2">
                                            {store.storeAddress || store.storeLocationCity || "Visit us in store"}
                                            {store.storeLocationState && `, ${store.storeLocationState}`}
                                        </p>
                                        <Button variant="link" className="p-0 h-auto">
                                            Get directions →
                                        </Button>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold mb-3">Business Hours</h3>
                                        <div className="space-y-2 text-sm">
                                            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
                                                <div key={day} className="flex justify-between">
                                                    <span className="text-gray-600">{day}</span>
                                                    <span>
                                                        {store.storeTimeOpen || "9:00 AM"} -{" "}
                                                        {store.storeTimeClose || "9:00 PM"}
                                                    </span>
                                                </div>
                                            ))}
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Saturday</span>
                                                <span>10:00 AM - 8:00 PM</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Sunday</span>
                                                <span>11:00 AM - 6:00 PM</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Reviews Section */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">Customer Reviews</h2>
                        <Button variant="outline">Write a Review</Button>
                    </div>

                    <div className="grid lg:grid-cols-4 gap-8">
                        {/* Rating Summary */}
                        <Card>
                            <CardContent className="p-6">
                                <div className="text-center mb-6">
                                    <div className="text-5xl font-bold mb-2">
                                        {store.averageRating?.toFixed(1) || "N/A"}
                                    </div>
                                    <div className="flex items-center justify-center gap-1 mb-2">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-4 w-4 ${i < Math.floor(store.averageRating || 0)
                                                        ? "fill-yellow-400 text-yellow-400"
                                                        : "text-gray-300"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-sm text-gray-600">{store.totalRatings || 0} reviews</p>
                                </div>

                                <Separator className="my-4" />

                                <div className="space-y-2">
                                    {[
                                        { stars: 5, count: 85 },
                                        { stars: 4, count: 10 },
                                        { stars: 3, count: 3 },
                                        { stars: 2, count: 1 },
                                        { stars: 1, count: 1 },
                                    ].map((item) => (
                                        <div key={item.stars} className="flex items-center gap-2 text-sm">
                                            <span className="w-8">{item.stars} ⭐</span>
                                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-yellow-400"
                                                    style={{ width: `${item.count}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Reviews List */}
                        <div className="lg:col-span-3 space-y-4">
                            {reviews.map((review) => (
                                <Card key={review.id}>
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex-shrink-0" />
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <p className="font-semibold">{review.userName}</p>
                                                        <div className="flex items-center gap-1 mt-1">
                                                            {Array.from({ length: 5 }).map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className={`h-3 w-3 ${i < review.rating
                                                                            ? "fill-yellow-400 text-yellow-400"
                                                                            : "text-gray-300"
                                                                        }`}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <span className="text-sm text-gray-500">
                                                        {new Date(review.date).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-gray-600 mb-3">{review.comment}</p>
                                                <div className="flex gap-4 text-sm text-gray-500">
                                                    <button className="hover:text-gray-700">Helpful</button>
                                                    <button className="hover:text-gray-700">
                                                        <MessageCircle className="h-4 w-4 inline mr-1" />
                                                        Reply
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
