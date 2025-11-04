"use client";

import { ROUTES } from "@/lib/routes";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import React from "react";

// Variant 1: Alternating Color Highlight Animation
const HeroVariant1 = () => {
  const features = [
    "Verified Stores",
    "Secure Payments",
    "Fast Delivery",
    "Real Reviews",
    "Easy Returns",
    "24/7 Support",
  ];

  return (
    <section className="py-20 lg:py-32 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block px-4 py-2 bg-blue-50 border border-blue-200 rounded-full mb-6">
            <span className="text-sm text-blue-700">🎯 Demo Mode Enabled</span>
          </div>

          <h1 className="mb-6 text-4xl md:text-6xl font-bold text-gray-900">
            <span className="inline-block animate-[highlight_6s_ease-in-out_infinite] animation-delay-0">
              Connect
            </span>
            .{" "}
            <span className="inline-block animate-[highlight_6s_ease-in-out_infinite] animation-delay-2000">
              Trade
            </span>
            .{" "}
            <span className="inline-block animate-[highlight_6s_ease-in-out_infinite] animation-delay-4000">
              Deliver
            </span>
            .
            <br />
            <span className="text-blue-600">All in One Place.</span>
          </h1>

          <style jsx>{`
            @keyframes highlight {
              0%,
              33.33% {
                color: #2563eb;
                text-shadow: 0 0 20px rgba(37, 99, 235, 0.3);
              }
              33.34%,
              100% {
                color: #111827;
                text-shadow: none;
              }
            }
            .animation-delay-0 {
              animation-delay: 0s;
            }
            .animation-delay-2000 {
              animation-delay: 2s;
            }
            .animation-delay-4000 {
              animation-delay: 4s;
            }
          `}</style>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Digemart brings together customers, vendors, and logistics agents in
            a seamless ecosystem designed for modern e-commerce.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href={ROUTES.FINDYOURPLUG}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-8 py-4 text-lg font-medium text-white hover:bg-blue-700 transition-colors"
            >
              Get Started Free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={ROUTES.FINDYOURPLUG}
              className="inline-flex items-center justify-center rounded-lg border-2 border-gray-300 px-8 py-4 text-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Browse Stores
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 justify-center"
              >
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-sm text-gray-700">{feature}</span>
              </div>
            ))}
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1658297063569-162817482fb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlY29tbWVyY2UlMjBzaG9wcGluZyUyMG9ubGluZXxlbnwxfHx8fDE3NjE5OTMyMTF8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Platform preview"
              width={1080}
              height={720}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroVariant1;
