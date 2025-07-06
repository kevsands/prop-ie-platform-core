'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  isFeatureEnabled, 
  getAllFeatureFlags,
  initializeFeatureFlags,
  ENVIRONMENT
} from '@/lib/features/featureFlags';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { AuditLogger, AuditCategory } from '@/lib/security/auditLogger';
import { api } from '@/lib/api-client';

// Feature flag types from the featureFlags module
type FeatureFlagType = 'boolean' | 'percentage' | 'userSegment' | 'environment';

interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  type: FeatureFlagType;
  enabled: boolean;
  config: any;
}

// Sample feature flags data (in a real implementation, this would come from the server)
const SAMPLE_FEATURE_FLAGS: FeatureFlag[] = [
  {
    id: 'enable-mfa',
    name: 'Multi-Factor Authentication',
    description: 'Enable multi-factor authentication for users',
    type: 'boolean',
    enabled: true,
    config: { type: 'boolean', enabled: true }
  },
  {
    id: 'enable-session-fingerprinting',
    name: 'Session Fingerprinting',
    description: 'Detect suspicious session changes',
    type: 'environment',
    enabled: true,
    config: { 
      type: 'environment', 
      environments: {
        development: true,
        test: true,
        staging: true,
        production: true
      }
    }
  },
  {
    id: 'new-dashboard',
    name: 'New Dashboard UI',
    description: 'Enable the new dashboard user interface',
    type: 'percentage',
    enabled: false,
    config: { type: 'percentage', percentage: 25, seed: 'dashboard-2025-04' }
  },
  {
    id: 'api-rate-limiting',
    name: 'API Rate Limiting',
    description: 'Enable rate limiting for API endpoints',
    type: 'userSegment',
    enabled: true,
    config: { 
      type: 'userSegment',
      segments: [
        {
          segmentName: 'developers',
          segmentType: 'role',
          segmentValue: ['admin', 'developer'],
          enabled: false
        },
        {
          segmentName: 'internal-users',
          segmentType: 'domain',
          segmentValue: 'prop-ie.com',
          enabled: false
        }
      ],
      defaultEnabled: true
    }
  },
  {
    id: 'advanced-security',
    name: 'Advanced Security Features',
    description: 'Enable all advanced security features',
    type: 'boolean',
    enabled: true,
    config: { type: 'boolean', enabled: true }
  },
  {
    id: 'enable-audit-logging',
    name: 'Audit Logging',
    description: 'Enable comprehensive security audit logging',
    type: 'environment',
    enabled: true,
    config: { 
      type: 'environment', 
      environments: {
        development: true,
        test: true,
        staging: true,
        production: true
      }
    }
  },
  {
    id: 'enable-session-recording',
    name: 'Session Recording',
    description: 'Record user sessions for security analysis',
    type: 'boolean',
    enabled: false,
    config: { type: 'boolean', enabled: false }
  }
];

/**
 * Feature Flag Admin component for managing feature flags
 */
export function FeatureFlagAdmin() {
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFlag, setSelectedFlag] = useState<FeatureFlag | null>(null);
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
  
  // Load feature flags on mount
  useEffect(() => {
    async function loadFeatureFlags() {
      try {
        setLoading(true);
        
        // For a real implementation, we would fetch flags from the server
        // getAllFeatureFlags() is a function from the featureFlags module
        
        // For now, we'll use sample data with actual enabled states
        const enhancedFlags = await Promise.all(
          SAMPLE_FEATURE_FLAGS.map(async (flag) => ({
            ...flag,
            enabled: await isFeatureEnabled(flag.id)
          }))
        );
        
        setFeatureFlags(enhancedFlags);
      } catch (error) {
        console.error('Error loading feature flags:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadFeatureFlags();
  }, []);
  
  // Filter flags based on search and tab
  const filteredFlags = featureFlags.filter(flag => {
    // Filter by search query
    const matchesSearch = 
      searchQuery === '' || 
      flag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flag.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flag.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by tab
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'enabled') return flag.enabled && matchesSearch;
    if (activeTab === 'disabled') return !flag.enabled && matchesSearch;
    if (activeTab === flag.type) return matchesSearch;
    
    return false;
  });
  
  // Toggle a boolean feature flag
  const toggleFeatureFlag = async (id: string, enabled: boolean) => {
    try {
      // Update local state immediately for responsive UI
      setFeatureFlags(flags => 
        flags.map(flag => 
          flag.id === id ? { ...flag, enabled } : flag
        )
      );
      
      // In a real implementation, we would update the server
      // For now, we'll just simulate a request
      
      // Log the feature flag change
      AuditLogger.log({
        category: AuditCategory.CONFIGURATION,
        action: enabled ? 'feature_flag_enabled' : 'feature_flag_disabled',
        severity: 'info',
        description: `Feature flag "${id}" ${enabled ? 'enabled' : 'disabled'}`,
        status: 'success',
        resource: 'feature_flag',
        resourceId: id
      });
      
      // Refresh feature flags to ensure consistency
      await initializeFeatureFlags();
      
    } catch (error) {
      console.error(`Error toggling feature flag "${id}":`, error);
      
      // Revert the change in UI if server update fails
      setFeatureFlags(flags => 
        flags.map(flag => 
          flag.id === id ? { ...flag, enabled: !enabled } : flag
        )
      );
      
      // Log the failure
      AuditLogger.log({
        category: AuditCategory.CONFIGURATION,
        action: enabled ? 'feature_flag_enabled' : 'feature_flag_disabled',
        severity: 'error',
        description: `Failed to ${enabled ? 'enable' : 'disable'} feature flag "${id}"`,
        status: 'failure',
        resource: 'feature_flag',
        resourceId: id,
        errorMessage: error instanceof Error ? error.message : String(error)
      });
    }
  };
  
  // Edit a feature flag
  const handleEditFlag = (flag: FeatureFlag) => {
    setSelectedFlag(flag);
    setShowEditDialog(true);
  };
  
  // Save feature flag changes
  const handleSaveFlag = async () => {
    if (!selectedFlag) return;
    
    try {
      // In a real implementation, we would update the server
      // For now, we'll just update local state
      
      setFeatureFlags(flags => 
        flags.map(flag => 
          flag.id === selectedFlag.id ? selectedFlag : flag
        )
      );
      
      // Log the feature flag update
      AuditLogger.log({
        category: AuditCategory.CONFIGURATION,
        action: 'feature_flag_updated',
        severity: 'info',
        description: `Feature flag "${selectedFlag.id}" configuration updated`,
        status: 'success',
        resource: 'feature_flag',
        resourceId: selectedFlag.id,
        metadata: { flagType: selectedFlag.type }
      });
      
      setShowEditDialog(false);
      setSelectedFlag(null);
      
      // Refresh feature flags
      await initializeFeatureFlags();
      
    } catch (error) {
      console.error(`Error updating feature flag "${selectedFlag.id}":`, error);
      
      // Log the failure
      AuditLogger.log({
        category: AuditCategory.CONFIGURATION,
        action: 'feature_flag_updated',
        severity: 'error',
        description: `Failed to update feature flag "${selectedFlag.id}"`,
        status: 'failure',
        resource: 'feature_flag',
        resourceId: selectedFlag.id,
        errorMessage: error instanceof Error ? error.message : String(error)
      });
    }
  };
  
  // Update selected flag for percentage rollout
  const handlePercentageChange = (value: number[]) => {
    if (!selectedFlag) return;
    
    setSelectedFlag({
      ...selectedFlag,
      config: {
        ...selectedFlag.config,
        percentage: value[0]
      }
    });
  };
  
  // Update selected flag for environment configuration
  const handleEnvironmentToggle = (env: string, enabled: boolean) => {
    if (!selectedFlag) return;
    
    setSelectedFlag({
      ...selectedFlag,
      config: {
        ...selectedFlag.config,
        environments: {
          ...selectedFlag.config.environments,
          [env]: enabled
        }
      }
    });
  };
  
  // Render UI for editing different feature flag types
  const renderFlagEditor = () => {
    if (!selectedFlag) return null;
    
    switch (selectedFlag.type) {
      case 'boolean':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="flag-enabled">Enabled</Label>
              <Switch 
                id="flag-enabled" 
                checked={selectedFlag.enabled}
                onCheckedChange={(checked) => {
                  setSelectedFlag({
                    ...selectedFlag,
                    enabled: checked,
                    config: {
                      ...selectedFlag.config,
                      enabled: checked
                    }
                  });
                }}
              />
            </div>
          </div>
        );
        
      case 'percentage':
        return (
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">Rollout Percentage: {selectedFlag.config.percentage}%</Label>
              <Slider
                value={[selectedFlag.config.percentage]}
                min={0}
                max={100}
                step={1}
                onValueChange={handlePercentageChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="seed">Seed (for consistent hashing)</Label>
              <Input 
                id="seed" 
                value={selectedFlag.config.seed || ''}
                onChange={(e) => {
                  setSelectedFlag({
                    ...selectedFlag,
                    config: {
                      ...selectedFlag.config,
                      seed: e.target.value
                    }
                  });
                }}
              />
            </div>
          </div>
        );
        
      case 'environment':
        const environments = selectedFlag.config.environments || {};
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Enable in Environments</h3>
            
            {Object.entries(environments).map(([env, enabled]) => (
              <div key={env} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label htmlFor={`env-${env}`}>{env}</Label>
                  {env === ENVIRONMENT && (
                    <Badge variant="outline" className="text-xs">Current</Badge>
                  )}
                </div>
                <Switch 
                  id={`env-${env}`} 
                  checked={!!enabled}
                  onCheckedChange={(checked) => handleEnvironmentToggle(env, checked)}
                />
              </div>
            ))}
          </div>
        );
        
      case 'userSegment':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="default-enabled">Default Enabled</Label>
              <Switch 
                id="default-enabled" 
                checked={selectedFlag.config.defaultEnabled}
                onCheckedChange={(checked) => {
                  setSelectedFlag({
                    ...selectedFlag,
                    config: {
                      ...selectedFlag.config,
                      defaultEnabled: checked
                    }
                  });
                }}
              />
            </div>
            
            <h3 className="text-sm font-medium mt-4">User Segments</h3>
            
            {selectedFlag.config.segments.map((segment: any, index: number) => (
              <div key={index} className="border p-3 rounded-md space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{segment.segmentName}</span>
                  <Switch 
                    checked={segment.enabled}
                    onCheckedChange={(checked) => {
                      const newSegments = [...selectedFlag.config.segments];
                      newSegments[index] = {
                        ...segment,
                        enabled: checked
                      };
                      
                      setSelectedFlag({
                        ...selectedFlag,
                        config: {
                          ...selectedFlag.config,
                          segments: newSegments
                        }
                      });
                    }}
                  />
                </div>
                
                <div className="flex gap-2 text-sm">
                  <span className="text-muted-foreground">{segment.segmentType}:</span>
                  <span>
                    {Array.isArray(segment.segmentValue) 
                      ? segment.segmentValue.join(', ') 
                      : segment.segmentValue}
                  </span>
                </div>
              </div>
            ))}
          </div>
        );
        
      default:
        return (
          <div className="text-center text-muted-foreground py-4">
            This feature flag type does not have additional configuration options.
          </div>
        );
    }
  };
  
  // Render the feature flag type badge
  const renderFlagTypeBadge = (type: FeatureFlagType) => {
    switch (type) {
      case 'boolean':
        return <Badge variant="outline" className="bg-blue-50">Boolean</Badge>;
      case 'percentage':
        return <Badge variant="outline" className="bg-purple-50">Percentage</Badge>;
      case 'userSegment':
        return <Badge variant="outline" className="bg-yellow-50">User Segment</Badge>;
      case 'environment':
        return <Badge variant="outline" className="bg-green-50">Environment</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
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
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Feature Flags</CardTitle>
          <CardDescription>
            Manage feature flags for gradual rollout and A/B testing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search feature flags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-sm"
            />
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="enabled">Enabled</TabsTrigger>
              <TabsTrigger value="disabled">Disabled</TabsTrigger>
              <TabsTrigger value="boolean">Boolean</TabsTrigger>
              <TabsTrigger value="percentage">Percentage</TabsTrigger>
              <TabsTrigger value="environment">Environment</TabsTrigger>
              <TabsTrigger value="userSegment">User Segment</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-0">
              <div className="space-y-4">
                {filteredFlags.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No feature flags found.
                  </div>
                ) : (
                  filteredFlags.map(flag => (
                    <div 
                      key={flag.id}
                      className="border rounded-lg p-4 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{flag.name}</h3>
                            {renderFlagTypeBadge(flag.type)}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {flag.description}
                          </p>
                          <div className="text-xs text-muted-foreground mt-2">
                            ID: {flag.id}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {flag.type === 'boolean' ? (
                            <Switch
                              checked={flag.enabled}
                              onCheckedChange={(checked) => toggleFeatureFlag(flag.id, checked)}
                            />
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditFlag(flag)}
                            >
                              Configure
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Edit Dialog */}
      {showEditDialog && selectedFlag && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Edit Feature Flag</CardTitle>
              <CardDescription>{selectedFlag.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {renderFlagEditor()}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveFlag}>
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}