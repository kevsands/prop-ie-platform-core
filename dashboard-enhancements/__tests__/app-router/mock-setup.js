// Mock setup file for auth flow tests

// Mock Next.js components and hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: jest.fn().mockReturnValue({
    get: jest.fn(),
  }),
}));

// Mock the AuthContext
jest.mock('@/context/AuthContext', () => ({
  useAuth: jest.fn().mockReturnValue({
    isAuthenticated: false,
    isLoading: false,
    signIn: jest.fn().mockResolvedValue({}),
    signUp: jest.fn().mockResolvedValue({}),
    error: null,
  }),
}));