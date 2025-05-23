/**
 * Development Service
 * 
 * Provides methods for interacting with development data using the AWS Amplify API.
 */

import { API } from '@/lib/amplify/api';
import { Development, ListDevelopmentsResponse, GetDevelopmentResponse } from '@/types';

/**
 * Service class for managing development data
 */
export class DevelopmentService {
  /**
   * Get a list of featured developments
   */
  static async getFeaturedDevelopments(limit: number = 4): Promise<Development[]> {
    const query = `
      query ListFeaturedDevelopments($limit: Int) {
        listDevelopments(limit: $limit, sortDirection: DESC, sortField: "createdAt") {
          items {
            id name description location image status statusColor createdAt updatedAt
          }
        }
      }
    `;
    
    try {
      const responseData = await API.graphql<ListDevelopmentsResponse>({ 
        query, 
        variables: { limit },
        operationName: 'ListFeaturedDevelopments'
      });
      return responseData.listDevelopments?.items || [];
    } catch (error) {
      console.error("Error fetching featured developments:", error);
      return [];
    }
  }
  
  /**
   * Get a development by ID
   */
  static async getDevelopmentById(developmentId: string): Promise<Development | null> {
    if (!developmentId) {
      console.error("getDevelopmentById requires a developmentId");
      return null;
    }
    
    const query = `
      query GetDevelopmentWithProperties($id: ID!, $propertyLimit: Int) {
        getDevelopment(id: $id) {
          id
          name
          description
          location
          image
          images
          status
          statusColor
          sitePlanUrl
          brochureUrl
          features
          createdAt
          updatedAt
          properties(limit: $propertyLimit, sortDirection: ASC, sortField: "title") {
            items {
              id title price bedrooms bathrooms area image isNew isReduced status statusColor createdAt
            }
          }
        }
      }
    `;
    
    try {
      const responseData = await API.graphql<GetDevelopmentResponse>({ 
        query, 
        variables: { 
          id: developmentId,
          propertyLimit: 50
        },
        operationName: 'GetDevelopmentWithProperties'
      });
      return responseData.getDevelopment || null;
    } catch (error) {
      console.error(`Error fetching development with ID ${developmentId}:`, error);
      return null;
    }
  }

  /**
   * Update a development
   */
  static async updateDevelopment(developmentId: string, updateData: Partial<Development>): Promise<Development | null> {
    if (!developmentId) {
      console.error("updateDevelopment requires a developmentId");
      return null;
    }
    
    const mutation = `
      mutation UpdateDevelopment($id: ID!, $input: UpdateDevelopmentInput!) {
        updateDevelopment(id: $id, input: $input) {
          id
          name
          description
          location
          image
          status
          statusColor
          updatedAt
        }
      }
    `;
    
    try {
      const responseData = await API.graphql<{ updateDevelopment: Development }>({ 
        query: mutation, 
        variables: { 
          id: developmentId,
          input: updateData
        },
        operationName: 'UpdateDevelopment'
      });
      return responseData.updateDevelopment || null;
    } catch (error) {
      console.error(`Error updating development with ID ${developmentId}:`, error);
      return null;
    }
  }

  /**
   * Create a new development
   */
  static async createDevelopment(developmentData: Partial<Development>): Promise<Development | null> {
    const mutation = `
      mutation CreateDevelopment($input: CreateDevelopmentInput!) {
        createDevelopment(input: $input) {
          id
          name
          description
          location
          image
          status
          statusColor
          createdAt
          updatedAt
        }
      }
    `;
    
    try {
      const responseData = await API.graphql<{ createDevelopment: Development }>({ 
        query: mutation, 
        variables: { 
          input: developmentData
        },
        operationName: 'CreateDevelopment'
      });
      return responseData.createDevelopment || null;
    } catch (error) {
      console.error(`Error creating development:`, error);
      return null;
    }
  }
}