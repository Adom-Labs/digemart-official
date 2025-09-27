// use-wallet-auth.ts
import { useAccount, useSignMessage } from "wagmi";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import axios from "axios";
import { BASE_URL } from "@/lib/api-request";
import { ROUTES } from "@/lib/routes";
import { useRouter } from "next/navigation";

export const useWalletAuth = ({
  redirectUrl,
}: {
  redirectUrl?: string | null;
}) => {
  const router = useRouter();
  const { address } = useAccount();

  const { signMessage } = useSignMessage({
    mutation: {
      onSuccess: async (signature, variables) => {
        try {
          if (!variables.message) throw new Error("No message to verify");
          const callbackUrl =
            redirectUrl && redirectUrl !== "null"
              ? redirectUrl
              : ROUTES.FINDYOURPLUG_DASHBOARD;

          const response = await signIn("credentials", {
            walletAddress: address,
            signature,
            redirect: false,
            callbackUrl,
          });

          if (response?.error) {
            throw new Error(response.error);
          }

          toast.success("Login successful");
          router.replace(callbackUrl);
        } catch (error) {
          console.error("Login failed:", error);
          toast.error(
            `Login failed: ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          );
        }
      },
      onError: (error) => {
        console.error("Signature error:", error);
        toast.error("Failed to sign message. Please try again.");
      },
    },
  });

  const getSignatureMessage = async (walletAddress: string) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/auth/wallet/login`,
        { walletAddress },
        {
          timeout: 10000,
          headers: {
            "Content-Type": "application/json",
            "X-Request-Timestamp": Date.now().toString(),
          },
        }
      );

      if (!response.data?.message) {
        throw new Error("No message received from server");
      }

      return response.data.message;
    } catch (error) {
      console.error("Failed to get signature message:", error);
      throw error;
    }
  };

  const signInWithWallet = async (walletAddress: string) => {
    try {
      const message = await getSignatureMessage(walletAddress);
      signMessage({ message });
    } catch (error) {
      console.error("Error during sign-in:", error);
      toast.error("Error during sign-in. Please try again.");
    }
  };

  return { signInWithWallet };
};
