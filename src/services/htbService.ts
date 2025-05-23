// src/services/htbService.ts
import axios from 'axios';
import { HTBClaim, HTBDocument, HTBNote, HTBClaimStatus } from '../types/htb';

// Create a configured axios instance
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'});

export const htbService = {
  // Buyer methods
  createClaim: async (propertyId: string, requestedAmount: number): Promise<HTBClaim> => {
    const response = await apiClient.post<HTBClaim>('/htb/claims', { propertyId, requestedAmount });
    return response.data;
  },

  getBuyerClaims: async (): Promise<HTBClaim[]> => {
    const response = await apiClient.get<HTBClaim[]>('/htb/claims');
    return response.data;
  },

  getClaimById: async (id: string): Promise<HTBClaim> => {
    const response = await apiClient.get<HTBClaim>(`/htb/claims/${id}`);
    return response.data;
  },

  submitAccessCode: async (id: string, accessCode: string, accessCodeExpiryDate: Date, file?: File): Promise<HTBClaim> => {
    const formData = new FormData();
    formData.append('accessCode', accessCode);
    formData.append('accessCodeExpiryDate', accessCodeExpiryDate.toISOString());
    if (file) formData.append('document', file);

    const response = await apiClient.patch<HTBClaim>(`/htb/claims/${id}/access-code`, formData);
    return response.data;
  },

  // Developer methods
  getDeveloperClaims: async (filters?: { 
    status?: HTBClaimStatus, 
    propertyId?: string,
    fromDate?: Date,
    toDate?: Date
  }): Promise<HTBClaim[]> => {
    const response = await apiClient.get<HTBClaim[]>('/htb/developer/claims', { params: filters });
    return response.data;
  },

  processAccessCode: async (id: string, status: "processing" | "rejected", notes?: string): Promise<HTBClaim> => {
    const response = await apiClient.patch<HTBClaim>(`/htb/developer/claims/${id}/process-access-code`, {
      status,
      notes
    });
    return response.data;
  },

  submitClaimCode: async (
    id: string, 
    claimCode: string, 
    claimCodeExpiryDate: Date, 
    approvedAmount: number,
    file?: File
  ): Promise<HTBClaim> => {
    const formData = new FormData();
    formData.append('claimCode', claimCode);
    formData.append('claimCodeExpiryDate', claimCodeExpiryDate.toISOString());
    formData.append('approvedAmount', approvedAmount.toString());
    if (file) formData.append('document', file);

    const response = await apiClient.patch<HTBClaim>(`/htb/developer/claims/${id}/claim-code`, formData);
    return response.data;
  },

  requestFunds: async (id: string, requestDate: Date, notes?: string, file?: File): Promise<HTBClaim> => {
    const formData = new FormData();
    formData.append('requestDate', requestDate.toISOString());
    if (notes) formData.append('notes', notes);
    if (file) formData.append('document', file);

    const response = await apiClient.patch<HTBClaim>(`/htb/developer/claims/${id}/request-funds`, formData);
    return response.data;
  },

  markFundsReceived: async (id: string, receivedAmount: number, receivedDate: Date, file?: File): Promise<HTBClaim> => {
    const formData = new FormData();
    formData.append('receivedAmount', receivedAmount.toString());
    formData.append('receivedDate', receivedDate.toISOString());
    if (file) formData.append('document', file);

    const response = await apiClient.patch<HTBClaim>(`/htb/developer/claims/${id}/funds-received`, formData);
    return response.data;
  },

  applyDeposit: async (id: string, appliedDate: Date, notes?: string, file?: File): Promise<HTBClaim> => {
    const formData = new FormData();
    formData.append('appliedDate', appliedDate.toISOString());
    if (notes) formData.append('notes', notes);
    if (file) formData.append('document', file);

    const response = await apiClient.patch<HTBClaim>(`/htb/developer/claims/${id}/apply-deposit`, formData);
    return response.data;
  },

  completeClaim: async (id: string, completionDate: Date, notes?: string, file?: File): Promise<HTBClaim> => {
    const formData = new FormData();
    formData.append('completionDate', completionDate.toISOString());
    if (notes) formData.append('notes', notes);
    if (file) formData.append('document', file);

    const response = await apiClient.patch<HTBClaim>(`/htb/developer/claims/${id}/complete`, formData);
    return response.data;
  },

  // Shared methods
  addNote: async (id: string, content: string, isPrivate: boolean = false): Promise<HTBNote> => {
    const response = await apiClient.post<HTBNote>(`/htb/claims/${id}/notes`, { content, isPrivate });
    return response.data;
  },

  uploadDocument: async (id: string, file: File, type: string, name?: string): Promise<HTBDocument> => {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('type', type);
    if (name) formData.append('name', name);

    const response = await apiClient.post<HTBDocument>(`/htb/claims/${id}/documents`, formData);
    return response.data;
  }
};