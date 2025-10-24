"use client";

import { Dispatch, SetStateAction } from "react";
import { MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
}

interface ShippingAddressFormProps {
  address: ShippingAddress;
  setAddress: Dispatch<SetStateAction<ShippingAddress>>
}

export function ShippingAddressForm({ address, setAddress }: ShippingAddressFormProps) {


  const handleChange = (field: keyof ShippingAddress, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };


  return (<div className="space-y-6"> <div className="border-b border-gray-200 pb-4 flex items-center"> <h2 className="text-xl font-semibold text-gray-900 flex items-center"> <MapPin className="h-5 w-5 mr-2" />
    Shipping Address </h2> </div>

    <div className="space-y-4">
      <div>
        <Label>Street Address</Label>
        <Input
          value={address.address}
          onChange={(e) => handleChange("address", e.target.value)}
          placeholder="Enter address"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label>City</Label>
          <Input
            value={address.city}
            onChange={(e) => handleChange("city", e.target.value)}
          />
        </div>
        <div>
          <Label>State</Label>
          <Input
            value={address.state}
            onChange={(e) => handleChange("state", e.target.value)}
          />
        </div>
        <div>
          <Label>Postal Code</Label>
          <Input
            value={address.postalCode}
            onChange={(e) => handleChange("postalCode", e.target.value)}
          />
        </div>
      </div>
    </div>
  </div>
  );
}
