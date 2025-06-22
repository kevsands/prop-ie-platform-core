'use client';

import React, { useState, useEffect } from 'react';
import { FiChevronRight, FiCheck, FiClock, FiAlertCircle, FiPlay, FiUsers } from 'react-icons/fi';

interface TransactionStep {
  id: number;
  title: string;
  description: string;
  status: 'completed' | 'active' | 'pending';
  stakeholders: string[];
  timeline: string;
  taskCount?: number;
  completedTasks?: number;
  orchestrationId?: string;
}

interface EnhancedTask {
  id: string;
  taskCode: string;
  title: string;
  status: string;
  assignedTo: string;
  category: string;
  estimatedDurationHours: number;
}

const transactionSteps: TransactionStep[] = [
  {
    id: 1,
    title: 'Property Discovery',
    description: 'Browse new homes, view 3D models, customize finishes',
    status: 'completed',
    stakeholders: ['Buyer', 'Developer', 'Agent'],
    timeline: '1-2 weeks',
    taskCount: 8,
    completedTasks: 8
  },
  {
    id: 2,
    title: 'Financial Pre-Approval',
    description: 'Get mortgage approval in principle and HTB eligibility',
    status: 'completed',
    stakeholders: ['Buyer', 'Broker', 'Lender'],
    timeline: '1-2 weeks',
    taskCount: 5,
    completedTasks: 5
  },
  {
    id: 3,
    title: 'Reservation',
    description: 'Reserve property with booking deposit',
    status: 'completed',
    stakeholders: ['Buyer', 'Developer', 'Solicitor'],
    timeline: '1-3 days',
    taskCount: 3,
    completedTasks: 3
  },
  {
    id: 4,
    title: 'Contract Exchange',
    description: 'Legal review and sign purchase contracts',
    status: 'active',
    stakeholders: ['Buyer', 'Seller', 'Solicitors'],
    timeline: '2-4 weeks',
    taskCount: 12,
    completedTasks: 7,
    orchestrationId: 'orch-contract-2025-001'
  },
  {
    id: 5,
    title: 'Construction Updates',
    description: 'Track build progress and schedule snag list',
    status: 'pending',
    stakeholders: ['Developer', 'Buyer', 'Surveyor'],
    timeline: '6-12 months',
    taskCount: 45,
    completedTasks: 0
  },
  {
    id: 6,
    title: 'Pre-Closing',
    description: 'Final mortgage drawdown and closing preparations',
    status: 'pending',
    stakeholders: ['Buyer', 'Lender', 'Solicitor'],
    timeline: '2-3 weeks'
  },
  {
    id: 7,
    title: 'Closing',
    description: 'Complete purchase and receive keys',
    status: 'pending',
    stakeholders: ['All Parties'],
    timeline: '1 day'
  },
  {
    id: 8,
    title: 'Post-Purchase',
    description: 'Move-in support and warranty management',
    status: 'pending',
    stakeholders: ['Buyer', 'Developer', 'Property Manager'],
    timeline: 'Ongoing'
  }
];

export default function TransactionFlow() {
  const [selectedStep, setSelectedStep] = useState<TransactionStep | null>(null);
  const [realTimeTasks, setRealTimeTasks] = useState<EnhancedTask[]>([]);
  const [isOrchestrating, setIsOrchestrating] = useState(false);

  // Fetch real-time task data
  useEffect(() => {
    fetchRealTimeTasks();
    const interval = setInterval(fetchRealTimeTasks, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchRealTimeTasks = async () => {
    try {
      const response = await fetch('/api/tasks?limit=10&real_time=true');
      if (response.ok) {
        const data = await response.json();
        setRealTimeTasks(data.tasks || []);
      }
    } catch (error) {
      console.warn('Real-time task fetch failed:', error);
    }
  };

  const handleStepOrchestration = async (step: TransactionStep) => {
    if (!step.orchestrationId) return;
    
    setIsOrchestrating(true);
    try {
      // Trigger task orchestration for this step
      const response = await fetch('/api/ecosystem/coordinate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionId: 'demo-transaction-001',
          requiredRoles: step.stakeholders,
          priority: 'high',
          timeline: {
            startDate: new Date().toISOString(),
            targetCompletionDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
          }
        })
      });
      
      if (response.ok) {
        // Refresh task data
        await fetchRealTimeTasks();
      }
    } catch (error) {
      console.error('Orchestration failed:', error);
    } finally {
      setIsOrchestrating(false);
    }
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <FiCheck className="text-white" />;
      case 'active':
        return <FiClock className="text-white" />;
      default:
        return <FiAlertCircle className="text-gray-400" />;
    }
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'active':
        return 'bg-blue-500';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-6 left-6 right-6 h-1 bg-gray-200">
          <div 
            className="h-full bg-blue-500 transition-all duration-500"
            style={{ width: '37.5%' }} // 3 completed + 0.5 active = 3.5/8 = 43.75%
          />
        </div>

        {/* Steps */}
        <div className="relative grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {transactionSteps.map((step, index) => (
            <div key={step.id} className="relative">
              <div
                onClick={() => setSelectedStep(step)}
                className={`cursor-pointer flex flex-col items-center group ${
                  index > 0 ? 'mt-0' : ''
                }`}
              >
                <div className="relative">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all ${
                      getStepColor(step.status)
                    } ${selectedStep?.id === step.id ? 'ring-4 ring-blue-300' : ''} group-hover:scale-110`}
                  >
                    {getStepIcon(step.status)}
                  </div>
                  {step.taskCount && (
                    <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                      {step.completedTasks}/{step.taskCount}
                    </div>
                  )}
                </div>
                <p className="text-xs text-center font-medium">
                  {step.title}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {step.timeline}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Step Details */}
      {selectedStep && (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">{selectedStep.title}</h3>
              <p className="text-gray-600">{selectedStep.description}</p>
            </div>
            
            {selectedStep.orchestrationId && (
              <button
                onClick={() => handleStepOrchestration(selectedStep)}
                disabled={isOrchestrating}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <FiPlay className={isOrchestrating ? 'animate-spin' : ''} />
                {isOrchestrating ? 'Orchestrating...' : 'Orchestrate Tasks'}
              </button>
            )}
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <FiUsers className="text-blue-600" />
                Stakeholders Involved:
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedStep.stakeholders.map((stakeholder, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {stakeholder}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Progress & Timeline:</h4>
              <p className="text-gray-600 mb-2">{selectedStep.timeline}</p>
              
              {selectedStep.taskCount && (
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Tasks Progress</span>
                    <span>{selectedStep.completedTasks}/{selectedStep.taskCount}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${((selectedStep.completedTasks || 0) / selectedStep.taskCount) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              )}
              
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                selectedStep.status === 'completed' ? 'bg-green-100 text-green-800' :
                selectedStep.status === 'active' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-600'
              }`}>
                {selectedStep.status === 'completed' ? 'Completed' :
                 selectedStep.status === 'active' ? 'In Progress' : 'Pending'}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Live Tasks:</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {realTimeTasks.slice(0, 3).map((task) => (
                  <div key={task.id} className="text-xs p-2 bg-white rounded border">
                    <div className="font-medium">{task.taskCode}</div>
                    <div className="text-gray-600 truncate">{task.title}</div>
                    <div className="flex justify-between mt-1">
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        task.status === 'completed' ? 'bg-green-100 text-green-700' :
                        task.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {task.status}
                      </span>
                      <span className="text-gray-500">{task.estimatedDurationHours}h</span>
                    </div>
                  </div>
                ))}
                {realTimeTasks.length === 0 && (
                  <div className="text-xs text-gray-500 p-2">
                    No active tasks
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-8 flex justify-center space-x-6">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
          <span className="text-sm text-gray-600">Completed</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
          <span className="text-sm text-gray-600">In Progress</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gray-300 rounded-full mr-2"></div>
          <span className="text-sm text-gray-600">Pending</span>
        </div>
      </div>
    </div>
  );
}