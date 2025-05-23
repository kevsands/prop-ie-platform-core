import { NextRequest } from 'next/server';
import { middleware } from '../middleware';

// Import NextResponse directly for proper typing
import { NextResponse } from 'next/server';

// Add jest-extended matchers for better type support
import 'jest-extended';

// Mock NextResponse for testing redirects and next() calls
jest.mock('next/server', () => ({
  NextResponse: {
    redirect: jest.fn().mockImplementation((url) => ({ url })),
    next: jest.fn().mockImplementation(() => ({ next: true }))}));

describe('Middleware', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should redirect unauthenticated users to login for protected routes', () => {
    // Setup
    const req = {
      url: 'https://example.com/dashboard',
      nextUrl: {
        pathname: '/dashboard',
        searchParams: new URLSearchParams(),
        href: 'https://example.com/dashboard'},
      cookies: {
        get: jest.fn().mockReturnValue(null), // No auth cookie
      } as unknown as NextRequest;
    
    // Execute
    middleware(req);
    
    // Assert with proper typing
    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.stringContaining('/login')
    );
  });

  it('should allow authenticated users to access protected routes', () => {
    // Setup
    const req = {
      url: 'https://example.com/dashboard',
      nextUrl: {
        pathname: '/dashboard',
        searchParams: new URLSearchParams(),
        href: 'https://example.com/dashboard'},
      cookies: {
        get: jest.fn().mockReturnValue({ value: 'valid-token' }), // Has auth cookie
      } as unknown as NextRequest;
    
    // Execute
    middleware(req);
    
    // Assert with proper typing
    expect(NextResponse.next).toHaveBeenCalled();
    expect(NextResponse.redirect).not.toHaveBeenCalled();
  });

  it('should preserve query parameters in redirect URLs', () => {
    // Setup
    const req = {
      url: 'https://example.com/dashboard/documents?filter=pending&sort=newest',
      nextUrl: {
        pathname: '/dashboard/documents',
        searchParams: new URLSearchParams('filter=pending&sort=newest'),
        href: 'https://example.com/dashboard/documents?filter=pending&sort=newest'},
      cookies: {
        get: jest.fn().mockReturnValue(null), // No auth cookie
      } as unknown as NextRequest;
    
    // Execute
    middleware(req);
    
    // Assert with proper typing
    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.stringMatching(/\/login\?callbackUrl=.*filter=pending.*sort=newest/)
    );
  });

  it('should allow public routes without authentication', () => {
    // Setup - create tests for various public routes
    const publicRoutes = [
      '/login',
      '/register',
      '/forgot-password',
      '/',
      '/properties',
      '/about',
      '/contact'];
    
    publicRoutes.forEach(route => {
      const req = {
        url: `https://example.com${route}`,
        nextUrl: {
          pathname: route,
          searchParams: new URLSearchParams(),
          href: `https://example.com${route}`},
        cookies: {
          get: jest.fn().mockReturnValue(null), // No auth cookie
        } as unknown as NextRequest;
      
      // Execute
      middleware(req);
      
      // Assert with proper typing
      expect(NextResponse.next).toHaveBeenCalled();
      expect(NextResponse.redirect).not.toHaveBeenCalled();
      
      // Reset mocks for next iteration
      jest.clearAllMocks();
    });
  });

  it('should redirect based on user role for role-protected routes', () => {
    // Setup - create a test for admin-only route with non-admin user
    const req = {
      url: 'https://example.com/admin/dashboard',
      nextUrl: {
        pathname: '/admin/dashboard',
        searchParams: new URLSearchParams(),
        href: 'https://example.com/admin/dashboard'},
      cookies: {
        get: jest.fn().mockImplementation((name) => {
          if (name === 'auth') return { value: 'valid-token' };
          if (name === 'role') return { value: 'buyer' }; // Non-admin role
          return null;
        })} as unknown as NextRequest;
    
    // Execute
    middleware(req);
    
    // Assert - should redirect to unauthorized or dashboard
    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.stringMatching(/\/unauthorized|\/dashboard/)
    );
  });
});