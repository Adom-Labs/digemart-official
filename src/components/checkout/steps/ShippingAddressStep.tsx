"use client";
import { useFormContext } from "react-hook-form";
import { useState, useEffect } from "react";
import { ShippingAddressForm } from "../ShippingAddressForm";
import { CheckoutFormData } from "../CheckoutWizard";
import { ShippingAddress } from "@/lib/api/hooks/order-placement";



export function ShippingAddressStep() {
  const { watch, setValue } = useFormContext<CheckoutFormData>();
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
  });

  useEffect(() => {
    setValue("shippingAddress", address);
  }, [address, setValue])


  const customerInfo = watch("customerInfo");
  const shippingAddress = watch("shippingAddress");

  // Auto-fill full name from customer info
  useEffect(() => {
    if (customerInfo.firstName && customerInfo.lastName) {
      const fullName = `${customerInfo.firstName} ${customerInfo.lastName}`;
      if (!shippingAddress.fullName) {
        setValue("shippingAddress.fullName", fullName);
      }
    }
  }, [
    customerInfo.firstName,
    customerInfo.lastName,
    shippingAddress.fullName,
    setValue,
  ]);


  return (
    <div className="space-y-6">
      <ShippingAddressForm address={address} setAddress={setAddress} />
    </div>
  );
}



