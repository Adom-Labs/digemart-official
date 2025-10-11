import { apiRequest } from '@/lib/api-request';
import { API_ROUTES } from '@/lib/routes';

export const registerUser = async (userData: {
  email: string;
  name: string;
  password: string;
}) => {
  const response = await apiRequest(API_ROUTES.auth.register, {
    method: 'POST',
    data: {
      ...userData,
      purpose: 'ADD_USER', // Default purpose for new users
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
