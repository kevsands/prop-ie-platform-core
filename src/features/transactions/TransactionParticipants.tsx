'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  UserIcon,
  UserGroupIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  EnvelopeIcon,
  VideoCameraIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  StarIcon,
  ShieldCheckIcon,
  InformationCircleIcon,
  ArrowRightIcon,
  PaperClipIcon,
  ArrowPathIcon,
  UserPlusIcon,
  XCircleIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { format, formatDistanceToNow } from 'date-fns';

interface Participant {
  id: string;
  name: string;
  role: 'BUYER' | 'SELLER' | 'BUYER_SOLICITOR' | 'SELLER_SOLICITOR' | 'AGENT' | 'MORTGAGE_BROKER' | 'SURVEYOR' | 'OTHER';
  email: string;
  phone: string;
  company?: string;
  status: 'ACTIVE' | 'PENDING' | 'COMPLETED' | 'REMOVED';
  completedActions: number;
  pendingActions: number;
  documents: number;
  lastActivity: Date;
  joinDate: Date;
  avatar?: string;
  bio?: string;
  specializations?: string[];
  rating?: number;
  reviews?: number;
  responseTime?: string;
  permissions: {
    viewDocuments: boolean;
    uploadDocuments: boolean;
    editDocuments: boolean;
    viewFinancials: boolean;
    communicate: boolean;
    makeDecisions: boolean;
  };
  tasks: ParticipantTask[];
  communications: Communication[];
  notifications: Notification[];
  availability?: {
    timezone: string;
    workingHours: {
      start: string;
      end: string;
    };
    daysOff: string[];
  };
  preferences?: {
    communicationMethod: 'EMAIL' | 'PHONE' | 'SMS' | 'IN_APP';
    notificationSettings: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
}

interface ParticipantTask {
  id: string;
  title: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate: Date;
  completedDate?: Date;
  type: 'DOCUMENT' | 'APPROVAL' | 'PAYMENT' | 'REVIEW' | 'SIGNATURE' | 'OTHER';
  relatedDocuments?: string[];
  blockedBy?: string[];
}

interface Communication {
  id: string;
  type: 'EMAIL' | 'PHONE' | 'VIDEO' | 'MEETING' | 'NOTE';
  subject: string;
  timestamp: Date;
  duration?: number;
  outcome?: string;
  followUpRequired: boolean;
  attachments?: string[];
}

interface Notification {
  id: string;
  type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionRequired: boolean;
  actionUrl?: string;
}

interface TransactionParticipants {
  buyer: Participant;
  seller: Participant;
  buyerSolicitor: Participant;
  sellerSolicitor: Participant;
  agent?: Participant;
  mortgageBroker?: Participant;
  surveyor?: Participant;
  others?: Participant[];
}

interface TransactionParticipantsProps {
  participants: TransactionParticipants;
  onUpdateParticipant?: (participant: Participant) => void;
  onInviteParticipant?: () => void;
}

const roleConfig = {
  BUYER: { icon: UserIcon, color: 'blue', label: 'Buyer' },
  SELLER: { icon: UserIcon, color: 'green', label: 'Seller' },
  BUYER_SOLICITOR: { icon: BriefcaseIcon, color: 'purple', label: 'Buyer\'s Solicitor' },
  SELLER_SOLICITOR: { icon: BriefcaseIcon, color: 'indigo', label: 'Seller\'s Solicitor' },
  AGENT: { icon: BuildingOfficeIcon, color: 'orange', label: 'Estate Agent' },
  MORTGAGE_BROKER: { icon: BriefcaseIcon, color: 'yellow', label: 'Mortgage Broker' },
  SURVEYOR: { icon: UserIcon, color: 'teal', label: 'Surveyor' },
  OTHER: { icon: UserIcon, color: 'gray', label: 'Other' }
};

const statusColors = {
  ACTIVE: 'green',
  PENDING: 'yellow',
  COMPLETED: 'blue',
  REMOVED: 'red'
};

export default function TransactionParticipants({ participants, onUpdateParticipant, onInviteParticipant }: TransactionParticipantsProps) {
  const [selectedParticipantsetSelectedParticipant] = useState<Participant | null>(null);
  const [viewModesetViewMode] = useState<'grid' | 'list'>('grid');
  const [filterRolesetFilterRole] = useState<string>('all');
  const [showCommunicationModalsetShowCommunicationModal] = useState(false);
  const [communicationTypesetCommunicationType] = useState<'EMAIL' | 'PHONE' | 'VIDEO' | 'MEETING'>('EMAIL');
  const [communicationSubjectsetCommunicationSubject] = useState('');
  const [communicationMessagesetCommunicationMessage] = useState('');

  const allParticipants = [
    participants.buyer,
    participants.seller,
    participants.buyerSolicitor,
    participants.sellerSolicitor,
    participants.agent,
    participants.mortgageBroker,
    participants.surveyor,
    ...(participants.others || [])
  ].filter(Boolean) as Participant[];

  const filteredParticipants = allParticipants.filter(participant => {
    if (filterRole === 'all') return true;
    return participant.role === filterRole;
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getStatusColor = (status: string) => {
    return statusColors[status as keyof typeof statusColors] || 'gray';
  };

  const handleCommunication = async (participant: Participant) => {
    // Handle communication
    toast.success(`${communicationType} sent to ${participant.name}`);
    setShowCommunicationModal(false);
    setCommunicationSubject('');
    setCommunicationMessage('');
  };

  const ParticipantCard = ({ participant }: { participant: Participant }) => {
    const config = roleConfig[participant.role];
    const Icon = config.icon;
    const taskProgress = participant.completedActions / (participant.completedActions + participant.pendingActions) * 100;

    return (
      <motion.div
        initial={ opacity: 0, y: 20 }
        animate={ opacity: 1, y: 0 }
        className="h-full"
      >
        <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedParticipant(participant)}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={participant.avatar} />
                  <AvatarFallback className={`bg-${config.color}-100 text-${config.color}-700`}>
                    {getInitials(participant.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{participant.name}</h3>
                  <p className="text-sm text-gray-600">{config.label}</p>
                  {participant.company && (
                    <p className="text-xs text-gray-500">{participant.company}</p>
                  )}
                </div>
              </div>
              <Badge variant={getStatusColor(participant.status) as any}>
                {participant.status}
              </Badge>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Task Progress</span>
                  <span className="font-medium">{Math.round(taskProgress)}%</span>
                </div>
                <Progress value={taskProgress} className="h-2" />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{participant.completedActions} completed</span>
                  <span>{participant.pendingActions} pending</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-600">Documents</p>
                  <p className="font-semibold flex items-center gap-1">
                    <DocumentTextIcon className="h-4 w-4" />
                    {participant.documents}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Last Active</p>
                  <p className="font-semibold">
                    {formatDistanceToNow(participant.lastActivity, { addSuffix: true })}
                  </p>
                </div>
              </div>

              {participant.rating && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_i: any) => (
                      <StarIcon
                        key={i}
                        className={`h-4 w-4 ${
                          i <Math.floor(participant.rating!) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {participant.rating.toFixed(1)} ({participant.reviews} reviews)
                  </span>
                </div>
              )}

              <div className="flex gap-2 pt-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    setSelectedParticipant(participant);
                    setShowCommunicationModal(true);
                  }
                >
                  <ChatBubbleLeftRightIcon className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    window.location.href = `tel:${participant.phone}`;
                  }
                >
                  <PhoneIcon className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    window.location.href = `mailto:${participant.email}`;
                  }
                >
                  <EnvelopeIcon className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    toast.success(`Video call scheduled with ${participant.name}`);
                  }
                >
                  <VideoCameraIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Transaction Participants</h2>
          <p className="text-gray-600">Manage and communicate with all parties involved</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {Object.entries(roleConfig).map(([keyconfig]) => (
                <SelectItem key={key} value={key}>
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? 'List View' : 'Grid View'}
          </Button>

          {onInviteParticipant && (
            <Button onClick={onInviteParticipant}>
              <UserPlusIcon className="h-4 w-4 mr-2" />
              Add Participant
            </Button>
          )}
        </div>
      </div>

      {/* Participant Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Participants</p>
                <p className="text-2xl font-bold">{allParticipants.length}</p>
              </div>
              <UserGroupIcon className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {allParticipants.filter(p => p.status === 'ACTIVE').length}
                </p>
              </div>
              <CheckCircleIcon className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tasks Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {allParticipants.reduce((sump: any) => sum + p.pendingActions0)}
                </p>
              </div>
              <ClockIcon className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Documents</p>
                <p className="text-2xl font-bold text-blue-600">
                  {allParticipants.reduce((sump: any) => sum + p.documents0)}
                </p>
              </div>
              <DocumentTextIcon className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Participants Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredParticipants.map(participant => (
            <ParticipantCard key={participant.id} participant={participant} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Participant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Active
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredParticipants.map(participant => {
                  const config = roleConfig[participant.role];
                  const taskProgress = participant.completedActions / (participant.completedActions + participant.pendingActions) * 100;

                  return (
                    <tr key={participant.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={participant.avatar} />
                            <AvatarFallback>{getInitials(participant.name)}</AvatarFallback>
                          </Avatar>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{participant.name}</div>
                            <div className="text-sm text-gray-500">{participant.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="outline">{config.label}</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={getStatusColor(participant.status) as any}>
                          {participant.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <Progress value={taskProgress} className="w-20 h-2" />
                          <span className="text-sm text-gray-600">{Math.round(taskProgress)}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDistanceToNow(participant.lastActivity, { addSuffix: true })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedParticipant(participant)}
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedParticipant(participant);
                              setShowCommunicationModal(true);
                            }
                          >
                            Contact
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Participant Details Modal */}
      {selectedParticipant && !showCommunicationModal && (
        <motion.div
          initial={ opacity: 0 }
          animate={ opacity: 1 }
          exit={ opacity: 0 }
          className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setSelectedParticipant(null)}
        >
          <motion.div
            initial={ scale: 0.95 }
            animate={ scale: 1 }
            exit={ scale: 0.95 }
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedParticipant.avatar} />
                    <AvatarFallback>{getInitials(selectedParticipant.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedParticipant.name}</h2>
                    <p className="text-gray-600">{roleConfig[selectedParticipant.role].label}</p>
                    {selectedParticipant.company && (
                      <p className="text-sm text-gray-500">{selectedParticipant.company}</p>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedParticipant(null)}
                >
                  <XCircleIcon className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="tasks">Tasks</TabsTrigger>
                  <TabsTrigger value="communications">Communications</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Contact Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-3">
                          <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                          <span>{selectedParticipant.email}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <PhoneIcon className="h-5 w-5 text-gray-400" />
                          <span>{selectedParticipant.phone}</span>
                        </div>
                        {selectedParticipant.responseTime && (
                          <div className="flex items-center gap-3">
                            <ClockIcon className="h-5 w-5 text-gray-400" />
                            <span>Responds in {selectedParticipant.responseTime}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Activity Summary</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Completed Tasks</span>
                          <span className="font-semibold">{selectedParticipant.completedActions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Pending Tasks</span>
                          <span className="font-semibold">{selectedParticipant.pendingActions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Documents</span>
                          <span className="font-semibold">{selectedParticipant.documents}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Last Active</span>
                          <span className="font-semibold">
                            {formatDistanceToNow(selectedParticipant.lastActivity, { addSuffix: true })}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {selectedParticipant.bio && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">About</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-700">{selectedParticipant.bio}</p>
                      </CardContent>
                    </Card>
                  )}

                  {selectedParticipant.specializations && selectedParticipant.specializations.length> 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Specializations</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {selectedParticipant.specializations.map((specindex: any) => (
                            <Badge key={index} variant="secondary">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="tasks" className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Assigned Tasks</h3>
                    <Badge variant="outline">
                      {selectedParticipant.tasks.filter(t => t.status === 'PENDING').length} Pending
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    {selectedParticipant.tasks.map(task => (
                      <Card key={task.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium">{task.title}</h4>
                                <Badge
                                  variant={
                                    task.priority === 'URGENT' ? 'destructive' :
                                    task.priority === 'HIGH' ? 'warning' :
                                    'secondary'
                                  }
                                  className="text-xs"
                                >
                                  {task.priority}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                              <div className="flex items-center gap-4 text-sm">
                                <span className={`${
                                  task.status === 'COMPLETED' ? 'text-green-600' :
                                  task.status === 'OVERDUE' ? 'text-red-600' :
                                  task.status === 'IN_PROGRESS' ? 'text-blue-600' :
                                  'text-gray-600'
                                }`}>
                                  {task.status}
                                </span>
                                <span className="text-gray-500">
                                  Due: {format(task.dueDate, 'MMM dd, yyyy')}
                                </span>
                                {task.relatedDocuments && task.relatedDocuments.length> 0 && (
                                  <span className="text-gray-500">
                                    <PaperClipIcon className="h-4 w-4 inline mr-1" />
                                    {task.relatedDocuments.length} documents
                                  </span>
                                )}
                              </div>
                            </div>
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="communications" className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Recent Communications</h3>
                    <Button
                      size="sm"
                      onClick={() => {
                        setShowCommunicationModal(true);
                      }
                    >
                      New Message
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {selectedParticipant.communications.map(comm => (
                      <Card key={comm.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                {comm.type === 'EMAIL' && <EnvelopeIcon className="h-4 w-4" />}
                                {comm.type === 'PHONE' && <PhoneIcon className="h-4 w-4" />}
                                {comm.type === 'VIDEO' && <VideoCameraIcon className="h-4 w-4" />}
                                {comm.type === 'MEETING' && <CalendarIcon className="h-4 w-4" />}
                                <h4 className="font-medium">{comm.subject}</h4>
                              </div>
                              <p className="text-sm text-gray-600">
                                {format(comm.timestamp, 'MMM dd, yyyy • HH:mm')}
                                {comm.duration && ` • ${comm.duration} minutes`}
                              </p>
                              {comm.outcome && (
                                <p className="text-sm text-gray-700 mt-2">{comm.outcome}</p>
                              )}
                              {comm.followUpRequired && (
                                <Badge variant="warning" className="mt-2">Follow-up Required</Badge>
                              )}
                            </div>
                            <Button size="sm" variant="ghost">
                              View
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="details" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Permissions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {Object.entries(selectedParticipant.permissions).map(([keyvalue]) => (
                          <div key={key} className="flex items-center justify-between">
                            <span className="text-sm capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <Badge variant={value ? 'success' : 'secondary'}>
                              {value ? 'Allowed' : 'Denied'}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {selectedParticipant.availability && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Availability</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-600">Timezone</p>
                            <p className="font-medium">{selectedParticipant.availability.timezone}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Working Hours</p>
                            <p className="font-medium">
                              {selectedParticipant.availability.workingHours.start} - {selectedParticipant.availability.workingHours.end}
                            </p>
                          </div>
                          {selectedParticipant.availability.daysOff.length> 0 && (
                            <div>
                              <p className="text-sm text-gray-600">Days Off</p>
                              <p className="font-medium">
                                {selectedParticipant.availability.daysOff.join(', ')}
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {selectedParticipant.preferences && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Communication Preferences</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-600">Preferred Method</p>
                            <p className="font-medium">{selectedParticipant.preferences.communicationMethod}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Notifications</p>
                            <div className="space-y-2 mt-1">
                              {Object.entries(selectedParticipant.preferences.notificationSettings).map(([keyvalue]) => (
                                <div key={key} className="flex items-center justify-between">
                                  <span className="text-sm capitalize">{key}</span>
                                  <span className={`text-sm ${value ? 'text-green-600' : 'text-gray-500'}`}>
                                    {value ? 'Enabled' : 'Disabled'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Communication Modal */}
      {showCommunicationModal && selectedParticipant && (
        <motion.div
          initial={ opacity: 0 }
          animate={ opacity: 1 }
          exit={ opacity: 0 }
          className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setShowCommunicationModal(false)}
        >
          <motion.div
            initial={ scale: 0.95 }
            animate={ scale: 1 }
            exit={ scale: 0.95 }
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Contact {selectedParticipant.name}</h2>
                <Button
                  variant="ghost"
                  onClick={() => setShowCommunicationModal(false)}
                >
                  <XCircleIcon className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <Label>Communication Type</Label>
                  <Select
                    value={communicationType}
                    onValueChange={(value: any) => setCommunicationType(value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EMAIL">Email</SelectItem>
                      <SelectItem value="PHONE">Phone Call</SelectItem>
                      <SelectItem value="VIDEO">Video Call</SelectItem>
                      <SelectItem value="MEETING">Meeting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Subject</Label>
                  <Input
                    value={communicationSubject}
                    onChange={(e: React.MouseEvent) => setCommunicationSubject(e.target.value)}
                    placeholder="Enter subject..."
                  />
                </div>

                <div>
                  <Label>Message</Label>
                  <Textarea
                    value={communicationMessage}
                    onChange={(e: React.MouseEvent) => setCommunicationMessage(e.target.value)}
                    placeholder="Enter your message..."
                    rows={6}
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowCommunicationModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleCommunication(selectedParticipant)}
                    disabled={!communicationSubject || !communicationMessage}
                  >
                    Send {communicationType}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}