/**
 * Real-time Permission Management Service
 * 
 * Handles dynamic permission checking, caching, and real-time updates
 * Integrates with role assignments and professional permissions
 */

import { UserRole, Permission, ProfessionalPermissionService } from '@/lib/permissions/ProfessionalPermissionMatrix';
import { roleAssignmentService } from './roleAssignmentService';

export interface PermissionCheck {
  userId: string;
  permission: Permission;
  context?: {
    resourceId?: string;
    resourceType?: string;
    projectId?: string;
    transactionId?: string;
  };
}

export interface PermissionResult {
  granted: boolean;
  reason?: string;
  requiresApproval?: boolean;
  approvalWorkflow?: string;
  conditions?: string[];
  expiresAt?: Date;
}

export interface UserPermissionContext {
  userId: string;
  activeRoles: UserRole[];
  permissions: Permission[];
  restrictions: {
    canOnlyViewOwnData: boolean;
    canOnlyEditOwnData: boolean;
    requiresApproval: Permission[];
    geographical?: string[];
    projectTypes?: string[];
  };
  lastUpdated: Date;
}

class PermissionManagementService {
  private permissionCache = new Map<string, UserPermissionContext>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  /**
   * Check if user has permission for a specific action
   */
  async checkPermission(check: PermissionCheck): Promise<PermissionResult> {
    try {
      // Get user permission context (cached or fresh)
      const userContext = await this.getUserPermissionContext(check.userId);
      
      // Basic permission check
      const hasPermission = userContext.permissions.includes(check.permission);
      
      if (!hasPermission) {
        return {
          granted: false,
          reason: `Permission ${check.permission} not granted to user roles: ${userContext.activeRoles.join(', ')}`
        };
      }

      // Check if permission requires approval
      const requiresApproval = userContext.restrictions.requiresApproval.includes(check.permission);
      
      // Context-specific checks
      const contextCheck = await this.checkPermissionContext(userContext, check);
      
      if (!contextCheck.allowed) {
        return {
          granted: false,
          reason: contextCheck.reason
        };
      }

      return {
        granted: true,
        requiresApproval,
        conditions: contextCheck.conditions,
        expiresAt: contextCheck.expiresAt
      };

    } catch (error) {
      console.error('Permission check failed:', error);
      return {
        granted: false,
        reason: 'Permission check failed due to system error'
      };
    }
  }

  /**
   * Check multiple permissions at once
   */
  async checkMultiplePermissions(
    userId: string, 
    permissions: Permission[]
  ): Promise<Record<Permission, PermissionResult>> {
    const results: Record<Permission, PermissionResult> = {} as any;
    
    for (const permission of permissions) {
      results[permission] = await this.checkPermission({ userId, permission });
    }
    
    return results;
  }

  /**
   * Get user's permission context with caching
   */
  async getUserPermissionContext(userId: string): Promise<UserPermissionContext> {
    const cacheKey = `user_permissions_${userId}`;
    const cached = this.permissionCache.get(cacheKey);
    
    // Return cached if still valid
    if (cached && (Date.now() - cached.lastUpdated.getTime()) < this.CACHE_TTL) {
      return cached;
    }

    // Fetch fresh permission context
    const context = await this.buildUserPermissionContext(userId);
    this.permissionCache.set(cacheKey, context);
    
    return context;
  }

  /**
   * Invalidate user permission cache (call when roles change)
   */
  invalidateUserPermissionCache(userId: string): void {
    const cacheKey = `user_permissions_${userId}`;
    this.permissionCache.delete(cacheKey);
  }

  /**
   * Get all users with specific permission
   */
  async getUsersWithPermission(permission: Permission): Promise<string[]> {
    // Get all roles that have this permission
    const rolesWithPermission = ProfessionalPermissionService.getRolesWithPermission(permission);
    
    const userIds: string[] = [];
    
    // For each role, get users with that role
    for (const role of rolesWithPermission) {
      const roleAssignments = await roleAssignmentService.getUsersWithRole(role, true);
      userIds.push(...roleAssignments.map(assignment => assignment.userId));
    }
    
    // Remove duplicates
    return [...new Set(userIds)];
  }

  /**
   * Create permission approval workflow
   */
  async createPermissionApprovalRequest(
    userId: string,
    permission: Permission,
    context: any,
    requestedBy: string,
    justification: string
  ): Promise<string> {
    // This would integrate with a workflow engine
    // For now, return a mock approval request ID
    const approvalId = `approval_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // In a real implementation, this would:
    // 1. Find appropriate approvers based on permission type
    // 2. Create approval workflow record
    // 3. Send notifications to approvers
    // 4. Set up expiration timers
    
    console.log('Permission approval request created:', {
      approvalId,
      userId,
      permission,
      context,
      requestedBy,
      justification
    });
    
    return approvalId;
  }

  /**
   * Grant temporary permission (for approved requests)
   */
  async grantTemporaryPermission(
    userId: string,
    permission: Permission,
    expiresAt: Date,
    grantedBy: string,
    context?: any
  ): Promise<void> {
    // This would store temporary permission grants
    // and integrate with the permission checking logic
    
    console.log('Temporary permission granted:', {
      userId,
      permission,
      expiresAt,
      grantedBy,
      context
    });
    
    // Invalidate cache to pick up new permission
    this.invalidateUserPermissionCache(userId);
  }

  /**
   * Get permission audit trail for user
   */
  async getPermissionAuditTrail(
    userId: string,
    limit: number = 100
  ): Promise<Array<{
    timestamp: Date;
    action: string;
    permission: Permission;
    result: boolean;
    context?: any;
    reason?: string;
  }>> {
    // This would query an audit log table
    // For now, return mock data
    
    return [
      {
        timestamp: new Date(),
        action: 'permission_check',
        permission: Permission.VIEW_DEVELOPMENTS,
        result: true,
        context: { resourceType: 'development', resourceId: 'dev_123' }
      }
    ];
  }

  // Private helper methods

  private async buildUserPermissionContext(userId: string): Promise<UserPermissionContext> {
    // Get user's active role assignments
    const roleAssignments = await roleAssignmentService.getUserRoleAssignments(userId);
    const activeRoles = roleAssignments
      .filter(assignment => assignment.isActive && assignment.eligibilityVerified)
      .map(assignment => assignment.roleType);

    // Get permissions for all active roles
    const permissions = ProfessionalPermissionService.getUserPermissions(activeRoles);
    
    // Determine restrictions based on roles
    const canOnlyViewOwnData = ProfessionalPermissionService.canOnlyViewOwnData(activeRoles);
    
    // Collect all approval-required permissions
    const requiresApproval: Permission[] = [];
    for (const role of activeRoles) {
      const rolePermissions = ProfessionalPermissionService.getRolePermissions(role);
      if (rolePermissions?.restrictions?.requiresApproval) {
        requiresApproval.push(...rolePermissions.restrictions.requiresApproval);
      }
    }

    return {
      userId,
      activeRoles,
      permissions,
      restrictions: {
        canOnlyViewOwnData,
        canOnlyEditOwnData: canOnlyViewOwnData, // Same logic for now
        requiresApproval: [...new Set(requiresApproval)] // Remove duplicates
      },
      lastUpdated: new Date()
    };
  }

  private async checkPermissionContext(
    userContext: UserPermissionContext,
    check: PermissionCheck
  ): Promise<{
    allowed: boolean;
    reason?: string;
    conditions?: string[];
    expiresAt?: Date;
  }> {
    const conditions: string[] = [];
    
    // Data ownership restrictions
    if (userContext.restrictions.canOnlyViewOwnData) {
      if (check.context?.resourceId && !await this.userOwnsResource(userContext.userId, check.context.resourceId)) {
        return {
          allowed: false,
          reason: 'User can only access their own data'
        };
      }
      conditions.push('User can only access own data');
    }

    // Project-specific restrictions
    if (check.context?.projectId) {
      const hasProjectAccess = await this.checkProjectAccess(userContext.userId, check.context.projectId);
      if (!hasProjectAccess) {
        return {
          allowed: false,
          reason: 'User does not have access to this project'
        };
      }
    }

    // Role-specific time-based restrictions
    const expiresAt = this.calculatePermissionExpiry(userContext.activeRoles, check.permission);

    return {
      allowed: true,
      conditions: conditions.length > 0 ? conditions : undefined,
      expiresAt
    };
  }

  private async userOwnsResource(userId: string, resourceId: string): Promise<boolean> {
    // This would check resource ownership based on resource type
    // For now, return true as a placeholder
    return true;
  }

  private async checkProjectAccess(userId: string, projectId: string): Promise<boolean> {
    // This would check if user has access to specific project
    // Could be based on project team membership, role assignments, etc.
    return true;
  }

  private calculatePermissionExpiry(roles: UserRole[], permission: Permission): Date | undefined {
    // Some permissions might expire based on role or context
    // For now, return undefined (no expiry)
    return undefined;
  }

  /**
   * Real-time permission validation for API endpoints
   */
  async validateApiPermission(
    userId: string,
    method: string,
    endpoint: string,
    body?: any
  ): Promise<PermissionResult> {
    // Map API endpoints to required permissions
    const endpointPermissions = this.getEndpointPermissions(method, endpoint);
    
    if (endpointPermissions.length === 0) {
      return { granted: true }; // Public endpoint
    }

    // Check if user has any of the required permissions
    for (const permission of endpointPermissions) {
      const result = await this.checkPermission({
        userId,
        permission,
        context: this.extractContextFromEndpoint(endpoint, body)
      });
      
      if (result.granted) {
        return result;
      }
    }

    return {
      granted: false,
      reason: `Requires one of: ${endpointPermissions.join(', ')}`
    };
  }

  private getEndpointPermissions(method: string, endpoint: string): Permission[] {
    // Map common API patterns to permissions
    const patterns: Array<{ pattern: RegExp; method?: string; permissions: Permission[] }> = [
      { pattern: /^\/api\/developments/, method: 'GET', permissions: [Permission.VIEW_DEVELOPMENTS] },
      { pattern: /^\/api\/developments/, method: 'POST', permissions: [Permission.CREATE_DEVELOPMENTS] },
      { pattern: /^\/api\/developments/, method: 'PUT', permissions: [Permission.EDIT_DEVELOPMENTS] },
      { pattern: /^\/api\/tasks/, method: 'GET', permissions: [Permission.VIEW_TASKS] },
      { pattern: /^\/api\/tasks/, method: 'POST', permissions: [Permission.CREATE_TASKS] },
      { pattern: /^\/api\/documents/, method: 'GET', permissions: [Permission.VIEW_DOCUMENTS] },
      { pattern: /^\/api\/documents/, method: 'POST', permissions: [Permission.UPLOAD_DOCUMENTS] },
      { pattern: /^\/api\/htb/, method: 'GET', permissions: [Permission.VIEW_HTB_DATA] },
      { pattern: /^\/api\/htb/, method: 'POST', permissions: [Permission.PROCESS_HTB_CLAIMS] },
    ];

    for (const pattern of patterns) {
      if (pattern.pattern.test(endpoint) && (!pattern.method || pattern.method === method)) {
        return pattern.permissions;
      }
    }

    return [];
  }

  private extractContextFromEndpoint(endpoint: string, body?: any): any {
    // Extract resource IDs and context from endpoint path
    const context: any = {};
    
    // Extract development ID
    const devMatch = endpoint.match(/\/developments\/([^\/]+)/);
    if (devMatch) {
      context.resourceType = 'development';
      context.resourceId = devMatch[1];
    }
    
    // Extract project ID
    const projectMatch = endpoint.match(/\/projects\/([^\/]+)/);
    if (projectMatch) {
      context.projectId = projectMatch[1];
    }
    
    return context;
  }
}

export const permissionManagementService = new PermissionManagementService();
export default permissionManagementService;