'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Bot, 
  Brain, 
  MessageSquare, 
  TrendingUp, 
  Users, 
  Zap, 
  BarChart3, 
  Mail, 
  Phone, 
  Globe, 
  CheckCircle,
  ArrowRight,
  Sparkles,
  Target,
  Calendar,
  FileText,
  Shield,
  RefreshCw,
  ChevronRight,
  Play,
  DollarSign,
  Clock,
  UserCheck
} from 'lucide-react';

const aiAgents = [
  {
    name: 'PropertyBot AI',
    description: 'Intelligent chatbot that handles property inquiries 24/7',
    features: [
      'Natural language processing',
      'Multi-language support',
      'Instant property matching',
      'Lead qualification'
    ],
    savings: '€45,000/year',
    icon: <Bot className="w-8 h-8" />,
    color: 'from-blue-500 to-purple-600'
  },
  {
    name: 'Sales Intelligence AI',
    description: 'Predictive analytics for sales optimization',
    features: [
      'Lead scoring & prioritization',
      'Price optimization',
      'Market trend analysis',
      'Buyer behavior insights'
    ],
    savings: '€62,000/year',
    icon: <Brain className="w-8 h-8" />,
    color: 'from-purple-500 to-pink-600'
  },
  {
    name: 'Document Wizard AI',
    description: 'Automated document generation and processing',
    features: [
      'Contract generation',
      'Legal compliance check',
      'E-signature integration',
      'Document tracking'
    ],
    savings: '€38,000/year',
    icon: <FileText className="w-8 h-8" />,
    color: 'from-green-500 to-teal-600'
  },
  {
    name: 'Marketing Genius AI',
    description: 'Automated content creation and campaign management',
    features: [
      'Property descriptions',
      'Social media content',
      'Email campaigns',
      'SEO optimization'
    ],
    savings: '€52,000/year',
    icon: <Sparkles className="w-8 h-8" />,
    color: 'from-yellow-500 to-orange-600'
  }
];

const automationFeatures = [
  {
    title: 'Lead Management System',
    description: 'Centralize all leads from multiple channels into one intelligent system',
    features: [
      'Automated lead distribution',
      'Response time tracking',
      'Follow-up automation',
      'Lead lifecycle management'
    ],
    metrics: {
      leads: '3x more leads converted',
      time: '75% faster response time',
      cost: '60% lower cost per lead'
    },
    icon: <UserCheck className="w-6 h-6" />
  },
  {
    title: 'Virtual Property Tours',
    description: 'Interactive 3D tours and AR experiences for remote viewing',
    features: [
      '360° property walkthroughs',
      'AR furniture placement',
      'Virtual staging',
      'Live guided tours'
    ],
    metrics: {
      views: '5x more property views',
      time: '40% less site visits needed',
      cost: '€500 saved per sale'
    },
    icon: <Globe className="w-6 h-6" />
  },
  {
    title: 'Smart Email Campaigns',
    description: 'Personalized, automated email marketing at scale',
    features: [
      'Behavior-triggered emails',
      'Dynamic content',
      'A/B testing',
      'Performance analytics'
    ],
    metrics: {
      open: '45% higher open rates',
      click: '3x click-through rate',
      roi: '€8 ROI per €1 spent'
    },
    icon: <Mail className="w-6 h-6" />
  },
  {
    title: 'Social Media Automation',
    description: 'Schedule and optimize social media presence across platforms',
    features: [
      'Multi-platform posting',
      'Content calendar',
      'Engagement tracking',
      'Influencer partnerships'
    ],
    metrics: {
      reach: '10x social reach',
      engagement: '65% more engagement',
      time: '15 hours saved weekly'
    },
    icon: <Users className="w-6 h-6" />
  }
];

const testimonials = [
  {
    name: 'Michael Fitzgerald',
    role: 'CEO, Fitzgerald Developments',
    image: '/images/testimonials/michael-fitzgerald.jpg',
    quote: 'PropIE\'s marketing platform has revolutionized how we sell properties. We\'ve reduced our sales team by 50% while doubling our conversion rates.',
    metrics: '€1.2M saved annually'
  },
  {
    name: 'Sarah O\'Brien',
    role: 'Marketing Director, Ellwood Properties',
    image: '/images/testimonials/sarah-obrien.jpg',
    quote: 'The AI agents handle 80% of our customer inquiries, allowing our team to focus on high-value activities.',
    metrics: '300% ROI in 6 months'
  }
];

export default function DeveloperMarketingPage() {
  const [activeTabsetActiveTab] = useState('ai-agents');
  const [selectedAgentsetSelectedAgent] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-grid-white/10"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">AI-Powered Marketing Platform</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Revolutionize Your Property Marketing
            </h1>

            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Harness the power of AI agents and automation to streamline your sales process, 
              reduce costs, and maximize conversions. All from one centralized platform.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/demo/marketing"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Link>
              <Link
                href="/contact/sales"
                className="inline-flex items-center px-8 py-4 bg-transparent text-white border-2 border-white rounded-lg font-semibold hover:bg-white/10 transition-all"
              >
                Talk to Sales
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { label: 'Cost Reduction', value: '65%', icon: <DollarSign className="w-6 h-6" /> },
              { label: 'Faster Sales Cycle', value: '3x', icon: <Clock className="w-6 h-6" /> },
              { label: 'Lead Conversion', value: '45%', icon: <TrendingUp className="w-6 h-6" /> },
              { label: 'ROI Increase', value: '320%', icon: <BarChart3 className="w-6 h-6" /> }
            ].map((metricindex: any) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-3 text-white">
                  {metric.icon}
                </div>
                <div className="text-3xl font-bold text-white mb-1">{metric.value}</div>
                <div className="text-white/80">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Agents Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Your AI Sales Force
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Intelligent agents that work 24/7 to qualify leads, answer questions, 
              and close deals - at a fraction of the cost of traditional sales teams.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('ai-agents')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'ai-agents'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                AI Agents
              </button>
              <button
                onClick={() => setActiveTab('automation')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'automation'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Automation Tools
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'analytics'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Analytics & Insights
              </button>
            </div>
          </div>

          {/* AI Agents Content */}
          {activeTab === 'ai-agents' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                {aiAgents.map((agentindex: any) => (
                  <div
                    key={index}
                    onClick={() => setSelectedAgent(index)}
                    className={`cursor-pointer p-6 rounded-xl transition-all ${
                      selectedAgent === index
                        ? 'bg-white shadow-xl border-2 border-blue-500'
                        : 'bg-gray-50 hover:bg-white hover:shadow-lg'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg bg-gradient-to-r ${agent.color} text-white`}>
                        {agent.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {agent.name}
                        </h3>
                        <p className="text-gray-600 mb-3">{agent.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            Saves {agent.savings}
                          </span>
                          <ChevronRight className={`w-5 h-5 transition-transform ${
                            selectedAgent === index ? 'rotate-90' : ''
                          }`} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="sticky top-8">
                <div className="bg-white rounded-xl shadow-xl p-8">
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${aiAgents[selectedAgent].color} text-white mb-6`}>
                    {aiAgents[selectedAgent].icon}
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {aiAgents[selectedAgent].name}
                  </h3>

                  <p className="text-lg text-gray-600 mb-6">
                    {aiAgents[selectedAgent].description}
                  </p>

                  <div className="space-y-3 mb-8">
                    {aiAgents[selectedAgent].features.map((featureidx: any) => (
                      <div key={idx} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg mb-6">
                    <div className="text-sm text-blue-600 mb-1">Annual Savings</div>
                    <div className="text-2xl font-bold text-blue-900">
                      {aiAgents[selectedAgent].savings}
                    </div>
                  </div>

                  <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Automation Content */}
          {activeTab === 'automation' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {automationFeatures.map((featureindex: any) => (
                <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="p-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-lg mb-4">
                      {feature.icon}
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {feature.title}
                    </h3>

                    <p className="text-gray-600 mb-6">
                      {feature.description}
                    </p>

                    <div className="space-y-2 mb-6">
                      {feature.features.map((itemidx: any) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100">
                      {Object.entries(feature.metrics).map(([keyvalue]) => (
                        <div key={key} className="text-center">
                          <div className="text-lg font-semibold text-gray-900">{value}</div>
                          <div className="text-xs text-gray-500 capitalize">{key}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Analytics Content */}
          {activeTab === 'analytics' && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-8 lg:p-12">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Real-Time Performance Dashboard
                  </h3>

                  <p className="text-lg text-gray-600 mb-8">
                    Get instant insights into your marketing performance with our 
                    comprehensive analytics dashboard. Track ROI, conversion rates, 
                    and customer behavior in real-time.
                  </p>

                  <div className="space-y-6">
                    {[
                      {
                        title: 'Lead Analytics',
                        description: 'Track lead sources, quality scores, and conversion paths',
                        icon: <Target className="w-6 h-6" />
                      },
                      {
                        title: 'Campaign Performance',
                        description: 'Monitor ROI across all marketing channels',
                        icon: <BarChart3 className="w-6 h-6" />
                      },
                      {
                        title: 'Customer Journey Mapping',
                        description: 'Visualize buyer paths from first touch to purchase',
                        icon: <RefreshCw className="w-6 h-6" />
                      },
                      {
                        title: 'Predictive Analytics',
                        description: 'AI-powered forecasting for sales and inventory',
                        icon: <Brain className="w-6 h-6" />
                      }
                    ].map((itemindex: any) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                          {item.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                          <p className="text-gray-600">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 lg:p-12 flex items-center justify-center">
                  <div className="w-full max-w-md">
                    <Image
                      src="/images/solutions/analytics-dashboard.png"
                      alt="Analytics Dashboard"
                      width={600}
                      height={400}
                      className="rounded-lg shadow-2xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 lg:p-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Calculate Your ROI
                </h2>

                <p className="text-lg text-gray-600 mb-8">
                  See how much you could save by switching to PropIE's AI-powered 
                  marketing platform. Input your current costs to get a personalized estimate.
                </p>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Sales Team Size
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 10"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Average Annual Marketing Spend
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., €500,000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Properties Sold Annually
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 200"
                    />
                  </div>

                  <button className="w-full py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                    Calculate Savings
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-600 to-purple-700 p-8 lg:p-12 text-white">
                <h3 className="text-2xl font-bold mb-6">Your Estimated Savings</h3>

                <div className="space-y-6">
                  <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                    <div className="text-sm text-white/80 mb-1">Annual Cost Reduction</div>
                    <div className="text-3xl font-bold">€245,000</div>
                  </div>

                  <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                    <div className="text-sm text-white/80 mb-1">Increased Revenue</div>
                    <div className="text-3xl font-bold">€380,000</div>
                  </div>

                  <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                    <div className="text-sm text-white/80 mb-1">Total Annual Benefit</div>
                    <div className="text-3xl font-bold">€625,000</div>
                  </div>

                  <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                    <div className="text-sm text-white/80 mb-1">ROI in First Year</div>
                    <div className="text-3xl font-bold">385%</div>
                  </div>
                </div>

                <div className="mt-8 text-sm text-white/80">
                  * Based on average customer results. Your actual results may vary.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600">
              See how leading developers are transforming their sales with PropIE
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonialindex: any) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-600">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600">{testimonial.role}</p>
                  </div>
                </div>

                <blockquote className="text-lg text-gray-700 mb-6">
                  "{testimonial.quote}"
                </blockquote>

                <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                  <span className="text-sm text-gray-500">Key Result</span>
                  <span className="font-semibold text-blue-600">{testimonial.metrics}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Property Marketing?
          </h2>

          <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto">
            Join hundreds of developers who are already saving millions with our 
            AI-powered marketing platform. Start your free trial today.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center px-8 py-4 bg-transparent text-white border-2 border-white rounded-lg font-semibold hover:bg-white/10 transition-all"
            >
              <Play className="w-5 h-5 mr-2" />
              Request Demo
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/80">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span>Enterprise Security</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>24/7 Support</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              <span>No Setup Fees</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}