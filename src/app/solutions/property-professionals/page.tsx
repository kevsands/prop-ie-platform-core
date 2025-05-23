'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Building, Building2, Calendar, Users, MessageSquare, FileText, 
  ClipboardCheck, TrendingUp, Shield, Zap, Award,
  Compass, Ruler, HardDrive, HardHat, Wrench, Palette,
  Calculator, Clock, CheckCircle, AlertCircle, Settings,
  BarChart3, PieChart, Activity, Users as Users2, Briefcase,
  Layers, Package, FileCheck, Phone, Mail,
  Download, Upload, Search, Filter, ChevronRight,
  Scale, Home, Trees, Lightbulb, HeartHandshake
} from 'lucide-react';
import { motion } from 'framer-motion';

// Hero stats
const heroStats = [
  { number: '1,500+', label: 'Service Providers', icon: Users2 },
  { number: '5,000+', label: 'Projects Delivered', icon: Building },
  { number: '€3.5B', label: 'Project Value', icon: TrendingUp },
  { number: '99%', label: 'Client Satisfaction', icon: Award }
];

// Professional categories
const professionalCategories = [
  {
    id: 'design',
    name: 'Design & Architecture',
    icon: Compass,
    roles: ['Architects', 'Interior Designers', 'Landscape Architects', 'Urban Planners']
  },
  {
    id: 'engineering',
    name: 'Engineering',
    icon: Calculator,
    roles: ['Structural Engineers', 'MEP Engineers', 'Civil Engineers', 'Environmental Engineers']
  },
  {
    id: 'construction',
    name: 'Construction',
    icon: HardDrive,
    roles: ['General Contractors', 'Specialist Contractors', 'Project Managers', 'Site Supervisors']
  },
  {
    id: 'surveying',
    name: 'Surveying & Assessment',
    icon: Ruler,
    roles: ['Land Surveyors', 'Quantity Surveyors', 'Building Surveyors', 'Valuers']
  },
  {
    id: 'legal',
    name: 'Legal & Compliance',
    icon: Scale,
    roles: ['Solicitors', 'Planning Consultants', 'Building Control', 'Fire Safety Consultants']
  },
  {
    id: 'specialists',
    name: 'Specialist Services',
    icon: Lightbulb,
    roles: ['BIM Specialists', 'Sustainability Consultants', 'Acoustic Engineers', 'Heritage Consultants']
  }
];

// Core features
const coreFeatures = [
  {
    icon: Calendar,
    title: 'Appointment Management',
    description: 'Schedule and manage client meetings, site visits, and team collaborations',
    features: [
      'Automated scheduling with developers',
      'Site visit coordination',
      'Team availability management',
      'Virtual meeting integration'
    ]
  },
  {
    icon: Users2,
    title: 'Developer Portal',
    description: 'Dedicated workspace for each developer client with all project information',
    features: [
      'Real-time project updates',
      'Document sharing hub',
      'Milestone tracking',
      'Direct communication'
    ]
  },
  {
    icon: Layers,
    title: 'Team Collaboration',
    description: 'Coordinate with all stakeholders in the construction process',
    features: [
      'Multi-disciplinary team coordination',
      'Task assignment and tracking',
      'Issue management system',
      'Design version control'
    ]
  },
  {
    icon: FileCheck,
    title: 'Document Management',
    description: 'Centralized hub for all project documentation and drawings',
    features: [
      'CAD and BIM file management',
      'Document version control',
      'Automated approval workflows',
      'Secure file sharing'
    ]
  },
  {
    icon: ClipboardCheck,
    title: 'Compliance Tracking',
    description: 'Ensure all work meets regulatory and quality standards',
    features: [
      'Building regulations compliance',
      'Planning permission tracking',
      'Health & safety documentation',
      'Quality assurance checklists'
    ]
  },
  {
    icon: BarChart3,
    title: 'Business Analytics',
    description: 'Track performance, resources, and profitability',
    features: [
      'Time and resource tracking',
      'Project profitability analysis',
      'Performance dashboards',
      'Financial reporting'
    ]
  }
];

// Workflow steps
const workflowSteps = [
  {
    step: 1,
    title: 'Project Initiation',
    description: 'Receive brief, initial consultations, team assembly',
    icon: FileText
  },
  {
    step: 2,
    title: 'Planning & Design',
    description: 'Concept development, technical design, approvals',
    icon: Compass
  },
  {
    step: 3,
    title: 'Pre-Construction',
    description: 'Detailed specifications, procurement, mobilization',
    icon: Calculator
  },
  {
    step: 4,
    title: 'Construction',
    description: 'Site management, quality control, progress monitoring',
    icon: HardHat
  },
  {
    step: 5,
    title: 'Handover',
    description: 'Snagging, documentation, client training',
    icon: CheckCircle
  }
];

// Success stories
const successStories = [
  {
    company: 'O\'Connell Architecture',
    role: 'Architectural Firm',
    quote: 'Prop.ie transformed how we manage projects and collaborate with developers. Our efficiency has increased by 40%.',
    metric: '40% efficiency gain'
  },
  {
    company: 'BuildRight Contractors',
    role: 'General Contractor',
    quote: 'The platform streamlined our entire workflow from tender to handover. Client satisfaction has never been higher.',
    metric: '30% faster delivery'
  },
  {
    company: 'MEP Solutions Ltd',
    role: 'Engineering Consultancy',
    quote: 'Coordination with other trades is seamless now. No more clashes or miscommunication on site.',
    metric: '50% fewer RFIs'
  }
];

// Integration partners
const integrations = [
  { name: 'AutoCAD', icon: '🏗️', category: 'CAD Software' },
  { name: 'Revit', icon: '🏢', category: 'BIM Software' },
  { name: 'Microsoft Teams', icon: '💬', category: 'Communication' },
  { name: 'PlanGrid', icon: '📱', category: 'Field Management' },
  { name: 'Xero', icon: '💰', category: 'Accounting' },
  { name: 'DocuSign', icon: '📝', category: 'E-Signatures' }
];

export default function PropertyProfessionalsSolutionPage() {
  const [selectedCategorysetSelectedCategory] = useState('design');
  const [showDemosetShowDemo] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2B5273] to-[#1E3142] opacity-5" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="text-center mb-16">
            <motion.div
              initial={ opacity: 0, y: 20 }
              animate={ opacity: 1, y: 0 }
              transition={ duration: 0.6 }
            >
              <div className="flex justify-center mb-6">
                <div className="h-16 w-16 bg-[#2B5273] rounded-xl flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
              </div>

              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Property Service Providers Platform
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Complete project management solution for design professionals, engineers, 
                contractors, and all property service providers. Streamline your workflow 
                from concept to completion.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => setShowDemo(true)}
                  className="px-8 py-3 bg-[#2B5273] text-white rounded-lg font-medium hover:bg-[#1E3142] transition-all"
                >
                  Request Demo
                </button>
                <Link
                  href="/register/professional"
                  className="px-8 py-3 bg-white text-[#2B5273] border-2 border-[#2B5273] rounded-lg font-medium hover:bg-gray-50 transition-all"
                >
                  Get Started
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Hero Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {heroStats.map((statindex: any) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={ opacity: 0, y: 20 }
                  animate={ opacity: 1, y: 0 }
                  transition={ duration: 0.6, delay: index * 0.1 }
                  className="text-center"
                >
                  <Icon className="h-8 w-8 text-[#2B5273] mx-auto mb-3" />
                  <div className="text-3xl font-bold text-gray-900">{stat.number}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Professional Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              For Every Property Professional
            </h2>
            <p className="text-lg text-gray-600">
              Tailored solutions for all members of the property development ecosystem
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {professionalCategories.map((category: any) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-6 rounded-xl border-2 transition-all text-left ${
                    selectedCategory === category.id
                      ? 'border-[#2B5273] bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-10 w-10 text-[#2B5273] mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{category.name}</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {category.roles.map((roleindex: any) => (
                      <li key={index}>• {role}</li>
                    ))}
                  </ul>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-gray-600">
              Comprehensive tools for project delivery and business management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreFeatures.map((featureindex: any) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={ opacity: 0, y: 20 }
                  animate={ opacity: 1, y: 0 }
                  transition={ duration: 0.6, delay: index * 0.1 }
                  className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-all"
                >
                  <Icon className="h-12 w-12 text-[#2B5273] mb-6" />
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {feature.description}
                  </p>
                  <ul className="space-y-2">
                    {feature.features.map((itemidx: any) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <span className="text-sm text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Unified Project Workflow
            </h2>
            <p className="text-lg text-gray-600">
              From initial brief to final handover - all in one platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {workflowSteps.map((stepindex: any) => {
              const Icon = step.icon;
              return (
                <div key={index} className="text-center">
                  <div className="relative">
                    <div className="h-20 w-20 bg-[#2B5273] rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-10 w-10 text-white" />
                    </div>
                    {index <workflowSteps.length - 1 && (
                      <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gray-300">
                        <ChevronRight className="absolute -top-2.5 right-0 h-5 w-5 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">
                    Step {step.step}: {step.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-lg text-gray-600">
              See how property professionals are transforming their businesses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successStories.map((storyindex: any) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-sm">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900">{story.company}</h3>
                  <p className="text-gray-600">{story.role}</p>
                </div>
                <blockquote className="text-gray-700 mb-6">
                  "{story.quote}"
                </blockquote>
                <div className="bg-blue-50 rounded-lg px-4 py-2 inline-block">
                  <p className="text-[#2B5273] font-semibold">{story.metric}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Why Property Professionals Choose Prop.ie
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <HeartHandshake className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Seamless Collaboration
                    </h3>
                    <p className="text-gray-600">
                      Work effortlessly with developers, contractors, and other professionals 
                      in a unified platform designed for the property industry.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Increased Efficiency
                    </h3>
                    <p className="text-gray-600">
                      Automate routine tasks, streamline approvals, and eliminate 
                      communication bottlenecks to deliver projects faster.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Compliance Assured
                    </h3>
                    <p className="text-gray-600">
                      Built-in compliance tracking ensures all work meets Irish building 
                      regulations and planning requirements.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Business Growth
                    </h3>
                    <p className="text-gray-600">
                      Win more projects with professional presentation tools and 
                      demonstrate your expertise through our platform.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Platform Dashboard Preview
              </h3>

              {/* Mock Dashboard */}
              <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">
                    Active Projects
                  </h4>
                  <span className="text-sm text-[#2B5273] font-medium">
                    View All →
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium text-gray-900">Riverside Development</p>
                      <p className="text-sm text-gray-600">Phase 2 - Construction</p>
                    </div>
                    <span className="text-sm text-green-600 bg-green-100 px-3 py-1 rounded-full">
                      On Track
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium text-gray-900">City Center Plaza</p>
                      <p className="text-sm text-gray-600">Design Development</p>
                    </div>
                    <span className="text-sm text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                      In Review
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium text-gray-900">Harbour View Apartments</p>
                      <p className="text-sm text-gray-600">Planning Submission</p>
                    </div>
                    <span className="text-sm text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full">
                      Pending
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">24</p>
                      <p className="text-sm text-gray-600">Active Projects</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">156</p>
                      <p className="text-sm text-gray-600">Team Members</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">€2.4M</p>
                      <p className="text-sm text-gray-600">This Month</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Works with Your Existing Tools
            </h2>
            <p className="text-lg text-gray-600">
              Seamlessly integrate with industry-standard software
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {integrations.map((integrationindex: any) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 text-center hover:shadow-md transition-all"
              >
                <div className="text-4xl mb-3">{integration.icon}</div>
                <p className="text-sm font-medium text-gray-900">{integration.name}</p>
                <p className="text-xs text-gray-600 mt-1">{integration.category}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#2B5273] to-[#1E3142]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Join thousands of property professionals already using Prop.ie 
            to deliver exceptional projects
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setShowDemo(true)}
              className="px-8 py-3 bg-white text-[#2B5273] rounded-lg font-medium hover:bg-gray-100 transition-all"
            >
              Schedule Demo
            </button>
            <Link
              href="/register/professional"
              className="px-8 py-3 bg-transparent text-white border-2 border-white rounded-lg font-medium hover:bg-white/10 transition-all"
            >
              Start Free Trial
            </Link>
          </div>

          <p className="text-sm text-white/60 mt-6">
            No credit card required • 14-day free trial • Full feature access
          </p>
        </div>
      </section>

      {/* Demo Modal */}
      {showDemo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Schedule a Demo
            </h3>
            <p className="text-gray-600 mb-6">
              See how Prop.ie can transform your property services business
            </p>

            <form className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
              />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
              />
              <input
                type="text"
                placeholder="Company Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
              />
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
              >
                <option value="">Select Your Profession</option>
                <option value="architect">Architect</option>
                <option value="engineer">Engineer</option>
                <option value="contractor">Contractor</option>
                <option value="surveyor">Surveyor</option>
                <option value="designer">Interior Designer</option>
                <option value="other">Other Professional</option>
              </select>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#2B5273] text-white rounded-lg font-medium hover:bg-[#1E3142] transition-all"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setShowDemo(false)}
                  className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}