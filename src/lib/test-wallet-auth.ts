/**
 * Test utility for wallet authentication
 * This file can be used to test the wallet authentication flow
 */

import {
  createWalletSiweMessage,
  verifyWalletSignature,
} from '@/services/auth';

/**
 * Test the SIWE message creation
 */
export const testSiweMessageCreation = async (walletAddress: string) => {
  try {

    const result = await createWalletSiweMessage(walletAddress);
    return result;
  } catch (error) {
    throw error;
  }
};

/**
 * Test the complete wallet authentication flow
 */
export const testWalletAuthentication = async (
  walletAddress: string,
  signature: string,
  message: string
) => {
  try {

    const result = await verifyWalletSignature(
      walletAddress,
      signature,
      message
    );
    return result;
  } catch (error) {
    throw error;
  }
};

/**
 * Example usage:
 *
 * // Test message creation
 * const { message, nonce } = await testSiweMessageCreation('0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6');
 *
 * // After user signs the message, test authentication
 * const result = await testWalletAuthentication(
 *   '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
 *   'user-signature',
 *   message
 * );
 */
