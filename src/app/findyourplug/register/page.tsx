"use client";

import { useLoading } from "@/app/hooks/useLoading";
import Divider from "@/components/Authentication/Divider";
import RegistrationForm from "@/components/Authentication/RegistrationForm";
import SocialButtons from "@/components/Authentication/SocialButtons";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ROUTES } from "@/lib/routes";
import { getErrorMessage } from "@/lib/utils";
import { registerUser } from "@/services/auth";
import { AlertCircle } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

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
        confirmPassword: _confirmPassword,
        acceptTerms: _acceptTerms,
        ...userData
      } = data;
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center">
            Create an Account
          </CardTitle>
          <CardDescription className="text-center text-lg">
            Join our community and get started
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <SocialButtons
            onGoogleClick={handleGoogleSignUp}
            isLoading={status === "loading"}
          />
          <Divider />
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
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
