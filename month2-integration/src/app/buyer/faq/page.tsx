'use client';

import { useState } from 'react';
import { 
  Search, 
  HelpCircle, 
  ChevronDown, 
  ChevronRight, 
  BookOpen, 
  Home, 
  Euro, 
  FileText, 
  Shield, 
  Calendar, 
  Phone, 
  Mail, 
  MessageSquare, 
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Info,
  Heart,
  Building2,
  CreditCard,
  Scale,
  Users,
  Clock,
  Target
} from 'lucide-react';
import Link from 'next/link';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  keywords: string[];
  relatedLinks?: Array<{
    title: string;
    url: string;
    type: 'internal' | 'external';
  }>;
}

interface FAQCategory {
  id: string;
  name: string;
  icon: any;
  color: string;
  description: string;
}

export default function BuyerFAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const categories: FAQCategory[] = [
    {
      id: 'all',
      name: 'All Categories',
      icon: BookOpen,
      color: 'gray',
      description: 'Browse all frequently asked questions'
    },
    {
      id: 'getting-started',
      name: 'Getting Started',
      icon: Target,
      color: 'blue',
      description: 'First steps and account setup'
    },
    {
      id: 'property-search',
      name: 'Property Search',
      icon: Home,
      color: 'green',
      description: 'Finding and viewing properties'
    },
    {
      id: 'financing',
      name: 'Financing & HTB',
      icon: Euro,
      color: 'amber',
      description: 'Mortgages and Help-to-Buy scheme'
    },
    {
      id: 'legal-process',
      name: 'Legal Process',
      icon: Scale,
      color: 'purple',
      description: 'Contracts, solicitors, and legal requirements'
    },
    {
      id: 'documents',
      name: 'Documents',
      icon: FileText,
      color: 'indigo',
      description: 'Required documentation and verification'
    },
    {
      id: 'payments',
      name: 'Payments',
      icon: CreditCard,
      color: 'pink',
      description: 'Deposits, payments, and transactions'
    },
    {
      id: 'support',
      name: 'Support',
      icon: MessageSquare,
      color: 'teal',
      description: 'Getting help and contacting support'
    }
  ];

  const faqItems: FAQItem[] = [
    // Getting Started
    {
      id: 'gs-1',
      question: 'How do I create a buyer account?',
      answer: 'Creating a buyer account is simple. Click "Register" on our homepage and choose "First-Time Buyer" or "Property Buyer". You\'ll need to provide basic information including your name, email, phone number, and verify your identity. Once registered, you\'ll have access to all buyer portal features including property search, mortgage calculators, and document management.',
      category: 'getting-started',
      keywords: ['register', 'account', 'sign up', 'create'],
      relatedLinks: [
        { title: 'Register Now', url: '/buyer/register', type: 'internal' },
        { title: 'Buyer Portal Overview', url: '/buyer/overview', type: 'internal' }
      ]
    },
    {
      id: 'gs-2',
      question: 'What is the buyer journey process?',
      answer: 'Our buyer journey consists of 6 main phases: Planning (budget assessment and readiness), Financing (mortgage pre-approval and HTB application), Property Search (finding and viewing properties), Reservation (securing your chosen property), Legal Process (contract review and signing), and Completion (final payment and key handover). Each phase has specific tasks and milestones to guide you through the process.',
      category: 'getting-started',
      keywords: ['journey', 'process', 'phases', 'steps'],
      relatedLinks: [
        { title: 'View My Journey', url: '/buyer/journey', type: 'internal' },
        { title: 'Planning Phase Guide', url: '/buyer/journey/planning', type: 'internal' }
      ]
    },

    // Property Search
    {
      id: 'ps-1',
      question: 'How do I search for properties?',
      answer: 'Use our advanced property search to filter by location, price range, property type, bedrooms, and special features like HTB eligibility. You can save properties to your favorites, compare multiple properties, and set up alerts for new listings that match your criteria. Our AI-powered recommendations also suggest properties based on your preferences and budget.',
      category: 'property-search',
      keywords: ['search', 'find', 'properties', 'filter'],
      relatedLinks: [
        { title: 'Search Properties', url: '/properties', type: 'internal' },
        { title: 'Saved Properties', url: '/buyer/saved-properties', type: 'internal' }
      ]
    },
    {
      id: 'ps-2',
      question: 'How do I book a property viewing?',
      answer: 'To book a viewing, visit the property detail page and click "Book Viewing". Choose your preferred date and time from available slots. You\'ll receive a confirmation email with viewing details, location, and what to bring. Virtual tours are also available for most properties. Our team will contact you 24 hours before your viewing to confirm details.',
      category: 'property-search',
      keywords: ['viewing', 'book', 'appointment', 'visit'],
      relatedLinks: [
        { title: 'My Appointments', url: '/buyer/appointments', type: 'internal' },
        { title: 'Viewing Checklist', url: '/buyer/guides', type: 'internal' }
      ]
    },

    // Financing & HTB
    {
      id: 'fin-1',
      question: 'What is Help-to-Buy and am I eligible?',
      answer: 'Help-to-Buy (HTB) is an Irish government scheme providing up to 20% of a new home\'s value (maximum €80,000) to eligible first-time buyers. To qualify, you must be a first-time buyer, purchasing a new property under €500,000, have a deposit of at least 5%, and meet income limits. Our HTB calculator can determine your exact benefit amount.',
      category: 'financing',
      keywords: ['help-to-buy', 'htb', 'government', 'scheme', 'eligible'],
      relatedLinks: [
        { title: 'HTB Calculator', url: '/buyer/calculator/htb', type: 'internal' },
        { title: 'HTB Application', url: '/buyer/htb', type: 'internal' }
      ]
    },
    {
      id: 'fin-2',
      question: 'How do I get mortgage pre-approval?',
      answer: 'Mortgage pre-approval involves submitting your financial information to a lender who will assess how much they\'re willing to lend you. You\'ll need proof of income, bank statements, employment contract, and details of any debts. Our mortgage tracking system helps you monitor your application progress and reminds you of required documents.',
      category: 'financing',
      keywords: ['mortgage', 'pre-approval', 'loan', 'finance'],
      relatedLinks: [
        { title: 'Mortgage Tracker', url: '/buyer/mortgage', type: 'internal' },
        { title: 'Affordability Calculator', url: '/buyer/calculator', type: 'internal' }
      ]
    },
    {
      id: 'fin-3',
      question: 'What are the costs involved in buying a property?',
      answer: 'Property purchase costs include: deposit (typically 10% of purchase price), mortgage application fees (€300-500), legal fees (€1,500-3,000), survey and valuation (€400-600), mortgage protection insurance, and moving costs. Our calculators help estimate these costs based on your specific situation.',
      category: 'financing',
      keywords: ['costs', 'fees', 'expenses', 'deposit'],
      relatedLinks: [
        { title: 'Cost Calculator', url: '/buyer/calculator', type: 'internal' },
        { title: 'Payment Tracker', url: '/buyer/payments', type: 'internal' }
      ]
    },

    // Legal Process
    {
      id: 'legal-1',
      question: 'Do I need a solicitor?',
      answer: 'Yes, you are legally required to have a solicitor for property purchases in Ireland. Your solicitor will review contracts, conduct property searches, handle the legal transfer of ownership, and ensure all legal requirements are met. We can recommend qualified property solicitors in your area who are familiar with our platform.',
      category: 'legal-process',
      keywords: ['solicitor', 'lawyer', 'legal', 'required'],
      relatedLinks: [
        { title: 'Find a Solicitor', url: '/professionals/solicitors', type: 'internal' },
        { title: 'Legal Process Guide', url: '/buyer/journey/legal-process', type: 'internal' }
      ]
    },
    {
      id: 'legal-2',
      question: 'What happens during the contract signing process?',
      answer: 'Contract signing involves several steps: your solicitor reviews the contract terms, conducts property searches, negotiates any conditions, and explains all terms to you. Once you\'re satisfied, you\'ll sign the contract and pay the deposit. There\'s typically a cooling-off period (usually 5-7 days) during which you can withdraw without penalty.',
      category: 'legal-process',
      keywords: ['contract', 'signing', 'cooling-off', 'deposit'],
      relatedLinks: [
        { title: 'Contract Status', url: '/buyer/contracts', type: 'internal' },
        { title: 'Transaction Status', url: '/buyer/transaction', type: 'internal' }
      ]
    },

    // Documents
    {
      id: 'docs-1',
      question: 'What documents do I need to provide?',
      answer: 'Required documents include: photo ID (passport or driver\'s license), proof of address (utility bills or bank statements), proof of income (payslips or employment contract), bank statements (last 6 months), mortgage approval letter, and HTB approval (if applicable). Our document manager tracks what you\'ve uploaded and what\'s still needed.',
      category: 'documents',
      keywords: ['documents', 'required', 'upload', 'verification'],
      relatedLinks: [
        { title: 'Document Manager', url: '/buyer/documents', type: 'internal' },
        { title: 'Verification Status', url: '/buyer/verification', type: 'internal' }
      ]
    },
    {
      id: 'docs-2',
      question: 'How long does document verification take?',
      answer: 'Most documents are verified within 24-48 hours of upload. Complex documents like employment contracts or bank statements may take up to 3-5 business days. You\'ll receive email notifications when documents are approved or if additional information is needed. Critical documents for time-sensitive transactions are prioritized.',
      category: 'documents',
      keywords: ['verification', 'time', 'approval', 'review'],
      relatedLinks: [
        { title: 'Verification Status', url: '/buyer/verification', type: 'internal' },
        { title: 'Document Guidelines', url: '/buyer/guides', type: 'internal' }
      ]
    },

    // Payments
    {
      id: 'pay-1',
      question: 'When do I need to pay deposits?',
      answer: 'There are typically two deposit stages: a booking deposit (€500-1,000) to secure the property for 7-30 days, and a main deposit (usually 10% of purchase price) upon contract signing. The booking deposit is refundable if you withdraw during the cooling-off period. All deposits are held in regulated client accounts for security.',
      category: 'payments',
      keywords: ['deposit', 'payment', 'booking', 'refundable'],
      relatedLinks: [
        { title: 'Payment History', url: '/buyer/payments', type: 'internal' },
        { title: 'Payment Methods', url: '/buyer/payment-methods', type: 'internal' }
      ]
    },
    {
      id: 'pay-2',
      question: 'What payment methods are accepted?',
      answer: 'We accept credit/debit cards (Visa, Mastercard), bank transfers, and certified bank drafts. For large deposits, bank transfers are recommended for security. All payments are processed through secure, encrypted channels and held in regulated client accounts. Payment confirmations and receipts are provided for all transactions.',
      category: 'payments',
      keywords: ['payment methods', 'card', 'transfer', 'secure'],
      relatedLinks: [
        { title: 'Add Payment Method', url: '/buyer/payment-methods', type: 'internal' },
        { title: 'Transaction Security', url: '/buyer/faq#security', type: 'internal' }
      ]
    },

    // Support
    {
      id: 'sup-1',
      question: 'How can I contact support?',
      answer: 'Our buyer support team is available Monday-Friday 9AM-6PM and Saturdays 10AM-4PM. Contact us via: live chat in your buyer portal, email at buyer-support@prop.ie, phone at 1800-PROP-IE, or through the support ticket system. We aim to respond to all queries within 2 hours during business hours.',
      category: 'support',
      keywords: ['support', 'contact', 'help', 'phone', 'email'],
      relatedLinks: [
        { title: 'Contact Support', url: '/buyer/support', type: 'internal' },
        { title: 'Live Chat', url: '/buyer/messages', type: 'internal' }
      ]
    },
    {
      id: 'sup-2',
      question: 'What if I encounter technical issues?',
      answer: 'For technical issues: try refreshing the page, clearing your browser cache, or using a different browser. If problems persist, contact our technical support with details about your device, browser, and the specific issue. Screenshots are helpful. Most technical issues are resolved within 24 hours.',
      category: 'support',
      keywords: ['technical', 'issues', 'problems', 'bugs'],
      relatedLinks: [
        { title: 'Technical Support', url: '/buyer/support', type: 'internal' },
        { title: 'System Status', url: '/status', type: 'external' }
      ]
    }
  ];

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const filteredFAQs = faqItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (color: string) => {
    const colors = {
      gray: 'text-gray-600 bg-gray-100 border-gray-200',
      blue: 'text-blue-600 bg-blue-100 border-blue-200',
      green: 'text-green-600 bg-green-100 border-green-200',
      amber: 'text-amber-600 bg-amber-100 border-amber-200',
      purple: 'text-purple-600 bg-purple-100 border-purple-200',
      indigo: 'text-indigo-600 bg-indigo-100 border-indigo-200',
      pink: 'text-pink-600 bg-pink-100 border-pink-200',
      teal: 'text-teal-600 bg-teal-100 border-teal-200'
    };
    return colors[color as keyof typeof colors] || colors.gray;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h1>
          <p className="text-gray-600 mt-1">
            Find answers to common questions about buying property through our platform
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href="/buyer/support"
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            <MessageSquare size={16} className="inline mr-2" />
            Contact Support
          </Link>
          <Link 
            href="/buyer/guides"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <BookOpen size={16} className="inline mr-2" />
            Buyer Guides
          </Link>
        </div>
      </div>

      {/* Search and Categories */}
      <div className="bg-white rounded-lg border shadow-sm p-6">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search frequently asked questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`p-3 rounded-lg border-2 transition-all text-center ${
                selectedCategory === category.id
                  ? getCategoryColor(category.color)
                  : 'text-gray-600 bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <category.icon size={20} className="mx-auto mb-2" />
              <p className="text-xs font-medium">{category.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          {filteredFAQs.length} question{filteredFAQs.length !== 1 ? 's' : ''} found
          {selectedCategory !== 'all' && (
            <span className="ml-2 text-sm">
              in {categories.find(c => c.id === selectedCategory)?.name}
            </span>
          )}
        </p>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Clear search
          </button>
        )}
      </div>

      {/* FAQ Items */}
      <div className="space-y-4">
        {filteredFAQs.length === 0 ? (
          <div className="bg-white rounded-lg border shadow-sm p-8 text-center">
            <HelpCircle size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No questions found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or browse different categories
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Show All FAQs
            </button>
          </div>
        ) : (
          filteredFAQs.map((item) => {
            const isExpanded = expandedItems.has(item.id);
            const category = categories.find(c => c.id === item.category);
            
            return (
              <div key={item.id} className="bg-white rounded-lg border shadow-sm">
                <button
                  onClick={() => toggleExpanded(item.id)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-4 flex-1">
                    {category && (
                      <div className={`p-2 rounded-lg ${getCategoryColor(category.color)}`}>
                        <category.icon size={20} />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {item.question}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {category?.name}
                      </p>
                    </div>
                  </div>
                  <div className="ml-4">
                    {isExpanded ? (
                      <ChevronDown size={20} className="text-gray-400" />
                    ) : (
                      <ChevronRight size={20} className="text-gray-400" />
                    )}
                  </div>
                </button>
                
                {isExpanded && (
                  <div className="px-6 pb-6">
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="text-gray-700 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                    
                    {item.relatedLinks && item.relatedLinks.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Related Links</h4>
                        <div className="flex flex-wrap gap-2">
                          {item.relatedLinks.map((link, index) => (
                            <Link
                              key={index}
                              href={link.url}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
                            >
                              {link.title}
                              {link.type === 'external' && <ExternalLink size={12} />}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Quick Contact Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">Still need help?</h3>
            <p className="text-blue-100">
              Our buyer support team is here to assist you with any questions
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              href="/buyer/support"
              className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors text-sm"
            >
              <MessageSquare size={16} className="inline mr-2" />
              Live Chat
            </Link>
            <a 
              href="tel:1800-PROP-IE"
              className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors text-sm"
            >
              <Phone size={16} className="inline mr-2" />
              Call Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}