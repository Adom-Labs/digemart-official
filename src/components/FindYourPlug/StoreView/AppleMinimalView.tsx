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
    CheckCircle,
    Globe,
    ExternalLink,
    Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { StoreDiscoveryDto } from "@/lib/api/types";

interface AppleMinimalViewProps {
    store: StoreDiscoveryDto;
}

export function AppleMinimalView({ store }: AppleMinimalViewProps) {
    const router = useRouter();

    const hasSubdomain = store.subdomain && store.subdomainActive;
    const storeUrl = hasSubdomain
        ? `/store/${store.subdomain}`
        : store.storeUrl || `/stores/${store.storeSlug}`;

    // Mock data for products - in real app, fetch from API
    const featuredProducts = [
        {
            id: "1",
            name: "Premium Product",
            description: "High-quality craftsmanship",
            price: 299,
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
        },
        {
            id: "2",
            name: "Signature Item",
            description: "Best seller",
            price: 399,
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
        },
        {
            id: "3",
            name: "Limited Edition",
            description: "Exclusive design",
            price: 499,
            image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500",
        },
        {
            id: "4",
            name: "Special Collection",
            description: "Curated selection",
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
                "Absolutely love this store! The quality is exceptional and the customer service is outstanding. Highly recommend to anyone looking for premium products.",
            userName: "Sarah Johnson",
            date: "2024-10-15",
        },
        {
            id: "2",
            rating: 5,
            comment:
                "Best shopping experience I've had in years. The attention to detail and quality of products is unmatched.",
            userName: "Michael Chen",
            date: "2024-10-10",
        },
        {
            id: "3",
            rating: 4,
            comment:
                "Great store with amazing products. Delivery was fast and everything was packaged beautifully.",
            userName: "Emma Davis",
            date: "2024-10-05",
        },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Minimal Header */}
            <div className="border-b">
                <div className="max-w-7xl mx-auto px-8 py-4">
                    <Button variant="ghost" onClick={() => router.back()} className="text-sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                </div>
            </div>

            {/* Hero Section - Minimal */}
            <div className="max-w-7xl mx-auto px-8 py-20">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="flex items-center justify-center gap-2 mb-6">
                        {store.storeCategory && (
                            <Badge variant="outline" className="text-sm">
                                {store.storeCategory.name}
                            </Badge>
                        )}
                        {store.verified && (
                            <Badge variant="outline" className="text-sm border-blue-500 text-blue-700">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verified
                            </Badge>
                        )}
                        {store.featured && (
                            <Badge variant="outline" className="text-sm border-yellow-500 text-yellow-700">
                                Featured
                            </Badge>
                        )}
                    </div>

                    <h1 className="mb-6 text-6xl font-bold">{store.storeName}</h1>

                    <p className="text-2xl text-gray-600 mb-8 leading-relaxed">
                        {store.storeDescription || "Discover our curated collection of premium products"}
                    </p>

                    <div className="flex items-center justify-center gap-6 mb-12">
                        <div className="flex items-center gap-2">
                            <Star className="h-5 w-5 fill-gray-900 text-gray-900" />
                            <span className="text-xl">{store.averageRating?.toFixed(1) || "N/A"}</span>
                        </div>
                        <span className="text-gray-300">|</span>
                        <span className="text-gray-600">{store.totalRatings || 0} reviews</span>
                        <span className="text-gray-300">|</span>
                        <span className="text-gray-600">Premium Quality</span>
                    </div>

                    <div className="flex justify-center gap-4">
                        <Button
                            size="lg"
                            className="px-10 rounded-full"
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
                                size="lg"
                                variant="outline"
                                className="px-10 rounded-full"
                                onClick={() => window.open(`mailto:${store.email}`, "_blank")}
                            >
                                Contact
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <Separator />

            {/* Image Gallery - Minimal Grid */}
            <div className="max-w-7xl mx-auto px-8 py-20">
                <div className="grid md:grid-cols-2 gap-2">
                    <div className="aspect-[4/3] overflow-hidden relative">
                        {store.logo ? (
                            <Image src={store.logo} alt="Gallery 1" fill className="object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                <Package className="h-20 w-20 text-gray-300" />
                            </div>
                        )}
                    </div>
                    <div className="aspect-[4/3] overflow-hidden relative">
                        {store.storeCoverPhoto ? (
                            <Image src={store.storeCoverPhoto} alt="Gallery 2" fill className="object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                <Package className="h-20 w-20 text-gray-300" />
                            </div>
                        )}
                    </div>
                    <div className="md:col-span-2 aspect-[21/9] overflow-hidden relative">
                        {store.storeHeroImage ? (
                            <Image src={store.storeHeroImage} alt="Gallery 3" fill className="object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                <Package className="h-20 w-20 text-gray-300" />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Separator />

            {/* About Section - Clean Typography */}
            <div className="max-w-4xl mx-auto px-8 py-20">
                <h2 className="text-center mb-12 text-5xl font-bold">Our Story</h2>
                <div className="max-w-2xl mx-auto space-y-6 text-lg text-gray-600 leading-relaxed">
                    <p>{store.storeDescription || "Welcome to our store!"}</p>
                    {store.storeHeroHeadline && (
                        <p className="text-2xl font-semibold text-gray-900">{store.storeHeroHeadline}</p>
                    )}
                    {store.storeHeroTagline && <p>{store.storeHeroTagline}</p>}
                    <p>
                        Founded with a vision to deliver exceptional quality and service, we&apos;ve built our reputation
                        on trust, authenticity, and customer satisfaction. Every product we offer is carefully
                        selected to meet the highest standards.
                    </p>
                    <p>
                        Our team is passionate about what we do, and it shows in every interaction. We believe in
                        building lasting relationships with our customers, going beyond transactions to create
                        meaningful experiences.
                    </p>
                </div>
            </div>

            <Separator />

            {/* Products - Minimal Cards */}
            <div className="max-w-7xl mx-auto px-8 py-20">
                <h2 className="text-center mb-16 text-5xl font-bold">Featured Products</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {featuredProducts.map((product) => (
                        <div key={product.id} className="group cursor-pointer">
                            <div className="aspect-square mb-6 overflow-hidden relative">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold">{product.name}</h3>
                            <p className="text-gray-600 mb-4">{product.description}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-2xl font-bold">${product.price}</span>
                                <Button variant="link" className="p-0 h-auto">
                                    Learn more →
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Separator />

            {/* Reviews - Minimal Layout */}
            <div className="max-w-4xl mx-auto px-8 py-20">
                <div className="text-center mb-16">
                    <h2 className="mb-6 text-5xl font-bold">What Our Customers Say</h2>
                    <div className="flex items-center justify-center gap-3">
                        <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-6 w-6 ${i < Math.floor(store.averageRating || 0)
                                        ? "fill-gray-900 text-gray-900"
                                        : "text-gray-300"
                                        }`}
                                />
                            ))}
                        </div>
                        <span className="text-2xl font-bold">{store.averageRating?.toFixed(1) || "N/A"}</span>
                        <span className="text-gray-600">• {store.totalRatings || 0} reviews</span>
                    </div>
                </div>

                <div className="space-y-12">
                    {reviews.map((review) => (
                        <div key={review.id} className="max-w-2xl mx-auto">
                            <div className="flex items-center gap-1 mb-4">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-5 w-5 ${i < review.rating ? "fill-gray-900 text-gray-900" : "text-gray-300"
                                            }`}
                                    />
                                ))}
                            </div>
                            <p className="text-xl text-gray-800 mb-4 leading-relaxed">{review.comment}</p>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-900 font-medium">{review.userName}</span>
                                <span className="text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
                            </div>
                            <Separator className="mt-12" />
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Button variant="outline" size="lg" className="rounded-full px-10">
                        Write a Review
                    </Button>
                </div>
            </div>

            <Separator />

            {/* Location - Clean */}
            <div className="max-w-7xl mx-auto px-8 py-20">
                <h2 className="text-center mb-16 text-5xl font-bold">Visit Us</h2>

                <div className="grid md:grid-cols-2 gap-16">
                    <div className="aspect-square overflow-hidden relative">
                        <Image
                            src="https://images.unsplash.com/photo-1548345680-f5475ea5df84?w=800"
                            alt="Map"
                            fill
                            className="object-cover"
                        />
                    </div>

                    <div className="flex flex-col justify-center space-y-8">
                        {store.storeAddress && (
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <MapPin className="h-5 w-5 text-gray-400" />
                                    <span className="text-sm text-gray-500 uppercase tracking-wider">Address</span>
                                </div>
                                <p className="text-xl">{store.storeAddress}</p>
                                {(store.storeLocationCity || store.storeLocationState) && (
                                    <p className="text-gray-600 mt-1">
                                        {store.storeLocationCity}
                                        {store.storeLocationCity && store.storeLocationState && ", "}
                                        {store.storeLocationState}
                                    </p>
                                )}
                            </div>
                        )}

                        {(store.storeTimeOpen || store.storeTimeClose) && (
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <Clock className="h-5 w-5 text-gray-400" />
                                    <span className="text-sm text-gray-500 uppercase tracking-wider">Hours</span>
                                </div>
                                <p className="text-xl text-green-600 mb-2">Open Now</p>
                                <p className="text-gray-600">
                                    {store.storeWeekOpen || "Monday"} - {store.storeWeekClose || "Friday"}
                                </p>
                                <p className="text-gray-600">
                                    {store.storeTimeOpen || "9:00 AM"} - {store.storeTimeClose || "9:00 PM"}
                                </p>
                            </div>
                        )}

                        {store.phone && (
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <Phone className="h-5 w-5 text-gray-400" />
                                    <span className="text-sm text-gray-500 uppercase tracking-wider">Phone</span>
                                </div>
                                <a href={`tel:${store.phone}`} className="text-xl hover:underline">
                                    {store.phone}
                                </a>
                            </div>
                        )}

                        {store.email && (
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                    <span className="text-sm text-gray-500 uppercase tracking-wider">Email</span>
                                </div>
                                <a href={`mailto:${store.email}`} className="text-xl hover:underline">
                                    {store.email}
                                </a>
                            </div>
                        )}

                        <Button size="lg" className="rounded-full w-full">
                            Get Directions
                        </Button>
                    </div>
                </div>
            </div>

            <Separator />

            {/* Footer CTA */}
            <div className="max-w-4xl mx-auto px-8 py-20 text-center">
                <h2 className="mb-6 text-5xl font-bold">Ready to Get Started?</h2>
                <p className="text-xl text-gray-600 mb-8">
                    Experience the difference. Contact us today to learn more about our products and services.
                </p>
                <Button
                    size="lg"
                    className="px-12 rounded-full"
                    onClick={() => {
                        if (hasSubdomain) {
                            router.push(storeUrl);
                        } else {
                            window.open(storeUrl, "_blank");
                        }
                    }}
                >
                    <Globe className="h-5 w-5 mr-2" />
                    Visit {store.storeName}
                    <ExternalLink className="h-5 w-5 ml-2" />
                </Button>
            </div>
        </div>
    );
}
