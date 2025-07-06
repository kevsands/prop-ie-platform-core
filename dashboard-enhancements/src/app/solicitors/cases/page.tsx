"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FiFilePlus, 
  FiFileText, 
  FiMessageCircle, 
  FiCalendar, 
  FiClock, 
  FiSearch,
  FiFilter,
  FiAlertCircle,
  FiCheckCircle,
  FiArrowRight,
  FiPaperclip
} from 'react-icons/fi';

// Define the interfaces
interface LegalCase {
  id: string;
  clientName: string;
  propertyAddress: string;
  developerName: string;
  agentName: string;
  status: 'new' | 'in_progress' | 'review' | 'completed';
  price: number;
  startDate: string;
  dueDate: string;
  documents: Document[];
  tasks: Task[];
}

interface Document {
  id: string;
  name: string;
  type: string;
  uploadedBy: string;
  uploadDate: string;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
}

interface Task {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

// Mock data for the solicitor cases
const mockCases: LegalCase[] = [
  {
    id: '1',
    clientName: 'John Murphy',
    propertyAddress: '10 Maple Avenue, Dublin 15',
    developerName: 'PropIE Developers',
    agentName: 'James Doyle',
    status: 'in_progress',
    price: 395000,
    startDate: '2023-06-15',
    dueDate: '2023-07-30',
    documents: [
      {
        id: 'd1',
        name: 'Purchase Agreement',
        type: 'PDF',
        uploadedBy: 'James Doyle (Agent)',
        uploadDate: '2023-06-15',
        status: 'approved'
      },
      {
        id: 'd2',
        name: 'Property Survey',
        type: 'PDF',
        uploadedBy: 'PropIE Developers',
        uploadDate: '2023-06-17',
        status: 'approved'
      },
      {
        id: 'd3',
        name: 'Bank Approval',
        type: 'PDF',
        uploadedBy: 'John Murphy (Client)',
        uploadDate: '2023-06-22',
        status: 'pending'
      }
    ],
    tasks: [
      {
        id: 't1',
        title: 'Review purchase agreement',
        dueDate: '2023-06-18',
        completed: true,
        priority: 'high'
      },
      {
        id: 't2',
        title: 'Verify property boundaries',
        dueDate: '2023-06-25',
        completed: true,
        priority: 'medium'
      },
      {
        id: 't3',
        title: 'Confirm mortgage approval details',
        dueDate: '2023-07-01',
        completed: false,
        priority: 'high'
      }
    ]
  },
  {
    id: '2',
    clientName: 'Sarah O\'Connor',
    propertyAddress: '15 Oak Drive, Dublin 18',
    developerName: 'PropIE Developers',
    agentName: 'James Doyle',
    status: 'review',
    price: 450000,
    startDate: '2023-05-20',
    dueDate: '2023-07-05',
    documents: [
      {
        id: 'd4',
        name: 'Purchase Agreement',
        type: 'PDF',
        uploadedBy: 'James Doyle (Agent)',
        uploadDate: '2023-05-20',
        status: 'approved'
      },
      {
        id: 'd5',
        name: 'Property Survey',
        type: 'PDF',
        uploadedBy: 'PropIE Developers',
        uploadDate: '2023-05-25',
        status: 'approved'
      },
      {
        id: 'd6',
        name: 'Bank Approval',
        type: 'PDF',
        uploadedBy: 'Sarah O\'Connor (Client)',
        uploadDate: '2023-06-01',
        status: 'approved'
      },
      {
        id: 'd7',
        name: 'Title Deed',
        type: 'PDF',
        uploadedBy: 'Registry Office',
        uploadDate: '2023-06-10',
        status: 'pending'
      }
    ],
    tasks: [
      {
        id: 't4',
        title: 'Review purchase agreement',
        dueDate: '2023-05-25',
        completed: true,
        priority: 'high'
      },
      {
        id: 't5',
        title: 'Verify property boundaries',
        dueDate: '2023-06-01',
        completed: true,
        priority: 'medium'
      },
      {
        id: 't6',
        title: 'Confirm mortgage approval details',
        dueDate: '2023-06-07',
        completed: true,
        priority: 'high'
      },
      {
        id: 't7',
        title: 'Review title deed',
        dueDate: '2023-06-15',
        completed: false,
        priority: 'high'
      }
    ]
  },
  {
    id: '3',
    clientName: 'Michael Kelly',
    propertyAddress: '5 Elm Court, Cork City',
    developerName: 'PropIE Developers',
    agentName: 'Mary O\'Sullivan',
    status: 'new',
    price: 320000,
    startDate: '2023-06-25',
    dueDate: '2023-08-10',
    documents: [
      {
        id: 'd8',
        name: 'Purchase Agreement',
        type: 'PDF',
        uploadedBy: 'Mary O\'Sullivan (Agent)',
        uploadDate: '2023-06-25',
        status: 'pending'
      }
    ],
    tasks: [
      {
        id: 't8',
        title: 'Review purchase agreement',
        dueDate: '2023-07-01',
        completed: false,
        priority: 'high'
      },
      {
        id: 't9',
        title: 'Schedule initial client consultation',
        dueDate: '2023-06-28',
        completed: false,
        priority: 'high'
      }
    ]
  }
];

export default function SolicitorCases() {
  const [selectedCase, setSelectedCase] = useState<LegalCase | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | LegalCase['status']>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  // Handle opening a case
  const handleOpenCase = (legalCase: LegalCase) => {
    setSelectedCase(legalCase);
  };

  // Handle opening document preview modal
  const handleOpenDocument = (document: Document) => {
    setSelectedDocument(document);
    setShowDocumentModal(true);
  };

  // Filter cases by status and search term
  const filteredCases = mockCases.filter(legalCase => {
    const matchesStatus = statusFilter === 'all' || legalCase.status === statusFilter;
    const matchesSearch = 
      legalCase.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      legalCase.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Get status label and color
  const getCaseStatusInfo = (status: LegalCase['status']) => {
    switch (status) {
      case 'new':
        return { label: 'New', color: 'bg-blue-100 text-blue-800' };
      case 'in_progress':
        return { label: 'In Progress', color: 'bg-yellow-100 text-yellow-800' };
      case 'review':
        return { label: 'Ready for Review', color: 'bg-green-100 text-green-800' };
      case 'completed':
        return { label: 'Completed', color: 'bg-gray-100 text-gray-800' };
    }
  };

  // Get document status label and color
  const getDocumentStatusInfo = (status: Document['status']) => {
    switch (status) {
      case 'pending':
        return { label: 'Pending Review', color: 'bg-yellow-100 text-yellow-800' };
      case 'reviewed':
        return { label: 'Reviewed', color: 'bg-blue-100 text-blue-800' };
      case 'approved':
        return { label: 'Approved', color: 'bg-green-100 text-green-800' };
      case 'rejected':
        return { label: 'Rejected', color: 'bg-red-100 text-red-800' };
    }
  };

  // Format date to more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IE', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Cases list */}
        <div className={`${selectedCase ? 'hidden md:block md:w-1/3' : 'w-full'}`}>
          <div className="mb-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">My Cases</h1>
            <Link 
              href="/solicitors/cases/new" 
              className="px-3 py-1 bg-[#2B5273] text-white text-sm rounded-md flex items-center"
            >
              <FiFilePlus className="mr-1" />
              New Case
            </Link>
          </div>

          <div className="mb-4 flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search cases..."
                className="pl-10 pr-4 py-2 border rounded-md w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | LegalCase['status'])}
              className="pl-4 pr-10 py-2 border rounded-md w-full sm:w-40"
            >
              <option value="all">All Cases</option>
              <option value="new">New</option>
              <option value="in_progress">In Progress</option>
              <option value="review">Review</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {filteredCases.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No cases match your search.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredCases.map(legalCase => {
                const statusInfo = getCaseStatusInfo(legalCase.status);
                
                return (
                  <div 
                    key={legalCase.id}
                    className={`border rounded-lg p-4 cursor-pointer hover:bg-gray-50 ${
                      selectedCase?.id === legalCase.id ? 'border-[#2B5273] bg-blue-50' : ''
                    }`}
                    onClick={() => handleOpenCase(legalCase)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{legalCase.clientName}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{legalCase.propertyAddress}</p>
                    <p className="text-sm text-gray-500 mb-3">Agent: {legalCase.agentName}</p>
                    
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center text-gray-500">
                        <FiCalendar className="mr-1" size={14} />
                        <span>Due: {formatDate(legalCase.dueDate)}</span>
                      </div>
                      <span className="font-medium">{formatPrice(legalCase.price)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Case detail */}
        {selectedCase && (
          <div className="md:w-2/3 md:pl-6">
            <div className="md:hidden mb-4">
              <button 
                className="flex items-center text-[#2B5273]"
                onClick={() => setSelectedCase(null)}
              >
                <svg 
                  className="w-5 h-5 mr-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M15 19l-7-7 7-7" 
                  />
                </svg>
                Back to cases
              </button>
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6 border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-[#2B5273]">{selectedCase.clientName}</h2>
                    <p className="text-gray-600">{selectedCase.propertyAddress}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCaseStatusInfo(selectedCase.status).color}`}>
                    {getCaseStatusInfo(selectedCase.status).label}
                  </span>
                </div>
                
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 text-sm">
                  <div>
                    <p className="text-gray-500">Developer</p>
                    <p className="font-medium">{selectedCase.developerName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Agent</p>
                    <p className="font-medium">{selectedCase.agentName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Price</p>
                    <p className="font-medium">{formatPrice(selectedCase.price)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Due Date</p>
                    <p className="font-medium">{formatDate(selectedCase.dueDate)}</p>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4 border-b bg-gray-50">
                <h3 className="text-lg font-semibold mb-2">Documents</h3>
                <div className="space-y-2">
                  {selectedCase.documents.map(document => {
                    const docStatusInfo = getDocumentStatusInfo(document.status);
                    
                    return (
                      <div 
                        key={document.id}
                        className="bg-white p-3 rounded border flex items-center justify-between cursor-pointer hover:bg-gray-50"
                        onClick={() => handleOpenDocument(document)}
                      >
                        <div className="flex items-center">
                          <FiFileText className="text-[#2B5273] mr-3" size={20} />
                          <div>
                            <p className="font-medium">{document.name}</p>
                            <p className="text-xs text-gray-500">
                              Uploaded by {document.uploadedBy} on {formatDate(document.uploadDate)}
                            </p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${docStatusInfo.color}`}>
                          {docStatusInfo.label}
                        </span>
                      </div>
                    );
                  })}
                  
                  <button className="mt-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md flex items-center text-sm w-full justify-center">
                    <FiPaperclip className="mr-2" />
                    Upload Document
                  </button>
                </div>
              </div>
              
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold mb-2">Tasks</h3>
                <div className="space-y-2">
                  {selectedCase.tasks.map(task => (
                    <div 
                      key={task.id}
                      className="p-3 rounded border flex items-start"
                    >
                      <div className="mr-3 mt-0.5">
                        {task.completed ? (
                          <FiCheckCircle className="text-green-500" size={18} />
                        ) : (
                          task.priority === 'high' ? (
                            <FiAlertCircle className="text-red-500" size={18} />
                          ) : (
                            <FiClock className="text-yellow-500" size={18} />
                          )
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                          {task.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          Due: {formatDate(task.dueDate)}
                        </p>
                      </div>
                      <div>
                        {!task.completed && (
                          <button className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            Mark Complete
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  <button className="mt-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md flex items-center text-sm w-full justify-center">
                    <FiFilePlus className="mr-2" />
                    Add Task
                  </button>
                </div>
              </div>
              
              <div className="p-6 flex justify-between">
                <Link 
                  href={`/solicitors/cases/${selectedCase.id}/details`}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md flex items-center text-sm"
                >
                  View Full Details
                </Link>
                
                <div className="space-x-2">
                  <Link
                    href={`/solicitors/cases/${selectedCase.id}/chat`}
                    className="px-4 py-2 bg-white border border-[#2B5273] text-[#2B5273] rounded-md flex items-center text-sm"
                  >
                    <FiMessageCircle className="mr-2" />
                    Message Client
                  </Link>
                  
                  <button
                    className="px-4 py-2 bg-[#2B5273] text-white rounded-md flex items-center text-sm"
                  >
                    Update Status
                    <FiArrowRight className="ml-2" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Document Preview Modal */}
      {showDocumentModal && selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">{selectedDocument.name}</h2>
              <button 
                onClick={() => setShowDocumentModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-4 bg-gray-100 flex items-center justify-center">
              <div className="bg-white shadow-lg w-full max-w-md aspect-[3/4] flex items-center justify-center">
                <p className="text-gray-500">Document preview would appear here</p>
              </div>
            </div>
            
            <div className="p-4 border-t flex justify-between">
              <div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDocumentStatusInfo(selectedDocument.status).color}`}>
                  {getDocumentStatusInfo(selectedDocument.status).label}
                </span>
              </div>
              
              <div className="space-x-2">
                <button
                  className="px-4 py-2 bg-white border border-red-500 text-red-500 rounded-md text-sm"
                >
                  Reject
                </button>
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded-md text-sm"
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 