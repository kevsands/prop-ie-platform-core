/**
 * Type definitions for API testing
 */

// Generic API response type
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
  message?: string;
}

// Unit types for testing
export interface UnitData {
  id?: string;
  developmentId: string;
  name: string;
  type: string;
  status: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  price: number;
  features?: string[];
  images?: string[];
  floorPlan?: string;
}

export interface UnitUpdateData {
  id: string;
  price?: number;
  status?: string;
  name?: string;
  type?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
}

// User types for testing
export interface UserData {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  roles: string[];
  phoneNumber?: string;
  profile?: Record<string, any>\n  );
}

export interface UserUpdateData {
  id: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  roles?: string[];
  profile?: Record<string, any>\n  );
}