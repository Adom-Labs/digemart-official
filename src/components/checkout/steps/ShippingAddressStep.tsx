"use client";

import { useSession } from "next-auth/react";
import { useFormContext } from "react-hook-form";
import { useState, useEffect } from "react";
import { SavedAddresses } from "../SavedAddresses";
import { ShippingAddressForm } from "../ShippingAddressForm";
import { CheckoutFormData } from "../CheckoutWizard";

interface SavedAddress {
  id: string;
  fullName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
  label?: string;
}

export function ShippingAddressStep() {
  const { data: session } = useSession();
  const { watch, setValue } = useFormContext<CheckoutFormData>();

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(
    null
  );

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

  const handleAddNewAddress = () => {
    setEditingAddress(null);
    setShowAddressForm(true);
  };

  const handleEditAddress = (address: SavedAddress) => {
    setEditingAddress(address);
    setShowAddressForm(true);

    // Pre-populate form with address data
    setValue("shippingAddress.fullName", address.fullName);
    setValue("shippingAddress.address", address.address);
    setValue("shippingAddress.city", address.city);
    setValue("shippingAddress.state", address.state);
    setValue("shippingAddress.postalCode", address.postalCode);
    setValue("shippingAddress.country", address.country);
    setValue("shippingAddress.phone", address.phone || "");
  };

  const handleDeleteAddress = (addressId: string) => {
    // TODO: Implement address deletion
    console.log("Delete address:", addressId);
  };

  const handleSaveAddress = (address: SavedAddress) => {
    // TODO: Implement address saving
    console.log("Save address:", address);
  };

  // For guest users or when showing address form
  if (customerInfo.isGuest || showAddressForm) {
    return (
      <div className="space-y-6">
        <ShippingAddressForm
          onSaveAddress={handleSaveAddress}
          showSaveOption={!customerInfo.isGuest}
        />

        {/* Back to saved addresses option for authenticated users */}
        {!customerInfo.isGuest && showAddressForm && (
          <div className="text-center pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowAddressForm(false)}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              ← Back to saved addresses
            </button>
          </div>
        )}

        {/* Shipping Options Preview */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            Shipping Information
          </h4>
          <div className="text-sm text-blue-700 space-y-1">
            <p>
              • Standard shipping: 5-7 business days (Free on orders over $100)
            </p>
            <p>• Express shipping: 2-3 business days ($15.99)</p>
            <p>• Overnight shipping: Next business day ($29.99)</p>
          </div>
        </div>
      </div>
    );
  }

  // For authenticated users, show saved addresses
  return (
    <div className="space-y-6">
      <SavedAddresses
        onAddNewAddress={handleAddNewAddress}
        onEditAddress={handleEditAddress}
        onDeleteAddress={handleDeleteAddress}
      />

      {/* Shipping Options Preview */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">
          Shipping Information
        </h4>
        <div className="text-sm text-blue-700 space-y-1">
          <p>
            • Standard shipping: 5-7 business days (Free on orders over $100)
          </p>
          <p>• Express shipping: 2-3 business days ($15.99)</p>
          <p>• Overnight shipping: Next business day ($29.99)</p>
        </div>
      </div>
    </div>
  );
}
