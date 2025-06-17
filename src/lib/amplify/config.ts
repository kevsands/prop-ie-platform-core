/**
 * AWS Amplify Configuration
 * 
 * This module provides a centralized, type-safe configuration for AWS Amplify v6 services.
 * It handles environment-specific configuration and ensures that all required values
 * are properly defined. Updated to integrate with production-ready authentication system.
 */

import { Amplify } from 'aws-amplify';
import awsExports from '../../aws-exports';

/**
 * Environment variables with fallbacks to prevent undefined values
 */
const env = {
  region: process.env.NEXT_PUBLIC_AWS_REGION || awsExports.aws_project_region || 'us-east-1',
  userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || process.env.NEXT_PUBLIC_AWS_USER_POOLS_ID || awsExports.aws_user_pools_id || '',
  userPoolWebClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || process.env.NEXT_PUBLIC_AWS_USER_POOLS_WEB_CLIENT_ID || awsExports.aws_user_pools_web_client_id || '',
  identityPoolId: process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID || process.env.NEXT_PUBLIC_AWS_COGNITO_IDENTITY_POOL_ID || awsExports.aws_cognito_identity_pool_id || undefined,
  cognitoDomain: process.env.NEXT_PUBLIC_COGNITO_DOMAIN || 'prop-ie-auth.auth.us-east-1.amazoncognito.com',
  apiEndpoint: process.env.NEXT_PUBLIC_API_ENDPOINT || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  graphqlEndpoint: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || process.env.NEXT_PUBLIC_APPSYNC_GRAPHQL_ENDPOINT || awsExports.aws_appsync_graphqlEndpoint || 'http://localhost:3000/api/graphql',
  graphqlApiKey: process.env.NEXT_PUBLIC_APPSYNC_API_KEY || awsExports.aws_appsync_apiKey || undefined,
  storageBucket: process.env.NEXT_PUBLIC_S3_BUCKET || awsExports.aws_user_files_s3_bucket || undefined,
  storageRegion: process.env.NEXT_PUBLIC_S3_REGION || awsExports.aws_user_files_s3_bucket_region || 'us-east-1',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
};

/**
 * Centralized Amplify configuration using v6 format with OAuth support
 */
const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: env.userPoolId,
      userPoolClientId: env.userPoolWebClientId,
      identityPoolId: env.identityPoolId,
      loginWith: {
        oauth: {
          domain: env.cognitoDomain,
          scopes: ['email', 'openid', 'profile'],
          redirectSignIn: `${env.appUrl}/auth/callback`,
          redirectSignOut: `${env.appUrl}/auth/signout`,
          responseType: 'code'
        },
        email: true,
        username: false
      }
    }
  },
  API: {
    REST: {
      PropAPI: {
        endpoint: env.apiEndpoint,
        region: env.region
      }
    },
    GraphQL: env.graphqlEndpoint ? {
      endpoint: env.graphqlEndpoint,
      region: env.region,
      apiKey: env.graphqlApiKey,
      defaultAuthMode: 'userPool'
    } : undefined
  },
  Storage: env.storageBucket ? {
    S3: {
      bucket: env.storageBucket,
      region: env.storageRegion
    }
  } : undefined
};

/**
 * Validate configuration
 * 
 * This logs warnings for missing configuration but doesn't throw errors
 * to prevent failing in development environments where some values might be missing.
 */
export function validateAmplifyConfig(): boolean {
  const requiredValues = [
    { key: 'Auth.Cognito.userPoolId', value: amplifyConfig.Auth?.Cognito?.userPoolId },
    { key: 'Auth.Cognito.userPoolClientId', value: amplifyConfig.Auth?.Cognito?.userPoolClientId },
  ];

  const recommendedValues = [
    { key: 'Auth.Cognito.identityPoolId', value: amplifyConfig.Auth?.Cognito?.identityPoolId },
    { key: 'Auth.Cognito.loginWith.oauth.domain', value: amplifyConfig.Auth?.Cognito?.loginWith?.oauth?.domain },
  ];

  const missingRequired = requiredValues.filter(item => !item.value);
  const missingRecommended = recommendedValues.filter(item => !item.value);
  
  if (missingRequired.length > 0) {
    console.warn(
      '⚠️  AWS Amplify Configuration Warning: The following REQUIRED values are missing or empty:',
      missingRequired.map(item => item.key).join(', '),
      '\nPlease check your environment variables. Authentication may not work properly.'
    );
    return false;
  }

  if (missingRecommended.length > 0 && process.env.NODE_ENV !== 'development') {
    console.warn(
      '📝 AWS Amplify Configuration Note: The following RECOMMENDED values are missing:',
      missingRecommended.map(item => item.key).join(', '),
      '\nSome features may have limited functionality.'
    );
  }

  // Log successful configuration in development
  if (process.env.NODE_ENV === 'development') {
    console.log('✅ AWS Amplify configuration validated successfully');
  }
  
  return true;
}

// Run validation on import
validateAmplifyConfig();

// Configure Amplify
Amplify.configure(amplifyConfig);

export default amplifyConfig;