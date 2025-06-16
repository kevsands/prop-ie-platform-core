/**
 * AWS Amplify Configuration Type Definitions
 * 
 * This file defines types related to AWS Amplify configuration.
 */

import { AWSRegion } from './index';

/**
 * Base AWS Amplify category configuration
 */
export interface CategoryConfig {
  /** Whether this category is disabled */
  disabled?: boolean;
}

/**
 * Auth configuration for AWS Amplify
 */
export interface AuthConfig extends CategoryConfig {
  /** Cognito configuration */
  Cognito?: {
    /** Cognito User Pool ID */
    userPoolId: string;
    /** Cognito User Pool client ID */
    userPoolClientId: string;
    /** Cognito Identity Pool ID (optional) */
    identityPoolId?: string;
    /** AWS region where Cognito resources are located */
    region?: AWSRegion;
    /** Configuration for login methods */
    loginWith?: {
      /** Enable email login */
      email?: boolean;
      /** Enable username login */
      username?: boolean;
      /** Enable phone number login */
      phone?: boolean;
      /** Enable social provider login */
      social?: boolean;
    };
    /** MFA configuration */
    mfa?: {
      /** Status of MFA */
      status?: 'OPTIONAL' | 'REQUIRED' | 'OFF';
      /** Available MFA methods */
      methods?: Array<'SMS' | 'TOTP'>
  );
    };
    /** OAuth configuration */
    oauth?: {
      /** Domain for OAuth flows */
      domain: string;
      /** Scopes to request */
      scopes: string[];
      /** Redirect sign-in URL */
      redirectSignIn: string[];
      /** Redirect sign-out URL */
      redirectSignOut: string[];
      /** Response type */
      responseType: 'code' | 'token';
      /** OAuth providers */
      providers?: Array<'GOOGLE' | 'FACEBOOK' | 'AMAZON' | 'APPLE'>
  );
    };
    /** Cookie storage configuration */
    cookieStorage?: {
      /** Cookie domain */
      domain: string;
      /** Cookie path */
      path: string;
      /** Cookie expiration in days */
      expires: number;
      /** Cookie security */
      secure: boolean;
    };
  };
}

/**
 * API configuration for AWS Amplify
 */
export interface ApiConfig extends CategoryConfig {
  /** REST API endpoints */
  REST?: Record<string, {
    /** API endpoint URL */
    endpoint: string;
    /** AWS region for the API */
    region?: AWSRegion;
    /** Custom headers to include with all requests */
    headers?: Record<string, string>
  );
  }>
  );
  /** GraphQL API endpoints */
  GraphQL?: {
    /** GraphQL endpoint URL */
    endpoint: string;
    /** AWS region for the API */
    region?: AWSRegion;
    /** API Key for API Key authentication mode */
    apiKey?: string;
    /** Default authentication mode */
    defaultAuthMode?: 'apiKey' | 'userPool' | 'iam' | 'oidc' | 'lambda';
    /** Custom headers to include with all requests */
    headers?: Record<string, string>
  );
  };
}

/**
 * Storage configuration for AWS Amplify
 */
export interface StorageConfig extends CategoryConfig {
  /** S3 configuration */
  S3?: {
    /** S3 bucket name */
    bucket: string;
    /** AWS region for the S3 bucket */
    region: AWSRegion;
    /** Whether to use accelerated endpoint */
    useAccelerateEndpoint?: boolean;
    /** Default access level for operations */
    defaultAccessLevel?: 'public' | 'protected' | 'private';
    /** Custom endpoint URL for S3 */
    customEndpoint?: string;
    /** Whether to force path-style addressing */
    forcePathStyle?: boolean;
  };
}

/**
 * Analytics configuration for AWS Amplify
 */
export interface AnalyticsConfig extends CategoryConfig {
  /** Pinpoint configuration */
  Pinpoint?: {
    /** Pinpoint application ID */
    appId: string;
    /** AWS region for Pinpoint */
    region: AWSRegion;
  };
}

/**
 * Complete AWS Amplify configuration
 */
export interface AmplifyConfig {
  /** Auth configuration */
  Auth?: AuthConfig;
  /** API configuration */
  API?: ApiConfig;
  /** Storage configuration */
  Storage?: StorageConfig;
  /** Analytics configuration */
  Analytics?: AnalyticsConfig;
  /** AWS region for all services (can be overridden by individual services) */
  region?: AWSRegion;
  /** Custom user agent string */
  userAgentDetails?: string;
  /** Cookie configuration */
  cookieStorage?: {
    /** Cookie domain */
    domain: string;
    /** Cookie path */
    path: string;
    /** Cookie expiration in days */
    expires: number;
    /** Cookie security */
    secure: boolean;
  };
}