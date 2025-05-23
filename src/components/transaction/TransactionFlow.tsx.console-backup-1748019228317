'use client';

import React, { useState } from 'react';
import { FiChevronRight, FiCheck, FiClock, FiAlertCircle } from 'react-icons/fi';

interface TransactionStep {
  id: number;
  title: string;
  description: string;
  status: 'completed' | 'active' | 'pending';
  stakeholders: string[];
  timeline: string;
}

const transactionSteps: TransactionStep[] = [
  {
    id: 1,
    title: 'Property Discovery',
    description: 'Browse new homes, view 3D models, customize finishes',
    status: 'completed',
    stakeholders: ['Buyer', 'Developer', 'Agent'],
    timeline: '1-2 weeks'
  },
  {
    id: 2,
    title: 'Financial Pre-Approval',
    description: 'Get mortgage approval in principle and HTB eligibility',
    status: 'completed',
    stakeholders: ['Buyer', 'Broker', 'Lender'],
    timeline: '1-2 weeks'
  },
  {
    id: 3,
    title: 'Reservation',
    description: 'Reserve property with booking deposit',
    status: 'completed',
    stakeholders: ['Buyer', 'Developer', 'Solicitor'],
    timeline: '1-3 days'
  },
  {
    id: 4,
    title: 'Contract Exchange',
    description: 'Legal review and sign purchase contracts',
    status: 'active',
    stakeholders: ['Buyer', 'Seller', 'Solicitors'],
    timeline: '2-4 weeks'
  },
  {
    id: 5,
    title: 'Construction Updates',
    description: 'Track build progress and schedule snag list',
    status: 'pending',
    stakeholders: ['Developer', 'Buyer', 'Surveyor'],
    timeline: '6-12 months'
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
                className={`cursor-pointer flex flex-col items-center ${
                  index > 0 ? 'mt-0' : ''
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                    getStepColor(step.status)
                  } ${selectedStep?.id === step.id ? 'ring-4 ring-blue-300' : ''}`}
                >
                  {getStepIcon(step.status)}
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
          <h3 className="text-lg font-semibold mb-2">{selectedStep.title}</h3>
          <p className="text-gray-600 mb-4">{selectedStep.description}</p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Stakeholders Involved:</h4>
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
              <h4 className="font-medium mb-2">Expected Timeline:</h4>
              <p className="text-gray-600">{selectedStep.timeline}</p>
              
              <div className={`mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm ${
                selectedStep.status === 'completed' ? 'bg-green-100 text-green-800' :
                selectedStep.status === 'active' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-600'
              }`}>
                {selectedStep.status === 'completed' ? 'Completed' :
                 selectedStep.status === 'active' ? 'In Progress' : 'Pending'}
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