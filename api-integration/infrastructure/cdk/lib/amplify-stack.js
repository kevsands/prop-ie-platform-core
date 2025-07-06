import * as cdk from 'aws-cdk-lib';
import * as amplify from '@aws-cdk/aws-amplify-alpha';
import * as iam from 'aws-cdk-lib/aws-iam';
export class AmplifyStack extends cdk.Stack {
    amplifyApp;
    amplifyBranch;
    // Add region and account getters from the Stack
    get region() {
        return this.stack.region;
    }
    get account() {
        return this.stack.account;
    }
    constructor(scope, id, props) {
        super(scope, id, props);
        // IAM role for Amplify
        const amplifyRole = new iam.Role(this, 'AmplifyRole', {
            roleName: `prop-ie-amplify-role-${props.environment}`,
            assumedBy: new iam.ServicePrincipal('amplify.amazonaws.com'),
        });
        // Amplify permissions policy
        const amplifyPolicy = new iam.Policy(this, 'AmplifyPolicy', {
            policyName: `prop-ie-amplify-policy-${props.environment}`,
            statements: [
                new iam.PolicyStatement({
                    actions: [
                        'logs:CreateLogGroup',
                        'logs:CreateLogStream',
                        'logs:PutLogEvents',
                    ],
                    effect: iam.Effect.ALLOW,
                    resources: ['*'],
                }),
                new iam.PolicyStatement({
                    actions: [
                        's3:GetObject',
                        's3:PutObject',
                        's3:DeleteObject',
                        's3:ListBucket',
                    ],
                    effect: iam.Effect.ALLOW,
                    resources: [
                        `arn:aws:s3:::${props.s3BucketName || 'prop-ie-app-assets'}`,
                        `arn:aws:s3:::${props.s3BucketName || 'prop-ie-app-assets'}/*`,
                    ],
                }),
                new iam.PolicyStatement({
                    actions: [
                        'cognito-idp:DescribeUserPool',
                        'cognito-idp:DescribeUserPoolClient',
                    ],
                    effect: iam.Effect.ALLOW,
                    resources: ['*'],
                }),
                new iam.PolicyStatement({
                    actions: [
                        'appsync:GraphQL',
                    ],
                    effect: iam.Effect.ALLOW,
                    resources: [`arn:aws:appsync:${this.stack.region}:${this.stack.account}:apis/${props.appsyncApiId || '*'}/*`],
                }),
                new iam.PolicyStatement({
                    actions: [
                        'cloudwatch:PutMetricData',
                        'cloudwatch:GetMetricData',
                        'cloudwatch:ListMetrics',
                    ],
                    effect: iam.Effect.ALLOW,
                    resources: ['*'],
                }),
            ],
        });
        // Attach policy to role
        amplifyPolicy.attachToRole(amplifyRole);
        // Create the Amplify app
        this.amplifyApp = new amplify.App(this, 'PropIEApp', {
            appName: `prop-ie-aws-app-${props.environment}`,
            sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
                owner: props.repositoryUrl.split('/')[3],
                repository: props.repositoryUrl.split('/')[4],
                oauthToken: props.githubToken,
            }),
            role: amplifyRole,
            environmentVariables: {
                NEXT_PUBLIC_AWS_REGION: this.stack.region,
                NODE_OPTIONS: '--max-old-space-size=4096',
            },
            buildSpec: amplify.BuildSpec.fromObjectToYaml({
                version: 1,
                frontend: {
                    phases: {
                        preBuild: {
                            commands: [
                                `if [ "\${AWS_BRANCH}" = "production" ]; then export NODE_ENV=production; elif [ "\${AWS_BRANCH}" = "staging" ]; then export NODE_ENV=staging; else export NODE_ENV=development; fi`,
                                'echo "Building for environment: ${NODE_ENV}"',
                                'npm ci',
                                'npm run verify-lockfile',
                                'npm run security-check',
                            ],
                        },
                        build: {
                            commands: [
                                'echo "Running build for branch: ${AWS_BRANCH}"',
                                'if [ "${AWS_BRANCH}" = "production" ]; then npm run build:prod; elif [ "${AWS_BRANCH}" = "staging" ]; then npm run build:staging; else npm run build; fi',
                            ],
                        },
                    },
                    artifacts: {
                        baseDirectory: '.next',
                        files: ['**/*'],
                    },
                    cache: {
                        paths: ['node_modules/**/*', '.next/cache/**/*'],
                    },
                },
            }),
            customRules: [
                {
                    source: '/<*>',
                    target: '/index.html',
                    status: amplify.RedirectStatus.NOT_FOUND_REWRITE,
                },
                {
                    source: '</^[^.]+$|\\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|woff2|ttf|map|json)$)([^.]+$)/>',
                    target: '/index.html',
                    status: amplify.RedirectStatus.REWRITE,
                },
            ],
            customResponseHeaders: [
                {
                    pattern: '**/*',
                    headers: {
                        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
                        'X-Content-Type-Options': 'nosniff',
                        'X-Frame-Options': 'DENY',
                        'X-XSS-Protection': '1; mode=block',
                        'Referrer-Policy': 'strict-origin-when-cross-origin',
                        'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.google-analytics.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://www.google-analytics.com; connect-src 'self' https://*.amazonaws.com https://*.amplifyapp.com https://www.google-analytics.com; font-src 'self'; frame-src 'self'; object-src 'none'",
                    },
                },
            ],
        });
        // Create the branch based on environment
        const branchName = props.environment === 'prod' ? 'production' : props.environment;
        // Define environment variables specific to the branch
        const envVars = {
            NEXT_PUBLIC_APP_ENV: props.environment,
        };
        // Set API endpoint based on environment
        if (props.environment === 'prod') {
            envVars.NEXT_PUBLIC_API_ENDPOINT = 'https://api.prop-ie-app.com';
            envVars.NEXT_PUBLIC_APP_URL = 'https://prop-ie-app.com';
        }
        else if (props.environment === 'staging') {
            envVars.NEXT_PUBLIC_API_ENDPOINT = 'https://staging-api.prop-ie-app.com';
            envVars.NEXT_PUBLIC_APP_URL = 'https://staging.prop-ie-app.com';
        }
        else {
            envVars.NEXT_PUBLIC_API_ENDPOINT = 'https://dev-api.prop-ie-app.com';
            envVars.NEXT_PUBLIC_APP_URL = 'https://dev.prop-ie-app.com';
        }
        // Add Cognito and S3 environment variables if provided
        if (props.cognitoUserPoolId) {
            envVars.NEXT_PUBLIC_USER_POOLS_ID = props.cognitoUserPoolId;
        }
        if (props.s3BucketName) {
            envVars.NEXT_PUBLIC_S3_BUCKET = props.s3BucketName;
        }
        // Create the Amplify branch with environment variables
        this.amplifyBranch = this.amplifyApp.addBranch(branchName, {
            stage: props.environment === 'prod' ? 'PRODUCTION' :
                props.environment === 'staging' ? 'BETA' : 'DEVELOPMENT',
            environmentVariables: envVars,
            autoBuild: true,
        });
        // Create a webhook for automatic deployments
        const webhook = new amplify.CfnWebhook(this, 'Webhook', {
            appId: this.amplifyApp.appId,
            branchName: this.amplifyBranch.branchName,
            description: `${props.environment} branch webhook`,
        });
        // Domain setup (if domain name is provided)
        if (props.domainName) {
            // Add domain to Amplify app
            const domain = this.amplifyApp.addDomain(props.domainName, {
                enableAutoSubdomain: true,
                autoSubdomainCreationPatterns: ['*', 'pr*'],
            });
            // Add specific subdomain mapping based on environment
            if (props.environment === 'prod') {
                domain.mapRoot(this.amplifyBranch);
            }
            else {
                domain.mapSubDomain(this.amplifyBranch, props.environment);
            }
        }
        // Output important values
        new cdk.CfnOutput(this, 'AmplifyAppId', {
            value: this.amplifyApp.appId,
            description: 'Amplify App ID',
            exportName: `PropIE-${props.environment}-AmplifyAppId`,
        });
        new cdk.CfnOutput(this, 'AmplifyBranchName', {
            value: this.amplifyBranch.branchName,
            description: 'Amplify Branch Name',
            exportName: `PropIE-${props.environment}-AmplifyBranchName`,
        });
        if (props.domainName) {
            new cdk.CfnOutput(this, 'AmplifyDomainName', {
                value: props.environment === 'prod' ?
                    `https://${props.domainName}` :
                    `https://${props.environment}.${props.domainName}`,
                description: 'Amplify App URL',
                exportName: `PropIE-${props.environment}-AmplifyDomainName`,
            });
        }
        new cdk.CfnOutput(this, 'WebhookUrl', {
            value: `${webhook.attrWebhookUrl}`,
            description: 'Webhook URL for triggering deployments',
            exportName: `PropIE-${props.environment}-WebhookUrl`,
        });
    }
}
