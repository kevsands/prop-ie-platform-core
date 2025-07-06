'use client';

import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  status: string;
  lastActive?: string;
}

interface SessionState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export function useSession() {
  const [sessionState, setSessionState] = useState<SessionState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null
  });

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      setSessionState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await fetch('/api/auth/session', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setSessionState({
          user: data.user,
          isLoading: false,
          isAuthenticated: true,
          error: null
        });
      } else {
        setSessionState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
          error: 'Not authenticated'
        });
      }
    } catch (error) {
      console.error('Session check failed:', error);
      setSessionState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: 'Session check failed'
      });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setSessionState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSessionState({
          user: data.user,
          isLoading: false,
          isAuthenticated: true,
          error: null
        });
        return { success: true, user: data.user };
      } else {
        setSessionState(prev => ({
          ...prev,
          isLoading: false,
          error: data.error || 'Login failed'
        }));
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (error) {
      const errorMessage = 'Login request failed';
      setSessionState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    userRole: string;
    phoneNumber?: string;
  }) => {
    try {
      setSessionState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSessionState({
          user: data.user,
          isLoading: false,
          isAuthenticated: true,
          error: null
        });
        return { success: true, user: data.user, message: data.message };
      } else {
        setSessionState(prev => ({
          ...prev,
          isLoading: false,
          error: data.error || 'Registration failed'
        }));
        return { success: false, error: data.error || 'Registration failed' };
      }
    } catch (error) {
      const errorMessage = 'Registration request failed';
      setSessionState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      setSessionState(prev => ({ ...prev, isLoading: true }));

      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });

      // Always clear local state regardless of server response
      setSessionState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null
      });

      return { success: true };
    } catch (error) {
      // Still clear local state even if logout request fails
      setSessionState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null
      });
      return { success: true };
    }
  };

  const refreshSession = () => {
    checkSession();
  };

  const hasRole = (role: string): boolean => {
    return sessionState.user?.roles.includes(role) || false;
  };

  const hasAnyRole = (roles: string[]): boolean => {
    return roles.some(role => hasRole(role));
  };

  return {
    ...sessionState,
    login,
    register,
    logout,
    refreshSession,
    hasRole,
    hasAnyRole
  };
}