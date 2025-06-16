'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTransactionRealtime } from '@/hooks/useRealtime';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  CheckCircle, 
  Circle, 
  Clock, 
  FileText, 
  MessageSquare, 
  Users,
  AlertCircle,
  Home,
  DollarSign,
  UserCheck,
  FileCheck,
  Key,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';

// Transaction stages
const stages = [
  { id: 'property_selection', name: 'Property Selection', icon: <Home /> },
  { id: 'reservation', name: 'Reservation', icon: <Calendar /> },
  { id: 'kyc_verification', name: 'KYC Verification', icon: <UserCheck /> },
  { id: 'mortgage_approval', name: 'Mortgage Approval', icon: <DollarSign /> },
  { id: 'contracts', name: 'Contracts', icon: <FileText /> },
  { id: 'exchange', name: 'Exchange', icon: <FileCheck /> },
  { id: 'completion', name: 'Completion', icon: <Key /> }
];

interface Milestone {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  dueDate?: Date;
  completedAt?: Date;
  assignedTo?: string;
  documents?: any[];
  payments?: any[];
}

export default function BuyerJourneyPage() {
  const params = useParams();
  const router = useRouter();
  const transactionId = params.transactionId as string;

  const {
    connected,
    transaction,
    members,
    messages,
    sendMessage,
    updateTransaction
  } = useTransactionRealtime(transactionId);

  const [currentStagesetCurrentStage] = useState(0);
  const [milestonessetMilestones] = useState<Milestone[]>([]);
  const [activeTabsetActiveTab] = useState('overview');
  const [isLoadingsetIsLoading] = useState(true);

  useEffect(() => {
    fetchTransactionDetails();
  }, [transactionId]);

  const fetchTransactionDetails = async () => {
    try {
      const response = await fetch(`/api/transactions/${transactionId}`);
      const data: any = await response.json();

      setMilestones(data.milestones || []);
      setCurrentStage(getCurrentStage(data.status));
      setIsLoading(false);
    } catch (error) {

      setIsLoading(false);
    }
  };

  const getCurrentStage = (status: string): number => {
    const stageMap: Record<string, number> = {
      'INITIATED': 0,
      'RESERVED': 1,
      'KYC_IN_PROGRESS': 2,
      'MORTGAGE_APPLIED': 3,
      'CONTRACTS_ISSUED': 4,
      'CONTRACTS_EXCHANGED': 5,
      'COMPLETED': 6
    };
    return stageMap[status] || 0;
  };

  const handleMilestoneComplete = async (milestoneId: string) => {
    try {
      await fetch(`/api/transactions/${transactionId}/milestones/${milestoneId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' })
      });

      // Update will be received via realtime
    } catch (error) {

    }
  };

  const calculateProgress = () => {
    const completedMilestones = milestones.filter(m => m.status === 'completed').length;
    return (completedMilestones / milestones.length) * 100;
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>\n  );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Property Journey</h1>
        <div className="flex items-center gap-4">
          <Badge className={connected ? 'bg-green-500' : 'bg-gray-500'}>
            {connected ? 'Live Updates' : 'Connecting...'}
          </Badge>
          <span className="text-gray-600">Transaction ID: {transactionId}</span>
        </div>
      </div>

      {/* Progress Overview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={calculateProgress()} className="mb-4" />
          <div className="flex justify-between items-center">
            {stages.map((stageindex: any) => (
              <div
                key={stage.id}
                className={`flex flex-col items-center ${
                  index <= currentStage ? 'text-primary' : 'text-gray-400'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  index <currentStage ? 'bg-primary text-white' :
                  index === currentStage ? 'bg-primary/20 text-primary' :
                  'bg-gray-100'
                }`}>
                  {index <currentStage ? <CheckCircle /> : 
                   index === currentStage ? stage.icon : 
                   <Circle />}
                </div>
                <span className="text-xs text-center">{stage.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
              </CardHeader>
              <CardContent>
                {transaction?.unit && (
                  <div className="space-y-2">
                    <p><strong>Development:</strong> {transaction.unit.development.name}</p>
                    <p><strong>Unit:</strong> {transaction.unit.unitNumber}</p>
                    <p><strong>Type:</strong> {transaction.unit.type}</p>
                    <p><strong>Price:</strong> €{transaction.unit.price.toLocaleString()}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Next Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {milestones
                    .filter(m => m.status === 'pending' || m.status === 'in_progress')
                    .slice(0)
                    .map(milestone => (
                      <div key={milestone.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{milestone.name}</p>
                          <p className="text-sm text-gray-600">
                            Due: {milestone.dueDate ? format(new Date(milestone.dueDate), 'MMM dd, yyyy') : 'TBD'}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleMilestoneComplete(milestone.id)}
                          disabled={milestone.status === 'completed'}
                        >
                          {milestone.status === 'in_progress' ? 'In Progress' : 'Start'}
                        </Button>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Milestones Tab */}
        <TabsContent value="milestones">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Milestones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {milestones.map((milestone: any) => (
                  <div
                    key={milestone.id}
                    className="flex items-start gap-4 p-4 rounded-lg border"
                  >
                    <div className={`mt-1 ${
                      milestone.status === 'completed' ? 'text-green-500' :
                      milestone.status === 'in_progress' ? 'text-blue-500' :
                      milestone.status === 'failed' ? 'text-red-500' :
                      'text-gray-400'
                    }`}>
                      {milestone.status === 'completed' ? <CheckCircle /> :
                       milestone.status === 'in_progress' ? <Clock /> :
                       milestone.status === 'failed' ? <AlertCircle /> :
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
                      {milestone.status === 'completed' && milestone.completedAt && (
                        <p className="text-sm text-green-600 mt-1">
                          Completed: {format(new Date(milestone.completedAt), 'MMM dd, yyyy')}
                        </p>
                      )}
                    </div>
                    <div>
                      {milestone.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => handleMilestoneComplete(milestone.id)}
                        >
                          Start
                        </Button>
                      )}
                      {milestone.status === 'in_progress' && (
                        <Badge variant="outline">In Progress</Badge>
                      )}
                      {milestone.status === 'completed' && (
                        <Badge className="bg-green-500">Completed</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transaction?.documents?.map((doc: any) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-gray-600">{doc.type}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">View</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Messages Tab */}
        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
              <p className="text-sm text-gray-600">
                Real-time communication with your team
              </p>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] mb-4">
                <div className="space-y-4">
                  {messages.map((message: any, index: number) => (
                    <div key={index} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{message.userId}</span>
                          <span className="text-sm text-gray-500">
                            {format(new Date(message.timestamp), 'HH:mm')}
                          </span>
                        </div>
                        <p className="text-gray-700">{message.data.text}</p>
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
                  onKeyPress={(e: any) => {
                    if (e.key === 'Enter' && e.currentTarget.value) {
                      sendMessage(`transaction:${transactionId}`, {
                        text: e.currentTarget.value
                      });
                      e.currentTarget.value = '';
                    }
                  }
                />
                <Button>Send</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle>Your Transaction Team</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {members.map((member: any) => (
                  <div key={member.userId} className="flex items-center gap-3 p-4 border rounded-lg">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <Users className="h-6 w-6 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium">{member.metadata?.name || 'Unknown'}</p>
                      <p className="text-sm text-gray-600">{member.role}</p>
                      <Badge 
                        variant="outline" 
                        className={member.online ? 'text-green-600' : 'text-gray-500'}
                      >
                        {member.online ? 'Online' : 'Offline'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}