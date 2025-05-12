# Prop.ie AWS Application

This is the frontend application for the Prop.ie property management platform, built with Next.js 15.3.1, AWS Amplify v6, and other modern technologies.

![Coverage](https://img.shields.io/badge/coverage-67%25-yellow)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)

## Tech Stack

- **Frontend Framework**: Next.js 15.3.1 with App Router
- **UI Library**: React 18.2.0
- **Styling**: Tailwind CSS
- **State Management**: React Context API, TanStack Query v5
- **Authentication**: AWS Amplify v6 Authentication (Cognito)
- **API**: AWS Amplify v6 API (AppSync/GraphQL and REST API)
- **Storage**: AWS Amplify v6 Storage (S3)
- **Package Manager**: pnpm
- **TypeScript**: For type safety across the codebase

For more details on the architecture, see the [Architecture Documentation](./ARCHITECTURE.md).

## Core Services

The application provides several core services that standardize common operations:

- **Configuration System** (`src/config/index.ts`) - Centralized configuration management
- **AWS Amplify Integration** (`src/lib/amplify/`) - Modular AWS services:
  - **Auth** (`src/lib/amplify/auth.ts`) - Authentication and authorization
  - **API** (`src/lib/amplify/api.ts`) - GraphQL and REST API interactions
  - **Storage** (`src/lib/amplify/storage.ts`) - S3 file storage
  - **Server** (`src/lib/amplify/server.ts`) - Server-side AWS integrations
- **Security Features** (`src/lib/security/`) - Comprehensive security controls

## Getting Started

First, install dependencies using pnpm:

```bash
pnpm install
```

Then, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Setup

This project requires proper configuration of AWS services. Create a `.env.local` file with:

```bash
# AWS Configuration - replace with your AWS values
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_AWS_USER_POOLS_ID=us-east-1_XXXXXXXXX
NEXT_PUBLIC_AWS_USER_POOLS_WEB_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_AWS_COGNITO_IDENTITY_POOL_ID=us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
NEXT_PUBLIC_API_URL=https://api.prop-ie.com
NEXT_PUBLIC_APPSYNC_GRAPHQL_ENDPOINT=https://xxxxxxxxxxxxxxxxxxxxxxxxxx.appsync-api.us-east-1.amazonaws.com/graphql
NEXT_PUBLIC_APPSYNC_API_KEY=da2-xxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_S3_BUCKET=propieawsapp-storage-xxxxxxxx-dev
NEXT_PUBLIC_S3_REGION=us-east-1

# Feature Flags
NEXT_PUBLIC_FEATURE_INVESTOR_MODE=true
NEXT_PUBLIC_FEATURE_HELP_TO_BUY=true
NEXT_PUBLIC_FEATURE_ENHANCED_SECURITY=true
NEXT_PUBLIC_SHOW_DEBUG_TOOLS=true
```

## Development Workflow

The recommended development workflow is:

1. Create a feature branch from `master`
2. Implement your changes with proper unit tests
3. Run `pnpm lint` and `pnpm type-check` to validate your code
4. Submit a pull request for review

## Available Scripts

- `pnpm dev` - Start the development server
- `pnpm build` - Build the production application
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint
- `pnpm test` - Run tests
- `pnpm type-check` - Run TypeScript type checking
- `pnpm analyze-bundle` - Analyze bundle size

## Deployment

This application is deployed using AWS Amplify. The deployment configuration is in `amplify.yml`.

## Project Structure

```
prop-ie-aws-app/
├── public/                # Static assets
├── src/                   # Source code
│   ├── app/               # Next.js App Router pages
│   ├── components/        # React components
│   ├── context/           # React Context definitions
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility libraries
│   │   ├── amplify/       # AWS Amplify integration
│   │   ├── security/      # Security utilities
│   │   └── services/      # API services
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── .env.local.example     # Example environment variables
├── next.config.mjs        # Next.js configuration
└── tailwind.config.ts     # Tailwind CSS configuration
```

## Security Features

This application implements comprehensive security controls to protect against common web vulnerabilities:

### AWS Amplify Integration

The AWS Amplify integration has been significantly improved to ensure proper security:

- **Server/Client Separation**: Proper separation of server and client components for AWS Amplify
- **Modular Architecture**: Separate modules for Auth, API, and Storage to improve code organization
- **Token Management**: Enhanced token refresh and storage mechanisms
- **Error Handling**: Improved error handling for authentication and API operations

### Security Documentation

- [Runtime Security Controls](./docs/RUNTIME_SECURITY_CONTROLS.md) - Detailed documentation of runtime security protections
- [Secure Coding Patterns](./docs/SECURE_CODING_PATTERNS.md) - Guide for secure coding practices
- [Security Code Review](./docs/SECURITY_CODE_REVIEW.md) - Checklist for security code reviews
- [Dependency Approval](./docs/DEPENDENCY_APPROVAL.md) - Process for evaluating new dependencies
- [Error Resolution Guide](./ERROR_RESOLUTION.md) - Guide for resolving common errors

### Key Security Features

1. **Content Security Policy (CSP)** - Restricts resource loading to prevent XSS and data injection
2. **Enhanced Security Headers** - Implements all recommended security headers
3. **Client-Side Security Monitoring** - Real-time detection of security violations
4. **XSS Protection** - Multiple layers of protection against cross-site scripting
5. **CSRF Protection** - Comprehensive protection against cross-site request forgery
6. **Malicious Redirect Prevention** - Protection against open redirects and phishing attempts
7. **Security Middleware** - Server-side request filtering and protection
8. **Dependency Security** - Supply chain security controls and verification

### Security Components

- `ClientSecurityProvider` - Client-side security provider component
- `SecurityMonitor` - Real-time security monitoring component
- `SafeLink` - Secure alternative to Next.js Link component
- `CSRFToken` - CSRF protection for forms
- `withCSRFProtection` - HOC for protecting routes from CSRF attacks

### Security Utilities

- `useSecurityMonitor` - Hook for runtime security monitoring
- `sanitize` - Utilities for sanitizing user input and preventing XSS
- `urlSafetyCheck` - Functions for validating and safely handling URLs

## Additional Documentation

For more detailed information, refer to:

- [Architecture Documentation](./ARCHITECTURE.md)
- [Error Resolution Guide](./ERROR_RESOLUTION.md)
- [Contributing Guidelines](./CONTRIBUTING.md)
