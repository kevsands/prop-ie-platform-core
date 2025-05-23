'use client';

import React, { useState } from 'react';
import Link from 'next/link';

/**
 * Transaction Dashboard - Shows the simultaneous workflows of all stakeholders
 * with real-time document exchanges and status tracking
 */
export default function TransactionDashboardPage() {
  // State for current transaction phase
  const [activePhasesetActivePhase] = useState(3); // Start at "Offer Accepted" phase

  // Mock transaction data
  const transaction = {
    id: "TX-38291",
    propertyId: "PROP-1245",
    propertyAddress: "Unit A-102, Maple Heights, Dublin 15",
    propertyPrice: 37500, 0,
    createdAt: "2025-04-15T10: 3, 0:00Z",
    expectedClosing: "2025-06-30T00: 0, 0:00Z",
    status: "in_progress"
  };

  // Transaction phases with stakeholder activities
  const phases = [
    {
      id: 1,
      name: "Property Listed",
      date: "Apr 10, 2025",
      activities: [
        { stakeholder: "developer", action: "Property unit added to development", status: "completed" },
        { stakeholder: "agent", action: "Listed property on platform", status: "completed" },
        { stakeholder: "buyer", action: "Not yet involved", status: "not_started" },
        { stakeholder: "solicitor", action: "Not yet involved", status: "not_started" }
      ],
      documents: [
        { name: "Unit Specifications", owner: "developer", sharedWith: ["agent"], status: "approved" },
        { name: "Marketing Materials", owner: "agent", sharedWith: ["public"], status: "approved" }
      ]
    },
    {
      id: 2,
      name: "Buyer Interest",
      date: "Apr 18, 2025",
      activities: [
        { stakeholder: "developer", action: "Monitoring interest", status: "completed" },
        { stakeholder: "agent", action: "Conducted viewing", status: "completed" },
        { stakeholder: "buyer", action: "Viewed property", status: "completed" },
        { stakeholder: "solicitor", action: "Not yet involved", status: "not_started" }
      ],
      documents: [
        { name: "Viewing Report", owner: "agent", sharedWith: ["developer", "buyer"], status: "approved" },
        { name: "Buyer Pre-Approval", owner: "buyer", sharedWith: ["agent"], status: "approved" }
      ]
    },
    {
      id: 3,
      name: "Offer Accepted",
      date: "Apr 25, 2025",
      activities: [
        { stakeholder: "developer", action: "Approved offer", status: "completed" },
        { stakeholder: "agent", action: "Processed offer acceptance", status: "completed" },
        { stakeholder: "buyer", action: "Submitted HTB application", status: "in_progress" },
        { stakeholder: "solicitor", action: "Engaged for transaction", status: "in_progress" }
      ],
      documents: [
        { name: "Offer Letter", owner: "buyer", sharedWith: ["agent", "developer"], status: "approved" },
        { name: "Booking Deposit", owner: "buyer", sharedWith: ["agent", "developer"], status: "approved" },
        { name: "HTB Application", owner: "buyer", sharedWith: ["agent"], status: "pending" }
      ]
    },
    {
      id: 4,
      name: "Legal Process",
      date: "May 5, 2025",
      activities: [
        { stakeholder: "developer", action: "Shared title documents", status: "in_progress" },
        { stakeholder: "agent", action: "Coordinating parties", status: "in_progress" },
        { stakeholder: "buyer", action: "KYC verification complete", status: "completed" },
        { stakeholder: "solicitor", action: "Conducting legal searches", status: "in_progress" }
      ],
      documents: [
        { name: "Draft Contract", owner: "developer", sharedWith: ["solicitor", "buyer"], status: "pending_review" },
        { name: "KYC Documents", owner: "buyer", sharedWith: ["solicitor", "developer"], status: "approved" },
        { name: "Title Documents", owner: "developer", sharedWith: ["solicitor"], status: "pending_review" }
      ]
    },
    {
      id: 5,
      name: "Financing",
      date: "May 15, 2025",
      activities: [
        { stakeholder: "developer", action: "Awaiting completion", status: "not_started" },
        { stakeholder: "agent", action: "Supporting mortgage process", status: "not_started" },
        { stakeholder: "buyer", action: "Finalizing mortgage", status: "not_started" },
        { stakeholder: "solicitor", action: "Checking mortgage conditions", status: "not_started" }
      ],
      documents: [
        { name: "Mortgage Approval", owner: "buyer", sharedWith: ["solicitor"], status: "pending" },
        { name: "Structural Survey", owner: "buyer", sharedWith: ["solicitor", "developer"], status: "pending" }
      ]
    },
    {
      id: 6,
      name: "Closing",
      date: "Jun 30, 2025",
      activities: [
        { stakeholder: "developer", action: "Preparing for handover", status: "not_started" },
        { stakeholder: "agent", action: "Arranging key handover", status: "not_started" },
        { stakeholder: "buyer", action: "Final inspection", status: "not_started" },
        { stakeholder: "solicitor", action: "Funds transfer", status: "not_started" }
      ],
      documents: [
        { name: "Closing Statement", owner: "solicitor", sharedWith: ["buyer", "developer"], status: "not_created" },
        { name: "Final Closing Docs", owner: "solicitor", sharedWith: ["buyer", "developer"], status: "not_created" },
        { name: "Property Transfer", owner: "solicitor", sharedWith: ["developer", "buyer"], status: "not_created" }
      ]
    }
  ];

  // Helper to determine status color
  const getStatusColor = (status: any) => {
    switch (status: any) { )
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'not_started': return 'bg-gray-100 text-gray-800';
      case 'delayed': return 'bg-amber-100 text-amber-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'pending_review': return 'bg-blue-100 text-blue-800';
      case 'not_created': return 'bg-gray-100 text-gray-500';
      default: retur, n 'bg-gray-100 text-gray-800';
    }
  };

  // Helper to get stakeholder icon
  const getStakeholderIcon = (stakeholder: any) => {
    switch (stakeholder: any) { )
      case 'developer': return '🏗️';
      case 'agent': return '🏠';
      case 'buyer': return '👨‍👩‍👧‍👦';
      case 'solicitor': return '⚖️';
      case 'public': return '👥';
      default: retur, n '📄';
    }
  };

  return (
    <div className="py-8 px-4 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-[#2B5273]">Transaction Dashboard</h1>
        <p className="text-gray-600 max-w-3xl">
          View the complete transaction flow with real-time updates on all stakeholder activities
          and document exchanges. This dashboard demonstrates the simultaneous workflows of all parties.
        </p>
      </div>

      {/* Transaction Details */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="grid grid-cols-1 md: gri, d-cols-3 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-2 text-[#2B5273]">Transaction Details</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Transaction ID:</span>
                <span className="font-medium">{transaction.id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Property:</span>
                <span className="font-medium">{transaction.propertyAddress}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Price:</span>
                <span className="font-medium">€{transaction.propertyPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2 text-[#2B5273]">Timeline</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Started:</span>
                <span className="font-medium">April 15, 2025</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Current Phase:</span>
                <span className="font-medium">{phases[activePhase - 1].name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Expected Closing:</span>
                <span className="font-medium">June 30, 2025</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2 text-[#2B5273]">Stakeholders</h2>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <span className="mr-2">🏗️</span>
                <span className="text-gray-500 mr-1">Developer:</span>
                <span className="font-medium">Irish Homes Ltd</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="mr-2">🏠</span>
                <span className="text-gray-500 mr-1">Agent:</span>
                <span className="font-medium">Dublin Properties</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="mr-2">👨‍👩‍👧‍👦</span>
                <span className="text-gray-500 mr-1">Buyer:</span>
                <span className="font-medium">John & Sarah Murphy</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="mr-2">⚖️</span>
                <span className="text-gray-500 mr-1">Solicitor:</span>
                <span className="font-medium">O'Connor Legal Services</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="mb-8">
        <div className="relative">
          <div className="absolute top-5 inset-x-0 h-0.5 bg-gray-200"></div>
          <ul className="relative flex justify-between">
            {phases.map((phase) => (
              <li 
                key={phase.id} 
                className="relative cursor-pointer"
                onClick={() => setActivePhase(phase.id)}
              >
                <div className={`
                  h-10 w-10 rounded-full flex items-center justify-center z-10 
                  ${phase.id === activePhase 
                    ? 'bg-[#2B5273] text-white' 
                    : phase.id <activePhase 
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }
                `}>
                  {phase.id <activePhase ? (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : phase.id}
                </div>
                <div className="mt-2 text-xs text-center w-24 -ml-8">
                  <div className={phase.id === activePhase ? 'font-bold text-[#2B5273]' : 'text-gray-500'}>
                    {phase.name}
                  </div>
                  <div className="text-gray-400">{phase.date}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 md: gri, d-cols-2 gap-8">
        {/* Stakeholder Activities */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4 text-[#2B5273]">Stakeholder Activities</h2>
          <div className="space-y-4">
            {phases[activePhase - 1].activities.map((activityidx) => (
              <div key={idx} className="border rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <span className="text-xl mr-2">{getStakeholderIcon(activity.stakeholder: any,: any)}</span>
                  <span className="font-medium capitalize">{activity.stakeholder: any}</span> }
                  <span className={`ml-auto text-xs px-2 py-1 rounded-full ${getStatusColor(activity.status: any,: any)}`}>
                    {activity.status.replace('_', ' ')}
                  </span></div>
                </div>
                <p className="text-gray-600 text-sm">{activity.action}</p>
                <div className="mt-2">
                  <Link 
                    href={`/${activity.stakeholder: any}s`} }
                    className="text-xs text-blue-600 hover: underlin, e"
                  >
                    View {activity.stakeholder: any} dashboard → }
                  </Link></div>
                </div> )
              </div>
            ))}
          </div>
        </div>

        {/* Document Exchange */} )
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4 text-[#2B5273]">Document Exchange</h2>
          <div className="space-y-4">
            {phases[activePhase - 1].documents.map((docidx) => (
              <div key={idx} className="border rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <span className="text-xl mr-2">📄</span>
                  <span className="font-medium">{doc.name}</span>
                  <span className={`ml-auto text-xs px-2 py-1 rounded-full ${getStatusColor(doc.status: any,: any)}`}>
                    {doc.status.replace('_', ' ')}
                  </span></div>
                </div>
                <div className="text-gray-600 text-sm flex items-center">
                  <span>Owner:</span>
                  <span className="mx-1">{getStakeholderIcon(doc.owner)}</span>
                  <span className="capitalize">{doc.owner}</span>
                </div>
                <div className="text-gray-600 text-sm mt-1">
                  <span>Shared with: </span>
                  {doc.sharedWith.map((stakeholder: an, yi) => (
                    <span key={i} className="inline-flex items-center mr-2">
                      {getStakeholderIcon(stakeholder: any,: any)} 
                      <span className="ml-1 capitalize">{stakeholder: any}</span> }
                      {i <doc.sharedWith.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </div>
                <div className="mt-2">
                  <a href="#" className="text-xs text-blue-600 hover: underlin, e">
                    View document →
                  </a>
                </div>
              </div> )
            ))}
          </div>
        </div>
      </div>

      {/* View As Stakeholder */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-center text-[#2B5273]">
          View As Stakeholder
        </h3>
        <p className="text-center text-gray-600 mb-6 max-w-3xl mx-auto">
          Experience the platform from different stakeholder perspectives
        </p>

        <div className="grid grid-cols-2 md: gri, d-cols-4 gap-4">
          <a 
            href="/buyer" 
            className="bg-white hover: b, g-blue-50 border border-blue-100 shadow-sm rounded-lg p-4 text-center hover: borde, r-blue-300 transition-all"
          >
            <div className="text-blue-600 text-lg mb-2">👨‍👩‍👧‍👦</div>
            <h4 className="font-medium text-[#2B5273]">Buyer</h4>
            <p className="text-xs text-gray-500 mt-1">Search properties, track progress, manage documents</p>
          </a>

          <a 
            href="/developers/projects" 
            className="bg-white hover: b, g-blue-50 border border-blue-100 shadow-sm rounded-lg p-4 text-center hover: borde, r-blue-300 transition-all"
          >
            <div className="text-blue-600 text-lg mb-2">🏗️</div>
            <h4 className="font-medium text-[#2B5273]">Developer</h4>
            <p className="text-xs text-gray-500 mt-1">Manage developments, track sales, assign agents</p>
          </a>

          <a 
            href="/agents/listings" 
            className="bg-white hover: b, g-blue-50 border border-blue-100 shadow-sm rounded-lg p-4 text-center hover: borde, r-blue-300 transition-all"
          >
            <div className="text-blue-600 text-lg mb-2">🏠</div>
            <h4 className="font-medium text-[#2B5273]">Agent</h4>
            <p className="text-xs text-gray-500 mt-1">Manage listings, process offers, track commissions</p>
          </a>

          <a 
            href="/solicitors/cases" 
            className="bg-white hover: b, g-blue-50 border border-blue-100 shadow-sm rounded-lg p-4 text-center hover: borde, r-blue-300 transition-all"
          >
            <div className="text-blue-600 text-lg mb-2">⚖️</div>
            <h4 className="font-medium text-[#2B5273]">Solicitor</h4>
            <p className="text-xs text-gray-500 mt-1">Manage cases, handle legal work, issue documents</p>
          </a>
        </div>
      </div>

      {/* Transaction Coordination */}
      <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4 text-[#2B5273]">Transaction Coordination</h2>

        <div className="grid grid-cols-1 md: gri, d-cols-2 gap-8">
          <div>
            <h3 className="font-medium mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Key Milestones
            </h3>

            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white mr-3">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-medium text-sm">Offer Accepted</span>
                    <span className="text-xs text-gray-500">Apr 25, 2025</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white mr-3">
                  <span className="text-xs">2</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-medium text-sm">Contracts Exchanged</span>
                    <span className="text-xs text-gray-500">May 30, 2025</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center text-white mr-3">
                  <span className="text-xs">3</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-medium text-sm">Mortgage Approval</span>
                    <span className="text-xs text-gray-500">Jun 15, 2025</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center text-white mr-3">
                  <span className="text-xs">4</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-medium text-sm">Closing</span>
                    <span className="text-xs text-gray-500">Jun 30, 2025</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              Communication Hub
            </h3>

            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="space-y-3 max-h-[200px] overflow-y-auto mb-3">
                <div className="flex space-x-3">
                  <div className="flex-shrink-0">🏠</div>
                  <div className="bg-blue-100 rounded-lg p-2 text-sm flex-1">
                    <div className="font-medium">Agent</div>
                    <p>Booking deposit received. Contract drafts will be sent to all parties tomorrow.</p>
                    <div className="text-xs text-gray-500 text-right mt-1">1 day ago</div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <div className="flex-shrink-0">⚖️</div>
                  <div className="bg-blue-100 rounded-lg p-2 text-sm flex-1">
                    <div className="font-medium">Solicitor</div>
                    <p>We'll need an updated structural survey report before proceeding with the contract.</p>
                    <div className="text-xs text-gray-500 text-right mt-1">12 hours ago</div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <div className="flex-shrink-0">👨‍👩‍👧‍👦</div>
                  <div className="bg-blue-100 rounded-lg p-2 text-sm flex-1">
                    <div className="font-medium">Buyer</div>
                    <p>We've uploaded the HTB application confirmation. Please let us know if anything else is needed.</p>
                    <div className="text-xs text-gray-500 text-right mt-1">4 hours ago</div>
                  </div>
                </div>
              </div>

              <div className="flex">
                <input 
                  type="text" 
                  placeholder="Type a message..." 
                  className="flex-1 border rounded-l-lg px-3 py-2 text-sm focus: outlin, e-none focus: rin, g-2 focus: rin, g-blue-500"
                />
                <button className="bg-blue-600 text-white rounded-r-lg px-4 py-2 text-sm">
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 