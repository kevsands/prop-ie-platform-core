'use client';

import React, { useState } from 'react';

/**
 * TransactionFlow - A component that visualizes the end-to-end property transaction process
 * Shows how all stakeholders interact throughout the journey
 */
export const TransactionFlow = () => {
  const [activeStep, setActiveStep] = useState(0);
  
  const steps = [
    {
      id: 1,
      title: 'Development Launch',
      description: 'Developer creates a new development project on the platform',
      stakeholders: ['Developer'],
      features: [
        'Project specification upload',
        'Unit pricing and availability management',
        'Floor plans and 3D model integration',
        'Marketing material preparation'
      ]
    },
    {
      id: 2,
      title: 'Agent Appointment',
      description: 'Developer invites and appoints selling agents to the project',
      stakeholders: ['Developer', 'Agent'],
      features: [
        'Agent selection and invitation',
        'Commission structure definition',
        'Sales targets and timeline setting',
        'Marketing collateral sharing'
      ]
    },
    {
      id: 3,
      title: 'Property Marketing',
      description: 'Agents create listings and market properties to potential buyers',
      stakeholders: ['Agent', 'Buyer'],
      features: [
        'Listing creation and optimization',
        'Open house scheduling',
        'Buyer inquiry management',
        'Property viewing booking system'
      ]
    },
    {
      id: 4,
      title: 'Buyer Interest & Offers',
      description: 'Buyers express interest and submit offers through agents',
      stakeholders: ['Buyer', 'Agent', 'Developer'],
      features: [
        'Digital offer submission',
        'Document upload for pre-approval',
        'Negotiation facilitation',
        'Offer tracking dashboard'
      ]
    },
    {
      id: 5,
      title: 'Offer Acceptance',
      description: 'Developer reviews and accepts offers, beginning the legal process',
      stakeholders: ['Developer', 'Agent', 'Buyer'],
      features: [
        'Offer comparison tools',
        'Acceptance notification system',
        'Deposit payment processing',
        'Sales agreement generation'
      ]
    },
    {
      id: 6,
      title: 'Solicitor Engagement',
      description: 'Buyer and developer engage their solicitors for legal work',
      stakeholders: ['Buyer', 'Developer', 'Solicitor'],
      features: [
        'Solicitor invitation and connection',
        'Case creation and assignment',
        'Document sharing permissions',
        'Task management and reminders'
      ]
    },
    {
      id: 7,
      title: 'Legal Process',
      description: 'Legal review, searches, and contract preparation takes place',
      stakeholders: ['Solicitor', 'Developer', 'Buyer', 'Agent'],
      features: [
        'Document collaboration workspace',
        'Legal query management',
        'Timeline tracking and notifications',
        'Digital signature integration'
      ]
    },
    {
      id: 8,
      title: 'Financing & Approval',
      description: 'Mortgage approval and final financial arrangements are made',
      stakeholders: ['Buyer', 'Lender', 'Solicitor'],
      features: [
        'Mortgage document management',
        'Lender communication portal',
        'Payment scheduling',
        'Financial milestone tracking'
      ]
    },
    {
      id: 9,
      title: 'Closing & Handover',
      description: 'Final contracts are signed, funds transferred, and keys handed over',
      stakeholders: ['Buyer', 'Developer', 'Solicitor', 'Agent'],
      features: [
        'Closing checklist automation',
        'Final payment processing',
        'Digital key handover scheduling',
        'Onboarding to owner resources'
      ]
    },
    {
      id: 10,
      title: 'Post-Purchase Support',
      description: 'Ongoing support for snagging, community, and property management',
      stakeholders: ['Buyer', 'Developer'],
      features: [
        'Snagging list management',
        'Maintenance request system',
        'Community portal access',
        'Service provider directory'
      ]
    }
  ];

  const handleNext = () => {
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrev = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const handleStepClick = (index) => {
    setActiveStep(index);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-8 text-[#2B5273]">
        End-to-End Property Transaction Flow
      </h2>
      
      {/* Progress bar */}
      <div className="relative mb-10">
        <div className="h-1 bg-gray-200 w-full rounded-full">
          <div 
            className="h-1 bg-[#2B5273] rounded-full transition-all duration-500"
            style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between mt-2">
          {steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => handleStepClick(index)}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                index <= activeStep
                  ? 'bg-[#2B5273] text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {step.id}
            </button>
          ))}
        </div>
      </div>
      
      {/* Current step content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-xl font-bold mb-2">{steps[activeStep].title}</h3>
          <p className="text-gray-600 mb-4">{steps[activeStep].description}</p>
          
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Stakeholders Involved:</h4>
            <div className="flex flex-wrap gap-2">
              {steps[activeStep].stakeholders.map((stakeholder) => (
                <span 
                  key={stakeholder}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {stakeholder}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Key Features:</h4>
            <ul className="space-y-2">
              {steps[activeStep].features.map((feature) => (
                <li key={feature} className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="flex items-center justify-center bg-gray-50 rounded-lg p-4">
          <div className="text-center">
            <div className="mb-4">
              <img 
                src={`/images/transaction-flow/step-${steps[activeStep].id}.svg`} 
                alt={steps[activeStep].title}
                className="max-w-full h-auto max-h-64 mx-auto"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/transaction-flow/placeholder.svg';
                }}
              />
            </div>
            
            <div className="bg-[#2B5273] text-white p-3 rounded">
              <h4 className="font-semibold mb-1">Platform Value</h4>
              <p className="text-sm">
                {getValueProposition(steps[activeStep].id)}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={handlePrev}
          disabled={activeStep === 0}
          className={`px-4 py-2 rounded ${
            activeStep === 0
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-white border border-[#2B5273] text-[#2B5273] hover:bg-gray-50'
          }`}
        >
          Previous Step
        </button>
        
        <button
          onClick={handleNext}
          disabled={activeStep === steps.length - 1}
          className={`px-4 py-2 rounded ${
            activeStep === steps.length - 1
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-[#2B5273] text-white hover:bg-[#1E3142]'
          }`}
        >
          Next Step
        </button>
      </div>
    </div>
  );
};

// Helper function to get value proposition text based on step
function getValueProposition(stepId) {
  const propositions = {
    1: "Prop.ie simplifies creating and managing development projects, bringing them to market faster.",
    2: "Our platform streamlines agent appointment, ensuring the best professionals represent your properties.",
    3: "Centralized marketing tools help agents present properties effectively to qualified buyers.",
    4: "Digital offer management replaces paper-based processes, saving time and reducing errors.",
    5: "Transparent offer comparison tools help developers make informed decisions quickly.",
    6: "Seamless solicitor integration eliminates communication gaps that typically delay transactions.",
    7: "Collaborative workspaces keep all legal work organized and accessible to authorized parties.",
    8: "Integrated financing workflows reduce approval times and prevent last-minute surprises.",
    9: "Automated closing processes ensure nothing falls through the cracks during handover.",
    10: "Post-purchase support maintains positive relationships and encourages future referrals."
  };
  
  return propositions[stepId] || "Prop.ie connects all stakeholders to make property transactions seamless.";
}

export default TransactionFlow; 