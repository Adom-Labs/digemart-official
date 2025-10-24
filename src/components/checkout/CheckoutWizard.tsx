"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { CheckoutProgress, CheckoutStep } from "./CheckoutProgress";
import { CustomerInfoStep } from "./steps/CustomerInfoStep";
import { ShippingAddressStep } from "./steps/ShippingAddressStep";
import { PaymentMethodStep } from "./steps/PaymentMethodStep";
import { OrderReviewStep } from "./steps/OrderReviewStep";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CartItem } from "@/lib/api/types";
import { useStoreCart } from "@/lib/api/hooks";
import { useSession } from "next-auth/react";
import { BASE_URL } from "@/lib/api-request";
import { PaymentModal } from "./PaymentModal";

// Checkout form schema
const checkoutSchema = z.object({
  // Customer Information
  customerInfo: z.object({
    isGuest: z.boolean(),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Valid email is required"),
    phone: z.string().min(10, "Valid phone number is required"),
    createAccount: z.boolean().optional(),
  }),

  // Shipping Address
  shippingAddress: z.object({
    fullName: z.string().min(1, "Full name is required"),
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    postalCode: z.string().min(1, "Postal code is required").optional(),
  }),

  // Payment Method
  paymentMethod: z.object({
    type: z.enum(["card", "bank_transfer", "wallet", "basepay"]),
    gateway: z.enum(["paystack", "flutterwave", "basepay", "wallet"]),
  }),

  // Additional Options
  specialInstructions: z.string().optional(),
  marketingOptIn: z.boolean(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface CheckoutWizardProps {
  storeId: number;
}

const CHECKOUT_STEPS: CheckoutStep[] = [
  {
    id: "customer-info",
    title: "Customer Information",
    description: "Your contact details",
  },
  {
    id: "shipping-address",
    title: "Shipping Address",
    description: "Where to send your order",
  },
  {
    id: "payment-method",
    title: "Payment Method",
    description: "How you'll pay",
  },
  {
    id: "order-review",
    title: "Review Order",
    description: "Confirm your purchase",
  },
];

export function CheckoutWizard({ storeId }: CheckoutWizardProps) {
  const { data: session } = useSession()
  const { data: storeCart } = useStoreCart(storeId || 0, { enabled: session?.user ? true : false });
  const cart = storeCart?.data;
  const items: CartItem[] = cart?.cartItems || [];

  const [currentStep, setCurrentStep] = useState("customer-info");
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentType, setSelectedPaymentType] = useState<"card" | "bank_transfer" | "wallet" | "basepay">("card");

  const methods = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerInfo: {
        isGuest: true,
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        createAccount: false,
      },
      shippingAddress: {
        fullName: "",
        address: "",
        city: "",
        state: "",
        postalCode: "",
      },
      paymentMethod: {
        type: "card",
        gateway: "paystack",
      },
      specialInstructions: "",
      marketingOptIn: false,
    },
    mode: "onChange",
  });

  const { trigger, watch } = methods;

  // Watch for form changes to save progress
  const formData = watch();

  // Save form data to localStorage for persistence
  useEffect(() => {
    const saveData = {
      formData,
      currentStep,
      completedSteps,
    };
    localStorage.setItem(`checkout-${storeId}`, JSON.stringify(saveData));
  }, [formData, currentStep, completedSteps, storeId]);

  // Load saved form data on mount
  useEffect(() => {
    const savedData = localStorage.getItem(`checkout-${storeId}`);
    if (savedData) {
      try {
        const {
          formData: savedFormData,
          currentStep: savedStep,
          completedSteps: savedCompleted,
        } = JSON.parse(savedData);
        methods.reset(savedFormData);
        setCurrentStep(savedStep);
        setCompletedSteps(savedCompleted);
      } catch (error) {
        console.error("Failed to load saved checkout data:", error);
      }
    }
  }, [storeId, methods]);


  if (!session?.user) {
    return <h1>User not authenticated</h1>
  }


  if (!cart || cart.cartItems.length === 0) {
    return <h1>No cart available to process</h1>
  }

  const getCurrentStepIndex = () => {
    return CHECKOUT_STEPS.findIndex((step) => step.id === currentStep);
  };

  const validateCurrentStep = async (): Promise<boolean> => {
    const stepIndex = getCurrentStepIndex();

    switch (stepIndex) {
      case 0: // Customer Info
        return await trigger("customerInfo");
      case 1: // Shipping Address
        return await trigger("shippingAddress");
      case 2: // Payment Method
        return await trigger("paymentMethod");
      case 3: // Order Review
        return true; // No validation needed for review step
      default:
        return false;
    }
  };

  const goToNextStep = async () => {
    const isValid = await validateCurrentStep();
    if (!isValid) return;

    const currentIndex = getCurrentStepIndex();
    if (currentIndex < CHECKOUT_STEPS.length - 1) {
      // Mark current step as completed
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }

      // Move to next step
      setCurrentStep(CHECKOUT_STEPS[currentIndex + 1].id);
    }
  };

  const goToPreviousStep = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex > 0) {
      setCurrentStep(CHECKOUT_STEPS[currentIndex - 1].id);
    }
  };

  // Removed unused goToStep function

  const handleSubmitOrder = async (data: CheckoutFormData) => {
    setIsSubmitting(true);

    try {
      console.log("Submitting order:", data);

      // Transform cart items to API format
      const ct = items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.product.price,
      }));

      // Map payment method type to enum
      const paymentMethodTypeMap: Record<string, string> = {
        card: "CARD",
        bank_transfer: "BANK_TRANSFER",
        wallet: "WALLET",
        basepay: "BASEPAY",
      };

      // Prepare checkout data matching CompleteCheckoutDto
      const checkoutData = {
        storeId,
        items: ct,
        customerInfo: {
          name: `${data.customerInfo.firstName} ${data.customerInfo.lastName}`,
          email: data.customerInfo.email,
          phone: data.customerInfo.phone,
          isGuest: data.customerInfo.isGuest,
        },
        shippingAddress: {
          fullName: data.shippingAddress.fullName,
          address: data.shippingAddress.address,
          city: data.shippingAddress.city,
          state: data.shippingAddress.state,
          postalCode: data.shippingAddress.postalCode || "",
          country: "NG",
        },
        paymentMethod: {
          type: paymentMethodTypeMap[data.paymentMethod.type],
          gateway: data.paymentMethod.gateway,
        },
        specialInstructions: data.specialInstructions,
      };

      // Call checkout complete API
      const response = await fetch(
        `${BASE_URL}/checkout/complete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user}`,
          },
          body: JSON.stringify(checkoutData),
        }
      );

      const result = await response.json();
      console.log("Checkout API Response:", result.data);

      // Store payment type
      setSelectedPaymentType(data.paymentMethod.type);

      // Set order data and show payment modal
      setOrderData(result.data);
      setShowPaymentModal(true);

      // Clear saved data on successful submission
      localStorage.removeItem(`checkout-${storeId}`);
    } catch (error) {
      console.error("Order submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentComplete = () => {
    // TODO: Handle payment completion
    // For now, just close modal and maybe redirect
    setShowPaymentModal(false);
    console.log("Payment completed for order:", orderData?.orderId);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "customer-info":
        return <CustomerInfoStep />;
      case "shipping-address":
        return <ShippingAddressStep />;
      case "payment-method":
        return <PaymentMethodStep />;
      case "order-review":
        return <OrderReviewStep onSubmit={handleSubmitOrder} />;
      default:
        return null;
    }
  };

  const currentIndex = getCurrentStepIndex();
  const isFirstStep = currentIndex === 0;
  const isLastStep = currentIndex === CHECKOUT_STEPS.length - 1;



  return (
    <FormProvider {...methods}>
      <div className="space-y-8">
        {/* Progress Indicator */}
        <CheckoutProgress
          steps={CHECKOUT_STEPS}
          currentStep={currentStep}
          completedSteps={completedSteps}
        />

        {/* Step Content */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
          {renderCurrentStep()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={goToPreviousStep}
            disabled={isFirstStep}
            className="flex items-center justify-center space-x-2 w-full sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Previous</span>
          </Button>

          {!isLastStep ? (
            <Button
              type="button"
              onClick={goToNextStep}
              className="flex items-center justify-center space-x-2 w-full sm:w-auto"
            >
              <span>Continue</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              onClick={methods.handleSubmit(handleSubmitOrder)}
              disabled={isSubmitting}
              className="flex items-center justify-center space-x-2 w-full sm:w-auto bg-green-600 hover:bg-green-700"
            >
              <span>{isSubmitting ? "Processing..." : "Place Order"}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        orderData={orderData}
        paymentType={selectedPaymentType}
        onPaymentComplete={handlePaymentComplete}
      />
    </FormProvider>
  );
}
