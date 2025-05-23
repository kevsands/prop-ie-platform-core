'use client';

import React, { useState } from 'react';
import { 
  CalendarClock, 
  MapPin, 
  Milestone, 
  Calendar, 
  PlusCircle, 
  Clock, 
  Check, 
  AlertCircle, 
  Info
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, addMonths, isAfter, parseISO, isBefore } from 'date-fns';

interface JourneyTimeline {
  startDate: Date;
  milestones: Milestone[];
  targetMoveInDate?: Date;
}

interface Milestone {
  id: string;
  title: string;
  description?: string;
  date: Date;
  completed: boolean;
  type: 'financial' | 'property' | 'legal' | 'personal';
}

interface JourneyPlannerProps {
  onTimelineChange?: (timeline: JourneyTimeline) => void;
  initialTimeline?: JourneyTimeline;
}

export default function JourneyPlanner({ 
  onTimelineChange, 
  initialTimeline 
}: JourneyPlannerProps) {
  const today = new Date();
  
  // Initialize with default or provided timeline
  const defaultTimeline: JourneyTimeline = {
    startDate: today,
    milestones: [
      {
        id: '1',
        title: 'Start Saving for Deposit',
        description: 'Begin setting aside funds for your deposit',
        date: today,
        completed: true,
        type: 'financial'
      },
      {
        id: '2',
        title: 'Mortgage Approval in Principle',
        description: 'Apply for mortgage approval in principle with your bank',
        date: addMonths(today, 1),
        completed: false,
        type: 'financial'
      },
      {
        id: '3',
        title: 'Property Viewings',
        description: 'Start viewing properties that meet your criteria',
        date: addMonths(today, 2),
        completed: false,
        type: 'property'
      },
      {
        id: '4',
        title: 'Make Property Reservation',
        description: 'Reserve your chosen property with a deposit',
        date: addMonths(today, 3),
        completed: false,
        type: 'property'
      },
      {
        id: '5',
        title: 'Final Mortgage Approval',
        description: 'Secure final mortgage approval for your chosen property',
        date: addMonths(today, 4),
        completed: false,
        type: 'financial'
      },
      {
        id: '6',
        title: 'Exchange Contracts',
        description: 'Sign and exchange contracts with the developer',
        date: addMonths(today, 5),
        completed: false,
        type: 'legal'
      }
    ],
    targetMoveInDate: addMonths(today, 6)
  };

  const [timeline, setTimeline] = useState<JourneyTimeline>(
    initialTimeline || defaultTimeline
  );
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newMilestoneDate, setNewMilestoneDate] = useState('');
  const [newMilestoneType, setNewMilestoneType] = useState<Milestone['type']>('personal');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMilestoneId, setEditingMilestoneId] = useState<string | null>(null);

  // Calculate overall progress
  const completedMilestones = timeline.milestones.filter(m => m.completed).length;
  const progress = Math.round((completedMilestones / timeline.milestones.length) * 100);

  // Get time to move-in
  const getTimeRemaining = () => {
    if (!timeline.targetMoveInDate) return 'Not set';
    
    const now = new Date();
    const moveIn = new Date(timeline.targetMoveInDate);
    
    const months = Math.round(
      (moveIn.getFullYear() - now.getFullYear()) * 12 + 
      (moveIn.getMonth() - now.getMonth())
    );
    
    if (months <= 0) return 'This month';
    if (months === 1) return '1 month';
    return `${months} months`;
  };

  // Add a new milestone
  const handleAddMilestone = () => {
    if (!newMilestoneTitle || !newMilestoneDate) return;
    
    const newMilestone: Milestone = {
      id: Date.now().toString(),
      title: newMilestoneTitle,
      date: new Date(newMilestoneDate),
      completed: false,
      type: newMilestoneType
    };
    
    const newTimeline = {
      ...timeline,
      milestones: [...timeline.milestones, newMilestone].sort((a, b) => 
        a.date.getTime() - b.date.getTime()
      )
    };
    
    setTimeline(newTimeline);
    setNewMilestoneTitle('');
    setNewMilestoneDate('');
    setShowAddForm(false);
    
    if (onTimelineChange) {
      onTimelineChange(newTimeline);
    }
  };

  // Toggle milestone completion
  const toggleMilestoneCompletion = (id: string) => {
    const newMilestones = timeline.milestones.map(milestone => 
      milestone.id === id
        ? { ...milestone, completed: !milestone.completed }
        : milestone
    );
    
    const newTimeline = {
      ...timeline,
      milestones: newMilestones
    };
    
    setTimeline(newTimeline);
    
    if (onTimelineChange) {
      onTimelineChange(newTimeline);
    }
  };

  // Edit milestone
  const handleEditMilestone = (id: string, updates: Partial<Milestone>) => {
    const newMilestones = timeline.milestones.map(milestone => 
      milestone.id === id
        ? { ...milestone, ...updates }
        : milestone
    ).sort((a, b) => a.date.getTime() - b.date.getTime());
    
    const newTimeline = {
      ...timeline,
      milestones: newMilestones
    };
    
    setTimeline(newTimeline);
    setEditingMilestoneId(null);
    
    if (onTimelineChange) {
      onTimelineChange(newTimeline);
    }
  };

  // Update target move-in date
  const handleUpdateMoveInDate = (dateString: string) => {
    const newDate = new Date(dateString);
    
    const newTimeline = {
      ...timeline,
      targetMoveInDate: newDate
    };
    
    setTimeline(newTimeline);
    
    if (onTimelineChange) {
      onTimelineChange(newTimeline);
    }
  };

  // Get milestone icon based on type
  const getMilestoneIcon = (type: Milestone['type']) => {
    switch (type) {
      case 'financial':
        return <div className="bg-blue-100 p-2 rounded-full text-blue-600"><Calendar className="h-4 w-4" /></div>;
      case 'property':
        return <div className="bg-emerald-100 p-2 rounded-full text-emerald-600"><MapPin className="h-4 w-4" /></div>;
      case 'legal':
        return <div className="bg-purple-100 p-2 rounded-full text-purple-600"><Milestone className="h-4 w-4" /></div>;
      case 'personal':
        return <div className="bg-amber-100 p-2 rounded-full text-amber-600"><Clock className="h-4 w-4" /></div>;
      default:
        return <div className="bg-gray-100 p-2 rounded-full text-gray-600"><Calendar className="h-4 w-4" /></div>;
    }
  };
  
  // Get milestone status indicator
  const getMilestoneStatus = (milestone: Milestone) => {
    const today = new Date();
    
    if (milestone.completed) {
      return {
        icon: <div className="h-4 w-4 rounded-full bg-green-500 flex items-center justify-center"><Check className="h-3 w-3 text-white" /></div>,
        text: 'Completed',
        textColor: 'text-green-700',
        bgColor: 'bg-green-50'
      };
    } else if (isBefore(milestone.date, today)) {
      return {
        icon: <div className="h-4 w-4 rounded-full bg-red-500 flex items-center justify-center"><AlertCircle className="h-3 w-3 text-white" /></div>,
        text: 'Overdue',
        textColor: 'text-red-700',
        bgColor: 'bg-red-50'
      };
    } else {
      return {
        icon: <div className="h-4 w-4 rounded-full bg-blue-500 flex items-center justify-center"><Clock className="h-3 w-3 text-white" /></div>,
        text: 'Upcoming',
        textColor: 'text-blue-700',
        bgColor: 'bg-blue-50'
      };
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-6 text-white">
        <div className="flex items-center mb-2">
          <CalendarClock className="h-6 w-6 mr-2" />
          <h2 className="text-xl font-semibold">Your Home Buying Journey Planner</h2>
        </div>
        <p className="text-indigo-100">
          Track and manage your timeline from first steps to move-in day
        </p>
      </div>
      
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
            <div className="bg-indigo-50 rounded-lg p-4">
              <p className="text-xs text-indigo-600 uppercase font-semibold mb-1">Journey Started</p>
              <p className="text-lg font-bold">{format(timeline.startDate, 'MMM d, yyyy')}</p>
            </div>
            
            <div className="bg-indigo-50 rounded-lg p-4">
              <p className="text-xs text-indigo-600 uppercase font-semibold mb-1">Progress</p>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                  <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="text-lg font-bold">{progress}%</p>
              </div>
            </div>
            
            <div className="bg-indigo-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <p className="text-xs text-indigo-600 uppercase font-semibold mb-1">Target Move-In</p>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="text-indigo-600 hover:text-indigo-800">
                      <Info className="h-4 w-4" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="font-medium">Update Move-In Date</h4>
                      <Input 
                        type="date" 
                        value={timeline.targetMoveInDate ? format(timeline.targetMoveInDate, 'yyyy-MM-dd') : ''} 
                        onChange={(e) => handleUpdateMoveInDate(e.target.value)}
                        min={format(new Date(), 'yyyy-MM-dd')}
                      />
                      <p className="text-sm text-gray-500">
                        Setting a target move-in date helps plan your journey milestones.
                      </p>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex items-baseline">
                <p className="text-lg font-bold">
                  {timeline.targetMoveInDate ? format(timeline.targetMoveInDate, 'MMM d, yyyy') : 'Not set'}
                </p>
                <p className="text-sm text-indigo-700 ml-2">
                  ({getTimeRemaining()})
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Timeline View */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Milestones</h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center"
            >
              <PlusCircle className="h-4 w-4 mr-1" /> 
              {showAddForm ? "Cancel" : "Add Milestone"}
            </Button>
          </div>
          
          {/* Add Milestone Form */}
          {showAddForm && (
            <div className="mb-6 p-4 border border-indigo-200 rounded-lg bg-indigo-50">
              <h4 className="text-sm font-medium mb-3">Add New Milestone</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <Input 
                    value={newMilestoneTitle} 
                    onChange={(e) => setNewMilestoneTitle(e.target.value)}
                    placeholder="e.g., Mortgage Approval"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <Input 
                    type="date" 
                    value={newMilestoneDate} 
                    onChange={(e) => setNewMilestoneDate(e.target.value)}
                    min={format(new Date(), 'yyyy-MM-dd')}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select 
                    value={newMilestoneType}
                    onChange={(e) => setNewMilestoneType(e.target.value as Milestone['type'])}
                    className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="financial">Financial</option>
                    <option value="property">Property</option>
                    <option value="legal">Legal</option>
                    <option value="personal">Personal</option>
                  </select>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={handleAddMilestone}
                    disabled={!newMilestoneTitle || !newMilestoneDate}
                  >
                    Add to Timeline
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Timeline */}
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-6 top-6 bottom-0 w-0.5 bg-indigo-200"></div>
            
            <div className="space-y-6">
              {timeline.milestones.map((milestone, index) => {
                const status = getMilestoneStatus(milestone);
                
                return (
                  <div key={milestone.id} className="relative">
                    <div className="flex">
                      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center z-10">
                        {getMilestoneIcon(milestone.type)}
                      </div>
                      
                      <div className="flex-grow ml-4">
                        <div className={`border rounded-lg p-4 ${status.bgColor} border-${status.textColor.replace('text-', '')}-200`}>
                          <div className="flex justify-between">
                            <div>
                              <h4 className="font-medium">
                                {milestone.title}
                                {editingMilestoneId === milestone.id ? (
                                  <Input 
                                    value={milestone.title}
                                    onChange={(e) => handleEditMilestone(milestone.id, { title: e.target.value })}
                                    className="mt-1"
                                  />
                                ) : null}
                              </h4>
                              {milestone.description && (
                                <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                              )}
                            </div>
                            <div>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <div className={`px-2 py-1 rounded-full flex items-center ${status.textColor} text-xs font-medium cursor-pointer`}>
                                    {status.icon}
                                    <span className="ml-1">{status.text}</span>
                                  </div>
                                </PopoverTrigger>
                                <PopoverContent className="w-64">
                                  <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                      <h4 className="font-medium">Update Status</h4>
                                      <button 
                                        onClick={() => toggleMilestoneCompletion(milestone.id)}
                                        className={milestone.completed ? "text-gray-500" : "text-green-600"}
                                      >
                                        Mark as {milestone.completed ? "Incomplete" : "Complete"}
                                      </button>
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Date
                                      </label>
                                      <Input 
                                        type="date" 
                                        value={format(milestone.date, 'yyyy-MM-dd')} 
                                        onChange={(e) => handleEditMilestone(milestone.id, { date: new Date(e.target.value) })}
                                      />
                                    </div>
                                  </div>
                                </PopoverContent>
                              </Popover>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <p className="text-sm text-gray-500">
                              {format(milestone.date, 'MMMM d, yyyy')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {/* Move In Day (if set) */}
              {timeline.targetMoveInDate && (
                <div className="relative">
                  <div className="flex">
                    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center z-10">
                      <div className="bg-green-100 p-2 rounded-full text-green-600">
                        <MapPin className="h-4 w-4" />
                      </div>
                    </div>
                    
                    <div className="flex-grow ml-4">
                      <div className="border rounded-lg p-4 bg-green-50 border-green-200">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-medium">
                              Move-In Day!
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              Your target date to move into your new home
                            </p>
                          </div>
                          <div>
                            <div className={`px-2 py-1 rounded-full flex items-center text-gray-700 text-xs font-medium`}>
                              <div className="h-4 w-4 rounded-full bg-gray-500 flex items-center justify-center">
                                <Clock className="h-3 w-3 text-white" />
                              </div>
                              <span className="ml-1">Target</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <p className="text-sm text-gray-500">
                            {format(timeline.targetMoveInDate, 'MMMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
          <p className="font-medium text-gray-700 mb-1">Journey Planner Tips:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Keep your timeline updated as you progress through your home buying journey</li>
            <li>Add personal milestones like savings goals or research deadlines</li>
            <li>Share this timeline with your mortgage advisor and solicitor</li>
            <li>Adjust dates as needed to reflect your real-world progress</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}