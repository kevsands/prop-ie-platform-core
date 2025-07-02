/**
 * Centralized type definitions for the application
 */

/**
 * Definition for a customization option
 */
export interface CustomizationOption {
  id: string;
  name: string;
  price: number;
  unit: string;
  category: string;
  room?: string;
  image?: string;
  description?: string;
  customData?: Record<string, string | number | boolean>;
}

/**
 * Definition for a property
 */
export interface Property {
  id: string;
  title: string;
  description?: string;
  price: number;
  address: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: string;
  status: 'AVAILABLE' | 'RESERVED' | 'SOLD';
  developmentId?: string;
  images?: string[];
}

/**
 * Definition for a development
 */
export interface Development {
  id: string;
  name: string;
  description: string;
  location: string;
  status: 'UPCOMING' | 'ACTIVE' | 'COMPLETED';
  properties?: Property[];
  featuredImageUrl?: string;
  completionDate?: string;
}

/**
 * Definition for a customization session
 */
export interface CustomizationSession {
  id: string;
  propertyId: string;
  userId: string;
  selectedOptions: Record<string, CustomizationOption>;
  totalCost: number;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

/**
 * Common API response wrapper
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}