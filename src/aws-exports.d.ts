/**
 * Type definitions for aws-exports.js
 */
declare const awsmobile: {
  aws_project_region: string;
  aws_cognito_identity_pool_id: string;
  aws_cognito_region: string;
  aws_user_pools_id: string;
  aws_user_pools_web_client_id: string;
  oauth: {
    domain: string;
    scope: string[];
    redirectSignIn: string;
    redirectSignOut: string;
    responseType: string;
  };
  aws_appsync_graphqlEndpoint: string;
  aws_appsync_region: string;
  aws_appsync_authenticationType: string;
  aws_appsync_apiKey?: string;
  aws_cloud_logic_custom?: {
    name: string;
    endpoint: string;
    region: string;
  }[];
  Storage?: {
    AWSS3: {
      bucket: string;
      region: string;
    };
  };
};

export default awsmobile;
EOL < /dev/null