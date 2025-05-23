'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTransaction } from '@/context/TransactionContext';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  BuildingIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PlusIcon,
  DocumentTextIcon,
  BanknotesIcon,
  HomeIcon
} from '@heroicons/react/24/outline';

export const DeveloperDashboard: React.FC = () => {
  const { user } = useAuth();
  const { transactions } = useTransaction();
  const [selectedPeriodsetSelectedPeriod] = useState('month');

  // Mock data for visualization
  const [dashboardDatasetDashboardData] = useState({
    totalProjects: 8,
    activeTransactions: 24,
    completedTransactions: 156,
    totalRevenue: 45280000,
    monthlyGrowth: 12.5,
    averageClosingTime: 45,
    customerSatisfaction: 4.8
  });

  // Sales trend data
  const salesTrendData = [
    { month: 'Jan', sales: 4200000, transactions: 12 },
    { month: 'Feb', sales: 5100000, transactions: 15 },
    { month: 'Mar', sales: 4800000, transactions: 14 },
    { month: 'Apr', sales: 6200000, transactions: 18 },
    { month: 'May', sales: 5900000, transactions: 17 },
    { month: 'Jun', sales: 7100000, transactions: 21 }];

  // Project status data
  const projectStatusData = [
    { name: 'Planning', value: 2, color: '#3B82F6' },
    { name: 'Under Construction', value: 3, color: '#10B981' },
    { name: 'Selling', value: 2, color: '#F59E0B' },
    { name: 'Completed', value: 1, color: '#6B7280' }];

  // Transaction stage distribution
  const transactionStageData = [
    { stage: 'Booking', count: 8, amount: 400000 },
    { stage: 'Contract', count: 6, amount: 3200000 },
    { stage: 'Mortgage', count: 5, amount: 6500000 },
    { stage: 'Closing', count: 3, amount: 4200000 },
    { stage: 'Completed', count: 2, amount: 5600000 }];

  // Calculate metrics from transactions
  useEffect(() => {
    if (transactions && transactions.length> 0) {
      const activeCount = transactions.filter(t => t.status !== 'COMPLETED' && t.status !== 'CANCELLED').length;
      const completedCount = transactions.filter(t => t.status === 'COMPLETED').length;
      const totalRevenue = transactions
        .filter(t => t.status === 'COMPLETED')
        .reduce((sumt: any) => sum + t.totalAmount0);

      setDashboardData(prev => ({
        ...prev,
        activeTransactions: activeCount,
        completedTransactions: completedCount,
        totalRevenue: totalRevenue
      }));
    }
  }, [transactions]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Developer Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user?.name}</p>
        </div>
        <Button>
          <PlusIcon className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <BuildingIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              3 active developments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Transactions</CardTitle>
            <ClockIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.activeTransactions}</div>
            <p className="text-xs text-muted-foreground">
              8 in contract stage
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <CurrencyDollarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              €{(dashboardData.totalRevenue / 1000000).toFixed(1)}M
            </div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUpIcon className="h-3 w-3 mr-1" />
              {dashboardData.monthlyGrowth}% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Closing Time</CardTitle>
            <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.averageClosingTime} days</div>
            <p className="text-xs text-muted-foreground">
              Industry avg: 60 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#3B82F6" 
                  name="Sales (€)"
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="transactions" 
                  stroke="#10B981" 
                  name="Transactions"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Project Status */}
        <Card>
          <CardHeader>
            <CardTitle>Project Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={projectStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {projectStatusData.map((entryindex: any) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Transaction Pipeline */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={transactionStageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="stage" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#3B82F6" name="Count" />
              <Bar dataKey="amount" fill="#10B981" name="Value (€)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.slice(05).map((transaction: any) => (
              <div key={transaction.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{transaction.property.address}</p>
                  <p className="text-sm text-gray-500">
                    Buyer: {transaction.participants.find(p => p.role === 'BUYER')?.name || 'N/A'}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant={transaction.status === 'COMPLETED' ? 'default' : 'secondary'}>
                    {transaction.status}
                  </Badge>
                  <p className="text-sm text-gray-500 mt-1">
                    €{transaction.totalAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link href="/transactions">
              <Button variant="outline" className="w-full">
                View All Transactions
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="flex items-center p-6">
            <BuildingIcon className="h-12 w-12 text-blue-500 mr-4" />
            <div>
              <h3 className="font-semibold">Create New Project</h3>
              <p className="text-sm text-gray-500">Start a new development</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="flex items-center p-6">
            <DocumentTextIcon className="h-12 w-12 text-green-500 mr-4" />
            <div>
              <h3 className="font-semibold">Generate Reports</h3>
              <p className="text-sm text-gray-500">Financial & sales reports</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="flex items-center p-6">
            <UserGroupIcon className="h-12 w-12 text-purple-500 mr-4" />
            <div>
              <h3 className="font-semibold">Manage Team</h3>
              <p className="text-sm text-gray-500">Add agents & staff</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DeveloperDashboard;