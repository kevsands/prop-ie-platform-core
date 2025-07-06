# Comprehensive AWS Platform Fix Plan

This document outlines the comprehensive plan to fix the current platform issues and standardize our approach to authentication, API interactions, and deployment.

## 1. Authentication Standardization

### Current Issues
- **Multiple Authentication Systems**: Using both AWS Amplify and NextAuth simultaneously
- **Inconsistent Token Storage**: Different auth modules store tokens under different keys (`auth_token`, `token`, `accessToken`)
- **Multiple Auth Contexts**: Separate implementations in `AuthContext.tsx`, `DevAuthContext.tsx`, and `useAuth.tsx`
- **JWT Configuration Mismatch**: JWKS endpoints, issuers, and audience values not consistently applied

### Solution: Standardize on AWS Amplify Authentication

1. **Remove NextAuth Implementation**
   - Delete or archive `/src/app/api/auth/[...nextauth]/route.ts`
   - Remove NextAuth dependencies or mark as dev-only

2. **Adopt Unified Auth Module**
   - Use the updated implementation in `/src/lib/auth.ts` as the single source of truth
   - This module provides comprehensive authentication for both client and server

3. **Update Components to Use Unified Auth**
   - Update `ClientProviders.tsx` to use the proper `AuthProvider`
   - Refactor `LoginForm.tsx` and `RegisterForm.tsx` to use `authService`
   - Remove direct fetch calls to API routes for authentication

4. **Standardize Token Management**
   - Always store authentication tokens under `auth_token` key
   - Ensure token refresh mechanisms are consistent
   - Implement proper token validation on both client and server

## 2. API Access Standardization

### Current Issues
- **Multiple API Clients**: Using both axios-based API in `src/api/index.ts` and fetch-based client in `src/lib/api-client.ts`
- **Inconsistent Base URLs**: Different URL constructions and environment handling
- **Incompatible Error Handling**: Each implementation handles errors differently

### Solution: Unified API Client

1. **Adopt Enhanced API Client**
   - Use the improved implementation in `/src/lib/api-client.ts` as the single API client
   - This client handles both REST and GraphQL APIs consistently

2. **Standardize API URL Configuration**
   - Use a single configuration source for API URLs in `src/config/environment.ts`
   - Ensure all API endpoints are consistently structured

3. **Refactor API-dependent Components**
   - Replace `axios` imports with unified client
   - Update all fetch calls to use the standardized client
   - Ensure consistent error handling across components

4. **Implement Type-safe API Types**
   - Create shared request/response types for API interactions
   - Enforce type safety across API boundaries

## 3. React Query Integration

### Current Issues
- **Duplicate Providers**: Both `QueryClientWrapper.tsx` and `ClientProviders.tsx` implementing React Query
- **Outdated Usage Patterns**: Some components using React Query incorrectly
- **Inconsistent Configuration**: Different stale times and retry configurations

### Solution: Standardize React Query

1. **Single React Query Provider**
   - Keep only `ClientProviders.tsx` as the React Query provider
   - Mark `QueryClientWrapper.tsx` as deprecated with clear migration guidance

2. **Update React Query Usage**
   - Refactor components using `useQuery` to use latest practices
   - Ensure proper error handling and loading states
   - Implement consistent caching strategies

3. **Standardize React Query Configuration**
   - Define common query options for similar data types
   - Implement proper query invalidation patterns
   - Add appropriate prefetching strategies

## 4. TypeScript and Type Safety

### Current Issues
- **Inconsistent Type Definitions**: Multiple definitions for `User` and other core types
- **Missing Type Guards**: Limited runtime validation of API responses
- **Build Errors Bypassed**: Using `ignoreBuildErrors: true` in Next.js config

### Solution: Comprehensive Type System

1. **Unified Type Definitions**
   - Create central type definitions in `src/types/` directory
   - Ensure consistent naming and structure
   - Document type relationships clearly

2. **Implement Type Guards**
   - Add proper runtime validation for API responses
   - Use type predicates to ensure type safety
   - Add Zod schemas for critical data structures

3. **Fix TypeScript Errors**
   - Address all existing TypeScript errors properly
   - Remove `ignoreBuildErrors: true` from Next.js config
   - Add proper types for third-party libraries

## 5. Component Structure and Hook Usage

### Current Issues
- **Invalid Hook Usage**: Some components violate React hooks rules
- **Inconsistent Component Structure**: Mix of older class components and functional components
- **Prop Drilling**: Excessive passing of props through component trees

### Solution: Refactor Component Architecture

1. **Correct Hook Usage**
   - Ensure hooks are only called from function components
   - Fix conditional hook calls
   - Use custom hooks to encapsulate complex logic

2. **Context-based State Management**
   - Use React Context for shared state where appropriate
   - Create specialized providers for domain-specific state
   - Reduce prop drilling through proper context usage

3. **Consistent Component Patterns**
   - Standardize on functional components with hooks
   - Implement consistent patterns for data fetching components
   - Use proper error boundaries and suspense boundaries

## 6. Deployment Configuration

### Current Issues
- **Incomplete Amplify Configuration**: Placeholder build command in `amplify.yml`
- **AWS Region Mismatch**: Different regions used in different configurations
- **CSP Restrictions**: Overly restrictive Content Security Policy

### Solution: Standardize Deployment

1. **Update Amplify Configuration**
   - Update `amplify.yml` with proper build and cache configuration
   - Ensure consistent region usage across AWS services
   - Add proper test and validation steps

2. **Environment Configuration**
   - Create environment-specific configuration files
   - Implement clear environment detection logic
   - Document environment setup requirements

3. **Security Headers Refinement**
   - Refine Content Security Policy to allow necessary resources
   - Maintain strong security posture while fixing functional issues
   - Document security header requirements and reasons

## 7. Dependency Management

### Current Issues
- **Legacy Peer Dependency Flags**: Using `--legacy-peer-deps` for installation
- **Inconsistent Package Versions**: Different versions of related packages
- **Outdated Dependencies**: Several packages with known issues or vulnerabilities

### Solution: Clean Dependency Structure

1. **Resolve Peer Dependency Conflicts**
   - Update packages to compatible versions
   - Replace problematic packages with alternatives
   - Document dependency relationships clearly

2. **Standardize Version Management**
   - Set explicit versions for all dependencies
   - Use version ranges only when necessary
   - Document version requirements and constraints

3. **Security Scanning**
   - Implement automated dependency scanning
   - Regular audits of package security
   - Clear process for security updates

## Implementation Timeline

1. **Phase 1: Authentication & API (Week 1)**
   - Implement unified auth module
   - Standardize API client
   - Update key components to use new patterns

2. **Phase 2: Structure & Types (Week 2)**
   - Fix TypeScript errors
   - Refactor component structure
   - Implement unified type system

3. **Phase 3: Deployment & Dependencies (Week 3)**
   - Update deployment configuration
   - Clean up dependencies
   - Implement automated validation

## Success Criteria

- All authentication flows work consistently
- API requests succeed across all components
- TypeScript builds with no errors or warnings
- Deployment succeeds without manual intervention
- No console errors in browser during operation
- Clear, documented patterns for future development