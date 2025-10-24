"use client";

import { useFormContext } from "react-hook-form";
import { useState, useCallback } from "react";
import { MapPin, Check, AlertTriangle } from "lucide-react";
import {
  useAddressAutocomplete,
  type AddressSuggestion,
} from "@/lib/utils/address-autocomplete";
import {
  validateAddress,
  formatPostalCode,
  formatPhoneNumber,
  type AddressData,
  type ValidationResult,
} from "@/lib/utils/address-validation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckoutFormData } from "./CheckoutWizard";
import { cn } from "@/lib/utils";

interface ShippingAddressFormProps {
  onSaveAddress?: (address: ShippingAddress) => void;
  showSaveOption?: boolean;
}

interface ShippingAddress {
  id?: string;
  fullName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}

// Common countries for the select dropdown
const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "NL", name: "Netherlands" },
  { code: "BE", name: "Belgium" },
  { code: "CH", name: "Switzerland" },
  { code: "AT", name: "Austria" },
  { code: "SE", name: "Sweden" },
  { code: "NO", name: "Norway" },
  { code: "DK", name: "Denmark" },
  { code: "FI", name: "Finland" },
  { code: "JP", name: "Japan" },
  { code: "KR", name: "South Korea" },
  { code: "SG", name: "Singapore" },
  { code: "HK", name: "Hong Kong" },
  { code: "NZ", name: "New Zealand" },
  { code: "MX", name: "Mexico" },
  { code: "BR", name: "Brazil" },
  { code: "AR", name: "Argentina" },
  { code: "CL", name: "Chile" },
  { code: "CO", name: "Colombia" },
  { code: "PE", name: "Peru" },
  { code: "IN", name: "India" },
  { code: "CN", name: "China" },
  { code: "TH", name: "Thailand" },
  { code: "MY", name: "Malaysia" },
  { code: "ID", name: "Indonesia" },
  { code: "PH", name: "Philippines" },
  { code: "VN", name: "Vietnam" },
  { code: "ZA", name: "South Africa" },
  { code: "EG", name: "Egypt" },
  { code: "MA", name: "Morocco" },
  { code: "KE", name: "Kenya" },
  { code: "NG", name: "Nigeria" },
  { code: "GH", name: "Ghana" },
];

// US States for state selection
const US_STATES = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
];

export function ShippingAddressForm({
  onSaveAddress,
  showSaveOption = false,
}: ShippingAddressFormProps) {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<CheckoutFormData>();

  const [saveAddress, setSaveAddress] = useState(false);
  const [isValidatingAddress, setIsValidatingAddress] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState<
    AddressSuggestion[]
  >([]);
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null);
  const [showValidation, setShowValidation] = useState(false);

  const selectedCountry = watch("shippingAddress.country");
  const fullAddress = watch("shippingAddress.address");
  const postalCode = watch("shippingAddress.postalCode");
  const phone = watch("shippingAddress.phone");

  const { getSuggestions } = useAddressAutocomplete();

  // Handle address autocomplete with validation
  const handleAddressChange = useCallback(
    async (value: string) => {
      setValue("shippingAddress.address", value);

      if (value.length > 3) {
        setIsValidatingAddress(true);
        try {
          const suggestions = await getSuggestions(value, {
            country: selectedCountry,
            maxResults: 5,
          });
          setAddressSuggestions(suggestions);
        } catch (error) {
          console.error("Address autocomplete failed:", error);
          setAddressSuggestions([]);
        } finally {
          setIsValidatingAddress(false);
        }
      } else {
        setAddressSuggestions([]);
      }
    },
    [setValue, selectedCountry, getSuggestions]
  );

  const handleSuggestionClick = (suggestion: AddressSuggestion) => {
    setValue("shippingAddress.address", suggestion.displayText);

    // Auto-fill other fields if available
    if (suggestion.components) {
      const { components } = suggestion;
      if (components.city) setValue("shippingAddress.city", components.city);
      if (components.state) setValue("shippingAddress.state", components.state);
      if (components.postalCode)
        setValue("shippingAddress.postalCode", components.postalCode);
      if (components.country)
        setValue("shippingAddress.country", components.country);
    }

    setAddressSuggestions([]);
  };

  // Validate address on blur
  const handleAddressValidation = useCallback(async () => {
    const addressData: Partial<AddressData> = {
      fullName: watch("shippingAddress.fullName"),
      address: fullAddress,
      city: watch("shippingAddress.city"),
      state: watch("shippingAddress.state"),
      postalCode: postalCode,
      country: selectedCountry,
      phone: phone,
    };

    if (addressData.address && addressData.city && addressData.country) {
      const result = validateAddress(addressData, {
        validatePostalCode: true,
        validatePhone: true,
        suggestCorrections: true,
      });

      setValidationResult(result);
      setShowValidation(result.warnings.length > 0 || result.errors.length > 0);
    }
  }, [fullAddress, postalCode, phone, selectedCountry, watch]);

  // Format postal code on blur
  const handlePostalCodeBlur = () => {
    if (postalCode && selectedCountry) {
      const formatted = formatPostalCode(postalCode, selectedCountry);
      if (formatted !== postalCode) {
        setValue("shippingAddress.postalCode", formatted);
      }
    }
    handleAddressValidation();
  };

  // Format phone number on blur
  const handlePhoneBlur = () => {
    if (phone && selectedCountry) {
      const formatted = formatPhoneNumber(phone, selectedCountry);
      if (formatted !== phone) {
        setValue("shippingAddress.phone", formatted);
      }
    }
  };

  const handleSaveAddressChange = (checked: boolean) => {
    setSaveAddress(checked);
    if (checked && onSaveAddress) {
      // Prepare address data for saving
      const addressData: ShippingAddress = {
        fullName: watch("shippingAddress.fullName"),
        address: watch("shippingAddress.address"),
        city: watch("shippingAddress.city"),
        state: watch("shippingAddress.state"),
        postalCode: watch("shippingAddress.postalCode"),
        country: watch("shippingAddress.country"),
        phone: watch("shippingAddress.phone"),
      };
      onSaveAddress(addressData);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <MapPin className="h-5 w-5 mr-2" />
          Shipping Address
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Where should we deliver your order?
        </p>
      </div>

      {/* Full Name */}
      <div className="space-y-2">
        <Label htmlFor="fullName" className="text-sm font-medium">
          Full Name *
        </Label>
        <Input
          id="fullName"
          {...register("shippingAddress.fullName")}
          placeholder="Enter recipient's full name"
          className={cn(
            "h-12 text-base",
            errors.shippingAddress?.fullName ? "border-red-500" : ""
          )}
        />
        {errors.shippingAddress?.fullName && (
          <p className="text-sm text-red-600">
            {errors.shippingAddress.fullName.message}
          </p>
        )}
      </div>

      {/* Address with Autocomplete */}
      <div className="space-y-2">
        <Label htmlFor="address" className="text-sm font-medium">
          Street Address *
        </Label>
        <div className="relative">
          <Input
            id="address"
            value={fullAddress || ""}
            onChange={(e) => handleAddressChange(e.target.value)}
            placeholder="Enter your street address"
            className={cn(
              "h-12 text-base",
              errors.shippingAddress?.address ? "border-red-500" : ""
            )}
          />
          {isValidatingAddress && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* Address Suggestions */}
          {addressSuggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {addressSuggestions.map((suggestion, index) => (
                <button
                  key={suggestion.id || index}
                  type="button"
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className="font-medium text-gray-900">
                    {suggestion.displayText}
                  </div>
                  {suggestion.confidence && (
                    <div className="text-xs text-gray-500 mt-1">
                      Confidence: {Math.round(suggestion.confidence * 100)}%
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
        {errors.shippingAddress?.address && (
          <p className="text-sm text-red-600">
            {errors.shippingAddress.address.message}
          </p>
        )}
      </div>

      {/* City, State, Postal Code */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* City */}
        <div className="space-y-2">
          <Label htmlFor="city" className="text-sm font-medium">
            City *
          </Label>
          <Input
            id="city"
            {...register("shippingAddress.city")}
            placeholder="Enter city"
            className={cn(
              "h-12 text-base",
              errors.shippingAddress?.city ? "border-red-500" : ""
            )}
          />
          {errors.shippingAddress?.city && (
            <p className="text-sm text-red-600">
              {errors.shippingAddress.city.message}
            </p>
          )}
        </div>

        {/* State/Province */}
        <div className="space-y-2">
          <Label htmlFor="state" className="text-sm font-medium">
            State/Province *
          </Label>
          {selectedCountry === "US" ? (
            <Select
              value={watch("shippingAddress.state") || ""}
              onValueChange={(value) =>
                setValue("shippingAddress.state", value)
              }
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {US_STATES.map((state) => (
                  <SelectItem key={state.code} value={state.code}>
                    {state.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              id="state"
              {...register("shippingAddress.state")}
              placeholder="Enter state/province"
              className={cn(
                "h-12 text-base",
                errors.shippingAddress?.state ? "border-red-500" : ""
              )}
            />
          )}
          {errors.shippingAddress?.state && (
            <p className="text-sm text-red-600">
              {errors.shippingAddress.state.message}
            </p>
          )}
        </div>

        {/* Postal Code */}
        <div className="space-y-2">
          <Label htmlFor="postalCode" className="text-sm font-medium">
            Postal Code *
          </Label>
          <Input
            id="postalCode"
            {...register("shippingAddress.postalCode")}
            placeholder="Enter postal code"
            className={cn(
              "h-12 text-base",
              errors.shippingAddress?.postalCode ? "border-red-500" : ""
            )}
            onBlur={handlePostalCodeBlur}
          />
          {errors.shippingAddress?.postalCode && (
            <p className="text-sm text-red-600">
              {errors.shippingAddress.postalCode.message}
            </p>
          )}
        </div>
      </div>

      {/* Country */}
      <div className="space-y-2">
        <Label htmlFor="country" className="text-sm font-medium">
          Country *
        </Label>
        <Select
          value={selectedCountry || ""}
          onValueChange={(value) => setValue("shippingAddress.country", value)}
        >
          <SelectTrigger className="h-12">
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            {COUNTRIES.map((country) => (
              <SelectItem key={country.code} value={country.code}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.shippingAddress?.country && (
          <p className="text-sm text-red-600">
            {errors.shippingAddress.country.message}
          </p>
        )}
      </div>

      {/* Phone (Optional) */}
      <div className="space-y-2">
        <Label htmlFor="shippingPhone" className="text-sm font-medium">
          Phone Number (Optional)
        </Label>
        <Input
          id="shippingPhone"
          type="tel"
          {...register("shippingAddress.phone")}
          placeholder="Enter phone number for delivery updates"
          className="h-12 text-base"
          onBlur={handlePhoneBlur}
        />
        <p className="text-xs text-gray-500">
          We&apos;ll use this to contact you about delivery if needed.
        </p>
      </div>

      {/* Save Address Option */}
      {showSaveOption && (
        <div className="flex items-start space-x-2 p-4 bg-gray-50 rounded-lg">
          <Checkbox
            id="saveAddress"
            checked={saveAddress}
            onCheckedChange={handleSaveAddressChange}
            className="mt-0.5"
          />
          <div className="flex-1">
            <Label
              htmlFor="saveAddress"
              className="text-sm font-medium cursor-pointer"
            >
              Save this address to my account
            </Label>
            <p className="text-xs text-gray-500 mt-1">
              Save time on future orders by storing this address.
            </p>
          </div>
        </div>
      )}

      {/* Address Validation Results */}
      {showValidation && validationResult && (
        <div className="space-y-3">
          {/* Validation Errors */}
          {validationResult.errors.length > 0 && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <div className="font-medium mb-1">Address Issues:</div>
                <ul className="list-disc list-inside space-y-1">
                  {validationResult.errors.map(
                    (error: string, index: number) => (
                      <li key={index} className="text-sm">
                        {error}
                      </li>
                    )
                  )}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Validation Warnings */}
          {validationResult.warnings.length > 0 && (
            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <div className="font-medium mb-1">Address Suggestions:</div>
                <ul className="list-disc list-inside space-y-1">
                  {validationResult.warnings.map(
                    (warning: string, index: number) => (
                      <li key={index} className="text-sm">
                        {warning}
                      </li>
                    )
                  )}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Validation Suggestions */}
          {validationResult.suggestions &&
            validationResult.suggestions.length > 0 && (
              <Alert className="border-blue-200 bg-blue-50">
                <Check className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <div className="font-medium mb-1">Helpful Tips:</div>
                  <ul className="list-disc list-inside space-y-1">
                    {validationResult.suggestions.map(
                      (suggestion: string, index: number) => (
                        <li key={index} className="text-sm">
                          {suggestion}
                        </li>
                      )
                    )}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
        </div>
      )}

      {/* Address Verification Notice */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start space-x-2">
          <Check className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-900">
              Address Verification
            </h4>
            <p className="text-sm text-blue-700 mt-1">
              We&apos;ll verify your address before shipping to ensure
              successful delivery. You&apos;ll be notified if any corrections
              are needed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
