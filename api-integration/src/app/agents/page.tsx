'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Building, Users, TrendingUp, Calendar, MapPin, Phone, Mail, MessageSquare,
  BarChart3, PlusCircle, Search, ArrowRight, Eye, Heart, FileText, Globe,
  Smartphone, Bell, Settings, ChevronRight, Activity, Zap, Briefcase, Home,
  CheckCircle, AlertCircle, User, UserPlus, Grid3X3, List, Star, Award,
  Target, Clock, Euro, Download, Share2, Camera, Filter, MoreHorizontal
} from 'lucide-react';

export default function EstateAgentSolutionsPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const platformBenefits = [
    {
      title: 'Streamlined Client Management',
      description: 'Connect your clients directly to the most advanced property platform in Ireland',
      features: [
        'Automated client onboarding to developer properties',
        'Real-time progress tracking for all transactions',
        'Integrated mortgage and HTB application workflows',
        'Digital document exchange and e-signatures'
      ],
      icon: Users,
      metrics: '67% faster transaction completion'
    },
    {
      title: 'Enhanced Property Marketing',
      description: 'Showcase developer properties with cutting-edge technology',
      features: [
        '3D property visualization and virtual tours',
        'Interactive floor plans and customization tools',
        'AI-powered property matching for clients',
        'Integrated marketing automation and lead capture'
      ],
      icon: Building,
      metrics: '340% increase in qualified leads'
    },
    {
      title: 'Advanced Analytics & Insights',
      description: 'Data-driven insights to optimize your sales performance',
      features: [
        'Real-time market analytics and price trends',
        'Client behavior tracking and engagement metrics',
        'Commission tracking and financial reporting',
        'Predictive analytics for buyer preferences'
      ],
      icon: BarChart3,
      metrics: '85% better client conversion rates'
    },
    {
      title: 'Digital Transaction Management',
      description: 'End-to-end transaction coordination with all stakeholders',
      features: [
        'Multi-party transaction workflow automation',
        'Integrated solicitor and lender communications',
        'Milestone tracking and automated notifications',
        'Secure document storage and compliance monitoring'
      ],
      icon: FileText,
      metrics: '99.7% transaction completion rate'
    }
  ];

  const integrationFeatures = [
    {
      category: 'Client Onboarding',
      description: 'Seamlessly onboard your clients to the platform',
      capabilities: [
        'White-label client portal access',
        'Automated HTB and mortgage application routing',
        'KYC verification and compliance management',
        'Custom branding and agent attribution'
      ]
    },
    {
      category: 'Sales Team Management',
      description: 'Manage your entire sales team on one platform',
      capabilities: [
        'Multi-agent dashboard with performance tracking',
        'Lead distribution and territory management',
        'Commission calculation and reporting',
        'Team collaboration and communication tools'
      ]
    },
    {
      category: 'Developer Integration',
      description: 'Connect with Ireland\'s leading property developers',
      capabilities: [
        'Direct access to pre-launch and off-plan properties',
        'Real-time availability and pricing updates',
        'Exclusive agent pricing and commission structures',
        'Priority access to new development launches'
      ]
    },
    {
      category: 'Marketing Automation',
      description: 'Automated marketing workflows for maximum efficiency',
      capabilities: [
        'Automated email campaigns and follow-ups',
        'Social media integration and content sharing',
        'Lead nurturing and conversion optimization',
        'Performance analytics and ROI tracking'
      ]
    }
  ];

  const successMetrics = [
    { metric: '€847M+', description: 'Annual transaction volume processed' },
    { metric: '15,000+', description: 'Active estate agent partnerships' },
    { metric: '94.7%', description: 'Client satisfaction rate' },
    { metric: '67%', description: 'Faster transaction completion' }
  ];

  const tabs = [
    { id: 'overview', label: 'Platform Overview', icon: Globe },
    { id: 'integration', label: 'Agent Integration', icon: UserPlus },
    { id: 'technology', label: 'Technology Stack', icon: Zap },
    { id: 'support', label: 'Training & Support', icon: Heart }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-green-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6">Estate Agent Solutions</h1>
              <p className="text-xl text-blue-100 mb-8">
                Partner with Ireland's most advanced property platform. Connect your clients 
                to cutting-edge technology, streamlined processes, and exclusive developer partnerships.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-3xl font-bold text-green-400">€847M+</div>
                  <div className="text-blue-200">Annual Transactions</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-yellow-400">15K+</div>
                  <div className="text-blue-200">Agent Partners</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-400">94.7%</div>
                  <div className="text-blue-200">Client Satisfaction</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-red-400">67%</div>
                  <div className="text-blue-200">Faster Completions</div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <h3 className="text-xl font-semibold mb-6">Get Started Today</h3>
              <div className="space-y-4">
                <Link 
                  href="/contact?ref=agent-solutions"
                  className="block w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold text-center transition-all"
                >
                  Request Partnership Demo
                </Link>
                <Link 
                  href="/solutions/onboarding"
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold text-center transition-all"
                >
                  Onboard Your Team
                </Link>
                <div className="text-center">
                  <Link href="/solutions/pricing" className="text-blue-200 hover:text-white underline">
                    View Partnership Tiers
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Metrics */}
      <section className="bg-white py-12 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold">Trusted by Ireland's Leading Estate Agents</h2>
            <p className="text-gray-600">Join thousands of agents already using our platform</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {successMetrics.map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{item.metric}</div>
                <div className="text-gray-600">{item.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
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

      {/* Content Area */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          
          {/* Platform Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-12">
              <div className="text-center max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-6">Transform Your Estate Agency Business</h2>
                <p className="text-lg text-gray-700">
                  PROP.ie provides estate agents with the most advanced property technology platform 
                  in Ireland. Connect your clients to exclusive developments, streamline transactions, 
                  and grow your business with cutting-edge tools.
                </p>
              </div>

              <div className="grid gap-8">
                {platformBenefits.map((benefit, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg p-8 border">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center">
                        <div className="p-4 bg-blue-100 rounded-xl mr-6">
                          <benefit.icon className="h-8 w-8 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold">{benefit.title}</h3>
                          <p className="text-gray-600 mt-2">{benefit.description}</p>
                          <div className="text-green-600 font-semibold mt-1">{benefit.metrics}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500 mb-1">Enterprise Solution</div>
                        <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          Agent Ready
                        </div>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Key Features</h4>
                        <ul className="space-y-2">
                          {benefit.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-start">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-700">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h4 className="font-semibold mb-3">Business Impact</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Implementation Time</span>
                            <span className="font-semibold text-blue-600">2-5 days</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Training Required</span>
                            <span className="font-semibold text-green-600">Minimal</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">ROI Timeline</span>
                            <span className="font-semibold text-purple-600">30-60 days</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Agent Integration */}
          {activeTab === 'integration' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-center">Seamless Agent Integration</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                {integrationFeatures.map((feature, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm p-8 border">
                    <h3 className="text-xl font-bold mb-3">{feature.category}</h3>
                    <p className="text-gray-700 mb-6">{feature.description}</p>
                    <ul className="space-y-3">
                      {feature.capabilities.map((capability, capIndex) => (
                        <li key={capIndex} className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{capability}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-8 border">
                <h3 className="text-xl font-bold mb-6">Integration Process</h3>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold text-xl">1</span>
                    </div>
                    <h4 className="font-semibold mb-2">Partnership Agreement</h4>
                    <p className="text-sm text-gray-600">Sign partnership agreement and choose your tier</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold text-xl">2</span>
                    </div>
                    <h4 className="font-semibold mb-2">Team Onboarding</h4>
                    <p className="text-sm text-gray-600">Onboard your sales team and set up accounts</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold text-xl">3</span>
                    </div>
                    <h4 className="font-semibold mb-2">Training & Setup</h4>
                    <p className="text-sm text-gray-600">Complete platform training and configuration</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold text-xl">4</span>
                    </div>
                    <h4 className="font-semibold mb-2">Go Live</h4>
                    <p className="text-sm text-gray-600">Start connecting clients and managing transactions</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Technology Stack */}
          {activeTab === 'technology' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-center">Enterprise Technology Stack</h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white rounded-xl shadow-sm p-8 border">
                  <Globe className="h-12 w-12 text-blue-600 mb-4" />
                  <h3 className="text-xl font-bold mb-3">Cloud-Native Platform</h3>
                  <p className="text-gray-700 mb-4">Built on AWS with 99.97% uptime and enterprise-grade security</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center"><CheckCircle className="h-3 w-3 text-green-500 mr-2" />Auto-scaling infrastructure</li>
                    <li className="flex items-center"><CheckCircle className="h-3 w-3 text-green-500 mr-2" />Global CDN for fast loading</li>
                    <li className="flex items-center"><CheckCircle className="h-3 w-3 text-green-500 mr-2" />Real-time data synchronization</li>
                  </ul>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-8 border">
                  <Smartphone className="h-12 w-12 text-green-600 mb-4" />
                  <h3 className="text-xl font-bold mb-3">Mobile-First Design</h3>
                  <p className="text-gray-700 mb-4">Responsive design optimized for mobile agents and clients</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center"><CheckCircle className="h-3 w-3 text-green-500 mr-2" />Native mobile apps</li>
                    <li className="flex items-center"><CheckCircle className="h-3 w-3 text-green-500 mr-2" />Progressive web app</li>
                    <li className="flex items-center"><CheckCircle className="h-3 w-3 text-green-500 mr-2" />Offline functionality</li>
                  </ul>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-8 border">
                  <Activity className="h-12 w-12 text-purple-600 mb-4" />
                  <h3 className="text-xl font-bold mb-3">AI & Analytics</h3>
                  <p className="text-gray-700 mb-4">Machine learning powered insights and automation</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center"><CheckCircle className="h-3 w-3 text-green-500 mr-2" />Predictive analytics</li>
                    <li className="flex items-center"><CheckCircle className="h-3 w-3 text-green-500 mr-2" />Automated lead scoring</li>
                    <li className="flex items-center"><CheckCircle className="h-3 w-3 text-green-500 mr-2" />Market intelligence</li>
                  </ul>
                </div>
              </div>

              <div className="bg-slate-900 text-white rounded-xl p-8">
                <h3 className="text-xl font-bold mb-6">Platform Performance</h3>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400">99.97%</div>
                    <div className="text-gray-300">Uptime SLA</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400">&lt;0.5s</div>
                    <div className="text-gray-300">Page Load Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400">10M+</div>
                    <div className="text-gray-300">Monthly API Calls</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-400">ISO 27001</div>
                    <div className="text-gray-300">Security Certified</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Training & Support */}
          {activeTab === 'support' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-center">Comprehensive Training & Support</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl shadow-sm p-8 border">
                  <h3 className="text-xl font-bold mb-6">Training Programs</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-1" />
                      <div>
                        <h4 className="font-semibold">Platform Onboarding</h4>
                        <p className="text-sm text-gray-600">2-day comprehensive training program</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-1" />
                      <div>
                        <h4 className="font-semibold">Advanced Features Training</h4>
                        <p className="text-sm text-gray-600">Specialized workshops for power users</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-1" />
                      <div>
                        <h4 className="font-semibold">Ongoing Education</h4>
                        <p className="text-sm text-gray-600">Monthly webinars and feature updates</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-1" />
                      <div>
                        <h4 className="font-semibold">Certification Program</h4>
                        <p className="text-sm text-gray-600">Official PROP.ie agent certification</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-8 border">
                  <h3 className="text-xl font-bold mb-6">Support Services</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-1" />
                      <div>
                        <h4 className="font-semibold">24/7 Technical Support</h4>
                        <p className="text-sm text-gray-600">Round-the-clock platform assistance</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-1" />
                      <div>
                        <h4 className="font-semibold">Dedicated Account Manager</h4>
                        <p className="text-sm text-gray-600">Personal support for enterprise partners</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-1" />
                      <div>
                        <h4 className="font-semibold">Implementation Support</h4>
                        <p className="text-sm text-gray-600">Hands-on setup and configuration</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-1" />
                      <div>
                        <h4 className="font-semibold">Marketing Support</h4>
                        <p className="text-sm text-gray-600">Co-marketing opportunities and materials</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8 border">
                <div className="text-center max-w-4xl mx-auto">
                  <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Business?</h3>
                  <p className="text-lg text-gray-700 mb-8">
                    Join Ireland's leading estate agents who are already using PROP.ie to deliver 
                    exceptional client experiences and grow their businesses.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link 
                      href="/contact?ref=agent-partnership"
                      className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all"
                    >
                      Schedule Partnership Demo
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                    <Link 
                      href="/solutions/case-studies"
                      className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-all border border-blue-200"
                    >
                      View Success Stories
                      <Eye className="ml-2 h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}