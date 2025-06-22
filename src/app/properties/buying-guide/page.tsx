'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, CheckCircle, FileText, Users, Calculator, 
  Shield, Clock, CreditCard, Home, Building, Eye, Smartphone,
  Download, BookOpen, AlertCircle, Info, MapPin, Calendar,
  User, UserCheck, Heart as HandHeart, Scale, Gavel, Receipt, BarChart3,
  TrendingUp, Activity, Zap, Globe, Database, Bell, Settings
} from 'lucide-react';

export default function ComprehensiveBuyingGuide() {
  const [activeTab, setActiveTab] = useState('process-overview');

  const tabs = [
    { id: 'process-overview', label: 'Buying Process', icon: Home },
    { id: 'transaction-stages', label: 'Transaction Stages', icon: Calendar },
    { id: 'documents-required', label: 'Documents Required', icon: FileText },
    { id: 'parties-involved', label: 'Parties Involved', icon: Users },
    { id: 'costs-timeline', label: 'Costs & Timeline', icon: Calculator },
    { id: 'legal-compliance', label: 'Legal & Compliance', icon: Scale },
    { id: 'tips-guidance', label: 'Tips & Guidance', icon: BookOpen }
  ];

  const transactionStages = [
    {
      stage: 'Property Discovery',
      description: 'Browse properties, virtual tours, and information gathering',
      documents: ['Property brochures', '3D virtual tours', 'Development plans', 'Price lists'],
      parties: ['Buyer', 'Marketing team', 'Sales agents'],
      timeframe: '1-4 weeks',
      actions: ['View properties online', 'Schedule virtual tours', 'Review development information', 'Calculate affordability']
    },
    {
      stage: 'Financial Pre-Approval',
      description: 'Mortgage approval and financial verification',
      documents: ['Bank statements', 'Payslips', 'P60/P45', 'Mortgage approval letter', 'HTB approval'],
      parties: ['Buyer', 'Mortgage broker', 'Bank/Lender', 'HTB team'],
      timeframe: '2-6 weeks',
      actions: ['Submit mortgage application', 'Provide financial documents', 'Credit check', 'Receive approval in principle']
    },
    {
      stage: 'Property Reservation',
      description: 'Secure your chosen property with reservation deposit',
      documents: ['Reservation agreement', 'Deposit receipt', 'Property specification', 'Terms & conditions'],
      parties: ['Buyer', 'Developer', 'Sales team', 'Legal representatives'],
      timeframe: '1-2 days',
      actions: ['Sign reservation agreement', 'Pay reservation deposit (€2,000-€5,000)', 'Receive property pack', 'Begin legal process']
    },
    {
      stage: 'Contract Exchange',
      description: 'Legal contracts signed and exchanged between parties',
      documents: ['Purchase contract', 'Title documents', 'Planning permissions', 'Building regulations', 'Management company details'],
      parties: ['Buyer', 'Seller/Developer', 'Buyer\'s solicitor', 'Seller\'s solicitor'],
      timeframe: '4-8 weeks',
      actions: ['Legal due diligence', 'Contract review', 'Searches and enquiries', 'Sign contracts', 'Pay deposit (10%)']
    },
    {
      stage: 'Construction Period',
      description: 'Property construction with regular progress updates',
      documents: ['Construction updates', 'Progress photos', 'Completion estimates', 'Snagging reports'],
      parties: ['Developer', 'Construction team', 'Project managers', 'Quality inspectors'],
      timeframe: '12-24 months',
      actions: ['Receive progress updates', 'Schedule site visits', 'Review construction milestones', 'Plan completion preparations']
    },
    {
      stage: 'Pre-Completion',
      description: 'Final preparations and property inspection',
      documents: ['Completion notice', 'Final mortgage approval', 'Property insurance', 'Utility connections'],
      parties: ['Buyer', 'Solicitor', 'Mortgage lender', 'Insurance provider', 'Utility companies'],
      timeframe: '4-6 weeks',
      actions: ['Final mortgage drawdown', 'Property inspection', 'Arrange insurance', 'Set up utilities', 'Snagging list']
    },
    {
      stage: 'Completion & Handover',
      description: 'Final payment and property keys transfer',
      documents: ['Deed of transfer', 'Property keys', 'Warranties', 'Management company info', 'Completion statement'],
      parties: ['Buyer', 'Seller', 'Both solicitors', 'Estate agent', 'Property manager'],
      timeframe: '1-2 days',
      actions: ['Final payment transfer', 'Key handover', 'Property walkthrough', 'Sign transfer documents', 'Register ownership']
    },
    {
      stage: 'Post-Purchase',
      description: 'Ongoing support and property management',
      documents: ['Warranty documents', 'Property management agreement', 'Service charge details', 'Defects reporting'],
      parties: ['Buyer', 'Property manager', 'Management company', 'Warranty providers'],
      timeframe: 'Ongoing',
      actions: ['Register with management company', 'Set up service charges', 'Report any defects', 'Ongoing maintenance']
    }
  ];

  const keyParties = [
    {
      role: 'Property Buyer',
      responsibility: 'Primary purchaser making the investment',
      involvement: 'Throughout entire process',
      keyActions: ['Property selection', 'Financial approval', 'Contract signing', 'Final purchase']
    },
    {
      role: 'Property Developer',
      responsibility: 'Building and selling the property',
      involvement: 'Pre-sale through completion',
      keyActions: ['Marketing', 'Sales', 'Construction', 'Handover']
    },
    {
      role: 'Buyer\'s Solicitor',
      responsibility: 'Legal representation and due diligence',
      involvement: 'Contract to completion',
      keyActions: ['Contract review', 'Searches', 'Legal advice', 'Fund transfer']
    },
    {
      role: 'Seller\'s Solicitor',
      responsibility: 'Developer\'s legal representation',
      involvement: 'Contract to completion',
      keyActions: ['Contract preparation', 'Title verification', 'Completion process']
    },
    {
      role: 'Mortgage Lender',
      responsibility: 'Financing the property purchase',
      involvement: 'Pre-approval to completion',
      keyActions: ['Loan approval', 'Property valuation', 'Fund release']
    },
    {
      role: 'Estate Agent/Sales Team',
      responsibility: 'Property marketing and sales',
      involvement: 'Initial contact to reservation',
      keyActions: ['Property viewing', 'Sales negotiation', 'Reservation process']
    },
    {
      role: 'Mortgage Broker',
      responsibility: 'Finding best mortgage options',
      involvement: 'Pre-approval stage',
      keyActions: ['Lender comparison', 'Application support', 'Rate negotiation']
    },
    {
      role: 'Property Manager',
      responsibility: 'Ongoing property and estate management',
      involvement: 'Post-completion',
      keyActions: ['Maintenance coordination', 'Service charge collection', 'Community management']
    }
  ];

  const documentsExchanged = [
    {
      category: 'Identity & Personal',
      documents: ['Passport/ID', 'PPS number', 'Proof of address', 'Marriage certificate (if applicable)'],
      purpose: 'Legal identification and KYC compliance'
    },
    {
      category: 'Financial Documents',
      documents: ['Bank statements (6 months)', 'Payslips (3 months)', 'P60/P45', 'Tax returns', 'Mortgage approval'],
      purpose: 'Financial verification and lending approval'
    },
    {
      category: 'Property Documents',
      documents: ['Property brochure', 'Floor plans', 'Site plans', 'Development specifications', 'Energy ratings'],
      purpose: 'Property information and specifications'
    },
    {
      category: 'Legal Documents',
      documents: ['Purchase contract', 'Title documents', 'Planning permissions', 'Building regulations', 'Management agreement'],
      purpose: 'Legal ownership and compliance verification'
    },
    {
      category: 'Financial Agreements',
      documents: ['Mortgage agreement', 'HTB documentation', 'Insurance policies', 'Deposit receipts'],
      purpose: 'Financial arrangements and protection'
    },
    {
      category: 'Completion Documents',
      documents: ['Deed of transfer', 'Keys handover', 'Warranties', 'Completion statement', 'Registration forms'],
      purpose: 'Final ownership transfer and registration'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-purple-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Complete Guide to Buying Off-Plan Online
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Everything you need to know about the digital property buying process, transaction stages, 
              document requirements, and parties involved in Ireland's most advanced property platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/solutions/buy-off-plan"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-900 font-semibold rounded-lg hover:bg-gray-100 transition-all"
              >
                Start Buying Off-Plan
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                href="/first-time-buyers"
                className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all border border-blue-500"
              >
                First-Time Buyer Hub
                <Home className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-4 border-b-2 font-medium whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          
          {/* Platform Overview Tab */}
          {activeTab === 'process-overview' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-6">The Complete Buying Process</h2>
                <p className="text-lg text-gray-700 mb-6">
                  Buying a property off-plan involves a structured process with multiple stages, documents, 
                  and parties working together. Understanding each step helps ensure a smooth transaction 
                  from initial interest to receiving your keys.
                </p>
              </div>

              <div className="grid md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg p-6 shadow-sm border text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">1</span>
                  </div>
                  <h3 className="font-semibold mb-2">Property Discovery</h3>
                  <p className="text-gray-600 text-sm">Browse properties, virtual tours, and information gathering</p>
                  <div className="text-xs text-blue-600 mt-2">1-4 weeks</div>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm border text-center">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">2</span>
                  </div>
                  <h3 className="font-semibold mb-2">Financial Pre-Approval</h3>
                  <p className="text-gray-600 text-sm">Mortgage approval and financial verification</p>
                  <div className="text-xs text-green-600 mt-2">2-6 weeks</div>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm border text-center">
                  <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">3</span>
                  </div>
                  <h3 className="font-semibold mb-2">Legal & Contracts</h3>
                  <p className="text-gray-600 text-sm">Contract exchange and legal due diligence</p>
                  <div className="text-xs text-purple-600 mt-2">4-8 weeks</div>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm border text-center">
                  <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">4</span>
                  </div>
                  <h3 className="font-semibold mb-2">Completion</h3>
                  <p className="text-gray-600 text-sm">Final payment and property handover</p>
                  <div className="text-xs text-orange-600 mt-2">1-2 days</div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Info className="h-6 w-6 text-blue-600 mr-2" />
                  What You Need to Know
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Key Benefits</h4>
                    <ul className="space-y-1">
                      <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-600 mr-2" />Early bird pricing and choice selection</li>
                      <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-600 mr-2" />Customize finishes and upgrades</li>
                      <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-600 mr-2" />Staged payment schedule</li>
                      <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-600 mr-2" />New build warranties included</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Important Considerations</h4>
                    <ul className="space-y-1">
                      <li className="flex items-center"><AlertCircle className="h-4 w-4 text-orange-500 mr-2" />Construction timeline risks</li>
                      <li className="flex items-center"><AlertCircle className="h-4 w-4 text-orange-500 mr-2" />Market value changes during build</li>
                      <li className="flex items-center"><AlertCircle className="h-4 w-4 text-orange-500 mr-2" />Snagging and quality issues</li>
                      <li className="flex items-center"><AlertCircle className="h-4 w-4 text-orange-500 mr-2" />Developer financial stability</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Transaction Stages Tab */}
          {activeTab === 'transaction-stages' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-6">Detailed Transaction Stages</h2>
                <p className="text-lg text-gray-700 mb-6">
                  Each stage of the property buying process involves specific documents, parties, and actions. 
                  Understanding these steps helps you prepare and ensures a smooth transaction.
                </p>
              </div>

              <div className="space-y-6">
                {transactionStages.map((stage, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                            <span className="text-white font-bold">{index + 1}</span>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold">{stage.stage}</h3>
                            <p className="text-gray-600">{stage.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">Timeframe</div>
                          <div className="font-semibold text-blue-600">{stage.timeframe}</div>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="grid md:grid-cols-3 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-blue-600" />
                            Documents Required
                          </h4>
                          <ul className="space-y-1">
                            {stage.documents.map((doc, docIndex) => (
                              <li key={docIndex} className="text-sm text-gray-600 flex items-center">
                                <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                                {doc}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center">
                            <Users className="h-4 w-4 mr-2 text-green-600" />
                            Parties Involved
                          </h4>
                          <ul className="space-y-1">
                            {stage.parties.map((party, partyIndex) => (
                              <li key={partyIndex} className="text-sm text-gray-600 flex items-center">
                                <User className="h-3 w-3 text-blue-500 mr-2 flex-shrink-0" />
                                {party}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2 text-purple-600" />
                            Key Actions
                          </h4>
                          <ul className="space-y-1">
                            {stage.actions.map((action, actionIndex) => (
                              <li key={actionIndex} className="text-sm text-gray-600 flex items-center">
                                <ArrowRight className="h-3 w-3 text-purple-500 mr-2 flex-shrink-0" />
                                {action}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <AlertCircle className="h-6 w-6 text-yellow-600 mr-2" />
                  Important Off-Plan Considerations
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start"><CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-1" />Construction timeline: Typically 12-24 months from contract signing</li>
                  <li className="flex items-start"><CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-1" />Payment schedule: Reservation deposit, contract deposit (10%), balance on completion</li>
                  <li className="flex items-start"><CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-1" />Price protection: Your price is locked in at reservation, no increase during construction</li>
                  <li className="flex items-start"><CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-1" />Snagging period: 6-12 months for any defect reporting and resolution</li>
                </ul>
              </div>
            </div>
          )}

          {/* Documents & Data Tab */}
          {activeTab === 'documents-required' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-6">Documents & Data Exchange</h2>
                <p className="text-lg text-gray-700 mb-6">
                  The property buying process involves extensive document exchange between multiple parties. 
                  Our digital platform ensures secure, tracked, and efficient document management throughout.
                </p>
              </div>

              <div className="grid gap-6">
                {documentsExchanged.map((category, index) => (
                  <div key={index} className="bg-white rounded-lg border shadow-sm">
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{category.category}</h3>
                      <p className="text-gray-600 mb-4">{category.purpose}</p>
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-2">
                        {category.documents.map((doc, docIndex) => (
                          <div key={docIndex} className="flex items-center bg-gray-50 rounded px-3 py-2">
                            <FileText className="h-4 w-4 text-gray-500 mr-2" />
                            <span className="text-sm">{doc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Digital Document Benefits</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Security Features</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• End-to-end encryption</li>
                      <li>• Digital signatures with timestamp</li>
                      <li>• Version control and audit trail</li>
                      <li>• Secure cloud storage</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Process Efficiency</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Instant document sharing</li>
                      <li>• Real-time status updates</li>
                      <li>• Automated compliance checking</li>
                      <li>• Reduced processing time</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Transaction Stages Tab */}
          {activeTab === 'costs-timeline' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-6">Costs & Timeline Breakdown</h2>
                <p className="text-lg text-gray-700 mb-6">
                  Each property purchase follows a structured process with defined stages, timeframes, and requirements. 
                  Understanding these stages helps you prepare and track your progress effectively.
                </p>
              </div>

              <div className="space-y-6">
                {transactionStages.map((stage, index) => (
                  <div key={index} className="bg-white rounded-lg border shadow-sm">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-4 mt-1">
                            <span className="text-white font-bold">{index + 1}</span>
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold">{stage.stage}</h3>
                            <p className="text-gray-600 mt-1">{stage.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            <Clock className="h-4 w-4 mr-1" />
                            {stage.timeframe}
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-6 mt-6">
                        <div>
                          <h4 className="font-semibold text-sm text-gray-700 mb-2">Key Documents</h4>
                          <ul className="space-y-1">
                            {stage.documents.map((doc, docIndex) => (
                              <li key={docIndex} className="flex items-center text-sm">
                                <FileText className="h-3 w-3 text-gray-400 mr-2" />
                                {doc}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-gray-700 mb-2">Parties Involved</h4>
                          <ul className="space-y-1">
                            {stage.parties.map((party, partyIndex) => (
                              <li key={partyIndex} className="flex items-center text-sm">
                                <User className="h-3 w-3 text-gray-400 mr-2" />
                                {party}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-gray-700 mb-2">Key Actions</h4>
                          <ul className="space-y-1">
                            {stage.actions.map((action, actionIndex) => (
                              <li key={actionIndex} className="flex items-center text-sm">
                                <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                                {action}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Parties Involved Tab */}
          {activeTab === 'parties-involved' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-6">Key Parties in the Transaction</h2>
                <p className="text-lg text-gray-700 mb-6">
                  A successful property transaction involves multiple professional parties, each with specific 
                  roles and responsibilities. Understanding these relationships ensures smooth communication and process flow.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {keyParties.map((party, index) => (
                  <div key={index} className="bg-white rounded-lg border shadow-sm p-6">
                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
                        <UserCheck className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{party.role}</h3>
                        <p className="text-gray-600 mt-1 mb-3">{party.responsibility}</p>
                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <Clock className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="font-medium">Involvement:</span>
                            <span className="ml-1">{party.involvement}</span>
                          </div>
                          <div>
                            <span className="font-medium text-sm">Key Actions:</span>
                            <ul className="mt-1 space-y-1">
                              {party.keyActions.map((action, actionIndex) => (
                                <li key={actionIndex} className="text-sm flex items-center">
                                  <ArrowRight className="h-3 w-3 text-gray-400 mr-2" />
                                  {action}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Legal Process Tab */}
          {activeTab === 'legal-compliance' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-6">Legal Process & Requirements</h2>
                <p className="text-lg text-gray-700 mb-6">
                  The legal aspects of property buying in Ireland follow strict regulatory requirements. 
                  Our digital platform ensures full compliance while streamlining the process.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg border shadow-sm p-6">
                  <Scale className="h-12 w-12 text-blue-600 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Legal Compliance</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Property Registration Authority compliance</li>
                    <li>• Anti-Money Laundering checks</li>
                    <li>• Consumer Protection Code adherence</li>
                    <li>• Data Protection (GDPR) compliance</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg border shadow-sm p-6">
                  <Gavel className="h-12 w-12 text-green-600 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Conveyancing Process</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Title investigation and verification</li>
                    <li>• Local authority searches</li>
                    <li>• Planning and building regulation checks</li>
                    <li>• Contract review and negotiation</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg border shadow-sm p-6">
                  <Receipt className="h-12 w-12 text-purple-600 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Financial Protection</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Deposit protection schemes</li>
                    <li>• Insurance and warranty coverage</li>
                    <li>• Completion guarantee bonds</li>
                    <li>• Professional indemnity insurance</li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Digital Legal Advantages</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Enhanced Security</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Digital signatures with legal validity</li>
                      <li>• Blockchain-based document verification</li>
                      <li>• Immutable transaction records</li>
                      <li>• Real-time compliance monitoring</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Process Efficiency</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Automated legal checks and searches</li>
                      <li>• Instant document sharing between solicitors</li>
                      <li>• Real-time status updates for all parties</li>
                      <li>• Reduced conveyancing timeframes</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Timeline & Milestones Tab */}
          {activeTab === 'tips-guidance' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-6">Expert Tips & Guidance</h2>
                <p className="text-lg text-gray-700 mb-6">
                  Understanding the complete timeline from initial interest to keys in hand helps you plan 
                  effectively and know what to expect at each stage.
                </p>
              </div>

              <div className="bg-white rounded-lg border shadow-sm p-6">
                <h3 className="text-xl font-semibold mb-6">Typical Off-Plan Purchase Timeline</h3>
                <div className="space-y-6">
                  <div className="flex items-center">
                    <div className="w-32 text-sm font-medium">Week 1-2</div>
                    <div className="flex-1 border-t border-gray-300 relative">
                      <div className="absolute -top-2 left-0 w-4 h-4 bg-blue-600 rounded-full"></div>
                      <div className="ml-6 py-2">
                        <div className="font-semibold">Property Discovery & Selection</div>
                        <div className="text-sm text-gray-600">Browse properties, virtual tours, selection</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-32 text-sm font-medium">Week 3-6</div>
                    <div className="flex-1 border-t border-gray-300 relative">
                      <div className="absolute -top-2 left-0 w-4 h-4 bg-green-600 rounded-full"></div>
                      <div className="ml-6 py-2">
                        <div className="font-semibold">Financial Pre-Approval</div>
                        <div className="text-sm text-gray-600">Mortgage application and approval process</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-32 text-sm font-medium">Week 7</div>
                    <div className="flex-1 border-t border-gray-300 relative">
                      <div className="absolute -top-2 left-0 w-4 h-4 bg-purple-600 rounded-full"></div>
                      <div className="ml-6 py-2">
                        <div className="font-semibold">Property Reservation</div>
                        <div className="text-sm text-gray-600">Reservation agreement and deposit</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-32 text-sm font-medium">Week 8-14</div>
                    <div className="flex-1 border-t border-gray-300 relative">
                      <div className="absolute -top-2 left-0 w-4 h-4 bg-orange-600 rounded-full"></div>
                      <div className="ml-6 py-2">
                        <div className="font-semibold">Legal Process & Contract Exchange</div>
                        <div className="text-sm text-gray-600">Solicitor work, searches, contract signing</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-32 text-sm font-medium">Month 4-18</div>
                    <div className="flex-1 border-t border-gray-300 relative">
                      <div className="absolute -top-2 left-0 w-4 h-4 bg-red-600 rounded-full"></div>
                      <div className="ml-6 py-2">
                        <div className="font-semibold">Construction Period</div>
                        <div className="text-sm text-gray-600">Building phase with progress updates</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-32 text-sm font-medium">Month 18-20</div>
                    <div className="flex-1 border-t border-gray-300 relative">
                      <div className="absolute -top-2 left-0 w-4 h-4 bg-yellow-600 rounded-full"></div>
                      <div className="ml-6 py-2">
                        <div className="font-semibold">Pre-Completion & Snagging</div>
                        <div className="text-sm text-gray-600">Final inspections and defect reporting</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-32 text-sm font-medium">Month 20</div>
                    <div className="flex-1 border-t border-gray-300 relative">
                      <div className="absolute -top-2 left-0 w-4 h-4 bg-green-800 rounded-full"></div>
                      <div className="ml-6 py-2">
                        <div className="font-semibold">Completion & Handover</div>
                        <div className="text-sm text-gray-600">Final payment, keys, and ownership transfer</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Key Milestones to Track</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      Mortgage approval received
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      Contracts exchanged
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      Construction commenced
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      Practical completion achieved
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      Final completion and handover
                    </li>
                  </ul>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Important Dates to Remember</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <Calendar className="h-4 w-4 text-yellow-600 mr-2" />
                      Reservation expiry date
                    </li>
                    <li className="flex items-center">
                      <Calendar className="h-4 w-4 text-yellow-600 mr-2" />
                      Contract signing deadline
                    </li>
                    <li className="flex items-center">
                      <Calendar className="h-4 w-4 text-yellow-600 mr-2" />
                      Estimated completion date
                    </li>
                    <li className="flex items-center">
                      <Calendar className="h-4 w-4 text-yellow-600 mr-2" />
                      Final mortgage approval deadline
                    </li>
                    <li className="flex items-center">
                      <Calendar className="h-4 w-4 text-yellow-600 mr-2" />
                      Completion appointment date
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Digital Property Journey?</h2>
          <p className="text-xl mb-8">
            Experience Ireland's most advanced property buying platform with full transparency and security
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/solutions/buy-off-plan"
              className="px-8 py-4 bg-white text-blue-600 rounded-lg font-bold hover:bg-gray-100 transition-all"
            >
              Start Buying Off-Plan
            </Link>
            <Link 
              href="/first-time-buyers"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-bold hover:bg-white hover:text-blue-600 transition-all"
            >
              Visit First-Time Buyers Hub
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}