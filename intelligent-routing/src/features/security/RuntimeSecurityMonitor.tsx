'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  LockClosedIcon,
  KeyIcon,
  FingerprintIcon,
  DocumentCheckIcon,
  UserIcon,
  ClockIcon,
  GlobeAltIcon,
  CpuChipIcon,
  ServerIcon,
  BugAntIcon,
  FireIcon,
  ChartBarIcon,
  BellIcon,
  XCircleIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  EyeIcon,
  EyeSlashIcon,
  CogIcon,
  AdjustmentsHorizontalIcon,
  InformationCircleIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { useSecurityMonitor } from '@/hooks/useSecurityMonitor';
import { format, differenceInMinutes } from 'date-fns';
import { toast } from 'sonner';

interface SecurityEvent {
  id: string;
  timestamp: Date;
  type: 'AUTH' | 'ACCESS' | 'DATA' | 'NETWORK' | 'SYSTEM' | 'COMPLIANCE';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  description: string;
  source: string;
  userId?: string;
  userEmail?: string;
  ipAddress?: string;
  location?: string;
  deviceId?: string;
  action?: string;
  result: 'SUCCESS' | 'FAILURE' | 'BLOCKED' | 'WARNING';
  details?: any;
  metadata?: {
    riskScore?: number;
    threatCategory?: string;
    remediationSuggestion?: string;
    affectedResources?: string[];
    correlatedEvents?: string[];
  };
}

interface ThreatIntelligence {
  id: string;
  source: string;
  type: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  indicators: string[];
  mitigations: string[];
  lastUpdated: Date;
  active: boolean;
}

interface SecurityPolicy {
  id: string;
  name: string;
  type: string;
  status: 'ACTIVE' | 'INACTIVE' | 'TESTING';
  rules: PolicyRule[];
  appliedTo: string[];
  effectiveness: number;
  violations: number;
  lastModified: Date;
}

interface PolicyRule {
  id: string;
  condition: string;
  action: string;
  priority: number;
  enabled: boolean;
}

interface SecurityMetrics {
  overallScore: number;
  authenticationScore: number;
  accessControlScore: number;
  dataProtectionScore: number;
  networkSecurityScore: number;
  complianceScore: number;
  trends: {
    daily: MetricTrend[];
    weekly: MetricTrend[];
    monthly: MetricTrend[];
  };
  alerts: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  threats: {
    blocked: number;
    active: number;
    investigating: number;
    resolved: number;
  };
}

interface MetricTrend {
  date: string;
  score: number;
  events: number;
  threats: number;
}

interface RuntimeSecurityMonitorProps {
  userId?: string;
  organizationId?: string;
  realTime?: boolean;
}

export default function RuntimeSecurityMonitor({ 
  userId, 
  organizationId,
  realTime = true 
}: RuntimeSecurityMonitorProps) {
  const {
    events,
    threats,
    policies,
    metrics,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    updatePolicy,
    acknowledgeEvent,
    blockThreat,
    exportReport
  } = useSecurityMonitor({ userId, organizationId });

  const [selectedTab, setSelectedTab] = useState<string>('overview');
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('24h');
  const [showOnlyActive, setShowOnlyActive] = useState(true);
  const [alertThreshold, setAlertThreshold] = useState<number>(75);
  const [autoResponse, setAutoResponse] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<SecurityEvent | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  // Real-time monitoring effect
  useEffect(() => {
    if (realTime && !isMonitoring) {
      startMonitoring();
    }
    return () => {
      if (isMonitoring) {
        stopMonitoring();
      }
    };
  }, [realTime]);

  const handlePolicyUpdate = async (policyId: string, updates: Partial<SecurityPolicy>) => {
    try {
      await updatePolicy(policyId, updates);
      toast.success('Security policy updated');
    } catch (error) {
      toast.error('Failed to update policy');
    }
  };

  const handleThreatAction = async (threatId: string, action: 'block' | 'investigate' | 'ignore') => {
    try {
      if (action === 'block') {
        await blockThreat(threatId);
        toast.success('Threat blocked successfully');
      } else {
        toast.info(`Threat marked for ${action}`);
      }
    } catch (error) {
      toast.error('Failed to handle threat');
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'AUTH':
        return FingerprintIcon;
      case 'ACCESS':
        return LockClosedIcon;
      case 'DATA':
        return DocumentCheckIcon;
      case 'NETWORK':
        return GlobeAltIcon;
      case 'SYSTEM':
        return ServerIcon;
      case 'COMPLIANCE':
        return ShieldCheckIcon;
      default:
        return ExclamationTriangleIcon;
    }
  };

  const severityColors = {
    LOW: 'blue',
    MEDIUM: 'yellow',
    HIGH: 'orange',
    CRITICAL: 'red'
  };

  const chartColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Runtime Security Monitor</h1>
              <p className="text-gray-600 mt-1">Real-time threat detection and response</p>
            </div>
            <div className="flex items-center gap-4">
              <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">Last Hour</SelectItem>
                  <SelectItem value="24h">Last 24 Hours</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex items-center gap-2">
                <Label htmlFor="monitoring-toggle">Monitoring</Label>
                <Switch
                  id="monitoring-toggle"
                  checked={isMonitoring}
                  onCheckedChange={(checked) => {
                    if (checked) startMonitoring();
                    else stopMonitoring();
                  }}
                />
              </div>

              <Button
                variant="outline"
                onClick={() => exportReport()}
              >
                <DocumentTextIcon className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Security Score Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Overall Score</p>
                  <p className="text-2xl font-bold">{metrics.overallScore}%</p>
                </div>
                <div className={`p-2 rounded-full ${
                  metrics.overallScore >= 90 ? 'bg-green-100' :
                  metrics.overallScore >= 70 ? 'bg-yellow-100' :
                  'bg-red-100'
                }`}>
                  <ShieldCheckIcon className={`h-6 w-6 ${
                    metrics.overallScore >= 90 ? 'text-green-600' :
                    metrics.overallScore >= 70 ? 'text-yellow-600' :
                    'text-red-600'
                  }`} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Threats</p>
                  <p className="text-2xl font-bold">{metrics.threats.active}</p>
                </div>
                <div className="p-2 rounded-full bg-red-100">
                  <FireIcon className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Blocked</p>
                  <p className="text-2xl font-bold">{metrics.threats.blocked}</p>
                </div>
                <div className="p-2 rounded-full bg-green-100">
                  <XCircleIcon className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Critical Alerts</p>
                  <p className="text-2xl font-bold">{metrics.alerts.critical}</p>
                </div>
                <div className="p-2 rounded-full bg-orange-100">
                  <BellIcon className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Authentication</p>
                  <p className="text-2xl font-bold">{metrics.authenticationScore}%</p>
                </div>
                <div className="p-2 rounded-full bg-blue-100">
                  <FingerprintIcon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Compliance</p>
                  <p className="text-2xl font-bold">{metrics.complianceScore}%</p>
                </div>
                <div className="p-2 rounded-full bg-purple-100">
                  <DocumentCheckIcon className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Real-time Event Stream */}
        {isMonitoring && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Real-time Event Stream</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-gray-600">Live</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {events
                  .filter(event => filterSeverity === 'all' || event.severity === filterSeverity)
                  .slice(0, 10)
                  .map((event, index) => {
                    const Icon = getEventIcon(event.type);
                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex items-center gap-4 p-3 rounded-lg border ${
                          event.severity === 'CRITICAL' ? 'border-red-200 bg-red-50' :
                          event.severity === 'HIGH' ? 'border-orange-200 bg-orange-50' :
                          event.severity === 'MEDIUM' ? 'border-yellow-200 bg-yellow-50' :
                          'border-blue-200 bg-blue-50'
                        }`}
                      >
                        <div className={`p-2 rounded-full bg-${severityColors[event.severity]}-100`}>
                          <Icon className={`h-5 w-5 text-${severityColors[event.severity]}-600`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{event.title}</h4>
                            <Badge variant={event.severity === 'CRITICAL' ? 'destructive' : 'default'}>
                              {event.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{event.description}</p>
                          <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                            <span>{format(event.timestamp, 'HH:mm:ss')}</span>
                            {event.ipAddress && <span>{event.ipAddress}</span>}
                            {event.userEmail && <span>{event.userEmail}</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedEvent(event)}
                          >
                            <InformationCircleIcon className="h-4 w-4" />
                          </Button>
                          {event.severity === 'CRITICAL' && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleThreatAction(event.id, 'block')}
                            >
                              Block
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="threats">Threats</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="policies">Policies</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Security Radar */}
            <Card>
              <CardHeader>
                <CardTitle>Security Posture</CardTitle>
                <CardDescription>Multi-dimensional security assessment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={[
                      { metric: 'Authentication', score: metrics.authenticationScore },
                      { metric: 'Access Control', score: metrics.accessControlScore },
                      { metric: 'Data Protection', score: metrics.dataProtectionScore },
                      { metric: 'Network Security', score: metrics.networkSecurityScore },
                      { metric: 'Compliance', score: metrics.complianceScore },
                      { metric: 'Overall', score: metrics.overallScore }
                    ]}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar 
                        name="Current Score" 
                        dataKey="score" 
                        stroke="#3B82F6" 
                        fill="#3B82F6" 
                        fillOpacity={0.6} 
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Threat Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Threat Trends</CardTitle>
                <CardDescription>Historical threat activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={metrics.trends.daily}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="threats" 
                        stackId="1" 
                        stroke="#EF4444" 
                        fill="#FEE2E2" 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="events" 
                        stackId="1" 
                        stroke="#3B82F6" 
                        fill="#DBEAFE" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="threats" className="space-y-6">
            {/* Active Threats */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Active Threats</CardTitle>
                  <Badge variant="destructive">{threats.filter(t => t.active).length} Active</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {threats
                    .filter(threat => showOnlyActive ? threat.active : true)
                    .map(threat => (
                      <Card key={threat.id} className={`${
                        threat.severity === 'CRITICAL' ? 'border-red-500' :
                        threat.severity === 'HIGH' ? 'border-orange-500' :
                        'border-yellow-500'
                      }`}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold">{threat.type}</h4>
                                <Badge variant={
                                  threat.severity === 'CRITICAL' ? 'destructive' :
                                  threat.severity === 'HIGH' ? 'warning' :
                                  'default'
                                }>
                                  {threat.severity}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-3">{threat.description}</p>
                              
                              <div className="space-y-2">
                                <div>
                                  <p className="text-sm font-medium">Indicators:</p>
                                  <ul className="text-sm text-gray-600 list-disc list-inside">
                                    {threat.indicators.map((indicator, idx) => (
                                      <li key={idx}>{indicator}</li>
                                    ))}
                                  </ul>
                                </div>
                                
                                <div>
                                  <p className="text-sm font-medium">Recommended Mitigations:</p>
                                  <ul className="text-sm text-gray-600 list-disc list-inside">
                                    {threat.mitigations.map((mitigation, idx) => (
                                      <li key={idx}>{mitigation}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col gap-2 ml-4">
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleThreatAction(threat.id, 'block')}
                              >
                                Block Threat
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleThreatAction(threat.id, 'investigate')}
                              >
                                Investigate
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleThreatAction(threat.id, 'ignore')}
                              >
                                Ignore
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            {/* Event Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Security Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-6">
                  <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Severities</SelectItem>
                      <SelectItem value="CRITICAL">Critical</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="LOW">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Input
                    placeholder="Search events..."
                    className="flex-1"
                  />
                  
                  <Button variant="outline">
                    <AdjustmentsHorizontalIcon className="h-4 w-4 mr-2" />
                    Advanced Filters
                  </Button>
                </div>

                <div className="space-y-3">
                  {events
                    .filter(event => filterSeverity === 'all' || event.severity === filterSeverity)
                    .map(event => (
                      <Card key={event.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-full bg-${severityColors[event.severity]}-100`}>
                                {React.createElement(getEventIcon(event.type), {
                                  className: `h-5 w-5 text-${severityColors[event.severity]}-600`
                                })}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium">{event.title}</h4>
                                  <Badge>{event.type}</Badge>
                                  <Badge variant={
                                    event.severity === 'CRITICAL' ? 'destructive' :
                                    event.severity === 'HIGH' ? 'warning' :
                                    'default'
                                  }>
                                    {event.severity}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                  <span>{format(event.timestamp, 'MMM dd, HH:mm:ss')}</span>
                                  {event.source && <span>Source: {event.source}</span>}
                                  {event.ipAddress && <span>IP: {event.ipAddress}</span>}
                                  {event.userEmail && <span>User: {event.userEmail}</span>}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setSelectedEvent(event)}
                              >
                                Details
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => acknowledgeEvent(event.id)}
                              >
                                Acknowledge
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="policies" className="space-y-6">
            {/* Security Policies */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Security Policies</CardTitle>
                  <Button>
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Create Policy
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {policies.map(policy => (
                    <Card key={policy.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold">{policy.name}</h4>
                              <Badge variant={
                                policy.status === 'ACTIVE' ? 'success' :
                                policy.status === 'TESTING' ? 'warning' :
                                'secondary'
                              }>
                                {policy.status}
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-3">
                              {policy.rules.length} rules • Applied to {policy.appliedTo.length} resources
                            </p>
                            
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="text-gray-600">Effectiveness</p>
                                <div className="flex items-center gap-2">
                                  <Progress value={policy.effectiveness} className="w-20 h-2" />
                                  <span className="font-medium">{policy.effectiveness}%</span>
                                </div>
                              </div>
                              <div>
                                <p className="text-gray-600">Violations</p>
                                <p className="font-medium">{policy.violations}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Last Modified</p>
                                <p className="font-medium">{format(policy.lastModified, 'MMM dd, yyyy')}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 ml-4">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {/* View policy details */}}
                            >
                              <EyeIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {/* Edit policy */}}
                            >
                              <PencilSquareIcon className="h-4 w-4" />
                            </Button>
                            <Switch
                              checked={policy.status === 'ACTIVE'}
                              onCheckedChange={(checked) => 
                                handlePolicyUpdate(policy.id, { 
                                  status: checked ? 'ACTIVE' : 'INACTIVE' 
                                })
                              }
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Security Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Event Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Authentication', value: metrics.alerts.total * 0.3 },
                            { name: 'Access Control', value: metrics.alerts.total * 0.25 },
                            { name: 'Data Access', value: metrics.alerts.total * 0.2 },
                            { name: 'Network', value: metrics.alerts.total * 0.15 },
                            { name: 'System', value: metrics.alerts.total * 0.1 }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {[0, 1, 2, 3, 4].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Severity Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={metrics.trends.weekly}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="score" stroke="#3B82F6" name="Security Score" />
                        <Line type="monotone" dataKey="threats" stroke="#EF4444" name="Threats" />
                        <Line type="monotone" dataKey="events" stroke="#10B981" name="Events" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Risk Matrix */}
            <Card>
              <CardHeader>
                <CardTitle>Risk Assessment Matrix</CardTitle>
                <CardDescription>Threat probability vs. impact analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-2">
                  {['Low', 'Medium', 'High', 'Critical'].map((impact, i) => (
                    ['Unlikely', 'Possible', 'Likely', 'Certain'].map((probability, j) => {
                      const riskLevel = (i + 1) * (j + 1);
                      const color = riskLevel <= 4 ? 'green' : 
                                   riskLevel <= 9 ? 'yellow' : 
                                   riskLevel <= 12 ? 'orange' : 'red';
                      
                      return (
                        <div
                          key={`${i}-${j}`}
                          className={`p-4 border rounded-lg bg-${color}-50 border-${color}-200`}
                        >
                          <p className="text-xs font-medium">{probability}</p>
                          <p className="text-xs text-gray-600">{impact}</p>
                          <p className={`text-lg font-bold text-${color}-600`}>
                            {riskLevel}
                          </p>
                        </div>
                      );
                    })
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Configure monitoring and response parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Alert Threshold */}
                <div>
                  <Label>Alert Threshold</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Slider
                      value={[alertThreshold]}
                      onValueChange={(value) => setAlertThreshold(value[0])}
                      max={100}
                      min={0}
                      step={5}
                      className="flex-1"
                    />
                    <span className="text-sm font-medium w-12">{alertThreshold}%</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Alerts will be triggered when security score drops below this threshold
                  </p>
                </div>

                {/* Auto Response */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Automatic Response</Label>
                    <p className="text-sm text-gray-600">
                      Automatically block critical threats and suspicious activities
                    </p>
                  </div>
                  <Switch
                    checked={autoResponse}
                    onCheckedChange={setAutoResponse}
                  />
                </div>

                {/* Session Security */}
                <div>
                  <Label>Session Security</Label>
                  <Select defaultValue="medium">
                    <SelectTrigger className="w-full mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - 24 hour timeout</SelectItem>
                      <SelectItem value="medium">Medium - 4 hour timeout</SelectItem>
                      <SelectItem value="high">High - 1 hour timeout</SelectItem>
                      <SelectItem value="maximum">Maximum - 15 minute timeout</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Multi-factor Authentication */}
                <div>
                  <Label>Multi-factor Authentication</Label>
                  <div className="space-y-3 mt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Email OTP</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">SMS OTP</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Authenticator App</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Biometric</span>
                      <Switch />
                    </div>
                  </div>
                </div>

                {/* API Security */}
                <div>
                  <Label>API Security</Label>
                  <div className="space-y-3 mt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Rate Limiting</span>
                      <Input
                        type="number"
                        defaultValue="1000"
                        className="w-24"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">API Key Rotation</span>
                      <Select defaultValue="90">
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 days</SelectItem>
                          <SelectItem value="60">60 days</SelectItem>
                          <SelectItem value="90">90 days</SelectItem>
                          <SelectItem value="never">Never</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline">Reset to Defaults</Button>
                  <Button>Save Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedEvent(null)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Event Details</h2>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedEvent(null)}
                >
                  <XCircleIcon className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Event ID</Label>
                  <p className="text-sm text-gray-600">{selectedEvent.id}</p>
                </div>

                <div>
                  <Label>Timestamp</Label>
                  <p className="text-sm text-gray-600">
                    {format(selectedEvent.timestamp, 'MMM dd, yyyy HH:mm:ss')}
                  </p>
                </div>

                <div>
                  <Label>Type</Label>
                  <Badge>{selectedEvent.type}</Badge>
                </div>

                <div>
                  <Label>Severity</Label>
                  <Badge variant={
                    selectedEvent.severity === 'CRITICAL' ? 'destructive' :
                    selectedEvent.severity === 'HIGH' ? 'warning' :
                    'default'
                  }>
                    {selectedEvent.severity}
                  </Badge>
                </div>

                <div>
                  <Label>Description</Label>
                  <p className="text-sm text-gray-600">{selectedEvent.description}</p>
                </div>

                {selectedEvent.metadata && (
                  <div>
                    <Label>Additional Information</Label>
                    <pre className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg overflow-auto">
                      {JSON.stringify(selectedEvent.metadata, null, 2)}
                    </pre>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => setSelectedEvent(null)}>
                    Close
                  </Button>
                  <Button onClick={() => acknowledgeEvent(selectedEvent.id)}>
                    Acknowledge
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}