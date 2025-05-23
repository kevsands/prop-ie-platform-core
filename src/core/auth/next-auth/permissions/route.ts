// Permissions Check API Routes
import { NextRequest, NextResponse } from 'next/server';
import authService from '@/services/authService';
import { z } from 'zod';

// Error type guard
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

// Validation schema
const checkPermissionSchema = z.object({
  resource: z.string(),
  action: z.string()
});

// POST /api/auth/permissions - Check user permissions
export async function POST(request: NextRequest) {
  try {
    const authorization = request.headers.get('authorization');

    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const token = authorization.substring(7);
    const body: any = await request.json();

    try {
      const payload = await authService.verifyToken(token);

      // Validate request
      const validatedData = checkPermissionSchema.parse(body);

      // Check permission
      const hasPermission = await authService.checkPermission(
        payload.userId,
        validatedData.resource,
        validatedData.action
      );

      return NextResponse.json({ 
        success: true, 
        data: {
          hasPermission,
          userId: payload.userId,
          resource: validatedData.resource,
          action: validatedData.action
        }
      });
    } catch (error) {
      // For token verification errors, always return 'Invalid token'
      // to avoid exposing internal verification failure details
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    const message = getErrorMessage(error) || 'Permission check failed';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

// GET /api/auth/permissions - Get all permissions for current user
export async function GET(request: NextRequest) {
  try {
    const authorization = request.headers.get('authorization');

    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const token = authorization.substring(7);

    try {
      const payload = await authService.verifyToken(token);
      const user = await authService.getUserById(payload.userId);

      if (!user) {
        return NextResponse.json(
          { success: false, error: 'User not found' },
          { status: 404 }
        );
      }

      // Define type for role permissions
      type RolePermissions = Record<string, Record<string, string[]>>\n  );
      // Get all permissions for user's roles
      const rolePermissions: RolePermissions = {
        ADMIN: {
          '*': ['*']
        },
        DEVELOPER: {
          developments: ['create', 'read', 'update', 'delete'],
          units: ['create', 'read', 'update', 'delete'],
          transactions: ['read', 'update'],
          analytics: ['read']
        },
        BUYER: {
          transactions: ['create', 'read'],
          DevelopmentDocument: ['read', 'sign'],
          payments: ['create', 'read']
        },
        SOLICITOR: {
          transactions: ['read', 'update'],
          DevelopmentDocument: ['create', 'read', 'update', 'sign'],
          kyc: ['create', 'read', 'update']
        },
        AGENT: {
          developments: ['read'],
          units: ['read'],
          transactions: ['create', 'read'],
          analytics: ['read']
        },
        ARCHITECT: {
          developments: ['read', 'update'],
          DevelopmentDocument: ['create', 'read', 'upload'],
          tasks: ['create', 'update']
        },
        CONTRACTOR: {
          developments: ['read'],
          tasks: ['read', 'update'],
          DevelopmentDocument: ['upload']
        },
        INVESTOR: {
          developments: ['read'],
          units: ['read'],
          transactions: ['read'],
          analytics: ['read'],
          payments: ['read'],
          DevelopmentDocument: ['read'],
          investments: ['create', 'read', 'update']
        },
        ENGINEER: {
          developments: ['read', 'update'],
          units: ['read', 'update'],
          DevelopmentDocument: ['create', 'read', 'update', 'upload'],
          tasks: ['create', 'read', 'update'],
          analytics: ['read'],
          inspections: ['create', 'read', 'update']
        },
        QUANTITY_SURVEYOR: {
          developments: ['read'],
          units: ['read'],
          DevelopmentDocument: ['create', 'read', 'update', 'upload'],
          analytics: ['read'],
          costEstimates: ['create', 'read', 'update'],
          boq: ['create', 'read', 'update']
        },
        LEGAL: {
          DevelopmentDocument: ['create', 'read', 'update', 'sign'],
          transactions: ['read', 'update'],
          compliance: ['create', 'read', 'update'],
          contracts: ['create', 'read', 'update', 'sign'],
          kyc: ['read'],
          analytics: ['read']
        },
        PROJECT_MANAGER: {
          developments: ['create', 'read', 'update'],
          units: ['create', 'read', 'update'],
          tasks: ['create', 'read', 'update', 'delete'],
          DevelopmentDocument: ['create', 'read', 'update', 'upload'],
          analytics: ['read'],
          tenders: ['create', 'read', 'update'],
          transactions: ['read']
        }
      };

      // Define type for the combined permissions object
      type PermissionsMap = Record<string, string[]>\n  );
      // Merge permissions from all user roles
      let combinedPermissions: PermissionsMap = {};

      for (const role of user.roles) {
        const permissions = rolePermissions[role];
        if (permissions) {
          // If admin role is present, return admin permissions only
          if (role === 'ADMIN') {
            combinedPermissions = permissions;
            break;
          }

          // Merge permissions from this role
          for (const resource in permissions) {
            if (!combinedPermissions[resource]) {
              combinedPermissions[resource] = [];
            }
            // Add unique actions
            combinedPermissions[resource] = [...new Set([...combinedPermissions[resource], ...permissions[resource]])];
          }
        }
      }

      return NextResponse.json({ 
        success: true, 
        data: {
          roles: user.roles,
          permissions: combinedPermissions
        }
      });
    } catch (error) {
      // For token verification errors, always return 'Invalid token'
      // to avoid exposing internal verification failure details
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }
  } catch (error) {
    const message = getErrorMessage(error) || 'Failed to get permissions';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}