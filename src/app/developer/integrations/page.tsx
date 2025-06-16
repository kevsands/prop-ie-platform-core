'use client';

import React, { useState } from 'react';
import { 
  Plug, 
  Settings, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  ExternalLink,
  Zap,
  Database,
  Cloud,
  Shield,
  Activity,
  Bell,
  Key,
  RefreshCw,
  Code,
  Globe,
  Smartphone,
  Mail,
  Calendar,
  DollarSign,
  BarChart3,
  FileText,
  Camera,
  Users,
  Building,
  Truck,
  CreditCard,
  MapPin,
  Wifi,
  Lock,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  Edit,
  Star,
  Info,
  AlertTriangle,
  TrendingUp,
  Link as LinkIcon
} from 'lucide-react';

export default function IntegrationsPage() {
  const [activeTabsetActiveTab] = useState('overview');
  const [searchTermsetSearchTerm] = useState('');
  const [showNewIntegrationsetShowNewIntegration] = useState(false);
  const [showApiKeysetShowApiKey] = useState({});

  // Mock integrations data
  const integrations = [
    {
      id: 'sage-accounting',
      name: 'Sage Accounting',
      category: 'Financial',
      description: 'Automated financial data sync and invoicing',
      status: 'connected',
      lastSync: '2025-06-15 14:30',
      provider: 'Sage',
      logo: 'sage-logo.png',
      features: ['Invoice automation', 'Expense tracking', 'Financial reporting'],
      apiEndpoint: 'https://api.sage.com/v1/',
      documentation: 'https://developer.sage.com/',
      monthlyUsage: '2,450 API calls',
      dataFlow: 'bidirectional',
      securityLevel: 'high',
      configuration: {
        companyId: 'PROP-IE-001',
        apiKey: '••••••••••••••••sk_live_abc123',
        webhookUrl: 'https://app.prop.ie/webhooks/sage',
        syncFrequency: 'hourly'
      }
    },
    {
      id: 'planning-portal',
      name: 'Irish Planning Portal',
      category: 'Compliance',
      description: 'Real-time planning application tracking',
      status: 'connected',
      lastSync: '2025-06-15 12:00',
      provider: 'Gov.ie',
      logo: 'planning-logo.png',
      features: ['Application tracking', 'Status updates', 'Document retrieval'],
      apiEndpoint: 'https://api.planning.ie/v2/',
      documentation: 'https://planning.ie/api-docs',
      monthlyUsage: '145 API calls',
      dataFlow: 'inbound',
      securityLevel: 'high',
      configuration: {
        authorityId: 'LOUTH-CC',
        accessToken: '••••••••••••••••token_xyz789',
        notificationEmail: 'planning@prop.ie',
        autoSync: true
      }
    },
    {
      id: 'building-control',
      name: 'Building Control System',
      category: 'Compliance',
      description: 'Building control application and inspection management',
      status: 'pending',
      lastSync: null,
      provider: 'BCAR Online',
      logo: 'bcar-logo.png',
      features: ['Application submission', 'Inspection scheduling', 'Certificate retrieval'],
      apiEndpoint: 'https://api.bcar.ie/v1/',
      documentation: 'https://bcar.ie/api',
      monthlyUsage: '0 API calls',
      dataFlow: 'bidirectional',
      securityLevel: 'high',
      configuration: {
        practitionerId: 'BC-2024-1234',
        clientId: 'prop-ie-client',
        status: 'awaiting_approval'
      }
    },
    {
      id: 'microsoft-365',
      name: 'Microsoft 365',
      category: 'Productivity',
      description: 'Document management and team collaboration',
      status: 'connected',
      lastSync: '2025-06-15 15:45',
      provider: 'Microsoft',
      logo: 'microsoft-logo.png',
      features: ['SharePoint sync', 'Teams integration', 'Calendar sync'],
      apiEndpoint: 'https://graph.microsoft.com/v1.0/',
      documentation: 'https://docs.microsoft.com/graph/',
      monthlyUsage: '8,750 API calls',
      dataFlow: 'bidirectional',
      securityLevel: 'high',
      configuration: {
        tenantId: 'prop-ie-tenant-123',
        clientId: 'app-registration-456',
        sharePointSite: 'Property Developments',
        teamsChannel: 'Development Projects'
      }
    },
    {
      id: 'google-maps',
      name: 'Google Maps Platform',
      category: 'Location',
      description: 'Property location services and mapping',
      status: 'connected',
      lastSync: '2025-06-15 16:00',
      provider: 'Google',
      logo: 'google-logo.png',
      features: ['Geocoding', 'Street View', 'Distance calculations'],
      apiEndpoint: 'https://maps.googleapis.com/maps/api/',
      documentation: 'https://developers.google.com/maps',
      monthlyUsage: '1,250 API calls',
      dataFlow: 'inbound',
      securityLevel: 'medium',
      configuration: {
        apiKey: '••••••••••••••••AIza_key_789',
        enabledServices: ['Geocoding', 'Places', 'Street View'],
        quotaLimit: '10,000 requests/day'
      }
    },
    {
      id: 'salesforce',
      name: 'Salesforce CRM',
      category: 'Sales',
      description: 'Customer relationship management and sales tracking',
      status: 'error',
      lastSync: '2025-06-14 10:30',
      provider: 'Salesforce',
      logo: 'salesforce-logo.png',
      features: ['Lead management', 'Contact sync', 'Opportunity tracking'],
      apiEndpoint: 'https://prop-ie.my.salesforce.com/services/data/v58.0/',
      documentation: 'https://developer.salesforce.com/',
      monthlyUsage: '3,200 API calls',
      dataFlow: 'bidirectional',
      securityLevel: 'high',
      error: 'Authentication expired. Please refresh credentials.',
      configuration: {
        instanceUrl: 'https://prop-ie.my.salesforce.com',
        consumerKey: '••••••••••••••••consumer_key',
        refreshToken: '••••••••••••••••refresh_token',
        lastError: '2025-06-15 08:30 - Invalid session'
      }
    },
    {
      id: 'docusign',
      name: 'DocuSign',
      category: 'Documents',
      description: 'Digital signature and document workflow',
      status: 'disconnected',
      lastSync: null,
      provider: 'DocuSign',
      logo: 'docusign-logo.png',
      features: ['E-signatures', 'Document templates', 'Workflow automation'],
      apiEndpoint: 'https://api.docusign.net/restapi/v2.1/',
      documentation: 'https://developers.docusign.com/',
      monthlyUsage: '0 API calls',
      dataFlow: 'bidirectional',
      securityLevel: 'high',
      configuration: {}
    },
    {
      id: 'stripe',
      name: 'Stripe Payments',
      category: 'Financial',
      description: 'Online payment processing and financial transactions',
      status: 'connected',
      lastSync: '2025-06-15 16:15',
      provider: 'Stripe',
      logo: 'stripe-logo.png',
      features: ['Payment processing', 'Subscription billing', 'Refund management'],
      apiEndpoint: 'https://api.stripe.com/v1/',
      documentation: 'https://stripe.com/docs/api',
      monthlyUsage: '890 API calls',
      dataFlow: 'bidirectional',
      securityLevel: 'high',
      configuration: {
        publishableKey: 'pk_live_••••••••••••••••',
        secretKey: '••••••••••••••••sk_live_stripe',
        webhookSecret: '••••••••••••••••whsec_stripe',
        currency: 'EUR'
      }
    }
  ];

  const integrationStats = {
    totalIntegrations: integrations.length,
    activeConnections: integrations.filter(i => i.status === 'connected').length,
    pendingSetup: integrations.filter(i => i.status === 'pending').length,
    errorConnections: integrations.filter(i => i.status === 'error').length,
    monthlyApiCalls: '16,685',
    dataUptime: '99.8%'
  };

  const availableIntegrations = [
    { name: 'Xero Accounting', category: 'Financial', description: 'Cloud-based accounting software' },
    { name: 'Revenue.ie', category: 'Compliance', description: 'Irish tax authority integration' },
    { name: 'Slack', category: 'Communication', description: 'Team communication platform' },
    { name: 'Zoom', category: 'Communication', description: 'Video conferencing integration' },
    { name: 'Mailchimp', category: 'Marketing', description: 'Email marketing automation' },
    { name: 'HubSpot', category: 'Sales', description: 'Inbound marketing and sales platform' },
    { name: 'AWS S3', category: 'Storage', description: 'Cloud storage for documents and media' },
    { name: 'Dropbox Business', category: 'Storage', description: 'File sharing and collaboration' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'disconnected': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-4 h-4 text-green-600" />\n  );
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />\n  );
      case 'error': return <AlertCircle className="w-4 h-4 text-red-600" />\n  );
      case 'disconnected': return <Plug className="w-4 h-4 text-gray-600" />\n  );
      default: return <AlertCircle className="w-4 h-4 text-gray-600" />\n  );
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Financial': return <DollarSign className="w-5 h-5" />\n  );
      case 'Compliance': return <Shield className="w-5 h-5" />\n  );
      case 'Productivity': return <Activity className="w-5 h-5" />\n  );
      case 'Location': return <MapPin className="w-5 h-5" />\n  );
      case 'Sales': return <TrendingUp className="w-5 h-5" />\n  );
      case 'Documents': return <FileText className="w-5 h-5" />\n  );
      case 'Communication': return <Mail className="w-5 h-5" />\n  );
      case 'Marketing': return <BarChart3 className="w-5 h-5" />\n  );
      case 'Storage': return <Database className="w-5 h-5" />\n  );
      default: return <Plug className="w-5 h-5" />\n  );
    }
  };

  const toggleApiKeyVisibility = (integrationId) => {
    setShowApiKey(prev => ({
      ...prev,
      [integrationId]: !prev[integrationId]
    }));
  };

  const filteredIntegrations = integrations.filter(integration =>
    integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    integration.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>
              <p className="text-sm text-gray-500">Connect your development workflow with external systems</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Export Config
              </button>
              <button 
                onClick={() => setShowNewIntegration(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Integration
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Plug className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Integrations</p>
                <p className="text-2xl font-bold text-gray-900">{integrationStats.totalIntegrations}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">{integrationStats.activeConnections}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{integrationStats.pendingSetup}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <AlertCircle className="w-8 h-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Errors</p>
                <p className="text-2xl font-bold text-gray-900">{integrationStats.errorConnections}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Activity className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Monthly API Calls</p>
                <p className="text-2xl font-bold text-gray-900">{integrationStats.monthlyApiCalls}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Uptime</p>
                <p className="text-2xl font-bold text-gray-900">{integrationStats.dataUptime}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="flex space-x-1">
                  {['overview', 'connected', 'available', 'settings'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        activeTab === tab
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search integrations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Sync All
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {filteredIntegrations.map((integration) => (
              <div key={integration.id} className="bg-white rounded-lg shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        {getCategoryIcon(integration.category)}
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{integration.name}</h3>
                        <p className="text-sm text-gray-600">{integration.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span>{integration.category}</span>
                          <span>•</span>
                          <span>by {integration.provider}</span>
                          {integration.lastSync && (
                            <>
                              <span>•</span>
                              <span>Last sync: {new Date(integration.lastSync).toLocaleString()}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(integration.status)}`}>
                        {getStatusIcon(integration.status)}
                        <span className="ml-2">{integration.status}</span>
                      </span>
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {integration.error && (
                    <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex items-center">
                        <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                        <span className="text-sm text-red-800">{integration.error}</span>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Features */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Features</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        {integration.features.map((featureindex) => (
                          <li key={index} className="flex items-center">
                            <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Usage Stats */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Usage Statistics</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Monthly Usage:</span>
                          <span className="font-medium">{integration.monthlyUsage}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Data Flow:</span>
                          <span className="font-medium capitalize">{integration.dataFlow}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Security:</span>
                          <span className={`font-medium ${integration.securityLevel === 'high' ? 'text-green-600' : 'text-yellow-600'}`}>
                            {integration.securityLevel}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Actions</h4>
                      <div className="space-y-2">
                        <div className="flex space-x-2">
                          <button className="flex-1 px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                            Configure
                          </button>
                          <button className="flex-1 px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                            Test
                          </button>
                        </div>
                        <div className="flex space-x-2">
                          <button className="flex-1 px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200">
                            Sync Now
                          </button>
                          <button className="flex-1 px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200">
                            Disconnect
                          </button>
                        </div>
                        <button className="w-full px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 flex items-center justify-center">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Documentation
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'connected' && (
          <div className="space-y-6">
            {filteredIntegrations.filter(i => i.status === 'connected').map((integration) => (
              <div key={integration.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">{integration.name}</h3>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Connected
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Configuration</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      {Object.entries(integration.configuration).map(([keyvalue]) => (
                        <div key={key} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                          <span className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}:</span>
                          <div className="flex items-center space-x-2">
                            {key.toLowerCase().includes('key') || key.toLowerCase().includes('token') || key.toLowerCase().includes('secret') ? (
                              <>
                                <span className="text-sm font-mono">
                                  {showApiKey[integration.id] ? value : value.toString().replace(/./g, '•')}
                                </span>
                                <button
                                  onClick={() => toggleApiKeyVisibility(integration.id)}
                                  className="text-gray-400 hover:text-gray-600"
                                >
                                  {showApiKey[integration.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                                <button className="text-gray-400 hover:text-gray-600">
                                  <Copy className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <span className="text-sm font-medium">{value.toString()}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'available' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableIntegrations.map((integrationindex) => (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    {getCategoryIcon(integration.category)}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{integration.name}</h3>
                    <p className="text-sm text-gray-500">{integration.category}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">{integration.description}</p>
                <div className="flex space-x-2">
                  <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                    Connect
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Integration Modal */}
      {showNewIntegration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Add New Integration</h2>
              <button
                onClick={() => setShowNewIntegration(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Popular Integrations</h3>
                <div className="grid grid-cols-1 gap-4">
                  {availableIntegrations.slice(0).map((integrationindex) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                            {getCategoryIcon(integration.category)}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{integration.name}</h4>
                            <p className="text-sm text-gray-500">{integration.description}</p>
                          </div>
                        </div>
                        <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                          Connect
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Custom Integration</h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Integration Name</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Custom ERP System"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                        <option>Select Category</option>
                        <option>Financial</option>
                        <option>Compliance</option>
                        <option>Productivity</option>
                        <option>Sales</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Provider</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Provider name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">API Endpoint</label>
                    <input
                      type="url"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://api.example.com/v1/"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Authentication Type</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                      <option>API Key</option>
                      <option>OAuth 2.0</option>
                      <option>Bearer Token</option>
                      <option>Basic Auth</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setShowNewIntegration(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Add Integration
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}