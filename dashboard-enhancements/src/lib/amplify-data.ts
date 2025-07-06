'use client';

/**
 * Amplify Data Service - Simplified Version for Build Testing
 * 
 * This is a simplified data service for build testing purposes.
 */

import { customizationOptions } from '../data/customizationOptions';

// Types
export interface CustomizationData {
  id?: string;
  customizationId?: string;
  propertyId: string;
  selectedOptions: any;
  totalCost?: number;
  currentRoom?: string;
  status?: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  lastUpdated?: string;
}

// Mock data for development
const mockCustomizations: Record<string, CustomizationData> = {};

// Mock for the DataService when database isn't available
export const DataService = {
  // Get room options
  getRooms: async () => {
    return [
      { id: 'livingRoom', name: 'Living Room', icon: '🏠' },
      { id: 'bedroom', name: 'Bedroom', icon: '🛏️' },
      { id: 'kitchen', name: 'Kitchen', icon: '🍳' },
      { id: 'bathroom', name: 'Bathroom', icon: '🚿' }
    ];
  },
  
  // Get categories
  getCategories: async () => {
    return [
      { id: 'flooring', name: 'Flooring' },
      { id: 'paint', name: 'Wall Paint' },
      { id: 'fixtures', name: 'Fixtures' },
      { id: 'furniture', name: 'Furniture' }
    ];
  },
  
  // Get customization options
  getCustomizationOptions: async (roomId: string, categoryId?: string) => {
    // Default response structure with explicit return type
    const response: {
      flooring: any[];
      paint: any[];
      fixtures: any[];
      furniture: any[];
      [key: string]: any[]; // Add index signature to allow dynamic keys
    } = {
      flooring: [],
      paint: [],
      fixtures: [],
      furniture: []
    };
    
    // Check if we have options for this room
    if (roomId && customizationOptions[roomId as keyof typeof customizationOptions]) {
      // Add available categories
      const roomOptions = customizationOptions[roomId as keyof typeof customizationOptions];
      
      Object.keys(roomOptions).forEach(cat => {
        response[cat] = roomOptions[cat as keyof typeof roomOptions];
      });
    }
    
    return response;
  },
  
  // Save customization data
  saveCustomization: async (data: any) => {
    console.log('Saving customization data:', data);
    return {
      success: true,
      customizationId: `custom-${Date.now()}`
    };
  },
  
  // Get saved customization
  getCustomization: async (id?: string) => {
    // Mock response
    return {
      id: id || `custom-${Date.now()}`,
      propertyId: 'prop-1234',
      selectedOptions: {},
      totalCost: 0,
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
};

export default DataService;