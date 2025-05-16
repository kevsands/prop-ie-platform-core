/**
 * Environment Configuration
 * 
 * This module provides a centralized way to access environment variables
 * with proper typing, default values, and validation.
 * 
 * USAGE:
 * - Import this file directly on both client and server
 * - Server-only keys will be undefined in client components
 * - Client-only values are safe to use in server components
 */

// Define all possible environments
type Environment = 'local' | 'development' | 'staging' | 'production';

// Define the structure of environment config
interface EnvironmentConfig {
  apiUrl: string;
  graphqlUrl: string;
  featureFlags: {
    enableAnalytics: boolean;
    showDebugTools: boolean;
    enableTotpMFA: boolean;
    enableSmsMFA: boolean;
    enableSessionFingerprinting: boolean;
    enableApiProtection: boolean;
    enableSecurityMonitoring: boolean;
    enablePerformanceMonitoring: boolean;
    enableAmplifyCache: boolean;
  };
  authConfig: {
    authority: string;
    clientId: string;
    region: string;
    userPoolId?: string;
    userPoolWebClientId?: string;
    identityPoolId?: string;
  };
  caching: {
    apiCacheTtl: number;  // in seconds
    dataCacheTtl: number; // in seconds
  };
}

// Define configuration for each environment
const ENVIRONMENT_CONFIGS: Record<Environment, EnvironmentConfig> = {
  local: {
    apiUrl: 'http://localhost:3000/api',
    graphqlUrl: 'http://localhost:3000/graphql',
    featureFlags: {
      enableAnalytics: false,
      showDebugTools: true,
      enableTotpMFA: process.env.NEXT_PUBLIC_FEATURE_ENABLE_TOTP_MFA !== 'false',
      enableSmsMFA: process.env.NEXT_PUBLIC_FEATURE_ENABLE_SMS_MFA !== 'false',
      enableSessionFingerprinting: true,
      enableApiProtection: true,
      enableSecurityMonitoring: true,
      enablePerformanceMonitoring: true,
      enableAmplifyCache: process.env.NEXT_PUBLIC_FEATURE_ENABLE_AMPLIFY_CACHE !== 'false',
    },
    authConfig: {
      authority: 'http://localhost:3000/auth',
      clientId: process.env.NEXT_PUBLIC_AUTH_CLIENT_ID || '74cb9eb7-d97a-4857-857a-de763959ebf4',
      region: process.env.NEXT_PUBLIC_AWS_REGION || 'eu-west-1',
      userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID,
      userPoolWebClientId: process.env.NEXT_PUBLIC_USER_POOL_WEB_CLIENT_ID,
      identityPoolId: process.env.NEXT_PUBLIC_IDENTITY_POOL_ID,
    },
    caching: {
      apiCacheTtl: 10,  // 10 seconds for local development
      dataCacheTtl: 30, // 30 seconds for local development
    }
  },
  development: {
    apiUrl: process.env.NEXT_PUBLIC_API_ENDPOINT || 'https://dev-api.prop-ie-app.com',
    graphqlUrl: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'https://dev-api.prop-ie-app.com/graphql',
    featureFlags: {
      enableAnalytics: true,
      showDebugTools: true,
      enableTotpMFA: process.env.NEXT_PUBLIC_FEATURE_ENABLE_TOTP_MFA !== 'false',
      enableSmsMFA: process.env.NEXT_PUBLIC_FEATURE_ENABLE_SMS_MFA !== 'false',
      enableSessionFingerprinting: true,
      enableApiProtection: true,
      enableSecurityMonitoring: true,
      enablePerformanceMonitoring: true,
      enableAmplifyCache: process.env.NEXT_PUBLIC_FEATURE_ENABLE_AMPLIFY_CACHE !== 'false',
    },
    authConfig: {
      authority: process.env.NEXT_PUBLIC_API_ENDPOINT || 'https://dev-api.prop-ie-app.com/auth',
      clientId: process.env.NEXT_PUBLIC_AUTH_CLIENT_ID || '74cb9eb7-d97a-4857-857a-de763959ebf4',
      region: process.env.NEXT_PUBLIC_AWS_REGION || 'eu-west-1',
      userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID,
      userPoolWebClientId: process.env.NEXT_PUBLIC_USER_POOL_WEB_CLIENT_ID,
      identityPoolId: process.env.NEXT_PUBLIC_IDENTITY_POOL_ID,
    },
    caching: {
      apiCacheTtl: 60,  // 1 minute
      dataCacheTtl: 300, // 5 minutes
    }
  },
  staging: {
    apiUrl: process.env.NEXT_PUBLIC_API_ENDPOINT || 'https://staging-api.prop-ie-app.com',
    graphqlUrl: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'https://staging-api.prop-ie-app.com/graphql',
    featureFlags: {
      enableAnalytics: true,
      showDebugTools: false,
      enableTotpMFA: true,
      enableSmsMFA: true,
      enableSessionFingerprinting: true,
      enableApiProtection: true,
      enableSecurityMonitoring: true,
      enablePerformanceMonitoring: true,
      enableAmplifyCache: true,
    },
    authConfig: {
      authority: process.env.NEXT_PUBLIC_API_ENDPOINT || 'https://staging-api.prop-ie-app.com/auth',
      clientId: process.env.NEXT_PUBLIC_AUTH_CLIENT_ID || '74cb9eb7-d97a-4857-857a-de763959ebf4',
      region: process.env.NEXT_PUBLIC_AWS_REGION || 'eu-west-1',
      userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID,
      userPoolWebClientId: process.env.NEXT_PUBLIC_USER_POOL_WEB_CLIENT_ID,
      identityPoolId: process.env.NEXT_PUBLIC_IDENTITY_POOL_ID,
    },
    caching: {
      apiCacheTtl: 300,  // 5 minutes
      dataCacheTtl: 600, // 10 minutes
    }
  },
  production: {
    apiUrl: process.env.NEXT_PUBLIC_API_ENDPOINT || 'https://api.prop-ie-app.com',
    graphqlUrl: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'https://api.prop-ie-app.com/graphql',
    featureFlags: {
      enableAnalytics: true,
      showDebugTools: false,
      enableTotpMFA: true,
      enableSmsMFA: true,
      enableSessionFingerprinting: true,
      enableApiProtection: true,
      enableSecurityMonitoring: true,
      enablePerformanceMonitoring: true,
      enableAmplifyCache: true,
    },
    authConfig: {
      authority: process.env.NEXT_PUBLIC_API_ENDPOINT || 'https://api.prop-ie-app.com/auth',
      clientId: process.env.NEXT_PUBLIC_AUTH_CLIENT_ID || '74cb9eb7-d97a-4857-857a-de763959ebf4',
      region: process.env.NEXT_PUBLIC_AWS_REGION || 'eu-west-1',
      userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID,
      userPoolWebClientId: process.env.NEXT_PUBLIC_USER_POOL_WEB_CLIENT_ID,
      identityPoolId: process.env.NEXT_PUBLIC_IDENTITY_POOL_ID,
    },
    caching: {
      apiCacheTtl: 600,  // 10 minutes
      dataCacheTtl: 1800, // 30 minutes
    }
  },
};

// Smart environment detection with override capability
function determineEnvironment(): Environment {
  // Allow explicit override via environment variable
  const envOverride = process.env.NEXT_PUBLIC_ENVIRONMENT as Environment;
  if (envOverride && ENVIRONMENT_CONFIGS[envOverride]) {
    return envOverride;
  }
  
  // Auto-detect based on URL in browser
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') return 'local';
    if (hostname.includes('dev-')) return 'development';
    if (hostname.includes('staging-')) return 'staging';
    if (hostname.includes('prop-ie-app.com')) return 'production';
  }
  
  // Server-side detection based on NODE_ENV and additional environment variables
  if (process.env.NODE_ENV === 'development') return 'local';
  if (process.env.NODE_ENV === 'production') {
    // Check for staging environment via a custom environment variable
    if (process.env.DEPLOYMENT_ENV === 'staging') return 'staging';
    return 'production';
  }
  
  // Default fallback
  return 'local';
}

// Determine current environment
const currentEnv = determineEnvironment();

// Export configuration for the current environment
export const env = ENVIRONMENT_CONFIGS[currentEnv];

// Export helper functions for environment checks
export const isLocal = currentEnv === 'local';
export const isDevelopment = currentEnv === 'development';
export const isStaging = currentEnv === 'staging';
export const isProduction = currentEnv === 'production';
export const isServerSide = typeof window === 'undefined';
export const isClientSide = !isServerSide;

// Type-safe config accessor
export function getConfig<K extends keyof EnvironmentConfig>(key: K): EnvironmentConfig[K] {
  return env[key];
}