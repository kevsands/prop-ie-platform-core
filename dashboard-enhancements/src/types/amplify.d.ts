/**
 * Type definitions for AWS Amplify v6
 * 
 * These type definitions provide proper TypeScript support for AWS Amplify v6+ modules.
 * Since Amplify v6 uses module federation pattern, we need to ensure compatibility with
 * both the main package and individual module imports.
 */

// Main AWS Amplify package
declare module 'aws-amplify' {
  export const Amplify: {
    configure: (config: Record<string, any>, options?: { ssr?: boolean }) => void;
  };
}

// Auth module
declare module 'aws-amplify/auth' {
  // Auth types
  export interface SignInInput {
    username: string;
    password: string;
    options?: Record<string, any>;
  }
  
  export interface SignUpInput {
    username: string;
    password: string;
    options?: {
      userAttributes?: Record<string, string>;
      autoSignIn?: boolean;
      [key: string]: any;
    };
  }
  
  export interface ConfirmSignUpInput {
    username: string;
    confirmationCode: string;
    options?: Record<string, any>;
  }
  
  export interface ConfirmSignInInput {
    challengeResponse: string;
    options?: Record<string, any>;
  }
  
  export interface ResetPasswordInput {
    username: string;
    options?: Record<string, any>;
  }
  
  export interface ConfirmResetPasswordInput {
    username: string;
    confirmationCode: string;
    newPassword: string;
    options?: Record<string, any>;
  }
  
  export interface SignInStepType {
    signInStep: 'CONFIRM_SIGN_UP' | 'MFA' | 'CONFIRM_SIGN_IN' | 'RESET_PASSWORD' | 'CUSTOM_CHALLENGE' | 'NEW_PASSWORD_REQUIRED';
    codeDeliveryDetails?: {
      destination?: string;
      deliveryMedium?: 'EMAIL' | 'SMS' | 'PHONE';
      attributeName?: string;
    };
  }
  
  export interface AuthUser {
    userId: string;
    username: string;
    signInDetails?: Record<string, any>;
  }
  
  export interface AuthUserAttributes {
    email?: string;
    given_name?: string;
    family_name?: string;
    'cognito:groups'?: string | string[];
    [key: string]: any;
  }
  
  export interface SignInOutput {
    isSignedIn: boolean;
    nextStep?: SignInStepType;
    userId?: string;
  }
  
  export interface SignUpOutput {
    isSignUpComplete: boolean;
    userId: string;
    nextStep?: {
      signUpStep: string;
    };
  }

  export interface AuthSession {
    tokens?: {
      accessToken?: {
        toString: () => string;
        payload: Record<string, any>;
      };
      idToken?: {
        toString: () => string;
      };
      refreshToken?: {
        toString: () => string;
      };
    };
  }
  
  // Auth functions
  export function fetchUserAttributes(): Promise<AuthUserAttributes>;
  export function getCurrentUser(): Promise<AuthUser>;
  export function signIn(input: SignInInput): Promise<SignInOutput>;
  export function signOut(options?: Record<string, any>): Promise<void>;
  export function signUp(input: SignUpInput): Promise<SignUpOutput>;
  export function confirmSignUp(input: ConfirmSignUpInput): Promise<any>;
  export function resetPassword(input: ResetPasswordInput): Promise<any>;
  export function confirmResetPassword(input: ConfirmResetPasswordInput): Promise<any>;
  export function confirmSignIn(input: ConfirmSignInInput): Promise<SignInOutput>;
  export function fetchAuthSession(): Promise<AuthSession>;
  export function autoSignIn(): Promise<SignInOutput>;
}

// API module
declare module 'aws-amplify/api' {
  export interface GraphQLOptions {
    query: string;
    variables?: Record<string, any>;
    authMode?: string;
    authToken?: string;
    [key: string]: any;
  }
  
  export interface GraphQLResult<T = any> {
    data?: T;
    errors?: Array<{
      message: string;
      path?: string[];
      locations?: { line: number; column: number }[];
    }>;
    extensions?: Record<string, any>;
  }
  
  export interface ApiClient {
    graphql: <T = any>(options: GraphQLOptions) => Promise<GraphQLResult<T>>;
    query: <T = any>(query: string, variables?: Record<string, any>) => Promise<GraphQLResult<T>>;
    mutate: <T = any>(mutation: string, variables?: Record<string, any>) => Promise<GraphQLResult<T>>;
  }
  
  export function generateClient(): ApiClient;
}

// Add other modules as needed (storage, analytics, etc.)