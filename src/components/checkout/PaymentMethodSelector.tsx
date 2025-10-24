"use client";

import { useState, useEffect } from "react";
import {
  CreditCard,
  Smartphone,
  Building2,
  Shield,
  Lock,
  AlertCircle,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";

export interface PaymentMethod {
  type: "card" | "bank_transfer" | "wallet" | "basepay";
  gateway: "paystack" | "flutterwave" | "basepay" | "wallet";
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  fees: string;
  processingTime: string;
  enabled: boolean;
  minAmount?: number;
  maxAmount?: number;
}

export interface PaymentMethodSelectorProps {
  selectedMethod?: {
    type: string;
    gateway: string;
  };
  onMethodSelect: (method: { type: string; gateway: string }) => void;
  storeConfig?: {
    enabledGateways: string[];
    paymentMethods: string[];
    minOrderAmount?: number;
    maxOrderAmount?: number;
  };
  orderAmount: number;
  error?: string;
  disabled?: boolean;
}

const DEFAULT_PAYMENT_METHODS: PaymentMethod[] = [
  {
    type: "card",
    gateway: "paystack",
    title: "Credit/Debit Card",
    description: "Visa, Mastercard, American Express",
    icon: CreditCard,
    fees: "No additional fees",
    processingTime: "Instant",
    enabled: false,
    minAmount: 100,
  },
  {
    type: "bank_transfer",
    gateway: "paystack",
    title: "Bank Transfer",
    description: "Direct bank transfer via Paystack",
    icon: Building2,
    fees: "No additional fees",
    processingTime: "1-2 business days",
    enabled: false,
    minAmount: 500,
  },
  {
    type: "card",
    gateway: "flutterwave",
    title: "Credit/Debit Card (Flutterwave)",
    description: "International cards supported",
    icon: CreditCard,
    fees: "Standard processing fees",
    processingTime: "Instant",
    enabled: false,
    minAmount: 100,
  },
  {
    type: "basepay",
    gateway: "basepay",
    title: "BasePay",
    description: "Pay with your Coinbase Wallet via BasePay",
    icon: Smartphone,
    fees: "Network fees apply",
    processingTime: "5-15 minutes",
    enabled: true,
    minAmount: 50,
    maxAmount: 100000,
  },
  {
    type: "wallet",
    gateway: "wallet",
    title: "Crypto Wallet",
    description: "Pay with your crypto wallet via Digemart SmartContract",
    icon: Smartphone,
    fees: "Network fees apply",
    processingTime: "5-15 minutes",
    enabled: true,
    minAmount: 50,
    maxAmount: 100000,
  },
];

export function PaymentMethodSelector({
  selectedMethod,
  onMethodSelect,
  storeConfig,
  orderAmount,
  error,
  disabled = false,
}: PaymentMethodSelectorProps) {
  const [availableMethods] = useState<PaymentMethod[]>(DEFAULT_PAYMENT_METHODS.filter((method) => method.enabled));
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Filter and validate payment methods based on store configuration and order amount
  useEffect(() => {
    const errors: string[] = [];
    if (selectedMethod && availableMethods.length > 0) {
      const isValidSelection = availableMethods.some(
        (method) =>
          method.type === selectedMethod.type &&
          method.gateway === selectedMethod.gateway
      );

      if (!isValidSelection) {
        errors.push("Selected payment method is not available for this order");
      }
    }

    setValidationErrors(errors);
  }, [storeConfig, orderAmount, selectedMethod]);

  const handleMethodSelect = (methodKey: string) => {
    if (disabled) return;

    const [type, gateway] = methodKey.split("-");
    const method = availableMethods.find(
      (m) => m.type === type && m.gateway === gateway
    );

    if (method) {
      onMethodSelect({ type, gateway });
      setValidationErrors([]);
    }
  };

  const getSelectedMethodKey = () => {
    if (!selectedMethod) return "";
    return `${selectedMethod.type}-${selectedMethod.gateway}`;
  };


  if (availableMethods.length === 0) {
    return (
      <div className="space-y-4">
        <div className="border-b border-gray-200 pb-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Payment Method
          </h2>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No payment methods are available for this order. Please contact
            support or try a different order amount.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <CreditCard className="h-5 w-5 mr-2" />
          Payment Method
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Choose how you&apos;d like to pay for your order.
        </p>
      </div>

      {/* Validation Errors */}
      {(validationErrors.length > 0 || error) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error || validationErrors.join(", ")}
          </AlertDescription>
        </Alert>
      )}

      {/* Payment Method Selection */}
      <div className="space-y-4">
        <Label className="text-base font-medium">Select Payment Method</Label>

        <RadioGroup
          value={getSelectedMethodKey()}
          onValueChange={handleMethodSelect}
          disabled={disabled}
          className="space-y-3"
        >
          {availableMethods.map((method) => {
            const methodKey = `${method.type}-${method.gateway}`;
            const Icon = method.icon;
            const isSelected = getSelectedMethodKey() === methodKey;

            return (
              <div
                key={methodKey}
                className={`flex items-start space-x-3 p-4 border rounded-lg transition-colors ${disabled
                  ? "opacity-50 cursor-not-allowed"
                  : isSelected
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300 cursor-pointer"
                  }`}
              >
                <RadioGroupItem
                  value={methodKey}
                  id={methodKey}
                  className="mt-1"
                  disabled={disabled}
                />

                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <Icon className="h-5 w-5 text-gray-600" />
                    <div>
                      <Label
                        htmlFor={methodKey}
                        className={`font-medium ${disabled ? "cursor-not-allowed" : "cursor-pointer"
                          }`}
                      >
                        {method.title}
                      </Label>
                      <p className="text-sm text-gray-600">
                        {method.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2 grid grid-cols-2 gap-4 text-xs text-gray-500">
                    <div>
                      <span className="font-medium">Fees:</span> {method.fees}
                    </div>
                    <div>
                      <span className="font-medium">Processing:</span>{" "}
                      {method.processingTime}
                    </div>
                  </div>

                  {/* Amount Limits */}
                  {(method.minAmount || method.maxAmount) && (
                    <div className="mt-2 text-xs text-gray-500">
                      <span className="font-medium">Limits:</span>{" "}
                      {method.minAmount &&
                        `Min: ₦${method.minAmount.toLocaleString()}`}
                      {method.minAmount && method.maxAmount && " • "}
                      {method.maxAmount &&
                        `Max: ₦${method.maxAmount.toLocaleString()}`}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </RadioGroup>
      </div>


      {/* Security Information */}
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg hidden">
        <div className="flex items-start space-x-3">
          <Shield className="h-5 w-5 text-green-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-green-900">
              Your Payment is Secure
            </h4>
            <div className="text-sm text-green-700 mt-1 space-y-1">
              <div className="flex items-center space-x-2">
                <Lock className="h-3 w-3" />
                <span>256-bit SSL encryption</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-3 w-3" />
                <span>PCI DSS compliant payment processing</span>
              </div>
              <p className="mt-2">
                We never store your payment information. All transactions are
                processed securely through our certified payment partners.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Gateway Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-500 hidden">
        {availableMethods.some((m) => m.gateway === "paystack") && (
          <div className="p-3 bg-white border border-gray-200 rounded">
            <h5 className="font-medium text-gray-700 mb-1">Paystack</h5>
            <p>
              Secure payment processing for cards and bank transfers in Nigeria
              and beyond.
            </p>
          </div>
        )}
        {availableMethods.some((m) => m.gateway === "flutterwave") && (
          <div className="p-3 bg-white border border-gray-200 rounded">
            <h5 className="font-medium text-gray-700 mb-1">Flutterwave</h5>
            <p>
              International payment gateway supporting multiple currencies and
              payment methods.
            </p>
          </div>
        )}
        {availableMethods.some((m) => m.gateway === "basepay") && (
          <div className="p-3 bg-white border border-gray-200 rounded">
            <h5 className="font-medium text-gray-700 mb-1">BasePay</h5>
            <p>
              Decentralized payment solution for cryptocurrency transactions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
