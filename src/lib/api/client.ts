import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';

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

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token if available (from localStorage or session)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
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
  (error: AxiosError) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Handle unauthorized - clear token and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        // Only redirect if not already on auth page
        if (!window.location.pathname.includes('/login')) {
          console.warn('[API] Unauthorized - redirecting to login');
          // You might want to redirect here or dispatch an action
        }
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

    return Promise.reject(error);
  }
);

export default apiClient;
