/**
 * Type definitions for the property application
 */

// Development type definition
export interface Development {
  id: string;
  name: string;
  description: string;
  location: string;
  image: string;
  status?: 'Selling Fast' | 'New Release' | 'Launching Soon' | 'Completed' | 'Future';
  statusColor?: string;
  featured?: boolean;
}

// Property type definition
export interface Property {
  id: string;
  development: string;
  title: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
  isNew?: boolean;
  isReduced?: boolean;
  featured?: boolean;
  description?: string;
  floorPlan?: string;
  brochure?: string;
  availableFrom?: string;
  features?: string[];
}