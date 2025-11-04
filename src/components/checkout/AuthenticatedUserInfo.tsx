"use client";

import { useSession } from "next-auth/react";
import { useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";
import { User, Mail, Phone, Edit3, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckoutFormData } from "./CheckoutWizard";
import { useUserProfile } from "@/lib/api/hooks";

interface AuthenticatedUserInfoProps {
  onSignOutClick?: () => void;
}

export function AuthenticatedUserInfo({
  onSignOutClick,
}: AuthenticatedUserInfoProps) {
  const { data: session } = useSession();
  const { data: profile } = useUserProfile();

  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<CheckoutFormData>();

  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  // const marketingOptIn = watch("marketingOptIn");
  const isEmailIds =
    profile && profile?.identities.filter((id) => id.provider === "EMAIL");
  const hasEmail = isEmailIds && isEmailIds.length > 0;
  const emailId = hasEmail ? isEmailIds![0] : null;

  // Pre-populate form with user data
  useEffect(() => {
    if (session?.user) {
      const user = session.user;

      // Parse name into first and last name
      const nameParts = user.name?.split(" ") || [];
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      const userInfo = {
        firstName,
        lastName,
        email: hasEmail ? emailId?.email || "" : "",
        phone: profile?.user.phone || "", // Phone might not be available from session
      };

      // Set form values
      setValue("customerInfo.firstName", userInfo.firstName);
      setValue("customerInfo.lastName", userInfo.lastName);
      setValue("customerInfo.email", userInfo.email);
      setValue("customerInfo.phone", userInfo.phone);
      setValue("customerInfo.isGuest", false);
      setValue("customerInfo.createAccount", false); // Already has account

      // Set edited info for local editing
      setEditedInfo(userInfo);
      setIsEditing(!hasEmail);
    }
  }, [session, setValue, profile, hasEmail, emailId]);

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      setValue("customerInfo.firstName", editedInfo.firstName);
      setValue("customerInfo.lastName", editedInfo.lastName);
      setValue("customerInfo.email", editedInfo.email);
      setValue("customerInfo.phone", editedInfo.phone);
    } else {
      // Start editing - populate with current form values
      const currentValues = {
        firstName: watch("customerInfo.firstName") || "",
        lastName: watch("customerInfo.lastName") || "",
        email: watch("customerInfo.email") || "",
        phone: watch("customerInfo.phone") || "",
      };
      setEditedInfo(currentValues);
    }
    setIsEditing(!isEditing);
  };

  const handleCancelEdit = () => {
    // Reset to original values
    if (session?.user) {
      const nameParts = session.user.name?.split(" ") || [];
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      setEditedInfo({
        firstName,
        lastName,
        email: session.user.email || "",
        phone: watch("customerInfo.phone") || "",
      });
    }
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof typeof editedInfo, value: string) => {
    setEditedInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!session?.user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">
          Please sign in to continue with checkout.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <User className="h-5 w-5 mr-2" />
          Customer Information
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          {hasEmail
            ? "Your account information will be used for this order."
            : "You have no email saved, checkout requires your email."}
        </p>
      </div>

      {/* User Account Card */}
      <Card className="">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <User className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-green-900">Signed in as</p>
                <p className="text-sm text-green-700">{session.user.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEditToggle}
                  className="border-green-300 text-green-700 hover:bg-green-100"
                >
                  <Edit3 className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              ) : (
                <div className="flex space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEditToggle}
                    className="border-green-300 text-green-700 hover:bg-green-100"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelEdit}
                    className="border-red-300 text-red-700 hover:bg-red-100"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {!isEditing ? (
            // Display Mode
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-green-800">
                  Name
                </Label>
                <p className="text-green-900 mt-1">
                  {watch("customerInfo.firstName")}{" "}
                  {watch("customerInfo.lastName")}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-green-800">
                  Phone
                </Label>
                <p className="text-green-900 mt-1">
                  {watch("customerInfo.phone") || "Not provided"}
                </p>
              </div>
            </div>
          ) : (
            // Edit Mode
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="edit-firstName"
                    className="text-sm font-medium"
                  >
                    First Name *
                  </Label>
                  <Input
                    id="edit-firstName"
                    value={editedInfo.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    placeholder="Enter your first name"
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="edit-lastName"
                    className="text-sm font-medium"
                  >
                    Last Name *
                  </Label>
                  <Input
                    id="edit-lastName"
                    value={editedInfo.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    placeholder="Enter your last name"
                    className="h-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="edit-email"
                  className="text-sm font-medium flex items-center"
                >
                  <Mail className="h-4 w-4 mr-1" />
                  Email Address *
                </Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editedInfo.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email address"
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="edit-phone"
                  className="text-sm font-medium flex items-center"
                >
                  <Phone className="h-4 w-4 mr-1" />
                  Phone Number *
                </Label>
                <Input
                  id="edit-phone"
                  type="tel"
                  value={editedInfo.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Enter your phone number"
                  className="h-10"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hidden form fields for validation */}
      <div className="hidden">
        <input {...register("customerInfo.firstName")} />
        <input {...register("customerInfo.lastName")} />
        <input {...register("customerInfo.email")} />
        <input {...register("customerInfo.phone")} />
      </div>

      {/* Display validation errors */}
      {(errors.customerInfo?.firstName ||
        errors.customerInfo?.lastName ||
        errors.customerInfo?.email ||
        errors.customerInfo?.phone) && (
        <div className="space-y-2">
          {errors.customerInfo?.firstName && (
            <p className="text-sm text-red-600">
              {errors.customerInfo.firstName.message}
            </p>
          )}
          {errors.customerInfo?.lastName && (
            <p className="text-sm text-red-600">
              {errors.customerInfo.lastName.message}
            </p>
          )}
          {errors.customerInfo?.email && (
            <p className="text-sm text-red-600">
              {errors.customerInfo.email.message}
            </p>
          )}
          {errors.customerInfo?.phone && (
            <p className="text-sm text-red-600">
              {errors.customerInfo.phone.message}
            </p>
          )}
        </div>
      )}

      {/* Marketing Opt-in */}
      {/* <div className="flex items-start space-x-2 p-4 bg-gray-50 rounded-lg">
        <Checkbox
          id="marketingOptIn"
          checked={marketingOptIn}
          onCheckedChange={(checked) => setValue("marketingOptIn", !!checked)}
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
      </div> */}

      {/* Account Actions */}
      {/* <div className="text-center pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Not you?{" "}
          {onSignOutClick && (
            <Button
              variant="link"
              className="p-0 h-auto text-primary hover:text-blue-800"
              onClick={onSignOutClick}
            >
              Sign out and checkout as guest
            </Button>
          )}
        </p>
      </div> */}
    </div>
  );
}
