'use client';

/**
 * Shared Transaction Timeline Component
 * 
 * Provides cross-persona coordination by visualizing the complete transaction
 * journey with handoffs, dependencies, and collaborative tasks across all
 * stakeholders (Buyer, Developer, Estate Agent, Solicitor).
 */

import React, { useState, useEffect, useMemo } from 'react';
import { UserRole } from '@prisma/client';
import {
  Task,
  TaskStatus,
  TaskPriority,
  TaskCategory,
  TaskOrchestrationContext
} from '@/types/task/universal-task';

// UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Icons
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  ArrowDown,
  Users,
  Calendar,
  Home,
  Briefcase,
  Scale,
  Building,
  HandHelping,
  Zap,
  MessageSquare,
  Phone,
  Video
} from 'lucide-react';

/**
 * Timeline phase representing major transaction stages
 */
interface TimelinePhase {
  id: string;
  title: string;
  description: string;
  primaryPersona: UserRole;
  collaboratingPersonas: UserRole[];
  estimatedDuration: number; // days
  startDate?: Date;
  endDate?: Date;
  status: 'not_started' | 'in_progress' | 'completed' | 'delayed';
  progress: number; // 0-100
  tasks: Task[];
  keyMilestones: string[];
  handoffPoints: HandoffPoint[];
}

/**
 * Handoff point between personas
 */
interface HandoffPoint {
  id: string;
  fromPersona: UserRole;
  toPersona: UserRole;
  title: string;
  description: string;
  requiredActions: string[];
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  scheduledDate?: Date;
  completedDate?: Date;
  isBottleneck: boolean;
}

/**
 * Communication event between personas
 */
interface CommunicationEvent {
  id: string;
  type: 'message' | 'call' | 'meeting' | 'document_shared' | 'approval_request';
  participants: UserRole[];
  title: string;
  timestamp: Date;
  isUrgent: boolean;
  relatedTaskId?: string;
}

/**
 * Component props
 */
interface SharedTransactionTimelineProps {
  transactionId: string;
  tasks: Task[];
  currentUser: TaskOrchestrationContext;
  onTaskClick?: (task: Task) => void;
  onHandoffClick?: (handoff: HandoffPoint) => void;
  onCommunicationClick?: (event: CommunicationEvent) => void;
  showAllPersonas?: boolean;
  compactView?: boolean;
}

/**
 * Main SharedTransactionTimeline Component
 */
export default function SharedTransactionTimeline({
  transactionId,
  tasks,
  currentUser,
  onTaskClick,
  onHandoffClick,
  onCommunicationClick,
  showAllPersonas = true,
  compactView = false
}: SharedTransactionTimelineProps) {
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);
  const [showCommunications, setShowCommunications] = useState(false);

  // Generate timeline phases based on transaction tasks
  const timelinePhases = useMemo(() => {
    return generateTimelinePhases(tasks);
  }, [tasks]);

  // Generate handoff points
  const handoffPoints = useMemo(() => {
    return generateHandoffPoints(tasks, timelinePhases);
  }, [tasks, timelinePhases]);

  // Generate communication events
  const communicationEvents = useMemo(() => {
    return generateCommunicationEvents(tasks);
  }, [tasks]);

  // Calculate overall transaction progress
  const overallProgress = useMemo(() => {
    const completedPhases = timelinePhases.filter(phase => phase.status === 'completed').length;
    return (completedPhases / timelinePhases.length) * 100;
  }, [timelinePhases]);

  // Get current phase
  const currentPhase = useMemo(() => {
    return timelinePhases.find(phase => phase.status === 'in_progress') || timelinePhases[0];
  }, [timelinePhases]);

  // Get persona avatar and color
  const getPersonaInfo = (persona: UserRole) => {
    const personaConfig = {
      [UserRole.BUYER]: {
        icon: Home,
        color: 'bg-blue-500',
        name: 'Buyer',
        avatar: '🏠'
      },
      [UserRole.DEVELOPER]: {
        icon: Building,
        color: 'bg-purple-500',
        name: 'Developer',
        avatar: '🏗️'
      },
      [UserRole.AGENT]: {
        icon: Briefcase,
        color: 'bg-green-500',
        name: 'Agent',
        avatar: '🤝'
      },
      [UserRole.SOLICITOR]: {
        icon: Scale,
        color: 'bg-red-500',
        name: 'Solicitor',
        avatar: '⚖️'
      },
      [UserRole.ADMIN]: {
        icon: Users,
        color: 'bg-gray-500',
        name: 'Admin',
        avatar: '👤'
      }
    };
    return personaConfig[persona] || personaConfig[UserRole.BUYER];
  };

  // Get status icon and color
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'delayed':
      case 'blocked':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="shared-transaction-timeline w-full">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Transaction Timeline</h2>
            <p className="text-gray-600">Track progress across all stakeholders</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={showCommunications ? "default" : "outline"}
              size="sm"
              onClick={() => setShowCommunications(!showCommunications)}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Communications
            </Button>
          </div>
        </div>

        {/* Overall Progress */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Transaction Progress</span>
              <span className="text-sm text-gray-600">{Math.round(overallProgress)}% complete</span>
            </div>
            <Progress value={overallProgress} className="mb-3" />
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Current Phase: {currentPhase?.title || 'Not Started'}</span>
              <span>{timelinePhases.filter(p => p.status === 'completed').length} of {timelinePhases.length} phases complete</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timeline Visualization */}
      <div className="relative">
        {/* Vertical Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

        {/* Timeline Phases */}
        <div className="space-y-8">
          {timelinePhases.map((phase, index) => (
            <div key={phase.id} className="relative">
              {/* Phase Indicator */}
              <div className={`absolute left-6 w-4 h-4 rounded-full border-2 border-white ${
                phase.status === 'completed' ? 'bg-green-500' :
                phase.status === 'in_progress' ? 'bg-blue-500' :
                phase.status === 'delayed' ? 'bg-red-500' :
                'bg-gray-300'
              }`}></div>

              {/* Phase Content */}
              <div className="ml-16">
                <Card className={`transition-all ${
                  selectedPhase === phase.id ? 'ring-2 ring-blue-500' : ''
                }`}>
                  <CardHeader
                    className="cursor-pointer"
                    onClick={() => setSelectedPhase(selectedPhase === phase.id ? null : phase.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(phase.status)}
                          <CardTitle className="text-lg">{phase.title}</CardTitle>
                        </div>
                        <Badge variant="outline">
                          {phase.estimatedDuration} days
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">{Math.round(phase.progress)}%</div>
                        <div className="text-sm text-gray-600">{phase.tasks.length} tasks</div>
                      </div>
                    </div>
                    <CardDescription>{phase.description}</CardDescription>
                    <Progress value={phase.progress} className="mt-2" />
                  </CardHeader>

                  {selectedPhase === phase.id && (
                    <CardContent className="pt-0">
                      <Separator className="mb-4" />
                      
                      {/* Personas Involved */}
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Stakeholders</h4>
                        <div className="flex items-center space-x-2">
                          {/* Primary Persona */}
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <div className={`w-8 h-8 rounded-full ${getPersonaInfo(phase.primaryPersona).color} flex items-center justify-center text-white text-sm font-bold ring-2 ring-white`}>
                                  {getPersonaInfo(phase.primaryPersona).avatar}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Primary: {getPersonaInfo(phase.primaryPersona).name}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <ArrowRight className="h-4 w-4 text-gray-400" />

                          {/* Collaborating Personas */}
                          {phase.collaboratingPersonas.map(persona => (
                            <TooltipProvider key={persona}>
                              <Tooltip>
                                <TooltipTrigger>
                                  <div className={`w-8 h-8 rounded-full ${getPersonaInfo(persona).color} flex items-center justify-center text-white text-sm font-bold opacity-75`}>
                                    {getPersonaInfo(persona).avatar}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Collaborating: {getPersonaInfo(persona).name}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ))}
                        </div>
                      </div>

                      {/* Key Tasks */}
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Key Tasks</h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {phase.tasks.slice(0, 5).map(task => (
                            <div
                              key={task.id}
                              className="flex items-center justify-between p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
                              onClick={() => onTaskClick?.(task)}
                            >
                              <div className="flex items-center space-x-2">
                                {getStatusIcon(task.status)}
                                <span className="text-sm font-medium">{task.title}</span>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {getPersonaInfo(task.assignedRole || UserRole.BUYER).name}
                              </Badge>
                            </div>
                          ))}
                          {phase.tasks.length > 5 && (
                            <p className="text-sm text-gray-600 text-center">
                              +{phase.tasks.length - 5} more tasks
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Handoff Points */}
                      {phase.handoffPoints.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-900 mb-2">Key Handoffs</h4>
                          <div className="space-y-2">
                            {phase.handoffPoints.map(handoff => (
                              <div
                                key={handoff.id}
                                className={`flex items-center justify-between p-2 rounded border cursor-pointer ${
                                  handoff.isBottleneck ? 'border-red-200 bg-red-50' :
                                  handoff.status === 'completed' ? 'border-green-200 bg-green-50' :
                                  'border-gray-200 bg-gray-50'
                                }`}
                                onClick={() => onHandoffClick?.(handoff)}
                              >
                                <div className="flex items-center space-x-2">
                                  <div className="flex items-center space-x-1">
                                    <div className={`w-6 h-6 rounded-full ${getPersonaInfo(handoff.fromPersona).color} flex items-center justify-center text-white text-xs`}>
                                      {getPersonaInfo(handoff.fromPersona).avatar}
                                    </div>
                                    <ArrowRight className="h-3 w-3 text-gray-400" />
                                    <div className={`w-6 h-6 rounded-full ${getPersonaInfo(handoff.toPersona).color} flex items-center justify-center text-white text-xs`}>
                                      {getPersonaInfo(handoff.toPersona).avatar}
                                    </div>
                                  </div>
                                  <span className="text-sm font-medium">{handoff.title}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {handoff.isBottleneck && (
                                    <AlertTriangle className="h-4 w-4 text-red-500" />
                                  )}
                                  {getStatusIcon(handoff.status)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Timeline */}
                      {(phase.startDate || phase.endDate) && (
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          {phase.startDate && (
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>Started: {phase.startDate.toLocaleDateString()}</span>
                            </div>
                          )}
                          {phase.endDate && (
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>Due: {phase.endDate.toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              </div>

              {/* Connection Line to Next Phase */}
              {index < timelinePhases.length - 1 && (
                <div className="absolute left-8 mt-4 w-0.5 h-8 bg-gray-200"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Communications Panel */}
      {showCommunications && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Recent Communications</CardTitle>
            <CardDescription>Messages and interactions between stakeholders</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {communicationEvents.slice(0, 10).map(event => (
                  <div
                    key={event.id}
                    className={`flex items-start space-x-3 p-3 rounded cursor-pointer hover:bg-gray-50 ${
                      event.isUrgent ? 'border-l-4 border-l-red-500' : ''
                    }`}
                    onClick={() => onCommunicationClick?.(event)}
                  >
                    <div className="flex-shrink-0">
                      {event.type === 'call' && <Phone className="h-4 w-4 text-blue-500" />}
                      {event.type === 'meeting' && <Video className="h-4 w-4 text-green-500" />}
                      {event.type === 'message' && <MessageSquare className="h-4 w-4 text-purple-500" />}
                      {event.type === 'document_shared' && <Briefcase className="h-4 w-4 text-orange-500" />}
                      {event.type === 'approval_request' && <CheckCircle2 className="h-4 w-4 text-red-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{event.title}</p>
                        <div className="flex items-center space-x-1">
                          {event.participants.map(persona => (
                            <div
                              key={persona}
                              className={`w-4 h-4 rounded-full ${getPersonaInfo(persona).color} text-xs flex items-center justify-center text-white`}
                            >
                              {getPersonaInfo(persona).avatar}
                            </div>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-600">{event.timestamp.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Bottleneck Alerts */}
      {handoffPoints.some(h => h.isBottleneck) && (
        <Card className="mt-6 border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-lg text-red-800 flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Attention Required</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {handoffPoints.filter(h => h.isBottleneck).map(handoff => (
                <div key={handoff.id} className="flex items-center justify-between p-2 bg-white rounded border border-red-200">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <div className={`w-6 h-6 rounded-full ${getPersonaInfo(handoff.fromPersona).color} flex items-center justify-center text-white text-xs`}>
                        {getPersonaInfo(handoff.fromPersona).avatar}
                      </div>
                      <ArrowRight className="h-3 w-3 text-gray-400" />
                      <div className={`w-6 h-6 rounded-full ${getPersonaInfo(handoff.toPersona).color} flex items-center justify-center text-white text-xs`}>
                        {getPersonaInfo(handoff.toPersona).avatar}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-red-800">{handoff.title}</p>
                      <p className="text-xs text-red-600">{handoff.description}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => onHandoffClick?.(handoff)}>
                    Resolve
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/**
 * Helper Functions
 */

function generateTimelinePhases(tasks: Task[]): TimelinePhase[] {
  // This would typically be configured based on Irish property transaction stages
  const standardPhases: Omit<TimelinePhase, 'tasks' | 'progress' | 'status' | 'handoffPoints'>[] = [
    {
      id: 'planning',
      title: 'Planning & Preparation',
      description: 'Initial planning, budget setting, and requirement gathering',
      primaryPersona: UserRole.BUYER,
      collaboratingPersonas: [UserRole.AGENT],
      estimatedDuration: 14,
      keyMilestones: ['Budget Approved', 'Requirements Defined', 'Agent Selected']
    },
    {
      id: 'searching',
      title: 'Property Search',
      description: 'Active property search, viewings, and selection',
      primaryPersona: UserRole.AGENT,
      collaboratingPersonas: [UserRole.BUYER, UserRole.DEVELOPER],
      estimatedDuration: 30,
      keyMilestones: ['Properties Shortlisted', 'Viewings Completed', 'Property Selected']
    },
    {
      id: 'legal_financial',
      title: 'Legal & Financial Due Diligence',
      description: 'Mortgage approval, legal searches, and contract preparation',
      primaryPersona: UserRole.SOLICITOR,
      collaboratingPersonas: [UserRole.BUYER, UserRole.AGENT],
      estimatedDuration: 28,
      keyMilestones: ['Mortgage Approved', 'Searches Complete', 'Contract Ready']
    },
    {
      id: 'exchange',
      title: 'Contract Exchange',
      description: 'Final negotiations, contract exchange, and deposit payment',
      primaryPersona: UserRole.SOLICITOR,
      collaboratingPersonas: [UserRole.BUYER, UserRole.AGENT, UserRole.DEVELOPER],
      estimatedDuration: 7,
      keyMilestones: ['Terms Agreed', 'Contracts Exchanged', 'Deposit Paid']
    },
    {
      id: 'completion',
      title: 'Completion & Handover',
      description: 'Final completion, key handover, and move-in',
      primaryPersona: UserRole.SOLICITOR,
      collaboratingPersonas: [UserRole.BUYER, UserRole.DEVELOPER],
      estimatedDuration: 14,
      keyMilestones: ['Final Payment', 'Keys Collected', 'Move-in Complete']
    }
  ];

  return standardPhases.map(phase => {
    const phaseTasks = tasks.filter(task => {
      // Map task categories to phases (simplified logic)
      if (phase.id === 'planning') {
        return task.category.includes('PLANNING') || task.category.includes('FINANCING');
      }
      if (phase.id === 'searching') {
        return task.category.includes('SEARCHING') || task.category.includes('MARKETING');
      }
      if (phase.id === 'legal_financial') {
        return task.category.includes('LEGAL') || task.category.includes('DUE_DILIGENCE');
      }
      if (phase.id === 'exchange') {
        return task.category.includes('CONTRACTS') || task.category.includes('NEGOTIATIONS');
      }
      if (phase.id === 'completion') {
        return task.category.includes('COMPLETION');
      }
      return false;
    });

    const completedTasks = phaseTasks.filter(task => task.status === TaskStatus.COMPLETED);
    const progress = phaseTasks.length > 0 ? (completedTasks.length / phaseTasks.length) * 100 : 0;

    let status: TimelinePhase['status'] = 'not_started';
    if (progress === 100) {
      status = 'completed';
    } else if (progress > 0) {
      const hasDelayedTasks = phaseTasks.some(task => 
        task.dueDate && task.dueDate < new Date() && task.status !== TaskStatus.COMPLETED
      );
      status = hasDelayedTasks ? 'delayed' : 'in_progress';
    }

    return {
      ...phase,
      tasks: phaseTasks,
      progress,
      status,
      handoffPoints: []
    };
  });
}

function generateHandoffPoints(tasks: Task[], phases: TimelinePhase[]): HandoffPoint[] {
  const handoffs: HandoffPoint[] = [
    {
      id: 'buyer_to_agent',
      fromPersona: UserRole.BUYER,
      toPersona: UserRole.AGENT,
      title: 'Requirements Handoff',
      description: 'Transfer buyer requirements and budget to estate agent',
      requiredActions: ['Requirements document', 'Budget confirmation', 'Contact details'],
      status: 'completed',
      isBottleneck: false
    },
    {
      id: 'agent_to_solicitor',
      fromPersona: UserRole.AGENT,
      toPersona: UserRole.SOLICITOR,
      title: 'Property Selection Handoff',
      description: 'Transfer selected property details to solicitor for legal work',
      requiredActions: ['Property details', 'Sale agreement', 'Vendor solicitor details'],
      status: 'in_progress',
      isBottleneck: false
    },
    {
      id: 'solicitor_to_buyer',
      fromPersona: UserRole.SOLICITOR,
      toPersona: UserRole.BUYER,
      title: 'Legal Completion',
      description: 'Complete legal processes and hand over property to buyer',
      requiredActions: ['Final searches', 'Mortgage drawdown', 'Key collection'],
      status: 'pending',
      isBottleneck: true
    }
  ];

  // Add handoff points to relevant phases
  phases.forEach(phase => {
    phase.handoffPoints = handoffs.filter(handoff => {
      // Simplified logic to assign handoffs to phases
      if (phase.id === 'planning') return handoff.id === 'buyer_to_agent';
      if (phase.id === 'legal_financial') return handoff.id === 'agent_to_solicitor';
      if (phase.id === 'completion') return handoff.id === 'solicitor_to_buyer';
      return false;
    });
  });

  return handoffs;
}

function generateCommunicationEvents(tasks: Task[]): CommunicationEvent[] {
  // Generate sample communication events
  const events: CommunicationEvent[] = [
    {
      id: 'comm_1',
      type: 'message',
      participants: [UserRole.BUYER, UserRole.AGENT],
      title: 'Property viewing feedback shared',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      isUrgent: false
    },
    {
      id: 'comm_2',
      type: 'call',
      participants: [UserRole.AGENT, UserRole.SOLICITOR],
      title: 'Contract terms discussion',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      isUrgent: false
    },
    {
      id: 'comm_3',
      type: 'approval_request',
      participants: [UserRole.SOLICITOR, UserRole.BUYER],
      title: 'Contract exchange approval needed',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      isUrgent: true
    },
    {
      id: 'comm_4',
      type: 'document_shared',
      participants: [UserRole.DEVELOPER, UserRole.BUYER],
      title: 'Property inspection report uploaded',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      isUrgent: false
    }
  ];

  return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}