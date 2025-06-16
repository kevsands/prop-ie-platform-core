'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Building, 
  Database, 
  Settings, 
  CheckCircle, 
  AlertTriangle,
  Sync,
  Key,
  Globe,
  Shield,
  Clock,
  FileText,
  Users,
  DollarSign,
  Activity
} from 'lucide-react';

interface ProjectManagementSystem {
  id: string;
  name: string;
  type: 'procore' | 'buildertrend' | 'sage' | 'quickbooks' | 'planswift' | 'bluebeam' | 'custom';
  description: string;
  icon: string;
  features: string[];
  apiDocumentation: string;
  authType: 'api_key' | 'oauth' | 'basic_auth';
  dataTypes: string[];
}

interface IntegrationStatus {
  systemId: string;
  connected: boolean;
  lastSync?: Date;
  syncStatus: 'success' | 'error' | 'syncing' | 'pending';
  recordsCount?: number;
  errors?: string[];
}

export function ProjectManagementIntegration() {
  const [selectedSystemsetSelectedSystem] = useState<ProjectManagementSystem | null>(null);
  const [showConnectionModalsetShowConnectionModal] = useState(false);

  // Available project management systems
  const availableSystems: ProjectManagementSystem[] = [
    {
      id: 'procore',
      name: 'Procore',
      type: 'procore',
      description: 'Leading construction management platform with comprehensive project tracking',
      icon: 'building',
      features: [
        'Project Documents',
        'Cost Management',
        'Schedule Tracking',
        'Quality & Safety',
        'Resource Management'
      ],
      apiDocumentation: 'https://developers.procore.com/',
      authType: 'oauth',
      dataTypes: ['projects', 'budgets', 'schedules', 'documents', 'change_orders']
    },
    {
      id: 'buildertrend',
      name: 'Buildertrend',
      type: 'buildertrend',
      description: 'Cloud-based project management software for construction professionals',
      icon: 'building',
      features: [
        'Project Scheduling',
        'Customer Management',
        'Financial Tracking',
        'Document Storage',
        'Communication Tools'
      ],
      apiDocumentation: 'https://api.buildertrend.com/',
      authType: 'api_key',
      dataTypes: ['projects', 'customers', 'estimates', 'schedules', 'photos']
    },
    {
      id: 'sage_construction',
      name: 'Sage Construction',
      type: 'sage',
      description: 'Integrated construction accounting and project management solution',
      icon: 'dollar-sign',
      features: [
        'Job Costing',
        'Payroll Management',
        'Equipment Tracking',
        'Subcontractor Management',
        'Financial Reporting'
      ],
      apiDocumentation: 'https://developer.sage.com/',
      authType: 'oauth',
      dataTypes: ['jobs', 'costs', 'payroll', 'equipment', 'vendors']
    },
    {
      id: 'quickbooks_contractor',
      name: 'QuickBooks Contractor',
      type: 'quickbooks',
      description: 'Construction-specific accounting and project management features',
      icon: 'database',
      features: [
        'Job Profitability',
        'Estimating',
        'Progress Invoicing',
        'Time Tracking',
        'Contractor Reports'
      ],
      apiDocumentation: 'https://developer.intuit.com/',
      authType: 'oauth',
      dataTypes: ['items', 'customers', 'estimates', 'invoices', 'time_activities']
    },
    {
      id: 'planswift',
      name: 'PlanSwift',
      type: 'planswift',
      description: 'Digital takeoff and estimating software for construction',
      icon: 'file-text',
      features: [
        'Digital Takeoffs',
        'Cost Estimating',
        'Bid Management',
        'Plan Markup',
        'Quantity Calculations'
      ],
      apiDocumentation: 'https://www.planswift.com/api/',
      authType: 'api_key',
      dataTypes: ['takeoffs', 'estimates', 'assemblies', 'materials', 'labor']
    },
    {
      id: 'bluebeam',
      name: 'Bluebeam Revu',
      type: 'bluebeam',
      description: 'PDF-based construction document management and collaboration',
      icon: 'file-text',
      features: [
        'Document Markup',
        'Collaboration Tools',
        'Quantity Takeoff',
        'Document Control',
        'Field Data Collection'
      ],
      apiDocumentation: 'https://support.bluebeam.com/api/',
      authType: 'api_key',
      dataTypes: ['documents', 'markups', 'sessions', 'measurements', 'forms']
    }
  ];

  // Mock integration statuses
  const [integrationStatusessetIntegrationStatuses] = useState<IntegrationStatus[]>([
    {
      systemId: 'procore',
      connected: true,
      lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      syncStatus: 'success',
      recordsCount: 1247
    },
    {
      systemId: 'sage_construction',
      connected: true,
      lastSync: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      syncStatus: 'error',
      recordsCount: 856,
      errors: ['Authentication token expired', 'Rate limit exceeded']
    },
    {
      systemId: 'buildertrend',
      connected: false,
      syncStatus: 'pending'
    }
  ]);

  const getSystemIcon = (type: string) => {
    switch (type) {
      case 'procore':
      case 'buildertrend':
        return <Building className="h-5 w-5" />\n  );
      case 'sage':
      case 'quickbooks':
        return <DollarSign className="h-5 w-5" />\n  );
      case 'planswift':
      case 'bluebeam':
        return <FileText className="h-5 w-5" />\n  );
      default:
        return <Database className="h-5 w-5" />\n  );
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />\n  );
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-600" />\n  );
      case 'syncing':
        return <Sync className="h-4 w-4 text-blue-600 animate-spin" />\n  );
      default:
        return <Clock className="h-4 w-4 text-gray-400" />\n  );
    }
  };

  const getStatusBadge = (connected: boolean, status: string) => {
    if (!connected) {
      return <Badge variant="outline">Disconnected</Badge>\n  );
    }
    
    switch (status) {
      case 'success':
        return <Badge variant="default">Connected</Badge>\n  );
      case 'error':
        return <Badge variant="destructive">Error</Badge>\n  );
      case 'syncing':
        return <Badge variant="secondary">Syncing</Badge>\n  );
      default:
        return <Badge variant="outline">Pending</Badge>\n  );
    }
  };

  const handleConnect = (system: ProjectManagementSystem) => {
    setSelectedSystem(system);
    setShowConnectionModal(true);
  };

  const handleSync = (systemId: string) => {
    setIntegrationStatuses(prev => prev.map(status =>
      status.systemId === systemId
        ? { ...status, syncStatus: 'syncing' as const }
        : status
    ));

    // Simulate sync process
    setTimeout(() => {
      setIntegrationStatuses(prev => prev.map(status =>
        status.systemId === systemId
          ? {
              ...status,
              syncStatus: 'success' as const,
              lastSync: new Date(),
              recordsCount: Math.floor(Math.random() * 2000) + 500
            }
          : status
      ));
    }, 3000);
  };

  const getIntegrationStatus = (systemId: string) => {
    return integrationStatuses.find(status => status.systemId === systemId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Project Management Integrations</h1>
          <p className="text-muted-foreground">
            Connect to external project management and accounting systems
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Connected</p>
                <p className="text-xl font-bold">
                  {integrationStatuses.filter(s => s.connected).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Available</p>
                <p className="text-xl font-bold">{availableSystems.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Sync className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Records</p>
                <p className="text-xl font-bold">
                  {integrationStatuses.reduce((sumstatus) => sum + (status.recordsCount || 0), 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">Errors</p>
                <p className="text-xl font-bold">
                  {integrationStatuses.filter(s => s.syncStatus === 'error').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="available">Available Systems</TabsTrigger>
          <TabsTrigger value="data-mapping">Data Mapping</TabsTrigger>
          <TabsTrigger value="sync-logs">Sync Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Connected Systems</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {availableSystems.map((system) => {
                  const status = getIntegrationStatus(system.id);
                  return (
                    <div key={system.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="bg-muted p-3 rounded">
                          {getSystemIcon(system.type)}
                        </div>
                        <div>
                          <h3 className="font-medium">{system.name}</h3>
                          <p className="text-sm text-muted-foreground">{system.description}</p>
                          {status?.connected && (
                            <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                              <span>Last sync: {status.lastSync?.toLocaleString()}</span>
                              <span>Records: {status.recordsCount?.toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {status && getStatusBadge(status.connected, status.syncStatus)}
                        {status && getStatusIcon(status.syncStatus)}
                        
                        <div className="flex items-center gap-1">
                          {status?.connected ? (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleSync(system.id)}
                                disabled={status.syncStatus === 'syncing'}
                              >
                                <Sync className={`h-4 w-4 ${status.syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Settings className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleConnect(system)}
                            >
                              Connect
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="available" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableSystems.map((system) => (
              <Card key={system.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-muted p-2 rounded">
                        {getSystemIcon(system.type)}
                      </div>
                      <div>
                        <h3 className="font-medium">{system.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {system.authType.replace('_', ' ')} authentication
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {system.description}
                    </p>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Features</h4>
                      <div className="flex flex-wrap gap-1">
                        {system.features.slice(0).map((feature) => (
                          <Badge key={feature} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {system.features.length> 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{system.features.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Data Types</h4>
                      <div className="flex flex-wrap gap-1">
                        {system.dataTypes.map((type) => (
                          <Badge key={type} variant="outline" className="text-xs">
                            {type.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleConnect(system)}
                      >
                        Connect
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(system.apiDocumentation, '_blank')}
                      >
                        <Globe className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="data-mapping" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Field Mapping</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Configure how data from external systems maps to your platform fields.
                </div>
                
                {/* Example mapping for Procore */}
                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-3">Procore Mapping</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium">External Field</span>
                      </div>
                      <div>
                        <span className="font-medium">Platform Field</span>
                      </div>
                      <div>
                        <span className="font-medium">Transform</span>
                      </div>
                      
                      <div>project_name</div>
                      <div>development.name</div>
                      <div>Direct mapping</div>
                      
                      <div>budget_line_items</div>
                      <div>boq_items</div>
                      <div>Category mapping</div>
                      
                      <div>cost_codes</div>
                      <div>cost_categories</div>
                      <div>Code translation</div>
                      
                      <div>change_orders</div>
                      <div>boq_variations</div>
                      <div>Status conversion</div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <Button>
                    <Settings className="h-4 w-4 mr-2" />
                    Configure Mappings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sync-logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Synchronization Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
                    system: 'Procore',
                    status: 'success',
                    records: 1247,
                    message: 'Full sync completed successfully'
                  },
                  {
                    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
                    system: 'Sage Construction',
                    status: 'error',
                    records: 0,
                    message: 'Authentication failed - token expired'
                  },
                  {
                    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
                    system: 'Buildertrend',
                    status: 'success',
                    records: 892,
                    message: 'Incremental sync completed'
                  }
                ].map((logindex) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(log.status)}
                      <div>
                        <div className="font-medium">{log.system}</div>
                        <div className="text-sm text-muted-foreground">
                          {log.timestamp.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">{log.message}</div>
                      {log.records> 0 && (
                        <div className="text-xs text-muted-foreground">
                          {log.records} records processed
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Connection Modal */}
      {showConnectionModal && selectedSystem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Connect to {selectedSystem.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Shield className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-800">Integration Notice</h4>
                    <p className="text-sm text-amber-700 mt-1">
                      This will connect to your {selectedSystem.name} system using secure API integration.
                      All data synchronization will be encrypted and logged.
                    </p>
                  </div>
                </div>
              </div>

              {selectedSystem.authType === 'api_key' && (
                <div>
                  <Label htmlFor="apiKey">API Key</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="apiKey"
                      type="password"
                      className="pl-10"
                      placeholder="Enter your API key"
                    />
                  </div>
                </div>
              )}

              {selectedSystem.authType === 'oauth' && (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    You will be redirected to {selectedSystem.name} to authorize access.
                  </p>
                  <Button>
                    <Globe className="h-4 w-4 mr-2" />
                    Authorize with {selectedSystem.name}
                  </Button>
                </div>
              )}

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowConnectionModal(false)}
                >
                  Cancel
                </Button>
                <Button className="flex-1">
                  Connect
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}