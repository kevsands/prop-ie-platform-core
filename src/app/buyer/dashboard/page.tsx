'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import {
  Home,
  TrendingUp,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Euro,
  Heart,
  Shield,
  ArrowRight,
  Calendar,
  CreditCard,
  Download,
  Eye,
  MessageSquare,
  Receipt,
  Loader2,
  Upload,
  ChevronRight,
  AlertTriangle,
  Info
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface TransactionOverview {
  id: string;
  referenceNumber: string;
  property: {
    title: string;
    price: number;
    location: string;
    developmentId: string;
    unitId: string;
  };
  status: string;
  stage: string;
  progress: number;
  nextAction: string;
  nextActionDue: string;
  paymentSummary: {
    totalPrice: number;
    depositPaid: number;
    totalPaid: number;
    outstandingBalance: number;
    nextPaymentAmount: number;
    nextPaymentDue: string;
  };
  timeline: {
    reservationDate?: string;
    contractDate?: string;
    mortgageApprovalDate?: string;
    completionDate?: string;
  };
}

interface Document {
  id: string;
  name: string;
  type: string;
  status: 'pending' | 'uploaded' | 'verified' | 'rejected';
  uploadDate?: string;
  requiredBy?: string;
}

export default function BuyerDashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedTransactionsetSelectedTransaction] = useState<string | null>(null);

  // Fetch active transactions
  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ['buyer-transactions', user?.id],
    queryFn: async () => {
      const response = await fetch('/api/transactions?status=active', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch transactions');
      return response.json();
    },
    enabled: !!user
  });

  // Fetch required documents
  const { data: documents, isLoading: documentsLoading } = useQuery({
    queryKey: ['buyer-documents', selectedTransaction],
    queryFn: async () => {
      const response = await fetch(
        selectedTransaction 
          ? `/api/transactions/${selectedTransaction}/documents`
          : '/api/documents?type=kyc',
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      if (!response.ok) throw new Error('Failed to fetch documents');
      return response.json();
    },
    enabled: !!user
  });

  // Fetch payment history
  const { data: payments, isLoading: paymentsLoading } = useQuery({
    queryKey: ['buyer-payments', selectedTransaction],
    queryFn: async () => {
      if (!selectedTransaction) return [];
      const response = await fetch(`/api/transactions/${selectedTransaction}/payments`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch payments');
      return response.json();
    },
    enabled: !!selectedTransaction
  });

  const activeTransaction = transactions?.find((t: TransactionOverview) => t.id === selectedTransaction) || transactions?.[0];

  if (transactionsLoading || documentsLoading) {
    return (
      <ProtectedRoute requiredRole={['buyer', 'admin']}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole={['buyer', 'admin']}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Buyer Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Welcome back, {user?.firstName}! Track your property purchase journey here.
            </p>
          </div>

          {/* Transaction Selector (if multiple) */}
          {transactions && transactions.length> 1 && (
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Select Transaction</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {transactions.map((transaction: TransactionOverview) => (
                  <button
                    key={transaction.id}
                    onClick={() => setSelectedTransaction(transaction.id)}
                    className={`p-3 border rounded-lg text-left transition-all ${
                      selectedTransaction === transaction.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className="font-medium text-sm">{transaction.property.title}</p>
                    <p className="text-xs text-gray-600">{transaction.referenceNumber}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Main Content */}
          {activeTransaction ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Transaction Overview & Timeline */}
              <div className="lg:col-span-2 space-y-6">
                {/* Transaction Overview */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Transaction Overview</h2>

                  <div className="mb-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {activeTransaction.property.title}
                        </h3>
                        <p className="text-gray-600">{activeTransaction.property.location}</p>
                        <p className="text-2xl font-bold text-blue-600 mt-2">
                          €{activeTransaction.property.price.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {activeTransaction.status}
                        </span>
                        <p className="text-sm text-gray-600 mt-2">
                          Ref: {activeTransaction.referenceNumber}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                      <span className="text-sm font-medium text-gray-900">
                        {activeTransaction.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={ width: `${activeTransaction.progress}%` }
                      />
                    </div>
                  </div>

                  {/* Next Action Required */}
                  {activeTransaction.nextAction && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-medium text-yellow-900">Action Required</h4>
                          <p className="text-sm text-yellow-800 mt-1">
                            {activeTransaction.nextAction}
                          </p>
                          <p className="text-xs text-yellow-700 mt-2">
                            Due: {activeTransaction.nextActionDue}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Timeline */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Transaction Timeline</h2>
                  <div className="relative">
                    <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-200"></div>
                    <div className="space-y-6">
                      {/* Reservation */}
                      <div className="relative flex items-start">
                        <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          activeTransaction.timeline.reservationDate 
                            ? 'bg-green-600' 
                            : 'bg-gray-300'
                        }`}>
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                        <div className="ml-12">
                          <h3 className="font-semibold text-gray-900">Reservation</h3>
                          <p className="text-sm text-gray-600">
                            {activeTransaction.timeline.reservationDate || 'Pending'}
                          </p>
                        </div>
                      </div>

                      {/* Contract Signing */}
                      <div className="relative flex items-start">
                        <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          activeTransaction.timeline.contractDate 
                            ? 'bg-green-600' 
                            : activeTransaction.stage === 'LEGAL_PROCESSING'
                            ? 'bg-blue-600 animate-pulse'
                            : 'bg-gray-300'
                        }`}>
                          <FileText className="w-4 h-4 text-white" />
                        </div>
                        <div className="ml-12">
                          <h3 className="font-semibold text-gray-900">Contract Signing</h3>
                          <p className="text-sm text-gray-600">
                            {activeTransaction.timeline.contractDate || 'In Progress'}
                          </p>
                        </div>
                      </div>

                      {/* Mortgage Approval */}
                      <div className="relative flex items-start">
                        <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          activeTransaction.timeline.mortgageApprovalDate 
                            ? 'bg-green-600' 
                            : 'bg-gray-300'
                        }`}>
                          <CreditCard className="w-4 h-4 text-white" />
                        </div>
                        <div className="ml-12">
                          <h3 className="font-semibold text-gray-900">Mortgage Approval</h3>
                          <p className="text-sm text-gray-600">
                            {activeTransaction.timeline.mortgageApprovalDate || 'Pending'}
                          </p>
                        </div>
                      </div>

                      {/* Completion */}
                      <div className="relative flex items-start">
                        <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          activeTransaction.timeline.completionDate 
                            ? 'bg-green-600' 
                            : 'bg-gray-300'
                        }`}>
                          <Home className="w-4 h-4 text-white" />
                        </div>
                        <div className="ml-12">
                          <h3 className="font-semibold text-gray-900">Completion</h3>
                          <p className="text-sm text-gray-600">
                            {activeTransaction.timeline.completionDate || 'Estimated Q2 2025'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment History */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Payment History</h2>
                    <button
                      onClick={() => router.push(`/buyer/transactions/${activeTransaction.id}/payments`)}
                      className="text-blue-600 hover:underline text-sm font-medium"
                    >
                      View All
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Total Paid</p>
                          <p className="text-xl font-bold text-green-600">
                            €{activeTransaction.paymentSummary.totalPaid.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Outstanding</p>
                          <p className="text-xl font-bold text-gray-900">
                            €{activeTransaction.paymentSummary.outstandingBalance.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {activeTransaction.paymentSummary.nextPaymentDue && (
                      <div className="border border-orange-200 bg-orange-50 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium text-orange-900">Next Payment Due</p>
                            <p className="text-lg font-bold text-orange-900 mt-1">
                              €{activeTransaction.paymentSummary.nextPaymentAmount.toLocaleString()}
                            </p>
                            <p className="text-sm text-orange-700 mt-1">
                              Due: {new Date(activeTransaction.paymentSummary.nextPaymentDue).toLocaleDateString()}
                            </p>
                          </div>
                          <button
                            onClick={() => router.push(`/buyer/transactions/${activeTransaction.id}/payment`)}
                            className="bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors"
                          >
                            Pay Now
                          </button>
                        </div>
                      </div>
                    )}

                    {payments && payments.length> 0 && (
                      <div className="mt-4 space-y-2">
                        {payments.slice(0).map((payment: any) => (
                          <div key={payment.id} className="flex items-center justify-between py-2 border-b">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{payment.description}</p>
                              <p className="text-xs text-gray-600">
                                {new Date(payment.date).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">
                                €{payment.amount.toLocaleString()}
                              </p>
                              <p className="text-xs text-green-600">{payment.status}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Documents & Communication */}
              <div className="space-y-6">
                {/* Document Upload */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Document Center</h2>

                  <div className="space-y-3">
                    {documents && documents.map((doc: Document) => (
                      <div key={doc.id} className="border rounded-lg p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-sm text-gray-900">{doc.name}</p>
                            <p className="text-xs text-gray-600 mt-1">
                              {doc.requiredBy && `Required by: ${doc.requiredBy}`}
                            </p>
                          </div>
                          <div className="ml-3">
                            {doc.status === 'verified' ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : doc.status === 'uploaded' ? (
                              <Clock className="w-5 h-5 text-yellow-600" />
                            ) : doc.status === 'rejected' ? (
                              <AlertTriangle className="w-5 h-5 text-red-600" />
                            ) : (
                              <button
                                onClick={() => router.push(`/buyer/documents/upload?type=${doc.type}`)}
                                className="text-blue-600 hover:underline text-sm font-medium flex items-center gap-1"
                              >
                                <Upload className="w-4 h-4" />
                                Upload
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => router.push('/buyer/documents')}
                    className="mt-4 w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    View All Documents
                  </button>
                </div>

                {/* Communication Center */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Communication</h2>

                  <div className="space-y-3">
                    <button
                      onClick={() => router.push(`/buyer/messages?transaction=${activeTransaction.id}`)}
                      className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <MessageSquare className="w-5 h-5 text-blue-600" />
                        <span className="font-medium text-sm">Messages</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">3</span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </button>

                    <button
                      onClick={() => router.push('/buyer/support')}
                      className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Info className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-sm">Support</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>

                    <button
                      onClick={() => router.push('/buyer/appointments')}
                      className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-purple-600" />
                        <span className="font-medium text-sm">Schedule Meeting</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>

                  <div className="space-y-2">
                    <button
                      onClick={() => router.push(`/buyer/transactions/${activeTransaction.id}/contract`)}
                      className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Eye className="w-5 h-5" />
                      View Contract
                    </button>

                    <button
                      onClick={() => router.push(`/buyer/transactions/${activeTransaction.id}/receipt`)}
                      className="w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <Download className="w-5 h-5" />
                      Download Receipts
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // No Active Transactions
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No Active Transactions</h2>
              <p className="text-gray-600 mb-6">
                Start your property journey by browsing available properties.
              </p>
              <button
                onClick={() => router.push('/properties')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Browse Properties
              </button>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}