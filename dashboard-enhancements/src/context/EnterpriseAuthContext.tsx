'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth/AuthService';
import { 
  User, 
  AuthState, 
  AuthError, 
  LoginRequest, 
  UserRole,
  AuthErrorCode 
} from '@/types/auth';

interface EnterpriseAuthContextType extends AuthState {
  signIn: (credentials: LoginRequest) => Promise<void>;
  signOut: () => Promise<void>;
  refreshToken: () => Promise<void>;
  hasPermission: (resource: string, action: string) => boolean;
  hasRole: (role: UserRole) => boolean;
  clearError: () => void;
}

const EnterpriseAuthContext = createContext<EnterpriseAuthContextType | undefined>(undefined);

interface EnterpriseAuthProviderProps {
  children: React.ReactNode;
}

export function EnterpriseAuthProvider({ children }: EnterpriseAuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
    sessionId: null
  });

  const router = useRouter();

  // Initialize authentication state
  const initializeAuth = useCallback(async () => {
    try {
      if (!authService.isAuthenticated()) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      const user = await authService.getCurrentUser();
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        sessionId: null // Will be set on next login
      });
    } catch (error: any) {
      console.error('Auth initialization failed:', error);
      
      // If token is expired, try to refresh
      if (error.code === AuthErrorCode.SESSION_EXPIRED) {
        try {
          await authService.refreshToken();
          const user = await authService.getCurrentUser();
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            sessionId: null
          });
          return;
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
        }
      }

      // Clear auth state on any failure
      await authService.signOut();
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: error as AuthError,
        sessionId: null
      });
    }
  }, []);

  // Sign in user
  const signIn = useCallback(async (credentials: LoginRequest) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      const loginResponse = await authService.signIn(credentials);
      
      setAuthState({
        user: loginResponse.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        sessionId: loginResponse.sessionId
      });

      // Redirect to appropriate dashboard
      const dashboardRoute = authService.getUserDashboardRoute(loginResponse.user.role);
      router.push(dashboardRoute);

    } catch (error: any) {
      console.error('Sign in failed:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error as AuthError
      }));
      throw error;
    }
  }, [router]);

  // Sign out user
  const signOut = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      await authService.signOut();
      
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        sessionId: null
      });

      router.push('/auth/login');
    } catch (error: any) {
      console.error('Sign out failed:', error);
      
      // Even if logout fails, clear local state
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        sessionId: null
      });
      
      router.push('/auth/login');
    }
  }, [router]);

  // Refresh authentication token
  const refreshToken = useCallback(async () => {
    try {
      const loginResponse = await authService.refreshToken();
      
      setAuthState(prev => ({
        ...prev,
        user: loginResponse.user,
        sessionId: loginResponse.sessionId,
        error: null
      }));
    } catch (error: any) {
      console.error('Token refresh failed:', error);
      
      // Force logout on refresh failure
      await signOut();
      throw error;
    }
  }, [signOut]);

  // Check if user has specific permission
  const hasPermission = useCallback((resource: string, action: string): boolean => {
    if (!authState.user) return false;
    return authService.hasPermission(authState.user, resource, action);
  }, [authState.user]);

  // Check if user has specific role
  const hasRole = useCallback((role: UserRole): boolean => {
    if (!authState.user) return false;
    return authService.hasRole(authState.user, role);
  }, [authState.user]);

  // Clear authentication error
  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }));
  }, []);

  // Initialize auth on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Set up token refresh interval
  useEffect(() => {
    if (!authState.isAuthenticated) return;

    const refreshInterval = setInterval(async () => {
      try {
        if (authService.isAuthenticated()) {
          // Refresh token 5 minutes before expiry
          await refreshToken();
        }
      } catch (error) {
        console.error('Automatic token refresh failed:', error);
      }
    }, 20 * 60 * 1000); // Check every 20 minutes

    return () => clearInterval(refreshInterval);
  }, [authState.isAuthenticated, refreshToken]);

  const contextValue: EnterpriseAuthContextType = {
    ...authState,
    signIn,
    signOut,
    refreshToken,
    hasPermission,
    hasRole,
    clearError
  };

  return (
    <EnterpriseAuthContext.Provider value={contextValue}>
      {children}
    </EnterpriseAuthContext.Provider>
  );
}

// Hook to use authentication context
export function useEnterpriseAuth(): EnterpriseAuthContextType {
  const context = useContext(EnterpriseAuthContext);
  
  if (context === undefined) {
    throw new Error('useEnterpriseAuth must be used within an EnterpriseAuthProvider');
  }
  
  return context;
}

export default EnterpriseAuthContext;