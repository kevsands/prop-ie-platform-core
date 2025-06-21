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

  // Check for stored auth on mount and validate with database
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedAuth = localStorage.getItem('authState');
        if (storedAuth) {
          const { user: storedUser, isAuthenticated: storedIsAuth, token } = JSON.parse(storedAuth);
          
          // Validate token with database
          if (token && storedIsAuth) {
            const validationResponse = await fetch('/api/auth/validate', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              }
            });

            if (validationResponse.ok) {
              const { user: validatedUser, isValid } = await validationResponse.json();
              if (isValid) {
                setUser(validatedUser);
                setIsAuthenticated(true);
              } else {
                // Token invalid, clear storage
                localStorage.removeItem('authState');
              }
            } else {
              // Token validation failed, clear storage
              localStorage.removeItem('authState');
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('authState');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Real authentication function with database integration
  const signIn = async (username: string, password: string): Promise<SignInResult> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Authenticate with backend API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Authentication failed');
      }

      const { user: authenticatedUser, token, requiresMFA, nextStep, expiresIn } = await response.json();

      // Handle MFA requirement
      if (requiresMFA) {
        return { 
          isSignedIn: false, 
          nextStep: { signInStep: nextStep || 'CONFIRM_SIGN_IN_WITH_SMS_CODE' } 
        };
      }
      
      // Successful login
      setUser(authenticatedUser);
      setIsAuthenticated(true);
      
      // Store auth state with token
      localStorage.setItem('authState', JSON.stringify({ 
        user: authenticatedUser, 
        isAuthenticated: true,
        token: token,
        expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      }));
      
      return { isSignedIn: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      
      // Fallback to mock authentication for development
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using fallback mock authentication:', errorMessage);
        return await mockSignIn(username, password);
      }
      
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Fallback mock authentication for development
  const mockSignIn = async (username: string, password: string): Promise<SignInResult> => {
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
    
    setUser(mockUser);
    setIsAuthenticated(true);
    
    // Store mock auth state
    localStorage.setItem('authState', JSON.stringify({ 
      user: mockUser, 
      isAuthenticated: true,
      token: 'mock-token',
      expiresAt: Date.now() + (24 * 60 * 60 * 1000)
    }));
    
    return { isSignedIn: true };
  };

  // Real sign out function with backend integration
  const signOut = async () => {
    setIsLoading(true);
    try {
      const storedAuth = localStorage.getItem('authState');
      let token = null;
      
      if (storedAuth) {
        const { token: storedToken } = JSON.parse(storedAuth);
        token = storedToken;
      }

      // Notify backend of logout
      if (token) {
        try {
          await fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
        } catch (error) {
          console.warn('Backend signout failed, proceeding with local cleanup:', error);
        }
      }

      // Clear local auth state
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('authState');
      
    } catch (err) {
      setError(err instanceof Error ? err : String(err));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = signOut; // Alias for signOut

  // Real sign up function with database integration
  const signUp = async (username: string, password: string, attributes: Record<string, string>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, attributes })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Sign up failed');
      }

      const result = await response.json();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      
      // Fallback for development
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using fallback mock signup:', errorMessage);
        return { isConfirmed: false, nextStep: { signUpStep: 'CONFIRM_SIGN_UP' } };
      }
      
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Real auth functions with database integration
  const confirmSignUp = async (username: string, code: string) => {
    try {
      const response = await fetch('/api/auth/confirm-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, code })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Confirmation failed');
      }

      return await response.json();
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        return { isConfirmed: true };
      }
      throw err;
    }
  };

  const resetPassword = async (username: string) => {
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Password reset failed');
      }

      return await response.json();
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        return { nextStep: { resetPasswordStep: 'CONFIRM_RESET_PASSWORD' } };
      }
      throw err;
    }
  };

  const confirmResetPassword = async (username: string, code: string, newPassword: string) => {
    try {
      const response = await fetch('/api/auth/confirm-reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, code, newPassword })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Password confirmation failed');
      }

      return await response.json();
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        return { success: true };
      }
      throw err;
    }
  };

  const confirmSignIn = async (challengeResponse: string) => {
    try {
      const response = await fetch('/api/auth/confirm-signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ challengeResponse })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'MFA confirmation failed');
      }

      const { user: authenticatedUser, token } = await response.json();
      
      setUser(authenticatedUser);
      setIsAuthenticated(true);
      
      localStorage.setItem('authState', JSON.stringify({ 
        user: authenticatedUser, 
        isAuthenticated: true,
        token: token,
        expiresAt: Date.now() + (24 * 60 * 60 * 1000)
      }));

      return { isSignedIn: true };
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        return { isSignedIn: true };
      }
      throw err;
    }
  };

  const hasRole = (role: string) => {
    if (!user) return false;
    return user.role.toLowerCase() === role.toLowerCase();
  };

  const hasPermission = (permission: string) => {
    if (!user) return false;
    return user.permissions.includes(permission) || user.permissions.includes('admin:all');
  };

  const checkSecurityLevel = async (requiredLevel: 'basic' | 'medium' | 'high') => {
    if (!user) return false;
    
    const currentLevel = user.mfaEnabled ? 'high' : 'basic';
    const levels = { 'basic': 1, 'medium': 2, 'high': 3 };
    
    return levels[currentLevel] >= levels[requiredLevel];
  };

  const refreshSession = async () => {
    try {
      const storedAuth = localStorage.getItem('authState');
      if (!storedAuth) return;

      const { token, expiresAt } = JSON.parse(storedAuth);
      
      // Check if token is close to expiring (within 1 hour)
      if (Date.now() >= expiresAt - (60 * 60 * 1000)) {
        const response = await fetch('/api/auth/refresh', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const { user: refreshedUser, token: newToken } = await response.json();
          
          setUser(refreshedUser);
          localStorage.setItem('authState', JSON.stringify({ 
            user: refreshedUser, 
            isAuthenticated: true,
            token: newToken,
            expiresAt: Date.now() + (24 * 60 * 60 * 1000)
          }));
        } else {
          // Token refresh failed, force logout
          await signOut();
        }
      }
    } catch (error) {
      console.error('Session refresh failed:', error);
      await signOut();
    }
  };

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