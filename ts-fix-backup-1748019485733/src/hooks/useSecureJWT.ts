import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface JWTAuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    permissions: string[];
  };
  token: string;
}

export function useSecureJWT() {
  const router = useRouter();
  const [isAuthenticatedsetIsAuthenticated] = useState(false);
  const [usersetUser] = useState(null);
  const [loadingsetLoading] = useState(true);
  const [errorsetError] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      const storedUser = sessionStorage.getItem('user');

      if (token && storedUser) {
        // Verify token with backend
        const response = await fetch('/api/auth/verify', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
          setupAxiosInterceptor(token);
        } else {
          // Token invalid, clear storage
          clearAuth();
        }
      }
    } catch (err) {

    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'},
        body: JSON.stringify({ email, password })});

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      }

      const data: JWTAuthResponse = await response.json();
      const { user, token } = data;

      // Store auth data
      localStorage.setItem('auth-token', token);
      sessionStorage.setItem('user', JSON.stringify(user));

      // Update state
      setUser(user);
      setIsAuthenticated(true);

      // Setup axios interceptor for API calls
      setupAxiosInterceptor(token);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST'});
    } catch (err) {

    } finally {
      clearAuth();
      router.push('/login');
    }
  };

  const refreshToken = async () => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST'});

      if (response.ok) {
        const data: JWTAuthResponse = await response.json();
        const { user, token } = data;

        localStorage.setItem('auth-token', token);
        sessionStorage.setItem('user', JSON.stringify(user));
        setupAxiosInterceptor(token);

        return token;
      }
    } catch (err) {

      clearAuth();
      return null;
    }
  };

  const clearAuth = () => {
    localStorage.removeItem('auth-token');
    sessionStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);

    // Remove axios interceptor
    axios.interceptors.request.eject(0);
  };

  const setupAxiosInterceptor = (token: string) => {
    // Add auth token to all axios requests
    axios.interceptors.request.use(
      (config) => {
        config.headers.Authorization = `Bearer ${token}`;
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Handle token refresh on 401
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          const newToken = await refreshToken();
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return axios(originalRequest);
          }
        }

        return Promise.reject(error);
      }
    );
  };

  const hasRole = (role: string): boolean => {
    return user?.role === role || user?.role === 'admin';
  };

  const hasPermission = (permission: string): boolean => {
    return user?.permissions?.includes(permission) || user?.role === 'admin';
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    refreshToken,
    hasRole,
    hasPermission};
}