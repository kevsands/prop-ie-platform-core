# PropIE Platform Implementation Plan

This document outlines the specific steps to implement the fixes identified in the FIXES.md document, focusing on the most critical (P0) issues first.

## Phase 1: Critical Fixes

### 1. Fix JSX Syntax Errors

#### HomePage.tsx (✓ FIXED)
- ✓ Removed duplicate code after "export default HomePage"
- ✓ Fixed unbalanced tags and syntax errors
- ✓ Extracted duplicate navigation into a component
- ✓ Implemented proper type checking

#### Fix Other Component JSX Errors
- [ ] Examine PropertyReservation.tsx for unbalanced tags
  - Fix missing closing div/form tags
  - Ensure proper JSX structure
- [ ] Check Page.tsx for syntax errors
  - Fix any unclosed tags or malformed JSX
  - Ensure valid component structure
- [ ] Address MicrosoftIntegration.tsx "Expression expected" errors
  - Fix syntax errors around lines 466-468
  - Ensure proper JSX structure

### 2. Fix TypeScript Definition Problems

#### Development Interface (✓ FIXED)
- ✓ Added `price: string` to floorPlans array items
- ✓ Added mapLocation interface definition

#### Property Types Consistency
- [ ] Review all property type definitions
  - Ensure consistency between src/types/properties.ts and other files
  - Standardize on a single Property interface
  - Update all property-related components to use the standard interface

#### User Type Consistency
- [ ] Standardize user type definitions
  - Review AuthContext and API-related user types
  - Create a single source of truth for User interface
  - Update all user-related components to use the standard interface

#### Amplify Response Types
- [ ] Fix GraphQL response type definitions
  - Update type definitions to match actual API responses
  - Add proper type guards for response validation
  - Ensure consistency with Amplify v6 type definitions

### 3. Resolve Next.js Routing Conflicts

- [ ] Decide on a primary routing strategy (App Router recommended)
  - Plan migration path from Pages Router to App Router
  - Identify all overlapping routes
  - Create redirect strategy for legacy routes

- [ ] Add proper client/server component boundaries
  - Add 'use client' directive to all client components
  - Ensure server components don't use client hooks
  - Properly structure data fetching between server and client

### 4. Update AWS Amplify Integration

- [ ] Update import paths to Amplify v6 syntax
  - Change @aws-amplify/* to aws-amplify/*
  - Update function calls to match v6 API
  - Fix API client to use generateClient()

- [ ] Fix authentication with Amplify v6
  - Update all Auth.* calls to use v6 functions
  - Fix getCurrentUser() implementation
  - Update token management

## Phase 2: High Priority Improvements

### 1. Standardize API Client Approach

- [ ] Choose primary API approach (Amplify recommended)
  - Document API strategy decision
  - Create migration plan for non-compliant code

- [ ] Create unified API client
  - Implement common interface for all API calls
  - Add proper error handling and retry logic
  - Ensure authentication token management

### 2. Resolve Authentication System Conflicts

- [ ] Choose primary auth system (AWS Cognito recommended)
  - Document authentication strategy decision
  - Plan migration for components using NextAuth

- [ ] Update AuthContext implementation
  - Align with chosen authentication system
  - Add proper loading and error states
  - Implement consistent user session management

### 3. Fix Component Duplication

- [ ] Consolidate dashboard components
  - Identify all dashboard implementations
  - Create shared dashboard component structure
  - Update pages to use unified components

- [ ] Unify authentication components
  - Extract shared login/register functionality
  - Create reusable auth form components
  - Update all auth-related pages

## Implementation Timeline

### Week 1: Critical JSX and TypeScript Fixes
- Day 1-2: Fix component syntax errors
- Day 3-4: Standardize type definitions
- Day 5: Verify builds and run tests

### Week 2: AWS Amplify and Routing
- Day 1-2: Update AWS Amplify integration
- Day 3-4: Resolve routing conflicts
- Day 5: Verify builds and user flows

### Week 3: API and Authentication
- Day 1-2: Standardize API client
- Day 3-4: Resolve authentication conflicts
- Day 5: Testing and validation

### Week 4: Component Consolidation
- Day 1-3: Fix component duplication
- Day 4-5: Final testing and documentation

## Testing Strategy

After each major fix:

1. Run the build process:
   ```
   npm run build
   ```

2. Check for TypeScript errors:
   ```
   npm run typecheck
   ```

3. Verify key user flows:
   - Authentication (login/logout)
   - Property browsing
   - Dashboard functionality
   - Help to Buy process

4. Run tests:
   ```
   npm test
   ```

## Conclusion

This implementation plan provides specific steps to address the most critical issues in the PropIE platform. By following this systematic approach, we can improve the codebase's stability, maintainability, and developer experience while ensuring the application remains functional throughout the process.

Each phase should be tracked with appropriate git commits, allowing for incremental progress and the ability to revert changes if necessary. Regular testing and validation will ensure that fixes do not introduce new issues.