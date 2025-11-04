"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart, Building2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface EmptyStoreStateProps {
  type?: "all" | "EXTERNAL" | "INTERNAL";
}

export function EmptyStoreState({ type = "all" }: EmptyStoreStateProps) {
  const router = useRouter();

  const handleCreate = () => {
    router.push("/findyourplug/dashboard/new-listing");
  };

  const getContent = () => {
    switch (type) {
      case "EXTERNAL":
        return {
          icon: <ShoppingCart className="w-16 h-16 text-muted-foreground/30" />,
          title: "No E-commerce Stores Yet",
          description:
            "Create your first online store to start selling products.",
        };
      case "INTERNAL":
        return {
          icon: <Building2 className="w-16 h-16 text-muted-foreground/30" />,
          title: "No Business Listings Yet",
          description:
            "Create your first business listing to get discovered locally.",
        };
      default:
        return {
          icon: <Plus className="w-16 h-16 text-muted-foreground/30" />,
          title: "No Stores Yet",
          description:
            "Get started by creating your first store or business listing.",
        };
    }
  };

  const content = getContent();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mb-6">{content.icon}</div>
      <h3 className="text-xl font-semibold mb-2">{content.title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        {content.description}
      </p>
      <Button onClick={handleCreate} size="lg">
        <Plus className="w-4 h-4 mr-2" />
        Create Your First Store
      </Button>
    </div>
  );
}
