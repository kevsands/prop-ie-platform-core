'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { BuyerJourneyManager } from '@/features/buyer-journey/BuyerJourneyManager';
import { DeveloperProjectWorkflow } from '@/features/developer-journey/DeveloperProjectWorkflow';
import { SolicitorTransactionFlow } from '@/features/solicitor-journey/SolicitorTransactionFlow';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  HomeIcon, 
  BuildingOfficeIcon, 
  ScaleIcon,
  UserIcon,
  ChartBarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

interface UserJourneyProps {
  role?: string;
  journeyId?: string;
}

export function UserJourneyOrchestrator({ role: propRole, journeyId }: UserJourneyProps) {
  const { user, hasRole } = useAuth();
  const router = useRouter();
  const [activeRole, setActiveRole] = useState<string>(propRole || user?.role || 'BUYER');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Determine the user's primary role or allow role switching for multi-role users
    if (user) {
      if (propRole && hasRole(propRole)) {
        setActiveRole(propRole);
      } else {
        setActiveRole(user.role);
      }
      setLoading(false);
    }
  }, [user, propRole, hasRole]);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'BUYER':
        return <HomeIcon className="h-6 w-6" />;
      case 'DEVELOPER':
        return <BuildingOfficeIcon className="h-6 w-6" />;
      case 'SOLICITOR':
        return <ScaleIcon className="h-6 w-6" />;
      case 'INVESTOR':
        return <ChartBarIcon className="h-6 w-6" />;
      case 'AGENT':
        return <UserIcon className="h-6 w-6" />;
      default:
        return <DocumentTextIcon className="h-6 w-6" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'BUYER':
        return 'bg-blue-100 text-blue-700';
      case 'DEVELOPER':
        return 'bg-green-100 text-green-700';
      case 'SOLICITOR':
        return 'bg-purple-100 text-purple-700';
      case 'INVESTOR':
        return 'bg-yellow-100 text-yellow-700';
      case 'AGENT':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const renderJourneyComponent = () => {
    switch (activeRole) {
      case 'BUYER':
        return <BuyerJourneyManager />;
      case 'DEVELOPER':
        return <DeveloperProjectWorkflow projectId={journeyId || 'default'} />;
      case 'SOLICITOR':
        return <SolicitorTransactionFlow transactionId={journeyId || 'default'} />;
      case 'INVESTOR':
        return <InvestorPortfolioDashboard />;
      case 'AGENT':
        return <AgentSalesPipeline />;
      default:
        return <DefaultJourneyView />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Role Switcher for Multi-Role Users */}
      {user?.roles && user.roles.length > 1 && (
        <div className="bg-white border-b p-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Active Role:</span>
              <div className="flex gap-2">
                {user.roles.map((role: string) => (
                  <Button
                    key={role}
                    variant={activeRole === role ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveRole(role)}
                    className={activeRole === role ? getRoleColor(role) : ''}
                  >
                    {getRoleIcon(role)}
                    <span className="ml-2">{role}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Journey Content */}
      <div className="py-8">
        {renderJourneyComponent()}
      </div>
    </div>
  );
}

// Placeholder components for other roles
function InvestorPortfolioDashboard() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Investor Portfolio Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <ChartBarIcon className="h-8 w-8 text-primary mb-4" />
          <h3 className="font-semibold mb-2">Portfolio Value</h3>
          <p className="text-2xl font-bold">€2.5M</p>
          <p className="text-sm text-gray-600">+12% this quarter</p>
        </Card>
        <Card className="p-6">
          <HomeIcon className="h-8 w-8 text-primary mb-4" />
          <h3 className="font-semibold mb-2">Properties</h3>
          <p className="text-2xl font-bold">8</p>
          <p className="text-sm text-gray-600">3 residential, 5 commercial</p>
        </Card>
        <Card className="p-6">
          <DocumentTextIcon className="h-8 w-8 text-primary mb-4" />
          <h3 className="font-semibold mb-2">Active Investments</h3>
          <p className="text-2xl font-bold">3</p>
          <p className="text-sm text-gray-600">€650k committed</p>
        </Card>
      </div>
    </div>
  );
}

function AgentSalesPipeline() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Agent Sales Pipeline</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <UserIcon className="h-8 w-8 text-primary mb-4" />
          <h3 className="font-semibold mb-2">Active Clients</h3>
          <p className="text-2xl font-bold">24</p>
          <p className="text-sm text-gray-600">12 buyers, 12 sellers</p>
        </Card>
        <Card className="p-6">
          <HomeIcon className="h-8 w-8 text-primary mb-4" />
          <h3 className="font-semibold mb-2">Listings</h3>
          <p className="text-2xl font-bold">15</p>
          <p className="text-sm text-gray-600">€6.2M total value</p>
        </Card>
        <Card className="p-6">
          <ChartBarIcon className="h-8 w-8 text-primary mb-4" />
          <h3 className="font-semibold mb-2">This Month</h3>
          <p className="text-2xl font-bold">3</p>
          <p className="text-sm text-gray-600">Sales closed</p>
        </Card>
        <Card className="p-6">
          <DocumentTextIcon className="h-8 w-8 text-primary mb-4" />
          <h3 className="font-semibold mb-2">Commission</h3>
          <p className="text-2xl font-bold">€45k</p>
          <p className="text-sm text-gray-600">YTD earnings</p>
        </Card>
      </div>
    </div>
  );
}

function DefaultJourneyView() {
  const router = useRouter();
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Welcome to PropIE</h1>
      <p className="text-lg text-gray-600 mb-8">
        Choose your role to get started with your property journey
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card 
          className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => router.push('/buyer')}
        >
          <HomeIcon className="h-12 w-12 text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Home Buyer</h3>
          <p className="text-gray-600">
            Find your dream home with guided support through every step
          </p>
        </Card>
        
        <Card 
          className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => router.push('/developer')}
        >
          <BuildingOfficeIcon className="h-12 w-12 text-green-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Developer</h3>
          <p className="text-gray-600">
            Manage your development projects from planning to delivery
          </p>
        </Card>
        
        <Card 
          className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => router.push('/solicitor')}
        >
          <ScaleIcon className="h-12 w-12 text-purple-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Solicitor</h3>
          <p className="text-gray-600">
            Streamline legal processes and document management
          </p>
        </Card>
        
        <Card 
          className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => router.push('/investor')}
        >
          <ChartBarIcon className="h-12 w-12 text-yellow-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Investor</h3>
          <p className="text-gray-600">
            Track and manage your property investment portfolio
          </p>
        </Card>
      </div>
    </div>
  );
}