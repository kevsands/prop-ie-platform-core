/**
 * Authentication Test Utilities
 * 
 * These utilities help with testing components that require authentication
 * or have different behavior based on authentication state.
 */

import React, { ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';

// Mock any imports from the auth context
// This will need to be adjusted based on your actual auth implementation
const mockAuthContext = {
  AuthContext: {
    Provider: ({ children, value }: { children: ReactNode; value: any }) => (
      <div data-testid="auth-provider" data-auth-state={JSON.stringify(value)}>
        {children}
      </div>
    ),
  },
};

// Try to import the actual auth context, falling back to mock if not available
let AuthContext: any;
try {
  const importedContext = require('@/context/AuthContext');
  AuthContext = importedContext.AuthContext || mockAuthContext.AuthContext;
} catch (error) {
  AuthContext = mockAuthContext.AuthContext;
}

// Default authenticated user for testing
export const defaultAuthUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  role: 'USER', // You might want to parameterize this
};

// Interface for auth render options
interface AuthRenderOptions extends RenderOptions {
  isAuthenticated?: boolean;
  user?: typeof defaultAuthUser | null;
  authState?: Record<string, any>;
}

// Auth provider wrapper component
export const AuthProvider = ({ 
  children,
  isAuthenticated = true,
  user = defaultAuthUser,
  authState = {}
}: {
  children: ReactNode;
  isAuthenticated?: boolean;
  user?: typeof defaultAuthUser | null;
  authState?: Record<string, any>;
}) => {
  // Create a default auth value
  const defaultAuthValue = {
    isAuthenticated,
    user: isAuthenticated ? user : null,
    signIn: jest.fn().mockResolvedValue({ success: true }),
    signOut: jest.fn().mockResolvedValue({ success: true }),
    signUp: jest.fn().mockResolvedValue({ success: true }),
    loading: false,
    error: null,
    ...authState
  };

  return (
    <AuthContext.Provider value={defaultAuthValue}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Renders a component with authentication context
 * @param ui - Component to render
 * @param options - Render options including auth state
 */
export function renderWithAuth(
  ui: React.ReactElement,
  options: AuthRenderOptions = {}
) {
  const { 
    isAuthenticated = true,
    user = defaultAuthUser,
    authState = {},
    ...renderOptions 
  } = options;

  return render(
    <AuthProvider
      isAuthenticated={isAuthenticated}
      user={user}
      authState={authState}
    >
      {ui}
    </AuthProvider>,
    renderOptions
  );
}

/**
 * Renders the same component twice - once authenticated and once not
 * Useful for testing components with conditional rendering based on auth
 * @param ui - Component to render
 * @param options - Render options
 */
export function renderAuthComparison(
  ui: React.ReactElement,
  options: RenderOptions = {}
) {
  const authenticatedRender = renderWithAuth(ui, { 
    isAuthenticated: true,
    ...options,
    container: document.createElement('div')
  });
  
  const unauthenticatedRender = renderWithAuth(ui, { 
    isAuthenticated: false,
    ...options,
    container: document.createElement('div')
  });
  
  return {
    authenticatedRender,
    unauthenticatedRender
  };
}

// Helper for mocking protected routes
export const mockRouterPush = jest.fn();
export const mockRouterReplace = jest.fn();
export const mockRouterBack = jest.fn();

// Mock the next/router module
export const mockRouter = {
  useRouter: jest.fn().mockReturnValue({
    push: mockRouterPush,
    replace: mockRouterReplace,
    back: mockRouterBack,
    pathname: '/',
    query: {},
    asPath: '/',
    events: {
      on: jest.fn(),
      off: jest.fn()
    }
  }),
};

// Reset all router mocks
export function resetRouterMocks() {
  mockRouterPush.mockReset();
  mockRouterReplace.mockReset();
  mockRouterBack.mockReset();
  
  mockRouter.useRouter.mockReturnValue({
    push: mockRouterPush,
    replace: mockRouterReplace,
    back: mockRouterBack,
    pathname: '/',
    query: {},
    asPath: '/',
    events: {
      on: jest.fn(),
      off: jest.fn()
    }
  });
}

// Export all utilities
export {
  AuthContext,
  mockRouter
};