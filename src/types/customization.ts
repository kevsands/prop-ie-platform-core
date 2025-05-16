/**
 * Types related to property customization
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
  customData?: Record<string, any>;
}

/**
 * Definition for a room that can be customized
 */
export interface Room {
  id: string;
  name: string;
  icon: string;
  description?: string;
}

/**
 * Definition for a customization category
 */
export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

/**
 * Definition for a customization selection
 */
export interface CustomizationSelection {
  id: string;
  optionId: string;
  name: string;
  price: number;
  unit: string;
  category: string;
  room?: string;
  image?: string;
  selectedAt: string;
}

/**
 * Definition for a customization session
 */
export interface CustomizationSession {
  id: string;
  propertyId: string;
  userId: string;
  selectedOptions: Record<string, CustomizationSelection>;
  totalCost: number;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

/**
 * Definition for a consultation request
 */
export interface ConsultationRequest {
  id: string;
  customizationId: string;
  propertyId: string;
  userId: string;
  notes?: string;
  preferredDate?: string;
  preferredTime?: string;
  status: 'PENDING' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}