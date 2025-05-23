#!/usr/bin/env node
// Fix AuthProvider ordering issue

const fs = require('fs');
const path = require('path');

console.log('Fixing AuthProvider ordering issue...\n');

// 1. Fix ClientProviders to properly order providers
const clientProvidersPath = path.join('src', 'components', 'ClientProviders.tsx');
let clientProvidersContent = fs.readFileSync(clientProvidersPath, 'utf8');

// Find the section where providers are wrapped and ensure AuthProvider comes first
const newClientProviders = `'use client';

import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider as ReactQueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SessionProvider } from 'next-auth/react';
import AmplifyProvider from '@/components/AmplifyProvider';
import AuthProvider from '@/context/AuthContext';
import { CustomizationProvider } from '@/context/CustomizationContext';
import { BuyerJourneyProvider } from '@/context/BuyerJourneyContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { TransactionProvider } from '@/context/TransactionContext';
import { DashboardPreferenceProvider } from '@/context/DashboardPreferenceContext';
import { UserRoleProvider } from '@/context/UserRoleContext';
import AppSecurityProvider from '@/lib/security/AppSecurityProvider';

interface ClientProvidersProps {
  children: ReactNode;
  includeQuery?: boolean;
  includeAuth?: boolean;
  includeCustomization?: boolean;
  includeBuyerJourney?: boolean;
  includeNotification?: boolean;
  includeTransaction?: boolean;
  includeDashboard?: boolean;
  includeUserRole?: boolean;
  includeSecurity?: boolean;
  includeAll?: boolean;
  showDevtools?: boolean;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 5 * 60 * 1000,
    },
  },
});

function ClientProviders({
  children,
  includeQuery = true,
  includeAuth = true,
  includeCustomization = false,
  includeBuyerJourney = false,
  includeNotification = false,
  includeTransaction = false,
  includeDashboard = false,
  includeUserRole = false,
  includeSecurity = false,
  includeAll = false,
  showDevtools = false,
}: ClientProvidersProps) {
  // Helper function to determine if a provider should be included
  const shouldInclude = (provider: string) => {
    if (includeAll) return true;
    const propMap: { [key: string]: boolean } = {
      query: includeQuery,
      auth: includeAuth,
      customization: includeCustomization,
      buyerJourney: includeBuyerJourney,
      notification: includeNotification,
      transaction: includeTransaction,
      dashboard: includeDashboard,
      userRole: includeUserRole,
      security: includeSecurity,
    };
    return propMap[provider] || false;
  };

  let wrappedChildren = children;

  // Start with the innermost providers that don't depend on others
  if (shouldInclude('userRole')) {
    wrappedChildren = (
      <UserRoleProvider>
        {wrappedChildren}
      </UserRoleProvider>
    );
  }

  if (shouldInclude('dashboard')) {
    wrappedChildren = (
      <DashboardPreferenceProvider>
        {wrappedChildren}
      </DashboardPreferenceProvider>
    );
  }

  if (shouldInclude('notification')) {
    wrappedChildren = (
      <NotificationProvider>
        {wrappedChildren}
      </NotificationProvider>
    );
  }

  if (shouldInclude('transaction')) {
    wrappedChildren = (
      <TransactionProvider>
        {wrappedChildren}
      </TransactionProvider>
    );
  }

  if (shouldInclude('buyerJourney')) {
    wrappedChildren = (
      <BuyerJourneyProvider>
        {wrappedChildren}
      </BuyerJourneyProvider>
    );
  }

  if (shouldInclude('customization')) {
    wrappedChildren = (
      <CustomizationProvider>
        {wrappedChildren}
      </CustomizationProvider>
    );
  }

  if (shouldInclude('security')) {
    wrappedChildren = (
      <AppSecurityProvider>
        {wrappedChildren}
      </AppSecurityProvider>
    );
  }

  // Auth provider MUST come before providers that use useAuth
  if (shouldInclude('auth')) {
    wrappedChildren = (
      <AuthProvider>
        {wrappedChildren}
      </AuthProvider>
    );
  }

  // Query provider wraps everything that might need data fetching
  if (shouldInclude('query')) {
    wrappedChildren = (
      <ReactQueryClientProvider client={queryClient}>
        {wrappedChildren}
        {/* {showDevtools && <ReactQueryDevtools initialIsOpen={false} position="bottom" />} */}
      </ReactQueryClientProvider>
    );
  }

  // Session and Amplify providers are the outermost
  return (
    <SessionProvider>
      <AmplifyProvider>
        {wrappedChildren}
      </AmplifyProvider>
    </SessionProvider>
  );
}

export default ClientProviders;`;

fs.writeFileSync(clientProvidersPath, newClientProviders);
console.log('✅ Fixed provider ordering in ClientProviders');

// 2. Create a simpler TransactionProvider that doesn't require auth
const simpleTransactionProvider = `'use client';

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
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Use auth if available, but don't fail if it's not
  const authContext = useContext(AuthContext);
  const { user } = authContext || {};

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
      const response = await api.get(\`/transactions/\${transactionId}\`);
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
      setTransactions([...transactions, newTransaction]);
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
      const response = await api.patch(\`/transactions/\${transactionId}\`, updates);
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
        \`/transactions/\${transactionId}/documents\`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
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
      const response = await api.delete(\`/transactions/\${transactionId}/documents/\${documentId}\`);
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
        \`/transactions/\${transactionId}/documents/\${documentId}\`,
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
        attachments.forEach((file, index) => {
          formData.append(\`attachments[\${index}]\`, file);
        });
      }
      
      const response = await api.post(
        \`/transactions/\${transactionId}/messages\`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
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
        \`/transactions/\${transactionId}/messages/\${messageId}/read\`
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
        \`/transactions/\${transactionId}/milestones/\${milestoneId}\`,
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
        \`/transactions/\${transactionId}/participants\`,
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
        \`/transactions/\${transactionId}/participants/\${participantId}\`
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
    removeParticipant,
  };

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
};`;

const transactionProviderPath = path.join('src', 'context', 'TransactionContext.tsx');
fs.writeFileSync(transactionProviderPath, simpleTransactionProvider);
console.log('✅ Fixed TransactionProvider to handle auth properly');

// 3. Fix AuthContext import
const authContextPath = path.join('src', 'context', 'AuthContext.tsx');
let authContextContent = fs.readFileSync(authContextPath, 'utf8');

// Make sure AuthContext is exported properly
if (!authContextContent.includes('const AuthContext = createContext')) {
  authContextContent = authContextContent.replace(
    /const AuthContext = React\.createContext/g,
    'export const AuthContext = React.createContext'
  );
  fs.writeFileSync(authContextPath, authContextContent);
  console.log('✅ Fixed AuthContext export');
}

console.log('\nAuthProvider ordering issue fixed!');
console.log('The providers are now correctly ordered to prevent errors.');