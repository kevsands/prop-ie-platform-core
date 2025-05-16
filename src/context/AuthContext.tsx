'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

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

// Simplified auth provider with proper authentication flow
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | string | null>(null);

  // Check for stored auth on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem('authState');
    if (storedAuth) {
      const { user: storedUser, isAuthenticated: storedIsAuth } = JSON.parse(storedAuth);
      setUser(storedUser);
      setIsAuthenticated(storedIsAuth);
    }
    setIsLoading(false);
  }, []);

  // Mock login function with different user roles
  const signIn = async (username: string, password: string): Promise<SignInResult> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let mockUser: User | null = null;
      
      // Determine user role based on email domain or username
      if (username.includes('buyer') || username.includes('@buyer.com')) {
        mockUser = {
          id: 'buyer-001',
          username: username,
          email: username,
          name: 'Test Buyer',
          status: 'ACTIVE',
          role: 'buyer',
          permissions: ['view:properties', 'create:offers', 'manage:documents'],
          onboardingComplete: true,
          emailVerified: true,
          mfaEnabled: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      } else if (username.includes('developer') || username.includes('@developer.com')) {
        mockUser = {
          id: 'dev-001',
          username: username,
          email: username,
          name: 'Test Developer',
          status: 'ACTIVE',
          role: 'developer',
          permissions: ['manage:developments', 'view:analytics', 'manage:users'],
          onboardingComplete: true,
          emailVerified: true,
          mfaEnabled: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      } else if (username.includes('agent') || username.includes('@agent.com')) {
        mockUser = {
          id: 'agent-001',
          username: username,
          email: username,
          name: 'Test Agent',
          status: 'ACTIVE',
          role: 'agent',
          permissions: ['view:properties', 'manage:clients', 'create:offers'],
          onboardingComplete: true,
          emailVerified: true,
          mfaEnabled: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      } else if (username.includes('solicitor') || username.includes('@solicitor.com')) {
        mockUser = {
          id: 'solicitor-001',
          username: username,
          email: username,
          name: 'Test Solicitor',
          status: 'ACTIVE',
          role: 'solicitor',
          permissions: ['manage:documents', 'view:transactions', 'approve:sales'],
          onboardingComplete: true,
          emailVerified: true,
          mfaEnabled: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      } else if (username.includes('admin') || username.includes('@admin.com')) {
        mockUser = {
          id: 'admin-001',
          username: username,
          email: username,
          name: 'Test Admin',
          status: 'ACTIVE',
          role: 'admin',
          permissions: ['read:all', 'write:all', 'admin:all'],
          onboardingComplete: true,
          emailVerified: true,
          mfaEnabled: true,
          cognitoAttributes: {
            firstName: 'Admin',
            lastName: 'User',
            accessToken: 'admin-token'
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      } else {
        // Default user
        mockUser = {
          id: 'user-001',
          username: username,
          email: username,
          name: 'Test User',
          status: 'ACTIVE',
          role: 'user',
          permissions: ['view:properties'],
          onboardingComplete: true,
          emailVerified: true,
          mfaEnabled: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      }
      
      // Check for MFA requirement
      if (username === 'mfa@example.com') {
        return { 
          isSignedIn: false, 
          nextStep: { signInStep: 'CONFIRM_SIGN_IN_WITH_SMS_CODE' } 
        };
      }
      
      // Successful login
      setUser(mockUser);
      setIsAuthenticated(true);
      
      // Store auth state
      localStorage.setItem('authState', JSON.stringify({ user: mockUser, isAuthenticated: true }));
      
      return { isSignedIn: true };
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
      // Clear auth state
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('authState');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (err) {
      setError(err instanceof Error ? err : String(err));
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