import { NewsletterSignup } from "@/components/NewsletterSignup";
import WrapContent from "@/components/WrapContent";
import { CalendarClock, Clock, Rocket, Bell, Tag, ShieldCheck } from "lucide-react";
import Image from "next/image";

export default function DealsPage() {
    return (
        <section className="min-h-screen bg-gradient-to-b from-white to-gray-50">
            <div className="pb-20 pt-40">
                <WrapContent>
                    <div className="text-center max-w-4xl mx-auto">
                        {/* Coming Soon Banner */}
                        <div className="mb-8 inline-flex items-center gap-2 bg-gradient-to-r from-amber-50 to-yellow-100 text-yellow-800 px-6 py-2.5 rounded-full border border-yellow-200/50 shadow-sm">
                            <Clock className="h-4 w-4" />
                            <span className="font-semibold">Coming Soon</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                            Exclusive Business Deals & Offers
                        </h1>

                        <p className="text-xl text-gray-600 mb-12 leading-relaxed max-w-2xl mx-auto">
                            We&apos;re crafting premium deals tailored for business growth. Join the waitlist to access exclusive discounts on essential business services and products <Rocket className="inline-block ml-1 h-5 w-5 text-primary" />
                        </p>

                        <div className="relative mx-auto mb-16 max-w-3xl">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg transform rotate-2"></div>
                            <Image
                                src="/_images/black-friday.png"
                                alt="Coming Soon Illustration"
                                width={600}
                                height={300}
                                className="rounded-lg shadow-lg relative z-10 w-full"
                            />
                            <div className="absolute -bottom-6 left-1/2 z-12 transform w-full max-w-max -translate-x-1/2 bg-white px-3 py-4 rounded-full shadow-xl flex items-center gap-3 border border-gray-100">
                                <CalendarClock className="h-5 w-5 text-primary" />
                                <span className="font-semibold text-gray-800">Launching Q1 2026</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-xl p-8 mt-20 border border-gray-100">
                            <h2 className="text-3xl font-bold mb-8 text-gray-900">What to Expect</h2>
                            <div className="grid md:grid-cols-3 gap-8 mb-10">
                                <div className="group hover:bg-gray-50 transition-all duration-300 rounded-lg p-6">
                                    <div className="bg-gradient-to-br from-primary/20 to-primary/10 w-14 h-14 rounded-lg flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                        <Tag className="text-primary h-6 w-6" />
                                    </div>
                                    <h3 className="font-bold text-xl mb-3 text-gray-900">Exclusive Discounts</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        Premium offers on business tools, services, and products to help your business thrive and scale efficiently.
                                    </p>
                                </div>
                                <div className="group hover:bg-gray-50 transition-all duration-300 rounded-lg p-6">
                                    <div className="bg-gradient-to-br from-primary/20 to-primary/10 w-14 h-14 rounded-lg flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                        <ShieldCheck className="text-primary h-6 w-6" />
                                    </div>
                                    <h3 className="font-bold text-xl mb-3 text-gray-900">Verified Partners</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        Curated deals from trusted business partners, ensuring quality and reliability for your business needs.
                                    </p>
                                </div>
                                <div className="group hover:bg-gray-50 transition-all duration-300 rounded-lg p-6">
                                    <div className="bg-gradient-to-br from-primary/20 to-primary/10 w-14 h-14 rounded-lg flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                        <Bell className="text-primary h-6 w-6" />
                                    </div>
                                    <h3 className="font-bold text-xl mb-3 text-gray-900">Priority Access</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        Get early access and real-time notifications for exclusive deals tailored to your business category.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Newsletter Section */}
                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-xl shadow-xl p-5 mt-12" id="newsletter">
                            <div className="max-w-2xl mx-auto">
                                <NewsletterSignup />
                            </div>
                        </div>
                    </div>
                </WrapContent>
            </div>
        </section>
    );
}
