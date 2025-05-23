'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format, differenceInDays } from 'date-fns';
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  CurrencyEuroIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  UserGroupIcon,
  FolderOpenIcon,
  BellIcon,
  ArrowRightIcon,
  BuildingOfficeIcon,
  ShieldCheckIcon,
  DocumentDuplicateIcon,
  VideoCameraIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  BanknotesIcon,
  HomeIcon,
  FlagIcon
} from '@heroicons/react/24/outline';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface TimelineEvent {
  id: string;
  timestamp: Date;
  title: string;
  description: string;
  type: 'MILESTONE' | 'DOCUMENT' | 'COMMUNICATION' | 'PAYMENT' | 'ISSUE' | 'COMPLIANCE' | 'SYSTEM';
  severity: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  actor: string;
  actorRole?: string;
  actorImage?: string;
  metadata?: {
    documentId?: string;
    documentName?: string;
    amount?: number;
    currency?: string;
    participantId?: string;
    participantName?: string;
    issueId?: string;
    issuePriority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    milestoneId?: string;
    communicationType?: 'EMAIL' | 'PHONE' | 'VIDEO' | 'MEETING' | 'NOTE';
    relatedEvents?: string[];
    attachments?: string[];
    tags?: string[];
  };
  isEditable?: boolean;
  isImportant?: boolean;
}

interface TransactionTimelineProps {
  events: TimelineEvent[];
  onEventClick?: (event: TimelineEvent) => void;
  onAddEvent?: () => void;
}

const eventTypeConfig = {
  MILESTONE: {
    icon: FlagIcon,
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
    borderColor: 'border-blue-200'
  },
  DOCUMENT: {
    icon: DocumentTextIcon,
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600',
    borderColor: 'border-purple-200'
  },
  COMMUNICATION: {
    icon: ChatBubbleLeftRightIcon,
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600',
    borderColor: 'border-green-200'
  },
  PAYMENT: {
    icon: CurrencyEuroIcon,
    bgColor: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    borderColor: 'border-yellow-200'
  },
  ISSUE: {
    icon: ExclamationTriangleIcon,
    bgColor: 'bg-red-100',
    iconColor: 'text-red-600',
    borderColor: 'border-red-200'
  },
  COMPLIANCE: {
    icon: ShieldCheckIcon,
    bgColor: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
    borderColor: 'border-indigo-200'
  },
  SYSTEM: {
    icon: BellIcon,
    bgColor: 'bg-gray-100',
    iconColor: 'text-gray-600',
    borderColor: 'border-gray-200'
  }
};

const severityConfig = {
  INFO: { color: 'text-gray-600', bgColor: 'bg-gray-50', borderColor: 'border-gray-200' },
  WARNING: { color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
  ERROR: { color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
  SUCCESS: { color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' }
};

export default function TransactionTimeline({ events, onEventClick, onAddEvent }: TransactionTimelineProps) {
  const [filtersetFilter] = useState<string>('all');
  const [viewModesetViewMode] = useState<'timeline' | 'list' | 'grouped'>('timeline');
  const [expandedEventssetExpandedEvents] = useState<Set<string>>(new Set());

  const sortedEvents = [...events].sort((ab) => b.timestamp.getTime() - a.timestamp.getTime());

  const filteredEvents = sortedEvents.filter(event => {
    if (filter === 'all') return true;
    if (filter === 'important') return event.isImportant;
    return event.type === filter;
  });

  const groupedEvents = filteredEvents.reduce((accevent) => {
    const dateKey = format(event.timestamp, 'yyyy-MM-dd');
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(event);
    return acc;
  }, {} as Record<string, TimelineEvent[]>);

  const toggleEventExpansion = (eventId: string) => {
    const newExpanded = new Set(expandedEvents);
    if (newExpanded.has(eventId)) {
      newExpanded.delete(eventId);
    } else {
      newExpanded.add(eventId);
    }
    setExpandedEvents(newExpanded);
  };

  const getRelativeTime = (date: Date) => {
    const days = differenceInDays(new Date(), date);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days <7) return `${days} days ago`;
    return format(date, 'MMM dd, yyyy');
  };

  const renderTimelineEvent = (event: TimelineEvent, index: number) => {
    const config = eventTypeConfig[event.type];
    const severity = severityConfig[event.severity];
    const Icon = config.icon;
    const isExpanded = expandedEvents.has(event.id);

    return (
      <motion.div
        key={event.id}
        initial={ opacity: 0, x: -20 }
        animate={ opacity: 1, x: 0 }
        transition={ delay: index * 0.05 }
        className="relative flex items-start mb-8"
      >
        {/* Timeline line */}
        {index <filteredEvents.length - 1 && (
          <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-200" />
        )}

        {/* Event icon */}
        <div className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full ${config.bgColor} ${config.borderColor} border-2 flex items-center justify-center`}>
          <Icon className={`h-6 w-6 ${config.iconColor}`} />
          {event.severity === 'ERROR' && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full animate-pulse" />
          )}
        </div>

        {/* Event content */}
        <div className="ml-4 flex-1">
          <div 
            className={`p-4 rounded-lg ${severity.bgColor} ${severity.borderColor} border cursor-pointer hover:shadow-md transition-shadow`}
            onClick={() => {
              toggleEventExpansion(event.id);
              onEventClick?.(event);
            }
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-gray-900">{event.title}</h4>
                  {event.isImportant && (
                    <Badge variant="destructive" className="text-xs">Important</Badge>
                  )}
                  {event.metadata?.issuePriority && (
                    <Badge 
                      variant={event.metadata.issuePriority === 'CRITICAL' ? 'destructive' : 'warning'}
                      className="text-xs"
                    >
                      {event.metadata.issuePriority}
                    </Badge>
                  )}
                </div>

                <p className="text-sm text-gray-600 mb-2">{event.description}</p>

                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>{getRelativeTime(event.timestamp)}</span>
                  <span>{format(event.timestamp, 'HH:mm')}</span>
                  <div className="flex items-center gap-1">
                    <Avatar className="h-4 w-4">
                      <AvatarImage src={event.actorImage} />
                      <AvatarFallback>{event.actor.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{event.actor}</span>
                    {event.actorRole && <span>({event.actorRole})</span>}
                  </div>
                </div>

                {/* Metadata badges */}
                {event.metadata && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {event.metadata.documentName && (
                      <Badge variant="secondary" className="text-xs">
                        <DocumentTextIcon className="h-3 w-3 mr-1" />
                        {event.metadata.documentName}
                      </Badge>
                    )}
                    {event.metadata.amount && (
                      <Badge variant="secondary" className="text-xs">
                        <CurrencyEuroIcon className="h-3 w-3 mr-1" />
                        €{event.metadata.amount.toLocaleString()}
                      </Badge>
                    )}
                    {event.metadata.participantName && (
                      <Badge variant="secondary" className="text-xs">
                        <UserGroupIcon className="h-3 w-3 mr-1" />
                        {event.metadata.participantName}
                      </Badge>
                    )}
                    {event.metadata.communicationType && (
                      <Badge variant="secondary" className="text-xs">
                        {event.metadata.communicationType === 'EMAIL' && <EnvelopeIcon className="h-3 w-3 mr-1" />}
                        {event.metadata.communicationType === 'PHONE' && <PhoneIcon className="h-3 w-3 mr-1" />}
                        {event.metadata.communicationType === 'VIDEO' && <VideoCameraIcon className="h-3 w-3 mr-1" />}
                        {event.metadata.communicationType === 'MEETING' && <CalendarIcon className="h-3 w-3 mr-1" />}
                        {event.metadata.communicationType}
                      </Badge>
                    )}
                    {event.metadata.tags?.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Expanded content */}
                {isExpanded && event.metadata && (
                  <motion.div
                    initial={ opacity: 0, height: 0 }
                    animate={ opacity: 1, height: 'auto' }
                    exit={ opacity: 0, height: 0 }
                    className="mt-4 pt-4 border-t"
                  >
                    {event.metadata.attachments && event.metadata.attachments.length> 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">Attachments</p>
                        <div className="flex flex-wrap gap-2">
                          {event.metadata.attachments.map((attachmentidx) => (
                            <Button key={idx} variant="outline" size="sm">
                              <DocumentDuplicateIcon className="h-3 w-3 mr-1" />
                              Attachment {idx + 1}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {event.metadata.relatedEvents && event.metadata.relatedEvents.length> 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Related Events</p>
                        <div className="space-y-1">
                          {event.metadata.relatedEvents.map(relatedId => {
                            const relatedEvent = events.find(e => e.id === relatedId);
                            return relatedEvent ? (
                              <div key={relatedId} className="flex items-center gap-2 text-sm text-gray-600">
                                <ArrowRightIcon className="h-3 w-3" />
                                <span>{relatedEvent.title}</span>
                              </div>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>

              {event.isEditable && (
                <Button variant="ghost" size="sm" className="ml-2">
                  Edit
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Transaction Timeline</CardTitle>
            <CardDescription>Complete history of transaction events</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter events" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="important">Important Only</SelectItem>
                <SelectItem value="MILESTONE">Milestones</SelectItem>
                <SelectItem value="DOCUMENT">Documents</SelectItem>
                <SelectItem value="COMMUNICATION">Communications</SelectItem>
                <SelectItem value="PAYMENT">Payments</SelectItem>
                <SelectItem value="ISSUE">Issues</SelectItem>
                <SelectItem value="COMPLIANCE">Compliance</SelectItem>
              </SelectContent>
            </Select>

            <Select value={viewMode} onValueChange={setViewMode}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="View mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="timeline">Timeline</SelectItem>
                <SelectItem value="list">List</SelectItem>
                <SelectItem value="grouped">Grouped</SelectItem>
              </SelectContent>
            </Select>

            {onAddEvent && (
              <Button onClick={onAddEvent}>
                Add Event
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredEvents.length === 0 ? (
          <div className="text-center py-8">
            <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No events found</p>
          </div>
        ) : (
          <>
            {viewMode === 'timeline' && (
              <div className="relative">
                {filteredEvents.map((eventindex) => renderTimelineEvent(eventindex))}
              </div>
            )}

            {viewMode === 'list' && (
              <div className="space-y-4">
                {filteredEvents.map((eventindex) => (
                  <motion.div
                    key={event.id}
                    initial={ opacity: 0, y: 10 }
                    animate={ opacity: 1, y: 0 }
                    transition={ delay: index * 0.05 }
                    className={`p-4 rounded-lg border ${severityConfig[event.severity].bgColor} ${severityConfig[event.severity].borderColor}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${eventTypeConfig[event.type].bgColor}`}>
                        {React.createElement(eventTypeConfig[event.type].icon, {
                          className: `h-5 w-5 ${eventTypeConfig[event.type].iconColor}`
                        })}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold">{event.title}</h4>
                          <span className="text-sm text-gray-500">
                            {format(event.timestamp, 'MMM dd, HH:mm')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{event.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {viewMode === 'grouped' && (
              <div className="space-y-6">
                {Object.entries(groupedEvents).map(([datedayEvents]) => (
                  <div key={date}>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      {format(new Date(date), 'EEEE, MMMM dd, yyyy')}
                    </h3>
                    <div className="space-y-3">
                      {dayEvents.map((eventindex) => (
                        <motion.div
                          key={event.id}
                          initial={ opacity: 0, x: -10 }
                          animate={ opacity: 1, x: 0 }
                          transition={ delay: index * 0.05 }
                          className={`p-3 rounded-lg border ${severityConfig[event.severity].bgColor} ${severityConfig[event.severity].borderColor}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-1.5 rounded ${eventTypeConfig[event.type].bgColor}`}>
                              {React.createElement(eventTypeConfig[event.type].icon, {
                                className: `h-4 w-4 ${eventTypeConfig[event.type].iconColor}`
                              })}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{event.title}</span>
                                <span className="text-sm text-gray-500">
                                  {format(event.timestamp, 'HH:mm')}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">{event.description}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}