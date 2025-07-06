'use client';

import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Download, 
  Filter, 
  Search, 
  MoreVertical, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  XCircle,
  Euro,
  Calendar,
  TrendingUp,
  Building2,
  Heart,
  RefreshCw,
  ExternalLink,
  Eye
} from 'lucide-react';

interface Transaction {
  id: string;
  propertyId: string;
  propertyTitle: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  paymentType: 'reservation' | 'deposit' | 'completion' | 'htb_benefit';
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  receiptUrl?: string;
  metadata?: Record<string, any>;
}

interface PaymentTotals {
  total: number;
  pending: number;
  processing: number;
  failed: number;
}

interface PaymentDashboardProps {
  className?: string;
}

export function PaymentDashboard({ className = '' }: PaymentDashboardProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totals, setTotals] = useState<PaymentTotals>({ total: 0, pending: 0, processing: 0, failed: 0 });
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentTypeFilter, setPaymentTypeFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, [statusFilter, paymentTypeFilter]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (paymentTypeFilter !== 'all') params.set('paymentType', paymentTypeFilter);
      params.set('limit', '20');

      const response = await fetch(`/api/payments/transactions?${params.toString()}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }

      const data = await response.json();
      setTransactions(data.transactions || []);
      setTotals(data.totals || { total: 0, pending: 0, processing: 0, failed: 0 });
    } catch (err: any) {
      setError(err.message || 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTransactions();
    setRefreshing(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'processing':
        return <Clock size={16} className="text-blue-600" />;
      case 'pending':
        return <Clock size={16} className="text-amber-600" />;
      case 'failed':
        return <XCircle size={16} className="text-red-600" />;
      case 'cancelled':
        return <XCircle size={16} className="text-gray-600" />;
      default:
        return <AlertCircle size={16} className="text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentTypeIcon = (type: string) => {
    switch (type) {
      case 'reservation':
        return <Building2 size={16} className="text-blue-600" />;
      case 'deposit':
        return <Euro size={16} className="text-green-600" />;
      case 'completion':
        return <CheckCircle size={16} className="text-purple-600" />;
      case 'htb_benefit':
        return <Heart size={16} className="text-red-600" />;
      default:
        return <CreditCard size={16} className="text-gray-600" />;
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = searchTerm === '' || 
      transaction.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  return (
    <div className={`bg-white rounded-lg border shadow-sm ${className}`}>
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <CreditCard size={24} className="text-blue-600" />
              Payment Dashboard
            </h2>
            <p className="text-gray-600 mt-1">Track your property transaction payments</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            </button>
            
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Download size={16} className="inline mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Total Paid</p>
                <p className="text-2xl font-bold text-green-700">{formatCurrency(totals.total)}</p>
              </div>
              <CheckCircle size={24} className="text-green-600" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-lg border border-amber-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-600 font-medium">Pending</p>
                <p className="text-2xl font-bold text-amber-700">{formatCurrency(totals.pending)}</p>
              </div>
              <Clock size={24} className="text-amber-600" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Processing</p>
                <p className="text-2xl font-bold text-blue-700">{formatCurrency(totals.processing)}</p>
              </div>
              <TrendingUp size={24} className="text-blue-600" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-lg border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">Failed</p>
                <p className="text-2xl font-bold text-red-700">{totals.failed}</p>
              </div>
              <XCircle size={24} className="text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-6 border-b bg-gray-50">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="processing">Processing</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
            
            <select
              value={paymentTypeFilter}
              onChange={(e) => setPaymentTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="reservation">Reservation</option>
              <option value="deposit">Deposit</option>
              <option value="completion">Completion</option>
              <option value="htb_benefit">HTB Benefit</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-6">
          <div className="bg-red-100 border border-red-200 text-red-700 rounded-lg p-4 flex items-center gap-2">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="p-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading transactions...</p>
        </div>
      )}

      {/* Transactions List */}
      {!loading && !error && (
        <div className="p-6">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== 'all' || paymentTypeFilter !== 'all'
                  ? 'No transactions match your current filters.'
                  : 'You haven\'t made any payments yet.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        {getPaymentTypeIcon(transaction.paymentType)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">{transaction.propertyTitle}</h4>
                          <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(transaction.status)}`}>
                            {getStatusIcon(transaction.status)}
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">{transaction.description}</p>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {formatDate(transaction.createdAt)}
                          </span>
                          <span>Payment Method: {transaction.paymentMethod}</span>
                          <span className="capitalize">
                            {transaction.paymentType.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          {formatCurrency(transaction.amount)}
                        </div>
                        <div className="text-xs text-gray-500">{transaction.currency}</div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {transaction.receiptUrl && (
                          <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                            <Download size={16} />
                          </button>
                        )}
                        
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                          <Eye size={16} />
                        </button>
                        
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Metadata for special payment types */}
                  {transaction.paymentType === 'htb_benefit' && transaction.metadata?.htbReference && (
                    <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex items-center gap-2">
                        <Heart size={16} className="text-red-600" />
                        <span className="text-sm font-medium text-red-800">HTB Reference: {transaction.metadata.htbReference}</span>
                      </div>
                    </div>
                  )}
                  
                  {transaction.status === 'failed' && transaction.metadata?.failureReason && (
                    <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex items-center gap-2">
                        <AlertCircle size={16} className="text-red-600" />
                        <span className="text-sm text-red-800">
                          Failure reason: {transaction.metadata.failureReason.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}