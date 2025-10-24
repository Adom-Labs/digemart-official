"use client";

import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { CustomerInfoForm } from "../CustomerInfoForm";
import { AuthenticatedUserInfo } from "../AuthenticatedUserInfo";

export function CustomerInfoStep() {
  const { data: session, status } = useSession();
  const [showSignIn, setShowSignIn] = useState(false);

  const handleSignInClick = () => {
    setShowSignIn(true);
    // TODO: Implement sign-in modal or redirect
    console.log("Sign in clicked");
  };

  const handleSignOutClick = async () => {
    await signOut({ redirect: false });
    setShowSignIn(false);
  };

  // Show loading state while session is being fetched
  if (status === "loading") {
    return (
      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-48"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-64 mt-2"></div>
        </div>
        <div className="space-y-4">
          <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  // If user is authenticated, show authenticated user info
  if (session?.user) {
    return <AuthenticatedUserInfo onSignOutClick={handleSignOutClick} />;
  }

  // If user is not authenticated, show guest checkout form
  return (
    <CustomerInfoForm
      onSignInClick={handleSignInClick}
      showSignInOption={true}
    />
  );
}
