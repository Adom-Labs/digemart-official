"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, Sparkles, Loader2, X, ChevronRight, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useConversationalBuilder } from "./hooks/useConversationalBuilder";
import { getInputPlaceholder } from "./utils";
import {
  ChatMessage,
  StoreTypeSelector,
  LocationForm,
  HoursForm,
  StorePreview,
  CategorySelector,
  ConversationalThemeSelector,
  ImageUploadButton,
} from "./components";
import { useCategories } from "@/lib/api/hooks";
import { useThemeTemplates } from "@/lib/api/hooks/theme-templates";
import { ConversationalBuilderProps } from "./types";

export const ConversationalStoreBuilder = ({
  initialStoreType = null,
  onComplete,
}: ConversationalBuilderProps) => {
  const {
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
    messagesEndRef,
    inputRef,
    setInputValue,
    setLocationForm,
    setHoursForm,
    setValidationError,
    handleStoreTypeSelect,
    handleConfirmType,
    handleSubmit,
    handleLocationSubmit,
    handleHoursSubmit,
    handleComplete: handleCompleteInternal,
    handleRestart,
    handleCategorySelect,
    handleSubdomainConfirm,
    handleImageUploadComplete,
    handleSkipImage,
    handleThemeSelect,
  } = useConversationalBuilder(initialStoreType);

  // Fetch categories and themes
  const { data: categoriesData } = useCategories({ categoryType: "STORE" });
  const { data: themesData } = useThemeTemplates({
    isActive: true,
    limit: 6,
  });

  const handleComplete = () => {
    handleCompleteInternal();
    if (onComplete) {
      onComplete(storeData);
    }
  };

  return (
    <div className="flex h-screen max-h-screen gap-4 p-4 bg-muted/30">
      {/* Chat Interface */}
      <div className="flex-1 flex flex-col bg-background border rounded-2xl overflow-hidden shadow-lg">
        {/* Header */}
        <div className="border-b p-4 bg-gradient-to-r from-primary/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-semibold text-base">
                Store Builder Assistant
              </h2>
              <p className="text-xs text-muted-foreground">
                Let&apos;s create your store together
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence mode="popLayout">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </AnimatePresence>

          {/* Store Type Selection */}
          {currentStep === "select-type" && messages.length > 0 && (
            <StoreTypeSelector onSelect={handleStoreTypeSelect} />
          )}

          {/* Confirm Type */}
          {currentStep === "confirm-type" && messages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex gap-2">
                <Button onClick={handleConfirmType} size="sm" className="gap-2">
                  Yes, let&apos;s go! <ChevronRight className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => {
                    setValidationError("");
                  }}
                  variant="outline"
                  size="sm"
                >
                  Change type
                </Button>
              </div>
            </motion.div>
          )}

          {/* Category Selection */}
          {currentStep === "store-category" &&
            messages.length > 0 &&
            categoriesData?.data && (
              <CategorySelector
                categories={categoriesData.data}
                onSelect={handleCategorySelect}
              />
            )}

          {/* Subdomain Confirmation */}
          {currentStep === "confirm-subdomain" && messages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex gap-2">
                <Button
                  onClick={() => handleSubdomainConfirm(true)}
                  size="sm"
                  variant="outline"
                >
                  Yes, customize it
                </Button>
                <Button onClick={() => handleSubdomainConfirm(false)} size="sm">
                  No, looks good
                </Button>
              </div>
            </motion.div>
          )}

          {/* Logo Upload */}
          {currentStep === "store-logo" && messages.length > 0 && (
            <ImageUploadButton
              label="Upload Logo"
              onUpload={(url) => handleImageUploadComplete(url, "logo")}
              onSkip={() => handleSkipImage("logo")}
              currentImage={storeData.storeLogo}
              uploadFolder="stores/logos"
            />
          )}

          {/* Cover Photo Upload */}
          {currentStep === "store-cover" && messages.length > 0 && (
            <ImageUploadButton
              label="Upload Cover Photo"
              onUpload={(url) => handleImageUploadComplete(url, "cover")}
              onSkip={() => handleSkipImage("cover")}
              currentImage={storeData.storeCoverPhoto}
              uploadFolder="stores/covers"
            />
          )}

          {/* Hero Image Upload */}
          {currentStep === "store-hero-image" && messages.length > 0 && (
            <ImageUploadButton
              label="Upload Hero Image"
              onUpload={(url) => handleImageUploadComplete(url, "hero")}
              onSkip={() => handleSkipImage("hero")}
              currentImage={storeData.storeHeroImage}
              uploadFolder="stores/heroes"
            />
          )}

          {/* Theme Selection */}
          {currentStep === "theme-selection" &&
            messages.length > 0 &&
            themesData?.data && (
              <ConversationalThemeSelector
                themes={themesData.data}
                selectedThemeId={storeData.selectedTheme?.id}
                onSelect={handleThemeSelect}
              />
            )}

          {/* Review Actions */}
          {currentStep === "review" && messages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex gap-2">
                <Button
                  onClick={handleComplete}
                  size="sm"
                  className="gap-2"
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Create Store
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleRestart}
                  variant="outline"
                  size="sm"
                  disabled={isCreating}
                >
                  Start Over
                </Button>
              </div>
            </motion.div>
          )}

          {/* Location Form */}
          {currentStep === "store-location" && messages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-card border rounded-2xl p-4">
                <LocationForm
                  value={locationForm}
                  onChange={(field, val) =>
                    setLocationForm({ ...locationForm, [field]: val })
                  }
                  onSubmit={handleLocationSubmit}
                  error={validationError}
                />
              </div>
            </motion.div>
          )}

          {/* Hours Form */}
          {currentStep === "store-hours" && messages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-card border rounded-2xl p-4">
                <HoursForm
                  value={hoursForm}
                  onChange={(field, val) =>
                    setHoursForm({ ...hoursForm, [field]: val })
                  }
                  onSubmit={handleHoursSubmit}
                  error={validationError}
                />
              </div>
            </motion.div>
          )}

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-card border rounded-2xl px-4 py-3 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Typing...</span>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t p-4 bg-muted/20">
          {validationError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-3 text-sm text-destructive flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              {validationError}
            </motion.div>
          )}

          <div className="flex gap-2">
            {currentStep === "store-description" ||
            currentStep === "hero-tagline" ? (
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder={getInputPlaceholder(currentStep, inputDisabled)}
                disabled={inputDisabled}
                className="resize-none min-h-[80px] focus-visible:ring-2"
                rows={2}
              />
            ) : (
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder={getInputPlaceholder(currentStep, inputDisabled)}
                disabled={inputDisabled}
                type={
                  currentStep === "store-email"
                    ? "email"
                    : currentStep === "store-phone"
                    ? "tel"
                    : "text"
                }
                className="flex-1 h-11 focus-visible:ring-2"
              />
            )}
            <Button
              onClick={handleSubmit}
              size="icon"
              disabled={inputDisabled || !inputValue.trim()}
              className="h-11 w-11 shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Panel */}
      <div className="hidden lg:block w-[380px]">
        <StorePreview data={storeData} />
      </div>
    </div>
  );
};

export default ConversationalStoreBuilder;
