/**
 * Custom type definitions for AWS Amplify Auth
 * Provides compatibility between our code and Amplify v6
 */

import { 
  SignInOutput, 
  SignUpOutput, 
  AuthTokens as AmplifyAuthTokens,
  AuthSignOutInput as AmplifySignOutInput,
  ConfirmSignUpOutput
} from 'aws-amplify/auth';

// Auth state enum
export enum AuthState {
  SignedIn = 'signedIn',
  SignedOut = 'signedOut',
  Loading = 'loading',
  Error = 'error'
}

// Enhanced AuthTokens with refreshToken
export interface AuthTokens extends AmplifyAuthTokens {
  refreshToken?: {
    toString(): string;
  };
}

// Custom SignIn parameters
export interface SignInParams {
  username: string;
  password: string;
}

// Enhanced SignIn result
export interface SignInResult {
  isSignedIn: boolean;
  nextStep?: {
    signInStep: 'CONFIRM_SIGN_UP' | 'CONFIRM_SIGN_IN' | 'RESET_PASSWORD' | 'MFA' | 'CUSTOM_CHALLENGE' | 'NEW_PASSWORD_REQUIRED' | 'DONE';
    codeDeliveryDetails?: {
      destination?: string;
      deliveryMedium?: 'EMAIL' | 'SMS' | 'PHONE';
      attributeName?: string;
    };
  };
  userId?: string; // Added for compatibility
}

// Custom SignUp parameters
export interface SignUpParams {
  username: string;
  password: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

// Extended SignUp result
export interface SignUpResult {
  isSignUpComplete: boolean;
  nextStep?: {
    signUpStep: 'CONFIRM_SIGN_UP' | 'COMPLETE_AUTO_SIGN_IN' | 'DONE';
    codeDeliveryDetails?: {
      destination?: string;
      deliveryMedium?: 'EMAIL' | 'SMS' | 'PHONE';
      attributeName?: string;
    };
  };
  userId?: string;
}

// Custom Reset Password result
export interface ResetPasswordResult {
  isPasswordReset: boolean;
  nextStep?: any;
}

// Enhanced SignOut input
export interface AuthSignOutInput extends Partial<AmplifySignOutInput> {
  global?: boolean;
}

// Authenticated user type
export interface AuthUser {
  userId: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  roles?: string[];
  accessToken?: string;
  refreshToken?: string;
  tokenExpiration?: number;
}

// Custom Auth error
export interface AuthError extends Error {
  code?: string;
  name: string;
  message: string;
  originalError?: any;
}