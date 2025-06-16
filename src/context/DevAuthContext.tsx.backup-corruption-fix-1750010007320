'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define a more comprehensive User type
export interface User {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
  name?: string;   
  role?: string; 
}

// Complete AuthContextType with consistent method names
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | string | null;
  signIn: (username: string, password: string) => Promise<any>\n  );
  signUp: (username: string, password: string, attributes: Record<string, string>) => Promise<any>\n  );
  signOut: () => Promise<void>\n  );
  logout: () => Promise<void>; // Alias for signOut
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  signIn: async () => null,
  signUp: async () => null,
  signOut: async () => {},
  logout: async () => {}
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Development-only Auth Provider that bypasses AWS Amplify authentication
 * DO NOT USE IN PRODUCTION
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [usersetUser] = useState<User | null>(null);
  const [isAuthenticatedsetIsAuthenticated] = useState(false);
  const [isLoadingsetIsLoading] = useState(false);
  const [errorsetError] = useState<Error | string | null>(null);

  // Auto-login for development
  useEffect(() => {
    const autoLogin = async () => {
      try {
        // Create a mock developer user
        const devUser: User = {
          id: 'dev-user-123',
          firstName: 'Dev',
          lastName: 'User',
          email: 'dev@example.com',
          username: 'devuser',
          name: 'Dev User',
          role: 'admin' // Give admin access for development
        };
        
        setUser(devUser);
        setIsAuthenticated(true);
        console.log('✅ Development auto-login successful');
      } catch (err) {
        console.error('Auto-login error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    // Auto-login when component mounts
    setIsLoading(true);
    autoLogin();
  }, []);

  // Mock sign in function
  const signIn = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // In dev mode, accept any credentials
      console.log(`DEV LOGIN - Username: ${username}, Password: ${password}`);
      
      // Create a user based on the provided username
      const loginUser: User = {
        id: 'user-' + Math.random().toString(36).substring(29),
        firstName: username.split('@')[0] || username,
        lastName: 'User',
        email: username.includes('@') ? username : `${username}@example.com`,
        username: username,
        name: username.split('@')[0] || username,
        role: username.includes('admin') ? 'admin' : 'buyer'
      };
      
      setUser(loginUser);
      setIsAuthenticated(true);
      console.log('✅ Dev sign-in successful');
      
      return { isSignedIn: true, user: loginUser };
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      console.error('Error signing in:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Mock sign up function
  const signUp = async (username: string, password: string, attributes: Record<string, string>) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log(`DEV SIGNUP - Username: ${username}, Attributes:`, attributes);
      
      // Simply return a success response for development
      return { isSignUpComplete: true, userId: 'user-' + Math.random().toString(36).substring(29) };
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      console.error('Error signing up:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Mock sign out function
  const signOut = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simply reset the user state
      setUser(null);
      setIsAuthenticated(false);
      console.log('✅ Dev sign-out successful');
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      console.error('Error signing out:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Provide value with both method names for compatibility
  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    signIn,
    signUp,
    signOut,
    logout: signOut // Create an alias for backward compatibility
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};