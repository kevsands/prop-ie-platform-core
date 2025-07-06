# AWS Integration Architecture & Documentation

## Table of Contents

1. [Overview](#overview)
2. [Authentication Flow](#authentication-flow)
3. [API Integration](#api-integration)
4. [Storage Integration](#storage-integration)
5. [Environment Configuration](#environment-configuration)
6. [Integration Architecture](#integration-architecture)
7. [Troubleshooting](#troubleshooting)
8. [Performance Considerations](#performance-considerations)
9. [Security Best Practices](#security-best-practices)
10. [Future Improvements](#future-improvements)

## Overview

The PropIE AWS App integrates with several AWS services through AWS Amplify v6, providing a comprehensive solution for authentication, API access, and storage management.

### Key AWS Services

- **Authentication**: AWS Cognito User Pools
- **API**: AWS AppSync GraphQL API and REST APIs
- **Storage**: Amazon S3

### Architecture Components

The AWS integration follows a modular approach with clear separation of concerns:

- **src/lib/amplify/index.ts**: Central entry point and initialization
- **src/lib/amplify/auth.ts**: Authentication service
- **src/lib/amplify/api.ts**: API client service
- **src/lib/amplify/storage.ts**: Storage service
- **src/lib/amplify/config.ts**: AWS configuration

This architecture provides a consistent interface to AWS services while abstracting away the complexity of direct service interactions.

## Authentication Flow

The PropIE application uses AWS Cognito for authentication, providing secure user management and access control.

### User Sign-In Flow

1. User enters credentials in the login form
2. Application calls `Auth.signIn()` with credentials
3. AWS Cognito validates credentials
4. On success, Cognito returns tokens (ID, Access, Refresh)
5. Application stores tokens securely
6. User attributes and groups are fetched and mapped to application roles
7. Authentication state is updated in the AuthContext

### User Registration Flow

1. User enters registration information
2. Application calls `Auth.signUp()` with user details
3. AWS Cognito creates a new unconfirmed user
4. Confirmation code is sent to user's email
5. User enters confirmation code
6. Application calls `Auth.confirmSignUp()` with code
7. User account is confirmed and ready for login

### Token Management

- **Token Storage**: Secure storage with proper expiration
- **Token Refresh**: Automatic refresh of tokens before expiration
- **Session Management**: Persistent sessions with proper logout handling

### Multi-Factor Authentication (MFA)

The system supports MFA through the following methods:

- SMS-based verification
- Email-based verification
- Authenticator app (TOTP)

### Role-Based Access Control

User roles are derived from Cognito user groups:

- **Admin**: Full system access
- **Developer**: Property development and management
- **Agent**: Property listing and sales management
- **Buyer**: Property viewing and purchase management
- **Solicitor**: Legal document management

## API Integration

### GraphQL API

The application uses AWS AppSync for GraphQL operations:

```typescript
// Example of GraphQL query using the API module
const getDevelopments = async () => {
  const query = `
    query ListDevelopments {
      listDevelopments(limit: 10) {
        items {
          id
          name
          location
          status
        }
      }
    }
  `;
  
  try {
    const result = await API.graphql({ query });
    return result.listDevelopments.items;
  } catch (error) {
    console.error("Error fetching developments:", error);
    throw error;
  }
};
```

### REST API

For REST endpoints, the application uses a consistent approach:

```typescript
// Example of REST API call using the API module
const getPropertyById = async (id) => {
  try {
    const result = await API.rest(`/properties/${id}`);
    return result;
  } catch (error) {
    console.error(`Error fetching property ${id}:`, error);
    throw error;
  }
};
```

### Error Handling

The API module implements consistent error handling:

1. Network errors are detected and reported
2. Authentication errors trigger token refresh or re-authentication
3. GraphQL-specific errors are parsed and presented meaningfully
4. REST API errors are standardized with proper HTTP status handling

### Caching Strategy

The application uses React Query for efficient data management:

1. Query results are cached based on query keys
2. Cache invalidation occurs on mutations
3. Background refetching keeps data fresh
4. Stale-while-revalidate strategy provides optimal UX

## Storage Integration

The application uses Amazon S3 for file storage:

### File Upload

```typescript
// Example of file upload
const uploadPropertyImage = async (file, propertyId) => {
  try {
    const key = `properties/${propertyId}/${file.name}`;
    await Storage.upload(file, key, {
      contentType: file.type,
      metadata: { propertyId }
    });
    
    // Get the URL for the uploaded file
    const imageUrl = await Storage.getUrl(key);
    return imageUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};
```

### Access Control

Files are stored with appropriate access levels:

- **Public**: Generally accessible (e.g., property images)
- **Protected**: User-specific files, accessible by the owner
- **Private**: Sensitive documents with restricted access

### File Types and Limitations

The system handles various file types with specific limitations:

- **Images**: JPEG, PNG, WebP (max 10MB)
- **Documents**: PDF, DOCX, XLSX (max 20MB)
- **Plans**: PDF, DWG (max 50MB)

## Environment Configuration

AWS configuration is managed through environment variables to ensure security and flexibility:

### Required Environment Variables

```
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_AWS_USER_POOLS_ID=us-east-1_XXXXXXXXX
NEXT_PUBLIC_AWS_USER_POOLS_WEB_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_AWS_COGNITO_IDENTITY_POOL_ID=us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
NEXT_PUBLIC_APPSYNC_GRAPHQL_ENDPOINT=https://xxxxxxxxxxxxxxxxxxxxxxxxxx.appsync-api.us-east-1.amazonaws.com/graphql
NEXT_PUBLIC_S3_BUCKET=propieawsapp-storage-xxxxxxxx-dev
```

### Environment-Specific Configuration

The application supports different environments through specific configurations:

- **Development**: Local development with AWS services
- **Testing**: Isolated testing environment
- **Staging**: Pre-production environment for final testing
- **Production**: Live production environment

## Integration Architecture

The AWS integration follows a layered architecture:

### Layer 1: Core Services

The lowest layer directly interacts with AWS services:

- **Auth**: Cognito User Pools and Identity Pools
- **API**: AppSync GraphQL API and REST APIs
- **Storage**: S3 storage service

### Layer 2: Service Modules

These modules provide domain-specific functionality:

- **DevelopmentService**: Property development operations
- **PropertyService**: Property management operations
- **UserService**: User management operations
- **DocumentService**: Document management operations

### Layer 3: React Hooks and Context

This layer provides React components with access to AWS services:

- **useAuth**: Authentication state and operations
- **useGraphQL**: GraphQL queries and mutations
- **useStorage**: File storage operations

### Layer 4: UI Components

The top layer consumes AWS services through hooks and context:

- **LoginForm**: User authentication
- **PropertyUploader**: Property image uploads
- **DevelopmentList**: Development data fetching and display

## Troubleshooting

### Common Authentication Issues

1. **Token Expiration**
   - **Symptom**: Sudden 401 errors after period of inactivity
   - **Solution**: Implement proper token refresh handling

2. **Cross-Browser Auth Issues**
   - **Symptom**: Authentication works in some browsers but not others
   - **Solution**: Ensure consistent localStorage/cookieStorage availability

3. **MFA Challenges**
   - **Symptom**: Users unable to complete MFA challenge
   - **Solution**: Provide proper error messages and fallback options

### GraphQL API Issues

1. **Schema Validation Errors**
   - **Symptom**: GraphQL operations fail with validation errors
   - **Solution**: Ensure query/mutation structure matches schema

2. **Authorization Errors**
   - **Symptom**: Queries return 401/403 errors
   - **Solution**: Verify user has appropriate Cognito groups/roles

3. **Pagination Issues**
   - **Symptom**: Incomplete data sets or duplicate items
   - **Solution**: Properly implement nextToken handling

### Storage Issues

1. **CORS Errors**
   - **Symptom**: File uploads fail with CORS errors
   - **Solution**: Configure proper CORS settings on S3 bucket

2. **File Size Limitations**
   - **Symptom**: Large file uploads fail
   - **Solution**: Implement multi-part uploads for large files

3. **URL Expiration**
   - **Symptom**: S3 URLs stop working after period of time
   - **Solution**: Generate new URLs when needed or extend expiration

## Performance Considerations

### Authentication Optimization

1. **Token Caching**: Cache authentication tokens appropriately
2. **Minimize Re-Authentication**: Refresh tokens instead of full re-authentication
3. **Parallel Auth Operations**: Perform auth checks in parallel when possible

### API Optimization

1. **Query Batching**: Group related queries to reduce network requests
2. **Selective Field Selection**: Request only needed fields
3. **Connection Pooling**: Reuse API connections when possible
4. **Offline Support**: Implement offline capability for critical operations

### Storage Optimization

1. **Image Compression**: Compress images before upload
2. **Progressive Loading**: Implement progressive loading for large assets
3. **CDN Integration**: Use CloudFront distribution for S3 assets
4. **Lazy Loading**: Load assets only when needed in the UI

## Security Best Practices

### Authentication Security

1. **Secure Token Storage**: Use appropriate storage mechanisms for tokens
2. **MFA Enforcement**: Require MFA for sensitive operations
3. **Session Timeout**: Implement proper session timeouts
4. **Password Policies**: Enforce strong password requirements

### API Security

1. **Input Validation**: Validate all inputs before sending to API
2. **Rate Limiting**: Implement API rate limiting
3. **Error Masking**: Avoid leaking sensitive information in error messages
4. **Request Signing**: Sign all API requests when possible

### Storage Security

1. **Client-Side Encryption**: Encrypt sensitive files before upload
2. **Access Control**: Properly configure S3 bucket policies
3. **Temporary URLs**: Generate time-limited URLs for file access
4. **Content Verification**: Scan uploads for malware/viruses

## Future Improvements

1. **Enhanced Authentication**
   - Support for social login providers
   - Advanced MFA options (biometric, security keys)
   - Account recovery workflow improvements

2. **Advanced API Features**
   - Real-time subscriptions for critical data
   - Improved offline support with conflict resolution
   - Federated API access across multiple AWS accounts

3. **Storage Enhancements**
   - Enhanced file versioning
   - Automated image optimization pipeline
   - Integration with AWS Rekognition for image analysis

4. **Performance Optimizations**
   - Implement comprehensive performance monitoring
   - Edge computing with AWS Lambda@Edge
   - Advanced caching strategies