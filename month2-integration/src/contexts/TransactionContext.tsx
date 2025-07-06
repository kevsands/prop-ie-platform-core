'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export interface Transaction {
  id: string;
  buyerId?: string;
  developerId?: string;
  agentId?: string;
  solicitorId?: string;
  propertyId: string;
  propertyName: string;
  status: 'INITIATED' | 'DOCUMENTS_PENDING' | 'CONTRACTED' | 'CLOSING' | 'COMPLETED';
  price: number;
  createdAt: Date;
  updatedAt: Date;
  pendingDocs?: number;
  stage: string;
  participants: {
    buyer?: { id: string; name: string; email: string };
    developer?: { id: string; name: string; email: string };
    agent?: { id: string; name: string; email: string };
    solicitor?: { id: string; name: string; email: string };
  };
  milestones: {
    id: string;
    title: string;
    status: 'pending' | 'in_progress' | 'completed';
    completedAt?: Date;
  }[];
  documents: {
    id: string;
    name: string;
    type: string;
    status: 'pending' | 'uploaded' | 'approved' | 'rejected';
    uploadedAt?: Date;
    uploadedBy?: string;
  }[];
}

interface TransactionContextValue {
  transactions: Transaction[];
  activeTransaction: Transaction | null;
  setActiveTransaction: (transaction: Transaction | null) => void;
  getTransactionById: (id: string) => Transaction | undefined;
  getTransactionsByRole: (role: string, userId: string) => Transaction[];
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  createTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => Transaction;
  deleteTransaction: (id: string) => void;
  getTransactionCount: (status?: string) => number;
  refreshTransactions: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const TransactionContext = createContext<TransactionContextValue | undefined>(undefined);

export const useTransaction = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransaction must be used within a TransactionProvider');
  }
  return context;
};

// Mock transaction data
const mockTransactions: Transaction[] = [
  {
    id: '1',
    buyerId: 'buyer-1',
    developerId: 'dev-1',
    propertyId: 'prop-1',
    propertyName: 'Unit 42B - Fitzgerald Gardens',
    status: 'DOCUMENTS_PENDING',
    price: 450000,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    pendingDocs: 3,
    stage: 'Document Collection',
    participants: {
      buyer: { id: 'buyer-1', name: 'John Smith', email: 'john@example.com' },
      developer: { id: 'dev-1', name: 'Fitzgerald Developments', email: 'info@fitzgerald.com' },
      agent: { id: 'agent-1', name: 'Sarah Agent', email: 'sarah@agents.com' },
      solicitor: { id: 'sol-1', name: 'Legal & Co', email: 'legal@solicitors.com' }
    },
    milestones: [
      { id: 'm1', title: 'Property Reserved', status: 'completed', completedAt: new Date('2024-01-15') },
      { id: 'm2', title: 'Document Collection', status: 'in_progress' },
      { id: 'm3', title: 'Contracts Issued', status: 'pending' },
      { id: 'm4', title: 'Contracts Signed', status: 'pending' },
      { id: 'm5', title: 'Completion', status: 'pending' }
    ],
    documents: [
      { id: 'd1', name: 'Booking Form', type: 'booking', status: 'approved', uploadedAt: new Date('2024-01-15') },
      { id: 'd2', name: 'Proof of Identity', type: 'identity', status: 'pending' },
      { id: 'd3', name: 'Proof of Funds', type: 'financial', status: 'pending' },
      { id: 'd4', name: 'Mortgage Approval', type: 'financial', status: 'pending' }
    ]
  },
  {
    id: '2',
    buyerId: 'buyer-2',
    developerId: 'dev-1',
    propertyId: 'prop-2',
    propertyName: 'Unit 18A - Riverside Manor',
    status: 'CONTRACTED',
    price: 380000,
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2024-01-10'),
    stage: 'Legal Process',
    participants: {
      buyer: { id: 'buyer-2', name: 'Jane Doe', email: 'jane@example.com' },
      developer: { id: 'dev-1', name: 'Fitzgerald Developments', email: 'info@fitzgerald.com' },
      solicitor: { id: 'sol-2', name: 'Smith Solicitors', email: 'info@smithsol.com' }
    },
    milestones: [
      { id: 'm1', title: 'Property Reserved', status: 'completed', completedAt: new Date('2023-12-01') },
      { id: 'm2', title: 'Document Collection', status: 'completed', completedAt: new Date('2023-12-15') },
      { id: 'm3', title: 'Contracts Issued', status: 'completed', completedAt: new Date('2024-01-05') },
      { id: 'm4', title: 'Contracts Signed', status: 'in_progress' },
      { id: 'm5', title: 'Completion', status: 'pending' }
    ],
    documents: [
      { id: 'd1', name: 'Booking Form', type: 'booking', status: 'approved', uploadedAt: new Date('2023-12-01') },
      { id: 'd2', name: 'Proof of Identity', type: 'identity', status: 'approved', uploadedAt: new Date('2023-12-10') },
      { id: 'd3', name: 'Proof of Funds', type: 'financial', status: 'approved', uploadedAt: new Date('2023-12-12') },
      { id: 'd4', name: 'Contract Pack', type: 'legal', status: 'uploaded', uploadedAt: new Date('2024-01-05') }
    ]
  }
];

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [activeTransaction, setActiveTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize transactions based on user role
  useEffect(() => {
    if (user) {
      refreshTransactions();
    }
  }, [user]);

  const refreshTransactions = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, this would fetch from an API
      // For now, we'll use mock data filtered by user role
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      
      // Filter transactions based on user role and ID
      const filteredTransactions = mockTransactions.filter(transaction => {
        switch (user?.role) {
          case 'BUYER':
            return transaction.buyerId === user.id;
          case 'DEVELOPER':
            return transaction.developerId === user.id;
          case 'AGENT':
            return transaction.agentId === user.id;
          case 'SOLICITOR':
            return transaction.solicitorId === user.id;
          default:
            return false;
        }
      });
      
      setTransactions(filteredTransactions);
      
      // Set active transaction if there's one in progress
      const inProgressTransaction = filteredTransactions.find(
        t => t.status !== 'COMPLETED'
      );
      if (inProgressTransaction) {
        setActiveTransaction(inProgressTransaction);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
    } finally {
      setIsLoading(false);
    }
  };

  const getTransactionById = (id: string) => {
    return transactions.find(t => t.id === id);
  };

  const getTransactionsByRole = (role: string, userId: string) => {
    return transactions.filter(transaction => {
      switch (role) {
        case 'BUYER':
          return transaction.buyerId === userId;
        case 'DEVELOPER':
          return transaction.developerId === userId;
        case 'AGENT':
          return transaction.agentId === userId;
        case 'SOLICITOR':
          return transaction.solicitorId === userId;
        default:
          return false;
      }
    });
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(prev => 
      prev.map(t => 
        t.id === id 
          ? { ...t, ...updates, updatedAt: new Date() }
          : t
      )
    );
    
    // Update active transaction if it's the one being updated
    if (activeTransaction?.id === id) {
      setActiveTransaction(prev => 
        prev ? { ...prev, ...updates, updatedAt: new Date() } : null
      );
    }
  };

  const createTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: `t-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setTransactions(prev => [...prev, newTransaction]);
    return newTransaction;
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    
    // Clear active transaction if it's the one being deleted
    if (activeTransaction?.id === id) {
      setActiveTransaction(null);
    }
  };

  const getTransactionCount = (status?: string) => {
    if (!status) {
      return transactions.length;
    }
    return transactions.filter(t => t.status === status).length;
  };

  const value: TransactionContextValue = {
    transactions,
    activeTransaction,
    setActiveTransaction,
    getTransactionById,
    getTransactionsByRole,
    updateTransaction,
    createTransaction,
    deleteTransaction,
    getTransactionCount,
    refreshTransactions,
    isLoading,
    error
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};