import { apiRequest } from '@/lib/api-request';
import { API_ROUTES } from '@/lib/routes';
import { createSiweMessage, prepareSiweMessage } from '@/lib/siwe';

export const registerUser = async (userData: {
  email: string;
  name: string;
  password: string;
}) => {
  const response = await apiRequest(API_ROUTES.auth.register, {
    method: 'POST',
    data: {
      ...userData,
      purpose: 'ADD_BUSINESS', // Default purpose for new users
    },
  });

  return response.data;
};

export const loginUser = async (credentials: {
  email?: string;
  password: string;
  walletAddress?: string;
}) => {
  const response = await apiRequest(API_ROUTES.auth.login, {
    method: 'POST',
    data: credentials,
  });
  return response.data;
};

export const socialLoginUser = async (userData: {
  email: string;
  name: string;
  googleId: string;
}) => {
  const response = await apiRequest(API_ROUTES.auth.socialLogin, {
    method: 'POST',
    data: userData,
  });
  console.log(response);

  return response.data;
};

/**
 * Fetch nonce for wallet authentication
 */
export const fetchNonce = async (walletAddress: string) => {
  const response = await apiRequest(
    `${API_ROUTES.auth.nonce}?address=${walletAddress}`,
    {
      method: 'GET',
    }
  );
  return response.data;
};

/**
 * Create SIWE message for wallet signing
 */
export const createWalletSiweMessage = async (
  walletAddress: string,
  chainId: number = 8453
) => {
  // Fetch nonce from backend
  const nonceResponse = (await fetchNonce(walletAddress)) as any;

  if (nonceResponse.error) {
    throw new Error(nonceResponse.error);
  }

  const { nonce } = nonceResponse;

  // Create SIWE message
  const siweMessage = createSiweMessage(walletAddress, nonce, chainId);

  // Prepare message for signing
  const messageToSign = prepareSiweMessage(siweMessage);

  return {
    message: messageToSign,
    siweMessage,
    nonce,
  };
};

/**
 * Verify wallet signature with SIWE message
 */
export const verifyWalletSignature = async (
  walletAddress: string,
  signature: string,
  message: string
) => {
  const response = await apiRequest(API_ROUTES.auth.walletVerify, {
    method: 'POST',
    data: {
      walletAddress,
      signature,
      message,
    },
  });
  return response.data;
};
