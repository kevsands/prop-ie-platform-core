# AWS Integration Troubleshooting Guide

This guide provides solutions for common issues encountered when working with AWS services in the PropIE application.

## Table of Contents

1. [Authentication Issues](#authentication-issues)
2. [API Integration Issues](#api-integration-issues)
3. [Storage Issues](#storage-issues)
4. [Environment Configuration Issues](#environment-configuration-issues)
5. [Deployment Issues](#deployment-issues)
6. [Performance Issues](#performance-issues)
7. [Security Concerns](#security-concerns)

## Authentication Issues

### "User is not authenticated" Errors

**Symptom**: Components show "User is not authenticated" errors despite successful login.

**Possible Causes**:
- Token storage is not properly initialized
- Token not properly passed to the server
- Token expiration without refresh

**Solutions**:
1. Check browser console for auth-related errors
2. Verify token storage in browser's localStorage/cookies
3. Check if Auth provider is wrapped correctly around components
4. Ensure token refresh is working properly

```typescript
// Debug authentication state
const debugAuth = async () => {
  try {
    // Check if token exists
    const token = localStorage.getItem('auth_token');
    console.log('Token exists:', !!token);
    
    // Try to get current user
    const user = await Auth.getCurrentUser();
    console.log('Current user:', user);
  } catch (error) {
    console.error('Auth debug error:', error);
  }
};
```

### Sign-Up Confirmation Issues

**Symptom**: Users cannot confirm their accounts after registration.

**Possible Causes**:
- Confirmation code expired
- Incorrect confirmation code format
- Email delivery issues

**Solutions**:
1. Implement "Resend code" functionality
2. Add proper validation and formatting for confirmation code input
3. Check Cognito console for failed delivery notifications

### Token Refresh Failures

**Symptom**: Session suddenly expires, requiring re-login.

**Possible Causes**:
- Refresh token expired
- Refresh token not properly stored
- Auth configuration issues

**Solutions**:
1. Check refresh token storage and expiration
2. Implement proactive token refresh before expiration
3. Add session recovery functionality

```typescript
// Check token expiration and refresh if needed
const checkAndRefreshToken = async () => {
  try {
    // Get current session (will attempt a token refresh if needed)
    const session = await Auth.getCurrentUser();
    return session;
  } catch (error) {
    console.error('Token refresh failed:', error);
    // Handle re-authentication if needed
    return null;
  }
};
```

### Cross-Browser Authentication Issues

**Symptom**: Authentication works in some browsers but fails in others.

**Possible Causes**:
- Different localStorage/cookie behavior
- Inconsistent CORS handling
- Third-party cookie restrictions

**Solutions**:
1. Test auth flow in multiple browsers
2. Use consistent storage mechanism with proper fallbacks
3. Implement cookie-based fallback for third-party cookie restrictions

## API Integration Issues

### GraphQL Operation Failures

**Symptom**: GraphQL queries/mutations fail with errors.

**Possible Causes**:
- Schema mismatch
- Authorization issues
- Network failures

**Solutions**:
1. Validate query/mutation structure against schema
2. Check authorization headers and tokens
3. Implement proper error handling and retry logic

```typescript
// Debugging GraphQL errors
const debugGraphQL = async (query, variables) => {
  try {
    console.log('Executing GraphQL query:', query);
    console.log('With variables:', variables);
    
    const response = await API.graphql({ query, variables });
    console.log('GraphQL response:', response);
    return response;
  } catch (error) {
    console.error('GraphQL error:', error);
    
    // Check for common error types
    if (error.message?.includes('Network error')) {
      console.error('Network issue detected');
    } else if (error.message?.includes('not authorized')) {
      console.error('Authorization issue detected');
    } else if (error.errors) {
      console.error('GraphQL errors:', error.errors);
    }
    
    throw error;
  }
};
```

### Data Inconsistency Issues

**Symptom**: Stale or incorrect data shown in the UI.

**Possible Causes**:
- Improper cache invalidation
- Race conditions in data fetching
- Optimistic updates not properly reconciled

**Solutions**:
1. Implement proper query invalidation with React Query
2. Add cache control headers for REST API calls
3. Ensure mutations properly update the query cache

```typescript
// Invalidate queries after mutation
const invalidateQueriesAfterMutation = (queryClient, mutationResult) => {
  // Invalidate specific queries
  queryClient.invalidateQueries(['developments']);
  
  // Invalidate specific item by ID
  const id = mutationResult?.id;
  if (id) {
    queryClient.invalidateQueries(['development', id]);
  }
};
```

### API Rate Limiting

**Symptom**: "Too many requests" errors during high usage.

**Possible Causes**:
- Excessive API calls
- Missing caching
- Polling without backoff

**Solutions**:
1. Implement proper caching strategy
2. Add exponential backoff for retries
3. Batch API requests where possible

## Storage Issues

### File Upload Failures

**Symptom**: File uploads fail with errors.

**Possible Causes**:
- File size exceeds limits
- CORS configuration issues
- Missing or invalid content type

**Solutions**:
1. Validate file size before upload
2. Check and update S3 bucket CORS settings
3. Ensure proper content type is specified

```typescript
// Pre-validate file upload
const validateFileUpload = (file, maxSizeMB = 5) => {
  const errors = [];
  
  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    errors.push(`File size exceeds ${maxSizeMB}MB limit`);
  }
  
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  if (!allowedTypes.includes(file.type)) {
    errors.push(`File type ${file.type} not allowed`);
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};
```

### S3 URL Expiration

**Symptom**: Image or file URLs stop working after some time.

**Possible Causes**:
- Pre-signed URL expiration
- Object permissions changed
- S3 bucket policy changes

**Solutions**:
1. Generate new URLs when needed
2. Use longer expiration times for stable URLs
3. Use CloudFront distribution for persistent URLs

```typescript
// Get fresh URL for S3 object
const getRefreshedS3Url = async (key) => {
  try {
    // Get a new URL with 1-hour expiration
    const url = await Storage.getUrl(key, { 
      expires: 60 * 60 
    });
    return url;
  } catch (error) {
    console.error('Error refreshing S3 URL:', error);
    throw error;
  }
};
```

### File Access Permission Issues

**Symptom**: Users cannot access files they should have access to.

**Possible Causes**:
- Incorrect access level (public/protected/private)
- User not authorized for protected files
- S3 bucket policy restrictions

**Solutions**:
1. Verify correct access level is set during upload
2. Check user authentication before accessing protected files
3. Review and update S3 bucket policies if needed

## Environment Configuration Issues

### Missing Environment Variables

**Symptom**: Application fails with "Configuration missing" errors.

**Possible Causes**:
- Environment variables not set
- Environment variables not accessible to the application
- Incorrect naming of environment variables

**Solutions**:
1. Check `.env.local` file for required variables
2. Verify environment variables are properly exposed to the client
3. Ensure variable names match the expected format

```typescript
// Validate required environment variables
const validateEnvConfig = () => {
  const requiredVars = [
    'NEXT_PUBLIC_AWS_REGION',
    'NEXT_PUBLIC_AWS_USER_POOLS_ID',
    'NEXT_PUBLIC_AWS_USER_POOLS_WEB_CLIENT_ID',
    'NEXT_PUBLIC_APPSYNC_GRAPHQL_ENDPOINT'
  ];
  
  const missing = requiredVars.filter(
    varName => !process.env[varName]
  );
  
  if (missing.length > 0) {
    console.error('Missing environment variables:', missing);
    return false;
  }
  
  return true;
};
```

### Environment Mismatch

**Symptom**: Authentication works locally but fails in deployed environments.

**Possible Causes**:
- Different AWS configurations between environments
- Incorrect environment detection
- CORS configuration differences

**Solutions**:
1. Create environment-specific configuration files
2. Implement proper environment detection
3. Ensure consistent CORS settings across environments

## Deployment Issues

### Amplify Build Failures

**Symptom**: AWS Amplify deployment fails during build.

**Possible Causes**:
- Missing dependencies
- Environment configuration issues
- TypeScript errors
- Resource limitations

**Solutions**:
1. Check build logs for specific errors
2. Ensure all dependencies are properly installed
3. Fix TypeScript errors before deployment
4. Adjust build settings for resource-intensive builds

### Post-Deployment Authentication Issues

**Symptom**: Authentication fails after successful deployment.

**Possible Causes**:
- CORS configuration
- Cognito settings mismatch
- Redirect URL issues

**Solutions**:
1. Verify CORS settings for authentication endpoints
2. Check Cognito app client settings for correct callback URLs
3. Ensure redirect URLs match the deployed domain

### API Connection Issues

**Symptom**: API calls fail in production but work in development.

**Possible Causes**:
- API endpoint mismatch
- API key issues
- Network configuration differences

**Solutions**:
1. Verify API endpoints are correctly configured for the environment
2. Check API key validity and permissions
3. Test network connectivity to API endpoints

## Performance Issues

### Slow Authentication

**Symptom**: Authentication process takes a long time to complete.

**Possible Causes**:
- Network latency to Cognito endpoints
- Excessive token validation
- Synchronous operations blocking the UI

**Solutions**:
1. Implement loading indicators during authentication
2. Minimize token validation frequency
3. Use asynchronous operations for auth flows

### Delayed API Responses

**Symptom**: API calls take a long time to complete.

**Possible Causes**:
- Missing or inefficient caching
- Complex GraphQL queries
- API backend performance issues

**Solutions**:
1. Implement proper caching with React Query
2. Optimize GraphQL queries to request only needed fields
3. Add performance monitoring to track API response times

```typescript
// Monitor API performance
const measureApiPerformance = async (operationName, apiCall) => {
  const startTime = performance.now();
  
  try {
    const result = await apiCall();
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    console.log(`${operationName} completed in ${duration.toFixed(2)}ms`);
    
    // Log to monitoring system in production
    if (process.env.NODE_ENV === 'production') {
      // Example: logApiMetric(operationName, duration);
    }
    
    return result;
  } catch (error) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    console.error(`${operationName} failed after ${duration.toFixed(2)}ms:`, error);
    throw error;
  }
};
```

### Slow File Operations

**Symptom**: File uploads or downloads are very slow.

**Possible Causes**:
- Large file sizes
- Single-part uploads for large files
- Network bottlenecks

**Solutions**:
1. Implement client-side file compression
2. Use multi-part uploads for large files
3. Add progress indicators for file operations

## Security Concerns

### Token Exposure

**Symptom**: Authentication tokens potentially exposed.

**Possible Causes**:
- Insecure storage mechanisms
- Tokens included in logs
- Frontend code exposing tokens

**Solutions**:
1. Use secure storage for tokens (e.g., HttpOnly cookies where possible)
2. Sanitize logs to remove sensitive information
3. Implement token rotation and short expiration times

### Unauthorized API Access

**Symptom**: Evidence of unauthorized API access attempts.

**Possible Causes**:
- Weak authorization checks
- Missing or improper CORS settings
- Exposed API keys

**Solutions**:
1. Implement robust authorization checks for all API endpoints
2. Configure proper CORS settings to restrict unauthorized domains
3. Use short-lived, scoped API keys with proper rotation

```typescript
// Check user authorization for protected operations
const checkUserAuthorization = (user, requiredRole) => {
  if (!user) {
    return false;
  }
  
  const userRoles = user.roles || [];
  
  // Check if user has the required role
  if (requiredRole && !userRoles.includes(requiredRole)) {
    return false;
  }
  
  return true;
};
```

### Insecure File Access

**Symptom**: Unauthorized users can access protected files.

**Possible Causes**:
- Incorrect S3 bucket policies
- File uploaded with wrong access level
- Missing authentication checks

**Solutions**:
1. Verify and update S3 bucket policies
2. Ensure files are uploaded with correct access levels
3. Implement authentication checks before generating file URLs

## Advanced Debugging Techniques

### Enabling Amplify Debug Logs

For detailed debugging of AWS Amplify operations:

```typescript
// Enable debug logs in Amplify
import { Amplify } from 'aws-amplify';

Amplify.configure({
  ...config,
  Logging: {
    logLevel: 'DEBUG',
  }
});
```

### Network Request Inspection

To monitor all API and authentication network requests:

1. Open browser developer tools
2. Go to the Network tab
3. Filter requests by:
   - `cognito` for authentication calls
   - `appsync` for GraphQL calls
   - `amazonaws.com` for S3 operations

### Troubleshooting Authentication Flow

To debug the complete authentication flow:

```typescript
// Debug authentication flow
const debugAuthFlow = async (username, password) => {
  console.log('Starting auth flow debug...');
  
  try {
    console.log('Attempting sign in...');
    const signInResult = await Auth.signIn({ username, password });
    console.log('Sign in result:', signInResult);
    
    console.log('Checking current user...');
    const currentUser = await Auth.getCurrentUser();
    console.log('Current user:', currentUser);
    
    return {
      success: true,
      signInResult,
      currentUser
    };
  } catch (error) {
    console.error('Auth flow error:', error);
    return {
      success: false,
      error
    };
  }
};
```

## Contacting Support

If you've tried the troubleshooting steps above and still have issues:

1. **Internal Teams**: Contact the AWS platform team with:
   - Description of the issue
   - Steps to reproduce
   - Environment details
   - Relevant error messages and logs

2. **AWS Support**: For critical production issues, contact AWS Support with:
   - AWS account ID
   - Resource identifiers (Cognito User Pool ID, AppSync API ID)
   - Error messages and timestamps
   - Description of the problem and business impact