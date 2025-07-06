'use client';

import React, { useState, useEffect } from 'react';
import {
  Shield,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  FileText,
  Calendar,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Download,
  RefreshCw,
  Plus,
  Filter,
  Search,
  MoreVertical,
  Lock,
  Unlock,
  Target,
  Activity,
  Wallet,
  CreditCard,
  Building2,
  Scale,
  Home
} from 'lucide-react';
import { EscrowAccount, EscrowStatus, ConditionType, FundSource } from '@/services/EscrowService';

interface EscrowSummary {
  totalDeposited: number;
  totalReleased: number;
  pendingReleases: number;
  conditionsMet: number;
  totalConditions: number;
  milestonesCompleted: number;
  totalMilestones: number;
}

interface EscrowDashboardProps {
  className?: string;
  transactionId?: string;
  propertyId?: string;
}

export function EscrowDashboard({ className = '', transactionId, propertyId }: EscrowDashboardProps) {
  const [escrowAccounts, setEscrowAccounts] = useState<Array<{ account: EscrowAccount; summary: EscrowSummary }>>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'conditions' | 'milestones' | 'funds' | 'releases'>('overview');

  useEffect(() => {
    fetchEscrowData();
  }, [transactionId, propertyId]);

  const fetchEscrowData = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (transactionId) params.append('transaction_id', transactionId);
      if (propertyId) params.append('property_id', propertyId);

      const response = await fetch(`/api/escrow?${params.toString()}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch escrow data');
      }

      const data = await response.json();
      
      if (transactionId) {
        setEscrowAccounts(data.accounts || []);
      } else {
        // Single account response
        setEscrowAccounts([{ account: data.account, summary: data.summary }]);
      }

      if (data.accounts?.length > 0 && !selectedAccount) {
        setSelectedAccount(data.accounts[0].account.id);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load escrow data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchEscrowData();
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

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('en-IE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: EscrowStatus) => {
    switch (status) {
      case EscrowStatus.COMPLETED:
        return 'bg-green-100 text-green-800 border-green-200';
      case EscrowStatus.ACTIVE:
      case EscrowStatus.FUNDED:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case EscrowStatus.CONDITIONS_MET:
      case EscrowStatus.READY_FOR_RELEASE:
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case EscrowStatus.DISPUTED:
        return 'bg-red-100 text-red-800 border-red-200';
      case EscrowStatus.CANCELLED:
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: EscrowStatus) => {
    switch (status) {
      case EscrowStatus.COMPLETED:
        return <CheckCircle size={16} className="text-green-600" />;
      case EscrowStatus.ACTIVE:
      case EscrowStatus.FUNDED:
        return <Activity size={16} className="text-blue-600" />;
      case EscrowStatus.CONDITIONS_MET:
      case EscrowStatus.READY_FOR_RELEASE:
        return <Clock size={16} className="text-amber-600" />;
      case EscrowStatus.DISPUTED:
        return <AlertTriangle size={16} className="text-red-600" />;
      case EscrowStatus.CANCELLED:
        return <Lock size={16} className="text-gray-600" />;
      default:
        return <Shield size={16} className="text-gray-600" />;
    }
  };

  const getConditionIcon = (type: ConditionType) => {
    switch (type) {
      case ConditionType.DOCUMENT_UPLOAD:
        return <FileText size={16} className="text-blue-600" />;
      case ConditionType.SIGNATURE_REQUIRED:
        return <Users size={16} className="text-purple-600" />;
      case ConditionType.LEGAL_APPROVAL:
        return <Scale size={16} className="text-indigo-600" />;
      case ConditionType.TITLE_VERIFICATION:
        return <Home size={16} className="text-green-600" />;
      case ConditionType.PAYMENT_CONFIRMATION:
        return <CreditCard size={16} className="text-emerald-600" />;
      default:
        return <CheckCircle size={16} className="text-gray-600" />;
    }
  };

  const getFundSourceIcon = (source: FundSource) => {
    switch (source) {
      case FundSource.BUYER_DEPOSIT:
      case FundSource.CONTRACTUAL_DEPOSIT:
        return <Wallet size={16} className="text-blue-600" />;
      case FundSource.STAGE_PAYMENT:
        return <Building2 size={16} className="text-purple-600" />;
      case FundSource.HTB_BENEFIT:
        return <Target size={16} className="text-red-600" />;
      case FundSource.AGENT_COMMISSION:
        return <Users size={16} className="text-green-600" />;
      default:
        return <DollarSign size={16} className="text-gray-600" />;
    }
  };

  const selectedAccountData = escrowAccounts.find(ea => ea.account.id === selectedAccount);

  if (loading) {
    return (
      <div className={`bg-white rounded-lg border shadow-sm p-8 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading escrow data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg border shadow-sm p-8 ${className}`}>
        <div className="text-center">
          <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Escrow Data</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (escrowAccounts.length === 0) {
    return (
      <div className={`bg-white rounded-lg border shadow-sm p-8 ${className}`}>
        <div className="text-center">
          <Shield size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Escrow Accounts</h3>
          <p className="text-gray-600 mb-4">No escrow accounts found for this transaction.</p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto">
            <Plus size={16} />
            Create Escrow Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border shadow-sm ${className}`}>
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Shield size={24} className="text-blue-600" />
              Escrow Management
            </h2>
            <p className="text-gray-600 mt-1">Secure fund management for property transactions</p>
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
            
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Plus size={16} />
              New Escrow
            </button>
          </div>
        </div>

        {/* Account Selector */}
        {escrowAccounts.length > 1 && (
          <div className="mt-4 flex gap-2 overflow-x-auto">
            {escrowAccounts.map(({ account }) => (
              <button
                key={account.id}
                onClick={() => setSelectedAccount(account.id)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedAccount === account.id
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Escrow #{account.id.slice(-6)}
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedAccountData && (
        <>
          {/* Summary Cards */}
          <div className="p-6 border-b bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Deposited</p>
                    <p className="text-xl font-bold text-gray-900">
                      {formatCurrency(selectedAccountData.summary.totalDeposited)}
                    </p>
                  </div>
                  <Wallet size={24} className="text-blue-600" />
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Released</p>
                    <p className="text-xl font-bold text-gray-900">
                      {formatCurrency(selectedAccountData.summary.totalReleased)}
                    </p>
                  </div>
                  <TrendingUp size={24} className="text-green-600" />
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Conditions Met</p>
                    <p className="text-xl font-bold text-gray-900">
                      {selectedAccountData.summary.conditionsMet}/{selectedAccountData.summary.totalConditions}
                    </p>
                  </div>
                  <CheckCircle size={24} className="text-purple-600" />
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Milestones</p>
                    <p className="text-xl font-bold text-gray-900">
                      {selectedAccountData.summary.milestonesCompleted}/{selectedAccountData.summary.totalMilestones}
                    </p>
                  </div>
                  <Target size={24} className="text-amber-600" />
                </div>
              </div>
            </div>

            {/* Status Badge */}
            <div className="mt-4 flex items-center gap-4">
              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedAccountData.account.status)}`}>
                {getStatusIcon(selectedAccountData.account.status)}
                {selectedAccountData.account.status.replace('_', ' ').toUpperCase()}
              </span>
              <span className="text-sm text-gray-600">
                Current Balance: <span className="font-semibold">{formatCurrency(selectedAccountData.account.balance)}</span>
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: Activity },
                { id: 'conditions', label: 'Conditions', icon: CheckCircle },
                { id: 'milestones', label: 'Milestones', icon: Target },
                { id: 'funds', label: 'Funds', icon: Wallet },
                { id: 'releases', label: 'Releases', icon: TrendingUp }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Participants */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Participants</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedAccountData.account.participants.map(participant => (
                      <div key={participant.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{participant.name}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            participant.hasApproved ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {participant.hasApproved ? 'Approved' : 'Pending'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{participant.type.replace('_', ' ')}</p>
                        <p className="text-sm text-gray-600">{participant.email}</p>
                        <div className="mt-2">
                          <span className="text-xs text-gray-500 capitalize">{participant.role.replace('_', ' ')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {selectedAccountData.account.funds.slice(0, 3).map(fund => (
                      <div key={fund.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        {getFundSourceIcon(fund.source)}
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {formatCurrency(fund.amount)} deposited
                          </p>
                          <p className="text-xs text-gray-600">
                            {fund.source.replace('_', ' ')} • {formatDate(fund.depositedAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                    {selectedAccountData.account.funds.length === 0 && (
                      <p className="text-gray-500 text-center py-8">No fund activity yet</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'conditions' && (
              <div className="space-y-4">
                {selectedAccountData.account.conditions.map(condition => (
                  <div key={condition.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {getConditionIcon(condition.type)}
                        <div>
                          <h4 className="font-medium text-gray-900">{condition.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{condition.description}</p>
                          {condition.dueDate && (
                            <p className="text-xs text-gray-500 mt-1">
                              Due: {formatDate(condition.dueDate)}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        condition.status === 'met' ? 'bg-green-100 text-green-800' :
                        condition.status === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {condition.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'milestones' && (
              <div className="space-y-4">
                {selectedAccountData.account.milestones.map((milestone, index) => (
                  <div key={milestone.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          milestone.status === 'completed' ? 'bg-green-100' :
                          milestone.status === 'in_progress' ? 'bg-blue-100' :
                          'bg-gray-100'
                        }`}>
                          <span className="text-sm font-medium">{milestone.order}</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{milestone.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                          {milestone.dueDate && (
                            <p className="text-xs text-gray-500 mt-1">
                              Due: {formatDate(milestone.dueDate)}
                            </p>
                          )}
                          {milestone.releasePercentage && (
                            <p className="text-xs text-blue-600 mt-1">
                              Release: {milestone.releasePercentage}% of funds
                            </p>
                          )}
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        milestone.status === 'completed' ? 'bg-green-100 text-green-800' :
                        milestone.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        milestone.status === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {milestone.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'funds' && (
              <div className="space-y-4">
                {selectedAccountData.account.funds.map(fund => (
                  <div key={fund.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getFundSourceIcon(fund.source)}
                        <div>
                          <h4 className="font-medium text-gray-900">{formatCurrency(fund.amount)}</h4>
                          <p className="text-sm text-gray-600">{fund.source.replace('_', ' ')}</p>
                          <p className="text-xs text-gray-500">
                            Deposited {formatDate(fund.depositedAt)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          fund.status === 'released' ? 'bg-green-100 text-green-800' :
                          fund.status === 'held' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {fund.status.toUpperCase()}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">{fund.purpose}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {selectedAccountData.account.funds.length === 0 && (
                  <div className="text-center py-8">
                    <Wallet size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">No funds deposited yet</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'releases' && (
              <div className="space-y-4">
                {selectedAccountData.account.releases.map(release => (
                  <div key={release.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{formatCurrency(release.amount)}</h4>
                        <p className="text-sm text-gray-600">{release.reason}</p>
                        <p className="text-xs text-gray-500">
                          Requested {formatDate(release.releasedAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          release.status === 'released' ? 'bg-green-100 text-green-800' :
                          release.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                          release.status === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {release.status.toUpperCase()}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          {release.approvals.length} approval(s)
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {selectedAccountData.account.releases.length === 0 && (
                  <div className="text-center py-8">
                    <TrendingUp size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">No releases requested yet</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}