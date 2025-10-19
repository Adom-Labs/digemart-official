// login-with-wallet.tsx
"use client";

import { Button } from "@/components/ui/button";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect } from "wagmi";
import { useState } from "react";
import toast from "react-hot-toast";
import { useWalletAuth } from "@/app/hooks/useWalletAuth";

export default function LoginWithWallet({
  redirectUrl,
}: {
  redirectUrl?: string | null;
}) {
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const { signInWithWallet } = useWalletAuth({ redirectUrl });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSignIn = async () => {
    if (!isConnected || !address) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      setIsProcessing(true);
      await signInWithWallet(address);
    } catch (error) {
      console.error("Wallet login failed:", error);
      toast.error("Failed to sign in with wallet. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDisconnect = () => {
    if (confirm("Are you sure you want to disconnect this wallet? You'll need to connect again to sign in.")) {
      disconnect();
      toast.success("Wallet disconnected");
    }
  };

  return (
    <ConnectButton.Custom>
      {({ openConnectModal }) => (
        <div className="w-full">
          {!isConnected ? (
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="h-12 px-4 border border-gray-300 hover:bg-gray-50 rounded-lg flex items-center justify-center gap-3 w-full"
              onClick={openConnectModal}
            >
              Connect Wallet
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="text-sm text-gray-600 text-center">
                Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
              </div>

              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="h-12 px-4 border border-gray-300 hover:bg-gray-50 rounded-lg flex items-center justify-center gap-3 w-full"
                  onClick={handleSignIn}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin">⟳</span> Signing in...
                    </span>
                  ) : (
                    "Sign in with Wallet"
                  )}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 px-3 text-gray-500 hover:text-gray-700 text-xs text-center w-full"
                  onClick={handleDisconnect}
                >
                  Use different wallet
                </Button>
              </div>

            </div>
          )}
        </div>
      )}
    </ConnectButton.Custom>
  );
}
