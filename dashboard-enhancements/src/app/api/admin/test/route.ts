// src/app/api/admin/test/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireRoles } from '@/lib/auth/requireRoles';
import { UserRole } from '@/types/core/user';

/**
 * Admin-only test endpoint
 * Demonstrates role-based access control
 */
export async function GET(request: NextRequest) {
  // Check if user has admin or developer role
  const roleCheck = await requireRoles(request, [UserRole.ADMIN, UserRole.DEVELOPER]);
  if (roleCheck) {
    return roleCheck; // Return redirect response
  }

  // If we get here, user has required role
  return NextResponse.json({
    success: true,
    message: 'Access granted to admin endpoint',
    timestamp: new Date().toISOString(),
    requiredRoles: ['admin', 'developer']
  });
}