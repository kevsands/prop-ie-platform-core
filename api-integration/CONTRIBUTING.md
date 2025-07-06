# Contributing to PropIE AWS App

Thank you for your interest in contributing to the PropIE AWS App. This document provides guidelines and instructions for contributing to this project.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Development Workflow](#development-workflow)
3. [Code Style Guidelines](#code-style-guidelines)
4. [AWS Amplify Integration Guidelines](#aws-amplify-integration-guidelines)
5. [Working with React Server Components](#working-with-react-server-components)
6. [Testing Standards](#testing-standards)
7. [Pull Request Process](#pull-request-process)
8. [Documentation Guidelines](#documentation-guidelines)

## Getting Started

Before you start contributing, make sure you have:

1. Node.js 18.17.0 or higher installed
2. pnpm 10.0.0 or higher installed
3. Access to AWS services for testing (or use mock services)
4. Created a `.env.local` file with the required environment variables

Follow the setup instructions in the [README.md](./README.md) to set up your local development environment.

## Development Workflow

We follow a feature branch workflow:

1. **Fork the repository** (if you're an external contributor)
2. **Create a new branch** from `master` for your feature or bug fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
   or
   ```bash
   git checkout -b fix/issue-description
   ```
3. **Develop your changes** following the code style guidelines
4. **Write tests** for your changes
5. **Update documentation** if necessary
6. **Commit your changes** with clear, descriptive commit messages
7. **Submit a pull request** to the `master` branch

## Code Style Guidelines

### General Guidelines

- Use TypeScript for all new code
- Follow the existing code style in the project
- Use meaningful variable and function names
- Keep functions small and focused on a single responsibility
- Comment complex logic or business rules

### TypeScript

- Use proper TypeScript types for all variables, parameters, and return values
- Use interfaces for complex objects
- Export types from centralized type definition files
- Use the existing type structure in `/src/types/`

### React Components

- **Server Components**:
  - Server components should be the default (without 'use client' directive)
  - Focus on data fetching and passing data to client components
  - Don't use hooks or browser APIs in server components
  
- **Client Components**:
  - Add 'use client' directive at the top of the file
  - Place in appropriate directories based on functionality
  - Use hooks for state management and side effects
  - Separate business logic from presentation

### Directory Structure

Follow the established directory structure:

- `/src/app/*` - Next.js App Router pages and layouts
- `/src/components/*` - Reusable React components
- `/src/context/*` - React Context providers
- `/src/lib/*` - Utility libraries
- `/src/types/*` - TypeScript type definitions
- `/src/hooks/*` - Custom React hooks
- `/src/utils/*` - Utility functions

## AWS Amplify Integration Guidelines

When working with AWS Amplify, follow these guidelines:

1. **Module Imports**:
   - For client components, import from our wrapper modules:
     ```typescript
     import { Auth } from '@/lib/amplify/auth';
     import { API } from '@/lib/amplify/api';
     import { Storage } from '@/lib/amplify/storage';
     ```
   - For server components, use the server-safe modules:
     ```typescript
     import { ServerAmplify } from '@/lib/amplify/server';
     ```

2. **Initialization**:
   - Don't call Amplify.configure() directly; use the provided providers
   - Wrap components that need Amplify with the AmplifyProvider

3. **Error Handling**:
   - Always include proper error handling for Amplify operations
   - Use try/catch blocks for async operations
   - Provide user-friendly error messages

## Working with React Server Components

When developing with React Server Components (RSC):

1. **Server vs. Client Separation**:
   - Server components handle data fetching and rendering
   - Client components handle interactivity and state
   - Clearly separate concerns between the two

2. **Data Flow**:
   - Pass data from server components to client components as props
   - Use React Context only in client components
   - Use TanStack Query for client-side data fetching

3. **Common Patterns**:
   ```
   // Page.tsx (Server Component)
   export default async function Page() {
     const data = await fetchData();
     return <ClientComponent initialData={data} />;
   }
   
   // ClientComponent.tsx
   'use client';
   export function ClientComponent({ initialData }) {
     // Client-side state and interactivity
   }
   ```

## Testing Standards

We have the following testing requirements:

1. **Unit Tests**:
   - Write unit tests for all new utility functions
   - Test components with React Testing Library
   - Mock external dependencies like AWS services

2. **Integration Tests**:
   - Write integration tests for key user flows
   - Test the integration between components and services

3. **Running Tests**:
   ```bash
   pnpm test          # Run all tests
   pnpm test:watch    # Run tests in watch mode
   ```

## Pull Request Process

1. **Create a pull request** from your branch to the `master` branch
2. **Fill out the PR template** with details about your changes
3. **Link any related issues** in the PR description
4. **Pass all automated checks**:
   - Linting (`pnpm lint`)
   - Type checking (`pnpm type-check`)
   - Tests (`pnpm test`)
5. **Request a review** from at least one team member
6. **Address review feedback** until your PR is approved
7. **PR will be merged** by a maintainer once approved

## Documentation Guidelines

Documentation is a critical part of the codebase:

1. **Code Comments**:
   - Add JSDoc comments for functions, interfaces, and classes
   - Explain complex logic with inline comments
   - Document key business rules and edge cases

2. **README and Markdown Files**:
   - Update README.md when changing significant functionality
   - Create new documentation for major features
   - Keep the architecture documentation up to date

3. **Example**:
   ```typescript
   /**
    * Fetches user data and handles authentication edge cases
    * 
    * @param userId - The ID of the user to fetch
    * @returns The user data or null if not found
    * @throws AuthError if not authenticated
    */
   async function fetchUser(userId: string): Promise<User | null> {
     // Implementation
   }
   ```

## Security Guidelines

When contributing code, follow these security guidelines:

1. **Input Validation**:
   - Validate all user input before processing
   - Use schema validation (Zod) for form data
   - Never trust client-side data

2. **Authentication & Authorization**:
   - Always check user permissions before accessing sensitive data
   - Use the Auth module for authentication checks
   - Don't expose sensitive data in API responses

3. **AWS Resource Access**:
   - Follow the principle of least privilege
   - Use IAM roles with appropriate permissions
   - Don't hardcode credentials or sensitive information

## Getting Help

If you have questions or need help:

1. Check the [ERROR_RESOLUTION.md](./ERROR_RESOLUTION.md) for common issues
2. Review the [ARCHITECTURE.md](./ARCHITECTURE.md) for design insights
3. Contact the project maintainers for guidance

Thank you for contributing to the PropIE AWS App!