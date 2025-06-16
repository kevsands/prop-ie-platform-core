'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTransaction } from '@/context/TransactionContext';
import { TransactionFlow } from '@/components/transaction/TransactionFlow';
import { ParticipantsList } from '@/components/transaction/ParticipantsList';
import { DocumentCenter } from '@/components/transaction/DocumentCenter';
import { CommunicationHub } from '@/components/transaction/CommunicationHub';
import { PaymentOverview } from '@/components/transaction/PaymentOverview';
import { DeveloperDashboard } from '@/components/dashboard/DeveloperDashboard';
import { BuyerDashboard } from '@/components/dashboard/BuyerDashboard';
import { AgentDashboard } from '@/components/dashboard/AgentDashboard';
import { SolicitorDashboard } from '@/components/dashboard/SolicitorDashboard';
import { InvestorDashboard } from '@/components/dashboard/InvestorDashboard';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  InfoIcon, 
  FileTextIcon, 
  UsersIcon, 
  MessageSquareIcon,
  CreditCardIcon,
  ActivityIcon,
  AlertCircleIcon,
  RefreshCwIcon
} from 'lucide-react';

interface UnifiedDashboardProps {
  transactionId?: string;
}

export const UnifiedDashboard: React.FC<UnifiedDashboardProps> = ({ transactionId }) => {
  const { user } = useAuth();
  const { 
    currentTransaction, 
    fetchTransaction, 
    transactions,
    loadingTransactions 
  } = useTransaction();

  const [loadingsetLoading] = useState(true);
  const [errorsetError] = useState<string | null>(null);
  const [refreshingsetRefreshing] = useState(false);

  // Load transaction if ID is provided
  useEffect(() => {
    const loadTransaction = async () => {
      if (transactionId) {
        setLoading(true);
        setError(null);
        try {
          await fetchTransaction(transactionId);
        } catch (err) {
          setError('Failed to load transaction details');

        } finally {
          setLoading(false);
        }
      }
    };

    loadTransaction();
  }, [transactionIdfetchTransaction]);

  // Refresh transaction data
  const handleRefresh = async () => {
    if (!currentTransaction) return;

    setRefreshing(true);
    try {
      await fetchTransaction(currentTransaction.id);
    } catch (err) {

    } finally {
      setRefreshing(false);
    }
  };

  // Get role-specific dashboard component
  const getRoleDashboard = () => {
    if (!user) return null;

    switch (user.role) {
      case 'DEVELOPER':
        return <DeveloperDashboard />\n  );
      case 'BUYER':
        return <BuyerDashboard />\n  );
      case 'AGENT':
        return <AgentDashboard />\n  );
      case 'SOLICITOR':
        return <SolicitorDashboard />\n  );
      case 'INVESTOR':
        return <InvestorDashboard />\n  );
      default:
        return <div>Role not recognized</div>\n  );
    }
  };

  // Get user's role in current transaction
  const getUserTransactionRole = () => {
    if (!currentTransaction || !user) return null;

    const participant = currentTransaction.participants.find((p: any) => p.userId === user.id);
    return participant?.role;
  };

  // Show role-specific alerts
  const getRoleAlerts = () => {
    const role = getUserTransactionRole();
    if (!role || !currentTransaction) return null;

    const alerts = [];

    // Developer alerts
    if (role === 'DEVELOPER') {
      if (currentTransaction.status === 'RESERVED' && !currentTransaction.payments.find((p: any) => p.type === 'BOOKING_DEPOSIT' && p.status === 'COMPLETED')) {
        alerts.push({
          type: 'warning',
          message: 'Booking deposit pending from buyer'
        });
      }
    }

    // Buyer alerts
    if (role === 'BUYER') {
      const pendingPayments = currentTransaction.payments.filter((p: any) => p.status === 'PENDING');
      if (pendingPayments.length> 0) {
        alerts.push({
          type: 'warning',
          message: `You have ${pendingPayments.length} pending payment(s)`
        });
      }
    }

    // Solicitor alerts
    if (role === 'BUYER_SOLICITOR' || role === 'VENDOR_SOLICITOR') {
      const pendingDocs = currentTransaction.documents.filter((d) => d.status === 'PENDING');
      if (pendingDocs.length> 0) {
        alerts.push({
          type: 'info',
          message: `${pendingDocs.length} document(s) awaiting review`
        });
      }
    }

    return alerts;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="space-y-6">
          <Skeleton className="h-12 w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Show role dashboard if no specific transaction
  if (!transactionId || !currentTransaction) {
    return getRoleDashboard();
  }

  const userRole = getUserTransactionRole();
  const alerts = getRoleAlerts();

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Transaction Overview
          </h1>
          <p className="text-gray-600">
            {currentTransaction.property.address}
          </p>
          <div className="flex items-center gap-4 mt-2">
            <Badge variant="outline">
              {currentTransaction.reference}
            </Badge>
            <Badge 
              variant={currentTransaction.status === 'COMPLETED' ? 'default' : 'secondary'}
            >
              {currentTransaction.status}
            </Badge>
            {userRole && (
              <Badge variant="secondary">
                Your Role: {userRole}
              </Badge>
            )}
          </div>
        </div>

        <Button
          onClick={handleRefresh}
          variant="outline"
          size="sm"
          disabled={refreshing}
        >
          <RefreshCwIcon className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Alerts */}
      {alerts && alerts.length> 0 && (
        <div className="space-y-3 mb-6">
          {alerts.map((alert, index: any) => (
            <Alert key={index} variant={alert.type === 'warning' ? 'default' : 'default'}>
              <InfoIcon className="h-4 w-4" />
              <AlertDescription>{alert.message}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Transaction Status Overview */}
      <Card className="mb-6">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <ActivityIcon className="h-5 w-5 mr-2" />
            Transaction Progress
          </h2>
          <TransactionFlow transaction={currentTransaction} />
        </div>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documents">
            <FileTextIcon className="h-4 w-4 mr-2" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="participants">
            <UsersIcon className="h-4 w-4 mr-2" />
            Participants
          </TabsTrigger>
          <TabsTrigger value="messages">
            <MessageSquareIcon className="h-4 w-4 mr-2" />
            Messages
          </TabsTrigger>
          <TabsTrigger value="payments">
            <CreditCardIcon className="h-4 w-4 mr-2" />
            Payments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Property Details */}
            <Card>
              <div className="p-6">
                <h3 className="font-semibold mb-4">Property Details</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-500">Type:</span>
                    <span className="ml-2">{currentTransaction.property.type}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Bedrooms:</span>
                    <span className="ml-2">{currentTransaction.property.bedrooms}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Bathrooms:</span>
                    <span className="ml-2">{currentTransaction.property.bathrooms}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Price:</span>
                    <span className="ml-2 font-semibold">
                      €{currentTransaction.property.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Key Dates */}
            <Card>
              <div className="p-6">
                <h3 className="font-semibold mb-4">Key Dates</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-500">Started:</span>
                    <span className="ml-2">
                      {new Date(currentTransaction.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Last Updated:</span>
                    <span className="ml-2">
                      {new Date(currentTransaction.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  {currentTransaction.completionDate && (
                    <div>
                      <span className="text-gray-500">Completion:</span>
                      <span className="ml-2">
                        {new Date(currentTransaction.completionDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card>
              <div className="p-6">
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Button className="w-full" variant="outline" size="sm">
                    Upload Document
                  </Button>
                  <Button className="w-full" variant="outline" size="sm">
                    Send Message
                  </Button>
                  <Button className="w-full" variant="outline" size="sm">
                    View Timeline
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="documents">
          <DocumentCenter transaction={currentTransaction} userRole={userRole} />
        </TabsContent>

        <TabsContent value="participants">
          <ParticipantsList transaction={currentTransaction} userRole={userRole} />
        </TabsContent>

        <TabsContent value="messages">
          <CommunicationHub transaction={currentTransaction} />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentOverview transaction={currentTransaction} userRole={userRole} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UnifiedDashboard;