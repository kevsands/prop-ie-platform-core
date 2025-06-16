'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  CreditCard, 
  Shield, 
  Users, 
  Clock, 
  Home, 
  Eye, 
  Download, 
  Lock, 
  Smartphone, 
  Globe, 
  Database, 
  Workflow, 
  DollarSign, 
  Calendar, 
  Building, 
  UserCheck, 
  Zap, 
  Brain, 
  ChevronRight, 
  Play, 
  Star, 
  Award, 
  Target, 
  TrendingUp, 
  RefreshCw, 
  MessageSquare, 
  Mail, 
  Phone, 
  Video, 
  BookOpen, 
  Clipboard, 
  PenTool, 
  Key, 
  Truck, 
  Coffee, 
  MapPin, 
  Calculator, 
  Heart, 
  Lightbulb 
} from 'lucide-react';

const buyingSteps = [
  {
    step: 1,
    title: 'Discovery & Search',
    duration: '1-2 weeks',
    description: 'Find your perfect property using our AI-powered search',
    activities: [
      'Browse properties with AI recommendations',
      'Virtual property tours and 3D walkthroughs',
      'Compare properties side-by-side',
      'Calculate affordability with our mortgage calculator',
      'Save favorites and create shortlists'
    ],
    documents: ['Property brochures', 'Floor plans', 'Area guides'],
    dataFlow: [
      'User preferences captured',
      'AI matching algorithm activated',
      'Property viewing analytics tracked',
      'Interest signals recorded'
    ],
    icon: <Eye className="w-6 h-6" />,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    step: 2,
    title: 'Property Selection',
    duration: '3-5 days',
    description: 'Choose your property and customize options',
    activities: [
      'Book virtual or in-person viewing',
      'Speak with sales consultant',
      'Choose property customizations (PROP Choice)',
      'Review development timeline',
      'Understand Help-to-Buy eligibility'
    ],
    documents: ['Property specification', 'Customization options', 'HTB forms'],
    dataFlow: [
      'Viewing preferences recorded',
      'Customization choices saved',
      'Pricing calculations updated',
      'Lead qualification completed'
    ],
    icon: <Home className="w-6 h-6" />,
    color: 'from-green-500 to-emerald-500'
  },
  {
    step: 3,
    title: 'Digital Reservation',
    duration: '30 minutes',
    description: 'Secure your property with our instant online reservation',
    activities: [
      'Complete digital reservation form',
      'Upload ID and proof of funds',
      'Pay reservation fee (€5,000-€10,000)',
      'Receive instant confirmation',
      'Property removed from market'
    ],
    documents: ['Reservation agreement', 'ID documents', 'Proof of funds'],
    dataFlow: [
      'KYC verification initiated',
      'Payment processing',
      'Property status updated to "Reserved"',
      'Automated notifications sent'
    ],
    icon: <CreditCard className="w-6 h-6" />,
    color: 'from-purple-500 to-pink-500'
  },
  {
    step: 4,
    title: 'Mortgage & Finance',
    duration: '2-4 weeks',
    description: 'Secure your mortgage with our partner network',
    activities: [
      'Mortgage broker consultation',
      'Application submitted to lenders',
      'Valuation arranged',
      'Approval in principle received',
      'Help-to-Buy application (if applicable)'
    ],
    documents: ['Mortgage application', 'Payslips', 'Bank statements', 'HTB approval'],
    dataFlow: [
      'Financial data encrypted and submitted',
      'Lender API integrations',
      'Valuation results processed',
      'Approval status tracking'
    ],
    icon: <Calculator className="w-6 h-6" />,
    color: 'from-yellow-500 to-orange-500'
  },
  {
    step: 5,
    title: 'Legal Process',
    duration: '4-8 weeks',
    description: 'Solicitor handles all legal aspects digitally',
    activities: [
      'Solicitor appointment from our panel',
      'Contract review and explanation',
      'Searches and surveys arranged',
      'Digital contract signing',
      'Exchange of contracts'
    ],
    documents: ['Sale contract', 'Legal searches', 'Building survey', 'Title deeds'],
    dataFlow: [
      'Legal documents digitized',
      'Solicitor portal access',
      'Contract management system',
      'Digital signature capture'
    ],
    icon: <FileText className="w-6 h-6" />,
    color: 'from-indigo-500 to-blue-500'
  },
  {
    step: 6,
    title: 'Construction Updates',
    duration: '6-18 months',
    description: 'Track your property as it\'s built',
    activities: [
      'Monthly construction updates',
      'Photo and video progress reports',
      'Quality inspection reports',
      'Snag list management',
      'Completion date notifications'
    ],
    documents: ['Progress reports', 'Quality certificates', 'Completion notice'],
    dataFlow: [
      'Construction milestones tracked',
      'Photo metadata processed',
      'Progress notifications automated',
      'Completion predictions updated'
    ],
    icon: <Building className="w-6 h-6" />,
    color: 'from-teal-500 to-green-500'
  },
  {
    step: 7,
    title: 'Completion & Handover',
    duration: '1-2 weeks',
    description: 'Final steps to get your keys',
    activities: [
      'Final inspection walkthrough',
      'Snagging items addressed',
      'Final mortgage drawdown',
      'Digital key handover',
      'Move-in coordination'
    ],
    documents: ['Completion statement', 'Property certificate', 'Warranty documents'],
    dataFlow: [
      'Final payment processing',
      'Ownership transfer recorded',
      'Warranty system activated',
      'Customer portal updated'
    ],
    icon: <Key className="w-6 h-6" />,
    color: 'from-emerald-500 to-teal-500'
  },
  {
    step: 8,
    title: 'Post-Sale Support',
    duration: 'Ongoing',
    description: 'Continued support as a PROP.ie homeowner',
    activities: [
      'Warranty claim management',
      'Home maintenance reminders',
      'Property value tracking',
      'Community building',
      'Referral rewards program'
    ],
    documents: ['Warranty claims', 'Maintenance schedules', 'Home insurance'],
    dataFlow: [
      'Property value monitoring',
      'Maintenance alerts automated',
      'Warranty claim tracking',
      'Customer satisfaction surveys'
    ],
    icon: <Heart className="w-6 h-6" />,
    color: 'from-pink-500 to-red-500'
  }
];

const digitalFeatures = [
  {
    title: 'Digital-First Experience',
    description: 'Complete your entire property purchase online with our secure platform',
    features: [
      'AI-powered property matching',
      'Virtual reality property tours',
      'Digital document management',
      'E-signature capabilities',
      'Real-time progress tracking'
    ],
    icon: <Smartphone className="w-8 h-8" />,
    color: 'bg-blue-500'
  },
  {
    title: 'Secure Data Management',
    description: 'Bank-level security protecting your personal and financial information',
    features: [
      'End-to-end encryption',
      'GDPR compliant storage',
      'Multi-factor authentication',
      'Audit trail maintenance',
      'Secure document sharing'
    ],
    icon: <Shield className="w-8 h-8" />,
    color: 'bg-green-500'
  },
  {
    title: 'Automated Workflows',
    description: 'Streamlined processes that save time and reduce errors',
    features: [
      'KYC verification automation',
      'Mortgage application routing',
      'Legal document generation',
      'Progress notifications',
      'Payment processing'
    ],
    icon: <Workflow className="w-8 h-8" />,
    color: 'bg-purple-500'
  },
  {
    title: 'Expert Support Network',
    description: 'Professional guidance every step of the way',
    features: [
      'Dedicated sales consultants',
      'Vetted mortgage brokers',
      'Panel solicitors',
      'Construction managers',
      '24/7 customer support'
    ],
    icon: <Users className="w-8 h-8" />,
    color: 'bg-orange-500'
  }
];

const propChoiceOptions = [
  {
    category: 'Interior Design',
    options: [
      'Kitchen upgrades (€5,000 - €15,000)',
      'Flooring choices (€2,000 - €8,000)',
      'Bathroom finishes (€3,000 - €12,000)',
      'Paint colors (€500 - €2,000)',
      'Electrical upgrades (€1,000 - €5,000)'
    ],
    icon: <PenTool className="w-6 h-6" />
  },
  {
    category: 'Furniture Packages',
    options: [
      'Complete furnishing (€15,000 - €35,000)',
      'Kitchen appliances (€3,000 - €8,000)',
      'Bedroom sets (€2,000 - €6,000)',
      'Living room packages (€4,000 - €10,000)',
      'Home office setup (€1,500 - €4,000)'
    ],
    icon: <Coffee className="w-6 h-6" />
  },
  {
    category: 'Technology',
    options: [
      'Smart home system (€2,000 - €8,000)',
      'High-speed internet pre-install (€500)',
      'EV charging point (€1,200 - €2,500)',
      'Security system (€1,000 - €3,000)',
      'Home automation (€1,500 - €5,000)'
    ],
    icon: <Zap className="w-6 h-6" />
  },
  {
    category: 'Exterior',
    options: [
      'Garden landscaping (€3,000 - €15,000)',
      'Patio installation (€2,000 - €8,000)',
      'Driveway upgrades (€1,500 - €5,000)',
      'Fencing options (€1,000 - €4,000)',
      'Outdoor lighting (€800 - €3,000)'
    ],
    icon: <MapPin className="w-6 h-6" />
  }
];

const documentFlow = [
  {
    stage: 'Initial Interest',
    documents: ['Property brochure', 'Floor plans', 'Price list', 'Development timeline'],
    storage: 'Marketing system',
    access: 'Public/Guest',
    automation: 'Auto-generated from CMS'
  },
  {
    stage: 'Reservation',
    documents: ['Reservation form', 'ID verification', 'Proof of funds', 'Booking receipt'],
    storage: 'Secure customer portal',
    access: 'Customer + Sales team',
    automation: 'KYC verification, payment processing'
  },
  {
    stage: 'Mortgage Application',
    documents: ['Income documents', 'Bank statements', 'Credit report', 'Valuation report'],
    storage: 'Encrypted finance portal',
    access: 'Customer + Broker + Lender',
    automation: 'Document verification, lender API submission'
  },
  {
    stage: 'Legal Process',
    documents: ['Sale contract', 'Property searches', 'Survey report', 'Title investigation'],
    storage: 'Legal management system',
    access: 'Customer + Solicitor + Developer',
    automation: 'Contract generation, search ordering'
  },
  {
    stage: 'Construction',
    documents: ['Progress photos', 'Quality reports', 'Completion certificates', 'Snag lists'],
    storage: 'Project management system',
    access: 'Customer + Construction team',
    automation: 'Progress tracking, notification triggers'
  },
  {
    stage: 'Completion',
    documents: ['Final inspection', 'Keys handover', 'Warranty documents', 'Home manual'],
    storage: 'Customer care system',
    access: 'Customer + After-sales team',
    automation: 'Warranty activation, maintenance scheduling'
  }
];

const helpToBuyProcess = [
  {
    step: 'Eligibility Check',
    description: 'Verify you meet HTB criteria',
    requirements: ['First-time buyer', 'Property under €500k', 'Minimum 10% deposit', 'Irish resident'],
    automation: 'Instant eligibility calculator'
  },
  {
    step: 'Application Submission',
    description: 'Complete HTB application online',
    requirements: ['Income verification', 'Employment confirmation', 'Bank statements', 'Property details'],
    automation: 'Digital form with document upload'
  },
  {
    step: 'Revenue Approval',
    description: 'Revenue approve your HTB claim',
    requirements: ['Processing time: 2-4 weeks', 'Additional documents if requested'],
    automation: 'Status tracking and notifications'
  },
  {
    step: 'HTB Integration',
    description: 'HTB amount included in purchase',
    requirements: ['30% of property value (max €30k)', 'Integrated with mortgage'],
    automation: 'Automatic calculation and processing'
  }
];

export default function BuyingGuidePage() {
  const [activeStepsetActiveStep] = useState(0);
  const [activeTabsetActiveTab] = useState('process');

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:32px_32px]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-full mb-6">
              <BookOpen className="w-4 h-4 mr-2 text-blue-300" />
              <span className="text-blue-300 font-medium">Complete Buying Guide</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Buy Off-Plan
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                100% Online
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Complete guide to purchasing your dream home off-plan using our revolutionary digital platform. 
              From search to keys, everything happens online with full transparency and security.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/properties/search"
                className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-xl"
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                href="#interactive-demo"
                className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-lg hover:bg-white/20 transition-all border border-white/30"
              >
                Watch Demo
                <Play className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Key Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center">
              <Clock className="w-8 h-8 text-blue-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">50% Faster</h3>
              <p className="text-gray-300">Complete process in weeks, not months</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center">
              <Shield className="w-8 h-8 text-green-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">100% Secure</h3>
              <p className="text-gray-300">Bank-level encryption and GDPR compliance</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center">
              <Brain className="w-8 h-8 text-purple-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">AI-Powered</h3>
              <p className="text-gray-300">Smart matching and automated workflows</p>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'process', label: 'Complete Process', icon: <Workflow className="w-4 h-4" /> },
              { id: 'documents', label: 'Document Flow', icon: <FileText className="w-4 h-4" /> },
              { id: 'technology', label: 'Technology', icon: <Brain className="w-4 h-4" /> },
              { id: 'prop-choice', label: 'PROP Choice', icon: <Star className="w-4 h-4" /> },
              { id: 'help-to-buy', label: 'Help to Buy', icon: <Heart className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Complete Process Section */}
      {activeTab === 'process' && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">8-Step Digital Journey</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Every step of your property purchase happens online with full transparency, security, and expert support
              </p>
            </div>

            {/* Interactive Process Timeline */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-4">
                {buyingSteps.map((stepindex) => (
                  <div
                    key={step.step}
                    onClick={() => setActiveStep(index)}
                    className={`cursor-pointer p-6 rounded-xl transition-all ${
                      activeStep === index
                        ? 'bg-white shadow-xl border-2 border-blue-500'
                        : 'bg-white/50 hover:bg-white hover:shadow-lg'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg bg-gradient-to-r ${step.color} text-white`}>
                        {step.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-900">
                            Step {step.step}: {step.title}
                          </h3>
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                            {step.duration}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2">{step.description}</p>
                        <div className="text-sm text-gray-500">
                          {step.activities.length} activities • {step.documents.length} documents
                        </div>
                      </div>
                      <ChevronRight className={`w-5 h-5 transition-transform ${
                        activeStep === index ? 'rotate-90' : ''
                      }`} />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="sticky top-8">
                <div className="bg-white rounded-xl shadow-xl p-8">
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${buyingSteps[activeStep].color} text-white mb-6`}>
                    {buyingSteps[activeStep].icon}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {buyingSteps[activeStep].title}
                  </h3>
                  
                  <p className="text-lg text-gray-600 mb-6">
                    {buyingSteps[activeStep].description}
                  </p>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Activities</h4>
                      <div className="space-y-2">
                        {buyingSteps[activeStep].activities.map((activityidx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span className="text-gray-700">{activity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Documents</h4>
                      <div className="flex flex-wrap gap-2">
                        {buyingSteps[activeStep].documents.map((docidx) => (
                          <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                            {doc}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Data Flow</h4>
                      <div className="space-y-2">
                        {buyingSteps[activeStep].dataFlow.map((flowidx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <Database className="w-4 h-4 text-blue-500 flex-shrink-0" />
                            <span className="text-gray-700 text-sm">{flow}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Document Flow Section */}
      {activeTab === 'documents' && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Document & Data Flow</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Complete transparency of how your documents are managed, stored, and processed throughout your journey
              </p>
            </div>

            <div className="space-y-8">
              {documentFlow.map((stageindex) => (
                <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="p-6 border-l-4 border-blue-600">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{stage.stage}</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Documents</h4>
                        <ul className="space-y-1">
                          {stage.documents.map((docidx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                              <FileText className="w-3 h-3" />
                              {doc}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Storage</h4>
                        <div className="flex items-center gap-2">
                          <Database className="w-4 h-4 text-blue-500" />
                          <span className="text-sm text-gray-600">{stage.storage}</span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Access Control</h4>
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-600">{stage.access}</span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Automation</h4>
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-purple-500" />
                          <span className="text-sm text-gray-600">{stage.automation}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-blue-50 rounded-xl p-6">
                <Shield className="w-8 h-8 text-blue-600 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Security First</h3>
                <p className="text-gray-600">All documents encrypted with AES-256, stored in ISO 27001 certified data centers with full audit trails.</p>
              </div>
              
              <div className="bg-green-50 rounded-xl p-6">
                <Eye className="w-8 h-8 text-green-600 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Full Transparency</h3>
                <p className="text-gray-600">Track every document status, view all communications, and monitor progress in real-time through your portal.</p>
              </div>
              
              <div className="bg-purple-50 rounded-xl p-6">
                <RefreshCw className="w-8 h-8 text-purple-600 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Automated Workflows</h3>
                <p className="text-gray-600">Smart automation reduces manual work, prevents errors, and accelerates your purchase timeline.</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Technology Section */}
      {activeTab === 'technology' && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Technology Platform</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Built on cutting-edge technology to deliver the smoothest, most secure property buying experience
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {digitalFeatures.map((featureindex) => (
                <div key={index} className="bg-white rounded-xl p-8 shadow-lg">
                  <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center text-white mb-6`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 mb-6">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.features.map((itemidx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-4">Platform Architecture</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5" />
                      <span>Cloud-native infrastructure with 99.9% uptime</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Database className="w-5 h-5" />
                      <span>Microservices architecture for scalability</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Brain className="w-5 h-5" />
                      <span>AI/ML algorithms for intelligent matching</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5" />
                      <span>Mobile-first responsive design</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 rounded-lg p-6">
                  <h4 className="text-lg font-bold mb-4">Integration Partners</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>• Banking APIs</div>
                    <div>• Legal systems</div>
                    <div>• Revenue APIs</div>
                    <div>• Credit agencies</div>
                    <div>• Property databases</div>
                    <div>• Payment gateways</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* PROP Choice Section */}
      {activeTab === 'prop-choice' && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">PROP Choice Customization</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Personalize your new home with our comprehensive customization options, all managed digitally and added to your mortgage
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {propChoiceOptions.map((categoryindex) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                      {category.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{category.category}</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {category.options.map((optionidx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">{option.split(' (')[0]}</span>
                        <span className="text-sm font-medium text-blue-600">
                          {option.match(/\(([^)]+)\)/)?.[1]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 bg-blue-50 rounded-xl p-8">
              <div className="text-center mb-8">
                <Star className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">How PROP Choice Works</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">1</div>
                  <h4 className="font-semibold mb-2">Browse Options</h4>
                  <p className="text-sm text-gray-600">Explore customization options in our 3D configurator</p>
                </div>
                
                <div className="text-center">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">2</div>
                  <h4 className="font-semibold mb-2">Design & Price</h4>
                  <p className="text-sm text-gray-600">Real-time pricing updates as you customize</p>
                </div>
                
                <div className="text-center">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">3</div>
                  <h4 className="font-semibold mb-2">Add to Purchase</h4>
                  <p className="text-sm text-gray-600">Options added to your mortgage automatically</p>
                </div>
                
                <div className="text-center">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">4</div>
                  <h4 className="font-semibold mb-2">Move In Ready</h4>
                  <p className="text-sm text-gray-600">Your personalized home is ready on completion</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Help to Buy Section */}
      {activeTab === 'help-to-buy' && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Help to Buy Integration</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Seamless integration with the Irish government's Help to Buy scheme, all handled digitally within our platform
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">HTB Digital Process</h3>
                <div className="space-y-6">
                  {helpToBuyProcess.map((stepindex) => (
                    <div key={index} className="bg-white rounded-lg p-6 shadow-md">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">{step.step}</h4>
                      <p className="text-gray-600 mb-4">{step.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        {step.requirements.map((reqidx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{req}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-medium text-purple-900">{step.automation}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">HTB Calculator</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Property Value</label>
                    <input 
                      type="number" 
                      placeholder="€350,000"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Deposit (minimum 10%)</label>
                    <input 
                      type="number" 
                      placeholder="€35,000"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">HTB Calculation</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-700">HTB Amount (30% or max €30k):</span>
                        <span className="font-medium">€30,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Your Deposit Required:</span>
                        <span className="font-medium">€35,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Mortgage Required:</span>
                        <span className="font-medium">€285,000</span>
                      </div>
                      <div className="flex justify-between font-semibold pt-2 border-t border-green-200">
                        <span>Total Financing:</span>
                        <span className="text-green-700">€350,000</span>
                      </div>
                    </div>
                  </div>
                  
                  <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                    Check HTB Eligibility
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-xl p-8">
              <div className="text-center mb-8">
                <Award className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900">HTB Benefits with PROP.ie</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Lightbulb className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Automatic Eligibility Check</h4>
                  <p className="text-sm text-gray-600">Instant verification of HTB eligibility during property selection</p>
                </div>
                
                <div className="text-center">
                  <FileText className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Digital Application</h4>
                  <p className="text-sm text-gray-600">Complete HTB application online with document upload and tracking</p>
                </div>
                
                <div className="text-center">
                  <Calculator className="w-8 h-8 text-green-600 mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Integrated Financing</h4>
                  <p className="text-sm text-gray-600">HTB amount automatically calculated and included in purchase</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Digital Property Journey?</h2>
          <p className="text-xl mb-8">
            Join thousands of homeowners who've successfully purchased their dream home using our revolutionary online platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/properties/search"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Browse Properties
              <Home className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              href="/contact"
              className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-lg hover:bg-white/20 transition-all border border-white/30"
            >
              Book Consultation
              <Calendar className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}