/**
 * User Type Definitions
 * 
 * Comprehensive user-related type definitions for consistent usage
 * throughout the application.
 */

/**
 * Detailed user profile information
 */
export interface UserDetails {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    county?: string;
    postcode?: string;
    country?: string;
  };
  profileImage?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Core user model with authentication information
 */
export interface User {
  id: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  role: string;
  isVerified?: boolean;
  isActive?: boolean;
  lastLogin?: string;
  preferences?: {
    theme?: 'light' | 'dark' | 'system';
    notifications?: boolean;
    language?: string;
    [key: string]: any;
  };
  createdAt?: string;
  updatedAt?: string;
  user?: UserDetails; // Nested user details for backward compatibility
}

/**
 * User preferences/settings
 */
export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  notifications?: boolean;
  language?: string;
  [key: string]: any;
}

/**
 * User authentication response
 */
export interface AuthUser {
  id: string;
  email: string;
  username?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  role: string;
  token?: string;
  refreshToken?: string;
  expiresIn?: number;
  isVerified?: boolean;
  user?: UserDetails;
}

/**
 * User registration payload
 */
export interface RegisterUserInput {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  phone?: string;
}

/**
 * User login payload
 */
export interface LoginUserInput {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * User update payload
 */
export interface UpdateUserInput {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    county?: string;
    postcode?: string;
    country?: string;
  };
  preferences?: UserPreferences;
}

/**
 * User permission model
 */
export interface UserPermission {
  id: string;
  name: string;
  description?: string;
  resource?: string;
  action?: string;
}

/**
 * User role model
 */
export interface UserRole {
  id: string;
  name: string;
  description?: string;
  permissions?: UserPermission[];
}

/**
 * Buyer-specific profile
 */
export interface BuyerProfile {
  id: string;
  userId: string;
  buyerType?: 'first-time' | 'existing' | 'investor';
  budgetMin?: number;
  budgetMax?: number;
  preferredLocations?: string[];
  propertyTypes?: string[];
  bedroomRequirement?: number;
  bathroomRequirement?: number;
  mustHaves?: string[];
  niceToHaves?: string[];
  searchActive?: boolean;
  mortgageApproved?: boolean;
  mortgageAmount?: number;
  depositAmount?: number;
  solicitorsAppointed?: boolean;
  completedProperties?: string[];
  savedProperties?: string[];
  viewingHistory?: Array<{
    propertyId: string;
    date: string;
    notes?: string;
  }>;
}

/**
 * JWT token payload
 */
export interface JWTPayload {
  id: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
  [key: string]: any;
}

/**
 * User session
 */
export interface UserSession {
  user: User | AuthUser;
  token?: string;
  refreshToken?: string;
  expiresAt?: string;
}

/**
 * Helper function to get user's full name
 */
export function getUserFullName(user: User | AuthUser | UserDetails): string {
  // First try firstName + lastName
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  
  // Then try name
  if (user.name) {
    return user.name;
  }
  
  // Then try user.name if nested user exists
  if ('user' in user && user.user?.name) {
    return user.user.name;
  }
  
  // Fallback to email or username
  return ('username' in user && user.username) || user.email;
}

/**
 * Helper to check if user has a specific role
 */
export function hasRole(user: User | AuthUser, roleName: string): boolean {
  return user.role === roleName;
}

/**
 * Helper to check if user has a specific permission
 */
export function hasPermission(user: User | AuthUser, permission: string): boolean {
  // This is a placeholder - implement based on your permission system
  return false;
}

/**
 * Type guard to check if object is a User
 */
export function isUser(obj: any): obj is User {
  return obj && typeof obj.id === 'string' && typeof obj.email === 'string' && typeof obj.role === 'string';
}