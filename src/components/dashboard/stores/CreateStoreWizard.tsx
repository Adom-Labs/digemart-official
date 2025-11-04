"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Store,
  MapPin,
  Palette,
  Rocket,
  ArrowLeft,
  ArrowRight,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ThemeTemplateSelector } from "./ThemeTemplateSelector";
import { useCreateStore, CreateStoreData } from "@/lib/api/hooks/stores";
import { ThemeTemplate } from "@/lib/api/theme-templates";
import { toast } from "react-hot-toast";

interface CreateStoreWizardProps {
  storeType?: "EXTERNAL" | "INTERNAL";
  onComplete?: (storeId: number) => void;
  onCancel?: () => void;
}

interface StoreFormData extends CreateStoreData {
  selectedTheme?: ThemeTemplate;
}

export function CreateStoreWizard({
  storeType = "INTERNAL",
  onComplete,
  onCancel,
}: CreateStoreWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<StoreFormData>({
    storeName: "",
    email: "",
    phone: "",
    storeAddress: "",
    storeLocationState: "",
    storeLocationCity: "",
    storeDescription: "",
    storeType: storeType,
    subdomain: "",
    storeTimeOpen: "09:00",
    storeTimeClose: "18:00",
    storeWeekOpen: "Monday",
    storeWeekClose: "Saturday",
  });

  const createStoreMutation = useCreateStore();
  const totalSteps = 4;

  const steps = [
    { number: 1, title: "Store Setup", icon: Store },
    { number: 2, title: "Location & Hours", icon: MapPin },
    { number: 3, title: "Theme Selection", icon: Palette },
    { number: 4, title: "Review & Launch", icon: Rocket },
  ];

  const updateFormData = (updates: Partial<StoreFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const generateSubdomain = (storeName: string) => {
    return storeName
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleStoreNameChange = (name: string) => {
    updateFormData({
      storeName: name,
      subdomain: generateSubdomain(name),
    });
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.storeName && formData.email && formData.storeType);
      case 2:
        return !!(
          formData.storeAddress &&
          formData.storeLocationState &&
          formData.storeLocationCity
        );
      case 3:
        return !!formData.selectedTheme;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(Math.min(totalSteps, currentStep + 1));
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  const handlePrevious = () => {
    setCurrentStep(Math.max(1, currentStep - 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      toast.error("Please complete all required fields");
      return;
    }

    try {
      const storeData: CreateStoreData = {
        storeName: formData.storeName,
        email: formData.email,
        phone: formData.phone,
        storeAddress: formData.storeAddress,
        storeLocationState: formData.storeLocationState,
        storeLocationCity: formData.storeLocationCity,
        storeDescription: formData.storeDescription,
        storeType: formData.storeType,
        subdomain: formData.subdomain,
        storeTimeOpen: formData.storeTimeOpen,
        storeTimeClose: formData.storeTimeClose,
        storeWeekOpen: formData.storeWeekOpen,
        storeWeekClose: formData.storeWeekClose,
      };

      const store = await createStoreMutation.mutateAsync(storeData);

      toast.success("Store created successfully!");

      if (onComplete) {
        onComplete(store.id);
      } else {
        router.push(`/findyourplug/dashboard/stores`);
      }
    } catch (error) {
      console.error("Failed to create store:", error);
      toast.error("Failed to create store. Please try again.");
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => {
        const StepIcon = step.icon;
        return (
          <div key={step.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  step.number < currentStep
                    ? "bg-green-500 text-white"
                    : step.number === currentStep
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {step.number < currentStep ? (
                  <CheckCircle2 className="h-6 w-6" />
                ) : (
                  <StepIcon className="h-6 w-6" />
                )}
              </div>
              <p
                className={`mt-2 text-sm ${
                  step.number === currentStep
                    ? "text-primary font-medium"
                    : "text-gray-500"
                }`}
              >
                {step.title}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-1 flex-1 mx-4 ${
                  step.number < currentStep ? "bg-green-500" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );

  const renderStep1 = () => (
    <Card>
      <CardHeader>
        <CardTitle>Store Setup</CardTitle>
        <CardDescription>Basic information about your store</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="storeName">Store Name *</Label>
          <Input
            id="storeName"
            placeholder="My Awesome Store"
            value={formData.storeName}
            onChange={(e) => handleStoreNameChange(e.target.value)}
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="email">Contact Email *</Label>
          <Input
            id="email"
            type="email"
            placeholder="contact@mystore.com"
            value={formData.email}
            onChange={(e) => updateFormData({ email: e.target.value })}
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1 (555) 123-4567"
            value={formData.phone}
            onChange={(e) => updateFormData({ phone: e.target.value })}
            className="mt-1.5"
          />
        </div>

        <div>
          <Label>Store Type *</Label>
          <RadioGroup
            value={formData.storeType}
            onValueChange={(value) =>
              updateFormData({ storeType: value as "INTERNAL" | "EXTERNAL" })
            }
            className="mt-3"
          >
            <div className="flex items-center space-x-2 p-4 border rounded-lg">
              <RadioGroupItem value="INTERNAL" id="internal" />
              <Label htmlFor="internal" className="flex-1 cursor-pointer">
                <p className="font-medium">Internal Store</p>
                <p className="text-sm text-gray-600">
                  Fully managed e-commerce store on our platform
                </p>
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-4 border rounded-lg">
              <RadioGroupItem value="EXTERNAL" id="external" />
              <Label htmlFor="external" className="flex-1 cursor-pointer">
                <p className="font-medium">External Store</p>
                <p className="text-sm text-gray-600">
                  Business listing that links to your existing website
                </p>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="description">Store Description</Label>
          <Textarea
            id="description"
            placeholder="Tell customers about your store..."
            rows={4}
            value={formData.storeDescription}
            onChange={(e) =>
              updateFormData({ storeDescription: e.target.value })
            }
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="subdomain">Store Subdomain</Label>
          <div className="flex gap-2 mt-1.5">
            <Input
              id="subdomain"
              placeholder="mystore"
              value={formData.subdomain}
              onChange={(e) => updateFormData({ subdomain: e.target.value })}
              className="flex-1"
            />
            <span className="flex items-center px-3 bg-gray-100 rounded-md text-sm text-gray-600">
              .digemart.com
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Your store will be accessible at {formData.subdomain || "yourstore"}
            .digemart.com
          </p>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep2 = () => (
    <Card>
      <CardHeader>
        <CardTitle>Location & Business Hours</CardTitle>
        <CardDescription>
          Where is your business located and when are you open?
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="address">Business Address *</Label>
          <Input
            id="address"
            placeholder="123 Main Street"
            value={formData.storeAddress}
            onChange={(e) => updateFormData({ storeAddress: e.target.value })}
            className="mt-1.5"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              placeholder="New York"
              value={formData.storeLocationCity}
              onChange={(e) =>
                updateFormData({ storeLocationCity: e.target.value })
              }
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="state">State/Province *</Label>
            <Input
              id="state"
              placeholder="NY"
              value={formData.storeLocationState}
              onChange={(e) =>
                updateFormData({ storeLocationState: e.target.value })
              }
              className="mt-1.5"
            />
          </div>
        </div>

        <div>
          <Label>Business Hours</Label>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <Label htmlFor="timeOpen" className="text-sm">
                Opening Time
              </Label>
              <Input
                id="timeOpen"
                type="time"
                value={formData.storeTimeOpen}
                onChange={(e) =>
                  updateFormData({ storeTimeOpen: e.target.value })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="timeClose" className="text-sm">
                Closing Time
              </Label>
              <Input
                id="timeClose"
                type="time"
                value={formData.storeTimeClose}
                onChange={(e) =>
                  updateFormData({ storeTimeClose: e.target.value })
                }
                className="mt-1"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="weekOpen">Open From</Label>
            <Select
              value={formData.storeWeekOpen}
              onValueChange={(value) =>
                updateFormData({ storeWeekOpen: value })
              }
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ].map((day) => (
                  <SelectItem key={day} value={day}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="weekClose">Open Until</Label>
            <Select
              value={formData.storeWeekClose}
              onValueChange={(value) =>
                updateFormData({ storeWeekClose: value })
              }
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ].map((day) => (
                  <SelectItem key={day} value={day}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep3 = () => (
    <Card>
      <CardHeader>
        <CardTitle>Choose Your Theme</CardTitle>
        <CardDescription>Select a design theme for your store</CardDescription>
      </CardHeader>
      <CardContent>
        <ThemeTemplateSelector
          selectedThemeId={formData.selectedTheme?.id}
          onThemeSelect={(theme) => updateFormData({ selectedTheme: theme })}
        />
      </CardContent>
    </Card>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <h3 className="text-blue-900 mb-2 flex items-center">
            <Rocket className="w-5 h-5 mr-2" />
            Ready to Launch!
          </h3>
          <p className="text-blue-800">
            Your store is configured and ready to go live. Review the details
            below and launch when ready.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Store Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Store Name:</span>
              <p>{formData.storeName}</p>
            </div>
            <div>
              <span className="font-medium">Store Type:</span>
              <p>{formData.storeType}</p>
            </div>
            <div>
              <span className="font-medium">Email:</span>
              <p>{formData.email}</p>
            </div>
            <div>
              <span className="font-medium">Phone:</span>
              <p>{formData.phone || "Not provided"}</p>
            </div>
            <div>
              <span className="font-medium">Address:</span>
              <p>{formData.storeAddress}</p>
            </div>
            <div>
              <span className="font-medium">Location:</span>
              <p>
                {formData.storeLocationCity}, {formData.storeLocationState}
              </p>
            </div>
            <div>
              <span className="font-medium">Subdomain:</span>
              <p>{formData.subdomain}.digemart.com</p>
            </div>
            <div>
              <span className="font-medium">Selected Theme:</span>
              <p>{formData.selectedTheme?.name || "None selected"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {renderStepIndicator()}

      <div className="min-h-[500px]">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={currentStep === 1 ? onCancel : handlePrevious}
          disabled={createStoreMutation.isPending}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {currentStep === 1 ? "Cancel" : "Previous"}
        </Button>

        <Button
          onClick={currentStep === totalSteps ? handleSubmit : handleNext}
          disabled={!validateStep(currentStep) || createStoreMutation.isPending}
        >
          {createStoreMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating Store...
            </>
          ) : currentStep === totalSteps ? (
            <>
              <Rocket className="w-4 h-4 mr-2" />
              Launch Store
            </>
          ) : (
            <>
              Next Step
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
