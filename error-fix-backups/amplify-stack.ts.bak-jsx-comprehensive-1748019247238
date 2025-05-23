import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as amplify from '@aws-cdk/aws-amplify-alpha';

export interface AmplifyStackProps extends cdk.StackProps {
  env?: {
    account?: string;
    region?: string;
  };
}

export class AmplifyStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: AmplifyStackProps) {
    super(scope, id, props);

    // Create Amplify app
    const amplifyApp = new amplify.App(this, 'PropIeApp', {
      sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
        owner: 'your-github-username',
        repository: 'prop-ie-aws-app',
        oauthToken: cdk.SecretValue.secretsManager('github-token')
      }),
      environmentVariables: {
        AMPLIFY_MONOREPO_APP_ROOT: 'prop-ie-aws-app'
      }
    });

    // Add branch
    const mainBranch = amplifyApp.addBranch('main', {
      autoBuild: true,
      environmentVariables: {
        NODE_ENV: 'production'
      }
    });

    // Add domain
    amplifyApp.addDomain('prop.ie', {
      subDomains: [
        {
          branch: mainBranch,
          prefix: 'www'
        }
      ]
    });
  }
} 