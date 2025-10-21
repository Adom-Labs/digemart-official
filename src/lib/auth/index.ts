import { loginUser, verifyWalletSignature } from '@/services/auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { ROUTES } from '../routes';
import { CredentialsSignin, type User } from 'next-auth';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import axios from 'axios';

// Custom error classes
class InvalidLoginError extends CredentialsSignin {
  code = "Invalid identifier or password";
}

class TimeoutError extends CredentialsSignin {
  code = "Request timed out. Please try again.";
}

class InvalidResponseError extends CredentialsSignin {
  code = "Invalid response from server";
}

class InvalidWalletError extends CredentialsSignin {
  code = "Invalid wallet address";
}
declare module 'next-auth' {
  interface User {
    id?: number | string;
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

interface WalletVerificationResponse {
  user: {
    id: number | string;
    name: string;
    email: string;
    roles: string[];
    kyc: unknown;
    identities?: Array<{
      identifier: string;
      provider: string;
    }>;
    purpose?: string;
    stores?: Array<{
      id: string;
      storeName: string;
      storeUrl: string;
    }>;
    walletAddress?: string;
  };
  token: string;
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
        message: { label: 'SIWE Message', type: 'text', optional: true },
      },
      async authorize(credentials) {
        if (!credentials) throw new InvalidLoginError();

        // Determine auth type based on credentials
        const isWalletAuth = Boolean(
          credentials.signature &&
          credentials.walletAddress &&
          credentials.message
        );
        const isEmailAuth = Boolean(credentials.email && credentials.password);
        const isOAuthToken = Boolean(credentials.token && credentials.user);

        if (!isWalletAuth && !isEmailAuth && !isOAuthToken) {
          throw new InvalidLoginError();
        }

        try {
          if (isOAuthToken) {
            // Handle OAuth token from backend
            const userData = JSON.parse(credentials.user as string);
            return {
              ...userData,
              token: credentials.token as string,
              authType: 'GOOGLE',
            };
          } else if (isWalletAuth) {
            // Use SIWE verification
            try {
              const result = (await verifyWalletSignature(
                credentials.walletAddress as string,
                credentials.signature as string,
                credentials.message as string
              )) as WalletVerificationResponse;


              if (!result?.user || !result?.token) {
                throw new InvalidResponseError();
              }

              const { user, token } = result;

              if (!user.id) {
                throw new InvalidResponseError();
              }

              // Extract wallet address from identities array or use email (which contains wallet address)
              const walletAddress =
                user.identities?.[0]?.identifier ||
                user.walletAddress ||
                user.email;

              if (!walletAddress) {
                throw new InvalidResponseError();
              }

              // Verify wallet address matches
              if (
                walletAddress.toLowerCase() !==
                (credentials.walletAddress as string)?.toLowerCase()
              ) {
                throw new InvalidWalletError();
              }

              return {
                ...user,
                token,
                walletAddress: walletAddress.toLowerCase(),
                authType: 'WALLET',
              };
            } catch (error) {
              // Handle wallet verification errors
              if (error instanceof InvalidResponseError || error instanceof InvalidWalletError) {
                throw error;
              }
              // Any other error from wallet verification
              const errorMessage = error instanceof Error ? error.message : 'Wallet authentication failed';
              if (errorMessage.includes('Signature verification failed') || errorMessage.includes('Invalid wallet')) {
                throw new InvalidWalletError();
              }
              throw new InvalidResponseError();
            }
          } else {
            // Email/password flow
            const res = await loginUser({
              email: credentials.email!,
              password: credentials.password!,
            } as {
              email: string;
              password: string;
            });
            const userData = res as unknown as WalletVerificationResponse;

            if (!userData) return null;

            return {
              ...userData.user,
              token: userData.token,
              authType: 'EMAIL',
            };
          }
        } catch (error) {
          if (axios.isAxiosError(error)) {
            if (error.code === 'ECONNABORTED') {
              throw new TimeoutError();
            }
            throw new InvalidLoginError();
          }
          console.error('Auth error:', error);
          throw new InvalidLoginError();
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

    async jwt({ token, user }: { token: Record<string, unknown>; user: User | undefined }) {
      if (user) {
        const decoded = jwtDecode<JwtPayload>((user as User).token);
        token.token = (user as User).token;
        token.user = { ...user, expires_in: decoded.exp };
      }
      return token;
    },

    async session({ session, token }: { session: Record<string, unknown>; token: Record<string, unknown> }) {
      const dd = ((token.user as unknown as User & { expires_in: string }).expires_in);

      return {
        ...session,
        token: token.token,
        expires: new Date(Number(dd) * 1000).toISOString(),
        user: {
          ...session.user as User,
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
