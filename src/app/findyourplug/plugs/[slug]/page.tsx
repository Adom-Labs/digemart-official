"use client";

import { useParams, useRouter } from "next/navigation";
import { useStoreBySlug } from "@/lib/api/hooks";
import { Button } from "@/components/ui/button";
import { StoreViewManager } from "@/components/FindYourPlug/StoreView";

export default function SingleStorePage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const { data: store, isLoading, error } = useStoreBySlug(slug);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-48 mx-auto"></div>
                </div>
            </div>
        );
    }

    if (error || !store) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Store Not Found
                    </h2>
                    <p className="text-gray-600 mb-4">
                        The store you&apos;re looking for doesn&apos;t exist or has been removed.
                    </p>
                    <Button onClick={() => router.push("/findyourplug/plugs")}>
                        Back to Stores
                    </Button>
                </div>
            </div>
        );
    }

    return <StoreViewManager store={store} />;
}
