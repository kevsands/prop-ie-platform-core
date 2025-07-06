/**
 * Buyer REST API Service
 * 
 * Service layer that adapts the buyer API hooks to use the newly enabled REST endpoints
 * instead of GraphQL. This preserves the existing hook structure while connecting to real APIs.
 */

import { authService } from './authService';

// API Base URL
const API_BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '';

// Types matching the existing buyer API hook interface
export interface BuyerProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  currentJourneyPhase?: string;
  financialDetails?: Record<string, unknown>;
  preferences?: Record<string, unknown>;
  governmentSchemes?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface Reservation {
  id: string;
  propertyId: string;
  unitId?: string;
  reservationDate: string;
  status: string;
  depositAmount?: number;
  depositPaid?: boolean;
  agreementSigned?: boolean;
  expiryDate?: string;
  completionDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MortgageTracking {
  id: string;
  status: string;
  lender?: string;
  lenderName?: string;
  amount?: number;
  aipDate?: string;
  aipExpiryDate?: string;
  formalOfferDate?: string;
  conditions?: string[];
  notes?: string;
  documents: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SnagList {
  id: string;
  propertyId: string;
  title: string;
  description?: string;
  status: string;
  items: SnagItem[];
  createdAt: string;
  updatedAt: string;
}

export interface SnagItem {
  id: string;
  snagListId: string;
  title: string;
  description?: string;
  location?: string;
  priority?: string;
  status: string;
  images?: string[];
  developerNotes?: string;
  fixedDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HomePackItem {
  id: string;
  propertyId: string;
  name: string;
  title?: string;
  description?: string;
  category?: string;
  documentUrl?: string;
  expiryDate?: string;
  issuer?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * HTTP Client with authentication
 */
class AuthenticatedApiClient {
  private async getAuthHeaders(): Promise<Record<string, string>> {
    try {
      // Get the current auth token
      const token = localStorage.getItem('auth-token') || sessionStorage.getItem('auth-token');
      
      if (token) {
        return {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        };
      }
      
      return {
        'Content-Type': 'application/json',
      };
    } catch (error) {
      return {
        'Content-Type': 'application/json',
      };
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers,
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      credentials: 'include',
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async delete<T>(endpoint: string): Promise<T> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers,
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }
}

const apiClient = new AuthenticatedApiClient();

/**
 * Buyer REST API Service
 */
export class BuyerRestApiService {
  // Buyer Profile Operations
  async getMyBuyerProfile(): Promise<BuyerProfile> {
    // Use the /api/users/me endpoint for basic profile info
    const userProfile = await apiClient.get<any>('/api/users/me');
    
    // Transform to BuyerProfile format
    return {
      id: userProfile.id,
      name: userProfile.name || `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim(),
      email: userProfile.email,
      phone: userProfile.phone,
      address: userProfile.address,
      currentJourneyPhase: 'discovery', // Default phase
      financialDetails: {},
      preferences: {},
      governmentSchemes: {},
      createdAt: userProfile.createdAt || new Date().toISOString(),
      updatedAt: userProfile.updatedAt || new Date().toISOString(),
    };
  }

  async createBuyerProfile(input: Partial<BuyerProfile>): Promise<BuyerProfile> {
    // For now, return mock data since we need to implement buyer profile creation
    // In a real implementation, this would create a buyer-specific profile
    return {
      id: 'buyer-' + Math.random().toString(36).substring(2, 9),
      name: input.name || 'New Buyer',
      email: input.email || '',
      phone: input.phone,
      address: input.address,
      currentJourneyPhase: 'discovery',
      financialDetails: input.financialDetails || {},
      preferences: input.preferences || {},
      governmentSchemes: input.governmentSchemes || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  async updateBuyerProfile(id: string, input: Partial<BuyerProfile>): Promise<BuyerProfile> {
    // Update user profile via users API
    const updatedUser = await apiClient.put<any>(`/api/users?id=${id}`, {
      name: input.name,
      email: input.email,
      phone: input.phone,
      address: input.address,
    });

    return {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      address: updatedUser.address,
      currentJourneyPhase: input.currentJourneyPhase || 'discovery',
      financialDetails: input.financialDetails || {},
      preferences: input.preferences || {},
      governmentSchemes: input.governmentSchemes || {},
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };
  }

  // Reservation Operations
  async getMyReservations(): Promise<Reservation[]> {
    try {
      // Use the sales API to get user's sales/reservations
      const sales = await apiClient.get<any[]>('/api/sales');
      
      // Transform sales data to reservation format
      return sales.map(sale => ({
        id: sale.id,
        propertyId: sale.unitId || sale.propertyId || 'unknown',
        unitId: sale.unitId,
        reservationDate: sale.createdAt,
        status: this.mapSaleStatusToReservationStatus(sale.status),
        depositAmount: sale.initialAmount || sale.basePrice * 0.1, // 10% default
        depositPaid: sale.initialPaidDate ? true : false,
        agreementSigned: sale.status === 'COMPLETED',
        expiryDate: sale.balanceDueDate,
        completionDate: sale.balancePaidDate,
        createdAt: sale.createdAt,
        updatedAt: sale.updatedAt,
      }));
    } catch (error) {
      return [];
    }
  }

  async getReservation(id: string): Promise<Reservation> {
    try {
      const sale = await apiClient.get<any>(`/api/sales?id=${id}`);
      
      return {
        id: sale.id,
        propertyId: sale.unitId || sale.propertyId || 'unknown',
        unitId: sale.unitId,
        reservationDate: sale.createdAt,
        status: this.mapSaleStatusToReservationStatus(sale.status),
        depositAmount: sale.initialAmount,
        depositPaid: sale.initialPaidDate ? true : false,
        agreementSigned: sale.status === 'COMPLETED',
        expiryDate: sale.balanceDueDate,
        completionDate: sale.balancePaidDate,
        createdAt: sale.createdAt,
        updatedAt: sale.updatedAt,
      };
    } catch (error) {
      throw new Error(`Could not fetch reservation ${id}: ${error}`);
    }
  }

  async createReservation(input: Partial<Reservation>): Promise<Reservation> {
    // Create a new sale record via the sales API
    const saleData = {
      unitId: input.unitId || input.propertyId,
      buyerId: 'current-user', // This should come from auth context
      developmentId: 'current-development',
      basePrice: 400000, // Default price - should come from unit data
      totalPrice: 400000,
      referenceNumber: 'RES-' + Date.now(),
      status: 'RESERVED',
      contractStatus: 'PENDING',
    };

    const newSale = await apiClient.post<any>('/api/sales', saleData);
    
    return {
      id: newSale.id,
      propertyId: input.propertyId!,
      unitId: input.unitId,
      reservationDate: input.reservationDate || new Date().toISOString(),
      status: 'reserved',
      createdAt: newSale.createdAt,
      updatedAt: newSale.updatedAt,
    };
  }

  // Mortgage Tracking Operations
  async getMyMortgageTracking(): Promise<MortgageTracking | null> {
    // For now, return mock data since we need to implement mortgage tracking API
    // This would connect to a mortgage tracking service
    return {
      id: 'mortgage-' + Math.random().toString(36).substring(2, 9),
      status: 'application_submitted',
      lenderName: 'AIB Bank',
      amount: 320000,
      aipDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      aipExpiryDate: new Date(Date.now() + 83 * 24 * 60 * 60 * 1000).toISOString(),
      conditions: ['Income verification', 'Property valuation'],
      notes: 'Application in progress',
      documents: ['aip-letter.pdf', 'salary-certificate.pdf'],
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  async createMortgageTracking(input: Partial<MortgageTracking>): Promise<MortgageTracking> {
    // This would create a new mortgage tracking record
    return {
      id: 'mortgage-' + Math.random().toString(36).substring(2, 9),
      status: input.status || 'draft',
      lenderName: input.lender || input.lenderName,
      amount: input.amount,
      conditions: [],
      notes: input.notes || '',
      documents: input.documents || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  // Snag List Operations
  async getMySnagLists(): Promise<SnagList[]> {
    // For now, return mock data since snag lists need their own API implementation
    return [
      {
        id: 'snag-' + Math.random().toString(36).substring(2, 9),
        propertyId: 'property-1',
        title: 'Pre-Handover Inspection',
        status: 'in_progress',
        items: [
          {
            id: 'item-1',
            snagListId: 'snag-1',
            title: 'Paint touch-up required in bedroom',
            description: 'Small scuff marks on wall near door frame',
            location: 'Master bedroom',
            status: 'open',
            priority: 'low',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];
  }

  // Home Pack Items Operations
  async getHomePackItems(propertyId: string): Promise<HomePackItem[]> {
    try {
      // Use the documents API to get property-related documents
      const documents = await apiClient.get<any>(`/api/documents?propertyId=${propertyId}&type=home_pack`);
      
      return documents.data?.map((doc: any) => ({
        id: doc.id,
        propertyId: doc.propertyId,
        name: doc.title,
        title: doc.title,
        description: doc.description,
        category: doc.category || 'general',
        documentUrl: doc.url,
        issuer: doc.uploadedBy?.firstName + ' ' + doc.uploadedBy?.lastName,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      })) || [];
    } catch (error) {
      return [];
    }
  }

  // Helper methods
  private mapSaleStatusToReservationStatus(saleStatus: string): string {
    switch (saleStatus?.toUpperCase()) {
      case 'RESERVED':
        return 'reserved';
      case 'DEPOSIT_PAID':
        return 'deposit_paid';
      case 'CONTRACT_SIGNED':
        return 'contract_signed';
      case 'COMPLETING':
        return 'completing';
      case 'COMPLETED':
        return 'completed';
      default:
        return 'reserved';
    }
  }
}

// Export singleton instance
export const buyerRestApiService = new BuyerRestApiService();