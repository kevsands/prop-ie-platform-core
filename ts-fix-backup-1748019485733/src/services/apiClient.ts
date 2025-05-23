// src/services/apiClient.ts
import axios from 'axios';
import { CustomizationOption } from '@/types/customization';

// Import Room and Category interfaces from types
import { Room, Category } from '@/types/customization';

// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Default request headers
const defaultHeaders = {
  'Content-Type': 'application/json'};

// Create API client
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: defaultHeaders});

// Add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API Client Service
export const ApiClient = {
  /**
   * Get customization options
   */
  async getCustomizationOptions(room: string, category: string): Promise<Record<string, CustomizationOption[]>> {
    try {
      const response = await apiClient.get('/api/customization/options', {
        params: { room, category });

      return response.data;
    } catch (error) {

      return {};
    }
  },

  /**
   * Get available rooms
   */
  async getRooms(): Promise<Room[]> {
    try {
      const response = await apiClient.get('/api/customization/rooms');
      return response.data;
    } catch (error) {

      // Return fallback data
      return [
        { id: "livingRoom", name: "Living Room", icon: "🛋️" },
        { id: "kitchen", name: "Kitchen", icon: "🍳" },
        { id: "masterBedroom", name: "Master Bedroom", icon: "🛏️" },
        { id: "bathroom", name: "Bathroom", icon: "🚿" },
        { id: "secondBedroom", name: "Second Bedroom", icon: "🛌" },
        { id: "study", name: "Study/Office", icon: "💻" }];
    }
  },

  /**
   * Get available categories
   */
  async getCategories(): Promise<Category[]> {
    try {
      const response = await apiClient.get('/api/customization/categories');
      return response.data;
    } catch (error) {

      // Return fallback data
      return [
        { id: "flooring", name: "Flooring" },
        { id: "paint", name: "Wall Paint" },
        { id: "fixtures", name: "Fixtures & Fittings" },
        { id: "appliances", name: "Appliances" },
        { id: "furniture", name: "Furniture" }];
    }
  },

  /**
   * Save customization
   */
  async saveCustomization(customizationData: any): Promise<{ customizationId: string }> {
    try {
      const response = await apiClient.post('/api/customization/save', customizationData);
      return response.data;
    } catch (error) {

      throw error;
    }
  },

  /**
   * Get customization by ID
   */
  async getCustomization(customizationId: string): Promise<any> {
    try {
      const response = await apiClient.get(`/api/customization/${customizationId}`);
      return response.data;
    } catch (error) {

      throw error;
    }
  },

  /**
   * Get latest customization for a property
   */
  async getLatestCustomization(propertyId: string): Promise<any> {
    try {
      const response = await apiClient.get('/api/customization/latest', {
        params: { propertyId });
      return response.data;
    } catch (error) {

      return null;
    }
  },

  /**
   * Request consultation
   */
  async requestConsultation(propertyId: string, customizationId: string, consultationData: any): Promise<any> {
    try {
      const response = await apiClient.post('/api/customization/consultation', {
        propertyId,
        customizationId,
        ...consultationData});
      return response.data;
    } catch (error) {

      throw error;
    }
  },

  /**
   * Finalize customization
   */
  async finalizeCustomization(customizationId: string): Promise<any> {
    try {
      const response = await apiClient.post(`/api/customization/${customizationId}/finalize`);
      return response.data;
    } catch (error) {

      throw error;
    }
  },

  /**
   * Calculate mortgage with customizations
   */
  async calculateMortgage(
    propertyId: string,
    customizationCost: number,
    mortgageParams: {
      depositPercentage: number;
      term: number;
      interestRate: number;
    }
  ): Promise<any> {
    try {
      const response = await apiClient.post('/api/financial/mortgage-calculation', {
        propertyId,
        customizationCost,
        ...mortgageParams});
      return response.data;
    } catch (error) {

      throw error;
    }
  };

export default ApiClient;