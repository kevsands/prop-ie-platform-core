// src/services/data-service/index.ts

import { Development } from '../../types/developments';
import { Property, PropertyFilters } from '../../types/properties';

/**
 * Interface defining the contract for any data service
 * (mock or real API implementation).
 */
export interface DataService {
  // Developments
  getDevelopments(): Promise<Development[]>;
  getDevelopmentById(id: string): Promise<Development | null>;
  getFeaturedDevelopments(limit?: number): Promise<Development[]>;

  // Properties
  getProperties(filters?: PropertyFilters): Promise<Property[]>;
  getPropertyById(id: string): Promise<Property | null>;
  getFeaturedProperties(limit?: number): Promise<Property[]>;
  getPropertiesByDevelopment(developmentId: string): Promise<Property[]>;

  // Add other data fetching methods as needed (e.g., getUser, submitForm, etc.)
}

// You would typically export an instance of your chosen implementation here
// For development with mock data:
// export const dataService: DataService = new MockDataService();
// For production with a real API:
// export const dataService: DataService = new ApiDataService('your-api-base-url');

// Export the mock service class directly for flexibility in this example
// In a real app, you might use dependency injection or a context provider
// to make the chosen data service instance available throughout your app.
export { MockDataService } from './mock'; // We will define MockDataService in mock.ts