/**
 * Type definitions for Amplify Auth test mocks and helpers
 */

import { AuthUser, SignInResult, SignUpResult } from './auth';

// Type assertion helper for converting TestSignInResult to SignInResult
export declare function toSignInResult(result: TestSignInResult): SignInResult;

// Type assertion helper for converting TestSignUpResult to SignUpResult
export declare function toSignUpResult(result: TestSignUpResult): SignUpResult;

// Type assertion helper for converting TestAuthUser to AuthUser
export declare function toAuthUser(user: TestAuthUser): AuthUser;

// Extend the SignInResult type alias for tests
export interface TestSignInResult {
  isSignedIn: boolean;
  nextStep?: {
    signInStep: 'CONFIRM_SIGN_UP' | 'CONFIRM_SIGN_IN' | 'RESET_PASSWORD' | 'MFA' | 'CUSTOM_CHALLENGE' | 'NEW_PASSWORD_REQUIRED' | 'DONE';
    codeDeliveryDetails?: {
      destination?: string;
      deliveryMedium?: 'EMAIL' | 'SMS' | 'PHONE';
      attributeName?: string;
    };
  };
  userId?: string;
}

// Extend the SignUpResult type for tests
export interface TestSignUpResult {
  isSignUpComplete: boolean;
  nextStep: {,
  signUpStep: 'CONFIRM_SIGN_UP' | 'COMPLETE_AUTO_SIGN_IN' | 'DONE';
    codeDeliveryDetails?: {
      destination?: string;
      deliveryMedium?: 'EMAIL' | 'SMS' | 'PHONE';
      attributeName?: string;
    };
  };
  userId: string;
  username?: string;
}

// Mock auth user for testing
export interface TestAuthUser {
  userId: string;
  username: string;
  roles?: string[];
  email?: string;
  firstName?: string;
  lastName?: string;
  accessToken?: string;
  refreshToken?: string;
  tokenExpiration?: number;
}

// Storage mock type
export interface StorageMock {
  uploadData: jest.Mock;
  getItem: jest.Mock;
  setItem: jest.Mock;
  removeItem: jest.Mock;
  list: jest.Mock;
  copy: jest.Mock;
  remove: jest.Mock;
}