"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import LoginWithWallet from "./LoginWithWallet";

interface SocialButtonsProps {
  onGoogleClick: () => void;
  isLoading: boolean;
  redirectUrl?: string | null;
}

const SocialButtons = ({
  onGoogleClick,
  isLoading,
  redirectUrl,
}: SocialButtonsProps) => {
  return (
    <div className="flex flex-col gap-3">
      <Button
        type="button"
        variant="outline"
        className="h-12 px-4 border border-gray-300 hover:bg-gray-50 rounded-lg flex items-center justify-center gap-3 w-full"
        onClick={onGoogleClick}
        disabled={isLoading}
      >
        <Image src="/google.svg" alt="Google" width={20} height={20} />
        <span className="text-gray-700">Google</span>
      </Button>
      <LoginWithWallet redirectUrl={redirectUrl} />
    </div>
  );
};

export default SocialButtons;
