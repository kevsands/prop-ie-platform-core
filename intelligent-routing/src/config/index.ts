'use client';

/**
 * Unified Configuration System
 * 
 * This module provides a centralized configuration system for the application.
 * It handles environment detection, feature flags, and various service configurations.
 */

import awsExports from '@/aws-exports';
import { env } from './environment';
import { safeJsonParse } from '@/utils/safeJsonParser';

// AWS Region based on Amplify configuration
const AWS_REGION = awsExports.aws_project_region || process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1';

// User Pool details from Amplify configuration
const USER_POOL_ID = awsExports.aws_user_pools_id || process.env.NEXT_PUBLIC_USER_POOL_ID || 'us-east-1_XXXXXXXXX';
const USER_POOL_WEB_CLIENT_ID = awsExports.aws_user_pools_web_client_id || process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID || 'xxxxxxxxxxxxxxxxxxxxxxxxxx';

// S3 Bucket details from Amplify configuration
const S3_BUCKET = awsExports.Storage?.AWSS3?.bucket || process.env.NEXT_PUBLIC_S3_BUCKET || 'propieawsapp-storage-xxxxxxxx-dev';
const S3_REGION = awsExports.Storage?.AWSS3?.region || AWS_REGION;

// Environment types
export type Environment = 'local' | 'development' | 'staging' | 'production';

// Configuration schema
export interface AppConfig {
  environment: Environment;
  
  api: {
    endpoint: string;
    name: string;
    version: string;
    region: string;
  };
  
  auth: {
    cognito: {
      region: string;
      userPoolId: string;
      userPoolWebClientId: string;
      identityPoolId?: string;
    };
    token: {
      name: string;
      expiryThreshold: number; // in seconds
    };
    authority: string;
    clientId: string;
  };
  
  storage: {
    bucket: string;
    region: string;
  };
  
  appSync?: {
    endpoint: string;
    region: string;
    authenticationType: string;
    apiKey?: string;
  };
  
  features: {
    enableAnalytics: boolean;
    showDebugTools: boolean;
    enableRealTimeUpdates: boolean;
    enableOfflineMode: boolean;
  };
  
  aws: {
    region: string;
  };
}

// Environment-specific configurations
const ENVIRONMENT_CONFIGS: Record<Environment, Partial<AppConfig>> = {
  local: {
    api: {
      endpoint: env?.apiUrl || 'http://localhost:3000/api',
      name: 'PropAPI',
      version: 'v1',
      region: AWS_REGION,
    },
    features: {
      enableAnalytics: false,
      showDebugTools: true,
      enableRealTimeUpdates: false,
      enableOfflineMode: true,
    },
  },
  
  development: {
    api: {
      endpoint: env?.apiUrl || 'https://dev-api.prop.ie/api',
      name: 'PropAPI',
      version: 'v1',
      region: AWS_REGION,
    },
    features: {
      enableAnalytics: true,
      showDebugTools: true,
      enableRealTimeUpdates: true,
      enableOfflineMode: true,
    },
  },
  
  staging: {
    api: {
      endpoint: env?.apiUrl || 'https://staging-api.prop.ie/api',
      name: 'PropAPI',
      version: 'v1',
      region: AWS_REGION,
    },
    features: {
      enableAnalytics: true,
      showDebugTools: false,
      enableRealTimeUpdates: true,
      enableOfflineMode: true,
    },
  },
  
  production: {
    api: {
      endpoint: env?.apiUrl || 'https://prop-ie-backend-prod.eba-cnkmbqkm.eu-west-1.elasticbeanstalk.com/api',
      name: 'PropAPI',
      version: 'v1',
      region: AWS_REGION,
    },
    features: {
      enableAnalytics: true,
      showDebugTools: false,
      enableRealTimeUpdates: true,
      enableOfflineMode: false,
    },
  },
};

// Default configuration that applies to all environments
const DEFAULT_CONFIG: AppConfig = {
  environment: 'local',
  
  api: {
    endpoint: 'http://localhost:3000/api',
    name: 'PropAPI',
    version: 'v1',
    region: AWS_REGION,
  },
  
  auth: {
    cognito: {
      region: awsExports.aws_cognito_region || AWS_REGION,
      userPoolId: USER_POOL_ID,
      userPoolWebClientId: USER_POOL_WEB_CLIENT_ID,
      identityPoolId: awsExports.aws_cognito_identity_pool_id,
    },
    token: {
      name: 'auth_token',
      expiryThreshold: 300, // 5 minutes in seconds
    },
    authority: env?.authConfig?.authority || '',
    clientId: env?.authConfig?.clientId || USER_POOL_WEB_CLIENT_ID,
  },
  
  storage: {
    bucket: S3_BUCKET,
    region: S3_REGION,
  },
  
  appSync: awsExports.aws_appsync_graphqlEndpoint ? {
    endpoint: awsExports.aws_appsync_graphqlEndpoint,
    region: awsExports.aws_appsync_region || AWS_REGION,
    authenticationType: awsExports.aws_appsync_authenticationType || 'API_KEY',
    apiKey: awsExports.aws_appsync_apiKey,
  } : undefined,
  
  features: {
    enableAnalytics: env?.featureFlags?.enableAnalytics || false,
    showDebugTools: env?.featureFlags?.showDebugTools || false,
    enableRealTimeUpdates: false,
    enableOfflineMode: false,
  },
  
  aws: {
    region: AWS_REGION,
  },
};

/**
 * Determines the current environment based on various signals
 */
function determineEnvironment(): Environment {
  // Check for explicit environment override
  const envOverride = process.env.NEXT_PUBLIC_ENVIRONMENT as Environment;
  if (envOverride && ENVIRONMENT_CONFIGS[envOverride]) {
    return envOverride;
  }
  
  // Try to use environment.ts determination if available
  if (env) {
    const envMapping: Record<string, Environment> = {
      'http://localhost:3000': 'local',
      'https://dev-api.prop.ie': 'development',
      'https://staging-api.prop.ie': 'staging',
      'https://prop-ie-backend-prod.eba-cnkmbqkm.eu-west-1.elasticbeanstalk.com': 'production',
    };
    
    if (env.apiUrl && envMapping[env.apiUrl]) {
      return envMapping[env.apiUrl];
    }
  }
  
  // Browser environment detection
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') return 'local';
    if (hostname.includes('dev-')) return 'development';
    if (hostname.includes('staging-')) return 'staging';
    if (hostname.includes('prop.ie') || hostname.includes('eba-cnkmbqkm.eu-west-1.elasticbeanstalk.com')) return 'production';
  }
  
  // Server-side detection
  if (process.env.NODE_ENV === 'development') return 'local';
  if (process.env.NODE_ENV === 'production') return 'production';
  
  // Default fallback
  return 'local';
}

// Determine the current environment
const currentEnvironment = determineEnvironment();

/**
 * Helper function for deeply merging configuration objects
 */
function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target };
  
  for (const key in source) {
    if (source[key] === undefined) continue;
    
    if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
      // Cast to any to avoid strict type checking during recursion
      result[key] = deepMerge(
        (target[key] || {}) as Record<string, any>, 
        source[key] as Record<string, any>
      ) as any;
    } else {
      result[key] = source[key] as any;
    }
  }
  
  return result;
}

// Merge the default config with the environment-specific config
export const config: AppConfig = deepMerge(
  DEFAULT_CONFIG, 
  {
    environment: currentEnvironment,
    ...ENVIRONMENT_CONFIGS[currentEnvironment],
  }
);

/**
 * Helper to get a config value with proper type checking
 */
export function getConfig<K extends keyof AppConfig>(key: K): AppConfig[K] {
  return config[key];
}

// Load any local overrides from localStorage in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  try {
    const localConfigOverride = safeJsonParse(localStorage.getItem('dev_config_override') || '{}');
    if (localConfigOverride && typeof localConfigOverride === 'object') {
      console.log('🔧 Using local config overrides:', localConfigOverride);
      Object.assign(config, deepMerge(config, localConfigOverride));
    }
  } catch (error) {
    console.warn('Failed to parse local config override:', error);
  }
}

export default config;