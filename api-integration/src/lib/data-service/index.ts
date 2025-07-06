/**
 * Data Service
 * This module provides access to application data
 */

import mongodb from '../mongodb-helper';

/**
 * Customization type definition
 */
export interface Customization {
  id?: string;
  customizationId?: string;
  propertyId: string;
  userId: string;
  selectedOptions: Record<string, any>;
  totalCost?: number;
  status?: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'FINALIZED';
  rooms?: Record<string, any>[];
  materials?: Record<string, any>[];
  colors?: Record<string, string>[];
  notes?: string;
  consultationData?: {
    preferredDate?: string;
    preferredTime?: string;
    notes?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

/**
 * User type definition
 */
export interface User {
  userId: string;
  username: string;
  email?: string;
  attributes?: Record<string, any>;
}

/**
 * Data Service implementation
 */
const DataService = {
  /**
   * Get the current authenticated user
   */
  async getCurrentUser(): Promise<User | null> {
    // Mock implementation - in a real app, this would get the user from the auth system
    return {
      userId: 'user-123',
      username: 'testuser',
      email: 'test@example.com'
    };
  },

  /**
   * Get a customization by ID
   */
  async getCustomization(id: string): Promise<Customization | null> {
    // Try to find by customizationId field
    const customization = await mongodb.findOne<Customization>('customizations', { 
      $or: [
        { customizationId: id },
        { _id: id }
      ]
    });
    
    return customization;
  },

  /**
   * Save or update a customization
   */
  async saveCustomization(data: Partial<Customization>): Promise<Customization> {
    // If the customization has an ID, update it
    if (data.id || data.customizationId) {
      const query = {
        $or: [
          { _id: data.id },
          { customizationId: data.customizationId || data.id }
        ]
      };
      
      const updatedData = {
        ...data,
        updatedAt: new Date().toISOString()
      };
      
      // Use updateOne to update the document
      const updated = await mongodb.updateOne<Customization>(
        'customizations',
        query,
        updatedData
      );
      
      if (updated) {
        return updated;
      }
    }
    
    // If no ID or not found, create a new customization
    const newData = {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: data.status || 'DRAFT'
    };
    
    return await mongodb.insertOne<Customization>('customizations', newData as Customization);
  },

  /**
   * Request a consultation for a customization
   */
  async requestConsultation(
    propertyId: string,
    customizationId: string,
    consultationData: Record<string, any>
  ): Promise<Customization | null> {
    // Find the customization to update
    const customization = await this.getCustomization(customizationId);
    
    if (!customization) {
      throw new Error('Customization not found');
    }
    
    // Update the customization with consultation data
    const updatedData = {
      ...customization,
      consultationData: {
        ...customization.consultationData,
        ...consultationData,
        requestedAt: new Date().toISOString()
      },
      status: 'SUBMITTED',
      updatedAt: new Date().toISOString()
    };
    
    // Save the updated customization
    return this.saveCustomization(updatedData);
  }
};

export default DataService;