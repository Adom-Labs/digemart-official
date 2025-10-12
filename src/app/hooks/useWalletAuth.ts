// use-wallet-auth.ts
import { useAccount, useSignMessage, useDisconnect } from 'wagmi';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';
import { ROUTES } from '@/lib/routes';
import { useRouter } from 'next/navigation';
import { createWalletSiweMessage } from '@/services/auth';

// Map Auth.js errors to user-friendly messages
const getWalletAuthErrorMessage = (error: string) => {
  const errorMessages: Record<string, string> = {
    CredentialsSignin: 'Wallet authentication failed. Please try again.',
    'Invalid wallet address':
      'Wallet address verification failed. Please try again.',
    'Invalid response from server':
      'Authentication server error. Please try again.',
    Configuration:
      'Authentication configuration error. Please contact support.',
    default: 'Wallet authentication failed. Please try again.',
  };
  return errorMessages[error] || errorMessages.default;
};

export const useWalletAuth = ({
  redirectUrl,
}: {
  redirectUrl?: string | null;
}) => {
  const router = useRouter();
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  const { signMessage } = useSignMessage({
    mutation: {
      onSuccess: async (signature, variables) => {
        try {
          if (!variables.message) throw new Error('No message to verify');
          const callbackUrl =
            redirectUrl && redirectUrl !== 'null'
              ? redirectUrl
              : ROUTES.FINDYOURPLUG_DASHBOARD;

          // Use SIWE message for authentication
          const response = await signIn('credentials', {
            walletAddress: address,
            signature,
            message: variables.message, // SIWE message
            redirect: false,
            callbackUrl,
          });

          if (response?.error) {
            const errorMessage = getWalletAuthErrorMessage(response.error);
            toast.error(errorMessage);
            return;
          }

          toast.success('Login successful');

          // Disconnect wallet after successful authentication to prevent confusion
          setTimeout(() => {
            disconnect();
          }, 1000);

          router.replace(callbackUrl);
        } catch (error) {
          console.error('Login failed:', error);
          const errorMessage =
            error instanceof Error
              ? getWalletAuthErrorMessage(error.message)
              : 'Wallet authentication failed. Please try again.';
          toast.error(errorMessage);
        }
      },
      onError: (error) => {
        console.error('Signature error:', error);
        toast.error('Failed to sign message. Please try again.');
      },
    },
  });

  const getSignatureMessage = async (walletAddress: string) => {
    try {
      // Create SIWE message with nonce from backend
      const { message } = await createWalletSiweMessage(walletAddress);
      return message;
    } catch (error) {
      console.error('Failed to create SIWE message:', error);
      throw error;
    }
  };

  const signInWithWallet = async (walletAddress: string) => {
    try {
      // Clear any existing session state
      if (typeof window !== 'undefined') {
        // Clear any cached authentication data
        localStorage.removeItem('wallet-auth-state');
        sessionStorage.removeItem('wallet-auth-state');
      }

      const message = await getSignatureMessage(walletAddress);
      signMessage({ message });
    } catch (error) {
      console.error('Error during sign-in:', error);
      toast.error('Error during sign-in. Please try again.');
    }
  };

  return { signInWithWallet };
};
