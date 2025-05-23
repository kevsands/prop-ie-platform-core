'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  User,
  Search,
  Calendar,
  FileText,
  CreditCard,
  Home,
  Palette,
  Check,
  Clock,
  AlertCircle,
  ChevronRight,
  Upload,
  Download,
  MessageSquare,
  Bell,
  Shield
} from 'lucide-react';

// Define the complete buyer journey stages
const journeyStages = [
  {
    id: 'browse',
    title: 'Browse Homes',
    status: 'completed',
    description: 'Search and explore available properties',
    tasks: [
      { name: 'View developments', completed: true },
      { name: 'Filter by preferences', completed: true },
      { name: 'Save favorites', completed: true }
    ]
  },
  {
    id: 'register',
    title: 'Register Interest',
    status: 'completed',
    description: 'Create account and submit initial interest',
    tasks: [
      { name: 'Create account', completed: true },
      { name: 'Complete profile', completed: true },
      { name: 'Verify email', completed: true }
    ]
  },
  {
    id: 'kyc',
    title: 'KYC/AML Verification',
    status: 'completed',
    description: 'Complete identity and financial verification',
    tasks: [
      { name: 'Upload ID documents', completed: true },
      { name: 'Proof of address', completed: true },
      { name: 'Source of funds', completed: true },
      { name: 'AML clearance', completed: true }
    ]
  },
  {
    id: 'viewing',
    title: 'Property Viewing',
    status: 'completed',
    description: 'Schedule and attend property viewing',
    tasks: [
      { name: 'Book viewing slot', completed: true },
      { name: 'Attend viewing', completed: true },
      { name: 'Receive information pack', completed: true }
    ]
  },
  {
    id: 'reservation',
    title: 'Reservation',
    status: 'in_progress',
    description: 'Reserve your chosen unit',
    tasks: [
      { name: 'Choose specific unit', completed: true },
      { name: 'Pay reservation fee (€500)', completed: true },
      { name: 'Sign reservation agreement', completed: false },
      { name: 'Receive booking confirmation', completed: false }
    ]
  },
  {
    id: 'mortgage',
    title: 'Mortgage Approval',
    status: 'pending',
    description: 'Secure mortgage approval in principle',
    tasks: [
      { name: 'Submit mortgage application', completed: false },
      { name: 'Property valuation', completed: false },
      { name: 'Approval in principle', completed: false }
    ]
  },
  {
    id: 'htb',
    title: 'Help to Buy',
    status: 'pending',
    description: 'Apply for HTB scheme if eligible',
    tasks: [
      { name: 'Check HTB eligibility', completed: false },
      { name: 'Submit HTB application', completed: false },
      { name: 'Upload claim codes', completed: false },
      { name: 'HTB approval', completed: false }
    ]
  },
  {
    id: 'contracts',
    title: 'Exchange Contracts',
    status: 'pending',
    description: 'Legal contract exchange',
    tasks: [
      { name: 'Appoint solicitor', completed: false },
      { name: 'Review contracts', completed: false },
      { name: 'Pay deposit (10%)', completed: false },
      { name: 'Sign contracts', completed: false }
    ]
  },
  {
    id: 'customization',
    title: 'Prop Choice',
    status: 'pending',
    description: 'Customize your new home',
    tasks: [
      { name: 'Select finishes', completed: false },
      { name: 'Choose upgrades', completed: false },
      { name: 'Approve variations', completed: false },
      { name: 'Sign off BOQ changes', completed: false }
    ]
  },
  {
    id: 'completion',
    title: 'Completion',
    status: 'pending',
    description: 'Final inspection and handover',
    tasks: [
      { name: 'Pre-completion inspection', completed: false },
      { name: 'Snag list', completed: false },
      { name: 'Final payment', completed: false },
      { name: 'Key handover', completed: false }
    ]
  }
];

export default function BuyerJourneyPage() {
  const [activeStagesetActiveStage] = useState('reservation');
  const currentStage = journeyStages.find(stage => stage.id === activeStage);

  // Calculate overall progress
  const completedStages = journeyStages.filter(stage => stage.status === 'completed').length;
  const totalStages = journeyStages.length;
  const overallProgress = (completedStages / totalStages) * 100;

  // Mock buyer data
  const buyer = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+353 86 123 4567',
    property: {
      development: 'Fitzgerald Gardens',
      unit: 'Block A - Unit 23',
      type: '2 Bed Apartment',
      price: '€385,000'
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Home Buying Journey</h1>
          <p className="text-muted-foreground mt-2">
            Track your progress and manage your property purchase
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <MessageSquare className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Buyer Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Your Property Purchase</CardTitle>
          <CardDescription>Property details and buyer information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Buyer Details</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{buyer.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>{buyer.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-sm">KYC Verified</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Property Details</h3>
              <div className="space-y-2">
                <p className="font-medium">{buyer.property.development}</p>
                <p>{buyer.property.unit}</p>
                <p>{buyer.property.type}</p>
                <p className="text-lg font-bold">{buyer.property.price}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
          <CardDescription>
            {completedStages} of {totalStages} stages completed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={overallProgress} className="h-3" />
          <p className="text-sm text-muted-foreground mt-2">
            Currently at: {currentStage?.title}
          </p>
        </CardContent>
      </Card>

      {/* Journey Stages */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stage Timeline */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Journey Stages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {journeyStages.map((stageindex) => (
                  <div
                    key={stage.id}
                    className={`flex items-center gap-4 cursor-pointer p-3 rounded-lg transition-colors ${
                      activeStage === stage.id ? 'bg-primary/10' : 'hover:bg-muted'
                    }`}
                    onClick={() => setActiveStage(stage.id)}
                  >
                    <div className="relative">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        stage.status === 'completed' ? 'bg-green-600 text-white' :
                        stage.status === 'in_progress' ? 'bg-blue-600 text-white' :
                        'bg-gray-200'
                      }`}>
                        {stage.status === 'completed' ? (
                          <Check className="h-5 w-5" />
                        ) : stage.status === 'in_progress' ? (
                          <Clock className="h-5 w-5" />
                        ) : (
                          <span className="text-sm">{index + 1}</span>
                        )}
                      </div>
                      {index <journeyStages.length - 1 && (
                        <div className={`absolute top-10 left-5 w-0.5 h-16 ${
                          journeyStages[index + 1].status !== 'pending' ? 'bg-green-600' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{stage.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {stage.description}
                      </p>
                    </div>
                    {stage.status === 'in_progress' && (
                      <Badge variant="default" className="ml-auto">
                        Active
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stage Details */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{currentStage?.title}</CardTitle>
              <CardDescription>{currentStage?.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="tasks" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="tasks">Tasks</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="messages">Messages</TabsTrigger>
                </TabsList>

                <TabsContent value="tasks" className="space-y-4">
                  <div className="space-y-4">
                    {currentStage?.tasks.map((taskindex) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            task.completed ? 'bg-green-600 text-white' : 'border-2 border-gray-300'
                          }`}>
                            {task.completed && <Check className="h-4 w-4" />}
                          </div>
                          <span className={task.completed ? 'line-through text-muted-foreground' : ''}>
                            {task.name}
                          </span>
                        </div>
                        {!task.completed && (
                          <Button size="sm">
                            Complete
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  {activeStage === 'reservation' && !currentStage?.tasks[2].completed && (
                    <Card className="bg-blue-50 border-blue-200">
                      <CardHeader>
                        <CardTitle className="text-lg">Next Step: Sign Reservation Agreement</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-4">Your reservation fee has been received. Please review and sign the reservation agreement to secure your unit.</p>
                        <div className="flex gap-4">
                          <Button>
                            Review Agreement
                          </Button>
                          <Button variant="outline">
                            Contact Support
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="documents" className="space-y-4">
                  <div className="space-y-4">
                    <div className="grid gap-4">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">Required Documents</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                <span>Reservation Agreement</span>
                              </div>
                              <Button size="sm" variant="outline">
                                <Upload className="h-4 w-4 mr-2" />
                                Upload
                              </Button>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                <span>Proof of Deposit</span>
                              </div>
                              <Badge variant="success">Uploaded</Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">Available Downloads</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                <span>Property Brochure</span>
                              </div>
                              <Button size="sm" variant="outline">
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </Button>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                <span>Floor Plans</span>
                              </div>
                              <Button size="sm" variant="outline">
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="messages" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Recent Messages</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold">Sales Team</span>
                              <span className="text-sm text-muted-foreground">2 hours ago</span>
                            </div>
                            <p className="text-sm">Your reservation has been confirmed. Please proceed with signing the agreement.</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                            <Check className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold">System</span>
                              <span className="text-sm text-muted-foreground">Yesterday</span>
                            </div>
                            <p className="text-sm">Payment of €500 received for unit reservation.</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Milestones</CardTitle>
              <CardDescription>Important dates and deadlines</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-semibold">Contract Exchange Deadline</p>
                      <p className="text-sm text-muted-foreground">March 15, 2024</p>
                    </div>
                  </div>
                  <Badge>In 6 weeks</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Palette className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-semibold">Prop Choice Selection Window</p>
                      <p className="text-sm text-muted-foreground">April 1 - April 30, 2024</p>
                    </div>
                  </div>
                  <Badge variant="outline">Upcoming</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Home className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-semibold">Expected Completion</p>
                      <p className="text-sm text-muted-foreground">October 2024</p>
                    </div>
                  </div>
                  <Badge variant="outline">Q4 2024</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}