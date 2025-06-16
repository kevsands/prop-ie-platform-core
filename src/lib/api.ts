/**
 * Central API service for interacting with backend APIs
 * Provides typed methods for all API endpoints with proper error handling
 */

import { 
  User, 
  Unit, 
  Development, 
  Sale, 
  SaleStage, 
  Document, 
  UserRole, 
  DocumentType,
  UserStatus,
  KYCStatus,
  UnitStatus,
  UnitType,
  DevelopmentStatus
} from '../types';

// Types for request parameters
export type PaginationParams = {
  page?: number;
  limit?: number;
};

export type UserFilterParams = PaginationParams & {
  id?: string;
  email?: string;
  role?: UserRole;
  search?: string;
};

export type UnitFilterParams = PaginationParams & {
  id?: string;
  developmentId?: string;
  status?: UnitStatus;
  type?: UnitType;
  minBedrooms?: number;
  maxBedrooms?: number;
  minPrice?: number;
  maxPrice?: number;
};

export type SaleFilterParams = PaginationParams & {
  id?: string;
  unitId?: string;
  developmentId?: string;
  buyerId?: string;
  status?: string;
  stage?: SaleStage;
  from?: Date;
  to?: Date;
};

export type DocumentFilterParams = PaginationParams & {
  id?: string;
  userId?: string;
  unitId?: string;
  developmentId?: string;
  saleId?: string;
  type?: DocumentType;
  search?: string;
};

export type DevelopmentFilterParams = PaginationParams & {
  id?: string;
  developerId?: string;
  status?: DevelopmentStatus;
  location?: string;
  search?: string;
};

// Response types with pagination
export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
};

// API error types
export class ApiError extends Error {
  code: string;
  status: number;
  details?: Record<string, any>
  );
  constructor(message: string, code: string, status: number, details?: Record<string, any>) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

/**
 * Helper async function toresponse.json();
    } catch (e) {
      throw new ApiError(
        response.statusText || 'An error occurred',
        'UNKNOWN_ERROR',
        response.status
      );
    }

    const { error } = errorData;
    throw new ApiError(
      error?.message || 'An error occurred',
      error?.code || 'UNKNOWN_ERROR',
      response.status,
      error?.details
    );
  }

  return await response.json() as T;
}

/**
 * Helper function to build URL with query parameters
 */
function buildUrl(endpoint: string, params?: Record<string, any>): string {
  if (!params) return endpoint;

  const url = new URL(endpoint, window.location.origin);

  Object.entries(params).forEach(([keyvalue]) => {
    if (value !== undefined && value !== null) {
      if (value instanceof Date) {
        url.searchParams.append(key, value.toISOString());
      } else {
        url.searchParams.append(key, String(value));
      }
    }
  });

  return url.toString();
}

/**
 * Central API service for all backend interactions
 */
export const api = {
  /**
   * User API methods
   */
  users: {
    /**
     * Get a list of users or a specific user
     */
    async getUsers(params?: UserFilterParams): Promise<PaginatedResponse<User>> {
      const url = buildUrl('/api/users', params);
      const response = await fetch(url);
      return handleResponse<PaginatedResponse<User>>(response);
    },

    /**
     * Get a single user by ID
     */
    async getUser(id: string): Promise<User> {
      const url = buildUrl(`/api/users`, { id });
      const response = await fetch(url);
      const data = await handleResponse<{ users: User[] }>(response);
      if (!data.users.length) {
        throw new ApiError('User not found', 'USER_NOT_FOUND', 404);
      }
      return data.users[0];
    },

    /**
     * Create a new user
     */
    async createUser(userData: {
      email: string;
      firstName: string;
      lastName: string;
      password: string;
      phone?: string;
      roles: UserRole[];
      organization?: string;
      position?: string;
    }): Promise<User> {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      return handleResponse<User>(response);
    },

    /**
     * Update an existing user
     */
    async updateUser(userData: {
      id: string;
      firstName?: string;
      lastName?: string;
      phone?: string;
      organization?: string;
      position?: string;
      roles?: UserRole[];
      status?: UserStatus;
      kycStatus?: KYCStatus;
    }): Promise<User> {
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      return handleResponse<User>(response);
    },

    /**
     * Delete a user
     */
    async deleteUser(id: string): Promise<{ success: boolean; message: string }> {
      const url = buildUrl('/api/users', { id });
      const response = await fetch(url, { method: 'DELETE' });
      return handleResponse<{ success: boolean; message: string }>(response);
    }
  },

  /**
   * Units API methods
   */
  units: {
    /**
     * Get a list of units or a specific unit
     */
    async getUnits(params?: UnitFilterParams): Promise<PaginatedResponse<Unit>> {
      const url = buildUrl('/api/units', params);
      const response = await fetch(url);
      return handleResponse<PaginatedResponse<Unit>>(response);
    },

    /**
     * Get a single unit by ID
     */
    async getUnit(id: string): Promise<Unit> {
      const url = buildUrl(`/api/units`, { id });
      const response = await fetch(url);
      const data = await handleResponse<{ units: Unit[] }>(response);
      if (!data.units.length) {
        throw new ApiError('Unit not found', 'UNIT_NOT_FOUND', 404);
      }
      return data.units[0];
    },

    /**
     * Create a new unit
     */
    async createUnit(unitData: {
      developmentId: string;
      name: string;
      type: UnitType;
      status: UnitStatus;
      bedrooms: number;
      bathrooms: number;
      area: number;
      price: number;
      features?: string[];
      images?: string[];
      floorPlan?: string;
    }): Promise<Unit> {
      const response = await fetch('/api/units', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(unitData)
      });
      return handleResponse<Unit>(response);
    },

    /**
     * Update an existing unit
     */
    async updateUnit(unitData: {
      id: string;
      name?: string;
      type?: UnitType;
      status?: UnitStatus;
      bedrooms?: number;
      bathrooms?: number;
      area?: number;
      price?: number;
      features?: string[];
      images?: string[];
      floorPlan?: string;
    }): Promise<Unit> {
      const response = await fetch('/api/units', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(unitData)
      });
      return handleResponse<Unit>(response);
    },

    /**
     * Delete a unit
     */
    async deleteUnit(id: string): Promise<{ success: boolean; message: string }> {
      const url = buildUrl('/api/units', { id });
      const response = await fetch(url, { method: 'DELETE' });
      return handleResponse<{ success: boolean; message: string }>(response);
    }
  },

  /**
   * Sales API methods
   */
  sales: {
    /**
     * Get a list of sales or a specific sale
     */
    async getSales(params?: SaleFilterParams): Promise<PaginatedResponse<Sale>> {
      const url = buildUrl('/api/sales', params);
      const response = await fetch(url);
      return handleResponse<PaginatedResponse<Sale>>(response);
    },

    /**
     * Get a single sale by ID
     */
    async getSale(id: string): Promise<Sale> {
      const url = buildUrl(`/api/sales`, { id });
      const response = await fetch(url);
      const data = await handleResponse<{ sales: Sale[] }>(response);
      if (!data.sales.length) {
        throw new ApiError('Sale not found', 'SALE_NOT_FOUND', 404);
      }
      return data.sales[0];
    },

    /**
     * Create a new sale
     */
    async createSale(saleData: {
      unitId: string;
      buyerId: string;
      price: number;
      depositAmount: number;
      solicitorId?: string;
      estimatedCompletionDate?: Date;
    }): Promise<Sale> {
      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saleData)
      });
      return handleResponse<Sale>(response);
    },

    /**
     * Update a sale's status
     */
    async updateSaleStatus(id: string, status: string, stage: SaleStage): Promise<Sale> {
      const response = await fetch('/api/sales', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          updateType: 'status',
          status,
          stage
        })
      });
      return handleResponse<Sale>(response);
    },

    /**
     * Record a deposit payment
     */
    async recordDeposit(id: string, depositData: {
      depositPaid: boolean;
      depositDate: Date;
      depositAmount: number;
    }): Promise<Sale> {
      const response = await fetch('/api/sales', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          updateType: 'deposit',
          ...depositData
        })
      });
      return handleResponse<Sale>(response);
    },

    /**
     * Add a note to a sale
     */
    async addNote(id: string, note: string): Promise<Sale> {
      const response = await fetch('/api/sales', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          updateType: 'note',
          note
        })
      });
      return handleResponse<Sale>(response);
    },

    /**
     * Cancel a sale
     */
    async cancelSale(id: string, reason: string): Promise<{ 
      id: string;
      status: string;
      cancellationReason: string;
      cancellationDate: string;
    }> {
      const url = buildUrl('/api/sales', { id });
      const response = await fetch(url, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      });
      return handleResponse<{
        id: string;
        status: string;
        cancellationReason: string;
        cancellationDate: string;
      }>(response);
    }
  },

  /**
   * Documents API methods
   */
  documents: {
    /**
     * Get a list of documents or a specific document
     */
    async getDocuments(params?: DocumentFilterParams): Promise<PaginatedResponse<Document>> {
      const url = buildUrl('/api/documents', params);
      const response = await fetch(url);
      return handleResponse<PaginatedResponse<Document>>(response);
    },

    /**
     * Get a single document by ID
     */
    async getDocument(id: string): Promise<Document> {
      const url = buildUrl(`/api/documents`, { id });
      const response = await fetch(url);
      const data = await handleResponse<{ documents: Document[] }>(response);
      if (!data.documents.length) {
        throw new ApiError('Document not found', 'DOCUMENT_NOT_FOUND', 404);
      }
      return data.documents[0];
    },

    /**
     * Create a new document
     */
    async createDocument(documentData: {
      title: string;
      description?: string;
      fileUrl: string;
      fileType: string;
      fileSize: number;
      type: DocumentType;
      userId?: string;
      saleId?: string;
      unitId?: string;
      developmentId?: string;
      isTemplate?: boolean;
    }): Promise<Document> {
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(documentData)
      });
      return handleResponse<Document>(response);
    },

    /**
     * Update an existing document
     */
    async updateDocument(documentData: {
      id: string;
      title?: string;
      description?: string;
      status?: string;
    }): Promise<Document> {
      const response = await fetch('/api/documents', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(documentData)
      });
      return handleResponse<Document>(response);
    },

    /**
     * Delete a document
     */
    async deleteDocument(id: string, soft = true): Promise<{ success: boolean; message: string }> {
      const url = buildUrl('/api/documents', { id, soft });
      const response = await fetch(url, { method: 'DELETE' });
      return handleResponse<{ success: boolean; message: string }>(response);
    }
  },

  /**
   * Developments API methods
   */
  developments: {
    /**
     * Get a list of developments or a specific development
     */
    async getDevelopments(params?: DevelopmentFilterParams): Promise<PaginatedResponse<Development>> {
      const url = buildUrl('/api/developments', params);
      const response = await fetch(url);
      return handleResponse<PaginatedResponse<Development>>(response);
    },

    /**
     * Get a single development by ID
     */
    async getDevelopment(id: string): Promise<Development> {
      const url = buildUrl(`/api/developments`, { id });
      const response = await fetch(url);
      const data = await handleResponse<{ developments: Development[] }>(response);
      if (!data.developments.length) {
        throw new ApiError('Development not found', 'DEVELOPMENT_NOT_FOUND', 404);
      }
      return data.developments[0];
    },

    /**
     * Create a new development
     */
    async createDevelopment(developmentData: {
      name: string;
      description: string;
      status: DevelopmentStatus;
      location: {
        address: string;
        city: string;
        county: string;
        eircode?: string;
        coordinates?: {
          latitude: number;
          longitude: number;
        };
      };
      totalUnits: number;
      startDate: Date;
      estimatedCompletionDate: Date;
      features?: string[];
      images?: string[];
      brochureUrl?: string;
    }): Promise<Development> {
      const response = await fetch('/api/developments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(developmentData)
      });
      return handleResponse<Development>(response);
    },

    /**
     * Update an existing development
     */
    async updateDevelopment(developmentData: {
      id: string;
      name?: string;
      description?: string;
      status?: DevelopmentStatus;
      location?: {
        address?: string;
        city?: string;
        county?: string;
        eircode?: string;
        coordinates?: {
          latitude: number;
          longitude: number;
        };
      };
      totalUnits?: number;
      startDate?: Date;
      estimatedCompletionDate?: Date;
      features?: string[];
      images?: string[];
      brochureUrl?: string;
    }): Promise<Development> {
      const response = await fetch('/api/developments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(developmentData)
      });
      return handleResponse<Development>(response);
    },

    /**
     * Delete a development
     */
    async deleteDevelopment(id: string): Promise<{ success: boolean; message: string }> {
      const url = buildUrl('/api/developments', { id });
      const response = await fetch(url, { method: 'DELETE' });
      return handleResponse<{ success: boolean; message: string }>(response);
    }
  }
};

export default api;