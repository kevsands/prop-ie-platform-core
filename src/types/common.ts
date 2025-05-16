/**
 * Common types used across the application
 */

// Service request extending standard Request
export interface ServiceRequest extends Request {
  service?: {
    id: string;
    name: string;
    permissions: string[];
  };
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

// GraphQL response type
export interface GraphQLResult<T> {
  data: T | null;
  error: Error | null;
}

// API response type
export interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
}

// General pagination type
export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// Status type used across different entities
export type Status = 
  | 'pending'
  | 'active'
  | 'completed'
  | 'cancelled'
  | 'rejected'
  | 'approved'
  | 'draft';

// Response type used in components/APIs
export interface ResponseType<T = any> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
  errors?: {
    field: string;
    message: string;
  }[];
}

// Customization types
export interface CustomizationOption {
  id: string;
  name: string;
  category: string;
  room: string;
  price: number;
  description: string;
  supplierItemId?: string;
  modelPath?: string;
  customData?: {
    position?: [number, number, number];
    rotation?: [number, number, number];
    scale?: [number, number, number];
  };
}

export interface SelectedOption {
  id: string;
  option: CustomizationOption;
  quantity: number;
}

export interface CustomizationState {
  id?: string;
  propertyId: string;
  selectedOptions: Record<string, SelectedOption>;
  totalCost: number;
  status: 'draft' | 'submitted' | 'finalized';
  lastSaved?: Date;
}

export interface CustomizationContextType {
  customization: CustomizationState;
  selectedOptions: Record<string, SelectedOption>;
  totalCost: number;
  addOption: (option: CustomizationOption) => void;
  removeOption: (optionId: string) => void;
  updateQuantity: (optionId: string, quantity: number) => void;
  saveCustomization: () => Promise<void>;
  finalizeCustomization: () => Promise<void>;
}