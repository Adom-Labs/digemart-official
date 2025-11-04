"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Store,
  Building2,
  ShoppingCart,
  MapPin,
  ArrowRight,
  Check,
} from "lucide-react";

export default function NewListingPage() {
  const router = useRouter();

  const handleCreateEcommerce = () => {
    router.push("/findyourplug/dashboard/stores/create?type=EXTERNAL");
  };

  const handleCreateListing = () => {
    router.push("/findyourplug/dashboard/stores/create?type=INTERNAL");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
          Choose Your Business Type
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Select the option that best fits your business needs. You can always
          create more later.
        </p>
      </div>

      {/* Options Grid */}
      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
        {/* E-commerce Store Option */}
        <Card className="border-2 hover:border-primary transition-all hover:shadow-lg cursor-pointer group">
          <CardHeader className="space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <ShoppingCart className="w-8 h-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl mb-2">E-commerce Store</CardTitle>
              <CardDescription className="text-base">
                Full-featured online store with complete e-commerce capabilities
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  Sell products online with shopping cart & checkout
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  Accept payments & manage orders
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  Inventory management & product variants
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  Customer management & analytics
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  Custom domain & full website control
                </p>
              </div>
            </div>

            <div className="pt-4">
              <Button
                onClick={handleCreateEcommerce}
                className="w-full group-hover:shadow-md transition-shadow"
                size="lg"
              >
                Create E-commerce Store
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Perfect for: Online retailers, product sellers, digital goods
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Business Listing Option */}
        <Card className="border-2 hover:border-primary transition-all hover:shadow-lg cursor-pointer group">
          <CardHeader className="space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
              <Building2 className="w-8 h-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl mb-2">Business Listing</CardTitle>
              <CardDescription className="text-base">
                Showcase and promote your business on FindYourPlug marketplace
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  Get discovered by local customers
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  Display business info, hours & location
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  Collect reviews & ratings
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  Share photos & business updates
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  Connect with customers directly
                </p>
              </div>
            </div>

            <div className="pt-4">
              <Button
                onClick={handleCreateListing}
                className="w-full group-hover:shadow-md transition-shadow"
                size="lg"
                variant="outline"
              >
                Create Business Listing
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Perfect for: Local businesses, services, restaurants, salons
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Help Text */}
      <div className="mt-12 text-center">
        <p className="text-sm text-muted-foreground">
          Not sure which one to choose?{" "}
          <button className="text-primary hover:underline font-medium">
            Learn more about the differences
          </button>
        </p>
      </div>
    </div>
  );
}
