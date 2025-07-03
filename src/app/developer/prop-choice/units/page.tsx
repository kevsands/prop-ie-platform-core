'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertCircle, Building, Users, Package, TrendingUp, Settings, Eye, Edit, Copy, Filter, Download, Upload } from 'lucide-react';

/**
 * Enterprise Unit Configuration Matrix
 * Comprehensive management of unit-specific PROP Choice configurations
 * Enables bulk operations, template applications, and detailed unit customization
 */

interface UnitConfiguration {
  unitId: string;
  unitNumber: string;
  unitType: string;
  block: string;
  floor: number;
  size: { sqft: number; sqm: number };
  basePrice: number;
  propChoiceConfiguration: {
    enabled: boolean;
    availablePackages: string[];
    excludedOptions?: string[];
    customPricing?: any;
    restrictions?: any;
    preselections?: any[];
  };
  buyerInfo?: {
    buyerId: string;
    buyerName: string;
    selectionStatus: string;
    propChoiceDeadline: string;
  };
  technicalSpecs?: any;
}

interface FloorConfiguration {
  floor: number;
  description: string;
  unitCount: number;
  propChoiceEnabled: boolean;
  unitTypes?: string[];
  units: UnitConfiguration[];
}

const UnitConfigurationMatrix: React.FC = () => {
  const [configurationData, setConfigurationData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    unitType: '',
    block: '',
    floor: '',
    status: ''
  });
  const [viewMode, setViewMode] = useState<'matrix' | 'list' | 'analytics'>('matrix');
  const [bulkOperation, setBulkOperation] = useState<any>(null);

  // Load configuration data
  useEffect(() => {
    fetchConfigurationData();
  }, [filters]);

  const fetchConfigurationData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('projectId', 'proj_fitzgerald_gardens');
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await fetch(`/api/developer/prop-choice/units?${params}`);
      const result = await response.json();
      
      if (result.success) {
        setConfigurationData(result.data);
      }
    } catch (error) {
      console.error('Failed to load configuration data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnitSelection = (unitId: string, selected: boolean) => {
    if (selected) {
      setSelectedUnits([...selectedUnits, unitId]);
    } else {
      setSelectedUnits(selectedUnits.filter(id => id !== unitId));
    }
  };

  const handleBulkOperation = async (operation: string, config: any) => {
    try {
      const response = await fetch('/api/developer/prop-choice/units', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'bulk_configuration',
          data: {
            projectId: 'proj_fitzgerald_gardens',
            configType: operation,
            targetCriteria: { unitIds: selectedUnits },
            configuration: config
          }
        })
      });

      const result = await response.json();
      if (result.success) {
        setBulkOperation(result.data);
        fetchConfigurationData(); // Refresh data
      }
    } catch (error) {
      console.error('Bulk operation failed:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'not_started': { color: 'bg-gray-100 text-gray-800', label: 'Not Started' },
      'in_progress': { color: 'bg-blue-100 text-blue-800', label: 'In Progress' },
      'finalized': { color: 'bg-green-100 text-green-800', label: 'Finalized' },
      'deadline_passed': { color: 'bg-red-100 text-red-800', label: 'Deadline Passed' },
      'available': { color: 'bg-yellow-100 text-yellow-800', label: 'Available' }
    };

    const config = statusMap[status as keyof typeof statusMap] || statusMap.available;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(amount);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading unit configuration matrix...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Summary */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Unit Configuration Matrix</h1>
          <p className="text-gray-600 mt-2">
            Manage PROP Choice configurations for {configurationData?.project?.name}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import Config
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Matrix
          </Button>
        </div>
      </div>

      {/* Configuration Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Units</p>
                <p className="text-2xl font-bold">{configurationData?.configurationSummary?.totalUnits}</p>
              </div>
              <Building className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">PROP Choice Enabled</p>
                <p className="text-2xl font-bold text-green-600">{configurationData?.configurationSummary?.configuredUnits}</p>
              </div>
              <Package className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Buyers</p>
                <p className="text-2xl font-bold text-purple-600">{configurationData?.configurationSummary?.unitsWithBuyers}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Upgrade Value</p>
                <p className="text-2xl font-bold text-orange-600">
                  {formatCurrency(configurationData?.configurationSummary?.averageUpgradeValue || 0)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters & Bulk Operations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
            <Select value={filters.unitType} onValueChange={(value) => setFilters({...filters, unitType: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Unit Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="1bed">1 Bedroom</SelectItem>
                <SelectItem value="2bed">2 Bedroom</SelectItem>
                <SelectItem value="3bed">3 Bedroom</SelectItem>
                <SelectItem value="penthouse">Penthouse</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.block} onValueChange={(value) => setFilters({...filters, block: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Block" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Blocks</SelectItem>
                <SelectItem value="A">Block A</SelectItem>
                <SelectItem value="B">Block B</SelectItem>
                <SelectItem value="C">Block C</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.floor} onValueChange={(value) => setFilters({...filters, floor: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Floor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Floors</SelectItem>
                {[1, 2, 3, 4, 5, 6].map(floor => (
                  <SelectItem key={floor} value={floor.toString()}>Floor {floor}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="finalized">Finalized</SelectItem>
                <SelectItem value="deadline_passed">Deadline Passed</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={() => setFilters({ unitType: '', block: '', floor: '', status: '' })}
            >
              Clear Filters
            </Button>

            <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="matrix">Matrix View</SelectItem>
                <SelectItem value="list">List View</SelectItem>
                <SelectItem value="analytics">Analytics View</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bulk Operations */}
          {selectedUnits.length > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {selectedUnits.length} units selected
                </span>
                <div className="flex space-x-2">
                  <BulkConfigurationDialog 
                    selectedUnits={selectedUnits}
                    onApply={handleBulkOperation}
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedUnits([])}
                  >
                    Clear Selection
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
        <TabsList>
          <TabsTrigger value="matrix">Configuration Matrix</TabsTrigger>
          <TabsTrigger value="list">Detailed List</TabsTrigger>
          <TabsTrigger value="analytics">Analytics & Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="matrix" className="space-y-4">
          {/* Matrix View */}
          {configurationData?.configurationMatrix?.map((floor: FloorConfiguration) => (
            <Card key={floor.floor}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>{floor.description}</CardTitle>
                    <p className="text-sm text-gray-600">
                      {floor.unitCount} units • PROP Choice: {floor.propChoiceEnabled ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Badge variant={floor.propChoiceEnabled ? 'default' : 'secondary'}>
                      Floor {floor.floor}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {floor.units.map((unit: UnitConfiguration) => (
                    <UnitConfigCard 
                      key={unit.unitId}
                      unit={unit}
                      selected={selectedUnits.includes(unit.unitId)}
                      onSelect={(selected) => handleUnitSelection(unit.unitId, selected)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          {/* Detailed List View */}
          <DetailedListView 
            units={configurationData?.configurationMatrix?.flatMap((floor: FloorConfiguration) => floor.units) || []}
            selectedUnits={selectedUnits}
            onUnitSelect={handleUnitSelection}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {/* Analytics View */}
          <AnalyticsView analytics={configurationData?.analytics} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Unit Configuration Card Component
const UnitConfigCard: React.FC<{
  unit: UnitConfiguration;
  selected: boolean;
  onSelect: (selected: boolean) => void;
}> = ({ unit, selected, onSelect }) => {
  return (
    <Card className={`cursor-pointer transition-all ${selected ? 'ring-2 ring-blue-500' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                checked={selected}
                onCheckedChange={onSelect}
                onClick={(e) => e.stopPropagation()}
              />
              <h4 className="font-semibold">{unit.unitNumber}</h4>
            </div>
            <p className="text-sm text-gray-600">
              {unit.unitType} • {unit.size.sqm}m² • Block {unit.block}
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <UnitDetailView unit={unit} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Base Price:</span>
            <span className="font-medium">
              {new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(unit.basePrice)}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span>PROP Choice:</span>
            <Badge variant={unit.propChoiceConfiguration.enabled ? 'default' : 'secondary'}>
              {unit.propChoiceConfiguration.enabled ? 'Enabled' : 'Disabled'}
            </Badge>
          </div>

          {unit.buyerInfo && (
            <>
              <div className="flex justify-between text-sm">
                <span>Buyer:</span>
                <span className="font-medium">{unit.buyerInfo.buyerName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Status:</span>
                {getStatusBadge(unit.buyerInfo.selectionStatus)}
              </div>
            </>
          )}

          <div className="flex justify-between text-sm">
            <span>Packages:</span>
            <span className="text-right">
              {unit.propChoiceConfiguration.availablePackages?.length || 0} available
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function for status badges
const getStatusBadge = (status: string) => {
  const statusMap = {
    'not_started': { color: 'bg-gray-100 text-gray-800', label: 'Not Started' },
    'in_progress': { color: 'bg-blue-100 text-blue-800', label: 'In Progress' },
    'finalized': { color: 'bg-green-100 text-green-800', label: 'Finalized' },
    'deadline_passed': { color: 'bg-red-100 text-red-800', label: 'Deadline Passed' }
  };

  const config = statusMap[status as keyof typeof statusMap] || { color: 'bg-gray-100 text-gray-800', label: status };
  return <Badge className={config.color}>{config.label}</Badge>;
};

// Bulk Configuration Dialog Component
const BulkConfigurationDialog: React.FC<{
  selectedUnits: string[];
  onApply: (operation: string, config: any) => void;
}> = ({ selectedUnits, onApply }) => {
  const [configuration, setConfiguration] = useState({
    packages: [] as string[],
    deadline: '',
    maxUpgrade: '',
    discounts: {} as Record<string, number>
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Bulk Configure
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Bulk Configuration</DialogTitle>
          <DialogDescription>
            Apply configuration to {selectedUnits.length} selected units
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label>Available Packages</Label>
            <div className="space-y-2 mt-1">
              {['essential', 'comfort', 'premium', 'luxury'].map(pkg => (
                <div key={pkg} className="flex items-center space-x-2">
                  <Checkbox 
                    checked={configuration.packages.includes(pkg)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setConfiguration(prev => ({
                          ...prev,
                          packages: [...prev.packages, pkg]
                        }));
                      } else {
                        setConfiguration(prev => ({
                          ...prev,
                          packages: prev.packages.filter(p => p !== pkg)
                        }));
                      }
                    }}
                  />
                  <Label className="capitalize">{pkg}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="deadline">Selection Deadline</Label>
            <Input 
              id="deadline"
              type="date"
              value={configuration.deadline}
              onChange={(e) => setConfiguration(prev => ({ ...prev, deadline: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="maxUpgrade">Max Upgrade Value (€)</Label>
            <Input 
              id="maxUpgrade"
              type="number"
              value={configuration.maxUpgrade}
              onChange={(e) => setConfiguration(prev => ({ ...prev, maxUpgrade: e.target.value }))}
            />
          </div>

          <Button 
            className="w-full" 
            onClick={() => onApply('unit_list', {
              availablePackages: configuration.packages,
              deadline: configuration.deadline ? `${configuration.deadline}T00:00:00Z` : undefined,
              restrictions: configuration.maxUpgrade ? { maxUpgradeValue: parseInt(configuration.maxUpgrade) } : undefined
            })}
          >
            Apply Configuration
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Unit Detail View Component
const UnitDetailView: React.FC<{ unit: UnitConfiguration }> = ({ unit }) => {
  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle>{unit.unitNumber} - Configuration Details</DialogTitle>
        <DialogDescription>
          {unit.unitType} • {unit.size.sqm}m² ({unit.size.sqft} sq ft) • Block {unit.block}, Floor {unit.floor}
        </DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold mb-2">Basic Information</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Base Price:</span>
              <span>{new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(unit.basePrice)}</span>
            </div>
            <div className="flex justify-between">
              <span>Orientation:</span>
              <span className="capitalize">{unit.technicalSpecs?.orientation || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span>Balcony:</span>
              <span>{unit.technicalSpecs?.balcony ? 'Yes' : 'No'}</span>
            </div>
            <div className="flex justify-between">
              <span>Parking:</span>
              <span>{unit.technicalSpecs?.parking || 0} spaces</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">PROP Choice Configuration</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Status:</span>
              <Badge variant={unit.propChoiceConfiguration.enabled ? 'default' : 'secondary'}>
                {unit.propChoiceConfiguration.enabled ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Packages:</span>
              <span>{unit.propChoiceConfiguration.availablePackages?.length || 0}</span>
            </div>
            {unit.propChoiceConfiguration.restrictions?.maxUpgradeValue && (
              <div className="flex justify-between">
                <span>Max Upgrade:</span>
                <span>{new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(unit.propChoiceConfiguration.restrictions.maxUpgradeValue)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {unit.buyerInfo && (
        <div>
          <h4 className="font-semibold mb-2">Buyer Information</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Buyer:</span>
              <span>{unit.buyerInfo.buyerName}</span>
            </div>
            <div className="flex justify-between">
              <span>Selection Status:</span>
              {getStatusBadge(unit.buyerInfo.selectionStatus)}
            </div>
            <div className="flex justify-between">
              <span>Deadline:</span>
              <span>{new Date(unit.buyerInfo.propChoiceDeadline).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex space-x-2">
        <Button variant="outline" className="flex-1">
          <Edit className="h-4 w-4 mr-2" />
          Edit Configuration
        </Button>
        <Button variant="outline" className="flex-1">
          <Copy className="h-4 w-4 mr-2" />
          Copy to Units
        </Button>
      </div>
    </div>
  );
};

// Detailed List View Component
const DetailedListView: React.FC<{
  units: UnitConfiguration[];
  selectedUnits: string[];
  onUnitSelect: (unitId: string, selected: boolean) => void;
}> = ({ units, selectedUnits, onUnitSelect }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detailed Unit List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">
                  <Checkbox 
                    checked={selectedUnits.length === units.length}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        units.forEach(unit => onUnitSelect(unit.unitId, true));
                      } else {
                        units.forEach(unit => onUnitSelect(unit.unitId, false));
                      }
                    }}
                  />
                </th>
                <th className="text-left p-2">Unit</th>
                <th className="text-left p-2">Type</th>
                <th className="text-left p-2">Size</th>
                <th className="text-left p-2">Price</th>
                <th className="text-left p-2">PROP Choice</th>
                <th className="text-left p-2">Buyer</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {units.map(unit => (
                <tr key={unit.unitId} className="border-b hover:bg-gray-50">
                  <td className="p-2">
                    <Checkbox 
                      checked={selectedUnits.includes(unit.unitId)}
                      onCheckedChange={(checked) => onUnitSelect(unit.unitId, !!checked)}
                    />
                  </td>
                  <td className="p-2">
                    <div>
                      <div className="font-medium">{unit.unitNumber}</div>
                      <div className="text-sm text-gray-600">Block {unit.block}, Floor {unit.floor}</div>
                    </div>
                  </td>
                  <td className="p-2 capitalize">{unit.unitType}</td>
                  <td className="p-2">{unit.size.sqm}m²</td>
                  <td className="p-2">{new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(unit.basePrice)}</td>
                  <td className="p-2">
                    <Badge variant={unit.propChoiceConfiguration.enabled ? 'default' : 'secondary'}>
                      {unit.propChoiceConfiguration.enabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </td>
                  <td className="p-2">
                    {unit.buyerInfo ? (
                      <div>
                        <div className="font-medium">{unit.buyerInfo.buyerName}</div>
                        <div className="text-sm text-gray-600">
                          Deadline: {new Date(unit.buyerInfo.propChoiceDeadline).toLocaleDateString()}
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400">Available</span>
                    )}
                  </td>
                  <td className="p-2">
                    {unit.buyerInfo ? getStatusBadge(unit.buyerInfo.selectionStatus) : <Badge variant="outline">Available</Badge>}
                  </td>
                  <td className="p-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

// Analytics View Component
const AnalyticsView: React.FC<{ analytics: any }> = ({ analytics }) => {
  if (!analytics) return <div>No analytics data available</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Conversion Rates by Unit Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(analytics.conversionRates?.byUnitType || {}).map(([type, rate]) => (
              <div key={type} className="flex justify-between items-center">
                <span className="capitalize">{type}</span>
                <div className="flex items-center space-x-2">
                  <div className="bg-gray-200 rounded-full h-2 w-24">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${rate}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{rate}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Average Upgrade Values</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(analytics.averageUpgradeValues?.byUnitType || {}).map(([type, value]) => (
              <div key={type} className="flex justify-between items-center">
                <span className="capitalize">{type}</span>
                <span className="font-medium">
                  {new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(value as number)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Deadline Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>On-time Selections</span>
              <span className="font-medium text-green-600">{analytics.deadlinePerformance?.onTimeSelections}%</span>
            </div>
            <div className="flex justify-between">
              <span>Late Selections</span>
              <span className="font-medium text-yellow-600">{analytics.deadlinePerformance?.lateSelections}%</span>
            </div>
            <div className="flex justify-between">
              <span>Missed Deadlines</span>
              <span className="font-medium text-red-600">{analytics.deadlinePerformance?.missedDeadlines}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Package Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(analytics.conversionRates?.byPackage || {}).map(([pkg, rate]) => (
              <div key={pkg} className="flex justify-between items-center">
                <span className="capitalize">{pkg}</span>
                <div className="flex items-center space-x-2">
                  <div className="bg-gray-200 rounded-full h-2 w-24">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${rate}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{rate}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnitConfigurationMatrix;