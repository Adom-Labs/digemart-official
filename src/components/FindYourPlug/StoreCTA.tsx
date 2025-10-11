'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';

export default function StoreCTA() {
    return (
        <section className="py-20 bg-linear-to-r from-blue-600 to-purple-600">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-8"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Ready to List Your Store?
                        </h2>
                        <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
                            Join thousands of successful businesses already on Digemart. Get discovered by customers
                            looking for exactly what you offer.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href={ROUTES.EXTERNAL_LINK_TO_VENDORS} target="_blank" rel="noopener noreferrer">
                                <Button
                                    size="lg"
                                    className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold"
                                >
                                    Create Your Store
                                </Button>
                            </Link>
                            <Link href={ROUTES.FINDYOURPLUG_DASHBOARD}>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-white text-blue-600 hover:bg-blue-50 hover:text-blue-600 px-8 py-4 text-lg font-semibold"
                                >
                                    Manage Listings
                                </Button>
                            </Link>
                        </div>
                        <div className="flex items-center justify-center gap-8 text-blue-100 text-sm">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                <span>Free to list</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                <span>No monthly fees</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                <span>Easy setup</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
