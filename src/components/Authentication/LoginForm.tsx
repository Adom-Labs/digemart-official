import { useState } from "react";
import { signIn } from "next-auth/react";
import Logo from "../Logo";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/routes";
import { useLoading } from "@/app/hooks/useLoading";
import { X } from "lucide-react";
import EmailForm from "./EmailForm";
import SocialButtons from "./SocialButtons";

const getErrorMessage = (error: string) => {
  const errorMessages: Record<string, string> = {
    AuthError: "Authentication failed. Please log in again.",
    Configuration:
      "Something is not right with your login. Please try again later.",
    AccessDenied: "Access denied. You do not have permission to sign in.",
    Verification: "The verification failed. Please try again.",
    default: "An unexpected error occurred. Please try again.",
    CredentialsSignin: "Invalid email or password.",
    OAuthSignin: "Could not sign in with social provider.",
    OAuthCallback: "Could not verify social sign in.",
    ETIMEDOUT:
      "Connection timed out. Please check your internet connection and try again.",
    Review: "You must be logged in to post a review.",
  };
  return errorMessages[error] || errorMessages.default;
};

const LoginForm = ({
  redirectUrl,
  initialError,
  registered,
}: {
  redirectUrl?: string | null;
  initialError?: string | null;
  registered?: boolean;
}) => {
  const [error, setError] = useState<string | undefined>(
    initialError ? getErrorMessage(initialError) : undefined
  );
  const { startLoading, stopLoading, isLoading } = useLoading([
    "email-sign-in",
  ]);
  const router = useRouter();
  const dismissError = () => {
    setError(undefined);
    if (initialError) {
      const url = new URL(window.location.href);
      url.searchParams.delete("error");
      router.replace(url.pathname + url.search);
    }
  };
  const handleGoogleSignIn = async () => {
    await signIn("google", {
      callbackUrl: redirectUrl || ROUTES.FINDYOURPLUG_DASHBOARD,
    });
  };

  const handleEmailSignIn = async (email: string, password: string) => {
    console.log(redirectUrl);
    const callbackUrl =
      redirectUrl && redirectUrl !== "null"
        ? redirectUrl
        : ROUTES.FINDYOURPLUG_DASHBOARD;
    try {
      setError(undefined);
      startLoading("email-sign-in");
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        console.log(result.error);
        setError(getErrorMessage(result.error));
        return;
      }

      router.replace(callbackUrl);
    } catch (error: unknown) {
      console.error("Email sign-in error:", error);
      setError(getErrorMessage((error as { code?: string }).code || "default"));
    } finally {
      stopLoading("email-sign-in");
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Left */}
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
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-1">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <p className="text-gray-600">Free business directory listing</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-1">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <p className="text-gray-600">
                  Real-time performance monitoring
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-1">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <p className="text-gray-600">Customer reviews and ratings</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-1">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <p className="text-gray-600">Business ranking and analytics</p>
              </div>
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
        <div className="text-sm text-gray-500">
          © 2025 Digemart. All rights reserved.
        </div>
      </div>
      {/* Right */}
      <div className="w-full lg:w-1/2 bg-white p-8 flex items-center justify-center">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-1">Welcome Back!</h2>
            <p className="text-gray-600">
              Don&apos;t have a business listed yet? Create a free account now
              and start growing your reach.
            </p>
          </div>

          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md relative">
              {error}
              <button
                onClick={dismissError}
                className="absolute top-2 right-2 p-1 hover:bg-red-100 rounded-full transition-colors"
                aria-label="Dismiss error"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {registered && (
            <div className="p-3 text-sm text-green-600 bg-green-50 rounded-md">
              Account created successfully! Please log in with your credentials.
            </div>
          )}

          <EmailForm
            onSubmit={handleEmailSignIn}
            isLoading={isLoading("email-sign-in")}
            error={error}
          />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <SocialButtons
            onGoogleClick={handleGoogleSignIn}
            isLoading={isLoading("google-sign-in")}
            redirectUrl={redirectUrl}
          />

          <div className="text-center">
            <button className="text-sm text-gray-600 hover:text-gray-900">
              Forgot password? Click here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
