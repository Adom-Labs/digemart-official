"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ShoppingCart, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateStoreWizard } from "@/components/dashboard/stores/CreateStoreWizard";

export default function CreateStorePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storeType =
    (searchParams.get("type") as "EXTERNAL" | "INTERNAL") || "EXTERNAL";

  const handleStoreCreated = (storeId: number) => {
    // Navigate to the newly created store's management page
    router.push(`/findyourplug/dashboard/stores/${storeId}`);
  };

  const handleCancel = () => {
    // Navigate back to stores list
    router.push("/findyourplug/dashboard/stores");
  };

  const isEcommerce = storeType === "EXTERNAL";

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Stores
          </Button>
        </div>

        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              isEcommerce ? "bg-primary/10" : "bg-blue-500/10"
            }`}
          >
            {isEcommerce ? (
              <ShoppingCart
                className={`w-6 h-6 ${
                  isEcommerce ? "text-primary" : "text-primary"
                }`}
              />
            ) : (
              <Building2 className="w-6 h-6 text-primary" />
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Create {isEcommerce ? "E-commerce Store" : "Business Listing"}
            </h1>
            <p className="text-gray-600 mt-2">
              {isEcommerce
                ? "Set up your online store with full e-commerce capabilities"
                : "Create your business listing to get discovered on FindYourPlug"}
            </p>
          </div>
        </div>
      </div>

      {/* Wizard */}
      <CreateStoreWizard
        storeType={storeType}
        onComplete={handleStoreCreated}
        onCancel={handleCancel}
      />
    </div>
  );
}
