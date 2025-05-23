'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Home, User, Building, FileText, CreditCard, 
  Briefcase, TrendingUp, Users, BarChart, ArrowRight,
  Search, Shield, MessageSquare, Bell, LogOut
} from 'lucide-react';

export default function NavigationFlowDiagram() {
  const userFlows = [
    {
      role: 'BUYER',
      color: 'bg-blue-500',
      journey: [
        { step: 'Landing Page', icon: <Home className="h-4 w-4" /> },
        { step: 'Property Search', icon: <Search className="h-4 w-4" /> },
        { step: 'Authentication', icon: <Shield className="h-4 w-4" /> },
        { step: 'Buyer Dashboard', icon: <User className="h-4 w-4" /> },
        { step: 'Document Upload', icon: <FileText className="h-4 w-4" /> },
        { step: 'Transaction Flow', icon: <CreditCard className="h-4 w-4" /> }
      ]
    },
    {
      role: 'DEVELOPER',
      color: 'bg-green-500',
      journey: [
        { step: 'Login', icon: <Shield className="h-4 w-4" /> },
        { step: 'Developer Dashboard', icon: <Building className="h-4 w-4" /> },
        { step: 'Project Management', icon: <Briefcase className="h-4 w-4" /> },
        { step: 'Sales Pipeline', icon: <TrendingUp className="h-4 w-4" /> },
        { step: 'Financial Dashboard', icon: <BarChart className="h-4 w-4" /> },
        { step: 'Analytics', icon: <BarChart className="h-4 w-4" /> }
      ]
    },
    {
      role: 'AGENT',
      color: 'bg-purple-500',
      journey: [
        { step: 'Login', icon: <Shield className="h-4 w-4" /> },
        { step: 'Agent Dashboard', icon: <Users className="h-4 w-4" /> },
        { step: 'Listings', icon: <Building className="h-4 w-4" /> },
        { step: 'Lead Management', icon: <Users className="h-4 w-4" /> },
        { step: 'Viewings', icon: <Home className="h-4 w-4" /> },
        { step: 'Performance', icon: <BarChart className="h-4 w-4" /> }
      ]
    }
  ];

  const navigationComponents = [
    {
      name: 'MainNavigation',
      description: 'Primary navigation bar with role-based menus',
      features: ['Role-specific links', 'Transaction badges', 'Quick actions']
    },
    {
      name: 'SmartNav',
      description: 'Context-aware navigation for complex workflows',
      features: ['Dynamic breadcrumbs', 'Transaction context', 'User state']
    },
    {
      name: 'TransactionNav',
      description: 'Specialized navigation for active transactions',
      features: ['Progress tracking', 'Document status', 'Participant access']
    },
    {
      name: 'BreadcrumbNav',
      description: 'Hierarchical navigation path display',
      features: ['Context-aware', 'Click to navigate', 'Role-specific paths']
    }
  ];

  const integrationPoints = [
    {
      context: 'AuthContext',
      provides: ['User authentication', 'Role information', 'Permissions'],
      color: 'bg-red-500'
    },
    {
      context: 'TransactionContext',
      provides: ['Active transactions', 'Document status', 'Transaction count'],
      color: 'bg-blue-500'
    },
    {
      context: 'NavigationContext',
      provides: ['Navigation history', 'Breadcrumbs', 'Quick actions'],
      color: 'bg-green-500'
    },
    {
      context: 'UserRoleContext',
      provides: ['Role management', 'Permission checks', 'Feature access'],
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Navigation Integration Architecture</h1>
          <p className="mt-2 text-gray-600">
            Visual representation of how navigation components work together
          </p>
        </div>

        {/* User Flow Diagrams */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {userFlows.map((flow) => (
            <Card key={flow.role}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className={`inline-block w-3 h-3 rounded-full ${flow.color} mr-2`}></span>
                  {flow.role} Journey
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {flow.journey.map((stepindex) => (
                    <div key={index} className="flex items-center">
                      <div className={`p-2 rounded-lg ${flow.color} text-white`}>
                        {step.icon}
                      </div>
                      <span className="ml-3 text-sm font-medium">{step.step}</span>
                      {index <flow.journey.length - 1 && (
                        <ArrowRight className="ml-auto h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Navigation Components */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Navigation Components</CardTitle>
            <CardDescription>Core components that power the navigation system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {navigationComponents.map((component) => (
                <div key={component.name} className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">{component.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{component.description}</p>
                  <div className="space-y-1">
                    {component.features.map((featureindex) => (
                      <div key={index} className="text-sm flex items-center">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Context Integration */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Context Integration</CardTitle>
            <CardDescription>How different contexts work together to power navigation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {integrationPoints.map((point) => (
                <div key={point.context} className="text-center">
                  <div className={`w-20 h-20 mx-auto rounded-full ${point.color} text-white flex items-center justify-center mb-3`}>
                    <span className="font-semibold text-sm">{point.context}</span>
                  </div>
                  <div className="space-y-1">
                    {point.provides.map((itemindex) => (
                      <p key={index} className="text-xs text-gray-600">{item}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Connection Lines */}
            <div className="mt-8 p-6 bg-gray-100 rounded-lg">
              <h4 className="font-semibold mb-4 text-center">Data Flow</h4>
              <div className="flex justify-center items-center space-x-4">
                <Badge variant="outline">User Action</Badge>
                <ArrowRight className="h-4 w-4" />
                <Badge variant="outline">Navigation Context</Badge>
                <ArrowRight className="h-4 w-4" />
                <Badge variant="outline">Role Check</Badge>
                <ArrowRight className="h-4 w-4" />
                <Badge variant="outline">Transaction Update</Badge>
                <ArrowRight className="h-4 w-4" />
                <Badge variant="outline">UI Update</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Features */}
        <Card>
          <CardHeader>
            <CardTitle>Unified Navigation Features</CardTitle>
            <CardDescription>Key features enabled by the integrated navigation system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Dynamic Adaptation</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Role-based menu items</li>
                  <li>• Context-aware breadcrumbs</li>
                  <li>• Transaction-specific navigation</li>
                  <li>• Progressive disclosure</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Real-time Updates</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Transaction count badges</li>
                  <li>• Document status indicators</li>
                  <li>• Notification integration</li>
                  <li>• Quick action shortcuts</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">User Experience</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Consistent navigation patterns</li>
                  <li>• Mobile-optimized interface</li>
                  <li>• Keyboard accessibility</li>
                  <li>• Performance optimization</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}