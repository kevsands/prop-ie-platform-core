/**
 * Development filter interface for querying developments
 */
export interface DevelopmentFilter {
  status?: 'active' | 'completed' | 'cancelled';
  type?: 'residential' | 'commercial' | 'mixed';
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  minUnits?: number;
  maxUnits?: number;
  amenities?: string[];
  developerId?: string;
  startDate?: Date;
  endDate?: Date;
  sortBy?: 'price' | 'date' | 'units';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
} 