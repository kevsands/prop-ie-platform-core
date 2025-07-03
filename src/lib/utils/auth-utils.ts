// Authentication utilities for API routes
import { NextRequest } from 'next/server';
import { AuthenticatedUser } from '@/lib/middleware/auth-middleware';

/**
 * Extract user context from authenticated request
 */
export function getUserContext(user: AuthenticatedUser) {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: `${user.firstName} ${user.lastName}`,
    primaryRole: user.roles[0] || 'USER',
    roles: user.roles,
    status: user.status,
    organization: user.organization,
    position: user.position
  };
}

/**
 * Check if user has any of the specified roles
 */
export function hasRole(user: AuthenticatedUser, roles: string[]): boolean {
  return roles.some(role => user.roles.includes(role));
}

/**
 * Check if user is a developer (has developer-related roles)
 */
export function isDeveloper(user: AuthenticatedUser): boolean {
  const developerRoles = ['DEVELOPER', 'PROJECT_MANAGER', 'DEVELOPMENT_SALES_AGENT', 'DEVELOPMENT_PROJECT_MANAGER'];
  return hasRole(user, developerRoles);
}

/**
 * Check if user is part of design/construction team
 */
export function isDesignTeam(user: AuthenticatedUser): boolean {
  const designRoles = ['ARCHITECT', 'ENGINEER', 'CONTRACTOR', 'QUANTITY_SURVEYOR'];
  return hasRole(user, designRoles);
}

/**
 * Check if user is a buyer or related role
 */
export function isBuyer(user: AuthenticatedUser): boolean {
  const buyerRoles = ['BUYER', 'BUYER_SOLICITOR', 'BUYER_MORTGAGE_BROKER', 'BUYER_SURVEYOR'];
  return hasRole(user, buyerRoles);
}

/**
 * Check if user is executive level
 */
export function isExecutive(user: AuthenticatedUser): boolean {
  const executiveRoles = ['ADMIN', 'DEVELOPMENT_FINANCIAL_CONTROLLER'];
  return hasRole(user, executiveRoles);
}

/**
 * Get conversation access level for user
 */
export function getConversationAccess(user: AuthenticatedUser): 'FULL' | 'TEAM' | 'LIMITED' {
  if (isExecutive(user)) return 'FULL';
  if (isDeveloper(user) || isDesignTeam(user)) return 'TEAM';
  return 'LIMITED';
}

export default {
  getUserContext,
  hasRole,
  isDeveloper,
  isDesignTeam,
  isBuyer,
  isExecutive,
  getConversationAccess
};