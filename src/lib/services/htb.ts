// @/lib/services/htb.ts
import { HTBClaim, HTBClaimStatus } from '@/types/htb';
import { api } from '../api-client';

export class HTBService {
  /**
   * Fetch all HTB claims for a developer
   */
  async getDeveloperClaims(): Promise<HTBClaim[]> {
    try {
      return await api.get<HTBClaim[]>('/htb/developer/claims');
    } catch (error) {

      throw error;
    }
  }

  /**
   * Fetch all HTB claims for a buyer
   */
  async getBuyerClaims(): Promise<HTBClaim[]> {
    try {
      return await api.get<HTBClaim[]>('/htb/buyer/claims');
    } catch (error) {

      throw error;
    }
  }

  /**
   * Fetch a specific HTB claim by ID
   */
  async getClaimById(claimId: string, role: 'buyer' | 'developer'): Promise<HTBClaim> {
    try {
      return await api.get<HTBClaim>(`/htb/${role}/claims/${claimId}`);
    } catch (error) {

      throw error;
    }
  }

  /**
   * Create a new HTB claim
   */
  async createClaim(propertyId: string, requestedAmount: number): Promise<HTBClaim> {
    try {
      return await api.post<HTBClaim>('/htb/buyer/claims', {
        propertyId,
        requestedAmount
      });
    } catch (error) {

      throw error;
    }
  }

  /**
   * Update a claim with the buyer's access code
   */
  async updateClaimAccessCode(
    claimId: string,
    accessCode: string,
    accessCodeExpiryDate: Date,
    documentFile?: File
  ): Promise<HTBClaim> {
    try {
      // Create form data if file is provided
      if (documentFile) {
        const formData = new FormData();
        formData.append('accessCode', accessCode);
        formData.append('accessCodeExpiryDate', accessCodeExpiryDate.toISOString());
        formData.append('documentFile', documentFile);

        // Use custom fetch for FormData
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/htb/buyer/claims/${claimId}/access-code`, {
          method: 'PUT',
          body: formData,
          headers: {
            // Don't set Content-Type for FormData (browser will set with boundary)
            Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to update access code: ${response.status}`);
        }

        return await response.json();
      } else {
        // Use regular API client for JSON
        return await api.put<HTBClaim>(`/htb/buyer/claims/${claimId}/access-code`, {
          accessCode,
          accessCodeExpiryDate: accessCodeExpiryDate.toISOString()
        });
      }
    } catch (error) {

      throw error;
    }
  }

  /**
   * Process a buyer's access code (developer action)
   */
  async processAccessCode(
    claimId: string,
    status: 'processing' | 'rejected',
    notes: string
  ): Promise<HTBClaim> {
    try {
      return await api.put<HTBClaim>(`/htb/developer/claims/${claimId}/process-access-code`, {
        status,
        notes
      });
    } catch (error) {

      throw error;
    }
  }

  /**
   * Update a claim with the claim code from Revenue (developer action)
   */
  async updateClaimCode(
    claimId: string,
    claimCode: string,
    claimCodeExpiryDate: Date,
    approvedAmount: number,
    documentFile?: File
  ): Promise<HTBClaim> {
    try {
      // Create form data if file is provided
      if (documentFile) {
        const formData = new FormData();
        formData.append('claimCode', claimCode);
        formData.append('claimCodeExpiryDate', claimCodeExpiryDate.toISOString());
        formData.append('approvedAmount', approvedAmount.toString());
        formData.append('documentFile', documentFile);

        // Use custom fetch for FormData
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/htb/developer/claims/${claimId}/claim-code`, {
          method: 'PUT',
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to update claim code: ${response.status}`);
        }

        return await response.json();
      } else {
        // Use regular API client for JSON
        return await api.put<HTBClaim>(`/htb/developer/claims/${claimId}/claim-code`, {
          claimCode,
          claimCodeExpiryDate: claimCodeExpiryDate.toISOString(),
          approvedAmount
        });
      }
    } catch (error) {

      throw error;
    }
  }

  /**
   * Request HTB funds from Revenue (developer action)
   */
  async requestFunds(
    claimId: string,
    requestDate: Date,
    notes: string,
    documentFile?: File
  ): Promise<HTBClaim> {
    try {
      // Handle file uploads using FormData when needed
      if (documentFile) {
        const formData = new FormData();
        formData.append('requestDate', requestDate.toISOString());
        formData.append('notes', notes);
        formData.append('documentFile', documentFile);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/htb/developer/claims/${claimId}/request-funds`, {
          method: 'PUT',
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to request funds: ${response.status}`);
        }

        return await response.json();
      } else {
        return await api.put<HTBClaim>(`/htb/developer/claims/${claimId}/request-funds`, {
          requestDate: requestDate.toISOString(),
          notes
        });
      }
    } catch (error) {

      throw error;
    }
  }

  /**
   * Mark HTB funds as received (developer action)
   */
  async markFundsReceived(
    claimId: string,
    receivedAmount: number,
    receivedDate: Date,
    documentFile?: File
  ): Promise<HTBClaim> {
    try {
      // Handle file uploads using FormData when needed
      if (documentFile) {
        const formData = new FormData();
        formData.append('receivedAmount', receivedAmount.toString());
        formData.append('receivedDate', receivedDate.toISOString());
        formData.append('documentFile', documentFile);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/htb/developer/claims/${claimId}/funds-received`, {
          method: 'PUT',
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to mark funds as received: ${response.status}`);
        }

        return await response.json();
      } else {
        return await api.put<HTBClaim>(`/htb/developer/claims/${claimId}/funds-received`, {
          receivedAmount,
          receivedDate: receivedDate.toISOString()
        });
      }
    } catch (error) {

      throw error;
    }
  }

  /**
   * Mark HTB deposit as applied to the buyer's deposit (developer action)
   */
  async markDepositApplied(
    claimId: string,
    appliedDate: Date,
    notes: string,
    documentFile?: File
  ): Promise<HTBClaim> {
    try {
      // Handle file uploads using FormData when needed
      if (documentFile) {
        const formData = new FormData();
        formData.append('appliedDate', appliedDate.toISOString());
        formData.append('notes', notes);
        formData.append('documentFile', documentFile);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/htb/developer/claims/${claimId}/deposit-applied`, {
          method: 'PUT',
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to mark deposit as applied: ${response.status}`);
        }

        return await response.json();
      } else {
        return await api.put<HTBClaim>(`/htb/developer/claims/${claimId}/deposit-applied`, {
          appliedDate: appliedDate.toISOString(),
          notes
        });
      }
    } catch (error) {

      throw error;
    }
  }

  /**
   * Complete a HTB claim (developer action)
   */
  async completeClaim(
    claimId: string,
    completionDate: Date,
    notes: string,
    documentFile?: File
  ): Promise<HTBClaim> {
    try {
      // Handle file uploads using FormData when needed
      if (documentFile) {
        const formData = new FormData();
        formData.append('completionDate', completionDate.toISOString());
        formData.append('notes', notes);
        formData.append('documentFile', documentFile);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/htb/developer/claims/${claimId}/complete`, {
          method: 'PUT',
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to complete claim: ${response.status}`);
        }

        return await response.json();
      } else {
        return await api.put<HTBClaim>(`/htb/developer/claims/${claimId}/complete`, {
          completionDate: completionDate.toISOString(),
          notes
        });
      }
    } catch (error) {

      throw error;
    }
  }

  /**
   * Add a note to a HTB claim
   */
  async addNote(claimId: string, content: string, isPrivate: boolean): Promise<HTBClaim> {
    try {
      return await api.post<HTBClaim>(`/htb/claims/${claimId}/notes`, {
        content,
        isPrivate
      });
    } catch (error) {

      throw error;
    }
  }

  /**
   * Upload a document to a HTB claim
   */
  async uploadDocument(
    claimId: string,
    file: File,
    type: string,
    name: string
  ): Promise<HTBClaim> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      formData.append('name', name || file.name);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/htb/claims/${claimId}/documents`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to upload document: ${response.status}`);
      }

      return await response.json();
    } catch (error) {

      throw error;
    }
  }

  /**
   * Get all documents for a HTB claim
   */
  async getDocuments(claimId: string): Promise<any[]> {
    try {
      return await api.get<any[]>(`/htb/claims/${claimId}/documents`);
    } catch (error) {

      throw error;
    }
  }

  /**
   * Delete a document from a HTB claim
   */
  async deleteDocument(claimId: string, documentId: string): Promise<void> {
    try {
      await api.delete(`/htb/claims/${claimId}/documents/${documentId}`);
    } catch (error) {

      throw error;
    }
  }
}

// Export singleton instance
export const htbService = new HTBService();