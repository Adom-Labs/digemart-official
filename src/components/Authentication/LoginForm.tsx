import { useState } from "react";
import Logo from "../Logo";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/routes";
import { useLoading } from "@/app/hooks/useLoading";
import { X } from "lucide-react";
import EmailForm from "./EmailForm";
import SocialButtons from "./SocialButtons";
import { signIn } from "next-auth/react"


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
    // Custom error codes from our auth config
    "Invalid identifier or password": "Invalid email or password. Please check your credentials and try again.",
    "Request timed out. Please try again.": "Connection timed out. Please check your internet connection and try again.",
    "Invalid response from server": "Something went wrong with the authentication. Please try again.",
    "Invalid wallet address": "Wallet address verification failed. Please try again.",
    credentials: "Invalid email or password. Please check your credentials and try again.",
  };
  return errorMessages[error] || errorMessages.default;
};

const DigemartBenefits = [
  "Free business directory listing",
  "Real-time performance monitoring",
  "Customer reviews and ratings",
  "Business ranking and analytics",
];

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
    // Redirect to backend OAuth endpoint
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050';
    const callbackUrl = redirectUrl || ROUTES.FINDYOURPLUG_DASHBOARD;
    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    // Redirect to backend Google OAuth endpoint with callback URL
    window.location.href = `${backendUrl}/auth/google?callbackUrl=${encodedCallbackUrl}`;
  };

  const handleEmailSignIn = async (email: string, password: string) => {
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
        <div className="text-sm text-gray-500">
          © 2025 Digemart. All rights reserved.
        </div>
      </div>
      {/* Right */}
      <div className="w-full lg:w-1/2 bg-white p-8 flex items-center justify-center">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo (shows when left marketing panel is hidden) */}
          <div className="lg:hidden flex justify-center">
            <Logo />
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-1">Welcome Back!</h2>
            <p className="text-gray-600">
              Sign in to access your dashboard and manage your accounts.
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
