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
    console.log('Testing SIWE message creation...');

    const result = await createWalletSiweMessage(walletAddress);

    console.log('✅ SIWE message created successfully:');
    console.log('Message:', result.message);
    console.log('Nonce:', result.nonce);

    return result;
  } catch (error) {
    console.error('❌ SIWE message creation failed:', error);
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
    console.log('Testing wallet authentication...');

    const result = await verifyWalletSignature(
      walletAddress,
      signature,
      message
    );

    console.log('✅ Wallet authentication successful:');
    console.log('User:', result.user);
    console.log('Token:', result.token);

    return result;
  } catch (error) {
    console.error('❌ Wallet authentication failed:', error);
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
