import { ErrorFactory } from '../errors/buyer-journey-errors';
import { z } from 'zod';
import { depositPaymentSchema, unitReservationSchema } from '../validation/buyer-journey';
import { createQueryKeys } from '@/lib/react-query-config';

// Query keys for React Query caching
export const buyerJourneyQueryKeys = createQueryKeys('buyerJourney', {
  units: (developmentId?: string) => ['units', developmentId],
  unit: (unitId: string) => ['unit', unitId],
  transaction: (transactionId: string) => ['transaction', transactionId],
  kycStatus: (userId: string) => ['kyc', 'status', userId],
  kycVerification: (verificationId: string) => ['kyc', 'verification', verificationId],
  reservations: (buyerId?: string) => ['reservations', buyerId]
});

// API response types
export interface UnitDetails {
  id: string;
  developmentId: string;
  type: string;
  size: number;
  bedrooms: number;
  bathrooms: number;
  floors: number;
  parkingSpaces: number;
  basePrice: number;
  status: 'AVAILABLE' | 'RESERVED' | 'SOLD';
  berRating: string;
  features: string[];
  primaryImage: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  buyerId: string;
  developmentId: string;
  unitId: string;
  status: string;
  stage: string;
  agreedPrice: number;
  mortgageRequired: boolean;
  helpToBuyUsed: boolean;
  createdAt: string;
  updatedAt: string;
  unit: UnitDetails;
}

export interface KYCVerificationStatus {
  verified: boolean;
  userId: string;
  verificationDate: string | null;
}

// Centralized fetch with error handling
async function apiFetch<TData = any, TInput = any>(
  endpoint: string,
  options: {
    method?: string;
    body?: TInput;
    schema?: z.ZodType<TData>
  );
    auth?: boolean;
    retry?: boolean;
  } = {}
): Promise<TData> {
  const {
    method = 'GET',
    body,
    schema,
    auth = true,
    retry = true
  } = options;

  try {
    const response = await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(auth && { Authorization: `Bearer ${localStorage.getItem('token')}` })
      },
      ...(body && { body: JSON.stringify(body) })
    });

    if (!response.ok) {
      // For 401 errors, trigger a refresh if we have a refresh token
      if (response.status === 401 && retry) {
        const refreshed = await refreshToken();

        if (refreshed) {
          // Retry request with new token
          return apiFetch(endpoint, {
            ...options,
            retry: false // Prevent infinite retry loops
          });
        }
      }

      const errorData = await response.json().catch(() => ({}));
      throw ErrorFactory.fromApiResponse({ status: response.status, data: errorData });
    }

    const data = await response.json();

    // Validate response data if schema provided
    if (schema) {
      try {
        return schema.parse(data);
      } catch (validationError) {
        throw ErrorFactory.fromValidationError(validationError);
      }
    }

    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw ErrorFactory.fromNetworkError(error);
    }
    throw error;
  }
}

// Token refresh logic
async function refreshToken(): Promise<boolean> {
  try {
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      return false;
    }

    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refreshToken })
    });

    if (!response.ok) {
      // Clear invalid tokens
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      return false;
    }

    const data = await response.json();

    // Update tokens
    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);

    return true;
  } catch (error) {
    return false;
  }
}

/**
 * API functions for buyer journey
 */
export const buyerJourneyApi = {
  // Unit Management
  getUnit: async (unitId: string): Promise<UnitDetails> => {
    return apiFetch(`/api/units?id=${unitId}`);
  },

  getUnits: async (developmentId: string, filters?: Record<string, any>): Promise<{units: UnitDetails[], pagination: any}> => {
    const queryParams = new URLSearchParams();

    if (developmentId) {
      queryParams.append('developmentId', developmentId);
    }

    if (filters) {
      Object.entries(filters).forEach(([keyvalue]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }

    return apiFetch(`/api/units?${queryParams.toString()}`);
  },

  // Transaction Management
  createReservation: async (data: z.infer<typeof unitReservationSchema>): Promise<Transaction> => {
    try {
      const validatedData = unitReservationSchema.parse(data);

      return apiFetch('/api/transactions', {
        method: 'POST',
        body: validatedData
      });
    } catch (validationError) {
      throw ErrorFactory.fromValidationError(validationError);
    }
  },

  getTransaction: async (transactionId: string): Promise<Transaction> => {
    return apiFetch(`/api/transactions/${transactionId}`);
  },

  getTransactions: async (filters?: Record<string, any>): Promise<{transactions: Transaction[], pagination: any}> => {
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([keyvalue]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }

    return apiFetch(`/api/transactions?${queryParams.toString()}`);
  },

  updateTransactionStatus: async (transactionId: string, newStatus: string, notes?: string): Promise<Transaction> => {
    return apiFetch(`/api/transactions/${transactionId}`, {
      method: 'PATCH',
      body: {
        updates: {
          status: newStatus,
          notes
        }
      }
    });
  },

  // KYC Verification
  startKYCVerification: async (transactionId: string): Promise<{verificationId: string}> => {
    return apiFetch('/api/v1/kyc/start', {
      method: 'POST',
      body: { transactionId }
    });
  },

  uploadDocument: async (formData: FormData): Promise<any> => {
    const response = await fetch('/api/v1/kyc/upload', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw ErrorFactory.fromApiResponse({ status: response.status, data: errorData });
    }

    return response.json();
  },

  performAMLScreening: async (verificationId: string): Promise<any> => {
    return apiFetch('/api/v1/kyc/aml-screening', {
      method: 'POST',
      body: { verificationId }
    });
  },

  completeVerification: async (verificationId: string): Promise<any> => {
    return apiFetch('/api/v1/kyc/complete', {
      method: 'POST',
      body: { verificationId }
    });
  },

  getKYCStatus: async (userId: string): Promise<KYCVerificationStatus> => {
    return apiFetch('/api/kyc/status');
  },

  // Payment Processing
  processDeposit: async (data: z.infer<typeof depositPaymentSchema>): Promise<any> => {
    try {
      const validatedData = depositPaymentSchema.parse(data);

      return apiFetch(`/api/transactions/${validatedData.transactionId}/payments`, {
        method: 'POST',
        body: validatedData
      });
    } catch (validationError) {
      throw ErrorFactory.fromValidationError(validationError);
    }
  },

  getPaymentMethods: async (): Promise<any> => {
    return apiFetch('/api/payment-methods');
  }
};