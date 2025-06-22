/**
 * Permission Management API Routes
 * 
 * Handles real-time permission checking, role assignment, and permission management
 */

import { NextRequest, NextResponse } from 'next/server';
import { permissionManagementService } from '@/services/permissionManagementService';
import { roleAssignmentService } from '@/services/roleAssignmentService';
import { Permission, UserRole } from '@/lib/permissions/ProfessionalPermissionMatrix';

// GET /api/auth/permissions - Get user permissions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const permission = searchParams.get('permission') as Permission;
    const action = searchParams.get('action');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'check':
        if (!permission) {
          return NextResponse.json(
            { error: 'Permission is required for check action' },
            { status: 400 }
          );
        }
        
        const result = await permissionManagementService.checkPermission({
          userId,
          permission,
          context: {
            resourceId: searchParams.get('resourceId') || undefined,
            resourceType: searchParams.get('resourceType') || undefined,
            projectId: searchParams.get('projectId') || undefined,
            transactionId: searchParams.get('transactionId') || undefined
          }
        });
        
        return NextResponse.json({ result });

      case 'context':
        const context = await permissionManagementService.getUserPermissionContext(userId);
        return NextResponse.json({ context });

      case 'audit':
        const limit = parseInt(searchParams.get('limit') || '100');
        const auditTrail = await permissionManagementService.getPermissionAuditTrail(userId, limit);
        return NextResponse.json({ auditTrail });

      case 'roles':
        const roleAssignments = await roleAssignmentService.getUserRoleAssignments(userId);
        return NextResponse.json({ roleAssignments });

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: check, context, audit, or roles' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Permission API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/auth/permissions - Request permissions or role assignments
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    switch (action) {
      case 'requestRole':
        const {
          userId,
          roleType,
          assignmentType = 'secondary',
          requestedBy,
          justification,
          requiredCertifications,
          experienceEvidence
        } = data;

        if (!userId || !roleType || !requestedBy || !justification) {
          return NextResponse.json(
            { error: 'Missing required fields: userId, roleType, requestedBy, justification' },
            { status: 400 }
          );
        }

        const roleRequest = await roleAssignmentService.requestRoleAssignment({
          userId,
          roleType: roleType as UserRole,
          assignmentType,
          requestedBy,
          justification,
          requiredCertifications,
          experienceEvidence
        });

        return NextResponse.json({ 
          success: true,
          assignmentId: roleRequest.assignmentId,
          verificationResult: roleRequest.verificationResult,
          needsApproval: roleRequest.needsApproval
        });

      case 'approveRole':
        const { assignmentId, approvedBy, notes } = data;

        if (!assignmentId || !approvedBy) {
          return NextResponse.json(
            { error: 'Missing required fields: assignmentId, approvedBy' },
            { status: 400 }
          );
        }

        await roleAssignmentService.approveRoleAssignment(assignmentId, approvedBy, notes);
        
        return NextResponse.json({ success: true });

      case 'checkMultiple':
        const { userId: checkUserId, permissions } = data;

        if (!checkUserId || !Array.isArray(permissions)) {
          return NextResponse.json(
            { error: 'Missing required fields: userId, permissions (array)' },
            { status: 400 }
          );
        }

        const multipleResults = await permissionManagementService.checkMultiplePermissions(
          checkUserId,
          permissions as Permission[]
        );

        return NextResponse.json({ results: multipleResults });

      case 'requestApproval':
        const {
          userId: approvalUserId,
          permission: approvalPermission,
          context,
          requestedBy: approvalRequestedBy,
          justification: approvalJustification
        } = data;

        if (!approvalUserId || !approvalPermission || !approvalRequestedBy || !approvalJustification) {
          return NextResponse.json(
            { error: 'Missing required fields: userId, permission, requestedBy, justification' },
            { status: 400 }
          );
        }

        const approvalId = await permissionManagementService.createPermissionApprovalRequest(
          approvalUserId,
          approvalPermission as Permission,
          context,
          approvalRequestedBy,
          approvalJustification
        );

        return NextResponse.json({ 
          success: true,
          approvalId
        });

      case 'grantTemporary':
        const {
          userId: grantUserId,
          permission: grantPermission,
          expiresAt,
          grantedBy,
          context: grantContext
        } = data;

        if (!grantUserId || !grantPermission || !expiresAt || !grantedBy) {
          return NextResponse.json(
            { error: 'Missing required fields: userId, permission, expiresAt, grantedBy' },
            { status: 400 }
          );
        }

        await permissionManagementService.grantTemporaryPermission(
          grantUserId,
          grantPermission as Permission,
          new Date(expiresAt),
          grantedBy,
          grantContext
        );

        return NextResponse.json({ success: true });

      case 'invalidateCache':
        const { userId: cacheUserId } = data;

        if (!cacheUserId) {
          return NextResponse.json(
            { error: 'Missing required field: userId' },
            { status: 400 }
          );
        }

        permissionManagementService.invalidateUserPermissionCache(cacheUserId);

        return NextResponse.json({ success: true });

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: requestRole, approveRole, checkMultiple, requestApproval, grantTemporary, invalidateCache' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Permission POST API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/auth/permissions - Update role performance or permissions
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    switch (action) {
      case 'updatePerformance':
        const {
          assignmentId,
          projectsCompleted,
          successRate,
          clientRating
        } = data;

        if (!assignmentId) {
          return NextResponse.json(
            { error: 'Missing required field: assignmentId' },
            { status: 400 }
          );
        }

        await roleAssignmentService.updateRolePerformance(assignmentId, {
          projectsCompleted,
          successRate,
          clientRating
        });

        return NextResponse.json({ success: true });

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: updatePerformance' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Permission PUT API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}