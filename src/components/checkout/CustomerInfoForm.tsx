"use client";

import { useFormContext } from "react-hook-form";
import { User, Mail, Phone, UserCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckoutFormData } from "./CheckoutWizard";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface CustomerInfoFormProps {
  onSignInClick?: () => void;
  showSignInOption?: boolean;
}

export function CustomerInfoForm({
  onSignInClick,
  showSignInOption = true,
}: CustomerInfoFormProps) {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
    clearErrors,
  } = useFormContext<CheckoutFormData>();

  const [emailExists, setEmailExists] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const email = watch("customerInfo.email");
  const createAccount = watch("customerInfo.createAccount");

  // Email validation and duplicate checking
  const handleEmailBlur = async () => {
    if (!email || errors.customerInfo?.email) return;

    setIsCheckingEmail(true);
    try {
      // TODO: Implement actual email checking API call
      // const response = await checkEmailExists(email);
      // setEmailExists(response.exists);

      // Mock implementation for now
      await new Promise((resolve) => setTimeout(resolve, 500));
      const mockEmailExists = email === "existing@example.com";
      setEmailExists(mockEmailExists);
    } catch (error) {
      console.error("Email check failed:", error);
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const handleCreateAccountChange = (checked: boolean) => {
    setValue("customerInfo.createAccount", checked);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <User className="h-5 w-5 mr-2" />
          Customer Information
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          We&apos;ll use this information to process your order and send
          updates.
        </p>
      </div>

      {/* Customer Details Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* First Name */}
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-sm font-medium">
            First Name *
          </Label>
          <Input
            id="firstName"
            {...register("customerInfo.firstName")}
            placeholder="Enter your first name"
            className={cn(
              "h-12 text-base", // Larger touch target and text
              errors.customerInfo?.firstName ? "border-red-500" : ""
            )}
          />
          {errors.customerInfo?.firstName && (
            <p className="text-sm text-red-600">
              {errors.customerInfo.firstName.message}
            </p>
          )}
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-sm font-medium">
            Last Name *
          </Label>
          <Input
            id="lastName"
            {...register("customerInfo.lastName")}
            placeholder="Enter your last name"
            className={cn(
              "h-12 text-base",
              errors.customerInfo?.lastName ? "border-red-500" : ""
            )}
          />
          {errors.customerInfo?.lastName && (
            <p className="text-sm text-red-600">
              {errors.customerInfo.lastName.message}
            </p>
          )}
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label
          htmlFor="email"
          className="text-sm font-medium flex items-center"
        >
          <Mail className="h-4 w-4 mr-1" />
          Email Address *
        </Label>
        <div className="relative">
          <Input
            id="email"
            type="email"
            {...register("customerInfo.email")}
            placeholder="Enter your email address"
            className={cn(
              "h-12 text-base",
              errors.customerInfo?.email ? "border-red-500" : "",
              emailExists ? "border-orange-500" : ""
            )}
            onBlur={handleEmailBlur}
          />
          {isCheckingEmail && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            </div>
          )}
        </div>

        {errors.customerInfo?.email && (
          <p className="text-sm text-red-600">
            {errors.customerInfo.email.message}
          </p>
        )}

        {emailExists && (
          <Alert className="border-orange-200 bg-orange-50">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              An account with this email already exists.{" "}
              {showSignInOption && onSignInClick && (
                <Button
                  variant="link"
                  className="p-0 h-auto text-orange-600 hover:text-orange-800 underline"
                  onClick={onSignInClick}
                >
                  Sign in instead
                </Button>
              )}
            </AlertDescription>
          </Alert>
        )}

        <p className="text-xs text-gray-500">
          We&apos;ll send your order confirmation and updates to this email.
        </p>
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <Label
          htmlFor="phone"
          className="text-sm font-medium flex items-center"
        >
          <Phone className="h-4 w-4 mr-1" />
          Phone Number *
        </Label>
        <Input
          id="phone"
          type="tel"
          {...register("customerInfo.phone")}
          placeholder="Enter your phone number"
          className={cn(
            "h-12 text-base",
            errors.customerInfo?.phone ? "border-red-500" : ""
          )}
        />
        {errors.customerInfo?.phone && (
          <p className="text-sm text-red-600">
            {errors.customerInfo.phone.message}
          </p>
        )}
        <p className="text-xs text-gray-500">
          We may contact you about your order if needed.
        </p>
      </div>

      {/* Account Creation Option */}
      <div className="space-y-4">
        <div className="flex items-start space-x-2 p-4 bg-gray-50 rounded-lg">
          <Checkbox
            id="createAccount"
            checked={createAccount}
            onCheckedChange={handleCreateAccountChange}
            className="mt-0.5"
          />
          <div className="flex-1">
            <Label
              htmlFor="createAccount"
              className="text-sm font-medium cursor-pointer"
            >
              Create an account for faster future checkouts
            </Label>
            <p className="text-xs text-gray-500 mt-1">
              We&apos;ll send you an email to set up your password after your
              order is complete.
            </p>
          </div>
        </div>

        {/* Account Creation Notice */}
        {createAccount && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <UserCheck className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-900">
                  Account Benefits
                </h4>
                <ul className="text-sm text-blue-700 mt-1 space-y-1">
                  <li>• Save addresses for faster checkout</li>
                  <li>• Track your order history</li>
                  <li>• Receive exclusive offers and updates</li>
                  <li>• Manage your preferences</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Marketing Opt-in */}
      <div className="flex items-start space-x-2 p-4 bg-gray-50 rounded-lg">
        <Checkbox
          id="marketingOptIn"
          {...register("marketingOptIn")}
          className="mt-0.5"
        />
        <div className="flex-1">
          <Label
            htmlFor="marketingOptIn"
            className="text-sm font-medium cursor-pointer"
          >
            Keep me updated on new products and exclusive offers
          </Label>
          <p className="text-xs text-gray-500 mt-1">
            You can unsubscribe at any time. We respect your privacy.
          </p>
        </div>
      </div>

      {/* Login Option for Existing Users */}
      {showSignInOption && onSignInClick && (
        <div className="text-center pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Button
              variant="link"
              className="p-0 h-auto text-primary hover:text-blue-800"
              onClick={onSignInClick}
            >
              Sign in for faster checkout
            </Button>
          </p>
        </div>
      )}
    </div>
  );
}
