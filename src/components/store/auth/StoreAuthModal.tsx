"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  Store,
  ShoppingBag,
} from "lucide-react";
import Image from "next/image";
import { useStore } from "../StoreProvider";
import LoginWithWallet from "@/components/Authentication/LoginWithWallet";

interface StoreAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "signin" | "signup";
  redirectUrl?: string;
  showGuestOption?: boolean;
}

const getErrorMessage = (error: string) => {
  const errorMessages: Record<string, string> = {
    "Invalid identifier or password":
      "Invalid email or password. Please check your credentials and try again.",
    "Request timed out. Please try again.":
      "Connection timed out. Please check your internet connection and try again.",
    "Invalid response from server":
      "Something went wrong with the authentication. Please try again.",
    "Invalid wallet address":
      "Wallet address verification failed. Please try again.",
    CredentialsSignin: "Invalid email or password.",
    OAuthSignin: "Could not sign in with social provider.",
    OAuthCallback: "Could not verify social sign in.",
    default: "An unexpected error occurred. Please try again.",
  };
  return errorMessages[error] || errorMessages.default;
};

export function StoreAuthModal({
  isOpen,
  onClose,
  defaultTab = "signin",
  redirectUrl,
  showGuestOption = true,
}: StoreAuthModalProps) {
  const { store } = useStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form states
  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });

  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: signInData.email,
        password: signInData.password,
        redirect: false,
      });

      if (result?.error) {
        setError(getErrorMessage(result.error));
        return;
      }

      // Successful sign in
      onClose();
      if (redirectUrl) {
        router.push(redirectUrl);
      } else {
        // Refresh the page to update authentication state
        router.refresh();
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (signUpData.password !== signUpData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!signUpData.acceptTerms) {
      setError("Please accept the terms and conditions.");
      return;
    }

    setIsLoading(true);

    try {
      // First register the user (you'll need to implement this API call)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: signUpData.name,
            email: signUpData.email,
            password: signUpData.password,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      // After successful registration, sign in
      const result = await signIn("credentials", {
        email: signUpData.email,
        password: signUpData.password,
        redirect: false,
      });

      if (result?.error) {
        setError(getErrorMessage(result.error));
        return;
      }

      // Successful sign up and sign in
      onClose();
      if (redirectUrl) {
        router.push(redirectUrl);
      } else {
        router.refresh();
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const backendUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";
    const callbackUrl = redirectUrl || window.location.href;
    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    // Redirect to backend Google OAuth endpoint with callback URL
    window.location.href = `${backendUrl}/auth/google?callbackUrl=${encodedCallbackUrl}`;
  };

  const handleGuestContinue = () => {
    onClose();
    // Continue as guest - no authentication required
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            {store.logo ? (
              <Image
                src={store.logo}
                alt={store.storeName}
                width={48}
                height={48}
                className="rounded-lg"
              />
            ) : (
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
                style={{ backgroundColor: "var(--store-primary, #3B82F6)" }}
              >
                <Store className="w-6 h-6" />
              </div>
            )}
          </div>
          <DialogTitle className="text-xl font-semibold">
            Welcome to {store.storeName}
          </DialogTitle>
          <DialogDescription>
            Sign in to your account or create a new one to continue shopping
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "signin" | "signup")}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-4">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="Enter your email"
                  value={signInData.email}
                  onChange={(e) =>
                    setSignInData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signin-password">Password</Label>
                <div className="relative">
                  <Input
                    id="signin-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={signInData.password}
                    onChange={(e) =>
                      setSignInData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
                style={{ backgroundColor: "var(--store-primary, #3B82F6)" }}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Full Name</Label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="Enter your full name"
                  value={signUpData.name}
                  onChange={(e) =>
                    setSignUpData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="Enter your email"
                  value={signUpData.email}
                  onChange={(e) =>
                    setSignUpData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative">
                  <Input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={signUpData.password}
                    onChange={(e) =>
                      setSignUpData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-confirm-password">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="signup-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={signUpData.confirmPassword}
                    onChange={(e) =>
                      setSignUpData((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="accept-terms"
                  checked={signUpData.acceptTerms}
                  onCheckedChange={(checked) =>
                    setSignUpData((prev) => ({
                      ...prev,
                      acceptTerms: checked as boolean,
                    }))
                  }
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="accept-terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the Terms of Service and Privacy Policy
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !signUpData.acceptTerms}
                style={{ backgroundColor: "var(--store-primary, #3B82F6)" }}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-background text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <Image
              src="/google.svg"
              alt="Google"
              width={20}
              height={20}
              className="mr-2"
            />
            Google
          </Button>

          <LoginWithWallet redirectUrl={redirectUrl} />

          {showGuestOption && (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-background text-muted-foreground">
                    Or
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={handleGuestContinue}
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Continue as Guest
              </Button>
            </>
          )}
        </div>

        <div className="text-center text-xs text-muted-foreground">
          <p>
            By continuing, you agree to {store.storeName}&apos;s terms and
            conditions.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
