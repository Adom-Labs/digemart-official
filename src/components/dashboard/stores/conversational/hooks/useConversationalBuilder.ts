import { useState, useRef, useEffect } from "react";
import {
  Step,
  Message,
  StoreData,
  LocationFormData,
  HoursFormData,
  StoreType,
  ThemeTemplate,
} from "../types";
import { DEFAULT_HOURS } from "../constants";
import {
  validateEmail,
  validatePhone,
  formatPhoneNumber,
  generateSubdomain,
} from "../utils";
import { storeApi } from "@/lib/api/services";
import { useRouter } from "next/navigation";
import { uploadImage } from "@/lib/utils/imageUpload";

export const useConversationalBuilder = (
  initialStoreType?: StoreType | null,
  onSwitchToForm?: () => void
) => {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState<Step>(
    initialStoreType ? "confirm-type" : "select-type"
  );
  const [storeData, setStoreData] = useState<StoreData>({
    storeType: initialStoreType || undefined,
  });
  const [inputValue, setInputValue] = useState("");
  const [inputDisabled, setInputDisabled] = useState(true);
  const [validationError, setValidationError] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [locationForm, setLocationForm] = useState<LocationFormData>({
    address: "",
    state: "",
    city: "",
  });

  const [hoursForm, setHoursForm] = useState<HoursFormData>(DEFAULT_HOURS);

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasInitialized = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const getGreeting = () => {
    if (initialStoreType) {
      const typeName =
        initialStoreType === "EXTERNAL"
          ? "E-commerce Store"
          : "Business Listing";
      return `Hi! 👋 I see you want to create a ${typeName}. If you'd prefer to create a listing only, click "Change Type". Ready to get started?`;
    }
    return "Hi! 👋 Welcome to the store builder. Let's create something amazing together! What type of store would you like to create?";
  };

  useEffect(() => {
    if (messages.length === 0 && !hasInitialized.current) {
      hasInitialized.current = true;
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        addBotMessage(getGreeting());
      }, 800);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addBotMessage = (content: string, component?: React.ReactNode) => {
    const message: Message = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Ensure unique ID
      type: "bot",
      content,
      component,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, message]);
  };

  const addUserMessage = (content: string) => {
    const message: Message = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Ensure unique ID
      type: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, message]);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setValidationError("");
      const result = await uploadImage(file);
      setImagePreview(result.url);
      addBotMessage("Great! Here's a preview of your logo:");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to upload image";
      setValidationError(errorMessage);
    }
  };

  const confirmImageUpload = (imageUrl: string) => {
    // For now, we're using base64 data URLs which are valid
    // When Cloudinary is implemented, this will be a proper URL
    setStoreData({ ...storeData, storeLogo: imageUrl });
    addUserMessage("✓ Logo uploaded");
    setImagePreview(null); // Clear preview
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      addBotMessage("Perfect! 📧 What's the best email to reach you at?");
      setCurrentStep("store-email");
      setInputDisabled(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }, 800);
  };

  const handleStoreTypeSelect = (type: StoreType) => {
    const typeName =
      type === "EXTERNAL" ? "E-commerce Store" : "Business Listing";
    addUserMessage(typeName);
    setStoreData({ ...storeData, storeType: type });
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      addBotMessage(
        `Perfect! An ${typeName} it is. 🎯 What category best describes your store?`
      );
      setCurrentStep("store-category");
    }, 800);
  };

  const handleConfirmType = () => {
    addUserMessage("Yes, let's go!");
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      addBotMessage("Awesome! 🎯 What category best describes your store?");
      setCurrentStep("store-category");
    }, 800);
  };

  const handleChangeType = () => {
    setValidationError("");
    setStoreData({ ...storeData, storeType: undefined });
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      addBotMessage("No problem! What type of store would you like to create?");
      setCurrentStep("select-type");
    }, 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const value = inputValue.trim();
    setValidationError("");

    if (currentStep === "store-email" && !validateEmail(value)) {
      setValidationError("Please enter a valid email address");
      return;
    }

    if (currentStep === "store-phone" && !validatePhone(value)) {
      setValidationError(
        "Please enter a valid phone number (e.g., 08012345678)"
      );
      return;
    }

    addUserMessage(value);
    setInputValue("");
    setInputDisabled(true);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      processStep(value);
    }, 800);
  };

  const handleLocationSubmit = () => {
    if (!locationForm.address || !locationForm.state || !locationForm.city) {
      setValidationError("Please fill in all location fields");
      return;
    }

    setValidationError("");
    const locationText = `${locationForm.address}, ${locationForm.city}, ${locationForm.state}`;
    addUserMessage(locationText);

    setStoreData({
      ...storeData,
      storeAddress: locationForm.address,
      storeLocationState: locationForm.state,
      storeLocationCity: locationForm.city,
    });

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      addBotMessage("Excellent! ⏰ What are your operating hours?");
      setCurrentStep("store-hours");
    }, 800);
  };

  const handleHoursSubmit = () => {
    setValidationError("");
    const hoursText = `${hoursForm.weekOpen} - ${hoursForm.weekClose}, ${hoursForm.openTime} - ${hoursForm.closeTime}`;
    addUserMessage(hoursText);

    setStoreData({
      ...storeData,
      storeTimeOpen: hoursForm.openTime,
      storeTimeClose: hoursForm.closeTime,
      weekOpen: hoursForm.weekOpen,
      weekClose: hoursForm.weekClose,
    });

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      addBotMessage("Excellent! 🎨 Now let's choose a theme for your store.");
      setCurrentStep("theme-selection");
    }, 800);
  };

  const processStep = (value: string) => {
    switch (currentStep) {
      case "store-name":
        const subdomain = generateSubdomain(value);
        setStoreData({ ...storeData, storeName: value, subdomain });
        addBotMessage(
          `"${value}" - I love it! 💫 Your store will be at ${subdomain}.digemart.com. Want to customize the subdomain?`
        );
        setCurrentStep("confirm-subdomain");
        break;

      case "edit-subdomain":
        const cleanSubdomain = generateSubdomain(value);
        setStoreData({ ...storeData, subdomain: cleanSubdomain });
        addBotMessage(
          `Got it! Your store will be at ${cleanSubdomain}.digemart.com. Now, tell me what your store is all about.`
        );
        setCurrentStep("store-description");
        setInputDisabled(false);
        setTimeout(() => inputRef.current?.focus(), 100);
        break;

      case "store-description":
        setStoreData({ ...storeData, storeDescription: value });
        addBotMessage("Great description! 🎨 Would you like to upload a logo?");
        setCurrentStep("store-logo");
        break;

      case "hero-headline":
        setStoreData({ ...storeData, storeHeroHeadline: value });
        addBotMessage("Love it! 💫 Now add a short tagline to complement it:");
        setCurrentStep("hero-tagline");
        setInputDisabled(false);
        setTimeout(() => inputRef.current?.focus(), 100);
        break;

      case "hero-tagline":
        setStoreData({ ...storeData, storeHeroTagline: value });
        addBotMessage(
          "Perfect combo! 📧 What's the best email to reach you at?"
        );
        setCurrentStep("store-email");
        setInputDisabled(false);
        setTimeout(() => inputRef.current?.focus(), 100);
        break;

      case "store-email":
        setStoreData({ ...storeData, email: value });
        addBotMessage("Got it! 📱 And your phone number?");
        setCurrentStep("store-phone");
        setInputDisabled(false);
        setTimeout(() => inputRef.current?.focus(), 100);
        break;

      case "store-phone":
        setStoreData({ ...storeData, phone: formatPhoneNumber(value) });
        addBotMessage("Perfect! 📍 Now let's get your location details.");
        setCurrentStep("store-location");
        break;
    }
  };

  const skipLogo = () => {
    addUserMessage("Skip logo");
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      addBotMessage("No problem! 📧 What's the best email to reach you at?");
      setCurrentStep("store-email");
      setInputDisabled(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }, 800);
  };

  const handleComplete = async () => {
    addUserMessage("Create Store");
    setIsTyping(true);
    setIsCreating(true);

    try {
      // Map conversational data to backend DTO format
      const createStoreDto: Record<string, unknown> = {
        storeName: storeData.storeName!,
        email: storeData.email!,
        storeAddress: storeData.storeAddress!,
        storeLocationState: storeData.storeLocationState!,
        storeLocationCity: storeData.storeLocationCity!,
        storeType: storeData.storeType!,
      };

      // Add optional fields only if they exist
      if (storeData.phone) createStoreDto.phone = storeData.phone;
      if (storeData.subdomain) createStoreDto.subdomain = storeData.subdomain;
      if (storeData.storeCategoryId)
        createStoreDto.storeCategoryId = storeData.storeCategoryId;
      if (storeData.storeTimeOpen)
        createStoreDto.storeTimeOpen = storeData.storeTimeOpen;
      if (storeData.storeTimeClose)
        createStoreDto.storeTimeClose = storeData.storeTimeClose;
      if (storeData.weekOpen) createStoreDto.storeWeekOpen = storeData.weekOpen;
      if (storeData.weekClose)
        createStoreDto.storeWeekClose = storeData.weekClose;
      if (storeData.storeDescription)
        createStoreDto.storeDescription = storeData.storeDescription;
      if (storeData.storeLogo) createStoreDto.logo = storeData.storeLogo;
      if (storeData.storeCoverPhoto)
        createStoreDto.storeCoverPhoto = storeData.storeCoverPhoto;
      if (storeData.storeHeroImage)
        createStoreDto.storeHeroImage = storeData.storeHeroImage;
      if (storeData.storeHeroHeadline)
        createStoreDto.storeHeroHeadline = storeData.storeHeroHeadline;
      if (storeData.storeHeroTagline)
        createStoreDto.storeHeroTagline = storeData.storeHeroTagline;

      const response = await storeApi.create(createStoreDto);

      setIsTyping(false);
      setIsCreating(false);

      if (response.success) {
        addBotMessage(
          "🎉 Congratulations! Your store has been created successfully!"
        );
        setCurrentStep("complete");

        // Redirect to stores page after 2 seconds
        setTimeout(() => {
          router.push("/findyourplug/dashboard/stores");
        }, 2000);
      }
    } catch (error: unknown) {
      setIsTyping(false);
      setIsCreating(false);
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to create store. Please try again.";
      addBotMessage(`❌ ${errorMessage}`);
      setValidationError(errorMessage);
    }
  };

  const handleRestart = () => {
    setMessages([]);
    setStoreData({});
    setLocationForm({ address: "", state: "", city: "" });
    setHoursForm(DEFAULT_HOURS);
    setImagePreview(null);
    setCurrentStep("select-type");
    setInputDisabled(true);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      addBotMessage(getGreeting());
    }, 800);
  };

  // New handlers for Phase 1 features
  const handleCategorySelect = (category: { id: number; name: string }) => {
    setStoreData({ ...storeData, storeCategoryId: category.id });
    addUserMessage(category.name);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      addBotMessage("Perfect choice! 🚀 What's your store name?");
      setCurrentStep("store-name");
      setInputDisabled(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }, 800);
  };

  const handleSubdomainConfirm = (confirm: boolean) => {
    if (confirm) {
      addUserMessage("Yes, customize it");
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        addBotMessage("Great! What subdomain would you like?");
        setCurrentStep("edit-subdomain");
        setInputDisabled(false);
        setTimeout(() => inputRef.current?.focus(), 100);
      }, 800);
    } else {
      addUserMessage("No, looks good");
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        addBotMessage("Perfect! Now, tell me what your store is all about.");
        setCurrentStep("store-description");
        setInputDisabled(false);
        setTimeout(() => inputRef.current?.focus(), 100);
      }, 800);
    }
  };

  const handleImageUploadComplete = (
    url: string,
    type: "logo" | "cover" | "hero"
  ) => {
    const fieldMap = {
      logo: "storeLogo",
      cover: "storeCoverPhoto",
      hero: "storeHeroImage",
    };

    setStoreData({ ...storeData, [fieldMap[type]]: url });
    addUserMessage(
      `✓ ${type.charAt(0).toUpperCase() + type.slice(1)} uploaded`
    );
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      if (type === "logo") {
        addBotMessage(
          "Awesome! 📸 Want to add a cover photo for your store page?"
        );
        setCurrentStep("store-cover");
      } else if (type === "cover") {
        addBotMessage("Great! 🖼️ How about a hero image for your homepage?");
        setCurrentStep("store-hero-image");
      } else {
        addBotMessage(
          "Perfect! ✨ Let's create a catchy headline for your homepage."
        );
        setCurrentStep("hero-headline");
        setInputDisabled(false);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    }, 800);
  };

  const handleSkipImage = (type: "logo" | "cover" | "hero") => {
    addUserMessage(`Skip ${type}`);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      if (type === "logo") {
        addBotMessage("No problem! 📸 Want to add a cover photo?");
        setCurrentStep("store-cover");
      } else if (type === "cover") {
        addBotMessage("Okay! 🖼️ How about a hero image?");
        setCurrentStep("store-hero-image");
      } else {
        addBotMessage("Alright! ✨ Let's create a headline for your homepage.");
        setCurrentStep("hero-headline");
        setInputDisabled(false);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    }, 800);
  };

  const handleThemeSelect = (theme: ThemeTemplate) => {
    setStoreData({ ...storeData, selectedTheme: theme });
    addUserMessage(`Selected: ${theme.name}`);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      addBotMessage("Great choice! 🎊 Let me show you your store preview.");
      setCurrentStep("review");
    }, 800);
  };

  return {
    // State
    messages,
    currentStep,
    storeData,
    inputValue,
    inputDisabled,
    validationError,
    isTyping,
    isCreating,
    locationForm,
    hoursForm,
    imagePreview,

    // Refs
    messagesEndRef,
    inputRef,
    fileInputRef,

    // Setters
    setInputValue,
    setLocationForm,
    setHoursForm,
    setValidationError,
    setImagePreview,
    setStoreData,

    // Handlers
    handleImageUpload,
    confirmImageUpload,
    handleStoreTypeSelect,
    handleConfirmType,
    handleChangeType,
    handleSubmit,
    handleLocationSubmit,
    handleHoursSubmit,
    skipLogo,
    handleComplete,
    handleRestart,
    addBotMessage,
    // New Phase 1 handlers
    handleCategorySelect,
    handleSubdomainConfirm,
    handleImageUploadComplete,
    handleSkipImage,
    handleThemeSelect,
    // Callback
    onSwitchToForm,
  };
};
