/**
 * AWS Amplify Authentication Type Definitions
 * 
 * This file defines types related to AWS Amplify Authentication (Cognito).
 */

import { AmplifyErrorResponse, AuthState } from './index';

/**
 * Represents the authenticated user in the application
 */
export interface AuthUser {
  /** Unique identifier for the user */
  userId: string;
  /** Username used for authentication */
  username: string;
  /** User's email address */
  email?: string;
  /** User's first name */
  firstName?: string;
  /** User's last name */
  lastName?: string;
  /** List of user's roles or groups */
  roles: string[];
  /** JWT access token */
  accessToken?: string;
  /** JWT refresh token */
  refreshToken?: string;
  /** Timestamp when the token expires (in seconds since epoch) */
  tokenExpiration?: number;
  /** Additional user attributes from Cognito */
  attributes?: Record<string, string>;
  /** Whether email is verified */
  emailVerified?: boolean;
  /** Whether phone number is verified */
  phoneVerified?: boolean;
  /** User's phone number */
  phoneNumber?: string;
  /** Last time the user signed in */
  lastSignInTime?: string;
  /** Creation time of the user */
  creationTime?: string;
}

/**
 * Parameters for signing in
 */
export interface SignInParams {
  /** Username or email for sign-in */
  username: string;
  /** User's password */
  password: string;
  /** Client metadata to pass to Cognito */
  clientMetadata?: Record<string, string>;
}

/**
 * Result from a sign-in operation
 */
export interface SignInResult {
  /** Whether the sign-in was successful */
  isSignedIn: boolean;
  /** Next step in the authentication flow, if any */
  nextStep?: {
    /** The type of challenge that needs to be completed */
    signInStep: 'CONFIRM_SIGN_IN' | 'RESET_PASSWORD' | 'CONFIRM_SIGN_UP' | 'MFA' | 'CUSTOM_CHALLENGE' | 'NEW_PASSWORD_REQUIRED';
    /** Additional details about the challenge */
    codeDeliveryDetails?: {
      /** Where the code was sent */
      destination?: string;
      /** Method of code delivery (EMAIL, SMS, etc.) */
      deliveryMedium?: 'EMAIL' | 'SMS' | 'PHONE';
      /** Attribute being verified */
      attributeName?: string;
    };
  };
  /** User ID if sign-in was successful */
  userId?: string;
}

/**
 * Parameters for signing up a new user
 */
export interface SignUpParams {
  /** Username for the new account */
  username: string;
  /** Password for the new account */
  password: string;
  /** Email address for the user */
  email: string;
  /** First name of the user */
  firstName?: string;
  /** Last name of the user */
  lastName?: string;
  /** Phone number of the user */
  phoneNumber?: string;
  /** Additional attributes to set on the user */
  attributes?: Record<string, string>;
  /** Whether to automatically sign in after sign-up is complete */
  autoSignIn?: boolean;
}

/**
 * Result from a sign-up operation
 */
export interface SignUpResult {
  /** Whether sign-up is fully completed */
  isSignUpComplete: boolean;
  /** Next step in the sign-up flow, if any */
  nextStep?: {
    /** The type of sign-up step to complete */
    signUpStep: 'CONFIRM_SIGN_UP' | 'COMPLETE_AUTO_SIGN_IN';
    /** Additional details about code delivery */
    codeDeliveryDetails?: {
      /** Where the code was sent */
      destination?: string;
      /** Method of code delivery (EMAIL, SMS, etc.) */
      deliveryMedium?: 'EMAIL' | 'SMS' | 'PHONE';
      /** Attribute being verified */
      attributeName?: string;
    };
  };
  /** User ID for the newly created user */
  userId?: string;
  /** Username for the newly created user */
  username?: string;
}

/**
 * Result from a password reset operation
 */
export interface ResetPasswordResult {
  /** Whether the password reset is complete */
  isPasswordReset: boolean;
  /** Next step in the password reset flow */
  nextStep: {
    /** The type of password reset step to complete */
    resetPasswordStep: 'CONFIRM_RESET_PASSWORD' | 'DONE';
    /** Additional details about code delivery */
    codeDeliveryDetails?: {
      /** Where the code was sent */
      destination?: string;
      /** Method of code delivery (EMAIL, SMS, etc.) */
      deliveryMedium?: 'EMAIL' | 'SMS' | 'PHONE';
      /** Attribute being verified */
      attributeName?: string;
    };
  };
}

/**
 * Auth tokens from a successful authentication
 */
export interface AuthTokens {
  /** JWT access token */
  accessToken: string;
  /** JWT ID token */
  idToken?: string;
  /** JWT refresh token */
  refreshToken?: string;
  /** Timestamp when the token expires (in seconds since epoch) */
  expiration: number;
}

/**
 * Auth session information
 */
export interface AuthSession {
  /** Auth tokens */
  tokens?: AuthTokens;
  /** User ID */
  userId?: string;
  /** Username */
  username?: string;
  /** Whether the user is authenticated */
  isAuthenticated: boolean;
}

/**
 * Multi-factor authentication settings
 */
export interface MFASettings {
  /** Whether MFA is enabled */
  enabled: boolean;
  /** Preferred MFA method */
  preferred?: 'TOTP' | 'SMS' | 'EMAIL';
  /** Available MFA methods */
  methods?: Array<'TOTP' | 'SMS' | 'EMAIL'>;
}

/**
 * Device information for remembered devices
 */
export interface DeviceInfo {
  /** Device ID from Cognito */
  deviceKey: string;
  /** Device name */
  deviceName?: string;
  /** When the device was last authenticated */
  lastAuthenticatedDate?: string;
  /** When the device was last modified */
  lastModifiedDate?: string;
  /** Additional device attributes */
  attributes?: Record<string, string>;
}

/**
 * Auth error types
 */
export interface AuthError extends AmplifyErrorResponse {
  /** Underlying error name */
  name: 
    | 'UserNotFoundException'
    | 'NotAuthorizedException'
    | 'UserNotConfirmedException'
    | 'PasswordResetRequiredException'
    | 'InvalidPasswordException'
    | 'LimitExceededException'
    | 'TooManyRequestsException'
    | 'InvalidParameterException'
    | 'MFAMethodNotFoundException'
    | 'SoftwareTokenMFANotFoundException'
    | 'UsernameExistsException'
    | 'ResourceNotFoundException'
    | 'CodeMismatchException'
    | 'ExpiredCodeException'
    | 'InternalErrorException';

  /** Error code */
  code: string;
  /** Error message */
  message: string;
}

/**
 * Configuration options for auth operations
 */
export interface AuthOptions {
  /** Whether to remember the device */
  rememberDevice?: boolean;
  /** Client metadata to pass to Cognito */
  clientMetadata?: Record<string, string>;
  /** Custom auth parameters */
  authParameters?: Record<string, string>;
  /** Custom auth flow type */
  authFlowType?: 'USER_SRP_AUTH' | 'CUSTOM_AUTH' | 'USER_PASSWORD_AUTH';
}