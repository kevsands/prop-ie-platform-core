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
      console.log('🔄 EnterpriseAuthContext: Initializing auth...');
      console.log('🔄 EnterpriseAuthContext: Checking if authenticated...');
      
      const isAuth = authService.isAuthenticated();
      console.log('🔄 EnterpriseAuthContext: isAuthenticated result:', isAuth);
      
      if (!isAuth) {
        console.log('🔄 EnterpriseAuthContext: Not authenticated, clearing state');
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      console.log('🔄 EnterpriseAuthContext: Getting current user...');
      const user = await authService.getCurrentUser();
      console.log('🔄 EnterpriseAuthContext: Current user loaded:', user?.email);
      
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        sessionId: null // Will be set on next login
      });
      
      console.log('✅ EnterpriseAuthContext: Auth initialization complete');
    } catch (error: any) {
      console.error('❌ EnterpriseAuthContext: Auth initialization failed:', error);
      
      // If token is expired, try to refresh
      if (error.code === AuthErrorCode.SESSION_EXPIRED) {
        try {
          console.log('🔄 EnterpriseAuthContext: Attempting token refresh...');
          await authService.refreshToken();
          const user = await authService.getCurrentUser();
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            sessionId: null
          });
          console.log('✅ EnterpriseAuthContext: Token refresh successful');
          return;
        } catch (refreshError) {
          console.error('❌ EnterpriseAuthContext: Token refresh failed:', refreshError);
        }
      }

      // Clear auth state on any failure
      console.log('🔄 EnterpriseAuthContext: Clearing auth state due to error');
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
      console.log('🚀 EnterpriseAuthContext: Starting sign in process...');
      console.log('🚀 EnterpriseAuthContext: Credentials check:', { email: credentials.email, hasPassword: !!credentials.password });
      
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      console.log('🚀 EnterpriseAuthContext: Calling authService.signIn...');
      const loginResponse = await authService.signIn(credentials);
      console.log('🚀 EnterpriseAuthContext: Login response received:', loginResponse);
      console.log('🚀 EnterpriseAuthContext: Response type check:', typeof loginResponse, Object.keys(loginResponse || {}));
      
      console.log('🚀 EnterpriseAuthContext: Updating auth state...');
      setAuthState({
        user: loginResponse.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        sessionId: loginResponse.sessionId
      });

      console.log('🚀 EnterpriseAuthContext: Auth state updated, checking tokens...');
      console.log('🚀 EnterpriseAuthContext: localStorage tokens:', {
        hasAccessToken: !!localStorage.getItem('prop_access_token'),
        hasRefreshToken: !!localStorage.getItem('prop_refresh_token'),
        hasSessionId: !!localStorage.getItem('prop_session_id')
      });

      // Use dashboard route from API response if available, otherwise compute it
      let dashboardRoute = loginResponse.dashboardRoute;
      if (!dashboardRoute) {
        console.log('🚀 EnterpriseAuthContext: Getting dashboard route for role:', loginResponse.user.role);
        dashboardRoute = authService.getUserDashboardRoute(loginResponse.user.role);
      }
      
      console.log('🚀 EnterpriseAuthContext: About to redirect to:', dashboardRoute);
      console.log('🚀 EnterpriseAuthContext: Current URL:', window.location.href);
      
      router.push(dashboardRoute);
      
      console.log('✅ EnterpriseAuthContext: Sign in complete, redirect initiated!');

    } catch (error: any) {
      console.error('❌ EnterpriseAuthContext: Sign in failed:', error);
      console.error('❌ EnterpriseAuthContext: Error details:', {
        message: error?.message,
        code: error?.code,
        stack: error?.stack
      });
      
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