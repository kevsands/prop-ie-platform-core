'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Building, DollarSign } from 'lucide-react';

export default function TeamPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Fitzgerald Gardens Team Management</h1>
          <p className="text-gray-500">
            €32.5M Development • €18M Contract Value • 52% Complete
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Project Progress</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">52%</div>
            <div className="text-xs text-muted-foreground mt-1">
              Phase 8 (M&E) in progress
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Cost/Month</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€125K</div>
            <div className="text-xs text-muted-foreground mt-1">
              73% avg allocation
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contract Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€18.0M</div>
            <div className="text-xs text-muted-foreground mt-1">
              3 active contractors
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>Current team allocation and roles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="font-medium">Sarah O'Brien</div>
                <div className="text-sm text-gray-600">Project Director</div>
                <div className="text-xs text-gray-500">Development</div>
              </div>
              <div className="text-right">
                <div className="font-medium">€950/day</div>
                <Badge>70% allocation</Badge>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="font-medium">Michael Chen</div>
                <div className="text-sm text-gray-600">Lead Architect</div>
                <div className="text-xs text-gray-500">Design</div>
              </div>
              <div className="text-right">
                <div className="font-medium">€640/day</div>
                <Badge>60% allocation</Badge>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="font-medium">Emma Thompson</div>
                <div className="text-sm text-gray-600">Site Manager</div>
                <div className="text-xs text-gray-500">Construction</div>
              </div>
              <div className="text-right">
                <div className="font-medium">€485/day</div>
                <Badge>95% allocation</Badge>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="font-medium">James Murphy</div>
                <div className="text-sm text-gray-600">Commercial Manager</div>
                <div className="text-xs text-gray-500">Commercial</div>
              </div>
              <div className="text-right">
                <div className="font-medium">€690/day</div>
                <Badge>70% allocation</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Active Contractors</CardTitle>
          <CardDescription>Current contractor performance and payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="font-medium">Murphy Construction Ltd</div>
                <div className="text-sm text-gray-600">Main Contractor</div>
                <div className="text-xs text-gray-500">€14.5M Contract</div>
              </div>
              <div className="text-right">
                <div className="font-medium text-blue-600">42% Complete</div>
                <Badge className="bg-green-100 text-green-800">On Track</Badge>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="font-medium">Celtic Electrical Services</div>
                <div className="text-sm text-gray-600">Electrical</div>
                <div className="text-xs text-gray-500">€1.85M Contract</div>
              </div>
              <div className="text-right">
                <div className="font-medium text-blue-600">15% Complete</div>
                <Badge className="bg-blue-100 text-blue-800">Starting</Badge>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="font-medium">Premier Mechanical Services</div>
                <div className="text-sm text-gray-600">Mechanical</div>
                <div className="text-xs text-gray-500">€1.65M Contract</div>
              </div>
              <div className="text-right">
                <div className="font-medium text-blue-600">22% Complete</div>
                <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}