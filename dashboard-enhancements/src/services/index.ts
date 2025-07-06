/**
 * Services Layer
 * 
 * This file exports all service implementations and provides
 * a clean abstraction layer between UI components and data.
 */

// Core model services
export { default as userService } from './user-service';
export { default as developmentService } from './development-service';
export { default as salesService } from './sales-service';
export { default as documentService } from './document-service';

// Legacy interfaces and data services

import { Development } from '@/types/developments';
import { Property } from '@/types/properties';

// Define interface for our data services
export interface DataService {
  // Development methods
  getDevelopments(): Promise<Development[]>;
  getDevelopmentById(id: string): Promise<Development | null>;
  getFeaturedDevelopments(limit?: number): Promise<Development[]>;
  
  // Property methods
  getProperties(filters?: any): Promise<Property[]>;
  getPropertyById(id: string): Promise<Property | null>;
  getFeaturedProperties(limit?: number): Promise<Property[]>;
  getPropertiesByDevelopment(developmentId: string): Promise<Property[]>;
}

// Import legacy implementations
import { MockDataService } from './mockDataService';
import { ApiDataService } from './apiDataService';

// Factory function to get the appropriate service implementation
export function getDataService(): DataService {
  // Check if we should use mock data
  // You can set this in your .env.local file or use a different strategy
  const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';
  
  if (useMockData) {
    return new MockDataService();
  } else {
    return new ApiDataService();
  }
}

// Export a default instance for convenience
export default getDataService();