'use client';

import { motion } from 'framer-motion';
import { CategoryResponseDto } from '@/lib/api/types';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import WrapContent from '@/components/WrapContent';

export default function TopCategories({ categories }: { categories: CategoryResponseDto[] | undefined }) {
    if (!categories) return null;

    return (
        <section className="py-10 bg-transparent">
            <WrapContent>
                <div className="text-center mb-7">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">Browse Popular Categories</h2>
                    <p className="text-base md:text-lg text-gray-400 mb-2 font-medium">
                        Discover products across various categories to find exactly what you need
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-4 md:gap-6">
                    {categories.map((category, index) => (
                        <Link key={category.id} href={`${ROUTES.CATEGORY(category.slug)}`} className="block">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.08 }}
                                className="flex flex-col items-center justify-center bg-white rounded-xl shadow-[0_2px_8px_0_rgba(0,0,0,0.08)] px-4 py-6 md:py-8 min-h-[150px] md:min-h-[180px] hover:shadow-md transition"
                            >
                                <div className="flex items-center justify-center mb-3">
                                    <span
                                        className="inline-flex items-center justify-center rounded-full bg-gray-50"
                                        style={{ width: 48, height: 48 }}
                                    >
                                        <span className="text-2xl">{category.icon}</span>
                                    </span>
                                </div>
                                <div className="text-center">
                                    <h3 className="text-base md:text-lg font-medium text-gray-800 mb-0.5">
                                        {category.name}
                                    </h3>
                                    <p className="text-sm text-gray-500">{category.storeCount} plugs</p>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </WrapContent>
        </section>
    );
}
