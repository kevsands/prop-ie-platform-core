'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { AlertCircle, CheckCircle2, Clock, Shield, ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';
// Using AlertTriangle as a replacement for ShieldX which is not available
import { AuditLogger } from '../../lib/security/auditLogger';
import { SessionFingerprint } from '../../lib/security/sessionFingerprint';
import { RateLimiter } from '../../lib/security/rateLimit';

// Types for the dashboard
interface SecurityEvent {
  id: string;
  timestamp: Date;
  category: string;
  action: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'success' | 'failure';
  description: string;
  userId?: string;
  ipAddress?: string;
}

interface BlockedIP {
  ip: string;
  reason: string;
  blockedAt: Date;
  expiresAt: Date;
  attemptCount: number;
}

interface SecurityMetric {
  name: string;
  value: number;
  max: number;
  status: 'good' | 'warning' | 'critical';
}

const SecurityMonitoringDashboard: React.FC = () => {
  // State for security data
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [blockedIPs, setBlockedIPs] = useState<BlockedIP[]>([]);
  const [metrics, setMetrics] = useState<SecurityMetric[]>([
    { name: 'Security Score', value: 85, max: 100, status: 'good' },
    { name: 'Active Sessions', value: 12, max: 100, status: 'good' },
    { name: 'Failed Logins (24h)', value: 3, max: 10, status: 'good' },
    { name: 'API Rate Limit Warnings', value: 2, max: 5, status: 'warning' }
  ]);
  
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [sessionStatus, setSessionStatus] = useState<{valid: boolean; reason?: string}>({ valid: true });

  // Calculate overall security status based on metrics
  const securityStatus = useMemo(() => {
    if (metrics.some(m => m.status === 'critical')) return 'critical';
    if (metrics.some(m => m.status === 'warning')) return 'warning';
    return 'good';
  }, [metrics]);

  // Fetch security data
  const fetchSecurityData = async () => {
    try {
      // In a real implementation, these would be API calls
      // For now, we'll simulate with mock data
      
      // Get latest audit logs
      const latestEvents: SecurityEvent[] = [
        {
          id: '1',
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
          category: 'Authentication',
          action: 'Login',
          severity: 'low',
          status: 'success',
          description: 'User logged in successfully',
          userId: 'user123',
          ipAddress: '192.168.1.1'
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
          category: 'Authentication',
          action: 'Login',
          severity: 'medium',
          status: 'failure',
          description: 'Failed login attempt - incorrect password',
          userId: 'user456',
          ipAddress: '192.168.1.2'
        },
        {
          id: '3',
          timestamp: new Date(Date.now() - 25 * 60 * 1000),
          category: 'API',
          action: 'Rate Limit',
          severity: 'high',
          status: 'failure',
          description: 'Rate limit exceeded for /api/users',
          ipAddress: '192.168.1.3'
        }
      ];
      
      // Get blocked IPs
      const currentBlockedIPs: BlockedIP[] = [
        {
          ip: '192.168.1.3',
          reason: 'Rate limit exceeded',
          blockedAt: new Date(Date.now() - 30 * 60 * 1000),
          expiresAt: new Date(Date.now() + 60 * 60 * 1000),
          attemptCount: 12
        },
        {
          ip: '192.168.1.4',
          reason: 'Multiple failed login attempts',
          blockedAt: new Date(Date.now() - 45 * 60 * 1000),
          expiresAt: new Date(Date.now() + 30 * 60 * 1000),
          attemptCount: 5
        }
      ];
      
      // Update session status
      const currentSessionStatus = SessionFingerprint && typeof SessionFingerprint.validate === 'function' 
        ? SessionFingerprint.validate() 
        : { valid: true };
      
      // Update states
      setSecurityEvents(latestEvents);
      setBlockedIPs(currentBlockedIPs);
      setSessionStatus(currentSessionStatus);
      setLastRefreshed(new Date());
      
    } catch (error) {
      console.error('Error fetching security data:', error);
    }
  };

  // Set up interval to refresh data
  useEffect(() => {
    fetchSecurityData();
    
    const intervalId = setInterval(() => {
      fetchSecurityData();
    }, refreshInterval * 1000);
    
    return () => clearInterval(intervalId);
  }, [refreshInterval]);

  // Format timestamp relative to now
  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  // Severity badge component
  const SeverityBadge = ({ severity }: { severity: string }) => {
    switch (severity) {
      case 'low':
        return <Badge variant="outline" className="bg-green-50 text-green-700">Low</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Medium</Badge>;
      case 'high':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700">High</Badge>;
      case 'critical':
        return <Badge variant="outline" className="bg-red-50 text-red-700">Critical</Badge>;
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case 'success':
        return <Badge variant="outline" className="bg-green-50 text-green-700">Success</Badge>;
      case 'failure':
        return <Badge variant="outline" className="bg-red-50 text-red-700">Failure</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Security Monitoring Dashboard</h1>
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="mr-1 h-4 w-4" />
          Last updated: {formatTimeAgo(lastRefreshed)}
        </div>
      </div>
      
      {/* Security Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className={`border-l-4 ${
          securityStatus === 'good' ? 'border-l-green-500' : 
          securityStatus === 'warning' ? 'border-l-yellow-500' : 'border-l-red-500'
        }`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Security Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              {securityStatus === 'good' && <ShieldCheck className="h-8 w-8 text-green-500 mr-2" />}
              {securityStatus === 'warning' && <ShieldAlert className="h-8 w-8 text-yellow-500 mr-2" />}
              {securityStatus === 'critical' && <AlertTriangle className="h-8 w-8 text-red-500 mr-2" />}
              <span className="text-2xl font-bold">
                {securityStatus === 'good' ? 'Secure' : 
                 securityStatus === 'warning' ? 'Warning' : 'Critical'}
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card className={`border-l-4 ${
          sessionStatus.valid ? 'border-l-green-500' : 'border-l-red-500'
        }`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Session Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              {sessionStatus.valid 
                ? <CheckCircle2 className="h-8 w-8 text-green-500 mr-2" />
                : <AlertCircle className="h-8 w-8 text-red-500 mr-2" />
              }
              <span className="text-2xl font-bold">
                {sessionStatus.valid ? 'Valid' : 'Invalid'}
              </span>
            </div>
            {!sessionStatus.valid && (
              <p className="text-sm text-red-600 mt-1">{sessionStatus.reason}</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Recent Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-500 mr-2" />
              <span className="text-2xl font-bold">{securityEvents.length}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Blocked IPs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-500 mr-2" />
              <span className="text-2xl font-bold">{blockedIPs.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Security Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Security Metrics</CardTitle>
          <CardDescription>Key security metrics and thresholds</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.map((metric) => (
              <div key={metric.name} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{metric.name}</span>
                  <span className={`text-sm font-medium ${
                    metric.status === 'good' ? 'text-green-600' : 
                    metric.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {metric.value} / {metric.max}
                  </span>
                </div>
                <Progress 
                  value={(metric.value / metric.max) * 100} 
                  className={`h-2 ${
                    metric.status === 'good' ? 'bg-green-100' : 
                    metric.status === 'warning' ? 'bg-yellow-100' : 'bg-red-100'
                  }`}
                  indicatorClassName={
                    metric.status === 'good' ? 'bg-green-500' : 
                    metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                  }
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Tabs for detailed information */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="events">Security Events</TabsTrigger>
          <TabsTrigger value="blocks">IP Blocks</TabsTrigger>
          <TabsTrigger value="actions">Available Actions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="events" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Security Events</CardTitle>
              <CardDescription>Security events detected in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {securityEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">{formatTimeAgo(event.timestamp)}</TableCell>
                      <TableCell>{event.category}</TableCell>
                      <TableCell>{event.action}</TableCell>
                      <TableCell><SeverityBadge severity={event.severity} /></TableCell>
                      <TableCell><StatusBadge status={event.status} /></TableCell>
                      <TableCell>{event.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="blocks" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Blocked IPs</CardTitle>
              <CardDescription>IP addresses currently blocked due to suspicious activity</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Blocked At</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Attempts</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blockedIPs.map((ip) => (
                    <TableRow key={ip.ip}>
                      <TableCell className="font-medium">{ip.ip}</TableCell>
                      <TableCell>{ip.reason}</TableCell>
                      <TableCell>{formatTimeAgo(ip.blockedAt)}</TableCell>
                      <TableCell>{formatTimeAgo(ip.expiresAt)}</TableCell>
                      <TableCell>{ip.attemptCount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="actions" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Actions</CardTitle>
              <CardDescription>Actions you can take to enhance security</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center p-4 border rounded-lg">
                  <div className="mr-4">
                    <ShieldCheck className="h-10 w-10 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-medium">Refresh Session Fingerprint</h3>
                    <p className="text-sm text-gray-500">Update the current session fingerprint to maintain security.</p>
                  </div>
                  <button 
                    className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    onClick={() => {
                      if (SessionFingerprint && typeof SessionFingerprint.refresh === 'function') {
                        SessionFingerprint.refresh();
                        fetchSecurityData();
                      }
                    }}
                  >
                    Refresh
                  </button>
                </div>
                
                <div className="flex items-center p-4 border rounded-lg">
                  <div className="mr-4">
                    <ShieldAlert className="h-10 w-10 text-yellow-500" />
                  </div>
                  <div>
                    <h3 className="font-medium">Clear Rate Limits</h3>
                    <p className="text-sm text-gray-500">Reset all rate limits for testing purposes.</p>
                  </div>
                  <button 
                    className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    onClick={() => {
                      if (RateLimiter && typeof RateLimiter.reset === 'function') {
                        RateLimiter.reset();
                        fetchSecurityData();
                      }
                    }}
                  >
                    Clear
                  </button>
                </div>
                
                <div className="flex items-center p-4 border rounded-lg">
                  <div className="mr-4">
                    <AlertTriangle className="h-10 w-10 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-medium">Unblock All IPs</h3>
                    <p className="text-sm text-gray-500">Remove all IP blocks in the system.</p>
                  </div>
                  <button 
                    className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    onClick={() => {
                      // In a real implementation, this would call an API
                      setBlockedIPs([]);
                    }}
                  >
                    Unblock All
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityMonitoringDashboard;