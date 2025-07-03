# Authentication & Role-Based Access Control Integration

**Document Version**: v1.0  
**Created**: July 2, 2025  
**Last Updated**: July 2, 2025  
**Status**: ✅ ACTIVE & CURRENT  
**Implementation Date**: July 2, 2025  
**Author**: Claude AI Assistant  
**Platform Version**: PROP.ie Enterprise v2025.07  

---

## Overview

The enterprise document management system now includes comprehensive authentication and role-based access control (RBAC) integration.

## Implementation Details

### 1. Authentication Middleware

**File**: `/src/lib/middleware/simple-auth.ts`

- Integrates with existing JWT authentication system
- Extracts and verifies Bearer tokens from request headers
- Fetches user details and roles from PostgreSQL database
- Provides simple role-based access control

### 2. Protected API Endpoints

All document management API endpoints are now protected:

#### Document Templates (`/api/documents/templates`)
- **GET**: Requires `DEVELOPER`, `PROJECT_MANAGER`, `ARCHITECT`, or `ADMIN` role
- **POST**: Requires `DEVELOPER`, `PROJECT_MANAGER`, or `ADMIN` role  
- **PUT**: Requires `DEVELOPER`, `PROJECT_MANAGER`, or `ADMIN` role

#### Document Automation (`/api/documents/automation`)
- **GET**: Requires `DEVELOPER`, `PROJECT_MANAGER`, or `ADMIN` role
- **POST**: Requires `DEVELOPER`, `PROJECT_MANAGER`, or `ADMIN` role
- **PUT**: Requires `DEVELOPER`, `PROJECT_MANAGER`, or `ADMIN` role

#### Document Workflows (`/api/documents/workflows`)
- **GET**: Requires `DEVELOPER`, `PROJECT_MANAGER`, or `ADMIN` role
- **POST**: Requires `DEVELOPER`, `PROJECT_MANAGER`, or `ADMIN` role
- **PUT**: Requires `DEVELOPER`, `PROJECT_MANAGER`, or `ADMIN` role

#### Compliance Tracking (`/api/documents/compliance`)
- **GET**: Requires `DEVELOPER`, `PROJECT_MANAGER`, `LEGAL`, or `ADMIN` role
- **POST**: Requires `DEVELOPER`, `PROJECT_MANAGER`, `LEGAL`, or `ADMIN` role
- **PUT**: Requires `DEVELOPER`, `PROJECT_MANAGER`, `LEGAL`, or `ADMIN` role

#### Drawing Management (`/api/documents/drawings`)
- **GET**: Requires `DEVELOPER`, `ARCHITECT`, `ENGINEER`, or `ADMIN` role
- **POST**: Requires `DEVELOPER`, `ARCHITECT`, `ENGINEER`, or `ADMIN` role

### 3. User Roles & Permissions

Based on the existing `UserRole` enum in the database schema:

#### Administrative Roles
- **ADMIN**: Full access to all document management features
- **PROJECT_MANAGER**: Access to most document features, workflow management

#### Technical Roles  
- **DEVELOPER**: Full access to templates, documents, workflows, compliance
- **ARCHITECT**: Access to templates, documents, drawings, workflows
- **ENGINEER**: Access to templates, documents, drawings
- **QUANTITY_SURVEYOR**: Access to templates, documents, workflows

#### Legal & Compliance
- **LEGAL**: Access to templates, documents, workflows, compliance
- **SOLICITOR**: Read access to templates, documents, compliance

#### Business Roles
- **AGENT**: Read access to templates and documents
- **BUYER**: Read access to documents only
- **INVESTOR**: Read access to templates and documents

### 4. Authentication Flow

1. **Client Authentication**: 
   - Use existing `/api/auth/enterprise/login` endpoint
   - Receive JWT access token
   - Store token for API calls

2. **API Request Authentication**:
   - Include `Authorization: Bearer <token>` header
   - Middleware verifies token and extracts user info
   - Role-based access control applied

3. **Token Refresh**:
   - Use existing `/api/auth/enterprise/refresh` endpoint
   - Refresh tokens before expiration

### 5. Frontend Integration

The frontend components have been updated to:

- Pass authentication headers with API calls
- Handle authentication errors (401/403)
- Display user context in responses
- Provide role-based UI features

### 6. Security Features

- **JWT Token Verification**: All tokens verified against secret
- **Role-Based Access**: Fine-grained permissions per endpoint
- **Database Integration**: Real-time user status and role checks
- **Error Handling**: Secure error messages, no sensitive data exposure
- **Admin Override**: Admin role has access to all features

### 7. Environment Variables

Required environment variables:

```bash
# JWT Configuration (already exists)
JWT_SECRET=your-jwt-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key

# Database Connection (already exists)
DATABASE_URL=postgresql://username:password@localhost:5432/propie_production
```

### 8. Usage Examples

#### Frontend API Call with Auth

```typescript
// Example: Fetching templates with authentication
const response = await fetch('/api/documents/templates?category=PLANNING', {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }
});

if (response.status === 401) {
  // Handle authentication required
  redirectToLogin();
} else if (response.status === 403) {
  // Handle insufficient permissions
  showPermissionError();
}
```

#### Error Responses

```json
// 401 - Authentication Required
{
  "error": "Authentication required",
  "message": "Please login to access this resource"
}

// 403 - Insufficient Permissions  
{
  "error": "Insufficient permissions",
  "message": "Required roles: DEVELOPER, PROJECT_MANAGER, ADMIN"
}
```

### 9. Testing Authentication

1. **Login**: POST to `/api/auth/enterprise/login`
2. **Get Token**: Extract `accessToken` from response
3. **Test Protected Endpoint**: Call any `/api/documents/*` endpoint with Bearer token
4. **Verify Role Access**: Test with different user roles

### 10. Next Steps

- ✅ Basic authentication middleware implemented
- ✅ Role-based access control configured
- ✅ All document endpoints protected
- ✅ Frontend integration started

**Future Enhancements**:
- Resource-level permissions (e.g., user can only access own projects)
- Audit logging for document operations
- Multi-factor authentication for sensitive operations
- API rate limiting per user/role
- Session management and concurrent login controls

---

## Document Change Log

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| July 2, 2025 | v1.0 | Initial implementation of authentication & RBAC for document management system | Claude AI |

---

**Status**: ✅ **COMPLETED** - Authentication and RBAC successfully integrated into enterprise document management system.

**Next Review Date**: August 2, 2025  
**Supersedes**: None (Initial implementation)  
**Related Documents**: 
- `/docs/AUTH_SERVICE_USAGE.md` (if exists)
- `/docs/AUTHENTICATION_FLOW.md` (if exists)
- `/DEV_AUTH_GUIDE.md` (if exists)