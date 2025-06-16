'use client';

/**
 * Production-Ready Authentication Context for PROP.ie
 * 
 * Automatically switches between mock auth (development) and real AWS Cognito (production).
 * Designed for Irish property transactions with KYC compliance.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { cognitoAuth, PropertyBuyerUser, SignInResult } from '@/lib/amplify/cognito-real';

// Environment detection
const isProduction = process.env.NODE_ENV === 'production';
const hasRealCognito = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID && 
                      process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID !== 'us-east-1_TEMPORARY';
const useRealAuth = isProduction || hasRealCognito || process.env.FORCE_REAL_AUTH === 'true';

interface AuthContextType {
  user: PropertyBuyerUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | string | null;
  authMode: 'mock' | 'cognito';
  
  // Authentication methods
  signIn: (email: string, password: string) => Promise<SignInResult>;
  signUp: (params: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    userType: 'buyer' | 'developer' | 'agent' | 'solicitor' | 'investor';
  }) => Promise<any>;
  confirmSignUp: (email: string, code: string) => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<any>;
  confirmResetPassword: (email: string, code: string, newPassword: string) => Promise<any>;
  
  // Irish compliance methods
  updateKycStatus: (status: 'in_progress' | 'approved' | 'rejected') => Promise<any>;
  updatePpsNumber: (ppsNumber: string) => Promise<any>;
  
  // Utility methods
  hasRole: (role: string) => boolean;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a ProductionAuthProvider');
  }
  return context;
};

// Mock user for development
const createMockUser = (userType: string = 'buyer'): PropertyBuyerUser => ({
  userId: `mock-${userType}-${Date.now()}`,
  username: `mock.${userType}@prop.ie`,
  email: `mock.${userType}@prop.ie`,
  firstName: 'Mock',
  lastName: userType.charAt(0).toUpperCase() + userType.slice(1),
  phoneNumber: '+353871234567',
  ppsNumber: '1234567A', // Mock Irish PPS number
  userType: userType as any,
  kycStatus: 'approved', // Mock approved for easy testing
  roles: [userType],
  isEmailVerified: true,
  isPhoneVerified: true,
});

interface ProductionAuthProviderProps {
  children: ReactNode;
}

export const ProductionAuthProvider: React.FC<ProductionAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<PropertyBuyerUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | string | null>(null);

  // Determine auth mode
  const authMode = useRealAuth ? 'cognito' : 'mock';

  // Initialize authentication on mount
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        if (useRealAuth) {
          // Use real Cognito
          console.log('🔐 Using AWS Cognito authentication');
          const currentUser = await cognitoAuth.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            setIsAuthenticated(true);
          }
        } else {
          // Use mock authentication for development
          console.log('🔧 Using mock authentication (development mode)');
          const mockUser = createMockUser('buyer');
          setUser(mockUser);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError(err instanceof Error ? err : String(err));
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Sign In
  const signIn = async (email: string, password: string): Promise<SignInResult> => {
    setIsLoading(true);
    setError(null);

    try {
      if (useRealAuth) {
        const result = await cognitoAuth.signIn({ username: email, password });
        if (result.isSignedIn && result.user) {
          setUser(result.user);
          setIsAuthenticated(true);
          
          // Store token for session persistence
          if (result.user.accessToken && typeof window !== 'undefined') {
            localStorage.setItem('cognitoAccessToken', result.user.accessToken);
          }
        }
        return result;
      } else {
        // Mock sign in
        console.log('🔧 Mock sign in:', { email });
        const mockUser = createMockUser(email.includes('developer') ? 'developer' : 'buyer');
        setUser(mockUser);
        setIsAuthenticated(true);
        
        return {
          isSignedIn: true,
          user: mockUser,
        };
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign Up
  const signUp = async (params: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    userType: 'buyer' | 'developer' | 'agent' | 'solicitor' | 'investor';
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      if (useRealAuth) {
        return await cognitoAuth.signUp(params);
      } else {
        // Mock sign up
        console.log('🔧 Mock sign up:', params);
        return {
          isSignUpComplete: false,
          userId: `new-${params.userType}-${Date.now()}`,
          nextStep: {
            signUpStep: 'CONFIRM_SIGN_UP',
            codeDeliveryDetails: {
              destination: params.email,
              deliveryMedium: 'EMAIL' as const,
            },
          },
        };
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Confirm Sign Up
  const confirmSignUp = async (email: string, code: string) => {
    try {
      if (useRealAuth) {
        return await cognitoAuth.confirmSignUp(email, code);
      } else {
        console.log('🔧 Mock confirm sign up:', { email, code });
        return { isSignUpComplete: true };
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    }
  };

  // Sign Out
  const signOut = async () => {
    setIsLoading(true);
    try {
      if (useRealAuth) {
        await cognitoAuth.signOut();
      } else {
        console.log('🔧 Mock sign out');
      }
      
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Reset Password
  const resetPassword = async (email: string) => {
    try {
      if (useRealAuth) {
        return await cognitoAuth.resetPassword(email);
      } else {
        console.log('🔧 Mock reset password:', { email });
        return {
          nextStep: {
            resetPasswordStep: 'CONFIRM_RESET_PASSWORD',
            codeDeliveryDetails: {
              destination: email,
              deliveryMedium: 'EMAIL' as const,
            },
          },
        };
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    }
  };

  // Confirm Reset Password
  const confirmResetPassword = async (email: string, code: string, newPassword: string) => {
    try {
      if (useRealAuth) {
        return await cognitoAuth.confirmResetPassword(email, code, newPassword);
      } else {
        console.log('🔧 Mock confirm reset password:', { email, code });
        return { success: true };
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    }
  };

  // Update KYC Status (Irish compliance)
  const updateKycStatus = async (status: 'in_progress' | 'approved' | 'rejected') => {
    try {
      if (useRealAuth && user?.accessToken) {
        const result = await cognitoAuth.updateKycStatus(user.accessToken, status);
        // Update local user state
        if (user) {
          setUser({ ...user, kycStatus: status });
        }
        return result;
      } else {
        console.log('🔧 Mock update KYC status:', { status });
        if (user) {
          setUser({ ...user, kycStatus: status });
        }
        return { success: true };
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    }
  };

  // Update PPS Number (Irish compliance)
  const updatePpsNumber = async (ppsNumber: string) => {
    try {
      if (useRealAuth && user?.accessToken) {
        const result = await cognitoAuth.updatePpsNumber(user.accessToken, ppsNumber);
        // Update local user state
        if (user) {
          setUser({ ...user, ppsNumber });
        }
        return result;
      } else {
        console.log('🔧 Mock update PPS number:', { ppsNumber });
        if (user) {
          setUser({ ...user, ppsNumber });
        }
        return { success: true };
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    }
  };

  // Check if user has role
  const hasRole = (role: string): boolean => {
    return user?.roles.includes(role) || user?.userType === role || false;
  };

  // Refresh session
  const refreshSession = async () => {
    if (useRealAuth) {
      // Implement token refresh if needed
      console.log('🔄 Refreshing Cognito session');
    } else {
      console.log('🔧 Mock refresh session');
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    error,
    authMode,
    signIn,
    signUp,
    confirmSignUp,
    signOut,
    resetPassword,
    confirmResetPassword,
    updateKycStatus,
    updatePpsNumber,
    hasRole,
    refreshSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default ProductionAuthProvider;