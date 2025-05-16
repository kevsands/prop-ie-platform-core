// src/types/customization.ts
// Combines your existing helper functions with improved type definitions

import { CustomizationStatus } from './enums';

/**
 * Selected Option Interface
 * Represents a customization option that has been selected by a user
 */
export interface SelectedOption {
  id: string;
  name: string;
  price: number;
  unit: string;
  category: string; 
  room?: string;
  active?: boolean;
  customData?: Record<string, any>;
}

/**
 * Customization Option Interface
 * Represents individual options that can be selected for property customization
 */
export interface CustomizationOption {
  id: string;
  name: string;
  price: number;
  unit: string;
  image: string;
  category: string;
  room: string;
  active: boolean;
  description?: string;
  features?: string[];
  customData?: Record<string, any>;
}

/**
 * Room Customization Interface
 * Groups selected options by room
 */
export interface RoomCustomization {
  roomId: string;
  roomName: string;
  selectedOptions: Record<string, SelectedOption>;
}

/**
 * Complete Customization Interface
 * Represents a collection of selections made by a user for a property
 */
export interface Customization {
  id: string;
  propertyId: string;
  userId: string;
  name?: string;
  description?: string;
  rooms?: RoomCustomization[];
  selectedOptions?: SelectedOption[];
  totalCost: number;
  status: CustomizationStatus;
  submissionDate?: string;
  approvalDate?: string;
  rejectReason?: string;
  version?: number;
  isDefault?: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Room Interface
 * Represents a room type for organizing customization options
 */
export interface Room {
  id: string;
  name: string;
  icon?: string;
  displayOrder?: number;
  description?: string;
  allowedCategories?: string[];
}

/**
 * Category Interface
 * Represents a category for organizing customization options
 */
export interface Category {
  id: string;
  name: string;
  displayOrder?: number;
  description?: string;
  icon?: string;
}

/**
 * Customization History Interface
 * Tracks changes to customizations over time
 */
export interface CustomizationHistory {
  id: string;
  customizationId: string;
  version: number;
  selectedOptions: SelectedOption[];
  totalCost: number;
  changeDate: string;
  changedBy: string;
  changeNotes?: string;
}

/**
 * GraphQL Response Interfaces
 */
export interface GraphQLListResponse<T> {
  items: T[];
  nextToken?: string | null;
}

export interface ListCustomizationOptionsResponse {
  listCustomizationOptions: GraphQLListResponse<CustomizationOption> | null;
}

export interface ListCustomizationsResponse {
  listCustomizations: GraphQLListResponse<Customization> | null;
}

export interface ListRoomsResponse {
  listRooms: GraphQLListResponse<Room> | null;
}

export interface ListCategoriesResponse {
  listCategories: GraphQLListResponse<Category> | null;
}

export interface GetCustomizationResponse {
  getCustomization: Customization | null;
}

export interface CreateMutationResponse {
  createCustomization: { id: string };
}

export interface UpdateMutationResponse {
  updateCustomization: { id: string };
}

export interface DeleteMutationResponse {
  deleteCustomization: { id: string };
}

// Your existing helper functions preserved exactly as they were
export const customizationHelpers = {
  // Safe getter for selectedOptions with proper type checking
  getSelectedOption: (selectedOptions: Record<string, SelectedOption> | SelectedOption[], key: string): SelectedOption | undefined => {
    if (Array.isArray(selectedOptions)) {
      return selectedOptions.find(option => option.id === key);
    } else {
      return selectedOptions[key];
    }
  },
  
  // Convert array of options to a record keyed by ID for easier access
  optionsToRecord: (options: SelectedOption[]): Record<string, SelectedOption> => {
    return options.reduce((acc, option) => {
      acc[option.id] = option;
      return acc;
    }, {} as Record<string, SelectedOption>);
  },
  
  // Total up the cost of all selected options
  calculateTotalCost: (selectedOptions: Record<string, SelectedOption> | SelectedOption[]): number => {
    if (Array.isArray(selectedOptions)) {
      return selectedOptions.reduce((total, option) => total + option.price, 0);
    } else {
      return Object.values(selectedOptions).reduce((total, option) => total + option.price, 0);
    }
  }
};