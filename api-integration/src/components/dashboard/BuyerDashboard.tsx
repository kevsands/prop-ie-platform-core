'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTransaction } from '@/context/TransactionContext';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  HomeIcon,
  DocumentTextIcon,
  CreditCardIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  InfoIcon,
  SearchIcon,
  BanknotesIcon,
  ScaleIcon
} from '@heroicons/react/24/outline';

export const BuyerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { transactions } = useTransaction();
  const [activeTransaction, setActiveTransaction] = useState(null);

  // Calculate buyer's statistics
  const buyerStats = {
    propertiesViewed: 12,
    offersMade: 3,
    activeTransactions: transactions.filter(t => t.status !== 'COMPLETED' && t.status !== 'CANCELLED').length,
    totalSaved: 24500, // Mock data for saved properties value
    documentsRequired: 8,
    documentsUploaded: 5
  };

  // Find buyer's active transaction
  useEffect(() => {
    const active = transactions.find(t => 
      t.status !== 'COMPLETED' && 
      t.status !== 'CANCELLED' &&
      t.participants.some(p => p.userId === user?.id && p.role === 'BUYER')
    );
    setActiveTransaction(active);
  }, [transactions, user]);

  // Calculate progress for active transaction
  const calculateProgress = () => {
    if (!activeTransaction) return 0;
    const steps = [
      'RESERVED',
      'DEPOSIT_PAID',
      'CONTRACTED',
      'MORTGAGE_APPROVED',
      'CLOSING',
      'COMPLETED'
    ];
    const currentIndex = steps.indexOf(activeTransaction.status);
    return Math.round((currentIndex / (steps.length - 1)) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Buyer Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, {user?.name}</p>
      </div>

      {/* Active Transaction Alert */}
      {activeTransaction ? (
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            You have an active transaction for {activeTransaction.property.address}. Current status: <strong>{activeTransaction.status}</strong>
          </AlertDescription>
        </Alert>
      ) : (
        <Alert>
          <SearchIcon className="h-4 w-4" />
          <AlertDescription>
            You don't have any active transactions. Start searching for your dream home!
          </AlertDescription>
        </Alert>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Properties Viewed</CardTitle>
            <HomeIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{buyerStats.propertiesViewed}</div>
            <p className="text-xs text-muted-foreground">
              3 in the last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offers Made</CardTitle>
            <DocumentTextIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{buyerStats.offersMade}</div>
            <p className="text-xs text-muted-foreground">
              1 accepted
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saved on Help to Buy</CardTitle>
            <BanknotesIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{buyerStats.totalSaved.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Toward your deposit
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Active Transaction Overview */}
      {activeTransaction && (
        <Card>
          <CardHeader>
            <CardTitle>Active Transaction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{activeTransaction.property.address}</h3>
                <p className="text-sm text-gray-500">
                  {activeTransaction.property.type} • {activeTransaction.property.bedrooms} beds • {activeTransaction.property.bathrooms} baths
                </p>
                <p className="text-lg font-semibold mt-2">
                  €{activeTransaction.property.price.toLocaleString()}
                </p>
              </div>
              <Badge variant={activeTransaction.status === 'COMPLETED' ? 'default' : 'secondary'}>
                {activeTransaction.status}
              </Badge>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Transaction Progress</span>
                <span>{calculateProgress()}%</span>
              </div>
              <Progress value={calculateProgress()} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <Link href={`/transactions/${activeTransaction.id}`}>
                <Button className="w-full" variant="outline">
                  View Details
                </Button>
              </Link>
              <Link href={`/transactions/${activeTransaction.id}/documents`}>
                <Button className="w-full">
                  Documents ({buyerStats.documentsUploaded}/{buyerStats.documentsRequired})
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="flex flex-col items-center text-center p-6">
            <SearchIcon className="h-8 w-8 text-blue-500 mb-3" />
            <h3 className="font-semibold">Search Properties</h3>
            <p className="text-sm text-gray-500">Find your dream home</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="flex flex-col items-center text-center p-6">
            <CreditCardIcon className="h-8 w-8 text-green-500 mb-3" />
            <h3 className="font-semibold">Help to Buy</h3>
            <p className="text-sm text-gray-500">Check your eligibility</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="flex flex-col items-center text-center p-6">
            <CalendarIcon className="h-8 w-8 text-purple-500 mb-3" />
            <h3 className="font-semibold">Schedule Viewing</h3>
            <p className="text-sm text-gray-500">Book property tours</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="flex flex-col items-center text-center p-6">
            <ScaleIcon className="h-8 w-8 text-orange-500 mb-3" />
            <h3 className="font-semibold">Legal Advice</h3>
            <p className="text-sm text-gray-500">Connect with solicitors</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <HomeIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Viewed Property</p>
                <p className="text-sm text-gray-500">10 Maple Avenue, Dublin 4</p>
              </div>
              <span className="text-sm text-gray-500">2 hours ago</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <DocumentTextIcon className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Document Uploaded</p>
                <p className="text-sm text-gray-500">Bank statements for mortgage application</p>
              </div>
              <span className="text-sm text-gray-500">Yesterday</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CheckCircleIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Offer Accepted</p>
                <p className="text-sm text-gray-500">15 Oak Street, Dublin 2</p>
              </div>
              <span className="text-sm text-gray-500">3 days ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BuyerDashboard;