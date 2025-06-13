'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, 
  Users, 
  Target, 
  DollarSign, 
  Clock, 
  BarChart3, 
  LineChart, 
  PieChart, 
  UserCheck, 
  Home, 
  Phone, 
  Mail, 
  Calendar, 
  FileText, 
  CheckCircle, 
  ChevronRight, 
  ArrowRight, 
  Zap,
  Brain,
  Shield,
  Smartphone,
  Globe,
  Award,
  Star,
  Activity,
  RefreshCw,
  Settings,
  AlertCircle,
  MessageSquare,
  CreditCard,
  Filter,
  Search,
  Database,
  Layers
} from 'lucide-react';

const salesFeatures = [
  {
    icon: <Users className="w-8 h-8" />,
    title: 'Lead Management & CRM',
    description: 'Centralized lead capture, scoring, and nurturing with automated workflows',
    features: ['Lead scoring & qualification', 'Automated follow-up sequences', 'Multi-channel lead capture', 'Pipeline management'],
    metrics: { leads: '3x more qualified leads', conversion: '45% higher conversion', time: '60% faster response time' }
  },
  {
    icon: <Home className="w-8 h-8" />,
    title: 'Unit & Inventory Management',
    description: 'Real-time unit availability, pricing, and reservation management',
    features: ['Live availability tracking', 'Dynamic pricing tools', 'Reservation management', 'Unit comparison tools'],
    metrics: { sales: '35% faster sales cycle', revenue: '€500K additional revenue', efficiency: '80% admin reduction' }
  },
  {
    icon: <Target className="w-8 h-8" />,
    title: 'Sales Performance Analytics',
    description: 'Comprehensive insights into sales team performance and pipeline health',
    features: ['Sales velocity tracking', 'Conversion funnel analysis', 'Team performance metrics', 'Revenue forecasting'],
    metrics: { visibility: '100% pipeline visibility', accuracy: '95% forecast accuracy', productivity: '40% team productivity boost' }
  },
  {
    icon: <MessageSquare className="w-8 h-8" />,
    title: 'Customer Communication Hub',
    description: 'Unified communication platform for buyers, agents, and sales teams',
    features: ['Multi-channel messaging', 'Automated notifications', 'Document sharing', 'Video call integration'],
    metrics: { satisfaction: '94% customer satisfaction', response: '90% faster response times', engagement: '70% higher engagement' }
  },
  {
    icon: <FileText className="w-8 h-8" />,
    title: 'Digital Contract Management',
    description: 'Streamlined contract creation, approval, and e-signature workflows',
    features: ['Template library', 'E-signature integration', 'Approval workflows', 'Version control'],
    metrics: { speed: '75% faster contracts', errors: '90% fewer errors', satisfaction: '99% completion rate' }
  },
  {
    icon: <BarChart3 className="w-8 h-8" />,
    title: 'Sales Reporting & Dashboards',
    description: 'Real-time dashboards and customizable reports for sales insights',
    features: ['Custom dashboards', 'Automated reporting', 'KPI tracking', 'Export capabilities'],
    metrics: { insights: 'Real-time insights', time: '5 hours saved weekly', decisions: '3x faster decisions' }
  }
];

const workflowSteps = [
  {
    step: '01',
    title: 'Lead Capture',
    description: 'Automatic lead capture from website, social media, and advertising campaigns',
    icon: <Target className="w-6 h-6" />
  },
  {
    step: '02',
    title: 'Lead Qualification',
    description: 'AI-powered lead scoring and automatic routing to appropriate sales agents',
    icon: <Brain className="w-6 h-6" />
  },
  {
    step: '03',
    title: 'Property Matching',
    description: 'Intelligent property recommendations based on buyer preferences and budget',
    icon: <Home className="w-6 h-6" />
  },
  {
    step: '04',
    title: 'Engagement & Nurturing',
    description: 'Automated email sequences, personalized content, and follow-up reminders',
    icon: <MessageSquare className="w-6 h-6" />
  },
  {
    step: '05',
    title: 'Viewing & Presentation',
    description: 'Schedule viewings, virtual tours, and track buyer engagement levels',
    icon: <Calendar className="w-6 h-6" />
  },
  {
    step: '06',
    title: 'Offer & Negotiation',
    description: 'Digital offer management, negotiation tracking, and approval workflows',
    icon: <DollarSign className="w-6 h-6" />
  },
  {
    step: '07',
    title: 'Contract & Closing',
    description: 'Digital contract generation, e-signatures, and transaction management',
    icon: <FileText className="w-6 h-6" />
  },
  {
    step: '08',
    title: 'Post-Sale Support',
    description: 'Ongoing customer support, warranty management, and upselling opportunities',
    icon: <Star className="w-6 h-6" />
  }
];

const salesTools = [
  {
    name: 'Sales Pipeline Dashboard',
    description: 'Visual pipeline management with drag-and-drop functionality',
    features: ['Deal progression tracking', 'Stage conversion rates', 'Bottleneck identification', 'Revenue forecasting']
  },
  {
    name: 'Buyer Portal Integration',
    description: 'Seamless connection between sales team and buyer experience',
    features: ['Real-time buyer activity', 'Engagement scoring', 'Preference tracking', 'Communication history']
  },
  {
    name: 'Mobile Sales App',
    description: 'Full-featured mobile app for sales teams on the go',
    features: ['Offline capability', 'Contact management', 'Document access', 'Quick updates']
  },
  {
    name: 'Sales Automation Engine',
    description: 'Intelligent automation for repetitive sales tasks',
    features: ['Follow-up reminders', 'Email templates', 'Task automation', 'Workflow triggers']
  }
];

const metrics = [
  { label: 'Sales Velocity Increase', value: '3x', description: 'Faster deal progression' },
  { label: 'Lead Conversion Rate', value: '45%', description: 'Higher quality conversions' },
  { label: 'Admin Time Reduction', value: '80%', description: 'More time for selling' },
  { label: 'Customer Satisfaction', value: '94%', description: 'Buyer experience rating' }
];

const integrations = [
  'Salesforce', 'HubSpot', 'Pipedrive', 'Zoho CRM', 'Microsoft Dynamics',
  'DocuSign', 'HelloSign', 'Adobe Sign', 'Sage', 'Xero', 'QuickBooks'
];

export default function SalesManagementPage() {
  const [activeTab, setActiveTab] = useState('features');
  const [selectedFeature, setSelectedFeature] = useState(0);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-900 via-blue-900 to-purple-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:32px_32px]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 to-transparent"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-full mb-6">
              <TrendingUp className="w-4 h-4 mr-2 text-green-300" />
              <span className="text-green-300 font-medium">Sales Management Platform</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Sell Properties
              <span className="block bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                3x Faster
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Complete sales management platform designed for property developers. 
              Streamline your entire sales process from lead capture to contract signing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/demo/sales"
                className="inline-flex items-center px-8 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all transform hover:scale-105 shadow-xl"
              >
                See Sales Platform
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                href="/contact/sales"
                className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-lg hover:bg-white/20 transition-all border border-white/30"
              >
                Talk to Sales Expert
                <Activity className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-green-300 mb-2">{metric.value}</div>
                <div className="text-white font-semibold mb-1">{metric.label}</div>
                <div className="text-gray-300 text-sm">{metric.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'features', label: 'Features', icon: <TrendingUp className="w-4 h-4" /> },
              { id: 'workflow', label: 'Sales Process', icon: <RefreshCw className="w-4 h-4" /> },
              { id: 'tools', label: 'Sales Tools', icon: <Settings className="w-4 h-4" /> },
              { id: 'integrations', label: 'Integrations', icon: <Zap className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-green-600 text-green-600'
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

      {/* Features Section */}
      {activeTab === 'features' && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Complete Sales Management Suite</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need to manage your sales process efficiently and effectively
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-4">
                {salesFeatures.map((feature, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedFeature(index)}
                    className={`cursor-pointer p-6 rounded-xl transition-all ${
                      selectedFeature === index
                        ? 'bg-white shadow-xl border-2 border-green-500'
                        : 'bg-white/50 hover:bg-white hover:shadow-lg'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-green-600">{feature.icon}</div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                        <p className="text-gray-600 mb-3">{feature.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            {Object.keys(feature.metrics).length} key metrics
                          </span>
                          <ChevronRight className={`w-5 h-5 transition-transform ${
                            selectedFeature === index ? 'rotate-90' : ''
                          }`} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="sticky top-8">
                <div className="bg-white rounded-xl shadow-xl p-8">
                  <div className="text-green-600 mb-6">
                    {salesFeatures[selectedFeature].icon}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {salesFeatures[selectedFeature].title}
                  </h3>
                  
                  <p className="text-lg text-gray-600 mb-6">
                    {salesFeatures[selectedFeature].description}
                  </p>
                  
                  <div className="space-y-3 mb-8">
                    {salesFeatures[selectedFeature].features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    {Object.entries(salesFeatures[selectedFeature].metrics).map(([key, value]) => (
                      <div key={key} className="p-4 bg-green-50 rounded-lg">
                        <div className="text-sm text-green-600 mb-1 capitalize">{key}</div>
                        <div className="text-xl font-bold text-green-900">{value}</div>
                      </div>
                    ))}
                  </div>
                  
                  <button className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Sales Workflow Section */}
      {activeTab === 'workflow' && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Streamlined Sales Process</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                A proven 8-step sales process that converts more leads and closes deals faster
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {workflowSteps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto">
                      {step.step}
                    </div>
                    {index < workflowSteps.length - 1 && (
                      <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gray-300"></div>
                    )}
                  </div>
                  <div className="bg-green-100 rounded-lg p-3 mb-4 inline-flex text-green-600">
                    {step.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-4">See the Complete Process in Action</h3>
              <p className="text-lg mb-6 opacity-90">
                Watch how our sales management platform guides prospects through each step
              </p>
              <Link 
                href="/demo/workflow"
                className="inline-flex items-center px-6 py-3 bg-white text-green-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Watch Process Demo
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Sales Tools Section */}
      {activeTab === 'tools' && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Sales Tools</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Advanced tools designed to boost productivity and close more deals
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {salesTools.map((tool, index) => (
                <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{tool.name}</h3>
                  <p className="text-gray-600 mb-6">{tool.description}</p>
                  <div className="space-y-2">
                    {tool.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">Built for Modern Sales Teams</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-green-600 rounded-lg p-3">
                      <Smartphone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">Mobile-First Design</h4>
                      <p className="text-gray-600">Access all sales tools on any device, anywhere, anytime.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-600 rounded-lg p-3">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered Insights</h4>
                      <p className="text-gray-600">Get intelligent recommendations to improve your sales performance.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-purple-600 rounded-lg p-3">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">Enterprise Security</h4>
                      <p className="text-gray-600">Bank-level security with GDPR compliance and data protection.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-600 to-blue-600 rounded-xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-6">Sales Performance Metrics</h3>
                <div className="space-y-6">
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Conversion Rate</span>
                      <span className="text-green-300">+45%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div className="bg-green-400 h-2 rounded-full" style={{ width: '87%' }}></div>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Sales Velocity</span>
                      <span className="text-blue-300">3x Faster</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div className="bg-blue-400 h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Team Productivity</span>
                      <span className="text-purple-300">+40%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div className="bg-purple-400 h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Integrations Section */}
      {activeTab === 'integrations' && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Seamless Integrations</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Connect with your existing CRM, accounting, and business tools
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-16">
              {integrations.map((integration, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-lg text-center hover:shadow-xl transition-shadow">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg mx-auto mb-3"></div>
                  <div className="text-sm font-medium text-gray-900">{integration}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">API & Custom Integrations</h3>
                <p className="text-gray-600 mb-6">
                  Our robust API allows you to connect with any system in your tech stack. 
                  Build custom integrations or work with our team to create tailored solutions.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">RESTful API with comprehensive documentation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Webhook support for real-time data sync</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Custom integration development services</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Dedicated technical support</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Data Migration Made Easy</h3>
                <p className="text-gray-600 mb-6">
                  Switching from another system? Our team handles the complete data migration 
                  process, ensuring zero data loss and minimal downtime.
                </p>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                    <span className="text-gray-700">Data assessment and mapping</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                    <span className="text-gray-700">Secure data extraction and validation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                    <span className="text-gray-700">Testing and verification</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">4</div>
                    <span className="text-gray-700">Go-live and team training</span>
                  </div>
                </div>
                <Link 
                  href="/contact/migration"
                  className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                >
                  Start Migration Process
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">Ready to Accelerate Your Sales?</h2>
          <p className="text-xl mb-8">
            Join leading property developers who are closing deals 3x faster with our sales management platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/demo/sales"
              className="inline-flex items-center px-8 py-4 bg-white text-green-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Book Sales Demo
              <Calendar className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              href="/contact/sales"
              className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-lg hover:bg-white/20 transition-all border border-white/30"
            >
              Talk to Sales Expert
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}