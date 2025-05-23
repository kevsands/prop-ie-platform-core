'use client';

import { useState } from 'react';
import { Check, Circle, Clock, Save, Share2, Download, Plus, ChevronRight, Calendar, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  category: string;
  isCompleted: boolean;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  notes?: string;
  linkedGuideId?: string;
}

interface Checklist {
  id: string;
  name: string;
  description: string;
  type: 'pre-purchase' | 'viewing' | 'moving' | 'post-purchase' | 'custom';
  items: ChecklistItem[];
  progress: number;
  createdDate: Date;
  lastModified: Date;
  isTemplate: boolean;
}

export default function ChecklistsPage() {
  const [selectedChecklistsetSelectedChecklist] = useState<Checklist | null>(null);
  const [showCreateModalsetShowCreateModal] = useState(false);
  const [filterTypesetFilterType] = useState<string>('all');

  // Mock checklists data
  const [checklistssetChecklists] = useState<Checklist[]>([
    {
      id: '1',
      name: 'First-Time Buyer\'s Essential Checklist',
      description: 'Complete checklist for first-time buyers covering everything from pre-approval to moving in',
      type: 'pre-purchase',
      progress: 45,
      createdDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      lastModified: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      isTemplate: true,
      items: [
        {
          id: '1-1',
          title: 'Get mortgage pre-approval',
          description: 'Contact banks and brokers to get pre-approval for your mortgage',
          category: 'Financing',
          isCompleted: true,
          priority: 'high',
          dueDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
        },
        {
          id: '1-2',
          title: 'Calculate affordability with HTB',
          description: 'Use Help-to-Buy calculator to determine your budget',
          category: 'Financing',
          isCompleted: true,
          priority: 'high',
          linkedGuideId: 'guide-2'
        },
        {
          id: '1-3',
          title: 'Choose a solicitor',
          description: 'Research and select a conveyancing solicitor',
          category: 'Legal',
          isCompleted: false,
          priority: 'medium',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        },
        {
          id: '1-4',
          title: 'Book property viewings',
          description: 'Schedule viewings for shortlisted properties',
          category: 'Property Search',
          isCompleted: false,
          priority: 'medium'
        },
        {
          id: '1-5',
          title: 'Get survey done',
          description: 'Arrange for professional property survey',
          category: 'Due Diligence',
          isCompleted: false,
          priority: 'high',
          notes: 'Essential for identifying potential issues'
        }
      ]
    },
    {
      id: '2',
      name: 'Property Viewing Checklist',
      description: 'Things to check and questions to ask during property viewings',
      type: 'viewing',
      progress: 0,
      createdDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      lastModified: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      isTemplate: true,
      items: [
        {
          id: '2-1',
          title: 'Check water pressure',
          description: 'Test taps and showers for adequate water pressure',
          category: 'Utilities',
          isCompleted: false,
          priority: 'medium'
        },
        {
          id: '2-2',
          title: 'Inspect for damp/mold',
          description: 'Look for signs of dampness or mold on walls and ceilings',
          category: 'Structure',
          isCompleted: false,
          priority: 'high'
        },
        {
          id: '2-3',
          title: 'Test all appliances',
          description: 'Check that all included appliances are working properly',
          category: 'Fixtures',
          isCompleted: false,
          priority: 'medium'
        },
        {
          id: '2-4',
          title: 'Check mobile signal',
          description: 'Test mobile phone signal strength throughout the property',
          category: 'Connectivity',
          isCompleted: false,
          priority: 'low'
        }
      ]
    },
    {
      id: '3',
      name: 'Moving Day Checklist',
      description: 'Everything you need to prepare for moving day',
      type: 'moving',
      progress: 20,
      createdDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      lastModified: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      isTemplate: true,
      items: [
        {
          id: '3-1',
          title: 'Book removal company',
          description: 'Research and book a reliable removal company',
          category: 'Logistics',
          isCompleted: true,
          priority: 'high',
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
        },
        {
          id: '3-2',
          title: 'Pack non-essentials',
          description: 'Start packing items you won\'t need before the move',
          category: 'Packing',
          isCompleted: false,
          priority: 'medium'
        },
        {
          id: '3-3',
          title: 'Transfer utilities',
          description: 'Arrange for utility transfers to new address',
          category: 'Utilities',
          isCompleted: false,
          priority: 'high',
          notes: 'Electricity, gas, internet, water'
        },
        {
          id: '3-4',
          title: 'Change address with services',
          description: 'Update address with bank, employer, insurance, etc.',
          category: 'Admin',
          isCompleted: false,
          priority: 'medium'
        }
      ]
    }
  ]);

  // Filter checklists
  const filteredChecklists = checklists.filter(checklist => {
    if (filterType === 'all') return true;
    if (filterType === 'templates') return checklist.isTemplate;
    if (filterType === 'custom') return !checklist.isTemplate;
    return checklist.type === filterType;
  });

  const getProgressColor = (progress: number) => {
    if (progress>= 80) return 'bg-green-600';
    if (progress>= 50) return 'bg-yellow-600';
    return 'bg-gray-400';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const toggleItem = (checklistId: string, itemId: string) => {
    setChecklists(prevChecklists => 
      prevChecklists.map(checklist => {
        if (checklist.id === checklistId) {
          const updatedItems = checklist.items.map(item => 
            item.id === itemId ? { ...item, isCompleted: !item.isCompleted } : item
          );
          const completedCount = updatedItems.filter(item => item.isCompleted).length;
          const progress = Math.round((completedCount / updatedItems.length) * 100);
          return { 
            ...checklist, 
            items: updatedItems, 
            progress,
            lastModified: new Date()
          };
        }
        return checklist;
      })
    );
  };

  return (
    <div className="flex-1 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Checklists</h1>
            <p className="text-gray-600 mt-1">Track your progress through the home buying journey</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Create Checklist
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6 flex items-center gap-4 overflow-x-auto pb-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              filterType === 'all' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Checklists
          </button>
          <button
            onClick={() => setFilterType('templates')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              filterType === 'templates' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Templates
          </button>
          <button
            onClick={() => setFilterType('pre-purchase')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              filterType === 'pre-purchase' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pre-Purchase
          </button>
          <button
            onClick={() => setFilterType('viewing')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              filterType === 'viewing' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Viewing
          </button>
          <button
            onClick={() => setFilterType('moving')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              filterType === 'moving' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Moving
          </button>
        </div>

        {/* Checklists Grid */}
        {selectedChecklist ? (
          /* Checklist Detail View */
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedChecklist.name}</h2>
                  <p className="text-gray-600 mt-1">{selectedChecklist.description}</p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                    <span>Created {format(selectedChecklist.createdDate, 'MMM d, yyyy')}</span>
                    <span>•</span>
                    <span>Modified {format(selectedChecklist.lastModified, 'MMM d, yyyy')}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedChecklist(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm font-medium text-gray-900">{selectedChecklist.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(selectedChecklist.progress)}`}
                    style={ width: `${selectedChecklist.progress}%` }
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-4 border-b bg-gray-50 flex items-center gap-3">
              <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                <Download className="h-4 w-4" />
                Export
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                <Share2 className="h-4 w-4" />
                Share
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                <Save className="h-4 w-4" />
                Save as Template
              </button>
            </div>

            {/* Checklist Items */}
            <div className="p-6">
              {Object.entries(
                selectedChecklist.items.reduce((accitem) => {
                  if (!acc[item.category]) acc[item.category] = [];
                  acc[item.category].push(item);
                  return acc;
                }, {} as Record<string, ChecklistItem[]>)
              ).map(([categoryitems]) => (
                <div key={category} className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{category}</h3>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div 
                        key={item.id}
                        className={`border rounded-lg p-4 transition-colors ${
                          item.isCompleted ? 'bg-gray-50 border-gray-300' : 'bg-white border-gray-200'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => toggleItem(selectedChecklist.id, item.id)}
                            className={`mt-0.5 flex-shrink-0 ${
                              item.isCompleted 
                                ? 'text-green-600' 
                                : 'text-gray-400 hover:text-gray-600'
                            }`}
                          >
                            {item.isCompleted ? (
                              <Check className="h-5 w-5" />
                            ) : (
                              <Circle className="h-5 w-5" />
                            )}
                          </button>

                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className={`font-medium ${
                                  item.isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'
                                }`}>
                                  {item.title}
                                </h4>
                                <p className={`text-sm mt-1 ${
                                  item.isCompleted ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                  {item.description}
                                </p>
                              </div>

                              <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                                getPriorityColor(item.priority)
                              }`}>
                                {item.priority}
                              </span>
                            </div>

                            <div className="flex items-center gap-4 mt-2">
                              {item.dueDate && (
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                  <Calendar className="h-4 w-4" />
                                  {format(item.dueDate, 'MMM d')}
                                </div>
                              )}
                              {item.notes && (
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                  <AlertCircle className="h-4 w-4" />
                                  Note: {item.notes}
                                </div>
                              )}
                              {item.linkedGuideId && (
                                <button className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
                                  <ChevronRight className="h-4 w-4" />
                                  View Guide
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Checklists Grid View */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChecklists.map((checklist) => (
              <div 
                key={checklist.id}
                onClick={() => setSelectedChecklist(checklist)}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{checklist.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{checklist.description}</p>
                  </div>
                  {checklist.isTemplate && (
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                      Template
                    </span>
                  )}
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Progress</span>
                    <span className="text-sm font-medium text-gray-900">{checklist.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(checklist.progress)}`}
                      style={ width: `${checklist.progress}%` }
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {format(checklist.lastModified, 'MMM d')}
                  </div>
                  <div className="flex items-center gap-1">
                    {checklist.items.filter(i => i.isCompleted).length}/{checklist.items.length} items
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}