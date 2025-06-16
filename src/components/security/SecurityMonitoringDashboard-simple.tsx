'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { ShieldCheck, AlertTriangle, Clock } from 'lucide-react';

const SecurityMonitoringDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Security Monitoring Dashboard</h1>
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="mr-1 h-4 w-4" />
          Last updated: Just now
        </div>
      </div>

      {/* Security Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Security Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ShieldCheck className="h-8 w-8 text-green-500 mr-2" />
              <div>
                <div className="text-2xl font-bold text-green-600">Good</div>
                <div className="text-xs text-gray-500">All systems secure</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <div className="text-xs text-gray-500">Current users</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Failed Logins (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <div className="text-xs text-gray-500">Below threshold</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-yellow-500 mr-2" />
              <div>
                <div className="text-2xl font-bold text-yellow-600">2</div>
                <div className="text-xs text-gray-500">Warnings</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Events */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Security Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">User Login</div>
                <div className="text-sm text-gray-500">Successful authentication</div>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700">Success</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Failed Login Attempt</div>
                <div className="text-sm text-gray-500">Invalid credentials</div>
              </div>
              <Badge variant="outline" className="bg-red-50 text-red-700">Failure</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Rate Limit Warning</div>
                <div className="text-sm text-gray-500">API rate limit exceeded</div>
              </div>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Warning</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityMonitoringDashboard;