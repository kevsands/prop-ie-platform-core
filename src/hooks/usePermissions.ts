"use client";

import { useAuth } from './useAuth';

type ResourceType = 'templates' | 'projects' | 'documents' | 'users' | 'settings' | string;
type ActionType = 'create' | 'read' | 'update' | 'delete' | 'approve' | 'manage' | string;

export function usePermissions() {
  const { user, isAuthenticated } = useAuth();

  /**
   * Check if the user has permission to perform an action on a resource
   * @param resource The resource type
   * @param action The action type
   * @returns Boolean indicating if the user has permission
   */
  const hasPermission = (resource: ResourceType, action: ActionType): boolean => {
    // If not authenticated, no permissions
    if (!isAuthenticated || !user) {
      return false;
    }

    // Admin role has all permissions
    if (user.role === 'admin') {
      return true;
    }

    // Check user's specific permissions if available
    if (user.permissions && Array.isArray(user.permissions)) {
      return user.permissions.some(
        permission => 
          permission.resource === resource && 
          permission.action === action
      );
    }

    // Default permissions based on role
    const rolePermissions: Record<string, { [key in ResourceType]?: ActionType[] }> = {
      'manager': {
        'templates': ['create', 'read', 'update'],
        'projects': ['create', 'read', 'update'],
        'documents': ['create', 'read', 'update', 'delete'],
        'users': ['read'],
        'settings': ['read']
      },
      'editor': {
        'templates': ['read', 'update'],
        'projects': ['read', 'update'],
        'documents': ['create', 'read', 'update'],
        'users': ['read']
      },
      'viewer': {
        'templates': ['read'],
        'projects': ['read'],
        'documents': ['read'],
        'users': ['read']
      }
    };

    // Check if the user's role has permission for this resource and action
    return !!rolePermissions[user.role]?.[resource]?.includes(action);
  };

  /**
   * Check if the user has all the specified permissions
   * @param permissions Array of resource-action pairs
   * @returns Boolean indicating if the user has all permissions
   */
  const hasAllPermissions = (permissions: Array<{ resource: ResourceType; action: ActionType }>): boolean => {
    return permissions.every(({ resource, action }) => hasPermission(resourceaction));
  };

  /**
   * Check if the user has any of the specified permissions
   * @param permissions Array of resource-action pairs
   * @returns Boolean indicating if the user has any of the permissions
   */
  const hasAnyPermission = (permissions: Array<{ resource: ResourceType; action: ActionType }>): boolean => {
    return permissions.some(({ resource, action }) => hasPermission(resourceaction));
  };

  return {
    hasPermission,
    hasAllPermissions,
    hasAnyPermission
  };
}