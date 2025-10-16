import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import { getSession, signOut } from 'next-auth/react';

// Get BASE_URL from environment or use default
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050/api';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - DYNAMICALLY get token from NextAuth session
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Only run in browser environment
    if (typeof window !== 'undefined') {
      try {
        // Get fresh session on each request
        const session = await getSession();

        if (session?.token && config.headers) {
          config.headers.Authorization = `Bearer ${session.token}`;
        }
      } catch (error) {
        console.error('[API Client] Failed to get session:', error);
      }
    }

    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.params);
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Response] ${response.config.url}`, response.status);
    }
    return response;
  },
  async (error: AxiosError) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Handle unauthorized - session expired or invalid
      console.error('[API] Unauthorized - session may have expired');
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth')) {
        // Call NextAuth signOut to clear session properly
        await signOut({
          callbackUrl: '/findyourplug/login',
          redirect: true
        });
      }
    }

    if (error.response?.status === 403) {
      console.error('[API] Forbidden - insufficient permissions');
    }

    if (error.response?.status === 404) {
      console.error('[API] Not found:', error.config?.url);
    }

    if (error.response && error.response.status >= 500) {
      console.error('[API] Server error:', error.response.status);
    }

    // Network error
    if (!error.response) {
      console.error('[API] Network error - server may be down');
    }

    console.error('[API Response Error]', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
