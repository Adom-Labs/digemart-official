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
    TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { StoreDiscoveryDto } from "@/lib/api/types";

interface MagazineViewProps {
    store: StoreDiscoveryDto;
}

export function MagazineView({ store }: MagazineViewProps) {
    const router = useRouter();

    const hasSubdomain = store.subdomain && store.subdomainActive;
    const storeUrl = hasSubdomain
        ? `/store/${store.subdomain}`
        : store.storeUrl || `/stores/${store.storeSlug}`;

    // Mock data for products
    const featuredProducts = [
        {
            id: "1",
            name: "Trending Item",
            description: "Popular choice this season",
            price: 149,
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
            tag: "Bestseller",
        },
        {
            id: "2",
            name: "New Arrival",
            description: "Just added to our collection",
            price: 199,
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
            tag: "New",
        },
        {
            id: "3",
            name: "Staff Pick",
            description: "Recommended by our team",
            price: 179,
            image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500",
            tag: "Featured",
        },
    ];

    // Mock reviews
    const reviews = [
        {
            id: "1",
            rating: 5,
            comment: "Amazing products and great service! Will definitely shop here again.",
            userName: "Jennifer M.",
            date: "2024-10-20",
        },
        {
            id: "2",
            rating: 5,
            comment: "Quality exceeded my expectations. Fast shipping too!",
            userName: "Robert K.",
            date: "2024-10-18",
        },
        {
            id: "3",
            rating: 4,
            comment: "Great selection and reasonable prices. Highly recommended.",
            userName: "Lisa P.",
            date: "2024-10-15",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header with Back Button */}
            <div className="bg-white border-b sticky top-0 z-40">
                <div className="container mx-auto px-4 py-4">
                    <Button variant="ghost" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                </div>
            </div>

            {/* Hero Banner */}
            <div className="relative h-[400px] md:h-[500px] bg-gradient-to-br from-primary/90 to-purple-900">
                {store.storeCoverPhoto ? (
                    <div className="absolute inset-0">
                        <Image src={store.storeCoverPhoto} alt={store.storeName} fill className="object-cover opacity-30" />
                    </div>
                ) : null}
                <div className="relative h-full container mx-auto px-4 flex items-center">
                    <div className="max-w-3xl">
                        {/* Logo */}
                        {store.logo && (
                            <div className="mb-6">
                                <div className="relative w-24 h-24 rounded-xl overflow-hidden border-4 border-white shadow-xl">
                                    <Image src={store.logo} alt={store.storeName} fill className="object-cover" />
                                </div>
                            </div>
                        )}

                        {/* Badges */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {store.storeCategory && (
                                <Badge className="bg-white text-primary hover:bg-white/90">
                                    {store.storeCategory.name}
                                </Badge>
                            )}
                            {store.verified && (
                                <Badge className="bg-green-500 text-white hover:bg-green-600">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Verified
                                </Badge>
                            )}
                            {store.featured && (
                                <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">
                                    <TrendingUp className="h-3 w-3 mr-1" />
                                    Featured
                                </Badge>
                            )}
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{store.storeName}</h1>
                        <p className="text-xl text-white/90 mb-6 max-w-2xl">
                            {store.storeDescription || "Discover amazing products and exceptional service"}
                        </p>

                        {/* Stats */}
                        <div className="flex flex-wrap gap-6 mb-6 text-white">
                            <div className="flex items-center gap-2">
                                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                <span className="font-semibold">{store.averageRating?.toFixed(1) || "N/A"}</span>
                                <span className="text-white/70">({store.totalRatings || 0} reviews)</span>
                            </div>
                            {store.storeLocationCity && (
                                <>
                                    <span className="text-white/50">•</span>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-5 w-5" />
                                        <span>{store.storeLocationCity}</span>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* CTA */}
                        <Button
                            size="lg"
                            className="bg-white text-primary hover:bg-white/90"
                            onClick={() => {
                                if (hasSubdomain) {
                                    router.push(storeUrl);
                                } else {
                                    window.open(storeUrl, "_blank");
                                }
                            }}
                        >
                            <Globe className="h-5 w-5 mr-2" />
                            Visit Store
                            <ExternalLink className="h-4 w-4 ml-2" />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                {/* Featured Products Section */}
                <section className="mb-16">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Products</h2>
                            <p className="text-gray-600">Handpicked favorites from our collection</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {featuredProducts.map((product) => (
                            <Card key={product.id} className="group overflow-hidden hover:shadow-xl transition-shadow">
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                    <Badge className="absolute top-4 right-4 bg-primary text-white">
                                        {product.tag}
                                    </Badge>
                                </div>
                                <CardContent className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                                    <p className="text-gray-600 mb-4">{product.description}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl font-bold text-primary">${product.price}</span>
                                        <Button variant="outline" size="sm">
                                            View Details
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* About & Contact Section */}
                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    {/* About */}
                    <Card>
                        <CardContent className="p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">About Our Store</h2>
                            <div className="space-y-4 text-gray-600 leading-relaxed">
                                <p>{store.storeDescription || "Welcome to our store!"}</p>
                                {store.storeHeroHeadline && (
                                    <p className="text-lg font-semibold text-gray-900">{store.storeHeroHeadline}</p>
                                )}
                                {store.storeHeroTagline && <p>{store.storeHeroTagline}</p>}
                                <p>
                                    We are committed to providing quality products and excellent customer service.
                                    Every item is carefully selected to meet our high standards.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact Info */}
                    <Card>
                        <CardContent className="p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Get In Touch</h2>
                            <div className="space-y-5">
                                {store.storeAddress && (
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <MapPin className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 mb-1">Address</p>
                                            <p className="text-gray-600">{store.storeAddress}</p>
                                            {(store.storeLocationCity || store.storeLocationState) && (
                                                <p className="text-gray-500 text-sm">
                                                    {store.storeLocationCity}
                                                    {store.storeLocationCity && store.storeLocationState && ", "}
                                                    {store.storeLocationState}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {store.phone && (
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <Phone className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 mb-1">Phone</p>
                                            <a href={`tel:${store.phone}`} className="text-primary hover:underline">
                                                {store.phone}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {store.email && (
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <Mail className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 mb-1">Email</p>
                                            <a href={`mailto:${store.email}`} className="text-primary hover:underline">
                                                {store.email}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {(store.storeTimeOpen || store.storeTimeClose) && (
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <Clock className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 mb-1">Business Hours</p>
                                            <p className="text-gray-600">
                                                {store.storeWeekOpen || "Monday"} - {store.storeWeekClose || "Friday"}
                                            </p>
                                            <p className="text-gray-600">
                                                {store.storeTimeOpen || "9:00 AM"} - {store.storeTimeClose || "9:00 PM"}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Reviews Section */}
                <section className="mb-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Customer Reviews</h2>
                        <div className="flex items-center justify-center gap-3">
                            <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-6 w-6 ${i < Math.floor(store.averageRating || 0)
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-gray-300"
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className="text-2xl font-bold text-gray-900">
                                {store.averageRating?.toFixed(1) || "N/A"}
                            </span>
                            <span className="text-gray-500">• Based on {store.totalRatings || 0} reviews</span>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {reviews.map((review) => (
                            <Card key={review.id}>
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-1 mb-3">
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
                                    <p className="text-gray-700 mb-4 leading-relaxed">{review.comment}</p>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium text-gray-900">{review.userName}</span>
                                        <span className="text-gray-500">
                                            {new Date(review.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="text-center mt-8">
                        <Button variant="outline" size="lg">
                            View All Reviews
                        </Button>
                    </div>
                </section>

                {/* CTA Banner */}
                <Card className="bg-gradient-to-r from-primary to-purple-600 text-white">
                    <CardContent className="p-12 text-center">
                        <h2 className="text-3xl font-bold mb-4">Start Shopping Today!</h2>
                        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                            Browse our full collection and discover products that match your style and needs.
                        </p>
                        <Button
                            size="lg"
                            className="bg-white text-primary hover:bg-white/90"
                            onClick={() => {
                                if (hasSubdomain) {
                                    router.push(storeUrl);
                                } else {
                                    window.open(storeUrl, "_blank");
                                }
                            }}
                        >
                            <Globe className="h-5 w-5 mr-2" />
                            Explore {store.storeName}
                            <ExternalLink className="h-5 w-5 ml-2" />
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
