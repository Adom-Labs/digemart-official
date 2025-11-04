"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useFormContext } from "react-hook-form";
import { MapPin, Plus, Edit3, Trash2, Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckoutFormData } from "./CheckoutWizard";
import { cn } from "@/lib/utils";

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
  label?: string; // e.g., "Home", "Work", "Office"
}

interface SavedAddressesProps {
  onAddNewAddress: () => void;
  onEditAddress: (address: SavedAddress) => void;
  onDeleteAddress: (addressId: string) => void;
}

export function SavedAddresses({
  onAddNewAddress,
  onEditAddress,
  onDeleteAddress,
}: SavedAddressesProps) {
  const { data: session } = useSession();
  const { setValue, watch } = useFormContext<CheckoutFormData>();

  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // Load saved addresses
  useEffect(() => {
    const loadSavedAddresses = async () => {
      if (!session?.user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // TODO: Implement actual API call to fetch user's saved addresses
        // const response = await fetchUserAddresses(session.user.id);
        // setSavedAddresses(response.addresses);

        // Mock data for now
        await new Promise((resolve) => setTimeout(resolve, 500));
        const mockAddresses: SavedAddress[] = [
          {
            id: "1",
            fullName: "John Doe",
            address: "123 Main Street, Apt 4B",
            city: "New York",
            state: "NY",
            postalCode: "10001",
            country: "US",
            phone: "+1 (555) 123-4567",
            isDefault: true,
            label: "Home",
          },
          {
            id: "2",
            fullName: "John Doe",
            address: "456 Business Ave, Suite 200",
            city: "New York",
            state: "NY",
            postalCode: "10002",
            country: "US",
            phone: "+1 (555) 987-6543",
            isDefault: false,
            label: "Work",
          },
        ];
        setSavedAddresses(mockAddresses);

        // Auto-select default address
        const defaultAddress = mockAddresses.find((addr) => addr.isDefault);
        if (defaultAddress) {
          handleAddressSelect(defaultAddress);
        }
      } catch (err) {
        setError("Failed to load saved addresses");
        console.error("Error loading addresses:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedAddresses();
  }, [session]);

  const handleAddressSelect = (address: SavedAddress) => {
    setSelectedAddressId(address.id);

    // Update form with selected address
    setValue("shippingAddress.fullName", address.fullName);
    setValue("shippingAddress.address", address.address);
    setValue("shippingAddress.city", address.city);
    setValue("shippingAddress.state", address.state);
    setValue("shippingAddress.postalCode", address.postalCode);
  };

  const handleDeleteClick = async (addressId: string) => {
    try {
      // TODO: Implement actual API call to delete address
      // await deleteUserAddress(addressId);

      setSavedAddresses((prev) => prev.filter((addr) => addr.id !== addressId));

      // If deleted address was selected, clear selection
      if (selectedAddressId === addressId) {
        setSelectedAddressId("");
        // Clear form
        setValue("shippingAddress.fullName", "");
        setValue("shippingAddress.address", "");
        setValue("shippingAddress.city", "");
        setValue("shippingAddress.state", "");
        setValue("shippingAddress.postalCode", "");
      }

      onDeleteAddress(addressId);
    } catch (err) {
      setError("Failed to delete address");
      console.error("Error deleting address:", err);
    }
  };

  const formatAddress = (address: SavedAddress) => {
    return `${address.address}, ${address.city}, ${address.state} ${address.postalCode}`;
  };

  const getCountryName = (countryCode: string) => {
    const countryNames: Record<string, string> = {
      US: "United States",
      CA: "Canada",
      GB: "United Kingdom",
      // Add more as needed
    };
    return countryNames[countryCode] || countryCode;
  };

  if (!session?.user) {
    return (
      <div className="text-center py-8">
        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-4">Sign in to use saved addresses</p>
        <Button onClick={onAddNewAddress} className="flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Enter New Address
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="border-b border-gray-200 pb-4">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-48"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-64 mt-2"></div>
        </div>
        {[1, 2].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <MapPin className="h-5 w-5 mr-2" />
          Shipping Address
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Choose from your saved addresses or add a new one.
        </p>
      </div>

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {savedAddresses.length === 0 ? (
        <div className="text-center py-8">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No saved addresses found</p>
          <Button onClick={onAddNewAddress} className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Add New Address
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Saved Addresses List */}
          <div className="grid gap-4">
            {savedAddresses.map((address) => (
              <Card
                key={address.id}
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:shadow-md",
                  selectedAddressId === address.id
                    ? "ring-2 ring-blue-500 border-blue-200 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                )}
                onClick={() => handleAddressSelect(address)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-medium text-gray-900">
                          {address.fullName}
                        </h3>
                        {address.label && (
                          <Badge variant="secondary" className="text-xs">
                            {address.label}
                          </Badge>
                        )}
                        {address.isDefault && (
                          <Badge className="text-xs bg-green-100 text-green-800">
                            <Star className="h-3 w-3 mr-1" />
                            Default
                          </Badge>
                        )}
                        {selectedAddressId === address.id && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </div>

                      <p className="text-sm text-gray-600 mb-1">
                        {formatAddress(address)}
                      </p>

                      <p className="text-sm text-gray-600">
                        {getCountryName(address.country)}
                      </p>

                      {address.phone && (
                        <p className="text-sm text-gray-500 mt-1">
                          {address.phone}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-1 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditAddress(address);
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>

                      {!address.isDefault && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(address.id);
                          }}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Add New Address Button */}
          <Button
            variant="outline"
            onClick={onAddNewAddress}
            className="w-full flex items-center justify-center space-x-2 h-12 border-dashed border-2 hover:border-blue-300 hover:bg-blue-50"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Address</span>
          </Button>
        </div>
      )}
    </div>
  );
}
