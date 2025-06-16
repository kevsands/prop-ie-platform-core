// src/types/customization.d.ts

export interface CustomizationOption {
  _id?: string;
  name: string;
  description?: string;
  category: string;
  room: string;
  price: number;
  supplierItemId?: string;
  inStock?: boolean;
  leadTime?: number;
  imageUrl?: string;
  displayOrder?: number;
  applicablePropertyTypes?: string[];
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CustomizationData {
  _id?: string;
  customizationId?: string;
  propertyId: string;
  userId: string;
  selectedOptions?: Record<string, any>
  );
  totalCost?: number;
  status?: 'draft' | 'finalized' | 'locked' | 'cancelled';
  lockedReason?: string;
  finalizedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  version?: number;
}

export interface StockData {
  [itemId: string]: {
    available: boolean;
    leadTime: number;
    quantity?: number;
  };
}

export interface CustomizationEventData {
  customizationId: string;
  propertyId: string;
  userId: string;
  status?: string;
  totalCost?: number;
  contractAddendumId?: string;
  timestamp: Date;
}

export interface PropertyUpdateEvent {
  propertyId: string;
  status: string;
  [key: string]: any;
}