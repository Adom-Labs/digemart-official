'use client';

import { useState } from 'react';
import { Star, ThumbsUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { ReviewResponseDto } from '@/lib/api/types';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import WrapContent from '@/components/WrapContent';

export default function RecentReviews({ reviews }: { reviews: ReviewResponseDto[] | undefined }) {
    const [expandedReview, setExpandedReview] = useState<number | null>(null);
    if (!reviews) return null;

    return (
        <section className="py-20 bg-white">
            <WrapContent>
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">Recent Reviews</h2>
                    <p className="text-lg text-slate-600">See what customers are saying about plugs on Digemart</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {reviews.map((review, index) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-colors"
                        >
                            {/* Review Header */}
                            <div className="p-6 border-b border-slate-100">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-200" />
                                        <div>
                                            <h3 className="font-medium text-slate-900">{review.user.name}</h3>
                                            <p className="text-sm text-slate-500">{review.createdAt}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: review.rating }).map((_, i) => (
                                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-slate-600 mb-4">
                                    <Link
                                        href={`${ROUTES.STORE(review.store.storeUrl)}`}
                                        className="text-blue-600 hover:text-blue-700"
                                    >
                                        {review.store.storeName}
                                    </Link>
                                    {' - '}
                                    {expandedReview === review.id ? review.review : `${review.review.slice(0, 100)}...`}
                                </p>
                                {review.product && (
                                    <Link
                                        href={`${ROUTES.PRODUCT(review.store.storeUrl, review.product.id.toString())}`}
                                        className="text-slate-600 hover:text-blue-600"
                                    >
                                        {review.product.name}
                                    </Link>
                                )}
                                <button
                                    onClick={() => setExpandedReview(expandedReview === review.id ? null : review.id)}
                                    className="text-sm text-blue-600 hover:text-blue-700"
                                >
                                    {expandedReview === review.id ? 'Show less' : 'Read more'}
                                </button>
                            </div>

                            {/* Review Images */}
                            {review.images.length > 0 && (
                                <div className="px-6 py-4 border-b border-slate-100">
                                    <div className="flex gap-2 overflow-x-auto">
                                        {review.images.map((image, i) => (
                                            <div key={i} className="w-20 h-20 flex-shrink-0 rounded-lg bg-slate-100">
                                                <img src={image} alt={`Review image ${i}`} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Review Actions */}
                            <div className="px-6 py-4 flex items-center justify-between">
                                <button className="flex items-center gap-2 text-slate-600 hover:text-blue-600">
                                    <ThumbsUp className="w-4 h-4" />
                                    <span className="text-sm">{review.helpful}</span>
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </WrapContent>
        </section>
    );
}
