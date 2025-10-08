import WrapContent from "@/components/WrapContent";
import {
    Store,
    ShoppingCart,
    Package,
    CreditCard,
    ShieldCheck,
    TrendingUp
} from "lucide-react";
import Link from "next/link";

const steps = [
    {
        icon: Store,
        title: "Create Your Store",
        description: "Sign up and create your digital storefront in minutes. Customize your store with your brand identity and start listing your products.",
        color: "from-blue-500 to-blue-600"
    },
    {
        icon: ShoppingCart,
        title: "List Your Products",
        description: "Add your products with detailed descriptions, high-quality images, and competitive pricing. Our platform makes it easy to manage your inventory.",
        color: "from-purple-500 to-purple-600"
    },
    {
        icon: Package,
        title: "Handle Orders",
        description: "Receive orders, process them efficiently, and ship products to customers. Our system helps you manage orders and track shipments.",
        color: "from-green-500 to-green-600"
    },
    {
        icon: CreditCard,
        title: "Get Paid",
        description: "Receive secure payments directly to your account. Our platform handles all payment processing and ensures timely payouts.",
        color: "from-orange-500 to-orange-600"
    },
    {
        icon: ShieldCheck,
        title: "Secure Platform",
        description: "Benefit from our secure platform with fraud protection, secure payments, and reliable customer support.",
        color: "from-red-500 to-red-600"
    },
    {
        icon: TrendingUp,
        title: "Grow Your Business",
        description: "Access analytics, marketing tools, and customer insights to grow your business and reach more customers.",
        color: "from-indigo-500 to-indigo-600"
    }
];

export default function HowItWorks() {
    return (
        <main className="min-h-screen bg-white pt-24">
            {/* Hero Section */}
            <section className="pt-24 pb-12 bg-gradient-to-b from-slate-50 to-white">
                <WrapContent>
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
                            How Digemart Works
                        </h1>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Start selling your products online in minutes. Follow these simple steps to get started with your digital store.
                        </p>
                    </div>
                </WrapContent>
            </section>

            {/* Steps Section */}
            <section className="py-16">
                <WrapContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {steps.map((step, index) => (
                            <div
                                key={index}
                                className="relative group"
                            >
                                {/* Step Number */}
                                <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">
                                    {index + 1}
                                </div>

                                {/* Step Card */}
                                <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
                                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${step.color} flex items-center justify-center mb-4`}>
                                        <step.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                                        {step.title}
                                    </h3>
                                    <p className="text-slate-600">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </WrapContent>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-slate-50">
                <WrapContent>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">
                            Why Choose Digemart?
                        </h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">
                            Join thousands of successful sellers who trust our platform to grow their business
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Easy to Use",
                                description: "Simple and intuitive interface designed for the best user experience"
                            },
                            {
                                title: "Secure Payments",
                                description: "Multiple payment options with industry-standard security"
                            },
                            {
                                title: "24/7 Support",
                                description: "Round-the-clock customer support to help you succeed"
                            }
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="p-6 bg-white rounded-xl shadow-sm"
                            >
                                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-slate-600">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </WrapContent>
            </section>

            {/* CTA Section */}
            <section className="py-16">
                <WrapContent>
                    <div className="text-center space-y-6">
                        <h2 className="text-3xl font-bold text-slate-900">
                            Ready to Start Selling?
                        </h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">
                            Join our platform today and start growing your business with Digemart
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Link
                                href="/findyourplug/register"
                                className="px-6 py-3 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                            >
                                Get Started
                            </Link>
                            <Link
                                href="/contact"
                                className="px-6 py-3 rounded-lg border border-slate-200 text-slate-900 hover:bg-slate-50 transition-colors"
                            >
                                Contact Sales
                            </Link>
                        </div>
                    </div>
                </WrapContent>
            </section>
        </main>
    );
}
