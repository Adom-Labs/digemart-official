import {
  createWalletSiweMessage,
  verifyWalletSignature,
} from '@/services/auth';
import { signIn } from 'next-auth/react';

export interface WalletAuthParams {
  walletAddress: string;
  chainId?: number;
  onMessage?: (message: string) => Promise<string>; // Function to handle message signing
}

/**
 * Authenticate with wallet using SIWE standard
 */
export const authenticateWithWallet = async ({
  walletAddress,
  chainId = 8453,
  onMessage,
}: WalletAuthParams) => {
  try {
    // Step 1: Create SIWE message with nonce from backend
    const { message } = await createWalletSiweMessage(
      walletAddress,
      chainId
    );

    // Step 2: Get user to sign the message
    if (!onMessage) {
      throw new Error('Message signing function not provided');
    }

    const signature = await onMessage(message);

    // Step 3: Verify signature with backend using SIWE
    const result = await verifyWalletSignature(
      walletAddress,
      signature,
      message
    ) as { user: unknown; token: string };

    if (!result?.user || !result?.token) {
      throw new Error('Authentication failed');
    }

    // Step 4: Create NextAuth session
    const signInResult = await signIn('credentials', {
      walletAddress,
      signature,
      message,
      redirect: false,
    });

    if (signInResult?.error) {
      throw new Error(signInResult.error);
    }

    return {
      success: true,
      user: result.user,
      token: result.token,
    };
  } catch (error) {
    console.error('Wallet authentication failed:', error);
    throw error;
  }
};

/**
 * Create SIWE message for wallet signing (without authentication)
 */
export const createWalletMessage = async (
  walletAddress: string,
  chainId: number = 8453
) => {
  return await createWalletSiweMessage(walletAddress, chainId);
};
