'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { AuditSeverity } from '@/lib/security/auditLogger';
import { isFeatureEnabled } from '@/lib/features/featureFlags';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

// For demo purposes, we'll use sample data since we can't fetch real data
const SAMPLE_SECURITY_EVENTS = [
  {
    id: '1',
    timestamp: new Date('2025-05-02T10:15:00Z').getTime(),
    category: 'authentication',
    action: 'login_failed',
    severity: AuditSeverity.WARNING,
    userId: 'user123',
    resource: 'login',
    description: 'Multiple failed login attempts',
    status: 'failure',
    ipAddress: '192.168.1.1'},
  {
    id: '2',
    timestamp: new Date('2025-05-02T12:30:00Z').getTime(),
    category: 'authentication',
    action: 'login_success',
    severity: AuditSeverity.INFO,
    userId: 'user123',
    resource: 'login',
    description: 'User successfully authenticated',
    status: 'success',
    ipAddress: '192.168.1.1'},
  {
    id: '3',
    timestamp: new Date('2025-05-02T14:45:00Z').getTime(),
    category: 'data_access',
    action: 'document_access',
    severity: AuditSeverity.INFO,
    userId: 'user456',
    resource: 'document',
    resourceId: 'doc123',
    description: 'User accessed sensitive document',
    status: 'success',
    ipAddress: '192.168.1.2'},
  {
    id: '4',
    timestamp: new Date('2025-05-02T16:20:00Z').getTime(),
    category: 'admin',
    action: 'permission_change',
    severity: AuditSeverity.CRITICAL,
    userId: 'admin789',
    resource: 'user',
    resourceId: 'user123',
    description: 'Admin privilege granted',
    status: 'success',
    ipAddress: '192.168.1.3'},
  {
    id: '5',
    timestamp: new Date('2025-05-03T09:10:00Z').getTime(),
    category: 'api',
    action: 'rate_limited',
    severity: AuditSeverity.WARNING,
    userId: 'user789',
    resource: '/api/documents',
    description: 'Rate limit exceeded for endpoint',
    status: 'failure',
    ipAddress: '192.168.1.4'}];

const SAMPLE_SECURITY_STATS = {
  usersMfaEnabled: 78,
  totalUsers: 120,
  activeBlockedIPs: 3,
  totalSecurityEvents: 1342,
  criticalEvents: 5,
  warningEvents: 27,
  avgRiskScore: 18.5,
  securityScore: 87
};

const FEATURE_FLAGS = [
  { 
    id: 'enable-mfa', 
    name: 'Multi-Factor Authentication', 
    description: 'Require MFA for sensitive operations',
    enabled: true
  },
  { 
    id: 'enable-session-fingerprinting', 
    name: 'Session Fingerprinting', 
    description: 'Detect suspicious session changes',
    enabled: true
  },
  { 
    id: 'enable-audit-logging', 
    name: 'Audit Logging', 
    description: 'Log security-relevant events',
    enabled: true
  },
  { 
    id: 'api-rate-limiting', 
    name: 'API Rate Limiting', 
    description: 'Limit API requests to prevent abuse',
    enabled: true
  },
  { 
    id: 'advanced-security', 
    name: 'Advanced Security', 
    description: 'Enable all security features',
    enabled: true
  },
  { 
    id: 'enable-session-recording', 
    name: 'Session Recording', 
    description: 'Record user sessions for security analysis',
    enabled: false
  }];

/**
 * Security Dashboard Component
 * 
 * This component provides an admin interface for monitoring 
 * security status and managing security features.
 */
export async function SecurityDashboardisFeatureEnabled(flag.id)
        }))
      );

      setFeatureFlags(enhancedFlags);
      setLoading(false);
    }

    loadFeatureFlags();
  }, []);

  // Handle feature flag toggle
  const handleFeatureFlagToggle = async (id: string, enabled: boolean) => {
    // In a real implementation, we would update the server
    // For now, we'll just update the local state
    setFeatureFlags(flags => 
      flags.map(flag => 
        flag.id === id ? { ...flag, enabled } : flag
      )
    );
  };

  // Format timestamp
  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  // Get severity badge
  const getSeverityBadge = (severity: AuditSeverity) => {
    switch (severity) {
      case AuditSeverity.CRITICAL:
        return <Badge variant="destructive">Critical</Badge>\n  );
      case AuditSeverity.ERROR:
        return <Badge variant="destructive">Error</Badge>\n  );
      case AuditSeverity.WARNING:
        return <Badge variant="default" className="bg-yellow-500">Warning</Badge>\n  );
      case AuditSeverity.INFO:
        return <Badge variant="secondary">Info</Badge>\n  );
      case AuditSeverity.DEBUG:
        return <Badge variant="outline">Debug</Badge>\n  );
      default:
        return <Badge variant="outline">Unknown</Badge>\n  );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full max-w-2xl">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="events">Security Events</TabsTrigger>
          <TabsTrigger value="features">Security Features</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Security Score</CardTitle>
                <CardDescription>Overall security posture</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">
                    {SAMPLE_SECURITY_STATS.securityScore}/100
                  </div>
                  <div className="text-sm">
                    {SAMPLE_SECURITY_STATS.securityScore>= 80 ? (
                      <Badge className="bg-green-500">Good</Badge>
                    ) : SAMPLE_SECURITY_STATS.securityScore>= 60 ? (
                      <Badge className="bg-yellow-500">Fair</Badge>
                    ) : (
                      <Badge variant="destructive">Poor</Badge>
                    )}
                  </div>
                </div>

                <div className="h-3 w-full bg-gray-200 rounded-full mt-2">
                  <div 
                    className="h-full rounded-full bg-green-500" 
                    style={ width: `${SAMPLE_SECURITY_STATS.securityScore}%` }
                  ></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>MFA Adoption</CardTitle>
                <CardDescription>Users with MFA enabled</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">
                    {Math.round((SAMPLE_SECURITY_STATS.usersMfaEnabled / SAMPLE_SECURITY_STATS.totalUsers) * 100)}%
                  </div>
                  <div className="text-sm text-gray-500">
                    {SAMPLE_SECURITY_STATS.usersMfaEnabled} of {SAMPLE_SECURITY_STATS.totalUsers} users
                  </div>
                </div>

                <div className="h-3 w-full bg-gray-200 rounded-full mt-2">
                  <div 
                    className="h-full rounded-full bg-blue-500" 
                    style={ width: `${(SAMPLE_SECURITY_STATS.usersMfaEnabled / SAMPLE_SECURITY_STATS.totalUsers) * 100}%` }
                  ></div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Security Events</CardTitle>
                <CardDescription>Last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {SAMPLE_SECURITY_STATS.totalSecurityEvents}
                </div>
                <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                  <span className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-red-500 mr-1"></span>
                    {SAMPLE_SECURITY_STATS.criticalEvents} Critical
                  </span>
                  <span className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-yellow-500 mr-1"></span>
                    {SAMPLE_SECURITY_STATS.warningEvents} Warning
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Blocked IPs</CardTitle>
                <CardDescription>Currently active</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {SAMPLE_SECURITY_STATS.activeBlockedIPs}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  IP blocking active
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Average Risk</CardTitle>
                <CardDescription>Current risk level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {SAMPLE_SECURITY_STATS.avgRiskScore}/100
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {SAMPLE_SECURITY_STATS.avgRiskScore <25 ? "Low Risk" : 
                    SAMPLE_SECURITY_STATS.avgRiskScore <50 ? "Medium Risk" : 
                    SAMPLE_SECURITY_STATS.avgRiskScore <75 ? "High Risk" : "Critical Risk"
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Security Recommendations</CardTitle>
              <CardDescription>Actions to improve your security posture</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Badge variant="outline" className="mr-2 mt-0.5">1</Badge>
                  <div>
                    <span className="font-medium">Enforce MFA for all users</span>
                    <p className="text-sm text-gray-500">22% of users don't have MFA enabled</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Badge variant="outline" className="mr-2 mt-0.5">2</Badge>
                  <div>
                    <span className="font-medium">Enable advanced security features</span>
                    <p className="text-sm text-gray-500">Session recording is currently disabled</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Badge variant="outline" className="mr-2 mt-0.5">3</Badge>
                  <div>
                    <span className="font-medium">Review high-risk login patterns</span>
                    <p className="text-sm text-gray-500">5 users have unusual login patterns</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Events Tab */}
        <TabsContent value="events" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Security Events</CardTitle>
              <CardDescription>Last 7 days of security events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {SAMPLE_SECURITY_EVENTS.map(event => (
                  <div 
                    key={event.id}
                    className="border-b pb-3 mb-3 last:border-0 last:pb-0 last:mb-0"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          {getSeverityBadge(event.severity)}
                          <span className="font-medium">{event.action}</span>
                        </div>
                        <p className="text-sm text-gray-700 mt-1">{event.description}</p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatTimestamp(event.timestamp)}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-2 text-sm text-gray-500">
                      <div>
                        <span className="block text-xs">User</span>
                        {event.userId}
                      </div>
                      <div>
                        <span className="block text-xs">IP Address</span>
                        {event.ipAddress}
                      </div>
                      <div>
                        <span className="block text-xs">Resource</span>
                        {event.resource}{event.resourceId ? `/${event.resourceId}` : ''}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Events
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Features Tab */}
        <TabsContent value="features" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Features</CardTitle>
              <CardDescription>Enable or disable security features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {featureFlags.map(feature => (
                  <div key={feature.id} className="flex items-center justify-between py-2">
                    <div className="space-y-0.5">
                      <Label className="text-base">{feature.name}</Label>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                    <Switch
                      checked={feature.enabled}
                      onCheckedChange={(checked: any) => handleFeatureFlagToggle(feature.idchecked)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}