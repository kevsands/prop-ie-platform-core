'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useEnterpriseAuth } from '@/context/EnterpriseAuthContext';
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

export interface TransactionMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  readBy: string[];
  attachments?: string[];
}

export interface TransactionPayment {
  id: string;
  amount: number;
  currency: string;
  type: 'BOOKING_DEPOSIT' | 'CONTRACT_DEPOSIT' | 'STAGE_PAYMENT' | 'FINAL_PAYMENT';
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  dueDate: string;
  paidDate?: string;
  paidBy?: string;
  reference?: string;
}

export interface TimelineEvent {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  userId: string;
  userName: string;
  metadata?: Record<string, any>;
}

export interface Property {
  id: string;
  developmentId: string;
  developmentName: string;
  address: string;
  type: 'APARTMENT' | 'HOUSE' | 'TOWNHOUSE';
  bedrooms: number;
  bathrooms: number;
  price: number;
  status: 'AVAILABLE' | 'RESERVED' | 'SOLD';
  images: string[];
  features: string[];
}

export interface Transaction {
  id: string;
  reference: string;
  property: Property;
  status: TransactionStatus;
  participants: TransactionParticipant[];
  documents: TransactionDocument[];
  messages: TransactionMessage[];
  timeline: TimelineEvent[];
  payments: TransactionPayment[];
  totalAmount: number;
  currentStage: string;
  createdAt: string;
  updatedAt: string;
  completionDate?: string;
  metadata: Record<string, any>;
}

interface TransactionContextType {
  // Current transaction
  currentTransaction: Transaction | null;
  setCurrentTransaction: (transaction: Transaction | null) => void;
  
  // Transaction list for user
  transactions: Transaction[];
  loadingTransactions: boolean;
  
  // Actions
  updateTransactionStatus: (transactionId: string, status: TransactionStatus) => Promise<void>;
  addDocument: (transactionId: string, document: File, metadata: Partial<TransactionDocument>) => Promise<void>;
  sendMessage: (transactionId: string, content: string, attachments?: File[]) => Promise<void>;
  addParticipant: (transactionId: string, participant: Omit<TransactionParticipant, 'id' | 'joinedAt'>) => Promise<void>;
  removeParticipant: (transactionId: string, participantId: string) => Promise<void>;
  updatePaymentStatus: (transactionId: string, paymentId: string, status: string) => Promise<void>;
  addTimelineEvent: (transactionId: string, event: Omit<TimelineEvent, 'id' | 'timestamp'>) => Promise<void>;
  
  // Queries
  fetchTransaction: (transactionId: string) => Promise<void>;
  fetchUserTransactions: () => Promise<void>;
  searchTransactions: (query: string) => Promise<Transaction[]>;
  
  // Real-time updates
  subscribeToTransaction: (transactionId: string) => () => void;
  subscribeToUserTransactions: () => () => void;
  
  // Helper methods
  getTransactionCount: (status: string) => number;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const useTransaction = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransaction must be used within a TransactionProvider');
  }
  return context;
};

interface TransactionProviderProps {
  children: ReactNode;
}

export const TransactionProvider: React.FC<TransactionProviderProps> = ({ children }) => {
  const { user } = useEnterpriseAuth();
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  // Fetch transaction by ID
  const fetchTransaction = async (transactionId: string) => {
    try {
      const response = await api.get<any>(`/transactions?id=${transactionId}`);
      // Handle the API response format { success: true, data: {...} }
      const transaction = response?.data || response;
      setCurrentTransaction(transaction);
      
      // Update in transactions list if exists
      if (transaction) {
        setTransactions(prev => 
          prev.map(t => t.id === transaction.id ? transaction : t)
        );
      }
    } catch (error) {
      console.error('Error fetching transaction:', error);
      throw error;
    }
  };

  // Fetch all transactions for current user
  const fetchUserTransactions = async () => {
    if (!user) return;
    
    setLoadingTransactions(true);
    try {
      // Use fetch for local Next.js API routes instead of AmplifyAPI
      const response = await fetch('/api/transactions', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      // Handle the API response format { success: true, data: [...] }
      const userTransactions = (data && typeof data === 'object' && 'data' in data) ? data.data : (data || []);
      setTransactions(Array.isArray(userTransactions) ? userTransactions : []);
    } catch (error) {
      console.error('Error fetching user transactions:', error);
      // Set empty array on error to prevent further API calls
      setTransactions([]);
    } finally {
      setLoadingTransactions(false);
    }
  };

  // Update transaction status
  const updateTransactionStatus = async (transactionId: string, status: TransactionStatus) => {
    try {
      const updated = await api.put<Transaction>(`/transactions/${transactionId}/status`, { status });
      
      if (currentTransaction?.id === transactionId) {
        setCurrentTransaction(updated);
      }
      
      setTransactions(prev => 
        prev.map(t => t.id === transactionId ? updated : t)
      );
      
      // Add timeline event
      await addTimelineEvent(transactionId, {
        type: 'STATUS_CHANGE',
        title: 'Status Updated',
        description: `Transaction status changed to ${status}`,
        userId: user?.sub || user?.id || '',
        userName: user?.name || user?.given_name || 'Unknown'
      });
    } catch (error) {
      console.error('Error updating transaction status:', error);
      throw error;
    }
  };

  // Add document to transaction
  const addDocument = async (transactionId: string, document: File, metadata: Partial<TransactionDocument>) => {
    try {
      const formData = new FormData();
      formData.append('file', document);
      formData.append('metadata', JSON.stringify(metadata));
      
      const newDocument = await api.post<TransactionDocument>(
        `/transactions/${transactionId}/documents`,
        formData
      );
      
      // Update local state
      if (currentTransaction?.id === transactionId) {
        setCurrentTransaction({
          ...currentTransaction,
          documents: [...currentTransaction.documents, newDocument]
        });
      }
      
      // Add timeline event
      await addTimelineEvent(transactionId, {
        type: 'DOCUMENT_UPLOAD',
        title: 'Document Uploaded',
        description: `${metadata.name || document.name} uploaded`,
        userId: user?.sub || user?.id || '',
        userName: user?.name || user?.given_name || 'Unknown',
        metadata: { documentId: newDocument.id }
      });
    } catch (error) {
      console.error('Error adding document:', error);
      throw error;
    }
  };

  // Send message in transaction
  const sendMessage = async (transactionId: string, content: string, attachments?: File[]) => {
    try {
      const formData = new FormData();
      formData.append('content', content);
      
      if (attachments) {
        attachments.forEach(file => formData.append('attachments', file));
      }
      
      const message = await api.post<TransactionMessage>(
        `/transactions/${transactionId}/messages`,
        formData
      );
      
      // Update local state
      if (currentTransaction?.id === transactionId) {
        setCurrentTransaction({
          ...currentTransaction,
          messages: [...currentTransaction.messages, message]
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  // Add participant to transaction
  const addParticipant = async (
    transactionId: string, 
    participant: Omit<TransactionParticipant, 'id' | 'joinedAt'>
  ) => {
    try {
      const newParticipant = await api.post<TransactionParticipant>(
        `/transactions/${transactionId}/participants`,
        participant
      );
      
      // Update local state
      if (currentTransaction?.id === transactionId) {
        setCurrentTransaction({
          ...currentTransaction,
          participants: [...currentTransaction.participants, newParticipant]
        });
      }
      
      // Add timeline event
      await addTimelineEvent(transactionId, {
        type: 'PARTICIPANT_ADDED',
        title: 'Participant Added',
        description: `${participant.name} joined as ${participant.role}`,
        userId: user?.sub || user?.id || '',
        userName: user?.name || user?.given_name || 'Unknown'
      });
    } catch (error) {
      console.error('Error adding participant:', error);
      throw error;
    }
  };

  // Remove participant from transaction
  const removeParticipant = async (transactionId: string, participantId: string) => {
    try {
      await api.delete(`/transactions/${transactionId}/participants/${participantId}`);
      
      // Update local state
      if (currentTransaction?.id === transactionId) {
        setCurrentTransaction({
          ...currentTransaction,
          participants: currentTransaction.participants.filter(p => p.id !== participantId)
        });
      }
    } catch (error) {
      console.error('Error removing participant:', error);
      throw error;
    }
  };

  // Update payment status
  const updatePaymentStatus = async (transactionId: string, paymentId: string, status: string) => {
    try {
      const updated = await api.put<TransactionPayment>(
        `/transactions/${transactionId}/payments/${paymentId}`,
        { status }
      );
      
      // Update local state
      if (currentTransaction?.id === transactionId) {
        setCurrentTransaction({
          ...currentTransaction,
          payments: currentTransaction.payments.map(p => 
            p.id === paymentId ? updated : p
          )
        });
      }
      
      // Add timeline event
      await addTimelineEvent(transactionId, {
        type: 'PAYMENT_UPDATE',
        title: 'Payment Updated',
        description: `Payment status changed to ${status}`,
        userId: user?.sub || user?.id || '',
        userName: user?.name || user?.given_name || 'Unknown',
        metadata: { paymentId, status }
      });
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  };

  // Add timeline event
  const addTimelineEvent = async (
    transactionId: string, 
    event: Omit<TimelineEvent, 'id' | 'timestamp'>
  ) => {
    try {
      const newEvent = await api.post<TimelineEvent>(
        `/transactions/${transactionId}/timeline`,
        event
      );
      
      // Update local state
      if (currentTransaction?.id === transactionId) {
        setCurrentTransaction({
          ...currentTransaction,
          timeline: [...currentTransaction.timeline, newEvent]
        });
      }
    } catch (error) {
      console.error('Error adding timeline event:', error);
      throw error;
    }
  };

  // Search transactions
  const searchTransactions = async (query: string): Promise<Transaction[]> => {
    try {
      return await api.get<Transaction[]>(`/transactions/search?q=${encodeURIComponent(query)}`);
    } catch (error) {
      console.error('Error searching transactions:', error);
      return [];
    }
  };

  // Subscribe to transaction updates (WebSocket or SSE)
  const subscribeToTransaction = (transactionId: string) => {
    console.log('Subscribing to transaction:', transactionId);
    
    // Create WebSocket connection for real-time updates
    let ws: WebSocket | null = null;
    
    try {
      // Connect to real-time server (configured for production)
      const wsUrl = process.env.NODE_ENV === 'production' 
        ? `wss://${window.location.host}/realtime`
        : 'ws://localhost:3001/realtime';
      
      ws = new WebSocket(`${wsUrl}?userId=${user?.id || 'anonymous'}&userRole=${user?.role || 'BUYER'}`);
      
      ws.onopen = () => {
        console.log('📡 Connected to transaction real-time updates');
        // Subscribe to specific transaction updates
        ws?.send(JSON.stringify({
          type: 'subscribe',
          events: ['transaction_update', 'transaction_status_change'],
          filters: { transactionId }
        }));
      };
      
      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          
          if (message.type === 'transaction_update' && message.data?.transactionId === transactionId) {
            // Update the specific transaction in state
            setTransactions(prev => prev.map(tx => 
              tx.id === transactionId 
                ? { ...tx, ...message.data.updatedData }
                : tx
            ));
            
            console.log(`📡 Transaction ${transactionId} updated:`, message.data.updatedData);
          }
        } catch (error) {
          console.error('Error parsing transaction update:', error);
        }
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error for transaction:', error);
      };
      
      ws.onclose = () => {
        console.log('🔌 Disconnected from transaction updates');
      };
      
    } catch (error) {
      console.error('Failed to connect to transaction real-time updates:', error);
    }
    
    // Return unsubscribe function
    return () => {
      console.log('Unsubscribing from transaction:', transactionId);
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'unsubscribe',
          events: ['transaction_update', 'transaction_status_change'],
          filters: { transactionId }
        }));
        ws.close();
      }
    };
  };

  // Subscribe to user's transactions updates
  const subscribeToUserTransactions = () => {
    console.log('Subscribing to user transactions');
    
    // Create WebSocket connection for user transaction updates
    let ws: WebSocket | null = null;
    
    if (!user?.id) {
      console.warn('Cannot subscribe to user transactions: no user ID');
      return () => {};
    }
    
    try {
      // Connect to real-time server
      const wsUrl = process.env.NODE_ENV === 'production' 
        ? `wss://${window.location.host}/realtime`
        : 'ws://localhost:3001/realtime';
      
      ws = new WebSocket(`${wsUrl}?userId=${user.id}&userRole=${user.role || 'BUYER'}`);
      
      ws.onopen = () => {
        console.log('📡 Connected to user transaction real-time updates');
        // Subscribe to user-specific transaction events
        ws?.send(JSON.stringify({
          type: 'subscribe',
          events: [
            'transaction_created', 
            'transaction_update', 
            'transaction_status_change',
            'payment_update',
            'document_update'
          ],
          filters: { userId: user.id }
        }));
      };
      
      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          
          if (message.data?.userId === user.id || message.data?.affectedUsers?.includes(user.id)) {
            switch (message.type) {
              case 'transaction_created':
                // Add new transaction to the list
                if (message.data.transaction) {
                  setTransactions(prev => [message.data.transaction, ...prev]);
                  console.log('📡 New transaction created:', message.data.transaction.id);
                }
                break;
                
              case 'transaction_update':
              case 'transaction_status_change':
                // Update existing transaction
                if (message.data.transactionId) {
                  setTransactions(prev => prev.map(tx => 
                    tx.id === message.data.transactionId 
                      ? { ...tx, ...message.data.updatedData }
                      : tx
                  ));
                  console.log(`📡 Transaction ${message.data.transactionId} updated`);
                }
                break;
                
              case 'payment_update':
              case 'document_update':
                // Refresh transaction data for payment/document updates
                if (message.data.transactionId) {
                  console.log(`📡 ${message.type} for transaction ${message.data.transactionId}`);
                  // Could trigger a refresh of the specific transaction
                }
                break;
            }
          }
        } catch (error) {
          console.error('Error parsing user transaction update:', error);
        }
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error for user transactions:', error);
      };
      
      ws.onclose = () => {
        console.log('🔌 Disconnected from user transaction updates');
      };
      
    } catch (error) {
      console.error('Failed to connect to user transaction real-time updates:', error);
    }
    
    // Return unsubscribe function
    return () => {
      console.log('Unsubscribing from user transactions');
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'unsubscribe',
          events: [
            'transaction_created', 
            'transaction_update', 
            'transaction_status_change',
            'payment_update',
            'document_update'
          ],
          filters: { userId: user.id }
        }));
        ws.close();
      }
    };
  };

  // Load user transactions on mount
  useEffect(() => {
    if (user) {
      fetchUserTransactions();
    }
  }, [user]);

  // Get count of transactions with specific status
  const getTransactionCount = (status: string): number => {
    if (status === 'DOCUMENTS_PENDING') {
      return transactions.filter(t => 
        t.documents.some(doc => doc.status === 'PENDING')
      ).length;
    }
    
    return transactions.filter(t => t.status === status as TransactionStatus).length;
  };

  const value: TransactionContextType = {
    currentTransaction,
    setCurrentTransaction,
    transactions,
    loadingTransactions,
    updateTransactionStatus,
    addDocument,
    sendMessage,
    addParticipant,
    removeParticipant,
    updatePaymentStatus,
    addTimelineEvent,
    fetchTransaction,
    fetchUserTransactions,
    searchTransactions,
    subscribeToTransaction,
    subscribeToUserTransactions,
    getTransactionCount
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};

export default TransactionContext;