'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Database, 
  Settings, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Sync,
  Shield,
  FileSpreadsheet,
  Building,
  DollarSign,
  Calculator,
  Link,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { DataSource, DataSourceTemplate, DATA_SOURCE_TEMPLATES, DataSourceStatus } from '@/types/data-sources';
import { DataSourceSetupModal } from './DataSourceSetupModal';
import { DataSourceConnectionTest } from './DataSourceConnectionTest';

interface DataSourceManagerProps {
  projectId?: string;
}

export function DataSourceManager({ projectId }: DataSourceManagerProps) {
  const [activeTabsetActiveTab] = useState('overview');
  const [showSetupModalsetShowSetupModal] = useState(false);
  const [selectedTemplatesetSelectedTemplate] = useState<DataSourceTemplate | null>(null);
  const [selectedDataSourcesetSelectedDataSource] = useState<DataSource | null>(null);

  // Mock data sources for demonstration
  const [dataSourcessetDataSources] = useState<DataSource[]>([
    {
      id: '1',
      name: 'Procore Main Project',
      type: 'project_management',
      status: 'connected',
      config: {
        fieldMappings: [],
        syncFrequency: 'daily',
        autoSync: true,
        encryption: true,
        requiresApproval: true,
        validationRules: []
      },
      lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      updatedAt: new Date()
    },
    {
      id: '2',
      name: 'Sage Accounting System',
      type: 'financial_system',
      status: 'requires_auth',
      config: {
        fieldMappings: [],
        syncFrequency: 'daily',
        autoSync: false,
        encryption: true,
        requiresApproval: true,
        validationRules: []
      },
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      updatedAt: new Date()
    },
    {
      id: '3',
      name: 'BOQ Excel Template',
      type: 'excel_file',
      status: 'error',
      config: {
        fieldMappings: [],
        syncFrequency: 'manual',
        autoSync: false,
        encryption: false,
        requiresApproval: true,
        validationRules: []
      },
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      updatedAt: new Date()
    }
  ]);

  const getStatusIcon = (status: DataSourceStatus) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-600" />\n  );
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />\n  );
      case 'requires_auth':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />\n  );
      case 'syncing':
        return <Sync className="h-4 w-4 text-blue-600 animate-spin" />\n  );
      default:
        return <Database className="h-4 w-4 text-gray-400" />\n  );
    }
  };

  const getStatusBadge = (status: DataSourceStatus) => {
    const variants = {
      connected: 'default',
      error: 'destructive',
      requires_auth: 'secondary',
      syncing: 'outline',
      disconnected: 'outline',
      connecting: 'outline'
    } as const;

    return (
      <Badge variant={variants[status] || 'outline'}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'project_management':
        return <Building className="h-4 w-4" />\n  );
      case 'financial_system':
        return <DollarSign className="h-4 w-4" />\n  );
      case 'boq_software':
        return <Calculator className="h-4 w-4" />\n  );
      case 'excel_file':
        return <FileSpreadsheet className="h-4 w-4" />\n  );
      case 'api_endpoint':
        return <Link className="h-4 w-4" />\n  );
      default:
        return <Database className="h-4 w-4" />\n  );
    }
  };

  const handleAddDataSource = (template: DataSourceTemplate) => {
    setSelectedTemplate(template);
    setShowSetupModal(true);
  };

  const handleSync = async (dataSourceId: string) => {
    // Update status to syncing
    setDataSources(prev => prev.map(ds => 
      ds.id === dataSourceId 
        ? { ...ds, status: 'syncing' as DataSourceStatus }
        : ds
    ));

    // Simulate sync process
    setTimeout(() => {
      setDataSources(prev => prev.map(ds => 
        ds.id === dataSourceId 
          ? { 
              ...ds, 
              status: 'connected' as DataSourceStatus,
              lastSync: new Date(),
              updatedAt: new Date()
            }
          : ds
      ));
    }, 3000);
  };

  const connectedSources = dataSources.filter(ds => ds.status === 'connected').length;
  const errorSources = dataSources.filter(ds => ds.status === 'error' || ds.status === 'requires_auth').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Data Source Management</h1>
          <p className="text-muted-foreground">
            Connect and manage your project data sources
          </p>
        </div>
        <Button onClick={() => setShowSetupModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Data Source
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Sources</p>
                <p className="text-xl font-bold">{dataSources.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Connected</p>
                <p className="text-xl font-bold">{connectedSources}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">Need Attention</p>
                <p className="text-xl font-bold">{errorSources}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Secure</p>
                <p className="text-xl font-bold">{dataSources.filter(ds => ds.config.encryption).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Connected Data Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dataSources.map((dataSource) => (
                  <div key={dataSource.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="bg-muted p-2 rounded">
                        {getTypeIcon(dataSource.type)}
                      </div>
                      <div>
                        <h3 className="font-medium">{dataSource.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {dataSource.type.replace('_', ' ')} • 
                          {dataSource.lastSync ? 
                            ` Last sync: ${dataSource.lastSync.toRelativeTimeString?.() || dataSource.lastSync.toLocaleDateString()}` :
                            ' Never synced'
                          }
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {getStatusBadge(dataSource.status)}
                      {getStatusIcon(dataSource.status)}
                      
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedDataSource(dataSource)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleSync(dataSource.id)}
                          disabled={dataSource.status === 'syncing'}
                        >
                          <Sync className={`h-4 w-4 ${dataSource.status === 'syncing' ? 'animate-spin' : ''}`} />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Data Source Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {DATA_SOURCE_TEMPLATES.map((template) => (
                  <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-muted p-2 rounded">
                          {getTypeIcon(template.type)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{template.name}</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            {template.description}
                          </p>
                          <Button 
                            size="sm" 
                            className="w-full"
                            onClick={() => handleAddDataSource(template)}
                          >
                            Connect
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

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Encryption Status</h4>
                    {dataSources.map((ds) => (
                      <div key={ds.id} className="flex items-center justify-between text-sm">
                        <span>{ds.name}</span>
                        <div className="flex items-center gap-2">
                          {ds.config.encryption ? (
                            <Shield className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          )}
                          <span>{ds.config.encryption ? 'Encrypted' : 'Not Encrypted'}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Approval Requirements</h4>
                    {dataSources.map((ds) => (
                      <div key={ds.id} className="flex items-center justify-between text-sm">
                        <span>{ds.name}</span>
                        <span>{ds.config.requiresApproval ? 'Required' : 'Not Required'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Data Source Setup Modal */}
      {showSetupModal && (
        <DataSourceSetupModal
          template={selectedTemplate}
          onClose={() => {
            setShowSetupModal(false);
            setSelectedTemplate(null);
          }
          onSave={(newDataSource) => {
            setDataSources(prev => [...prevnewDataSource]);
            setShowSetupModal(false);
            setSelectedTemplate(null);
          }
        />
      )}

      {/* Connection Test Component */}
      {selectedDataSource && (
        <DataSourceConnectionTest
          dataSource={selectedDataSource}
          onClose={() => setSelectedDataSource(null)}
        />
      )}
    </div>
  );
}