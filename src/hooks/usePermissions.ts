/**
 * React Hook for Permission Management
 */

import { useState, useEffect, useCallback } from 'react';
import { Permission, UserRole } from '@/lib/permissions/ProfessionalPermissionMatrix';
import { authService } from '@/lib/auth/AuthService';

export function usePermissions(userId?: string) {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPermissionContext = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const context = await authService.getUserPermissionContext(userId);
      if (context) {
        setPermissions(context.permissions || []);
        setRoles(context.activeRoles || []);
      }
    } catch (err) {
      console.error('Failed to load permissions:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadPermissionContext();
  }, [loadPermissionContext]);

  const hasPermission = useCallback((permission: Permission): boolean => {
    return permissions.includes(permission);
  }, [permissions]);

  const hasRole = useCallback((role: UserRole): boolean => {
    return roles.includes(role);
  }, [roles]);

  return {
    hasPermission,
    hasRole,
    permissions,
    roles,
    loading,
    refresh: loadPermissionContext
  };
}