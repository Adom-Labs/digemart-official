"use client";

import { useSearchParams } from "next/navigation";
import { ConversationalStoreBuilder } from "@/components/dashboard/stores/conversational";

export default function CreateDemoPage() {
  const searchParams = useSearchParams();
  const storeType = searchParams.get("type") as "EXTERNAL" | "INTERNAL" | null;

  return (
    <div className="h-[calc(100vh-80px)] overflow-hidden">
      <ConversationalStoreBuilder initialStoreType={storeType} />
    </div>
  );
}
