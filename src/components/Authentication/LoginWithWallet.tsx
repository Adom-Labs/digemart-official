// login-with-wallet.tsx
"use client";

import { Button } from "@/components/ui/button";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useState } from "react";
import toast from "react-hot-toast";
import { useWalletAuth } from "@/app/hooks/useWalletAuth";

export default function LoginWithWallet({
  redirectUrl,
}: {
  redirectUrl?: string | null;
}) {
  const { isConnected, address } = useAccount();
  const { signInWithWallet } = useWalletAuth({ redirectUrl });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConnect = async () => {
    if (!isConnected || !address) return;

    try {
      setIsProcessing(true);
      await signInWithWallet(address);
    } catch (error) {
      console.error("Wallet login failed:", error);
      toast.error("Failed to connect wallet. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ConnectButton.Custom>
      {({ openConnectModal }) => (
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="h-12 px-4 border border-gray-300 hover:bg-gray-50 rounded-lg flex items-center justify-center gap-3 w-full"
          onClick={isConnected && address ? handleConnect : openConnectModal}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">⟳</span> Processing...
            </span>
          ) : isConnected && address ? (
            `${address.slice(0, 6)}... complete sign in`
          ) : (
            "Login with Wallet"
          )}
        </Button>
      )}
    </ConnectButton.Custom>
  );
}
