// WARNING: DO NOT EDIT. This file is automatically configured through environment variables.
// This file serves as a centralized configuration for AWS services.

const awsConfig = {
  // Cognito Authentication
  aws_project_region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
  aws_cognito_region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
  aws_user_pools_id: process.env.NEXT_PUBLIC_AWS_USER_POOLS_ID || 'us-east-1_TEMPORARY',
  aws_user_pools_web_client_id: process.env.NEXT_PUBLIC_AWS_USER_POOLS_WEB_CLIENT_ID || 'TEMPORARY_CLIENT_ID',
  
  // OAuth configuration
  oauth: {},
  
  // User attributes
  aws_cognito_username_attributes: ['EMAIL'],
  aws_cognito_social_providers: [],
  aws_cognito_signup_attributes: ['EMAIL'],
  
  // MFA configuration
  aws_cognito_mfa_configuration: 'OFF',
  aws_cognito_mfa_types: [],
  
  // Password policy
  aws_cognito_password_protection_settings: {
    passwordPolicyMinLength: 8,
    passwordPolicyCharacters: [
      'REQUIRES_LOWERCASE',
      'REQUIRES_UPPERCASE', 
      'REQUIRES_NUMBERS',
      'REQUIRES_SYMBOLS'
    ]
  },
  
  // Verification mechanisms
  aws_cognito_verification_mechanisms: ['EMAIL'],
  
  // S3 Storage
  aws_user_files_s3_bucket: process.env.NEXT_PUBLIC_S3_BUCKET || 'prop-ie-dev-bucket',
  aws_user_files_s3_bucket_region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
  
  // AppSync GraphQL
  aws_appsync_graphqlEndpoint: process.env.GRAPHQL_URI || 'http://localhost:3000/api/graphql',
  aws_appsync_region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
  aws_appsync_authenticationType: 'AWS_IAM',
  
  // DynamoDB
  aws_dynamodb_all_tables_region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
  aws_dynamodb_table_schemas: [],
  
  // API configuration
  API: {
    endpoints: [
      {
        name: 'prop-api',
        endpoint: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
        region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1'
      }
    ]
  }
};

export default awsConfig;