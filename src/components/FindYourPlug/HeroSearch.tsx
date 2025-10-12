'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, Store, X, Star, ShoppingBag, Folder } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ROUTES } from '@/lib/routes';
import { CategoryResponseDto, SearchResultDto } from '@/lib/api/types';
import { searchApi } from '@/lib/api';

const backgroundImages = [
    '_images/cafe.avif',
    '_images/eat.avif',
    '_images/fashion.avif',
    '_images/tech.avif',
];

interface HeroSearchProps {
    popularCategories: CategoryResponseDto[] | undefined;
}

export default function HeroSearch({ popularCategories }: HeroSearchProps) {
    const [query, setQuery] = useState('');
    const [location, setLocation] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [searchResults, setSearchResults] = useState<SearchResultDto[]>([]);
    const [backgroundImage, setBackgroundImage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [entityType, setEntityType] = useState<'all' | 'store' | 'product' | 'category'>('all');

    // Set random background on mount
    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * backgroundImages.length);
        setBackgroundImage(backgroundImages[randomIndex]);
    }, []);

    // Real search functionality
    useEffect(() => {
        if (!query || query.length < 2) {
            setSearchResults([]);
            return;
        }

        setIsLoading(true);

        // Debounce search
        const timer = setTimeout(async () => {
            try {
                // Use unified search API
                const response = await searchApi.search({
                    query,
                    entityType,
                    location: location || undefined,
                    limit: 10,
                });

                // Use the results directly from the unified search
                setSearchResults(response.data.results);
            } catch (error) {
                console.error('Search failed:', error);
                setSearchResults([]);
            } finally {
                setIsLoading(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [query, entityType, location]);

    return (
        <section className="relative min-h-[800px] flex items-center">
            {/* Background with gradient overlay */}
            <div className="absolute inset-0">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
                    style={{ backgroundImage: `url(${backgroundImage})` }}
                />
                <div className="absolute inset-0 bg-linear-to-b from-slate-900/85 via-slate-900/90 to-slate-900/95 backdrop-blur-xs" />
            </div>

            {/* Content */}
            <div className="relative container mx-auto px-4 pt-20 pb-32">
                <div className="max-w-3xl mx-auto space-y-8">
                    {/* Stats badge */}
                    <div className="text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-block px-4 py-1.5 text-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
                        >
                            <span className="text-sm font-medium text-white text-center">
                                🔥 Over 1000+ stores and counting
                            </span>
                        </motion.div>
                    </div>

                    {/* Main title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-6xl lg:text-7xl text-center font-bold text-white"
                    >
                        Find Your Perfect{' '}
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-400">
                            Online Store
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-slate-300 max-w-2xl mx-auto text-center"
                    >
                        Discover and connect with the best online stores and digital marketplaces all in one place
                    </motion.p>

                    {/* Search box */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="relative max-w-2xl mx-auto"
                    >
                        <div
                            className={`
              bg-white rounded-2xl shadow-lg transition-all duration-300
              ${isSearchFocused ? 'shadow-blue-500/20 ring-2 ring-blue-500/20' : ''}
            `}
                        >
                            <div className="flex flex-col md:flex-row gap-2 p-2">
                                {/* Search input */}
                                <div className="flex-1 relative group">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5 transition-colors group-hover:text-blue-500" />
                                    <input
                                        type="text"
                                        placeholder="Search for stores or products..."
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border-0 focus:ring-0 placeholder:text-slate-400"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        onFocus={() => setIsSearchFocused(true)}
                                    />
                                    {query && (
                                        <button
                                            onClick={() => setQuery('')}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>

                                {/* Location input */}
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                                    <input
                                        type="text"
                                        placeholder="Location"
                                        className="w-full md:w-40 pl-10 pr-4 py-3 rounded-xl border-0 focus:ring-0 placeholder:text-slate-400"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Search filters - only visible when search is focused */}
                            {isSearchFocused && (
                                <div className="p-3 border-t border-slate-100">
                                    <div className="flex flex-wrap gap-2 items-center">
                                        <span className="text-sm text-slate-500">Filter by:</span>
                                        <div className="flex gap-2">
                                            {[
                                                { key: 'all' as const, label: 'All' },
                                                { key: 'store' as const, label: 'Stores' },
                                                { key: 'product' as const, label: 'Products' },
                                                { key: 'category' as const, label: 'Categories' },
                                            ].map(({ key, label }) => (
                                                <button
                                                    key={key}
                                                    onClick={() => setEntityType(key)}
                                                    className={`px-3 py-1 text-xs rounded-full ${entityType === key
                                                        ? 'bg-blue-100 text-blue-700'
                                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                        }`}
                                                >
                                                    {label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Search Dropdown */}
                            <AnimatePresence>
                                {isSearchFocused && query.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-50"
                                    >
                                        {isLoading ? (
                                            <div className="p-4 text-center text-slate-500">
                                                <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2" />
                                                Searching...
                                            </div>
                                        ) : searchResults.length > 0 ? (
                                            <>
                                                <div className="p-2">
                                                    {searchResults.map((result) => (
                                                        <Link
                                                            key={`${result.type}-${result.id}`}
                                                            href={result.url}
                                                            className="flex items-start gap-3 p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                                                        >
                                                            {result.image ? (
                                                                <div className="w-12 h-12 rounded-lg bg-slate-100 shrink-0 overflow-hidden relative">
                                                                    <Image
                                                                        src={result.image}
                                                                        alt={result.name}
                                                                        fill
                                                                        className="object-cover"
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                                                                    {result.type === 'store' && <Store className="h-6 w-6 text-primary" />}
                                                                    {result.type === 'product' && <ShoppingBag className="h-6 w-6 text-primary" />}
                                                                    {result.type === 'category' && <Folder className="h-6 w-6 text-primary" />}
                                                                </div>
                                                            )}
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-start gap-2">
                                                                    <h3 className="font-medium text-slate-900 truncate">
                                                                        {result.name}
                                                                    </h3>
                                                                    {result.verified && (
                                                                        <span className="text-primary">✓</span>
                                                                    )}
                                                                    <span className="text-xs px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                                                        {result.type}
                                                                    </span>
                                                                </div>
                                                                <p className="text-sm text-slate-500">{result.category || result.description}</p>
                                                                {result.type === 'product' && result.price && (
                                                                    <p className="text-sm font-medium text-green-600">
                                                                        {result.currency} {result.price}
                                                                    </p>
                                                                )}
                                                                {result.location && (
                                                                    <p className="text-xs text-slate-400 flex items-center gap-1">
                                                                        <MapPin className="h-3 w-3" />
                                                                        {result.location}
                                                                    </p>
                                                                )}
                                                            </div>
                                                            {result.type === 'store' && (
                                                                <div className="flex items-start gap-1 text-sm">
                                                                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                                                    <span className="font-medium">{Math.round(result.rating ?? 0)}</span>
                                                                    <span className="text-slate-400">({result.reviewCount})</span>
                                                                </div>
                                                            )}
                                                        </Link>
                                                    ))}
                                                </div>
                                                <div className="p-3 border-t border-slate-100 bg-slate-50 text-center">
                                                    <Link
                                                        href={`${ROUTES.STORES}?search=${query}&type=${entityType}&loc=${location}`}
                                                        className="text-primary hover:text-primary/80 text-sm font-medium w-full text-center"
                                                    >
                                                        View all results →
                                                    </Link>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="p-4 text-center text-slate-500 text-center">
                                                No results found matching &apos;{query}&apos;
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* Quick categories */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-wrap justify-center gap-3 mt-8"
                    >
                        {popularCategories &&
                            popularCategories.map((category) => (
                                <Link key={category.id} href={`${ROUTES.CATEGORY(category.slug)}`} className="block">
                                    <button className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white transition-all duration-300 hover:border-white/40 hover:scale-105">
                                        <span className="flex items-center gap-2">
                                            {category.icon} {category.name}
                                        </span>
                                    </button>
                                </Link>
                            ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
