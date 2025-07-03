import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AuthenticatedUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  status: string;
  organization?: string;
  position?: string;
}

export interface AuthenticatedRequest extends NextRequest {
  user?: AuthenticatedUser;
}

// Document management permissions
export const DOCUMENT_PERMISSIONS = {
  // Template permissions
  TEMPLATE_CREATE: 'document:template:create',
  TEMPLATE_READ: 'document:template:read',
  TEMPLATE_UPDATE: 'document:template:update',
  TEMPLATE_DELETE: 'document:template:delete',
  
  // Document permissions
  DOCUMENT_CREATE: 'document:create',
  DOCUMENT_READ: 'document:read',
  DOCUMENT_UPDATE: 'document:update',
  DOCUMENT_DELETE: 'document:delete',
  
  // Workflow permissions
  WORKFLOW_CREATE: 'document:workflow:create',
  WORKFLOW_MANAGE: 'document:workflow:manage',
  WORKFLOW_APPROVE: 'document:workflow:approve',
  
  // Compliance permissions
  COMPLIANCE_CREATE: 'document:compliance:create',
  COMPLIANCE_READ: 'document:compliance:read',
  COMPLIANCE_UPDATE: 'document:compliance:update',
  
  // Drawing permissions
  DRAWING_CREATE: 'document:drawing:create',
  DRAWING_READ: 'document:drawing:read',
  DRAWING_UPDATE: 'document:drawing:update',
  
  // Admin permissions
  ADMIN_ALL: 'document:admin:all',
  
  // Messaging permissions
  MESSAGE_CREATE: 'message:create',
  MESSAGE_READ: 'message:read',
  MESSAGE_UPDATE: 'message:update',
  MESSAGE_DELETE: 'message:delete',
  
  // Conversation permissions
  CONVERSATION_CREATE: 'conversation:create',
  CONVERSATION_READ: 'conversation:read',
  CONVERSATION_MANAGE: 'conversation:manage',
  CONVERSATION_ARCHIVE: 'conversation:archive',
  
  // Routing permissions
  ROUTING_CREATE: 'routing:create',
  ROUTING_MANAGE: 'routing:manage',
  ROUTING_READ: 'routing:read',
  
  // Notification permissions
  NOTIFICATION_CREATE: 'notification:create',
  NOTIFICATION_READ: 'notification:read',
  NOTIFICATION_MANAGE: 'notification:manage'
} as const;

// Role-based permission mappings
export const ROLE_PERMISSIONS = {
  ADMIN: [
    DOCUMENT_PERMISSIONS.ADMIN_ALL,
    DOCUMENT_PERMISSIONS.TEMPLATE_CREATE,
    DOCUMENT_PERMISSIONS.TEMPLATE_READ,
    DOCUMENT_PERMISSIONS.TEMPLATE_UPDATE,
    DOCUMENT_PERMISSIONS.TEMPLATE_DELETE,
    DOCUMENT_PERMISSIONS.DOCUMENT_CREATE,
    DOCUMENT_PERMISSIONS.DOCUMENT_READ,
    DOCUMENT_PERMISSIONS.DOCUMENT_UPDATE,
    DOCUMENT_PERMISSIONS.DOCUMENT_DELETE,
    DOCUMENT_PERMISSIONS.WORKFLOW_CREATE,
    DOCUMENT_PERMISSIONS.WORKFLOW_MANAGE,
    DOCUMENT_PERMISSIONS.WORKFLOW_APPROVE,
    DOCUMENT_PERMISSIONS.COMPLIANCE_CREATE,
    DOCUMENT_PERMISSIONS.COMPLIANCE_READ,
    DOCUMENT_PERMISSIONS.COMPLIANCE_UPDATE,
    DOCUMENT_PERMISSIONS.DRAWING_CREATE,
    DOCUMENT_PERMISSIONS.DRAWING_READ,
    DOCUMENT_PERMISSIONS.DRAWING_UPDATE,
    // Messaging permissions for admin
    DOCUMENT_PERMISSIONS.MESSAGE_CREATE,
    DOCUMENT_PERMISSIONS.MESSAGE_READ,
    DOCUMENT_PERMISSIONS.MESSAGE_UPDATE,
    DOCUMENT_PERMISSIONS.MESSAGE_DELETE,
    DOCUMENT_PERMISSIONS.CONVERSATION_CREATE,
    DOCUMENT_PERMISSIONS.CONVERSATION_READ,
    DOCUMENT_PERMISSIONS.CONVERSATION_MANAGE,
    DOCUMENT_PERMISSIONS.CONVERSATION_ARCHIVE,
    DOCUMENT_PERMISSIONS.ROUTING_CREATE,
    DOCUMENT_PERMISSIONS.ROUTING_MANAGE,
    DOCUMENT_PERMISSIONS.ROUTING_READ,
    DOCUMENT_PERMISSIONS.NOTIFICATION_CREATE,
    DOCUMENT_PERMISSIONS.NOTIFICATION_READ,
    DOCUMENT_PERMISSIONS.NOTIFICATION_MANAGE
  ],
  DEVELOPER: [
    DOCUMENT_PERMISSIONS.TEMPLATE_CREATE,
    DOCUMENT_PERMISSIONS.TEMPLATE_READ,
    DOCUMENT_PERMISSIONS.TEMPLATE_UPDATE,
    DOCUMENT_PERMISSIONS.DOCUMENT_CREATE,
    DOCUMENT_PERMISSIONS.DOCUMENT_READ,
    DOCUMENT_PERMISSIONS.DOCUMENT_UPDATE,
    DOCUMENT_PERMISSIONS.WORKFLOW_CREATE,
    DOCUMENT_PERMISSIONS.WORKFLOW_MANAGE,
    DOCUMENT_PERMISSIONS.COMPLIANCE_CREATE,
    DOCUMENT_PERMISSIONS.COMPLIANCE_READ,
    DOCUMENT_PERMISSIONS.COMPLIANCE_UPDATE,
    DOCUMENT_PERMISSIONS.DRAWING_CREATE,
    DOCUMENT_PERMISSIONS.DRAWING_READ,
    DOCUMENT_PERMISSIONS.DRAWING_UPDATE,
    // Messaging permissions for developers
    DOCUMENT_PERMISSIONS.MESSAGE_CREATE,
    DOCUMENT_PERMISSIONS.MESSAGE_READ,
    DOCUMENT_PERMISSIONS.MESSAGE_UPDATE,
    DOCUMENT_PERMISSIONS.CONVERSATION_CREATE,
    DOCUMENT_PERMISSIONS.CONVERSATION_READ,
    DOCUMENT_PERMISSIONS.CONVERSATION_MANAGE,
    DOCUMENT_PERMISSIONS.ROUTING_CREATE,
    DOCUMENT_PERMISSIONS.ROUTING_MANAGE,
    DOCUMENT_PERMISSIONS.ROUTING_READ,
    DOCUMENT_PERMISSIONS.NOTIFICATION_CREATE,
    DOCUMENT_PERMISSIONS.NOTIFICATION_READ
  ],
  PROJECT_MANAGER: [
    DOCUMENT_PERMISSIONS.TEMPLATE_READ,
    DOCUMENT_PERMISSIONS.TEMPLATE_UPDATE,
    DOCUMENT_PERMISSIONS.DOCUMENT_CREATE,
    DOCUMENT_PERMISSIONS.DOCUMENT_READ,
    DOCUMENT_PERMISSIONS.DOCUMENT_UPDATE,
    DOCUMENT_PERMISSIONS.WORKFLOW_CREATE,
    DOCUMENT_PERMISSIONS.WORKFLOW_MANAGE,
    DOCUMENT_PERMISSIONS.COMPLIANCE_READ,
    DOCUMENT_PERMISSIONS.COMPLIANCE_UPDATE,
    DOCUMENT_PERMISSIONS.DRAWING_READ,
    DOCUMENT_PERMISSIONS.DRAWING_UPDATE
  ],
  ARCHITECT: [
    DOCUMENT_PERMISSIONS.TEMPLATE_READ,
    DOCUMENT_PERMISSIONS.DOCUMENT_CREATE,
    DOCUMENT_PERMISSIONS.DOCUMENT_READ,
    DOCUMENT_PERMISSIONS.DOCUMENT_UPDATE,
    DOCUMENT_PERMISSIONS.WORKFLOW_CREATE,
    DOCUMENT_PERMISSIONS.DRAWING_CREATE,
    DOCUMENT_PERMISSIONS.DRAWING_READ,
    DOCUMENT_PERMISSIONS.DRAWING_UPDATE,
    // Messaging permissions for architects
    DOCUMENT_PERMISSIONS.MESSAGE_CREATE,
    DOCUMENT_PERMISSIONS.MESSAGE_READ,
    DOCUMENT_PERMISSIONS.CONVERSATION_CREATE,
    DOCUMENT_PERMISSIONS.CONVERSATION_READ,
    DOCUMENT_PERMISSIONS.NOTIFICATION_READ
  ],
  ENGINEER: [
    DOCUMENT_PERMISSIONS.TEMPLATE_READ,
    DOCUMENT_PERMISSIONS.DOCUMENT_CREATE,
    DOCUMENT_PERMISSIONS.DOCUMENT_READ,
    DOCUMENT_PERMISSIONS.DOCUMENT_UPDATE,
    DOCUMENT_PERMISSIONS.DRAWING_CREATE,
    DOCUMENT_PERMISSIONS.DRAWING_READ,
    DOCUMENT_PERMISSIONS.DRAWING_UPDATE,
    // Messaging permissions for engineers
    DOCUMENT_PERMISSIONS.MESSAGE_CREATE,
    DOCUMENT_PERMISSIONS.MESSAGE_READ,
    DOCUMENT_PERMISSIONS.CONVERSATION_CREATE,
    DOCUMENT_PERMISSIONS.CONVERSATION_READ,
    DOCUMENT_PERMISSIONS.NOTIFICATION_READ
  ],
  QUANTITY_SURVEYOR: [
    DOCUMENT_PERMISSIONS.TEMPLATE_READ,
    DOCUMENT_PERMISSIONS.DOCUMENT_CREATE,
    DOCUMENT_PERMISSIONS.DOCUMENT_READ,
    DOCUMENT_PERMISSIONS.DOCUMENT_UPDATE,
    DOCUMENT_PERMISSIONS.WORKFLOW_CREATE
  ],
  LEGAL: [
    DOCUMENT_PERMISSIONS.TEMPLATE_READ,
    DOCUMENT_PERMISSIONS.DOCUMENT_CREATE,
    DOCUMENT_PERMISSIONS.DOCUMENT_READ,
    DOCUMENT_PERMISSIONS.DOCUMENT_UPDATE,
    DOCUMENT_PERMISSIONS.WORKFLOW_APPROVE,
    DOCUMENT_PERMISSIONS.COMPLIANCE_CREATE,
    DOCUMENT_PERMISSIONS.COMPLIANCE_READ,
    DOCUMENT_PERMISSIONS.COMPLIANCE_UPDATE
  ],
  SOLICITOR: [
    DOCUMENT_PERMISSIONS.TEMPLATE_READ,
    DOCUMENT_PERMISSIONS.DOCUMENT_READ,
    DOCUMENT_PERMISSIONS.WORKFLOW_APPROVE,
    DOCUMENT_PERMISSIONS.COMPLIANCE_READ
  ],
  AGENT: [
    DOCUMENT_PERMISSIONS.TEMPLATE_READ,
    DOCUMENT_PERMISSIONS.DOCUMENT_READ,
    DOCUMENT_PERMISSIONS.WORKFLOW_CREATE
  ],
  BUYER: [
    DOCUMENT_PERMISSIONS.DOCUMENT_READ,
    // Messaging permissions for buyers
    DOCUMENT_PERMISSIONS.MESSAGE_CREATE,
    DOCUMENT_PERMISSIONS.MESSAGE_READ,
    DOCUMENT_PERMISSIONS.CONVERSATION_CREATE,
    DOCUMENT_PERMISSIONS.CONVERSATION_READ,
    DOCUMENT_PERMISSIONS.NOTIFICATION_READ
  ],
  INVESTOR: [
    DOCUMENT_PERMISSIONS.DOCUMENT_READ,
    DOCUMENT_PERMISSIONS.TEMPLATE_READ
  ]
};

export class AuthenticationError extends Error {
  constructor(message: string, public statusCode: number = 401) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends Error {
  constructor(message: string, public statusCode: number = 403) {
    super(message);
    this.name = 'AuthorizationError';
  }
}

/**
 * Extract JWT token from request headers
 */
function extractToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  
  return parts[1];
}

/**
 * Verify JWT token and get user data
 */
export async function verifyToken(token: string): Promise<AuthenticatedUser> {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    // Get user from database with roles
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        UserPermission: true,
        // Get roles from UserRoleMapping if needed
      }
    });
    
    if (!user || user.status !== 'ACTIVE') {
      throw new AuthenticationError('User not found or inactive');
    }
    
    // Get user roles from UserRoleMapping
    const roleMappings = await prisma.userRoleMapping.findMany({
      where: { userId: user.id }
    });
    
    const roles = roleMappings.map(mapping => mapping.role);
    
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles,
      status: user.status,
      organization: user.organization || undefined,
      position: user.position || undefined
    };
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AuthenticationError('Invalid token');
    }
    throw error;
  }
}

/**
 * Check if user has required permission
 */
export function hasPermission(user: AuthenticatedUser, permission: string): boolean {
  // Admin has all permissions
  if (user.roles.includes('ADMIN')) {
    return true;
  }
  
  // Check role-based permissions
  for (const role of user.roles) {
    const rolePermissions = ROLE_PERMISSIONS[role as keyof typeof ROLE_PERMISSIONS];
    if (rolePermissions && rolePermissions.includes(permission as any)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Check if user has any of the required roles
 */
export function hasAnyRole(user: AuthenticatedUser, roles: string[]): boolean {
  return roles.some(role => user.roles.includes(role));
}

/**
 * Middleware to authenticate requests
 */
export async function authenticateRequest(request: NextRequest): Promise<AuthenticatedUser> {
  const token = extractToken(request);
  
  if (!token) {
    throw new AuthenticationError('No authentication token provided');
  }
  
  return await verifyToken(token);
}

/**
 * Middleware to check specific permissions
 */
export async function requirePermission(request: NextRequest, permission: string): Promise<AuthenticatedUser> {
  const user = await authenticateRequest(request);
  
  if (!hasPermission(user, permission)) {
    throw new AuthorizationError(`Insufficient permissions. Required: ${permission}`);
  }
  
  return user;
}

/**
 * Middleware to check role requirements
 */
export async function requireRole(request: NextRequest, roles: string[]): Promise<AuthenticatedUser> {
  const user = await authenticateRequest(request);
  
  if (!hasAnyRole(user, roles)) {
    throw new AuthorizationError(`Insufficient roles. Required one of: ${roles.join(', ')}`);
  }
  
  return user;
}

/**
 * Helper to create authenticated API response
 */
export function createAuthResponse(error: AuthenticationError | AuthorizationError): NextResponse {
  return NextResponse.json(
    {
      error: error.name,
      message: error.message,
      statusCode: error.statusCode
    },
    { status: error.statusCode }
  );
}

/**
 * Enhanced middleware factory for different auth requirements
 */
export function withAuth(
  handler: (request: NextRequest, user: AuthenticatedUser) => Promise<NextResponse>,
  options: {
    permissions?: string[];
    roles?: string[];
    allowSelf?: boolean; // Allow access to own resources
  } = {}
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      let user: AuthenticatedUser;
      
      // Check permissions
      if (options.permissions && options.permissions.length > 0) {
        user = await requirePermission(request, options.permissions[0]);
        // Check additional permissions
        for (let i = 1; i < options.permissions.length; i++) {
          if (!hasPermission(user, options.permissions[i])) {
            throw new AuthorizationError(`Missing permission: ${options.permissions[i]}`);
          }
        }
      }
      // Check roles
      else if (options.roles && options.roles.length > 0) {
        user = await requireRole(request, options.roles);
      }
      // Basic authentication
      else {
        user = await authenticateRequest(request);
      }
      
      return await handler(request, user);
    } catch (error) {
      if (error instanceof AuthenticationError || error instanceof AuthorizationError) {
        return createAuthResponse(error);
      }
      
      console.error('Auth middleware error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

export default {
  authenticateRequest,
  requirePermission,
  requireRole,
  hasPermission,
  hasAnyRole,
  withAuth,
  DOCUMENT_PERMISSIONS,
  ROLE_PERMISSIONS
};