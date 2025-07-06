'use client';

import { useState, useEffect } from 'react';

export interface Invoice {
  id: string;
  number: string;
  type: 'RECEIVABLE' | 'PAYABLE';
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED' | 'PARTIALLY_PAID' | 'REFUNDED';
  clientName: string;
  clientEmail?: string;
  clientAddress?: string;
  projectId?: string;
  developmentId?: string;
  project?: { id: string; name: string };
  development?: { id: string; name: string };
  subtotal: number;
  taxRate?: number;
  taxAmount?: number;
  totalAmount: number;
  currency: string;
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  description: string;
  notes?: string;
  termsConditions?: string;
  paymentMethod?: string;
  paymentReference?: string;
  createdBy: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
  lineItems?: InvoiceLineItem[];
  payments?: InvoicePayment[];
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  category?: string;
  taxRate?: number;
}

export interface InvoicePayment {
  id: string;
  amount: number;
  currency: string;
  paymentDate: string;
  paymentMethod: string;
  reference?: string;
  notes?: string;
  status: string;
  recordedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceFilters {
  status?: string;
  type?: string;
  projectId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface InvoiceSummary {
  overview: {
    totalInvoices: number;
    totalReceivables: number;
    totalPayables: number;
    totalPaid: number;
    totalOverdue: number;
    draftCount: number;
  };
  breakdown: {
    receivables: { count: number; amount: number };
    payables: { count: number; amount: number };
    paid: { count: number; amount: number };
    overdue: { count: number; amount: number };
  };
  recentInvoices: Invoice[];
  monthlyTrends: Record<string, { amount: number; count: number }>;
}

export function useInvoices(filters: InvoiceFilters = {}) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/invoices/mock?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch invoices');
      }

      const data = await response.json();
      setInvoices(data.invoices);
      setPagination(data.pagination);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createInvoice = async (invoiceData: Partial<Invoice>) => {
    try {
      const response = await fetch('/api/invoices/mock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceData),
      });

      if (!response.ok) {
        throw new Error('Failed to create invoice');
      }

      const newInvoice = await response.json();
      setInvoices(prev => [newInvoice, ...prev]);
      return newInvoice;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create invoice');
    }
  };

  const getInvoice = async (id: string): Promise<Invoice> => {
    try {
      const response = await fetch(`/api/invoices/${id}/mock`);
      if (!response.ok) {
        throw new Error('Failed to fetch invoice');
      }
      return await response.json();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to fetch invoice');
    }
  };

  const updateInvoice = async (id: string, invoiceData: Partial<Invoice>) => {
    try {
      const response = await fetch(`/api/invoices/${id}/mock`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceData),
      });

      if (!response.ok) {
        throw new Error('Failed to update invoice');
      }

      const updatedInvoice = await response.json();
      setInvoices(prev => prev.map(inv => inv.id === id ? updatedInvoice : inv));
      return updatedInvoice;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update invoice');
    }
  };

  const deleteInvoice = async (id: string) => {
    try {
      const response = await fetch(`/api/invoices/${id}/mock`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete invoice');
      }

      setInvoices(prev => prev.filter(inv => inv.id !== id));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete invoice');
    }
  };

  const recordPayment = async (invoiceId: string, paymentData: Partial<InvoicePayment>) => {
    try {
      const response = await fetch(`/api/invoices/${invoiceId}/payments/mock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error('Failed to record payment');
      }

      const payment = await response.json();
      // Refresh the invoices to get updated status
      await fetchInvoices();
      return payment;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to record payment');
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [JSON.stringify(filters)]);

  return {
    invoices,
    loading,
    error,
    pagination,
    getInvoice,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    recordPayment,
    refetch: fetchInvoices
  };
}

export function useInvoiceSummary(developerId?: string, projectId?: string) {
  const [summary, setSummary] = useState<InvoiceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (developerId) params.append('developerId', developerId);
      if (projectId) params.append('projectId', projectId);

      const response = await fetch(`/api/invoices/summary/mock?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch invoice summary');
      }

      const data = await response.json();
      setSummary(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [developerId, projectId]);

  return {
    summary,
    loading,
    error,
    refetch: fetchSummary
  };
}