import { loginUser } from '@/services/auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { ROUTES } from '../routes';
import { type User } from 'next-auth';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import axios from 'axios';
import { BASE_URL } from '../api-request';

// Custom error classes
// class InvalidLoginError extends CredentialsSignin {
//   code = "Invalid identifier or password";
// }

// class TimeoutError extends CredentialsSignin {
//   code = "Request timed out. Please try again.";
// }

// class InvalidResponseError extends CredentialsSignin {
//   code = "Invalid response from server";
// }

// class InvalidWalletError extends CredentialsSignin {
//   code = "Invalid wallet address";
// }
declare module 'next-auth' {
  interface User {
    id: string;
    token: string;
    role?: string;
    purpose?: string;
    stores?: {
      id: string;
      storeName: string;
      storeUrl: string;
    }[];
    walletAddress?: string;
    authType?: string;
    expires_in?: number;
  }

  interface Session {
    token: string;
    user: User;
  }
}

interface LoginResponseData {
  token: string;
  userId: string;
  name: string;
  email: string;
  role: string;
  stores: {
    id: string;
    storeName: string;
    storeUrl: string;
  }[];
  walletAddress?: string;
  purpose?: string;
}

// Google OAuth is handled by backend

const authOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text', optional: true },
        password: { label: 'Password', type: 'password', optional: true },
        walletAddress: {
          label: 'Wallet Address',
          type: 'text',
          optional: true,
        },
        signature: { label: 'Signature', type: 'text', optional: true },
        role: { label: 'Role', type: 'text', optional: true },
        token: { label: 'JWT Token', type: 'text', optional: true },
        user: { label: 'User Data', type: 'text', optional: true },
      },
      async authorize(credentials) {
        if (!credentials) throw new Error('Missing credentials');

        // Determine auth type based on credentials
        const isWalletAuth = Boolean(
          credentials.signature && credentials.walletAddress
        );
        const isEmailAuth = Boolean(credentials.email && credentials.password);
        const isOAuthToken = Boolean(credentials.token && credentials.user);

        if (!isWalletAuth && !isEmailAuth && !isOAuthToken) {
          throw new Error('Invalid credentials provided');
        }

        try {
          if (isOAuthToken) {
            // Handle OAuth token from backend
            const userData = JSON.parse(credentials.user as string);
            return {
              id: userData.id.toString(),
              name: userData.name,
              email: userData.email,
              role: userData.roles?.[0] || 'USER',
              purpose: userData.purpose || 'ADD_BUSINESS',
              stores: userData.stores || [],
              token: credentials.token as string,
              authType: 'GOOGLE',
            };
          } else if (isWalletAuth) {
            const { data: res } = await axios.post(
              `${BASE_URL}/auth/wallet/verify`,
              {
                signature: credentials.signature,
                walletAddress: credentials.walletAddress,
                role: credentials.role || 'USER',
              },
              {
                timeout: 10000,
                headers: {
                  'Content-Type': 'application/json',
                  'X-Request-Timestamp': Date.now().toString(),
                },
              }
            );

            if (!res?.data?.user || !res?.data?.token) {
              throw new Error('Invalid response from server');
            }

            const { user, token } = res.data;

            if (!user.id || !user.walletAddress) {
              throw new Error('Invalid user data received');
            }

            if (
              user.walletAddress.toLowerCase() !==
              (credentials.walletAddress as string)?.toLowerCase()
            ) {
              throw new Error('Invalid wallet address');
            }

            return {
              ...user,
              token,
              purpose: user.purpose || 'ADD_BUSINESS',
              walletAddress: user.walletAddress.toLowerCase(),
              authType: 'WALLET',
            };
          } else {
            // Email/password flow
            const res = await loginUser({
              email: credentials.email!,
              password: credentials.password!,
            } as {
              email: string;
              password: string;
            });
            const userData = res as unknown as LoginResponseData;

            if (!userData) return null;

            return {
              id: userData.userId,
              name: userData.name,
              email: userData.email,
              role: userData.role,
              purpose: userData.purpose || 'ADD_BUSINESS',
              stores: userData.stores || [],
              token: userData.token,
              authType: 'EMAIL',
            };
          }
        } catch (error) {
          if (axios.isAxiosError(error)) {
            if (error.code === 'ECONNABORTED') {
              throw new Error('Request timed out. Please try again.');
            }
            throw new Error('Invalid identifier or password');
          }
          console.error('Auth error:', error);
          throw new Error('Invalid identifier or password');
        }
      },
    }),

    // Google OAuth is handled by backend at /api/auth/google
    // No NextAuth Google provider needed
  ],

  callbacks: {
    async signIn() {
      // Google OAuth is handled by backend, no special handling needed here
      return true;
    },

    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        const decoded = jwtDecode<JwtPayload>((user as User).token);
        token.token = (user as User).token;
        token.user = { ...user, expires_in: decoded.exp };
      }
      return token;
    },

    async session({ session, token }: { session: any; token: any }) {
      const dd = (token.user as User & { expires_in: string }).expires_in;

      return {
        ...session,
        token: token.token,
        expires: new Date(Number(dd) * 1000).toISOString(),
        user: {
          ...session.user,
          ...(token.user as User),
        },
      };
    },
  },

  pages: {
    signIn: ROUTES.LOGIN,
    signOut: '/api/auth/signout',
    error: ROUTES.LOGIN,
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // debug: process.env.NODE_ENV === 'development',

  secret: process.env.AUTH_SECRET,
};

export { authOptions };
