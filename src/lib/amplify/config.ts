/**
 * AWS Amplify Configuration
 * 
 * This module provides a centralized, type-safe configuration for AWS Amplify v6 services.
 * It handles environment-specific configuration and ensures that all required values
 * are properly defined.
 */

import { Amplify } from 'aws-amplify';
import awsExports from '../../aws-exports';

/**
 * Environment variables with fallbacks to prevent undefined values
 */
const env = {
  region: process.env.NEXT_PUBLIC_AWS_REGION || awsExports.aws_project_region || 'us-east-1',
  userPoolId: process.env.NEXT_PUBLIC_AWS_USER_POOLS_ID || awsExports.aws_user_pools_id || '',
  userPoolWebClientId: process.env.NEXT_PUBLIC_AWS_USER_POOLS_WEB_CLIENT_ID || awsExports.aws_user_pools_web_client_id || '',
  identityPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_IDENTITY_POOL_ID || awsExports.aws_cognito_identity_pool_id || undefined,
  apiEndpoint: process.env.NEXT_PUBLIC_API_URL || 'https://api.prop-ie.com',
  graphqlEndpoint: process.env.NEXT_PUBLIC_APPSYNC_GRAPHQL_ENDPOINT || awsExports.aws_appsync_graphqlEndpoint || undefined,
  graphqlApiKey: process.env.NEXT_PUBLIC_APPSYNC_API_KEY || awsExports.aws_appsync_apiKey || undefined,
  storageBucket: process.env.NEXT_PUBLIC_S3_BUCKET || awsExports.aws_user_files_s3_bucket || undefined,
  storageRegion: process.env.NEXT_PUBLIC_S3_REGION || awsExports.aws_user_files_s3_bucket_region || 'us-east-1'};

/**
 * Centralized Amplify configuration using v6 format
 */
const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: env.userPoolId,
      userPoolClientId: env.userPoolWebClientId,
      identityPoolId: env.identityPoolId,
      loginWith: {
        email: true,
        username: true,
        phone: false
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
      defaultAuthMode: 'apiKey'
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
    { key: 'Auth.Cognito.userPoolClientId', value: amplifyConfig.Auth?.Cognito?.userPoolClientId }];

  const missingValues = requiredValues.filter(item => !item.value);

  if (missingValues.length> 0) {
    .join(', '),
      'Please check your environment variables.'
    );
    return false;
  }

  return true;
}

// Run validation on import
validateAmplifyConfig();

// Configure Amplify
Amplify.configure(amplifyConfig);

export default amplifyConfig;