// src/types/common.ts
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
  
  // src/types/customization.ts
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