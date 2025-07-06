// src/services/apiDataService.ts
import { DataService } from './index';
import { Development } from '@/types/developments';
import { Property } from '@/types/properties';
import { PropertySearchParams, PropertyListResponse } from '@/types/search';
import { api } from './api';

export class ApiDataService implements DataService {
  // Development methods
  async getDevelopments(): Promise<Development[]> {
    return api.get<Development[]>('/developments');
  }

  async getDevelopmentById(id: string): Promise<Development | null> {
    try {
      return await api.get<Development>(`/developments/${id}`);
    } catch (error) {
      return null;
    }
  }

  async getFeaturedDevelopments(limit = 4): Promise<Development[]> {
    return api.get<Development[]>(`/developments/featured?limit=${limit}`);
  }

  // Property methods
  async getProperties(filters?: any): Promise<Property[]> {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return api.get<Property[]>(`/properties${queryString}`);
  }

  async getPropertyById(id: string): Promise<Property | null> {
    try {
      return await api.get<Property>(`/properties/${id}`);
    } catch (error) {
      return null;
    }
  }

  async getFeaturedProperties(limit = 6): Promise<Property[]> {
    return api.get<Property[]>(`/properties/featured?limit=${limit}`);
  }

  async getPropertiesByDevelopment(developmentId: string): Promise<Property[]> {
    return api.get<Property[]>(`/developments/${developmentId}/properties`);
  }
}