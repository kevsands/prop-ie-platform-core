'use client';

import React, { useState, useEffect } from 'react';
import { useRealtime } from '@/hooks/useRealtime';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Building2, 
  Users, 
  FileText, 
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  MessageSquare,
  Filter,
  Download,
  UserCheck,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';

interface Transaction {
  id: string;
  unitId: string;
  unit: {
    unitNumber: string;
    type: string;
    price: number;
    development: {
      name: string;
    };
  };
  buyer: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  agent?: {
    id: string;
    name: string;
    company: string;
  };
  solicitor?: {
    id: string;
    name: string;
    firm: string;
  };
  status: string;
  stage: string;
  createdAt: Date;
  updatedAt: Date;
  milestones: any[];
  documents: any[];
  payments: any[];
}

export default function DeveloperTransactionsPage() {
  const { connected, joinRoom, leaveRoom, sendMessage } = useRealtime();
  const [transactionssetTransactions] = useState<Transaction[]>([]);
  const [selectedTransactionsetSelectedTransaction] = useState<Transaction | null>(null);
  const [activeTabsetActiveTab] = useState('all');
  const [filtersetFilter] = useState('all');
  const [isDetailsOpensetIsDetailsOpen] = useState(false);
  const [messagessetMessages] = useState<any[]>([]);

  useEffect(() => {
    fetchTransactions();

    // Join developer room for real-time updates
    if (connected) {
      joinRoom('developer:transactions');
    }

    return () => {
      if (connected) {
        leaveRoom('developer:transactions');
      }
    };
  }, [connected]);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/developer/transactions');
      const data: any = await response.json();
      setTransactions(data.transactions || []);
    } catch (error) {

    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'INITIATED': 'bg-gray-100 text-gray-800',
      'RESERVED': 'bg-blue-100 text-blue-800',
      'KYC_IN_PROGRESS': 'bg-yellow-100 text-yellow-800',
      'MORTGAGE_APPROVED': 'bg-green-100 text-green-800',
      'CONTRACTS_ISSUED': 'bg-purple-100 text-purple-800',
      'CONTRACTS_EXCHANGED': 'bg-indigo-100 text-indigo-800',
      'COMPLETED': 'bg-green-500 text-white',
      'CANCELLED': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStageInfo = (stage: string) => {
    const stages: Record<string, { icon: any; label: string }> = {
      'INITIAL_ENQUIRY': { icon: <MessageSquare />, label: 'Initial Enquiry' },
      'VIEWING': { icon: <Building2 />, label: 'Property Viewing' },
      'RESERVATION': { icon: <Calendar />, label: 'Reservation' },
      'KYC': { icon: <UserCheck />, label: 'KYC Verification' },
      'MORTGAGE': { icon: <DollarSign />, label: 'Mortgage Application' },
      'LEGAL': { icon: <FileText />, label: 'Legal Process' },
      'EXCHANGE': { icon: <FileText />, label: 'Contract Exchange' },
      'COMPLETION': { icon: <CheckCircle />, label: 'Completion' }
    };
    return stages[stage] || { icon: <Clock />, label: stage };
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true;
    return transaction.status === filter;
  });

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDetailsOpen(true);

    // Join transaction room for real-time updates
    if (connected) {
      joinRoom(`transaction:${transaction.id}`);
    }
  };

  const handleCloseDetails = () => {
    if (selectedTransaction && connected) {
      leaveRoom(`transaction:${selectedTransaction.id}`);
    }
    setIsDetailsOpen(false);
    setSelectedTransaction(null);
  };

  const sendMessageToTransaction = (transactionId: string, message: string) => {
    sendMessage(`transaction:${transactionId}`, {
      type: 'developer.message',
      text: message,
      timestamp: new Date()
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Transaction Management</h1>
            <p className="text-gray-600 mt-1">Monitor and manage all property transactions</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge className={connected ? 'bg-green-500' : 'bg-gray-500'}>
              {connected ? 'Live Updates' : 'Connecting...'}
            </Badge>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Transactions</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {transactions.filter(t => t.status !== 'COMPLETED' && t.status !== 'CANCELLED').length}
              </div>
              <p className="text-xs text-muted-foreground">
                {transactions.filter(t => t.status === 'RESERVED').length} reserved
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Legal Process</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {transactions.filter(t => t.stage === 'LEGAL').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Contracts & documentation
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Awaiting Mortgage</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {transactions.filter(t => t.stage === 'MORTGAGE').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Finance applications
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completions This Month</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {transactions.filter(t => {
                  const date = new Date(t.updatedAt);
                  const now = new Date();
                  return t.status === 'COMPLETED' && 
                    date.getMonth() === now.getMonth() && 
                    date.getFullYear() === now.getFullYear();
                }).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Successfully closed
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Transactions</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant={filter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('all')}
                >
                  All
                </Button>
                <Button
                  variant={filter === 'RESERVED' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('RESERVED')}
                >
                  Reserved
                </Button>
                <Button
                  variant={filter === 'CONTRACTS_EXCHANGED' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('CONTRACTS_EXCHANGED')}
                >
                  Exchanged
                </Button>
                <Button
                  variant={filter === 'COMPLETED' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('COMPLETED')}
                >
                  Completed
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleTransactionClick(transaction)}
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-semibold">{transaction.unit.development.name}</p>
                      <p className="text-sm text-gray-600">
                        Unit {transaction.unit.unitNumber} - {transaction.unit.type}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium">{transaction.buyer.name}</p>
                      <p className="text-sm text-gray-600">{transaction.buyer.email}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {getStageInfo(transaction.stage).icon}
                      <span className="text-sm">{getStageInfo(transaction.stage).label}</span>
                    </div>

                    <Badge className={getStatusColor(transaction.status)}>
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Transaction Details Dialog */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Transaction Details</DialogTitle>
            </DialogHeader>

            {selectedTransaction && (
              <Tabs defaultValue="overview" className="mt-4">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="milestones">Milestones</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="messages">Messages</TabsTrigger>
                  <TabsTrigger value="stakeholders">Stakeholders</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Property Details</h4>
                      <div className="space-y-2">
                        <p><strong>Development:</strong> {selectedTransaction.unit.development.name}</p>
                        <p><strong>Unit:</strong> {selectedTransaction.unit.unitNumber}</p>
                        <p><strong>Type:</strong> {selectedTransaction.unit.type}</p>
                        <p><strong>Price:</strong> €{selectedTransaction.unit.price.toLocaleString()}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Transaction Status</h4>
                      <div className="space-y-2">
                        <p><strong>Status:</strong> <Badge className={getStatusColor(selectedTransaction.status)}>{selectedTransaction.status}</Badge></p>
                        <p><strong>Stage:</strong> {getStageInfo(selectedTransaction.stage).label}</p>
                        <p><strong>Created:</strong> {format(new Date(selectedTransaction.createdAt), 'MMM dd, yyyy')}</p>
                        <p><strong>Last Updated:</strong> {format(new Date(selectedTransaction.updatedAt), 'MMM dd, yyyy')}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="milestones">
                  <div className="space-y-4">
                    {selectedTransaction.milestones.map((milestone) => (
                      <div key={milestone.id} className="flex items-start gap-3 p-4 border rounded-lg">
                        <div className={`mt-1 ${
                          milestone.status === 'completed' ? 'text-green-500' :
                          milestone.status === 'in_progress' ? 'text-blue-500' :
                          'text-gray-400'
                        }`}>
                          {milestone.status === 'completed' ? <CheckCircle /> :
                           milestone.status === 'in_progress' ? <Clock /> :
                           <Circle />}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{milestone.name}</h4>
                          <p className="text-sm text-gray-600">{milestone.description}</p>
                          {milestone.dueDate && (
                            <p className="text-sm text-gray-500 mt-1">
                              Due: {format(new Date(milestone.dueDate), 'MMM dd, yyyy')}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="documents">
                  <div className="space-y-4">
                    {selectedTransaction.documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            <p className="text-sm text-gray-600">{doc.type}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="mr-1 h-3 w-3" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="messages">
                  <div className="space-y-4">
                    <ScrollArea className="h-[300px] border rounded-lg p-4">
                      <div className="space-y-4">
                        {messages.map((messageindex) => (
                          <div key={index} className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{message.userId}</span>
                                <span className="text-sm text-gray-500">
                                  {format(new Date(message.timestamp), 'HH:mm')}
                                </span>
                              </div>
                              <p className="text-gray-700">{message.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 px-3 py-2 border rounded-lg"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && e.currentTarget.value) {
                            sendMessageToTransaction(selectedTransaction.id, e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }
                      />
                      <Button>Send</Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="stakeholders">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Buyer</h4>
                      <div className="space-y-2">
                        <p><strong>Name:</strong> {selectedTransaction.buyer.name}</p>
                        <p><strong>Email:</strong> {selectedTransaction.buyer.email}</p>
                        {selectedTransaction.buyer.phone && (
                          <p><strong>Phone:</strong> {selectedTransaction.buyer.phone}</p>
                        )}
                      </div>
                    </div>

                    {selectedTransaction.agent && (
                      <div>
                        <h4 className="font-semibold mb-3">Estate Agent</h4>
                        <div className="space-y-2">
                          <p><strong>Name:</strong> {selectedTransaction.agent.name}</p>
                          <p><strong>Company:</strong> {selectedTransaction.agent.company}</p>
                        </div>
                      </div>
                    )}

                    {selectedTransaction.solicitor && (
                      <div>
                        <h4 className="font-semibold mb-3">Solicitor</h4>
                        <div className="space-y-2">
                          <p><strong>Name:</strong> {selectedTransaction.solicitor.name}</p>
                          <p><strong>Firm:</strong> {selectedTransaction.solicitor.firm}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}