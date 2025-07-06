'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authRestApiService } from '@/services/authRestApiService';

// Define User and other types needed for build
interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  status: string;
  role: string;
  permissions: string[];
  onboardingComplete: boolean;
  emailVerified: boolean;
  mfaEnabled: boolean;
  cognitoAttributes?: {
    firstName?: string;
    lastName?: string;
    accessToken?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface SignInResult {
  isSignedIn: boolean;
  nextStep?: {
    signInStep: string;
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | string | null;
  mfaEnabled: boolean;
  mfaRequired: boolean;
  securityLevel: 'basic' | 'medium' | 'high';
  signIn: (username: string, password: string) => Promise<SignInResult>;
  signUp: (username: string, password: string, attributes: Record<string, string>) => Promise<any>;
  confirmSignUp: (username: string, code: string) => Promise<any>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (username: string) => Promise<any>;
  confirmResetPassword: (username: string, code: string, newPassword: string) => Promise<any>;
  confirmSignIn: (challengeResponse: string) => Promise<any>;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
  checkSecurityLevel: (requiredLevel: 'basic' | 'medium' | 'high') => Promise<boolean>;
  refreshSession: () => Promise<void>;
}

// Create simplified context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  mfaEnabled: false,
  mfaRequired: false,
  securityLevel: 'basic',
  signIn: async () => ({ isSignedIn: false }),
  signUp: async () => null,
  confirmSignUp: async () => null,
  signOut: async () => {},
  logout: async () => {},
  resetPassword: async () => null,
  confirmResetPassword: async () => null,
  confirmSignIn: async () => null,
  hasRole: () => false,
  hasPermission: () => false,
  checkSecurityLevel: async () => false,
  refreshSession: async () => {}
});

export const useAuth = () => useContext(AuthContext);

// Helper function to get role-based permissions
const getRolePermissions = (role: string): string[] => {
  switch (role.toLowerCase()) {
    case 'buyer':
      return ['view:properties', 'create:offers', 'manage:documents'];
    case 'developer':
      return ['manage:developments', 'view:analytics', 'manage:users'];
    case 'agent':
      return ['view:properties', 'manage:clients', 'create:offers'];
    case 'solicitor':
      return ['manage:documents', 'view:transactions', 'approve:sales'];
    case 'admin':
      return ['read:all', 'write:all', 'admin:all'];
    default:
      return ['view:properties'];
  }
};

// Simplified auth provider with proper authentication flow
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | string | null>(null);

  // Check for stored auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const { userId, signInDetails } = await authRestApiService.getCurrentUser();
        const attributes = await authRestApiService.fetchUserAttributes();
        
        if (userId && attributes) {
          const userData: User = {
            id: userId,
            username: attributes.email || '',
            email: attributes.email || '',
            name: attributes.name || attributes.preferred_username || '',
            status: 'ACTIVE',
            role: attributes['custom:role'] || 'user',
            permissions: getRolePermissions(attributes['custom:role'] || 'user'),
            onboardingComplete: true,
            emailVerified: true,
            mfaEnabled: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.log('No authenticated user found');
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function using real authentication API
  const signIn = async (username: string, password: string): Promise<SignInResult> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { isSignedIn, nextStep } = await authRestApiService.signIn({ username, password });
      
      if (isSignedIn) {
        // Get user data after successful login
        const { userId, signInDetails } = await authRestApiService.getCurrentUser();
        const attributes = await authRestApiService.fetchUserAttributes();
        
        const userData: User = {
          id: userId,
          username: attributes.email || '',
          email: attributes.email || '',
          name: attributes.name || attributes.preferred_username || '',
          status: 'ACTIVE',
          role: attributes['custom:role'] || 'user',
          permissions: getRolePermissions(attributes['custom:role'] || 'user'),
          onboardingComplete: true,
          emailVerified: true,
          mfaEnabled: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        setUser(userData);
        setIsAuthenticated(true);
        
        return { isSignedIn: true };
      } else {
        return { isSignedIn: false, nextStep };
      }
    } catch (err) {
      setError(err instanceof Error ? err : String(err));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    setIsLoading(true);
    try {
      // Call API to sign out
      await authRestApiService.signOut();
      
      // Clear local state
      setUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      setError(err instanceof Error ? err : String(err));
      // Even if API call fails, clear local state
      setUser(null);
      setIsAuthenticated(false);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = signOut; // Alias for signOut

  // Mock sign up function
  const signUp = async (username: string, password: string, attributes: Record<string, string>) => {
    setIsLoading(true);
    try {
      // Simulate successful signup
      await new Promise(resolve => setTimeout(resolve, 500));
      return { isConfirmed: false, nextStep: { signUpStep: 'CONFIRM_SIGN_UP' } };
    } catch (err) {
      setError(err instanceof Error ? err : String(err));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Other auth functions
  const confirmSignUp = async () => ({ isConfirmed: true });
  const resetPassword = async () => ({ nextStep: { resetPasswordStep: 'CONFIRM_RESET_PASSWORD' } });
  const confirmResetPassword = async () => ({ success: true });
  const confirmSignIn = async () => ({ isSignedIn: true });
  const hasRole = (role: string) => user?.role.toLowerCase() === role.toLowerCase();
  const hasPermission = (permission: string) => user?.permissions.includes(permission) || false;
  const checkSecurityLevel = async () => true;
  const refreshSession = async () => {};

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    error,
    mfaEnabled: user?.mfaEnabled || false,
    mfaRequired: false,
    securityLevel: user?.mfaEnabled ? 'high' : 'basic',
    signIn,
    signUp,
    confirmSignUp,
    signOut,
    logout,
    resetPassword,
    confirmResetPassword,
    confirmSignIn,
    hasRole,
    hasPermission,
    checkSecurityLevel,
    refreshSession
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;