'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { 
  Building2, 
  Plus, 
  Edit3, 
  Save, 
  X, 
  Eye,
  Upload,
  MapPin,
  Euro,
  Home,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  Camera,
  FileText,
  Users,
  Target,
  Zap
} from 'lucide-react';

// Interface for property unit data that feeds public listings
interface PropertyUnit {
  id?: string;
  unitNumber: string;
  unitName: string;
  type: '1_bed_apartment' | '2_bed_apartment' | '3_bed_apartment' | '4_bed_apartment' | '1_bed_house' | '2_bed_house' | '3_bed_house' | '4_bed_house' | 'penthouse' | 'duplex';
  collection?: string; // e.g., "Willow Collection", "Oak Collection"
  
  // Pricing
  basePrice: number;
  currentPrice: number;
  priceHistory: { price: number; date: string; reason: string }[];
  
  // Status
  status: 'available' | 'reserved' | 'sold' | 'not_released';
  releaseDate?: string;
  
  // Physical Details
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  sqm: number;
  floor?: number;
  orientation?: string;
  
  // Features & Amenities
  features: string[];
  amenities: string[];
  energyRating?: string;
  
  // Location within development
  building?: string;
  block?: string;
  plotNumber?: string;
  
  // Media
  floorPlanUrl?: string;
  images: string[];
  virtualTourUrl?: string;
  
  // HTB & Financial
  htbEligible: boolean;
  estimatedHTBGrant?: number;
  stampDutyEstimate?: number;
  
  // Marketing
  description?: string;
  keySellingPoints: string[];
  targetBuyerType?: string;
  
  // Compliance
  buildingRegsCert?: string;
  fireRegsCert?: string;
  planningRef?: string;
  
  // Internal tracking
  createdDate: string;
  lastUpdated: string;
  approvedForPublic: boolean;
  approvedBy?: string;
  approvedDate?: string;
}

interface PropertyDataManagerProps {
  projectId: string;
  developmentName: string;
  onUnitUpdate?: (unitId: string, data: PropertyUnit) => Promise<boolean>;
  onUnitCreate?: (data: Omit<PropertyUnit, 'id'>) => Promise<string | null>;
  onUnitDelete?: (unitId: string) => Promise<boolean>;
}

// Unit Edit Form Component
interface UnitEditFormProps {
  unit: PropertyUnit | Omit<PropertyUnit, 'id'>;
  onSave: (unit: PropertyUnit) => Promise<boolean>;
  onCancel: () => void;
}

function UnitEditForm({ unit, onSave, onCancel }: UnitEditFormProps) {
  const [formData, setFormData] = useState<PropertyUnit | Omit<PropertyUnit, 'id'>>(unit);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const { toast } = useToast();

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      lastUpdated: new Date().toISOString()
    }));
  };

  const calculateHTBGrant = (price: number): number => {
    if (price > 500000) return 0;
    
    let grant = 0;
    if (price <= 320000) {
      grant = price * 0.05;
    } else {
      grant = (320000 * 0.05) + ((price - 320000) * 0.10);
    }
    
    return Math.min(30000, Math.max(10000, grant));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const success = await onSave(formData as PropertyUnit);
      if (!success) {
        toast({
          title: 'Save Failed',
          description: 'Unable to save unit data. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        {/* Basic Information Tab */}
        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="unitNumber">Unit Number</Label>
              <Input
                id="unitNumber"
                value={formData.unitNumber}
                onChange={(e) => updateField('unitNumber', e.target.value)}
                placeholder="e.g., FG-001"
              />
            </div>
            <div>
              <Label htmlFor="unitName">Unit Name</Label>
              <Input
                id="unitName"
                value={formData.unitName}
                onChange={(e) => updateField('unitName', e.target.value)}
                placeholder="e.g., Unit 1 - Ground Floor"
              />
            </div>
            <div>
              <Label htmlFor="type">Unit Type</Label>
              <Select value={formData.type} onValueChange={(value) => updateField('type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1_bed_apartment">1 Bed Apartment</SelectItem>
                  <SelectItem value="2_bed_apartment">2 Bed Apartment</SelectItem>
                  <SelectItem value="3_bed_apartment">3 Bed Apartment</SelectItem>
                  <SelectItem value="4_bed_apartment">4 Bed Apartment</SelectItem>
                  <SelectItem value="1_bed_house">1 Bed House</SelectItem>
                  <SelectItem value="2_bed_house">2 Bed House</SelectItem>
                  <SelectItem value="3_bed_house">3 Bed House</SelectItem>
                  <SelectItem value="4_bed_house">4 Bed House</SelectItem>
                  <SelectItem value="penthouse">Penthouse</SelectItem>
                  <SelectItem value="duplex">Duplex</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="collection">Collection (Optional)</Label>
              <Input
                id="collection"
                value={formData.collection || ''}
                onChange={(e) => updateField('collection', e.target.value)}
                placeholder="e.g., Willow Collection"
              />
            </div>
            <div>
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input
                id="bedrooms"
                type="number"
                value={formData.bedrooms}
                onChange={(e) => updateField('bedrooms', parseInt(e.target.value))}
                min="0"
                max="10"
              />
            </div>
            <div>
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input
                id="bathrooms"
                type="number"
                value={formData.bathrooms}
                onChange={(e) => updateField('bathrooms', parseInt(e.target.value))}
                min="0"
                max="10"
              />
            </div>
            <div>
              <Label htmlFor="sqft">Area (sq ft)</Label>
              <Input
                id="sqft"
                type="number"
                value={formData.sqft}
                onChange={(e) => updateField('sqft', parseInt(e.target.value))}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="sqm">Area (sq m)</Label>
              <Input
                id="sqm"
                type="number"
                value={formData.sqm}
                onChange={(e) => updateField('sqm', parseInt(e.target.value))}
                min="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="building">Building (Optional)</Label>
              <Input
                id="building"
                value={formData.building || ''}
                onChange={(e) => updateField('building', e.target.value)}
                placeholder="e.g., Block A"
              />
            </div>
            <div>
              <Label htmlFor="floor">Floor (Optional)</Label>
              <Input
                id="floor"
                type="number"
                value={formData.floor || ''}
                onChange={(e) => updateField('floor', e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="e.g., 2"
              />
            </div>
            <div>
              <Label htmlFor="orientation">Orientation (Optional)</Label>
              <Input
                id="orientation"
                value={formData.orientation || ''}
                onChange={(e) => updateField('orientation', e.target.value)}
                placeholder="e.g., South-facing"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Describe this unit's key features and benefits..."
              rows={3}
            />
          </div>
        </TabsContent>

        {/* Pricing Tab */}
        <TabsContent value="pricing" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="basePrice">Base Price (€)</Label>
              <Input
                id="basePrice"
                type="number"
                value={formData.basePrice}
                onChange={(e) => updateField('basePrice', parseInt(e.target.value))}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="currentPrice">Current Price (€)</Label>
              <Input
                id="currentPrice"
                type="number"
                value={formData.currentPrice}
                onChange={(e) => updateField('currentPrice', parseInt(e.target.value))}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => updateField('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not_released">Not Released</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="reserved">Reserved</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="releaseDate">Release Date (Optional)</Label>
              <Input
                id="releaseDate"
                type="date"
                value={formData.releaseDate || ''}
                onChange={(e) => updateField('releaseDate', e.target.value)}
              />
            </div>
          </div>

          <div className="p-4 border rounded-lg bg-green-50">
            <h4 className="font-medium text-green-800 mb-2">Help to Buy (HTB)</h4>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.htbEligible}
                  onChange={(e) => updateField('htbEligible', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">HTB Eligible</span>
              </label>
              {formData.htbEligible && (
                <div className="text-sm text-green-700">
                  Estimated Grant: €{calculateHTBGrant(formData.currentPrice).toLocaleString()}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Features Tab */}
        <TabsContent value="features" className="space-y-4">
          <div>
            <Label htmlFor="features">Features</Label>
            <Textarea
              id="features"
              value={formData.features.join(', ')}
              onChange={(e) => updateField('features', e.target.value.split(', ').filter(f => f.trim()))}
              placeholder="Modern kitchen, Built-in wardrobes, Energy efficient (separate with commas)"
              rows={2}
            />
          </div>
          <div>
            <Label htmlFor="amenities">Amenities</Label>
            <Textarea
              id="amenities"
              value={formData.amenities.join(', ')}
              onChange={(e) => updateField('amenities', e.target.value.split(', ').filter(a => a.trim()))}
              placeholder="Parking space, Balcony, Storage (separate with commas)"
              rows={2}
            />
          </div>
          <div>
            <Label htmlFor="keySellingPoints">Key Selling Points</Label>
            <Textarea
              id="keySellingPoints"
              value={formData.keySellingPoints.join(', ')}
              onChange={(e) => updateField('keySellingPoints', e.target.value.split(', ').filter(k => k.trim()))}
              placeholder="Sea views, Prime location, Modern design (separate with commas)"
              rows={2}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="energyRating">Energy Rating</Label>
              <Select value={formData.energyRating || ''} onValueChange={(value) => updateField('energyRating', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A1">A1</SelectItem>
                  <SelectItem value="A2">A2</SelectItem>
                  <SelectItem value="A3">A3</SelectItem>
                  <SelectItem value="B1">B1</SelectItem>
                  <SelectItem value="B2">B2</SelectItem>
                  <SelectItem value="B3">B3</SelectItem>
                  <SelectItem value="C1">C1</SelectItem>
                  <SelectItem value="C2">C2</SelectItem>
                  <SelectItem value="C3">C3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="targetBuyerType">Target Buyer Type</Label>
              <Input
                id="targetBuyerType"
                value={formData.targetBuyerType || ''}
                onChange={(e) => updateField('targetBuyerType', e.target.value)}
                placeholder="e.g., First-time buyer, Professional couple"
              />
            </div>
          </div>
        </TabsContent>

        {/* Media Tab */}
        <TabsContent value="media" className="space-y-4">
          <div>
            <Label htmlFor="floorPlanUrl">Floor Plan URL</Label>
            <Input
              id="floorPlanUrl"
              value={formData.floorPlanUrl || ''}
              onChange={(e) => updateField('floorPlanUrl', e.target.value)}
              placeholder="https://example.com/floorplan.pdf"
            />
          </div>
          <div>
            <Label htmlFor="images">Image URLs</Label>
            <Textarea
              id="images"
              value={formData.images.join('\n')}
              onChange={(e) => updateField('images', e.target.value.split('\n').filter(img => img.trim()))}
              placeholder="https://example.com/image1.jpg\nhttps://example.com/image2.jpg\n(one URL per line)"
              rows={4}
            />
          </div>
          <div>
            <Label htmlFor="virtualTourUrl">Virtual Tour URL</Label>
            <Input
              id="virtualTourUrl"
              value={formData.virtualTourUrl || ''}
              onChange={(e) => updateField('virtualTourUrl', e.target.value)}
              placeholder="https://example.com/virtual-tour"
            />
          </div>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="buildingRegsCert">Building Regulations Certificate</Label>
              <Input
                id="buildingRegsCert"
                value={formData.buildingRegsCert || ''}
                onChange={(e) => updateField('buildingRegsCert', e.target.value)}
                placeholder="Certificate reference number"
              />
            </div>
            <div>
              <Label htmlFor="fireRegsCert">Fire Regulations Certificate</Label>
              <Input
                id="fireRegsCert"
                value={formData.fireRegsCert || ''}
                onChange={(e) => updateField('fireRegsCert', e.target.value)}
                placeholder="Certificate reference number"
              />
            </div>
            <div>
              <Label htmlFor="planningRef">Planning Reference</Label>
              <Input
                id="planningRef"
                value={formData.planningRef || ''}
                onChange={(e) => updateField('planningRef', e.target.value)}
                placeholder="Planning permission reference"
              />
            </div>
          </div>

          <div className="p-4 border rounded-lg bg-blue-50">
            <h4 className="font-medium text-blue-800 mb-2">Publication Status</h4>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.approvedForPublic}
                  onChange={(e) => updateField('approvedForPublic', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Approved for Public Listing</span>
              </label>
              {formData.approvedForPublic && (
                <div className="text-sm text-blue-700">
                  This unit will appear on public property listings
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Form Actions */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            'Save Unit'
          )}
        </Button>
      </div>
    </div>
  );
}

export default function PropertyDataManager({ 
  projectId, 
  developmentName,
  onUnitUpdate,
  onUnitCreate,
  onUnitDelete 
}: PropertyDataManagerProps) {
  const { toast } = useToast();
  const [units, setUnits] = useState<PropertyUnit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedUnit, setSelectedUnit] = useState<PropertyUnit | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Load existing units from database
  useEffect(() => {
    loadUnitsFromDatabase();
  }, [projectId]);

  const loadUnitsFromDatabase = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/projects/${projectId}/units`);
      if (response.ok) {
        const data = await response.json();
        setUnits(data.units || []);
      }
    } catch (error) {
      console.error('Failed to load units:', error);
      toast({
        title: 'Error',
        description: 'Failed to load property units',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Create new unit template
  const createNewUnit = (): Omit<PropertyUnit, 'id'> => ({
    unitNumber: `${developmentName.substring(0, 2).toUpperCase()}-${(units.length + 1).toString().padStart(3, '0')}`,
    unitName: `Unit ${units.length + 1}`,
    type: '2_bed_apartment',
    basePrice: 350000,
    currentPrice: 350000,
    priceHistory: [],
    status: 'not_released',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 850,
    sqm: 79,
    features: ['Modern kitchen', 'Built-in wardrobes', 'Energy efficient'],
    amenities: ['Parking space', 'Balcony', 'Storage'],
    energyRating: 'A',
    htbEligible: true,
    images: [],
    keySellingPoints: [],
    createdDate: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    approvedForPublic: false
  });

  // Save unit to database
  const saveUnit = async (unit: PropertyUnit) => {
    try {
      const isNew = !unit.id;
      
      if (isNew) {
        // Create new unit
        const newId = onUnitCreate ? await onUnitCreate(unit) : await createUnitInDatabase(unit);
        if (newId) {
          setUnits(prev => [...prev, { ...unit, id: newId }]);
          toast({
            title: 'Unit Created',
            description: `${unit.unitName} has been created successfully.`,
          });
          return true;
        }
      } else {
        // Update existing unit
        const success = onUnitUpdate ? await onUnitUpdate(unit.id, unit) : await updateUnitInDatabase(unit);
        if (success) {
          setUnits(prev => prev.map(u => u.id === unit.id ? unit : u));
          toast({
            title: 'Unit Updated',
            description: `${unit.unitName} has been updated successfully.`,
          });
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Failed to save unit:', error);
      toast({
        title: 'Save Failed',
        description: 'Unable to save unit data. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const createUnitInDatabase = async (unit: Omit<PropertyUnit, 'id'>): Promise<string | null> => {
    try {
      const response = await fetch(`/api/projects/${projectId}/units`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(unit)
      });
      
      if (response.ok) {
        const result = await response.json();
        return result.unitId;
      }
      return null;
    } catch (error) {
      console.error('Database create error:', error);
      return null;
    }
  };

  const updateUnitInDatabase = async (unit: PropertyUnit): Promise<boolean> => {
    try {
      const response = await fetch(`/api/projects/${projectId}/units/${unit.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(unit)
      });
      return response.ok;
    } catch (error) {
      console.error('Database update error:', error);
      return false;
    }
  };

  // Approve unit for public display
  const approveUnit = async (unit: PropertyUnit) => {
    const updatedUnit = {
      ...unit,
      approvedForPublic: true,
      approvedBy: 'Developer', // In real implementation, use actual user
      approvedDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };
    
    await saveUnit(updatedUnit);
  };

  // Calculate HTB grant
  const calculateHTBGrant = (price: number): number => {
    if (price > 500000) return 0;
    
    let grant = 0;
    if (price <= 320000) {
      grant = price * 0.05;
    } else {
      grant = (320000 * 0.05) + ((price - 320000) * 0.10);
    }
    
    return Math.min(30000, Math.max(10000, grant));
  };

  // Update HTB calculation when price changes
  const updateUnitPrice = (unit: PropertyUnit, newPrice: number) => {
    const updatedUnit = {
      ...unit,
      currentPrice: newPrice,
      estimatedHTBGrant: unit.htbEligible ? calculateHTBGrant(newPrice) : 0,
      lastUpdated: new Date().toISOString(),
      priceHistory: [
        ...unit.priceHistory,
        {
          price: newPrice,
          date: new Date().toISOString(),
          reason: 'Developer price update'
        }
      ]
    };
    
    return updatedUnit;
  };

  // Statistics
  const stats = {
    total: units.length,
    available: units.filter(u => u.status === 'available').length,
    reserved: units.filter(u => u.status === 'reserved').length,
    sold: units.filter(u => u.status === 'sold').length,
    notReleased: units.filter(u => u.status === 'not_released').length,
    approved: units.filter(u => u.approvedForPublic).length,
    totalValue: units.reduce((sum, u) => sum + u.currentPrice, 0),
    htbEligible: units.filter(u => u.htbEligible).length
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Property Data Management</h2>
          <p className="text-gray-600">Manage units that feed public property listings</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Unit
          </Button>
          <Button 
            variant="outline"
            onClick={() => window.open(`/developments/${projectId}`, '_blank')}
            className="flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            View Public Listing
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Units</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.available}</div>
            <div className="text-sm text-gray-600">Available</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-amber-600">{stats.reserved}</div>
            <div className="text-sm text-gray-600">Reserved</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.sold}</div>
            <div className="text-sm text-gray-600">Sold</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">{stats.notReleased}</div>
            <div className="text-sm text-gray-600">Not Released</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.approved}</div>
            <div className="text-sm text-gray-600">Public Ready</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-indigo-600">{stats.htbEligible}</div>
            <div className="text-sm text-gray-600">HTB Eligible</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-emerald-600">€{(stats.totalValue / 1000000).toFixed(1)}M</div>
            <div className="text-sm text-gray-600">Total Value</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="units">Unit Management</TabsTrigger>
          <TabsTrigger value="pricing">Pricing Control</TabsTrigger>
          <TabsTrigger value="approval">Publication Approval</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Unit Type Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Unit Type Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Array.from(new Set(units.map(u => u.type))).map(type => {
                    const typeUnits = units.filter(u => u.type === type);
                    const avgPrice = typeUnits.reduce((sum, u) => sum + u.currentPrice, 0) / typeUnits.length;
                    
                    return (
                      <div key={type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">{type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                          <div className="text-sm text-gray-600">{typeUnits.length} units</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">€{Math.round(avgPrice).toLocaleString()}</div>
                          <div className="text-sm text-gray-600">Avg. Price</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { status: 'available', label: 'Available', color: 'text-green-600', bg: 'bg-green-50' },
                    { status: 'reserved', label: 'Reserved', color: 'text-amber-600', bg: 'bg-amber-50' },
                    { status: 'sold', label: 'Sold', color: 'text-blue-600', bg: 'bg-blue-50' },
                    { status: 'not_released', label: 'Not Released', color: 'text-gray-600', bg: 'bg-gray-50' }
                  ].map(({ status, label, color, bg }) => {
                    const count = units.filter(u => u.status === status).length;
                    const percentage = units.length > 0 ? (count / units.length) * 100 : 0;
                    
                    return (
                      <div key={status} className={`p-3 rounded-lg ${bg}`}>
                        <div className="flex items-center justify-between">
                          <div className={`font-medium ${color}`}>{label}</div>
                          <div className={`text-lg font-bold ${color}`}>{count}</div>
                        </div>
                        <div className="mt-1">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${color.replace('text-', 'bg-')}`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">{percentage.toFixed(1)}%</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {units
                  .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
                  .slice(0, 5)
                  .map(unit => (
                    <div key={unit.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{unit.unitName}</div>
                        <div className="text-sm text-gray-600">
                          Last updated: {new Date(unit.lastUpdated).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          unit.status === 'available' ? 'default' :
                          unit.status === 'reserved' ? 'secondary' :
                          unit.status === 'sold' ? 'outline' : 'destructive'
                        }>
                          {unit.status}
                        </Badge>
                        {unit.approvedForPublic && (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Units Management Tab */}
        <TabsContent value="units" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {units.map(unit => (
              <Card key={unit.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{unit.unitName}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        unit.status === 'available' ? 'default' :
                        unit.status === 'reserved' ? 'secondary' :
                        unit.status === 'sold' ? 'outline' : 'destructive'
                      }>
                        {unit.status}
                      </Badge>
                      {unit.approvedForPublic ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-amber-600" />
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">{unit.unitNumber}</div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Type:</span>
                      <div className="font-medium">{unit.type.replace('_', ' ')}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Price:</span>
                      <div className="font-medium">€{unit.currentPrice.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Bedrooms:</span>
                      <div className="font-medium">{unit.bedrooms}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Area:</span>
                      <div className="font-medium">{unit.sqm}m²</div>
                    </div>
                  </div>
                  
                  {unit.htbEligible && (
                    <div className="p-2 bg-green-50 rounded border border-green-200">
                      <div className="text-sm text-green-800">
                        HTB Eligible: €{unit.estimatedHTBGrant?.toLocaleString() || calculateHTBGrant(unit.currentPrice).toLocaleString()}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setSelectedUnit(unit);
                        setIsEditing(true);
                      }}
                      className="flex-1"
                    >
                      <Edit3 className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    {!unit.approvedForPublic && (
                      <Button 
                        size="sm" 
                        onClick={() => approveUnit(unit)}
                        className="flex-1"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Approve
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Pricing Control Tab */}
        <TabsContent value="pricing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Pricing Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Price by Unit Type</h4>
                  {Array.from(new Set(units.map(u => u.type))).map(type => {
                    const typeUnits = units.filter(u => u.type === type);
                    const avgPrice = typeUnits.reduce((sum, u) => sum + u.currentPrice, 0) / typeUnits.length;
                    
                    return (
                      <div key={type} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{type.replace('_', ' ')}</div>
                          <div className="text-sm text-gray-600">{typeUnits.length} units</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input 
                            type="number" 
                            defaultValue={Math.round(avgPrice)}
                            className="w-32"
                          />
                          <Button size="sm">Update</Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">HTB Grant Analysis</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-sm text-green-800">
                        <strong>HTB Eligible Units:</strong> {stats.htbEligible} / {stats.total}
                      </div>
                      <div className="text-sm text-green-700 mt-1">
                        Total Grant Value: €{units.filter(u => u.htbEligible).reduce((sum, u) => sum + calculateHTBGrant(u.currentPrice), 0).toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      <strong>Grant Breakdown:</strong>
                      <ul className="mt-2 space-y-1">
                        <li>• €10,000 minimum grant (all eligible)</li>
                        <li>• 5% up to €320K + 10% above</li>
                        <li>• €30,000 maximum grant</li>
                        <li>• Must be under €500K property price</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Approval Tab */}
        <TabsContent value="approval" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Publication Approval Queue</CardTitle>
              <div className="text-sm text-gray-600">
                Units must be approved before appearing on public property listings
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {units.filter(u => !u.approvedForPublic).length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    All units are approved for public display
                  </div>
                ) : (
                  units.filter(u => !u.approvedForPublic).map(unit => (
                    <div key={unit.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="font-medium">{unit.unitName}</div>
                            <div className="text-sm text-gray-600">{unit.unitNumber} • {unit.type.replace('_', ' ')}</div>
                          </div>
                          <Badge variant="outline">{unit.status}</Badge>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                          Price: €{unit.currentPrice.toLocaleString()} • 
                          {unit.htbEligible && ` HTB: €${calculateHTBGrant(unit.currentPrice).toLocaleString()} • `}
                          {unit.bedrooms} bed, {unit.sqm}m²
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedUnit(unit);
                            setIsEditing(true);
                          }}
                        >
                          <Edit3 className="w-4 h-4 mr-1" />
                          Review
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => approveUnit(unit)}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Approved Units */}
          <Card>
            <CardHeader>
              <CardTitle>Public Listings ({units.filter(u => u.approvedForPublic).length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {units.filter(u => u.approvedForPublic).map(unit => (
                  <div key={unit.id} className="p-3 border rounded-lg bg-green-50 border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">{unit.unitName}</div>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="text-sm text-gray-600">
                      €{unit.currentPrice.toLocaleString()} • {unit.status}
                    </div>
                    <div className="text-xs text-green-700 mt-1">
                      Approved: {unit.approvedDate ? new Date(unit.approvedDate).toLocaleDateString() : 'Today'}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create/Edit Unit Modal */}
      <Dialog open={showCreateModal || isEditing} onOpenChange={(open) => {
        if (!open) {
          setShowCreateModal(false);
          setIsEditing(false);
          setSelectedUnit(null);
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {showCreateModal ? 'Create New Unit' : `Edit ${selectedUnit?.unitName}`}
            </DialogTitle>
          </DialogHeader>
          
          {(showCreateModal || selectedUnit) && (
            <UnitEditForm
              unit={showCreateModal ? createNewUnit() : selectedUnit}
              onSave={async (unitData) => {
                const success = await saveUnit(unitData);
                if (success) {
                  setShowCreateModal(false);
                  setIsEditing(false);
                  setSelectedUnit(null);
                }
                return success;
              }}
              onCancel={() => {
                setShowCreateModal(false);
                setIsEditing(false);
                setSelectedUnit(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}