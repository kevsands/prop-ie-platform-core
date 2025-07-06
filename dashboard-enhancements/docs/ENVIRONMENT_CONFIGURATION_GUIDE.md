# Environment Configuration Guide

This guide provides detailed instructions for configuring the PropIE application across different deployment environments.

## Table of Contents

1. [Environment Overview](#environment-overview)
2. [Configuration Files](#configuration-files)
3. [Development Environment](#development-environment)
4. [Testing Environment](#testing-environment)
5. [Staging Environment](#staging-environment)
6. [Production Environment](#production-environment)
7. [Feature Flags](#feature-flags)
8. [Monitoring Configuration](#monitoring-configuration)
9. [Security Configuration](#security-configuration)
10. [Best Practices](#best-practices)

## Environment Overview

The PropIE application supports four distinct environments, each serving a specific purpose in the development lifecycle:

| Environment | Purpose | URL Pattern | Audience |
|-------------|---------|-------------|----------|
| Development | Active development and feature testing | `dev-*.propieapp.com` | Development team |
| Testing | QA and stakeholder testing | `test.propieapp.com` | QA team, internal stakeholders |
| Staging | Pre-production validation | `staging.propieapp.com` | Testing team, client stakeholders |
| Production | Live application | `app.propieapp.com` | End users |

## Configuration Files

The application uses the following configuration files for environment-specific settings:

### Environment Variables

Each environment requires a specific `.env` file:

- `.env.development` - Development environment configuration
- `.env.test` - Testing environment configuration
- `.env.staging` - Staging environment configuration
- `.env.production` - Production environment configuration

These files should NOT be committed to the repository. Instead, they should be:
- Used locally during development
- Stored securely in AWS Secrets Manager or similar service
- Loaded into deployment platforms (AWS Amplify, Vercel) as environment variables

### Configuration Schemas

A configuration schema is defined in `src/config/environment.ts` to enforce type safety:

```typescript
// src/config/environment.ts
export interface EnvironmentConfig {
  // AWS Configuration
  aws: {
    region: string;
    cognito: {
      userPoolId: string;
      userPoolWebClientId: string;
      identityPoolId?: string;
    };
    appsync: {
      graphqlEndpoint: string;
      apiKey?: string;
      region?: string;
    };
    s3: {
      bucket: string;
      region?: string;
    };
  };
  
  // API Configuration
  api: {
    endpoint: string;
    timeout: number;
  };
  
  // Feature Flags
  features: {
    enableDebugTools: boolean;
    enableMockData: boolean;
    enableExperimentalFeatures: boolean;
    enablePerformanceMonitoring: boolean;
    enableNewDashboard: boolean;
  };
  
  // Monitoring
  monitoring: {
    sentryDsn?: string;
    logLevel: 'debug' | 'info' | 'warn' | 'error';
    enableApiMetrics: boolean;
  };
  
  // Security
  security: {
    contentSecurityPolicy: string;
    enableStrictMode: boolean;
    enableCspReporting: boolean;
    cspReportUri?: string;
  };
}

// Default configuration
export const defaultConfig: EnvironmentConfig = {
  aws: {
    region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
    cognito: {
      userPoolId: process.env.NEXT_PUBLIC_AWS_USER_POOLS_ID || '',
      userPoolWebClientId: process.env.NEXT_PUBLIC_AWS_USER_POOLS_WEB_CLIENT_ID || '',
      identityPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_IDENTITY_POOL_ID,
    },
    appsync: {
      graphqlEndpoint: process.env.NEXT_PUBLIC_APPSYNC_GRAPHQL_ENDPOINT || '',
      apiKey: process.env.NEXT_PUBLIC_API_KEY,
      region: process.env.NEXT_PUBLIC_AWS_REGION,
    },
    s3: {
      bucket: process.env.NEXT_PUBLIC_S3_BUCKET || '',
      region: process.env.NEXT_PUBLIC_AWS_REGION,
    },
  },
  api: {
    endpoint: process.env.NEXT_PUBLIC_API_ENDPOINT || '',
    timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000', 10),
  },
  features: {
    enableDebugTools: process.env.NEXT_PUBLIC_ENABLE_DEBUG_TOOLS === 'true',
    enableMockData: process.env.NEXT_PUBLIC_ENABLE_MOCK_DATA === 'true',
    enableExperimentalFeatures: process.env.NEXT_PUBLIC_ENABLE_EXPERIMENTAL_FEATURES === 'true',
    enablePerformanceMonitoring: process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING === 'true',
    enableNewDashboard: process.env.NEXT_PUBLIC_ENABLE_NEW_DASHBOARD === 'true',
  },
  monitoring: {
    sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    logLevel: (process.env.NEXT_PUBLIC_LOG_LEVEL || 'info') as 'debug' | 'info' | 'warn' | 'error',
    enableApiMetrics: process.env.NEXT_PUBLIC_ENABLE_API_METRICS === 'true',
  },
  security: {
    contentSecurityPolicy: process.env.NEXT_PUBLIC_CONTENT_SECURITY_POLICY || "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
    enableStrictMode: process.env.NEXT_PUBLIC_ENABLE_STRICT_MODE === 'true',
    enableCspReporting: process.env.NEXT_PUBLIC_ENABLE_CSP_REPORTING === 'true',
    cspReportUri: process.env.NEXT_PUBLIC_CSP_REPORT_URI,
  },
};

// Get current environment
const getEnvironment = (): 'development' | 'test' | 'staging' | 'production' => {
  const env = process.env.NEXT_PUBLIC_ENVIRONMENT || process.env.NODE_ENV;
  
  switch (env) {
    case 'production':
      return 'production';
    case 'staging':
      return 'staging';
    case 'test':
      return 'test';
    default:
      return 'development';
  }
};

// Get environment-specific configuration
export const getConfig = (): EnvironmentConfig => {
  const env = getEnvironment();
  
  // Load environment-specific configuration
  let envConfig: Partial<EnvironmentConfig> = {};
  
  switch (env) {
    case 'production':
      envConfig = {
        features: {
          ...defaultConfig.features,
          enableDebugTools: false,
          enableMockData: false,
        },
        monitoring: {
          ...defaultConfig.monitoring,
          logLevel: 'error',
          enableApiMetrics: true,
        },
        security: {
          ...defaultConfig.security,
          enableStrictMode: true,
        },
      };
      break;
    case 'staging':
      envConfig = {
        features: {
          ...defaultConfig.features,
          enableDebugTools: false,
          enableMockData: false,
        },
        monitoring: {
          ...defaultConfig.monitoring,
          logLevel: 'warn',
          enableApiMetrics: true,
        },
      };
      break;
    case 'test':
      envConfig = {
        features: {
          ...defaultConfig.features,
          enableDebugTools: true,
          enableMockData: false,
        },
        monitoring: {
          ...defaultConfig.monitoring,
          logLevel: 'info',
        },
      };
      break;
    default: // development
      envConfig = {
        features: {
          ...defaultConfig.features,
          enableDebugTools: true,
          enableMockData: true,
        },
        monitoring: {
          ...defaultConfig.monitoring,
          logLevel: 'debug',
        },
      };
  }
  
  // Merge default and environment-specific configs
  return {
    ...defaultConfig,
    ...envConfig,
    aws: {
      ...defaultConfig.aws,
      ...(envConfig.aws || {}),
    },
    api: {
      ...defaultConfig.api,
      ...(envConfig.api || {}),
    },
    features: {
      ...defaultConfig.features,
      ...(envConfig.features || {}),
    },
    monitoring: {
      ...defaultConfig.monitoring,
      ...(envConfig.monitoring || {}),
    },
    security: {
      ...defaultConfig.security,
      ...(envConfig.security || {}),
    },
  };
};

// Export the configuration
const config = getConfig();
export default config;
```

## Development Environment

The development environment configuration focuses on developer productivity and debugging tools.

### Environment Variables (.env.development)

```
# AWS Configuration
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_AWS_USER_POOLS_ID=us-east-1_DevUserPool
NEXT_PUBLIC_AWS_USER_POOLS_WEB_CLIENT_ID=dev-client-id-12345
NEXT_PUBLIC_AWS_COGNITO_IDENTITY_POOL_ID=us-east-1:dev-identity-pool
NEXT_PUBLIC_APPSYNC_GRAPHQL_ENDPOINT=https://dev-graphql-endpoint.appsync-api.us-east-1.amazonaws.com/graphql
NEXT_PUBLIC_API_KEY=dev-api-key-12345
NEXT_PUBLIC_S3_BUCKET=propieawsapp-storage-dev-12345

# API Configuration
NEXT_PUBLIC_API_ENDPOINT=https://api.dev.propieapp.com
NEXT_PUBLIC_API_TIMEOUT=30000

# Feature Flags
NEXT_PUBLIC_ENABLE_DEBUG_TOOLS=true
NEXT_PUBLIC_ENABLE_MOCK_DATA=true
NEXT_PUBLIC_ENABLE_EXPERIMENTAL_FEATURES=true
NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING=false
NEXT_PUBLIC_ENABLE_NEW_DASHBOARD=true

# Monitoring
NEXT_PUBLIC_LOG_LEVEL=debug
NEXT_PUBLIC_ENABLE_API_METRICS=false

# Security
NEXT_PUBLIC_ENABLE_STRICT_MODE=false
NEXT_PUBLIC_ENABLE_CSP_REPORTING=false

# Environment
NEXT_PUBLIC_ENVIRONMENT=development
```

### Development-specific AWS Resources

For the development environment, use dedicated AWS resources:

- **Cognito User Pool**: Development-specific user pool
- **AppSync API**: Development GraphQL API with sandbox mode enabled
- **S3 Bucket**: Development storage bucket with relaxed CORS settings
- **API Gateway**: Development REST API endpoints

### Local Development Tools

Enable development-specific tools:

- React Developer Tools
- React Query DevTools
- Mock Service Worker for API mocking
- Hot module replacement for faster development

## Testing Environment

The testing environment is designed for QA testing and demonstrations to stakeholders.

### Environment Variables (.env.test)

```
# AWS Configuration
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_AWS_USER_POOLS_ID=us-east-1_TestUserPool
NEXT_PUBLIC_AWS_USER_POOLS_WEB_CLIENT_ID=test-client-id-12345
NEXT_PUBLIC_AWS_COGNITO_IDENTITY_POOL_ID=us-east-1:test-identity-pool
NEXT_PUBLIC_APPSYNC_GRAPHQL_ENDPOINT=https://test-graphql-endpoint.appsync-api.us-east-1.amazonaws.com/graphql
NEXT_PUBLIC_API_KEY=test-api-key-12345
NEXT_PUBLIC_S3_BUCKET=propieawsapp-storage-test-12345

# API Configuration
NEXT_PUBLIC_API_ENDPOINT=https://api.test.propieapp.com
NEXT_PUBLIC_API_TIMEOUT=15000

# Feature Flags
NEXT_PUBLIC_ENABLE_DEBUG_TOOLS=true
NEXT_PUBLIC_ENABLE_MOCK_DATA=false
NEXT_PUBLIC_ENABLE_EXPERIMENTAL_FEATURES=true
NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING=true
NEXT_PUBLIC_ENABLE_NEW_DASHBOARD=true

# Testing-specific configuration
NEXT_PUBLIC_TEST_USER_EMAIL=test@example.com
NEXT_PUBLIC_TEST_USER_PASSWORD=TestPassword123

# Monitoring
NEXT_PUBLIC_LOG_LEVEL=info
NEXT_PUBLIC_ENABLE_API_METRICS=true

# Security
NEXT_PUBLIC_ENABLE_STRICT_MODE=false
NEXT_PUBLIC_ENABLE_CSP_REPORTING=true
NEXT_PUBLIC_CSP_REPORT_URI=https://csp-report.test.propieapp.com/report

# Environment
NEXT_PUBLIC_ENVIRONMENT=test
```

### Testing-specific Features

- **Seed Data**: Pre-populated test data for consistent testing
- **Test Users**: Pre-created user accounts with different roles
- **Test Harness**: Test scripts for automated feature testing
- **API Mocking**: Selective API mocking for testing edge cases

## Staging Environment

The staging environment mirrors the production environment as closely as possible for final validation before release.

### Environment Variables (.env.staging)

```
# AWS Configuration
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_AWS_USER_POOLS_ID=us-east-1_StagingUserPool
NEXT_PUBLIC_AWS_USER_POOLS_WEB_CLIENT_ID=staging-client-id-12345
NEXT_PUBLIC_AWS_COGNITO_IDENTITY_POOL_ID=us-east-1:staging-identity-pool
NEXT_PUBLIC_APPSYNC_GRAPHQL_ENDPOINT=https://staging-graphql-endpoint.appsync-api.us-east-1.amazonaws.com/graphql
NEXT_PUBLIC_API_KEY=staging-api-key-12345
NEXT_PUBLIC_S3_BUCKET=propieawsapp-storage-staging-12345

# API Configuration
NEXT_PUBLIC_API_ENDPOINT=https://api.staging.propieapp.com
NEXT_PUBLIC_API_TIMEOUT=10000

# Feature Flags
NEXT_PUBLIC_ENABLE_DEBUG_TOOLS=false
NEXT_PUBLIC_ENABLE_MOCK_DATA=false
NEXT_PUBLIC_ENABLE_EXPERIMENTAL_FEATURES=false
NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING=true
NEXT_PUBLIC_ENABLE_NEW_DASHBOARD=true

# Monitoring
NEXT_PUBLIC_SENTRY_DSN=https://staging-sentry-key.ingest.sentry.io/12345
NEXT_PUBLIC_LOG_LEVEL=warn
NEXT_PUBLIC_ENABLE_API_METRICS=true

# Security
NEXT_PUBLIC_CONTENT_SECURITY_POLICY="default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data: https://staging-media.propieapp.com;"
NEXT_PUBLIC_ENABLE_STRICT_MODE=true
NEXT_PUBLIC_ENABLE_CSP_REPORTING=true
NEXT_PUBLIC_CSP_REPORT_URI=https://csp-report.staging.propieapp.com/report

# Environment
NEXT_PUBLIC_ENVIRONMENT=staging
```

### Staging-specific Features

- **Production-like Data**: Anonymized copy of production data
- **Performance Monitoring**: Full monitoring infrastructure
- **Feature Parity**: All features enabled that will be in production
- **Security Scanning**: Regular security scanning and penetration testing

## Production Environment

The production environment is optimized for performance, security, and reliability.

### Environment Variables (.env.production)

```
# AWS Configuration
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_AWS_USER_POOLS_ID=us-east-1_ProdUserPool
NEXT_PUBLIC_AWS_USER_POOLS_WEB_CLIENT_ID=prod-client-id-12345
NEXT_PUBLIC_AWS_COGNITO_IDENTITY_POOL_ID=us-east-1:prod-identity-pool
NEXT_PUBLIC_APPSYNC_GRAPHQL_ENDPOINT=https://prod-graphql-endpoint.appsync-api.us-east-1.amazonaws.com/graphql
NEXT_PUBLIC_API_KEY=prod-api-key-12345
NEXT_PUBLIC_S3_BUCKET=propieawsapp-storage-prod-12345

# API Configuration
NEXT_PUBLIC_API_ENDPOINT=https://api.propieapp.com
NEXT_PUBLIC_API_TIMEOUT=10000

# Feature Flags
NEXT_PUBLIC_ENABLE_DEBUG_TOOLS=false
NEXT_PUBLIC_ENABLE_MOCK_DATA=false
NEXT_PUBLIC_ENABLE_EXPERIMENTAL_FEATURES=false
NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING=true
NEXT_PUBLIC_ENABLE_NEW_DASHBOARD=true

# Monitoring
NEXT_PUBLIC_SENTRY_DSN=https://production-sentry-key.ingest.sentry.io/12345
NEXT_PUBLIC_LOG_LEVEL=error
NEXT_PUBLIC_ENABLE_API_METRICS=true

# Security
NEXT_PUBLIC_CONTENT_SECURITY_POLICY="default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data: https://media.propieapp.com;"
NEXT_PUBLIC_ENABLE_STRICT_MODE=true
NEXT_PUBLIC_ENABLE_CSP_REPORTING=true
NEXT_PUBLIC_CSP_REPORT_URI=https://csp-report.propieapp.com/report

# Environment
NEXT_PUBLIC_ENVIRONMENT=production
```

### Production-specific Features

- **CDN Integration**: CloudFront distribution for static assets
- **Enhanced Security**: Strict security policies and regular rotation of API keys
- **Disaster Recovery**: Automated backup and restore procedures
- **Scalability**: Auto-scaling configuration for handling traffic spikes
- **Monitoring**: Comprehensive monitoring and alerting

## Feature Flags

Feature flags allow for controlled enabling and disabling of features across environments. The application uses a central feature flag service in `src/lib/features/featureFlags.ts`:

```typescript
// src/lib/features/featureFlags.ts
import config from '@/config/environment';

export interface FeatureFlags {
  enableDebugTools: boolean;
  enableMockData: boolean;
  enableExperimentalFeatures: boolean;
  enablePerformanceMonitoring: boolean;
  enableNewDashboard: boolean;
  [key: string]: boolean;
}

// Default feature flags based on environment configuration
const defaultFlags: FeatureFlags = {
  enableDebugTools: config.features.enableDebugTools,
  enableMockData: config.features.enableMockData,
  enableExperimentalFeatures: config.features.enableExperimentalFeatures,
  enablePerformanceMonitoring: config.features.enablePerformanceMonitoring,
  enableNewDashboard: config.features.enableNewDashboard,
};

// Override flags from local storage in development
const loadOverrides = (): Partial<FeatureFlags> => {
  if (typeof window === 'undefined') {
    return {};
  }
  
  try {
    const overrides = localStorage.getItem('feature-flags');
    return overrides ? JSON.parse(overrides) : {};
  } catch (error) {
    console.error('Error loading feature flag overrides:', error);
    return {};
  }
};

// Save overrides to local storage
export const saveOverrides = (overrides: Partial<FeatureFlags>): void => {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    localStorage.setItem('feature-flags', JSON.stringify(overrides));
  } catch (error) {
    console.error('Error saving feature flag overrides:', error);
  }
};

// Get feature flags with overrides applied
export const getFeatureFlags = (): FeatureFlags => {
  const overrides = config.features.enableDebugTools ? loadOverrides() : {};
  
  return {
    ...defaultFlags,
    ...overrides,
  };
};

// Check if a feature is enabled
export const isFeatureEnabled = (featureName: keyof FeatureFlags): boolean => {
  const flags = getFeatureFlags();
  return !!flags[featureName];
};

// Feature flag hook for React components
export const useFeatureFlag = (featureName: keyof FeatureFlags): boolean => {
  const flags = getFeatureFlags();
  return !!flags[featureName];
};
```

## Monitoring Configuration

Configure monitoring differently for each environment:

### Development Monitoring

```typescript
// src/lib/monitoring/development.ts
import config from '@/config/environment';

export const initializeMonitoring = () => {
  // Simple console-based monitoring for development
  console.log('Development monitoring initialized');
  
  // Only capture errors and warnings
  console.error = (originalError => {
    return (...args) => {
      // Log to console
      originalError.apply(console, args);
      
      // Optionally log to local storage for persistence
      const errors = JSON.parse(localStorage.getItem('dev-errors') || '[]');
      errors.push({
        timestamp: new Date().toISOString(),
        args: args.map(arg => String(arg)),
      });
      localStorage.setItem('dev-errors', JSON.stringify(errors.slice(-50))); // Keep last 50 errors
    };
  })(console.error);
};
```

### Production Monitoring

```typescript
// src/lib/monitoring/production.ts
import * as Sentry from '@sentry/nextjs';
import config from '@/config/environment';

export const initializeMonitoring = () => {
  // Initialize Sentry for error tracking
  if (config.monitoring.sentryDsn) {
    Sentry.init({
      dsn: config.monitoring.sentryDsn,
      environment: config.NEXT_PUBLIC_ENVIRONMENT,
      tracesSampleRate: 0.1, // Sample 10% of transactions
      integrations: [
        new Sentry.BrowserTracing(),
        new Sentry.Replay({
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],
    });
  }
  
  // Initialize performance monitoring
  if (config.features.enablePerformanceMonitoring) {
    // Web Vitals tracking
    const reportWebVitals = ({ id, name, label, value }) => {
      // Log to monitoring service
      console.log(`Web Vital: ${name} (${id}) - ${value}`);
      
      // Send to analytics
      window.gtag?.('event', name, {
        event_category: 'Web Vitals',
        event_label: label,
        value: Math.round(value),
        non_interaction: true,
      });
    };
    
    // API performance tracking
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const startTime = performance.now();
      
      try {
        const response = await originalFetch(...args);
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        // Log API performance
        if (args[0] && typeof args[0] === 'string' && 
            (args[0].includes('/api/') || args[0].includes('graphql'))) {
          console.log(`API Request to ${args[0]} took ${duration.toFixed(2)}ms`);
          
          // Send to monitoring
          if (config.monitoring.enableApiMetrics) {
            window.gtag?.('event', 'api_request', {
              event_category: 'API Performance',
              event_label: args[0].toString(),
              value: Math.round(duration),
            });
          }
        }
        
        return response;
      } catch (error) {
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        // Log API error
        console.error(`API Request to ${args[0]} failed after ${duration.toFixed(2)}ms:`, error);
        
        // Send to monitoring
        Sentry.captureException(error, {
          extra: {
            url: args[0]?.toString(),
            duration,
          },
        });
        
        throw error;
      }
    };
  }
};
```

## Security Configuration

Configure security settings differently for each environment:

### Content Security Policy

For each environment, configure an appropriate Content Security Policy:

```typescript
// Content Security Policy configuration
const getContentSecurityPolicy = (env: string): string => {
  const basePolicy = {
    'default-src': ["'self'"],
    'script-src': ["'self'"],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:'],
    'font-src': ["'self'"],
    'connect-src': ["'self'"],
    'frame-src': ["'self'"],
  };
  
  switch (env) {
    case 'production':
      // Strict production policy
      return generateCspString({
        ...basePolicy,
        'connect-src': [
          ...basePolicy['connect-src'],
          'https://cognito-idp.us-east-1.amazonaws.com',
          'https://api.propieapp.com',
          'https://prod-graphql-endpoint.appsync-api.us-east-1.amazonaws.com',
        ],
        'img-src': [
          ...basePolicy['img-src'],
          'https://media.propieapp.com',
        ],
      });
      
    case 'staging':
      // Staging policy (slightly more permissive)
      return generateCspString({
        ...basePolicy,
        'script-src': [...basePolicy['script-src'], "'unsafe-eval'"], // For easier debugging
        'connect-src': [
          ...basePolicy['connect-src'],
          'https://cognito-idp.us-east-1.amazonaws.com',
          'https://api.staging.propieapp.com',
          'https://staging-graphql-endpoint.appsync-api.us-east-1.amazonaws.com',
        ],
        'img-src': [
          ...basePolicy['img-src'],
          'https://staging-media.propieapp.com',
        ],
      });
      
    default: // development and test
      // Development policy (most permissive)
      return generateCspString({
        ...basePolicy,
        'script-src': [...basePolicy['script-src'], "'unsafe-eval'", "'unsafe-inline'"],
        'connect-src': [
          ...basePolicy['connect-src'],
          'https://*.amazonaws.com',
          'http://localhost:*',
          'https://*.propieapp.com',
        ],
        'img-src': [
          ...basePolicy['img-src'],
          'https://*.propieapp.com',
        ],
      });
  }
};

// Helper function to generate CSP string
const generateCspString = (policy: Record<string, string[]>): string => {
  return Object.entries(policy)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ');
};
```

## Best Practices

### Managing Environment Variables

1. **Never hardcode secrets**:
   - Always use environment variables for sensitive information
   - Rotate secrets regularly
   - Use different secrets for each environment

2. **Validation**:
   - Validate required environment variables on application startup
   - Provide meaningful error messages when variables are missing
   - Document all required variables

3. **Security**:
   - Use encrypted storage for environment variables
   - Limit access to production variables
   - Never commit environment files to the repository

### Configuration Versioning

1. **Configuration Schema Versioning**:
   - Version your configuration schema
   - Support backward compatibility for configuration changes
   - Document configuration changes

2. **Backward Compatibility**:
   - Use default values when possible
   - Handle missing configuration gracefully
   - Provide migration path for configuration changes

### Feature Flags

1. **Feature Flag Best Practices**:
   - Use feature flags for incremental rollouts
   - Test features in multiple environments before production
   - Document feature flag purpose and expected lifespan
   - Clean up old feature flags regularly

2. **Feature Flag Testing**:
   - Test both enabled and disabled states
   - Ensure UI gracefully handles feature flag changes
   - Test feature flag combinations

### Environment-Specific Debugging

1. **Development Environment**:
   - Enable verbose logging
   - Include debugging tools
   - Allow easy feature flag toggling

2. **Production Environment**:
   - Minimize logging (only errors)
   - Disable debugging tools
   - Implement proper error tracking

### Configuration Documentation

1. **Document All Configuration Options**:
   - Create comprehensive documentation of all configuration options
   - Include allowed values and validation rules
   - Document the purpose of each configuration option

2. **Configuration Examples**:
   - Provide example configurations for each environment
   - Create templates for new environments
   - Document environment-specific considerations