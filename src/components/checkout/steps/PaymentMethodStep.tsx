"use client";

import { useFormContext } from "react-hook-form";
import { PaymentMethodSelector } from "../PaymentMethodSelector";
import { CheckoutFormData } from "../CheckoutWizard";

export function PaymentMethodStep() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CheckoutFormData>();

  const paymentMethod = watch("paymentMethod");
  const orderTotal = watch("orderSummary.total") || 0;

  const handleMethodSelect = (method: { type: string; gateway: string }) => {
    setValue("paymentMethod.type", method.type as any);
    setValue("paymentMethod.gateway", method.gateway as any);
  };

  // TODO: Get store configuration from context or props
  // This would typically come from the store's payment settings
  const storeConfig = {
    enabledGateways: ["paystack", "basepay"], // Flutterwave disabled by default
    paymentMethods: ["card", "bank_transfer", "wallet"],
    minOrderAmount: 100,
    maxOrderAmount: 1000000,
  };

  return (
    <PaymentMethodSelector
      selectedMethod={paymentMethod}
      onMethodSelect={handleMethodSelect}
      storeConfig={storeConfig}
      orderAmount={orderTotal}
      error={errors.paymentMethod?.message}
    />
  );
}
