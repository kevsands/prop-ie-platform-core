'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api-client';

// Transaction-related types
export type TransactionStatus = 
  | 'DRAFT' 
  | 'RESERVED' 
  | 'DEPOSIT_PAID'
  | 'CONTRACTED' 
  | 'MORTGAGE_APPROVED'
  | 'CLOSING' 
  | 'COMPLETED'
  | 'CANCELLED';

export interface TransactionParticipant {
  id: string;
  role: 'BUYER' | 'DEVELOPER' | 'AGENT' | 'BUYER_SOLICITOR' | 'VENDOR_SOLICITOR' | 'LENDER';
  userId: string;
  name: string;
  email: string;
  phone?: string;
  joinedAt: string;
  status: 'ACTIVE' | 'PENDING' | 'INACTIVE';
}

export interface TransactionDocument {
  id: string;
  name: string;
  type: string;
  uploadedBy: string;
  uploadedAt: string;
  url: string;
  category: 'CONTRACT' | 'MORTGAGE' | 'SURVEY' | 'TITLE' | 'OTHER';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  visibleTo: string[]; // User IDs who can see this document
}

export interface TransactionMilestone {
  id: string;
  name: string;
  description: string;
  order: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED';
  completedAt?: string;
  completedBy?: string;
  dueDate?: string;
  requirements: string[];
  documents: string[]; // Document IDs required for this milestone
}

export interface TransactionMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  content: string;
  timestamp: string;
  readBy: string[]; // User IDs who have read this message
  attachments?: TransactionDocument[];
}

export interface Transaction {
  id: string;
  propertyId: string;
  buyerId: string;
  developerId: string;
  agentId?: string;
  status: TransactionStatus;
  priceInCents: number;
  depositAmountInCents: number;
  depositPaidAt?: string;
  createdAt: string;
  updatedAt: string;
  participants: TransactionParticipant[];
  documents: TransactionDocument[];
  milestones: TransactionMilestone[];
  messages: TransactionMessage[];
  metadata: {
    propertyAddress: string;
    propertyType: string;
    developmentName: string;
    unitNumber?: string;
    bedrooms: number;
    bathrooms: number;
  };
}

interface TransactionContextType {
  currentTransaction: Transaction | null;
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  
  // Actions
  loadTransaction: (transactionId: string) => Promise<void>;
  loadTransactions: () => Promise<void>;
  createTransaction: (data: Partial<Transaction>) => Promise<Transaction>;
  updateTransaction: (transactionId: string, updates: Partial<Transaction>) => Promise<void>;
  updateTransactionStatus: (transactionId: string, status: TransactionStatus) => Promise<void>;
  // Document management
  uploadDocument: (transactionId: string, file: File, metadata: Partial<TransactionDocument>) => Promise<void>;
  deleteDocument: (transactionId: string, documentId: string) => Promise<void>;
  updateDocumentStatus: (transactionId: string, documentId: string, status: TransactionDocument['status']) => Promise<void>;
  // Messaging
  sendMessage: (transactionId: string, content: string, attachments?: File[]) => Promise<void>;
  markMessageAsRead: (transactionId: string, messageId: string) => Promise<void>;
  // Milestone management
  updateMilestoneStatus: (transactionId: string, milestoneId: string, status: TransactionMilestone['status']) => Promise<void>;
  // Participant management
  inviteParticipant: (transactionId: string, participant: Partial<TransactionParticipant>) => Promise<void>;
  removeParticipant: (transactionId: string, participantId: string) => Promise<void>;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTransactionsetCurrentTransaction] = useState<Transaction | null>(null);
  const [transactionssetTransactions] = useState<Transaction[]>([]);
  const [loadingsetLoading] = useState(false);
  const [errorsetError] = useState<string | null>(null);
  
  // Try to use auth context if available
  let user = null;
  try {
    const authContext = useContext(AuthContext);
    user = authContext?.user || null;
  } catch (error) {
    // Auth context not available, continue without user
    console.debug('AuthContext not available in TransactionProvider');
  }

  // Load transactions for the current user
  const loadTransactions = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/transactions');
      setTransactions(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  // Load a specific transaction
  const loadTransaction = async (transactionId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/transactions/${transactionId}`);
      setCurrentTransaction(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load transaction');
    } finally {
      setLoading(false);
    }
  };

  // Create a new transaction
  const createTransaction = async (data: Partial<Transaction>): Promise<Transaction> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/transactions', data);
      const newTransaction = response.data;
      setTransactions([...transactionsnewTransaction]);
      return newTransaction;
    } catch (err: any) {
      setError(err.message || 'Failed to create transaction');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update a transaction
  const updateTransaction = async (transactionId: string, updates: Partial<Transaction>) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.patch(`/transactions/${transactionId}`, updates);
      const updated = response.data;
      
      setTransactions(transactions.map(t => t.id === transactionId ? updated : t));
      if (currentTransaction?.id === transactionId) {
        setCurrentTransaction(updated);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update transaction');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update transaction status
  const updateTransactionStatus = async (transactionId: string, status: TransactionStatus) => {
    await updateTransaction(transactionId, { status });
  };

  // Upload a document
  const uploadDocument = async (
    transactionId: string, 
    file: File, 
    metadata: Partial<TransactionDocument>
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('metadata', JSON.stringify(metadata));
      
      const response = await api.post(
        `/transactions/${transactionId}/documents`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      const updatedTransaction = response.data;
      setTransactions(transactions.map(t => t.id === transactionId ? updatedTransaction : t));
      if (currentTransaction?.id === transactionId) {
        setCurrentTransaction(updatedTransaction);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload document');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a document
  const deleteDocument = async (transactionId: string, documentId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.delete(`/transactions/${transactionId}/documents/${documentId}`);
      const updatedTransaction = response.data;
      
      setTransactions(transactions.map(t => t.id === transactionId ? updatedTransaction : t));
      if (currentTransaction?.id === transactionId) {
        setCurrentTransaction(updatedTransaction);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete document');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update document status
  const updateDocumentStatus = async (
    transactionId: string, 
    documentId: string, 
    status: TransactionDocument['status']
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.patch(
        `/transactions/${transactionId}/documents/${documentId}`,
        { status }
      );
      const updatedTransaction = response.data;
      
      setTransactions(transactions.map(t => t.id === transactionId ? updatedTransaction : t));
      if (currentTransaction?.id === transactionId) {
        setCurrentTransaction(updatedTransaction);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update document status');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Send a message
  const sendMessage = async (
    transactionId: string, 
    content: string, 
    attachments?: File[]
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('content', content);
      
      if (attachments) {
        attachments.forEach((fileindex: any) => {
          formData.append(`attachments[${index}]`, file);
        });
      }
      
      const response = await api.post(
        `/transactions/${transactionId}/messages`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      const updatedTransaction = response.data;
      setTransactions(transactions.map(t => t.id === transactionId ? updatedTransaction : t));
      if (currentTransaction?.id === transactionId) {
        setCurrentTransaction(updatedTransaction);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send message');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Mark message as read
  const markMessageAsRead = async (transactionId: string, messageId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.patch(
        `/transactions/${transactionId}/messages/${messageId}/read`
      );
      const updatedTransaction = response.data;
      
      setTransactions(transactions.map(t => t.id === transactionId ? updatedTransaction : t));
      if (currentTransaction?.id === transactionId) {
        setCurrentTransaction(updatedTransaction);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to mark message as read');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update milestone status
  const updateMilestoneStatus = async (
    transactionId: string, 
    milestoneId: string, 
    status: TransactionMilestone['status']
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.patch(
        `/transactions/${transactionId}/milestones/${milestoneId}`,
        { status }
      );
      const updatedTransaction = response.data;
      
      setTransactions(transactions.map(t => t.id === transactionId ? updatedTransaction : t));
      if (currentTransaction?.id === transactionId) {
        setCurrentTransaction(updatedTransaction);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update milestone status');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Invite a participant
  const inviteParticipant = async (
    transactionId: string, 
    participant: Partial<TransactionParticipant>
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post(
        `/transactions/${transactionId}/participants`,
        participant
      );
      const updatedTransaction = response.data;
      
      setTransactions(transactions.map(t => t.id === transactionId ? updatedTransaction : t));
      if (currentTransaction?.id === transactionId) {
        setCurrentTransaction(updatedTransaction);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to invite participant');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Remove a participant
  const removeParticipant = async (transactionId: string, participantId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.delete(
        `/transactions/${transactionId}/participants/${participantId}`
      );
      const updatedTransaction = response.data;
      
      setTransactions(transactions.map(t => t.id === transactionId ? updatedTransaction : t));
      if (currentTransaction?.id === transactionId) {
        setCurrentTransaction(updatedTransaction);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to remove participant');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Load transactions when user changes
  useEffect(() => {
    if (user) {
      loadTransactions();
    }
  }, [user]);

  const value: TransactionContextType = {
    currentTransaction,
    transactions,
    loading,
    error,
    loadTransaction,
    loadTransactions,
    createTransaction,
    updateTransaction,
    updateTransactionStatus,
    uploadDocument,
    deleteDocument,
    updateDocumentStatus,
    sendMessage,
    markMessageAsRead,
    updateMilestoneStatus,
    inviteParticipant,
    removeParticipant};

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransaction = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransaction must be used within a TransactionProvider');
  }
  return context;
};