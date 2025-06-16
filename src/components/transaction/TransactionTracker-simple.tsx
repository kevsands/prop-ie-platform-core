'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  FileText, 
  Calendar,
  DollarSign, 
  User,
  Home,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  Filter,
  Search
} from 'lucide-react';

interface Transaction {
  id: string;
  propertyAddress: string;
  buyerName: string;
  amount: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  stage: string;
  lastUpdate: string;
  daysRemaining?: number;
}

const TransactionTracker: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const transactions: Transaction[] = [
    {
      id: 'TXN-001',
      propertyAddress: '123 Fitzwilliam Square, Dublin 2',
      buyerName: 'John Smith',
      amount: 850000,
      status: 'in_progress',
      stage: 'Legal Review',
      lastUpdate: '2024-03-15',
      daysRemaining: 14
    },
    {
      id: 'TXN-002',
      propertyAddress: '45 Merrion Street, Dublin 2',
      buyerName: 'Sarah Johnson',
      amount: 725000,
      status: 'completed',
      stage: 'Completed',
      lastUpdate: '2024-03-10'
    },
    {
      id: 'TXN-003',
      propertyAddress: '78 Grafton Street, Dublin 2',
      buyerName: 'Michael Brown',
      amount: 950000,
      status: 'pending',
      stage: 'Mortgage Approval',
      lastUpdate: '2024-03-12',
      daysRemaining: 21
    },
    {
      id: 'TXN-004',
      propertyAddress: '92 Stephen\'s Green, Dublin 2',
      buyerName: 'Emma Wilson',
      amount: 675000,
      status: 'in_progress',
      stage: 'Survey',
      lastUpdate: '2024-03-14',
      daysRemaining: 18
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'in_progress':
        return <Clock className="h-4 w-4" />;
      case 'cancelled':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === 'all' || transaction.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const summary = {
    total: transactions.length,
    pending: transactions.filter(t => t.status === 'pending').length,
    inProgress: transactions.filter(t => t.status === 'in_progress').length,
    completed: transactions.filter(t => t.status === 'completed').length,
    totalValue: transactions.reduce((sum, t) => sum + t.amount, 0)
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Transaction Tracker</h1>
          <p className="text-gray-600">Monitor and manage all property transactions</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Transaction
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold">{summary.total}</p>
              </div>
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{summary.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">{summary.inProgress}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{summary.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-lg font-bold">€{(summary.totalValue / 1000000).toFixed(1)}M</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Home className="h-5 w-5 text-gray-400" />
                      <h3 className="font-semibold">{transaction.propertyAddress}</h3>
                      <Badge className={getStatusColor(transaction.status)}>
                        {getStatusIcon(transaction.status)}
                        <span className="ml-1">{transaction.status.replace('_', ' ')}</span>
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        {transaction.buyerName}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="mr-2 h-4 w-4" />
                        €{transaction.amount.toLocaleString()}
                      </div>
                      <div className="flex items-center">
                        <FileText className="mr-2 h-4 w-4" />
                        {transaction.stage}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4" />
                        {transaction.daysRemaining ? `${transaction.daysRemaining} days left` : 'Completed'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      Update
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredTransactions.length === 0 && (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">No transactions found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionTracker;