"use client";

import { useState } from "react";
import { ShoppingCart, Store, Truck, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ROUTES } from "@/lib/routes";

type TabType = "customer" | "vendor" | "logistics";

export function FeatureTabs() {
  const [activeTab, setActiveTab] = useState<TabType>("customer");

  const tabs = [
    { id: "customer" as TabType, label: "Customer", icon: ShoppingCart },
    { id: "vendor" as TabType, label: "Vendor", icon: Store },
    { id: "logistics" as TabType, label: "Rider", icon: Truck },
  ];

  const content = {
    customer: {
      title: "Shop from Verified Stores",
      subtitle: "Browse thousands of products from trusted vendors",
      description:
        "Experience seamless shopping with our curated marketplace. Find exactly what you need from verified stores, read real reviews, and enjoy secure checkout.",
      features: [
        "Browse yellow pages directory of stores",
        "Read verified customer reviews",
        "Secure payment processing",
        "Track your orders in real-time",
        "Easy returns and refunds",
        "24/7 customer support",
      ],
      image:
        "https://images.unsplash.com/photo-1644794472051-36d154dfe487?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG9uZSUyMG1vY2t1cCUyMGFwcHxlbnwxfHx8fDE3NjIxNDI1NjV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      color: "blue",
    },
    vendor: {
      title: "Grow Your Business Online",
      subtitle: "Powerful tools for vendors to succeed",
      description:
        "Launch your store in minutes and reach customers nationwide. Our platform provides everything you need to manage and scale your business effectively.",
      features: [
        "Easy store setup and customization",
        "Product management dashboard",
        "Real-time sales analytics",
        "Inventory tracking",
        "Customer insights and feedback",
        "Marketing and promotion tools",
      ],
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdG9yZSUyMGRhc2hib2FyZCUyMGFuYWx5dGljc3xlbnwxfHx8fDE3NjIxNDI1NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      color: "purple",
    },
    logistics: {
      title: "Riders Who Earn More",
      subtitle: "Higher payouts per trip with real-time blockchain tracking",
      description:
        'Join our delivery network and enjoy flexible scheduling with transparent earnings. No more "customer didn\'t pay" disputes with our advanced tracking system.',
      features: [
        "Flexible scheduling - work when you want",
        "Higher payouts per delivery",
        "Real-time route optimization",
        "Transparent earnings tracking",
        "Instant payment processing",
        "Insurance coverage included",
      ],
      image:
        "https://images.unsplash.com/photo-1586449480537-3a22cf98b04c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxpdmVyeSUyMG1hcCUyMHRyYWNraW5nfGVufDF8fHx8MTc2MjE0MjU2Nnww&ixlib=rb-4.1.0&q=80&w=1080",
      color: "orange",
    },
  };

  const currentContent = content[activeTab];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Tab Navigation */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-2 flex gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const colors = {
                customer: "bg-primary",
                vendor: "bg-purple-500",
                logistics: "bg-orange-500",
              };

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-4 px-6 rounded-xl transition-all duration-300 ${
                    isActive
                      ? `${colors[tab.id]} text-white shadow-lg`
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Icon
                      className={`h-5 w-5 ${
                        isActive ? "text-white" : "text-gray-400"
                      }`}
                    />
                    <span>{tab.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left Side - Image */}
          <div className="order-2 lg:order-1">
            <div
              className={`relative rounded-3xl overflow-hidden bg-gradient-to-br ${
                activeTab === "customer"
                  ? "from-blue-100 to-cyan-100"
                  : activeTab === "vendor"
                  ? "from-purple-100 to-pink-100"
                  : "from-orange-100 to-amber-100"
              } p-8`}
            >
              <div className="relative">
                <Image
                  src={currentContent.image}
                  alt={currentContent.title}
                  width={1080}
                  height={720}
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="order-1 lg:order-2">
            <div className="inline-block px-4 py-2 bg-gray-100 rounded-full mb-4">
              <span
                className={`text-sm ${
                  activeTab === "customer"
                    ? "text-primary"
                    : activeTab === "vendor"
                    ? "text-purple-700"
                    : "text-orange-700"
                }`}
              >
                {currentContent.subtitle}
              </span>
            </div>

            <h2 className="mb-4 text-3xl md:text-4xl font-bold text-gray-900">
              {currentContent.title}
            </h2>

            <p className="text-xl text-gray-600 mb-8">
              {currentContent.description}
            </p>

            <div className="space-y-3 mb-8">
              {currentContent.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2
                    className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                      activeTab === "customer"
                        ? "text-primary"
                        : activeTab === "vendor"
                        ? "text-purple-500"
                        : "text-orange-500"
                    }`}
                  />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            <Link
              href={ROUTES.FINDYOURPLUG}
              className={`inline-flex items-center justify-center rounded-lg px-8 py-4 text-lg font-medium text-white transition-colors ${
                activeTab === "customer"
                  ? "bg-primary hover:bg-primary"
                  : activeTab === "vendor"
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "bg-orange-600 hover:bg-orange-700"
              }`}
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
