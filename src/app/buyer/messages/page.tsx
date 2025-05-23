import React from 'react';
'use client';

import { useState } from 'react';
import { Search, Filter, Send, Paperclip, Star, Archive, Trash2, ChevronRight, User, Building, Home, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface Message {
  id: string;
  type: 'agent' | 'solicitor' | 'developer' | 'support';
  sender: string;
  senderRole: string;
  subject: string;
  preview: string;
  fullContent: string;
  timestamp: Date;
  isRead: boolean;
  isStarred: boolean;
  attachments?: string[];
  propertyRef?: string;
}

export default function MessagesPage() {
  const [selectedMessagesetSelectedMessage] = useState<Message | null>(null);
  const [searchQuerysetSearchQuery] = useState('');
  const [filterTypesetFilterType] = useState<string>('all');
  const [replyTextsetReplyText] = useState('');
  const [showComposesetShowCompose] = useState(false);

  // Mock messages data
  const messages: Message[] = [
    {
      id: '1',
      type: 'agent',
      sender: 'Sarah Johnson',
      senderRole: 'Property Agent',
      subject: 'Viewing Confirmed - Riverside Manor Unit 4B',
      preview: 'Your viewing for Unit 4B at Riverside Manor has been confirmed for...',
      fullContent: `Hi there,

Your viewing for Unit 4B at Riverside Manor has been confirmed for Saturday, December 16th at 2:00 PM.

The property features:
- 2 bedrooms, 2 bathrooms
- Modern open-plan kitchen
- Private balcony with river views
- Allocated parking space

Please bring:
- Photo ID
- Proof of funds or mortgage approval in principle
- Any questions you'd like to ask

Looking forward to seeing you there!

Best regards,
Sarah Johnson
Senior Property Consultant`,
      timestamp: new Date(Date.now() - 3600000),
      isRead: false,
      isStarred: false,
      propertyRef: 'RM-4B'
    },
    {
      id: '2',
      type: 'solicitor',
      sender: 'Michael O\'Brien',
      senderRole: 'Legal Advisor',
      subject: 'Contract Review Complete - Action Required',
      preview: 'I have completed the review of your purchase contract for...',
      fullContent: `Dear Client,

I have completed the review of your purchase contract for Unit 3A at Fitzgerald Gardens. 

Key findings:
1. All terms are standard and favorable
2. Deposit structure is in line with industry norms
3. Completion date set for Q2 2024

Action required:
- Please review the attached marked-up contract
- Sign where indicated (pages 4, 8, and 12)
- Return by December 20th to proceed

Please don't hesitate to call if you have any questions.

Kind regards,
Michael O'Brien
Senior Solicitor`,
      timestamp: new Date(Date.now() - 7200000),
      isRead: true,
      isStarred: true,
      attachments: ['Contract_Review_FG3A.pdf', 'Signing_Instructions.pdf'],
      propertyRef: 'FG-3A'
    },
    {
      id: '3',
      type: 'developer',
      sender: 'Fitzgerald Developments',
      senderRole: 'Developer Updates',
      subject: 'Construction Update - December 2023',
      preview: 'We\'re pleased to share the latest progress on Fitzgerald Gardens...',
      fullContent: `Dear Future Homeowner,

We're pleased to share the latest progress on Fitzgerald Gardens:

Phase 1 (Units 1-10):
- Structural work: 100% complete
- Interior fit-out: 85% complete
- Expected completion: February 2024

Phase 2 (Units 11-20):
- Foundation work: 100% complete
- Structural work: 60% complete
- On track for Q3 2024 completion

Site visits available every Saturday 10am-12pm.

Best regards,
The Fitzgerald Developments Team`,
      timestamp: new Date(Date.now() - 86400000),
      isRead: true,
      isStarred: false,
      attachments: ['Construction_Photos_Dec2023.pdf']
    },
    {
      id: '4',
      type: 'support',
      sender: 'PROP Support',
      senderRole: 'Customer Support',
      subject: 'Help-to-Buy Application Approved',
      preview: 'Congratulations! Your Help-to-Buy application has been approved...',
      fullContent: `Dear Valued Customer,

Congratulations! Your Help-to-Buy application has been approved.

Approved amount: €28,500
Property: Ballymakenny View - Unit 7C
Next steps:

1. Your solicitor will be notified
2. Funds will be available at closing
3. Review the attached terms and conditions

If you have any questions, please don't hesitate to contact us.

Best wishes,
PROP Support Team`,
      timestamp: new Date(Date.now() - 172800000),
      isRead: false,
      isStarred: true,
      attachments: ['HTB_Approval_Letter.pdf'],
      propertyRef: 'BV-7C'
    }
  ];

  // Filter messages based on search and filter
  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.preview.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.sender.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || message.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'agent': return <User className="h-5 w-5 text-blue-600" />\n  );
      case 'solicitor': return <Building className="h-5 w-5 text-purple-600" />\n  );
      case 'developer': return <Home className="h-5 w-5 text-green-600" />\n  );
      case 'support': return <Building className="h-5 w-5 text-orange-600" />\n  );
      default: return <User className="h-5 w-5 text-gray-600" />\n  );
    }
  };

  const handleReply = () => {
    if (replyText.trim() && selectedMessage) {
      // Handle reply submission

      setReplyText('');
    }
  };

  return (
    <div className="flex-1 h-screen flex">
      {/* Messages List */}
      <div className="w-full max-w-md bg-white border-r flex flex-col">
        {/* Header */}
        <div className="p-4 border-b">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Messages</h1>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e: any) => setSearchQuery(e.target.value)}
              placeholder="Search messages..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filterType === 'all' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('agent')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filterType === 'agent' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Agents
            </button>
            <button
              onClick={() => setFilterType('solicitor')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filterType === 'solicitor' 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Solicitors
            </button>
            <button
              onClick={() => setFilterType('developer')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filterType === 'developer' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Developers
            </button>
          </div>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto">
          {filteredMessages.map((message: any) => (
            <div
              key={message.id}
              onClick={() => setSelectedMessage(message)}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                !message.isRead ? 'bg-blue-50' : ''
              } ${selectedMessage?.id === message.id ? 'bg-gray-100' : ''}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  {getMessageIcon(message.type)}
                  <div>
                    <p className="font-medium text-gray-900">{message.sender}</p>
                    <p className="text-sm text-gray-500">{message.senderRole}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {message.isStarred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                  <span className="text-xs text-gray-500">
                    {format(message.timestamp, 'MMM d')}
                  </span>
                </div>
              </div>
              <p className={`font-medium text-gray-900 mb-1 ${!message.isRead ? 'font-semibold' : ''}`}>
                {message.subject}
              </p>
              <p className="text-sm text-gray-600 line-clamp-2">{message.preview}</p>
              {message.attachments && (
                <div className="flex items-center gap-1 mt-2">
                  <Paperclip className="h-4 w-4 text-gray-400" />
                  <span className="text-xs text-gray-500">{message.attachments.length} attachment(s)</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Message Detail */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {selectedMessage ? (
          <>
            {/* Message Header */}
            <div className="bg-white p-4 border-b">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{selectedMessage.subject}</h2>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-2">
                      {getMessageIcon(selectedMessage.type)}
                      <span className="text-gray-700">{selectedMessage.sender}</span>
                      <span className="text-gray-500">({selectedMessage.senderRole})</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      {format(selectedMessage.timestamp, 'MMM d, yyyy - h:mm a')}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      const updatedMessage = {...selectedMessage, isStarred: !selectedMessage.isStarred};
                      setSelectedMessage(updatedMessage);
                    }
                    className={`p-2 rounded-lg hover:bg-gray-100 ${selectedMessage.isStarred ? 'text-yellow-500' : 'text-gray-500'}`}
                  >
                    <Star className={`h-5 w-5 ${selectedMessage.isStarred ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
                    <Archive className="h-5 w-5" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Message Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-gray-700">
                    {selectedMessage.fullContent}
                  </pre>
                </div>

                {/* Attachments */}
                {selectedMessage.attachments && selectedMessage.attachments.length> 0 && (
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Attachments</h3>
                    <div className="space-y-2">
                      {selectedMessage.attachments.map((attachmentindex: any) => (
                        <div 
                          key={index} 
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                          <Paperclip className="h-5 w-5 text-gray-500" />
                          <span className="text-sm text-gray-700 flex-1">{attachment}</span>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Reply Box */}
            <div className="bg-white p-4 border-t">
              <div className="flex gap-3">
                <textarea
                  value={replyText}
                  onChange={(e: any) => setReplyText(e.target.value)}
                  placeholder="Type your reply..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleReply}
                    disabled={!replyText.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <Paperclip className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <p className="text-lg font-medium mb-2">No message selected</p>
              <p className="text-sm">Choose a message from the list to view its content</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}