import axios from 'axios';

const getApiBaseUrl = (): string => {
  // Always use relative '/api' in non-localhost browser environments to avoid
  // Mixed Content (HTTPS -> HTTP) and route through Vercel Serverless Functions
  if (typeof window !== 'undefined') {
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (!isLocalhost) {
      return '/api';
    }
  }

  // Fallback for local development
  return import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 15000, // 15 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle authorization errors and network issues
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // If we are not already on the login page, redirect
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    // Normalize network/timeout errors
    if (!error.response) {
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        error.message = 'Server bilan bog\'lanish vaqti tugadi (Timeout). Iltimos, internet aloqasini tekshirib qaytadan urinib ko\'ring.';
      } else {
        error.message = 'Server bilan aloqa o\'rnatilmadi (Network Error). Backend server ishlayotganini va tarmoqni tekshiring.';
      }
      // Create a mock response structure to satisfy UI error message extraction
      error.response = {
        status: 0,
        statusText: 'Network Error',
        headers: {},
        config: error.config || {},
        data: {
          message: error.message,
        },
      };
    }
    return Promise.reject(error);
  }
);

export default api;
