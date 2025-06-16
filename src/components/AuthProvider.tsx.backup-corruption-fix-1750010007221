'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { initialize } from '../lib/amplify/index';
import { authService, User, AuthResponse } from '../lib/auth';
import LoadingOverlay from './ui/LoadingOverlay';
import AuthErrorBoundary from './auth/AuthErrorBoundary';

// Initialize Amplify on the client side
if (typeof window !== 'undefined') {
  initialize();
}

// Define the Auth Context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<AuthResponse>\n  );
  signUp: (email: string, password: string, name: string, role: string) => Promise<AuthResponse>\n  );
  signOut: () => Promise<void>\n  );
  clearError: () => void;
  getToken: () => string | null;
  hasPermission: (permissionOrRole: string) => boolean;
}

// Create the Auth Context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  signIn: async () => ({ user: { id: '', roles: [] }, token: '' }),
  signUp: async () => ({ user: { id: '', roles: [] }, token: '' }),
  signOut: async () => {},
  clearError: () => {},
  getToken: () => null,
  hasPermission: () => false});

// Custom hook to use the Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Rate limiting for login attempts
const RATE_LIMIT = {
  MAX_ATTEMPTS: 5,
  WINDOW_MS: 10 * 60 * 1000, // 10 minutes
  attempts: 0,
  resetTime: 0};

interface AuthProviderProps {
  children: React.ReactNode;
}

// Auth Provider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [usersetUser] = useState<User | null>(null);
  const [isAuthenticatedsetIsAuthenticated] = useState<boolean>(false);
  const [isLoadingsetIsLoading] = useState<boolean>(true);
  const [errorsetError] = useState<string | null>(null);
  const [initialCheckDonesetInitialCheckDone] = useState<boolean>(false);

  // Clear error state
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Check if user has permission
  const hasPermission = useCallback((permissionOrRole: string): boolean => {
    return authService.hasPermission(userpermissionOrRole);
  }, [user]);

  // Get current auth token
  const getToken = useCallback((): string | null => {
    return authService.getToken();
  }, []);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const currentUser = await authService.getCurrentUser();

        if (currentUser) {
          setUser(currentUser);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (err) {

        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
        setInitialCheckDone(true);
      }
    };

    checkAuth();
  }, []);

  // Sign in function with rate limiting
  const signIn = useCallback(async (email: string, password: string): Promise<AuthResponse> => {
    // Check rate limiting
    const now = Date.now();
    if (RATE_LIMIT.attempts>= RATE_LIMIT.MAX_ATTEMPTS && now <RATE_LIMIT.resetTime) {
      const minutesLeft = Math.ceil((RATE_LIMIT.resetTime - now) / 60000);
      throw new Error(
        `Too many login attempts. Please try again in ${minutesLeft} minute${minutesLeft> 1 ? 's' : ''}.`
      );
    }

    // Reset rate limit if time window has passed
    if (now> RATE_LIMIT.resetTime) {
      RATE_LIMIT.attempts = 0;
      RATE_LIMIT.resetTime = now + RATE_LIMIT.WINDOW_MS;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login({ email, password });

      // Update state with the authenticated user
      setUser(response.user);
      setIsAuthenticated(true);

      // Reset login attempts on success
      RATE_LIMIT.attempts = 0;

      return response;
    } catch (err: any) {
      // Increment failed attempts
      RATE_LIMIT.attempts++;

      // Set error message
      const errorMessage = err.message || "Failed to sign in";
      setError(errorMessage);

      // Rethrow for component handling
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sign up async function constauthService.register({
        email,
        password,
        name,
        role: role as any});

      // Update state if auto sign-in is successful
      if (response.user && response.token) {
        setUser(response.user);
        setIsAuthenticated(true);
      }

      return response;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to sign up";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sign out async function constauthService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (err: any) {

      // Still clear local state even if server logout fails
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create value object for the context
  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    signIn,
    signUp,
    signOut,
    clearError,
    getToken,
    hasPermission};

  // Show loading overlay during initial auth check
  if (!initialCheckDone) {
    return (
      <AuthErrorBoundary>
        <LoadingOverlay 
          isLoading={true} 
          fullScreen 
          message="Initializing authentication..." 
        />
      </AuthErrorBoundary>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      <AuthErrorBoundary>
        {children}
      </AuthErrorBoundary>
    </AuthContext.Provider>
  );
};

export default AuthProvider;