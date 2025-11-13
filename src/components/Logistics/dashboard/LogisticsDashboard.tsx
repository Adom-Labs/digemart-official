"use client";

import { useState } from "react";
import { VendorDashboard } from "./VendorDashboard";
import { LogisticsProviderDashboard } from "./LogisticsProviderDashboard";
import { BuyerDashboard } from "./BuyerDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Role = "vendor" | "logistics" | "buyer";

export function LogisticsDashboard() {
  const [role, setRole] = useState<Role>("vendor");

  return (
    <div>
      <Tabs defaultValue="vendor" onValueChange={(value) => setRole(value as Role)}>
        <TabsList>
          <TabsTrigger value="vendor">Vendor</TabsTrigger>
          <TabsTrigger value="logistics">Logistics</TabsTrigger>
          <TabsTrigger value="buyer">Buyer</TabsTrigger>
        </TabsList>
        <TabsContent value="vendor">
          <VendorDashboard />
        </TabsContent>
        <TabsContent value="logistics">
          <LogisticsProviderDashboard />
        </TabsContent>
        <TabsContent value="buyer">
          <BuyerDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
