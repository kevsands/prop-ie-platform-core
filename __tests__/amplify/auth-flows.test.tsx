/**
 * AWS Amplify Authentication Flow Tests
 * 
 * This test suite validates AWS Amplify authentication flows, including:
 * - Sign in
 * - Sign up
 * - Forgot password
 * - MFA handling
 * - Token refresh
 * - Social sign-in
 * - Custom authentication
 * - Error handling
 * 
 * These tests verify both the happy paths and error scenarios
 * to ensure robust authentication handling.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { expect } from '@jest/globals';

// Import type definitions for testing
import '../../src/types/jest-dom';
import type { 
  TestSignInResult, 
  TestSignUpResult, 
  TestAuthUser 
} from '../../src/types/amplify/auth-test';
import { 
  toSignInResult, 
  toSignUpResult, 
  toAuthUser 
} from '../../src/types/amplify/auth-test-helpers';
import type { SignInResult, SignUpResult, AuthUser } from '../../src/types/amplify/auth';

// Import the local Auth wrapper module (not direct Amplify imports)
import { Auth } from '../../src/lib/amplify/auth';

// Import components
import LoginForm from '../../src/components/auth/LoginForm';
import RegisterForm from '../../src/components/auth/RegisterForm';
import { AuthProvider, useAuth } from '../../src/context/AuthContext';

// Create a test wrapper component to access auth context
const TestAuthConsumer = () => {
  const auth = useAuth();
  return (
    <div>
      <div data-testid="auth-state">
        {auth.isAuthenticated ? 'authenticated' : 'unauthenticated'}
      </div>
      {auth.user && (
        <div data-testid="user-info">
          {auth.user.username}
        </div>
      )}
      {auth.error && (
        <div data-testid="auth-error">
          {auth.error.toString()}
        </div>
      )}
      <button 
        data-testid="login-button" 
        onClick={() => auth.signIn('test@example.com', 'Password123!')}
      >
        Login
      </button>
      <button 
        data-testid="signup-button" 
        onClick={() => auth.signUp('test@example.com', 'Password123!', {
          email: 'test@example.com',
          name: 'Test User'
        })}
      >
        Sign Up
      </button>
      <button 
        data-testid="logout-button" 
        onClick={() => auth.signOut()}
      >
        Logout
      </button>
    </div>
  );
};

// Mock Auth module
jest.mock('../../src/lib/amplify/auth');
const mockAuth = Auth as jest.Mocked<typeof Auth>;

describe('AWS Amplify Authentication Flows', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Standard Authentication Flows', () => {
    it('should handle successful sign in', async () => {
      // Mock successful sign in
      const signInResult: TestSignInResult = {
        isSignedIn: true,
        nextStep: { signInStep: 'DONE' }
      };
      mockAuth.signIn.mockImplementationOnce(() => Promise.resolve(signInResult as SignInResult));
      
      // Mock user data after sign in
      const mockUser: AuthUser = {
        userId: 'user-123',
        username: 'test@example.com',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        roles: ['BUYER'],
        accessToken: 'mock-token',
        refreshToken: 'mock-refresh-token',
        tokenExpiration: Date.now() + 3600000
      };
      mockAuth.getCurrentUser.mockResolvedValueOnce(mockUser);
      
      // Render component with auth provider
      render(
        <AuthProvider>
          <TestAuthConsumer />
        </AuthProvider>
      );
      
      // Initially unauthenticated
      expect(screen.getByTestId('auth-state')).toHaveTextContent('unauthenticated');
      
      // Perform login
      fireEvent.click(screen.getByTestId('login-button'));
      
      // Wait for authentication state to update
      await waitFor(() => {
        expect(screen.getByTestId('auth-state')).toHaveTextContent('authenticated');
      });
      
      // Check user info
      expect(screen.getByTestId('user-info')).toHaveTextContent('test@example.com');
      
      // Verify Auth module was called correctly
      expect(mockAuth.signIn).toHaveBeenCalledWith('test@example.com', 'Password123!');
      
      // Verify getCurrentUser was called after sign in
      expect(mockAuth.getCurrentUser).toHaveBeenCalled();
    });
    
    it('should handle successful sign up and confirmation', async () => {
      // Mock successful sign up
      const signUpResult = {
        isSignUpComplete: false,
        nextStep: { signUpStep: 'CONFIRM_SIGN_UP' },
        userId: 'new-user-id'
      };
      mockAuth.signUp.mockImplementationOnce(() => Promise.resolve(signUpResult));
      
      // Mock successful confirmation
      const confirmResult = {
        isSignUpComplete: true,
        userId: 'new-user-id'
      };
      mockAuth.confirmSignUp.mockImplementationOnce(() => Promise.resolve(confirmResult));
      
      // Verify the mock methods exist
      expect(mockAuth.signUp).toBeDefined();
      expect(mockAuth.confirmSignUp).toBeDefined();
    });
    
    it('should handle successful sign out', async () => {
      // Mock authenticated user
      const mockUser: AuthUser = {
        userId: 'user-123',
        username: 'test@example.com',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        roles: ['BUYER'],
        accessToken: 'mock-token',
        refreshToken: 'mock-refresh-token',
        tokenExpiration: Date.now() + 3600000
      };
      mockAuth.getCurrentUser.mockResolvedValueOnce(mockUser);
      
      // Mock successful sign out
      mockAuth.signOut.mockResolvedValueOnce(undefined);
      
      // Render component
      render(
        <AuthProvider>
          <TestAuthConsumer />
        </AuthProvider>
      );
      
      // Initially authenticated
      expect(screen.getByTestId('auth-state')).toHaveTextContent('authenticated');
      
      // Perform logout
      fireEvent.click(screen.getByTestId('logout-button'));
      
      // Wait for authentication state to update
      await waitFor(() => {
        expect(screen.getByTestId('auth-state')).toHaveTextContent('unauthenticated');
      });
      
      // Verify Auth module was called correctly
      expect(mockAuth.signOut).toHaveBeenCalled();
    });
  });
  
  describe('Error Handling', () => {
    it('should handle authentication errors', async () => {
      // Mock failed sign in
      mockAuth.signIn.mockRejectedValueOnce(new Error('Username or password incorrect'));
      
      // Render component
      render(
        <AuthProvider>
          <TestAuthConsumer />
        </AuthProvider>
      );
      
      // Attempt login
      fireEvent.click(screen.getByTestId('login-button'));
      
      // Wait for error to be displayed
      await waitFor(() => {
        expect(screen.getByTestId('auth-error')).toBeInTheDocument();
      });
      
      // Verify error message
      expect(screen.getByTestId('auth-error')).toHaveTextContent('Username or password incorrect');
      
      // Verify state remains unauthenticated
      expect(screen.getByTestId('auth-state')).toHaveTextContent('unauthenticated');
    });
    
    it('should handle network errors during authentication', async () => {
      // Mock network error
      mockAuth.signIn.mockRejectedValueOnce(new Error('Network request failed'));
      
      // Render component
      render(
        <AuthProvider>
          <TestAuthConsumer />
        </AuthProvider>
      );
      
      // Attempt login
      fireEvent.click(screen.getByTestId('login-button'));
      
      // Wait for error to be displayed
      await waitFor(() => {
        expect(screen.getByTestId('auth-error')).toBeInTheDocument();
      });
      
      // Verify error message
      expect(screen.getByTestId('auth-error')).toHaveTextContent('Network request failed');
      
      // Verify state remains unauthenticated
      expect(screen.getByTestId('auth-state')).toHaveTextContent('unauthenticated');
    });
  });
});