'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  User, Building, FileText, CreditCard, Home, 
  Briefcase, TrendingUp, Users, BarChart, ChevronRight 
} from 'lucide-react';

export default function NavigationDemoPage() {
  const { user, signIn, signOut, isAuthenticated } = useAuth();

  const [selectedRolesetSelectedRole] = useState<string>('BUYER');
  const [mockTransactionCount] = useState(0);

  // Mock login for different roles
  const loginAs = async (role: string) => {
    await signIn(`${role.toLowerCase()}@demo.com`, 'demo123');
  };

  const roleCards = [
    {
      role: 'BUYER',
      title: 'Buyer Journey',
      description: 'Experience the property buying process',
      icon: <Home className="h-5 w-5" />,
      color: 'bg-blue-500',
      features: ['Property Search', 'Document Upload', 'Transaction Tracking', 'HTB Calculator']
    },
    {
      role: 'DEVELOPER',
      title: 'Developer Dashboard',
      description: 'Manage developments and sales',
      icon: <Building className="h-5 w-5" />,
      color: 'bg-green-500',
      features: ['Development Management', 'Sales Dashboard', 'Buyer Management', 'Analytics']
    },
    {
      role: 'SOLICITOR',
      title: 'Solicitor Portal',
      description: 'Handle legal documents and processes',
      icon: <Briefcase className="h-5 w-5" />,
      color: 'bg-purple-500',
      features: ['Document Management', 'Client Communication', 'Compliance Tracking', 'E-signatures']
    },
    {
      role: 'ADMIN',
      title: 'System Admin',
      description: 'Full platform administration',
      icon: <Users className="h-5 w-5" />,
      color: 'bg-red-500',
      features: ['User Management', 'System Settings', 'Analytics', 'Security']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Navigation & Role Demo</h1>
          <p className="text-gray-600">
            Explore different user roles and navigation patterns in the platform
          </p>
        </div>

        {/* Current User Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Current Session</span>
              {isAuthenticated && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={signOut}
                >
                  Sign Out
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-gray-500">Status</div>
                <Badge variant={isAuthenticated ? 'success' : 'secondary'}>
                  {isAuthenticated ? 'Authenticated' : 'Guest'}
                </Badge>
              </div>
              <div>
                <div className="text-sm text-gray-500">User</div>
                <div className="font-medium">
                  {user?.email || 'Not logged in'}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Role</div>
                <div className="font-medium">
                  {user?.role || 'None'}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Transactions</div>
                <div className="font-medium">
                  {mockTransactionCount}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Demo */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Navigation Context</CardTitle>
            <CardDescription>
              Current navigation state and history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">Current Path</div>
                <div className="font-mono text-sm bg-gray-100 p-2 rounded">
                  /demo/navigation
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500 mb-1">Breadcrumbs</div>
                <Breadcrumbs />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Role Selector */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Select a Role</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {roleCards.map((roleCard: any) => (
              <Card 
                key={roleCard.role}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedRole === roleCard.role ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedRole(roleCard.role)}
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${roleCard.color} text-white flex items-center justify-center mb-3`}>
                    {roleCard.icon}
                  </div>
                  <CardTitle className="text-lg">{roleCard.title}</CardTitle>
                  <CardDescription>{roleCard.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-1">
                    {roleCard.features.map((featureidx: any) => (
                      <li key={idx} className="flex items-center">
                        <ChevronRight className="h-3 w-3 mr-1 text-gray-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <div className="p-4 pt-0">
                  <Button
                    className="w-full"
                    variant={selectedRole === roleCard.role ? 'default' : 'outline'}
                    onClick={(e: any) => {
                      e.stopPropagation();
                      loginAs(roleCard.role);
                    }
                  >
                    Login as {roleCard.title}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}