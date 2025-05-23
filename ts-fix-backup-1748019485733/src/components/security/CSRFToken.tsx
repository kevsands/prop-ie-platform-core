'use client';

import { useState, useEffect } from 'react';

interface CSRFTokenProps {
  fieldName?: string;
  tokenExpiry?: number; // in seconds
  onTokenGenerated?: (token: string) => void;
}

/**
 * Component that generates and renders a CSRF token input field
 * 
 * This component:
 * - Generates a cryptographically secure random token
 * - Creates a hidden input field with the token
 * - Automatically refreshes the token based on expiry time
 * - Can notify parent components when a new token is generated
 * 
 * @param props Component properties
 */
export default function CSRFToken({
  fieldName = 'csrf_token',
  tokenExpiry = 3600, // 1 hour default
  onTokenGenerated}: CSRFTokenProps) {
  const [tokensetToken] = useState<string>('');

  // Generate a cryptographically secure random token
  const generateToken = (): string => {
    if (typeof window === 'undefined') return '';

    // Generate random bytes and convert to hex string
    const randomBytes = new Uint8Array(32); // 256 bits
    window.crypto.getRandomValues(randomBytes);

    return Array.from(randomBytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };

  // Store the token in sessionStorage to maintain across page navigation
  const storeToken = (newToken: string) => {
    try {
      if (typeof window !== 'undefined') {
        // Store token with expiry time
        const expires = Date.now() + tokenExpiry * 1000;
        sessionStorage.setItem('csrf_token', newToken);
        sessionStorage.setItem('csrf_token_expiry', expires.toString());

        // Notify parent component if needed
        if (onTokenGenerated) {
          onTokenGenerated(newToken);
        }
      }
    } catch (error) {

    }
  };

  // Check if token exists and is valid, or generate a new one
  const getOrCreateToken = (): string => {
    try {
      if (typeof window !== 'undefined') {
        const storedToken = sessionStorage.getItem('csrf_token');
        const tokenExpiry = sessionStorage.getItem('csrf_token_expiry');

        // If token exists and is not expired, use it
        if (storedToken && tokenExpiry && parseInt(tokenExpiry) > Date.now()) {
          return storedToken;
        }

        // Otherwise generate a new token
        const newToken = generateToken();
        storeToken(newToken);
        return newToken;
      }
    } catch (error) {

    }

    // Fallback to generating a new token if any issues
    return generateToken();
  };

  useEffect(() => {
    // Initialize token on mount
    const newToken = getOrCreateToken();
    setToken(newToken);

    // Set up token refresh timer
    const refreshTimer = setInterval(() => {
      const newToken = getOrCreateToken();
      setToken(newToken);
    }, tokenExpiry * 1000 / 2); // Refresh halfway through expiry time

    return () => {
      clearInterval(refreshTimer);
    };
  }, [tokenExpiry]);

  // Render a hidden input field with the CSRF token
  return (
    <input 
      type="hidden" 
      name={fieldName} 
      value={token} 
      data-security="csrf-token"
    />
  );
}

/**
 * Hook to get the current CSRF token
 * 
 * @returns The current CSRF token or empty string if not available
 */
export function useCSRFToken(): string {
  if (typeof window === 'undefined') return '';

  try {
    const token = sessionStorage.getItem('csrf_token');
    const expiry = sessionStorage.getItem('csrf_token_expiry');

    if (token && expiry && parseInt(expiry) > Date.now()) {
      return token;
    }
  } catch (error) {

  }

  return '';
}

/**
 * Function to verify if a CSRF token is valid
 * 
 * @param token The token to verify
 * @returns True if the token is valid, false otherwise
 */
export function verifyCSRFToken(token: string): boolean {
  if (typeof window === 'undefined') return false;
  if (!token) return false;

  try {
    const storedToken = sessionStorage.getItem('csrf_token');
    return token === storedToken;
  } catch (error) {

    return false;
  }
}