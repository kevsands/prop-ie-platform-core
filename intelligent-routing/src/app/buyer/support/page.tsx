'use client';

import { useState } from 'react';
import { Search, HelpCircle, MessageCircle, Phone, Mail, Book, FileText, Video, ChevronRight, Clock, User, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface GuideItem {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'pdf';
  readTime: number;
}

interface TicketItem {
  id: string;
  subject: string;
  status: 'open' | 'pending' | 'resolved';
  lastUpdate: Date;
  priority: 'low' | 'medium' | 'high';
}

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showTicketForm, setShowTicketForm] = useState(false);
  
  // Mock FAQ data
  const faqItems: FAQItem[] = [
    {
      id: '1',
      question: 'How do I apply for Help-to-Buy (HTB)?',
      answer: 'You can apply for Help-to-Buy through our platform by going to the HTB section in your dashboard. You\'ll need to provide proof of income, savings, and select an eligible property. The application typically takes 2-3 weeks to process.',
      category: 'financing'
    },
    {
      id: '2',
      question: 'What documents do I need for property viewing?',
      answer: 'For property viewings, bring: Photo ID, Proof of funds or mortgage approval in principle, List of questions for the agent, and your PROP platform viewing reference number.',
      category: 'viewing'
    },
    {
      id: '3',
      question: 'How does the deposit payment work?',
      answer: 'Deposits are typically 10% of the purchase price. Through PROP, you can securely pay your deposit online. It\'s held in an escrow account until completion. Always verify payment instructions before transferring funds.',
      category: 'payments'
    },
    {
      id: '4',
      question: 'What is the property buying process timeline?',
      answer: 'Typically: 1) Property search (1-3 months), 2) Offer and acceptance (1-2 weeks), 3) Legal process and surveys (8-12 weeks), 4) Exchange contracts (1 day), 5) Completion (2-4 weeks after exchange).',
      category: 'process'
    },
    {
      id: '5',
      question: 'How do I cancel a viewing appointment?',
      answer: 'You can cancel viewings up to 24 hours before the scheduled time through your dashboard or by contacting the agent directly. Last-minute cancellations should be made by phone.',
      category: 'viewing'
    }
  ];
  
  // Mock guides data
  const guides: GuideItem[] = [
    {
      id: '1',
      title: 'First-Time Buyer Complete Guide',
      description: 'Everything you need to know about buying your first property in Ireland',
      type: 'pdf',
      readTime: 30
    },
    {
      id: '2',
      title: 'Property Viewing Checklist',
      description: 'What to look for and questions to ask during property viewings',
      type: 'article',
      readTime: 10
    },
    {
      id: '3',
      title: 'Understanding Mortgages',
      description: 'A comprehensive video guide to mortgage types and applications',
      type: 'video',
      readTime: 20
    }
  ];
  
  // Mock tickets data
  const tickets: TicketItem[] = [
    {
      id: '1',
      subject: 'HTB Application Status',
      status: 'pending',
      lastUpdate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      priority: 'medium'
    },
    {
      id: '2',
      subject: 'Payment verification issue',
      status: 'resolved',
      lastUpdate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      priority: 'high'
    }
  ];
  
  // Filter FAQs based on search and category
  const filteredFAQs = faqItems.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'resolved': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };
  
  return (
    <div className="flex-1 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Help & Support</h1>
          <p className="text-gray-600 mt-1">Find answers, guides, and contact our support team</p>
        </div>
        
        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => setShowTicketForm(true)}
            className="bg-blue-600 text-white rounded-lg p-4 flex items-center gap-3 hover:bg-blue-700 transition-colors"
          >
            <MessageCircle className="h-6 w-6" />
            <div className="text-left">
              <p className="font-semibold">New Support Ticket</p>
              <p className="text-sm opacity-90">Get personalized help</p>
            </div>
          </button>
          
          <a href="tel:+353-1-234-5678" className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
            <Phone className="h-6 w-6 text-gray-600" />
            <div className="text-left">
              <p className="font-semibold text-gray-900">Call Support</p>
              <p className="text-sm text-gray-600">Mon-Fri 9am-6pm</p>
            </div>
          </a>
          
          <a href="mailto:support@prop.ie" className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
            <Mail className="h-6 w-6 text-gray-600" />
            <div className="text-left">
              <p className="font-semibold text-gray-900">Email Us</p>
              <p className="text-sm text-gray-600">support@prop.ie</p>
            </div>
          </a>
          
          <button className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
            <Video className="h-6 w-6 text-gray-600" />
            <div className="text-left">
              <p className="font-semibold text-gray-900">Live Chat</p>
              <p className="text-sm text-gray-600">Available now</p>
            </div>
          </button>
        </div>
        
        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for help..."
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            {/* FAQ Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Frequently Asked Questions</h2>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="all">All Categories</option>
                  <option value="financing">Financing</option>
                  <option value="viewing">Property Viewing</option>
                  <option value="payments">Payments</option>
                  <option value="process">Buying Process</option>
                </select>
              </div>
              
              <div className="space-y-4">
                {filteredFAQs.map((faq) => (
                  <div key={faq.id} className="bg-white rounded-lg border p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                    <div className="mt-4 flex items-center gap-4">
                      <button className="text-sm text-blue-600 hover:underline">Was this helpful?</button>
                      <button className="text-sm text-gray-600 hover:text-gray-800">Share</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Guides Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Helpful Guides</h2>
              <div className="grid gap-4">
                {guides.map((guide) => (
                  <div key={guide.id} className="bg-white rounded-lg border p-6 hover:shadow-lg transition-all cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {guide.type === 'pdf' && <FileText className="h-6 w-6 text-red-600 mt-0.5" />}
                        {guide.type === 'video' && <Video className="h-6 w-6 text-blue-600 mt-0.5" />}
                        {guide.type === 'article' && <Book className="h-6 w-6 text-green-600 mt-0.5" />}
                        <div>
                          <h3 className="font-semibold text-gray-900">{guide.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{guide.description}</p>
                          <p className="text-sm text-gray-500 mt-2">{guide.readTime} min read</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Tickets */}
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Your Tickets</h3>
                <button
                  onClick={() => setShowTicketForm(true)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  View All
                </button>
              </div>
              
              {tickets.length > 0 ? (
                <div className="space-y-3">
                  {tickets.map((ticket) => (
                    <div key={ticket.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{ticket.subject}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(ticket.status)}`}>
                          {ticket.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Updated {format(ticket.lastUpdate, 'MMM d')}</span>
                        <span className={getPriorityColor(ticket.priority)}>{ticket.priority} priority</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No active tickets</p>
              )}
            </div>
            
            {/* Contact Information */}
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Need More Help?</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Phone Support</p>
                    <p className="text-sm text-gray-600">+353 1 234 5678</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Email Support</p>
                    <p className="text-sm text-gray-600">support@prop.ie</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Office Hours</p>
                    <p className="text-sm text-gray-600">Mon-Fri: 9am-6pm</p>
                    <p className="text-sm text-gray-600">Sat: 10am-4pm</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Emergency Contact */}
            <div className="bg-red-50 rounded-lg border border-red-200 p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 mb-2">Emergency Support</h3>
                  <p className="text-sm text-red-800 mb-3">
                    For urgent issues outside office hours
                  </p>
                  <p className="font-semibold text-red-900">+353 87 999 1111</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Support Ticket Modal */}
        {showTicketForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Create Support Ticket</h2>
                  <button
                    onClick={() => setShowTicketForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <form className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>Technical Issue</option>
                    <option>Payment Problem</option>
                    <option>Account Access</option>
                    <option>Property Viewing</option>
                    <option>Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Brief description of your issue"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Please provide as much detail as possible..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Attachments</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <button type="button" className="text-blue-600 hover:underline">
                      Click to upload files
                    </button>
                    <p className="text-sm text-gray-500 mt-1">or drag and drop</p>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Submit Ticket
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowTicketForm(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}