'use client';

import React, { useState } from 'react';
import { SessionProtectedRoute } from '@/components/auth/SessionProtectedRoute';
import { PaymentDashboard } from '@/components/payments/PaymentDashboard';
import { 
  CreditCard, 
  Calendar, 
  Download, 
  Filter, 
  Search, 
  Euro, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Eye, 
  Receipt, 
  Building2, 
  Home, 
  Heart, 
  Shield, 
  Banknote,
  TrendingUp,
  Plus,
  RefreshCw,
  ExternalLink,
  FileText,
  Settings
} from 'lucide-react';
import Link from 'next/link';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';

interface Payment {
  id: string;
  type: 'deposit' | 'reservation' | 'mortgage' | 'htb' | 'legal' | 'insurance' | 'refund';
  description: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed' | 'cancelled';
  date: Date;
  method: 'card' | 'bank_transfer' | 'direct_debit';
  reference: string;
  property?: {
    id: string;
    name: string;
    address: string;
  };
  category: 'property' | 'service' | 'government';
  invoice?: string;
  receipt?: string;
  notes?: string;
}

interface PaymentSummary {
  totalPaid: number;
  totalPending: number;
  thisMonth: number;
  lastMonth: number;
  outstandingBalance: number;
  nextPaymentDue?: {
    amount: number;
    dueDate: Date;
    description: string;
  };
}

function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  // Mock payment data
  const payments: Payment[] = [
    {
      id: 'PAY-001',
      type: 'reservation',
      description: 'Property Reservation - Fitzgerald Gardens Unit 23',
      amount: 5000,
      status: 'completed',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      method: 'card',
      reference: 'FG-23-RES-001',
      property: {
        id: '1',
        name: 'Fitzgerald Gardens Unit 23',
        address: 'Cork, Ireland'
      },
      category: 'property',
      invoice: 'INV-001.pdf',
      receipt: 'REC-001.pdf'
    },
    {
      id: 'PAY-002',
      type: 'deposit',
      description: 'Booking Deposit - Fitzgerald Gardens Unit 23',
      amount: 500,
      status: 'completed',
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      method: 'card',
      reference: 'FG-23-DEP-001',
      property: {
        id: '1',
        name: 'Fitzgerald Gardens Unit 23',
        address: 'Cork, Ireland'
      },
      category: 'property',
      invoice: 'INV-002.pdf',
      receipt: 'REC-002.pdf'
    },
    {
      id: 'PAY-003',
      type: 'legal',
      description: 'Solicitor Fees - Property Purchase',
      amount: 1200,
      status: 'pending',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      method: 'bank_transfer',
      reference: 'SOL-001',
      category: 'service',
      notes: 'Payment due upon contract signing'
    },
    {
      id: 'PAY-004',
      type: 'htb',
      description: 'Help-to-Buy Application Fee',
      amount: 250,
      status: 'completed',
      date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
      method: 'card',
      reference: 'HTB-APP-001',
      category: 'government',
      invoice: 'HTB-INV-001.pdf',
      receipt: 'HTB-REC-001.pdf'
    },
    {
      id: 'PAY-005',
      type: 'mortgage',
      description: 'Mortgage Application Fee - Bank of Ireland',
      amount: 300,
      status: 'completed',
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      method: 'direct_debit',
      reference: 'BOI-MORT-001',
      category: 'service',
      invoice: 'BOI-INV-001.pdf'
    },
    {
      id: 'PAY-006',
      type: 'insurance',
      description: 'Property Survey and Valuation',
      amount: 450,
      status: 'completed',
      date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
      method: 'card',
      reference: 'SURV-001',
      category: 'service',
      receipt: 'SURV-REC-001.pdf'
    }
  ];

  // Calculate summary
  const summary: PaymentSummary = {
    totalPaid: payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0),
    totalPending: payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
    thisMonth: payments.filter(p => 
      p.status === 'completed' && 
      p.date >= startOfMonth(new Date()) && 
      p.date <= endOfMonth(new Date())
    ).reduce((sum, p) => sum + p.amount, 0),
    lastMonth: payments.filter(p => 
      p.status === 'completed' && 
      p.date >= startOfMonth(subDays(new Date(), 30)) && 
      p.date <= endOfMonth(subDays(new Date(), 30))
    ).reduce((sum, p) => sum + p.amount, 0),
    outstandingBalance: 325000, // Remaining mortgage amount
    nextPaymentDue: {
      amount: 1200,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      description: 'Solicitor Fees'
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'pending':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'failed':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'cancelled':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'pending':
        return <Clock size={16} className="text-amber-600" />;
      case 'failed':
        return <AlertCircle size={16} className="text-red-600" />;
      case 'cancelled':
        return <AlertCircle size={16} className="text-gray-600" />;
      default:
        return <Clock size={16} className="text-gray-600" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit':
      case 'reservation':
        return <Home size={16} className="text-blue-600" />;
      case 'mortgage':
        return <Building2 size={16} className="text-green-600" />;
      case 'htb':
        return <Heart size={16} className="text-red-600" />;
      case 'legal':
        return <Shield size={16} className="text-purple-600" />;
      case 'insurance':
        return <FileText size={16} className="text-amber-600" />;
      case 'refund':
        return <ArrowDownLeft size={16} className="text-gray-600" />;
      default:
        return <Euro size={16} className="text-gray-600" />;
    }
  };

  const getMethodDisplay = (method: string) => {
    switch (method) {
      case 'card':
        return 'Credit/Debit Card';
      case 'bank_transfer':
        return 'Bank Transfer';
      case 'direct_debit':
        return 'Direct Debit';
      default:
        return method;
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         payment.reference.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
    const matchesType = filterType === 'all' || payment.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payments & Transactions</h1>
          <p className="text-gray-600 mt-1">
            Track your property purchase payments and financial transactions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href="/buyer/payment-methods"
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            <CreditCard size={16} className="inline mr-2" />
            Payment Methods
          </Link>
          <Link 
            href="/buyer/transaction"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <TrendingUp size={16} className="inline mr-2" />
            Transaction Status
          </Link>
        </div>
      </div>

      {/* Payment Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Paid</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.totalPaid)}</p>
              <p className="text-sm text-green-600">All completed payments</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
              <CheckCircle size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Payments</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.totalPending)}</p>
              <p className="text-sm text-amber-600">Awaiting processing</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg flex items-center justify-center">
              <Clock size={24} className="text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.thisMonth)}</p>
              <p className="text-sm text-blue-600">Recent activity</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
              <Calendar size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Outstanding Balance</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.outstandingBalance)}</p>
              <p className="text-sm text-purple-600">Remaining mortgage</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-violet-100 rounded-lg flex items-center justify-center">
              <Banknote size={24} className="text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Next Payment Due Alert */}
      {summary.nextPaymentDue && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Next Payment Due</h3>
              <p className="text-xl font-bold">{formatCurrency(summary.nextPaymentDue.amount)}</p>
              <p className="text-amber-100">{summary.nextPaymentDue.description}</p>
              <p className="text-amber-100 text-sm">Due: {format(summary.nextPaymentDue.dueDate, 'PPP')}</p>
            </div>
            <div className="flex gap-3">
              <Link 
                href="/buyer/payment-methods"
                className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors text-sm"
              >
                Pay Now
              </Link>
              <Link 
                href="/buyer/calendar"
                className="px-4 py-2 bg-white text-amber-600 rounded-lg hover:bg-gray-100 transition-colors text-sm"
              >
                Schedule Payment
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search payments by description or reference..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="deposit">Deposits</option>
              <option value="reservation">Reservations</option>
              <option value="mortgage">Mortgage</option>
              <option value="legal">Legal</option>
              <option value="htb">Help-to-Buy</option>
            </select>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Download size={16} className="inline mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Payments List */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Payment History ({filteredPayments.length} transactions)
          </h3>
        </div>
        
        <div className="divide-y">
          {filteredPayments.map((payment) => (
            <div key={payment.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="rounded-lg p-2 bg-gray-100">
                    {getTypeIcon(payment.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{payment.description}</h4>
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(payment.status)}`}>
                        {getStatusIcon(payment.status)}
                        <span className="ml-1 capitalize">{payment.status}</span>
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">
                      Reference: {payment.reference} • {getMethodDisplay(payment.method)}
                    </p>
                    
                    {payment.property && (
                      <p className="text-sm text-blue-600 mb-2">
                        {payment.property.name} - {payment.property.address}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{format(payment.date, 'PPP')}</span>
                      {payment.invoice && (
                        <Link href="#" className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
                          <FileText size={14} />
                          Invoice
                        </Link>
                      )}
                      {payment.receipt && (
                        <Link href="#" className="text-green-600 hover:text-green-700 flex items-center gap-1">
                          <Receipt size={14} />
                          Receipt
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-xl font-bold text-gray-900">{formatCurrency(payment.amount)}</p>
                  <p className="text-sm text-gray-500 capitalize">{payment.category}</p>
                </div>
              </div>
              
              {payment.notes && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">{payment.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* New Payment Dashboard Integration */}
      <div className="mt-8">
        <PaymentDashboard />
      </div>
    </div>
  );
}

export default function BuyerPaymentsPage() {
  return (
    <SessionProtectedRoute requiredRoles={['buyer', 'first_time_buyer']}>
      <PaymentsPage />
    </SessionProtectedRoute>
  );
}