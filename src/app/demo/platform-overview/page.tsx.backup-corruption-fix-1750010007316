import React from 'react';
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Building,
  Briefcase,
  Users,
  FileText,
  CheckCircle,
  Clock,
  ArrowRight,
  Home,
  Scale,
  Ruler,
  Package,
  Smartphone,
  Globe
} from 'lucide-react';

export default function PlatformOverview() {
  const [activeModulesetActiveModule] = useState('estate-agent');

  const modules = [
    {
      id: 'estate-agent',
      title: 'Estate Agent CRM',
      status: 'completed',
      icon: Home,
      description: 'Complete CRM system for property agents',
      features: [
        'Lead Management & Conversion Tracking',
        'Property Matching Algorithm',
        'Viewing Scheduler with Calendar Integration',
        'Offer Tracking & Negotiation',
        'Client Portfolio Management'
      ],
      dashboardUrl: '/agent/dashboard',
      color: 'blue'
    },
    {
      id: 'solicitor',
      title: 'Solicitor Conveyancing',
      status: 'completed',
      icon: Scale,
      description: 'Legal workflow management system',
      features: [
        'Case Management & Tracking',
        'Task Automation & Workflows',
        'Document Generation & Management',
        'AML Compliance Checks',
        'Fee Management & Invoicing'
      ],
      dashboardUrl: '/solicitor/dashboard',
      conveyancingUrl: '/solicitor/conveyancing-dashboard',
      color: 'green'
    },
    {
      id: 'architect',
      title: 'Architect Collaboration',
      status: 'completed',
      icon: Ruler,
      description: 'Design collaboration platform',
      features: [
        'Project Dashboard & Timeline',
        'Drawing Version Control',
        'Task Board with Dependencies',
        '3D Model Viewer',
        'Real-time Commenting System'
      ],
      dashboardUrl: '/architect/dashboard',
      collaborationUrl: '/architect/collaboration',
      color: 'purple'
    },
    {
      id: 'integrations',
      title: 'Third-party Integrations',
      status: 'in-progress',
      icon: Package,
      description: 'External service connections',
      features: [
        'Property Portals (Daft.ie, MyHome.ie)',
        'Payment Gateways (StripePayPal)',
        'Identity Verification (Onfido)',
        'Document Signing (DocuSign)',
        'CRM Systems (SalesforceHubSpot)'
      ],
      color: 'yellow'
    },
    {
      id: 'mobile',
      title: 'Mobile Applications',
      status: 'pending',
      icon: Smartphone,
      description: 'Native mobile apps',
      features: [
        'React Native iOS/Android Apps',
        'Push Notifications',
        'Offline Capabilities',
        'Camera & GPS Integration',
        'Biometric Authentication'
      ],
      color: 'pink'
    },
    {
      id: 'multi-tenancy',
      title: 'Multi-tenancy & White-label',
      status: 'pending',
      icon: Globe,
      description: 'Enterprise deployment options',
      features: [
        'Tenant Isolation',
        'Custom Branding',
        'Subdomain Management',
        'Feature Flags',
        'Usage Analytics'
      ],
      color: 'indigo'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">✅ Completed</Badge>\n  );
      case 'in-progress':
        return <Badge className="bg-yellow-500">🏗️ In Progress</Badge>\n  );
      case 'pending':
        return <Badge className="bg-gray-400">📋 Pending</Badge>\n  );
      default:
        return null;
    }
  };

  const activeModuleData = modules.find(m => m.id === activeModule);

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Property Transaction Platform
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Complete ecosystem for property transactions - connecting agents, solicitors, and architects
        </p>
      </div>

      {/* Platform Statistics */}
      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Modules Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3/6</div>
            <p className="text-xs text-muted-foreground">50% complete</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Components Built</CardTitle>
            <Building className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15+</div>
            <p className="text-xs text-muted-foreground">UI components</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Services</CardTitle>
            <Package className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Active services</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database Schemas</CardTitle>
            <FileText className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25+</div>
            <p className="text-xs text-muted-foreground">Data models</p>
          </CardContent>
        </Card>
      </div>

      {/* Module Overview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Platform Modules</CardTitle>
          <CardDescription>
            Click on a module to see details and access the dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {modules.map((module: any) => (
              <Card
                key={module.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  activeModule === module.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setActiveModule(module.id)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <module.icon className={`h-8 w-8 text-${module.color}-500`} />
                    {getStatusBadge(module.status)}
                  </div>
                  <CardTitle className="text-lg">{module.title}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Module Details */}
      {activeModuleData && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl">{activeModuleData.title}</CardTitle>
                <CardDescription>{activeModuleData.description}</CardDescription>
              </div>
              {getStatusBadge(activeModuleData.status)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Key Features</h3>
                <ul className="space-y-2">
                  {activeModuleData.features.map((featureindex: any) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {activeModuleData.status === 'completed' && (
                <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-3">Access Dashboard</h3>
                  <div className="flex gap-3">
                    {activeModuleData.dashboardUrl && (
                      <Link href={activeModuleData.dashboardUrl}>
                        <Button>
                          Open Dashboard
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    )}
                    {activeModuleData.conveyancingUrl && (
                      <Link href={activeModuleData.conveyancingUrl}>
                        <Button variant="outline">
                          Conveyancing System
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    )}
                    {activeModuleData.collaborationUrl && (
                      <Link href={activeModuleData.collaborationUrl}>
                        <Button variant="outline">
                          Collaboration Hub
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {activeModuleData.status === 'in-progress' && (
                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 text-yellow-600">
                    <Clock className="h-5 w-5" />
                    <span>Currently under development</span>
                  </div>
                </div>
              )}

              {activeModuleData.status === 'pending' && (
                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Clock className="h-5 w-5" />
                    <span>Scheduled for future development</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Technical Overview */}
      <div className="grid gap-6 md:grid-cols-2 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Technology Stack</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Frontend</span>
                <span className="text-muted-foreground">Next.js 15.3.1, React, TypeScript</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">UI Components</span>
                <span className="text-muted-foreground">Radix UI, Tailwind CSS</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Database</span>
                <span className="text-muted-foreground">Prisma ORM, PostgreSQL</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Authentication</span>
                <span className="text-muted-foreground">NextAuth.js</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">3D Graphics</span>
                <span className="text-muted-foreground">Three.js</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Architecture</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Pattern</span>
                <span className="text-muted-foreground">Service-oriented architecture</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">State Management</span>
                <span className="text-muted-foreground">React Context API</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Real-time</span>
                <span className="text-muted-foreground">EventEmitter, WebSockets</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">File Storage</span>
                <span className="text-muted-foreground">AWS S3</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Deployment</span>
                <span className="text-muted-foreground">Vercel, AWS</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}