"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FiArrowLeft, FiFileText, FiDownload } from 'react-icons/fi';
import ChatComponent, { 
  ChatMessage, 
  ChatParticipant, 
  Attachment 
} from '@/components/ui/ChatComponent';

// Define the mock case data
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
}

// Mock case data
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
  }
];

// Mock participants
const mockParticipants: Record<string, ChatParticipant[]> = {
  '1': [
    { id: 's1', name: 'Solicitor User', role: 'solicitor' },
    { id: 'b1', name: 'John Murphy', role: 'buyer' },
    { id: 'a1', name: 'James Doyle', role: 'agent' }
  ],
  '2': [
    { id: 's1', name: 'Solicitor User', role: 'solicitor' },
    { id: 'b2', name: 'Sarah O\'Connor', role: 'buyer' },
    { id: 'a1', name: 'James Doyle', role: 'agent' }
  ],
  '3': [
    { id: 's1', name: 'Solicitor User', role: 'solicitor' },
    { id: 'b3', name: 'Michael Kelly', role: 'buyer' },
    { id: 'a2', name: 'Mary O\'Sullivan', role: 'agent' }
  ]
};

// Mock chat messages
const mockMessages: Record<string, ChatMessage[]> = {
  '1': [
    {
      id: 'm1',
      content: 'Hello John, I have reviewed the purchase agreement and everything looks in order.',
      sender: { id: 's1', name: 'Solicitor User', role: 'solicitor' },
      timestamp: '2023-06-16T09:30:00',
      status: 'read'
    },
    {
      id: 'm2',
      content: 'Thank you for the update. Do I need to sign anything at this stage?',
      sender: { id: 'b1', name: 'John Murphy', role: 'buyer' },
      timestamp: '2023-06-16T09:32:00',
      status: 'read'
    },
    {
      id: 'm3',
      content: 'Not yet. I need to confirm a few details with the agent first, then I\'ll prepare the documents for signing.',
      sender: { id: 's1', name: 'Solicitor User', role: 'solicitor' },
      timestamp: '2023-06-16T09:35:00',
      status: 'read'
    },
    {
      id: 'm4',
      content: 'I\'ve received the property survey report. Let me attach it here for your review.',
      sender: { id: 's1', name: 'Solicitor User', role: 'solicitor' },
      timestamp: '2023-06-17T11:20:00',
      attachments: [
        {
          id: 'a1',
          name: 'Property_Survey_10_Maple_Avenue.pdf',
          type: 'document',
          url: '#',
          size: '2.4 MB'
        }
      ],
      status: 'read'
    },
    {
      id: 'm5',
      content: 'Thanks, I\'ll take a look. By the way, have you heard anything about the mortgage approval timeline?',
      sender: { id: 'b1', name: 'John Murphy', role: 'buyer' },
      timestamp: '2023-06-17T13:45:00',
      status: 'read'
    },
    {
      id: 'm6',
      content: 'The bank has confirmed they\'re processing your application. They said it should be approved within the next 7-10 business days.',
      sender: { id: 's1', name: 'Solicitor User', role: 'solicitor' },
      timestamp: '2023-06-17T14:10:00',
      status: 'read'
    }
  ],
  '2': [
    {
      id: 'm7',
      content: 'Hello Sarah, I\'ve reviewed all the documents for your property purchase and everything looks good to proceed.',
      sender: { id: 's1', name: 'Solicitor User', role: 'solicitor' },
      timestamp: '2023-06-01T10:15:00',
      status: 'read'
    },
    {
      id: 'm8',
      content: 'Great news! When can we proceed with the next steps?',
      sender: { id: 'b2', name: 'Sarah O\'Connor', role: 'buyer' },
      timestamp: '2023-06-01T10:20:00',
      status: 'read'
    },
    {
      id: 'm9',
      content: 'We\'re waiting on the title deed from the registry office. I\'ll let you know as soon as it arrives.',
      sender: { id: 's1', name: 'Solicitor User', role: 'solicitor' },
      timestamp: '2023-06-01T10:25:00',
      status: 'read'
    }
  ],
  '3': [
    {
      id: 'm10',
      content: 'Hello Michael, I\'ve been assigned to handle your property purchase at 5 Elm Court.',
      sender: { id: 's1', name: 'Solicitor User', role: 'solicitor' },
      timestamp: '2023-06-25T15:45:00',
      status: 'read'
    },
    {
      id: 'm11',
      content: 'Hi there. Thanks for reaching out. I\'m excited to get this process started.',
      sender: { id: 'b3', name: 'Michael Kelly', role: 'buyer' },
      timestamp: '2023-06-25T16:00:00',
      status: 'read'
    },
    {
      id: 'm12',
      content: 'Great! I\'ve received the purchase agreement from the agent. I\'ll review it and get back to you soon.',
      sender: { id: 's1', name: 'Solicitor User', role: 'solicitor' },
      timestamp: '2023-06-25T16:05:00',
      status: 'read'
    }
  ]
};

export default function SolicitorCaseChat() {
  const params = useParams();
  const caseId = params?.id as string;
  
  // Get the case, participants, and messages
  const legalCase = mockCases.find(c => c.id === caseId);
  const participants = mockParticipants[caseId] || [];
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages[caseId] || []);
  
  // Get the current user (for this demo, always the solicitor)
  const currentUser = participants.find(p => p.role === 'solicitor') || participants[0];
  
  // Handle send message
  const handleSendMessage = (content: string, files?: File[]) => {
    if (!content.trim() && (!files || files.length === 0)) return;
    
    // Create attachments from files (mock implementation)
    const attachments: Attachment[] | undefined = files?.map((file, index) => ({
      id: `new-att-${Date.now()}-${index}`,
      name: file.name,
      type: file.type.startsWith('image/') ? 'image' : 'document',
      url: '#', // In a real app, this would be a URL after uploading
      size: `${(file.size / 1024).toFixed(1)} KB`
    }));
    
    // Create the new message
    const newMessage: ChatMessage = {
      id: `m${Date.now()}`,
      content: content,
      sender: currentUser,
      timestamp: new Date().toISOString(),
      attachments,
      status: 'sent'
    };
    
    // Update messages
    setMessages([...messages, newMessage]);
    
    // In a real app, we would:
    // 1. Send the message to the backend
    // 2. Upload any attachments
    // 3. Update the UI with the new message once confirmed
    // 4. Handle status updates (sent → delivered → read)
    
    // Simulate message status updates
    setTimeout(() => {
      setMessages(prev => 
        prev.map(m => 
          m.id === newMessage.id ? { ...m, status: 'delivered' } : m
        )
      );
    }, 1000);
    
    setTimeout(() => {
      setMessages(prev => 
        prev.map(m => 
          m.id === newMessage.id ? { ...m, status: 'read' } : m
        )
      );
    }, 2000);
  };
  
  // If case not found
  if (!legalCase) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-2">Case Not Found</h1>
          <p className="text-gray-600 mb-4">The case you are looking for does not exist.</p>
          <Link 
            href="/solicitors/cases" 
            className="px-4 py-2 bg-[#2B5273] text-white rounded-md inline-flex items-center"
          >
            <FiArrowLeft className="mr-2" />
            Back to Cases
          </Link>
        </div>
      </div>
    );
  }
  
  // Get the client (buyer) participant
  const clientParticipant = participants.find(p => p.role === 'buyer');
  
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link 
          href={`/solicitors/cases/${caseId}`} 
          className="inline-flex items-center text-[#2B5273]"
        >
          <FiArrowLeft className="mr-2" />
          Back to Case
        </Link>
        
        <h1 className="text-2xl font-bold mt-2">
          Chat with {clientParticipant?.name || 'Client'}
        </h1>
        <p className="text-gray-600">
          {legalCase.propertyAddress}
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChatComponent
            messages={messages}
            participants={participants}
            currentUser={currentUser}
            onSendMessage={handleSendMessage}
            title={`Chat with ${clientParticipant?.name || 'Client'}`}
          />
        </div>
        
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="font-semibold">Case Information</h2>
          </div>
          
          <div className="p-4">
            <div className="mb-4">
              <h3 className="text-sm text-gray-500">Property</h3>
              <p className="font-medium">{legalCase.propertyAddress}</p>
            </div>
            
            <div className="mb-4">
              <h3 className="text-sm text-gray-500">Client</h3>
              <p className="font-medium">{legalCase.clientName}</p>
            </div>
            
            <div className="mb-4">
              <h3 className="text-sm text-gray-500">Agent</h3>
              <p className="font-medium">{legalCase.agentName}</p>
            </div>
            
            <div className="mb-4">
              <h3 className="text-sm text-gray-500">Status</h3>
              <p className="font-medium capitalize">{legalCase.status.replace('_', ' ')}</p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-sm text-gray-500">Due Date</h3>
              <p className="font-medium">
                {new Date(legalCase.dueDate).toLocaleDateString('en-IE', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </p>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Recent Documents</h3>
              
              <div className="space-y-2">
                <div className="border rounded p-3 flex items-center">
                  <FiFileText className="text-[#2B5273] mr-3" size={20} />
                  <div className="flex-1">
                    <p className="font-medium text-sm">Purchase Agreement</p>
                    <p className="text-xs text-gray-500">Uploaded 2 days ago</p>
                  </div>
                  <button className="p-2 text-gray-500 hover:text-gray-700">
                    <FiDownload size={18} />
                  </button>
                </div>
                
                <div className="border rounded p-3 flex items-center">
                  <FiFileText className="text-[#2B5273] mr-3" size={20} />
                  <div className="flex-1">
                    <p className="font-medium text-sm">Property Survey</p>
                    <p className="text-xs text-gray-500">Uploaded 1 day ago</p>
                  </div>
                  <button className="p-2 text-gray-500 hover:text-gray-700">
                    <FiDownload size={18} />
                  </button>
                </div>
              </div>
              
              <div className="mt-3">
                <Link 
                  href={`/solicitors/cases/${caseId}/documents`}
                  className="text-[#2B5273] text-sm font-medium hover:underline"
                >
                  View all documents
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 