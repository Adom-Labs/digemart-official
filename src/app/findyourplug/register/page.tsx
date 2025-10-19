"use client";

import { useLoading } from "@/app/hooks/useLoading";
import RegistrationForm from "@/components/Authentication/RegistrationForm";
import SocialButtons from "@/components/Authentication/SocialButtons";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ROUTES } from "@/lib/routes";
import { getErrorMessage } from "@/lib/utils";
import { registerUser } from "@/services/auth";
import { AlertCircle } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Logo from "@/components/Logo";

const RegisterPage = () => {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string>();
  const { startLoading, stopLoading, isLoading } = useLoading(["register"]);
  const { data: session, status } = useSession();
  const router = useRouter();

  const redirectUrl = searchParams.get("redirect");

  if (status === "authenticated" && session) {
    router.replace(redirectUrl || ROUTES.FINDYOURPLUG_DASHBOARD);
  }

  const handleGoogleSignUp = () => {
    signIn("google", {
      callbackUrl: redirectUrl || ROUTES.FINDYOURPLUG_DASHBOARD,
    });
  };

  const handleRegister = async (data: {
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
    acceptTerms: boolean;
  }) => {
    try {
      setError(undefined);
      startLoading("register");

      const {
        confirmPassword,
        acceptTerms,
        ...userData
      } = data; confirmPassword;

      let _c = confirmPassword;
      const _a = acceptTerms
      await registerUser(userData);

      const redirectParam = redirectUrl
        ? `&redirect=${encodeURIComponent(redirectUrl)}`
        : "";
      router.replace(`${ROUTES.LOGIN}?registered=true${redirectParam}`);
    } catch (error) {
      const errorMessage =
        getErrorMessage(error) || "Registration failed. Please try again.";
      setError(errorMessage);
    } finally {
      stopLoading("register");
    }
  };

  const DigemartBenefits = [
    "Free business directory listing",
    "Real-time performance monitoring",
    "Customer reviews and ratings",
    "Business ranking and analytics",
  ];

  return (
    <div className="flex min-h-screen w-full">
      {/* Left - marketing */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-50 p-12 flex-col justify-between">
        <div>
          <Logo />
          <div className="mt-16">
            <h1 className="text-4xl font-bold mb-4">Welcome to Digemart</h1>
            <p className="text-gray-600 text-lg mb-8">
              Join the fastest-growing business directory platform. Get
              discovered, track performance, and expand your digital presence -
              all in one place.
            </p>
            <div className="space-y-4">
              {DigemartBenefits.map((item, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-1">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <p className="text-gray-600">{item}</p>
                </div>
              ))}
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                  <span className="text-blue-600 text-sm">+</span>
                </div>
                <div>
                  <p className="text-gray-600">No online store yet?</p>
                  <a
                    href="https://vendor.digemart.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-sm hover:underline"
                  >
                    Create your free e-commerce store →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-sm text-gray-500">© 2025 Digemart. All rights reserved.</div>
      </div>

      {/* Right - form */}
      <div className="w-full lg:w-1/2 bg-white p-8 flex items-center justify-center">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo (shows when left marketing panel is hidden) */}
          <div className="lg:hidden flex justify-center">
            <Logo />
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-1">Create an Account</h2>
            <p className="text-gray-600">
              Join the fastest-growing business directory platform. Get
              discovered, track performance, and expand your digital presence -
              all in one place.
            </p>
          </div>

          <SocialButtons
            onGoogleClick={handleGoogleSignUp}
            isLoading={status === "loading"}
          />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <RegistrationForm
            onSubmit={handleRegister}
            isLoading={isLoading("register") || status === "loading"}
          />


        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
