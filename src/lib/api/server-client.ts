import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';
import { auth, signOut } from '@/auth';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050/api';

/**
 * Create a server-side API client with automatic token injection from NextAuth session
 * Must be called fresh on each server request to get the current session
 * 
 * @example
 * ```typescript
 * // In Server Component
 * const serverClient = await createServerClient();
 * const data = await dashboardApi.getOverview(serverClient);
 * ```
 * 
 * @example
 * ```typescript
 * // In Server Action
 * 'use server';
 * export async function fetchData() {
 *   const client = await createServerClient();
 *   return await someApi.getData(client);
 * }
 * ```
 */
export async function createServerClient(): Promise<AxiosInstance> {
    // Get current session
    const session = await auth();

    // Create axios instance with token if available
    const serverClient = axios.create({
        baseURL: BASE_URL,
        timeout: 30000,
        headers: {
            'Content-Type': 'application/json',
            ...(session?.token && { Authorization: `Bearer ${session.token}` }),
        },
    });

    // Request interceptor for logging
    serverClient.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
            if (process.env.NODE_ENV === 'development') {
                console.log(`[Server API Request] ${config.method?.toUpperCase()} ${config.url}`);
            }
            return config;
        },
        (error: AxiosError) => {
            console.error('[Server API Request Error]', error);
            return Promise.reject(error);
        }
    );

    // Response interceptor for error handling
    serverClient.interceptors.response.use(
        (response) => {
            if (process.env.NODE_ENV === 'development') {
                console.log(`[Server API Response] ${response.config.url}`, response.status);
            }
            return response;
        },
        (error: AxiosError) => {
            if (error.response?.status === 401) {
                console.error('[Server API] Unauthorized - invalid or expired token');
                // Call NextAuth server-side signOut to clear session
                signOut({ redirectTo: '/findyourplug/login' });
            }

            if (error.response?.status === 403) {
                console.error('[Server API] Forbidden - insufficient permissions');
            }

            if (error.response && error.response.status >= 500) {
                console.error('[Server API] Server error:', error.response.status);
            }

            if (!error.response) {
                console.error('[Server API] Network error - server may be down');
            }

            console.error('[Server API Error]', error.response?.data || error.message);
            return Promise.reject(error);
        }
    );

    return serverClient;
}

/**
 * Helper to get the current server-side session
 * Useful for checking authentication status before making API calls
 * 
 * @example
 * ```typescript
 * const session = await getServerSession();
 * if (!session) {
 *   redirect('/auth/signin');
 * }
 * ```
 */
export async function getServerSession() {
    const session = await auth();
    return session;
}

/**
 * Helper to get just the auth token for manual requests
 * 
 * @example
 * ```typescript
 * const token = await getServerAuthToken();
 * if (token) {
 *   // Make authenticated request
 * }
 * ```
 */
export async function getServerAuthToken(): Promise<string | null> {
    const session = await auth();
    return session?.token || null;
}

/**
 * Helper to require authentication in Server Components
 * Throws error if not authenticated, which Next.js will handle
 * 
 * @example
 * ```typescript
 * export default async function ProtectedPage() {
 *   await requireServerAuth(); // Throws if not authenticated
 *   // ... rest of component
 * }
 * ```
 */
export async function requireServerAuth() {
    const session = await auth();
    if (!session || !session.token) {
        throw new Error('Unauthorized');
    }
    return session;
}
