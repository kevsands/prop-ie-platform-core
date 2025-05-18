'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTransaction } from '@/context/TransactionContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, CreditCard, FileText, MessageSquare, Users, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { api } from '@/lib/api-client';
import { PaymentOverview } from '@/components/transaction/PaymentOverview';
import { DocumentCenter } from '@/components/transaction/DocumentCenter';
import { CommunicationHub } from '@/components/transaction/CommunicationHub';
import { ParticipantsList } from '@/components/transaction/ParticipantsList';

export default function BuyerTransactionsPage() {
  const { user } = useAuth();
  const { transactions, fetchUserTransactions, loadingTransactions } = useTransaction();
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserTransactions();
    }
  }, [user]);

  const fetchTransactionDetails = async (transactionId: string) => {
    setLoadingDetails(true);
    try {
      const response = await api.get(`/transactions/${transactionId}`);
      setSelectedTransaction(response);
    } catch (error) {
      console.error('Error fetching transaction details:', error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'bg-gray-100 text-gray-700';
      case 'RESERVED':
        return 'bg-blue-100 text-blue-700';
      case 'DEPOSIT_PAID':
        return 'bg-green-100 text-green-700';
      case 'CONTRACTED':
        return 'bg-purple-100 text-purple-700';
      case 'MORTGAGE_APPROVED':
        return 'bg-indigo-100 text-indigo-700';
      case 'CLOSING':
        return 'bg-yellow-100 text-yellow-700';
      case 'COMPLETED':
        return 'bg-green-100 text-green-700';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'CANCELLED':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'CLOSING':
      case 'CONTRACTED':
        return <Clock className="h-5 w-5 text-blue-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  if (loadingTransactions) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Transactions</h1>
        <p className="text-gray-600">Manage your property purchases and track progress</p>
      </div>

      {transactions.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500 mb-4">You don't have any active transactions</p>
            <Button>Browse Properties</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Transaction List</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedTransaction?.id === transaction.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => fetchTransactionDetails(transaction.id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{transaction.property.developmentName}</h3>
                        {getStatusIcon(transaction.status)}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{transaction.property.address}</p>
                      <div className="flex justify-between items-center">
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {format(new Date(transaction.createdAt), 'MMM d, yyyy')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            {loadingDetails ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : selectedTransaction ? (
              <div className="space-y-6">
                {/* Transaction Overview */}
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{selectedTransaction.property.developmentName}</CardTitle>
                        <p className="text-gray-600">{selectedTransaction.property.address}</p>
                      </div>
                      <Badge className={getStatusColor(selectedTransaction.status)}>
                        {selectedTransaction.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <p className="text-sm text-gray-600">Property Price</p>
                        <p className="text-xl font-semibold">€{selectedTransaction.totalAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Expected Completion</p>
                        <p className="text-xl font-semibold">
                          {selectedTransaction.completionDate 
                            ? format(new Date(selectedTransaction.completionDate), 'MMM d, yyyy')
                            : 'TBD'
                          }
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Transaction Progress</span>
                        <span>65%</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>

                    {/* Current Stage */}
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-700">Current Stage</p>
                      <p className="text-lg font-semibold text-blue-900">{selectedTransaction.currentStage}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Tabbed Content */}
                <Tabs defaultValue="payments" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="payments">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Payments
                    </TabsTrigger>
                    <TabsTrigger value="documents">
                      <FileText className="h-4 w-4 mr-2" />
                      Documents
                    </TabsTrigger>
                    <TabsTrigger value="communication">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Messages
                    </TabsTrigger>
                    <TabsTrigger value="participants">
                      <Users className="h-4 w-4 mr-2" />
                      Participants
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="payments">
                    <PaymentOverview 
                      transaction={selectedTransaction}
                      userRole="BUYER"
                    />
                  </TabsContent>

                  <TabsContent value="documents">
                    <DocumentCenter 
                      transaction={selectedTransaction}
                      userRole="BUYER"
                    />
                  </TabsContent>

                  <TabsContent value="communication">
                    <CommunicationHub 
                      transaction={selectedTransaction}
                      userRole="BUYER"
                    />
                  </TabsContent>

                  <TabsContent value="participants">
                    <ParticipantsList 
                      transaction={selectedTransaction}
                      userRole="BUYER"
                    />
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-gray-500">Select a transaction to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}