"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import {
    ArrowLeft,
    Star,
    MapPin,
    Clock,
    Phone,
    Mail,
    Share2,
    Heart,
    CheckCircle,
    Award,
    Globe,
    Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { StoreDiscoveryDto } from "@/lib/api/types";

interface LargeMagazineViewProps {
    store: StoreDiscoveryDto;
}

export function LargeMagazineView({ store }: LargeMagazineViewProps) {
    const router = useRouter();

    const hasSubdomain = store.subdomain && store.subdomainActive;
    const storeUrl = hasSubdomain
        ? `/store/${store.subdomain}`
        : store.storeUrl || `/stores/${store.storeSlug}`;

    // Mock data for products
    const featuredProducts = [
        {
            id: "1",
            name: "Featured Product",
            description: "High-quality item with excellent reviews",
            price: 299,
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
        },
        {
            id: "2",
            name: "Bestseller",
            description: "Most popular choice among customers",
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
            name: "Premium Choice",
            description: "Top tier quality and craftsmanship",
            price: 599,
            image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=500",
        },
    ];

    // Mock reviews
    const reviews = [
        {
            id: "1",
            rating: 5,
            comment: "Outstanding service and quality! Exceeded all expectations. Highly recommend to everyone.",
            userName: "Sarah Johnson",
            date: "2024-10-20",
        },
        {
            id: "2",
            rating: 5,
            comment: "Amazing experience from start to finish. The attention to detail is impressive.",
            userName: "Michael Chen",
            date: "2024-10-18",
        },
        {
            id: "3",
            rating: 4,
            comment: "Great products and friendly service. Will definitely be coming back!",
            userName: "Emma Davis",
            date: "2024-10-15",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation Bar */}
            <div className="bg-white border-b sticky top-0 z-20">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Button variant="ghost" onClick={() => router.back()}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="icon">
                                <Share2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                                <Heart className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hero Banner */}
            <div className="relative h-72 bg-gradient-to-r from-blue-600 to-purple-600">
                <div className="absolute inset-0 overflow-hidden">
                    {store.storeCoverPhoto ? (
                        <Image
                            src={store.storeCoverPhoto}
                            alt={store.storeName}
                            fill
                            className="object-cover opacity-30"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-r from-blue-600 to-purple-600" />
                    )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                <div className="container mx-auto px-4 h-full flex items-end pb-8">
                    <div className="text-white">
                        <div className="flex items-center gap-3 mb-3">
                            {store.storeCategory && (
                                <Badge className="bg-white/20 backdrop-blur">{store.storeCategory.name}</Badge>
                            )}
                            {store.verified && (
                                <Badge className="bg-green-500/90 backdrop-blur">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Verified
                                </Badge>
                            )}
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-3">{store.storeName}</h1>
                        <p className="text-white/90 text-lg max-w-2xl">
                            {store.storeDescription || "Discover quality and excellence"}
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-16 pb-12 relative z-10">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 gap-4">
                            <Card>
                                <CardContent className="p-6 text-center">
                                    <div className="flex items-center justify-center gap-1 mb-2">
                                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                        <span className="text-2xl font-bold">
                                            {store.averageRating?.toFixed(1) || "N/A"}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600">{store.totalRatings || 0} Reviews</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6 text-center">
                                    <div className="text-2xl mb-2">
                                        <Award className="h-8 w-8 mx-auto text-purple-600" />
                                    </div>
                                    <p className="text-sm text-gray-600">Top Rated</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6 text-center">
                                    <div className="text-2xl font-bold mb-2">
                                        {featuredProducts.length}+
                                    </div>
                                    <p className="text-sm text-gray-600">Products</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Store Story */}
                        <Card>
                            <CardContent className="p-8">
                                <h2 className="text-2xl font-bold mb-4">Our Story</h2>
                                <div className="prose max-w-none">
                                    <p className="text-gray-600 mb-4">
                                        {store.storeDescription || "Welcome to our store!"}
                                    </p>
                                    {store.storeHeroHeadline && (
                                        <p className="text-lg font-semibold text-gray-900 mb-2">
                                            {store.storeHeroHeadline}
                                        </p>
                                    )}
                                    {store.storeHeroTagline && (
                                        <p className="text-gray-600 mb-4">{store.storeHeroTagline}</p>
                                    )}
                                    <p className="text-gray-600 mb-4">
                                        Founded with a passion for excellence, we&apos;ve been serving our community
                                        with dedication and commitment to quality. Every product we offer is carefully
                                        selected to meet the highest standards.
                                    </p>
                                    <p className="text-gray-600">
                                        Our team is committed to providing an exceptional shopping experience, from the
                                        moment you browse to the day your order arrives at your doorstep.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Photo Gallery */}
                        <Card>
                            <CardContent className="p-0">
                                <div className="p-6 pb-4">
                                    <h2 className="text-2xl font-bold">Gallery</h2>
                                </div>
                                <div className="grid grid-cols-2 gap-2 px-2 pb-2">
                                    <div className="aspect-video rounded-lg overflow-hidden relative">
                                        {store.logo ? (
                                            <Image src={store.logo} alt="Gallery 1" fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                <Package className="h-12 w-12 text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="aspect-video rounded-lg overflow-hidden relative">
                                        {store.storeCoverPhoto ? (
                                            <Image
                                                src={store.storeCoverPhoto}
                                                alt="Gallery 2"
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                <Package className="h-12 w-12 text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-span-2 aspect-[3/1] rounded-lg overflow-hidden relative">
                                        {store.storeHeroImage ? (
                                            <Image
                                                src={store.storeHeroImage}
                                                alt="Gallery 3"
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                <Package className="h-12 w-12 text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Products Showcase */}
                        <div>
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
                                    See All Products →
                                </Button>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-6">
                                {featuredProducts.map((product) => (
                                    <Card key={product.id} className="group hover:shadow-xl transition-all">
                                        <CardContent className="p-0">
                                            <div className="aspect-[4/3] overflow-hidden relative">
                                                <Image
                                                    src={product.image}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                                                />
                                            </div>
                                            <div className="p-4">
                                                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                                    {product.description}
                                                </p>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-2xl font-bold">${product.price}</span>
                                                    <Button>View Details</Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* Customer Reviews */}
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold">Customer Reviews</h2>
                                    <Button variant="outline" size="sm">
                                        Write Review
                                    </Button>
                                </div>

                                <div className="space-y-6">
                                    {reviews.map((review) => (
                                        <div key={review.id}>
                                            <div className="flex items-start gap-4">
                                                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex-shrink-0 flex items-center justify-center text-white font-semibold">
                                                    {review.userName.charAt(0)}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div>
                                                            <p className="font-semibold mb-1">{review.userName}</p>
                                                            <div className="flex items-center gap-1">
                                                                {Array.from({ length: 5 }).map((_, i) => (
                                                                    <Star
                                                                        key={i}
                                                                        className={`h-4 w-4 ${i < review.rating
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
                                                    <p className="text-gray-600">{review.comment}</p>
                                                </div>
                                            </div>
                                            {review.id !== reviews[reviews.length - 1].id && (
                                                <Separator className="mt-6" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Contact Card */}
                        <Card className="sticky top-24">
                            <CardContent className="p-6 space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                                    <div className="space-y-4">
                                        {store.storeAddress && (
                                            <div>
                                                <div className="flex items-center gap-2 text-gray-500 mb-1">
                                                    <MapPin className="h-4 w-4" />
                                                    <span className="text-sm">Address</span>
                                                </div>
                                                <p className="text-sm pl-6">
                                                    {store.storeAddress}
                                                    {store.storeLocationCity && `, ${store.storeLocationCity}`}
                                                    {store.storeLocationState && `, ${store.storeLocationState}`}
                                                </p>
                                            </div>
                                        )}

                                        {store.phone && (
                                            <div>
                                                <div className="flex items-center gap-2 text-gray-500 mb-1">
                                                    <Phone className="h-4 w-4" />
                                                    <span className="text-sm">Phone</span>
                                                </div>
                                                <a
                                                    href={`tel:${store.phone}`}
                                                    className="text-sm pl-6 text-blue-600 hover:underline"
                                                >
                                                    {store.phone}
                                                </a>
                                            </div>
                                        )}

                                        {store.email && (
                                            <div>
                                                <div className="flex items-center gap-2 text-gray-500 mb-1">
                                                    <Mail className="h-4 w-4" />
                                                    <span className="text-sm">Email</span>
                                                </div>
                                                <a
                                                    href={`mailto:${store.email}`}
                                                    className="text-sm pl-6 text-blue-600 hover:underline"
                                                >
                                                    {store.email}
                                                </a>
                                            </div>
                                        )}

                                        {(store.storeTimeOpen || store.storeTimeClose) && (
                                            <div>
                                                <div className="flex items-center gap-2 text-gray-500 mb-1">
                                                    <Clock className="h-4 w-4" />
                                                    <span className="text-sm">Hours</span>
                                                </div>
                                                <div className="text-sm pl-6">
                                                    <p className="text-green-600 mb-1">Open Now</p>
                                                    <p className="text-gray-600">
                                                        {store.storeWeekOpen || "Mon"} - {store.storeWeekClose || "Fri"}:{" "}
                                                        {store.storeTimeOpen || "9AM"} - {store.storeTimeClose || "9PM"}
                                                    </p>
                                                    <p className="text-gray-600">Sat-Sun: 10AM - 8PM</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-3">
                                    <Button
                                        className="w-full"
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
                                            className="w-full"
                                            onClick={() => window.open(`mailto:${store.email}`, "_blank")}
                                        >
                                            Message Store
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Map Card */}
                        <Card>
                            <CardContent className="p-0">
                                <div className="aspect-square rounded-lg overflow-hidden relative">
                                    <Image
                                        src="https://images.unsplash.com/photo-1548345680-f5475ea5df84?w=600"
                                        alt="Map"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="p-4">
                                    <Button variant="link" className="p-0 h-auto w-full justify-center">
                                        View on Map →
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Store Info */}
                        {store.verified && (
                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-semibold mb-4">Store Info</h3>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold text-xl">
                                            {store.storeName.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-semibold">{store.storeName}</p>
                                            <p className="text-sm text-gray-600">Trusted Merchant</p>
                                        </div>
                                    </div>
                                    {store.featured && (
                                        <Badge className="w-full justify-center py-2 bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                                            ⭐ Featured Store
                                        </Badge>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
