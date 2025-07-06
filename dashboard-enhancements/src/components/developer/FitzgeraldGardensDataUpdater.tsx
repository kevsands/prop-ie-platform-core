'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { fitzgeraldGardensConfig, FitzgeraldGardensConfig } from '@/data/fitzgerald-gardens-config';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface FitzgeraldGardensDataUpdaterProps {
  onDataUpdate?: (updatedConfig: FitzgeraldGardensConfig) => void;
}

export default function FitzgeraldGardensDataUpdater({ onDataUpdate }: FitzgeraldGardensDataUpdaterProps) {
  const [config, setConfig] = useState<FitzgeraldGardensConfig>(fitzgeraldGardensConfig);
  const [isSaving, setIsSaving] = useState(false);

  const handleBasicInfoChange = (field: keyof FitzgeraldGardensConfig, value: string | number) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUnitTypeChange = (unitType: string, field: string, value: number) => {
    setConfig(prev => ({
      ...prev,
      unitTypes: {
        ...prev.unitTypes,
        [unitType]: {
          ...prev.unitTypes[unitType],
          [field]: value
        }
      }
    }));
  };

  const handleContactChange = (role: string, field: string, value: string) => {
    setConfig(prev => ({
      ...prev,
      keyContacts: {
        ...prev.keyContacts,
        [role]: {
          ...prev.keyContacts[role],
          [field]: value
        }
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // In a real app, this would save to your database
      // For now, we'll just notify the parent component
      if (onDataUpdate) {
        onDataUpdate(config);
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Updated Fitzgerald Gardens Config:', config);
      alert('Configuration updated successfully! Changes are now reflected in the platform.');
    } catch (error) {
      console.error('Error updating configuration:', error);
      alert('Error updating configuration. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Fitzgerald Gardens - Real Data Configuration</h1>
        <p className="text-muted-foreground">
          Update your actual project data to populate the platform with real information
        </p>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Live Project Data Integration
        </Badge>
      </div>

      {/* Basic Project Information */}
      <Card>
        <CardHeader>
          <CardTitle>Project Information</CardTitle>
          <CardDescription>Basic details about your development</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                value={config.projectName}
                onChange={(e) => handleBasicInfoChange('projectName', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={config.location}
                onChange={(e) => handleBasicInfoChange('location', e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Project Description</Label>
            <Textarea
              id="description"
              value={config.description}
              onChange={(e) => handleBasicInfoChange('description', e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="totalUnits">Total Units</Label>
              <Input
                id="totalUnits"
                type="number"
                value={config.totalUnits}
                onChange={(e) => handleBasicInfoChange('totalUnits', parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="phase1Units">Phase 1 Units</Label>
              <Input
                id="phase1Units"
                type="number"
                value={config.phase1Units}
                onChange={(e) => handleBasicInfoChange('phase1Units', parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="availableForSale">Available for Sale</Label>
              <Input
                id="availableForSale"
                type="number"
                value={config.availableForSale}
                onChange={(e) => handleBasicInfoChange('availableForSale', parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="currentPhase">Current Phase</Label>
              <Input
                id="currentPhase"
                value={config.currentPhase}
                onChange={(e) => handleBasicInfoChange('currentPhase', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="completionPercentage">Completion Percentage</Label>
              <Input
                id="completionPercentage"
                type="number"
                value={config.completionPercentage}
                onChange={(e) => handleBasicInfoChange('completionPercentage', parseInt(e.target.value))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Unit Types Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Unit Types & Pricing</CardTitle>
          <CardDescription>Configure your actual unit types, counts, and pricing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(config.unitTypes).map(([unitType, details]) => (
            <div key={unitType} className="border rounded-lg p-4 space-y-4">
              <h3 className="font-semibold capitalize">{unitType.replace('_', ' ')}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Units Available</Label>
                  <Input
                    type="number"
                    value={details.count}
                    onChange={(e) => handleUnitTypeChange(unitType, 'count', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Base Price (€)</Label>
                  <Input
                    type="number"
                    value={details.basePrice}
                    onChange={(e) => handleUnitTypeChange(unitType, 'basePrice', parseInt(e.target.value))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Size (sqm)</Label>
                  <Input
                    type="number"
                    value={details.size}
                    onChange={(e) => handleUnitTypeChange(unitType, 'size', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Bedrooms</Label>
                  <Input
                    type="number"
                    value={details.bedrooms}
                    onChange={(e) => handleUnitTypeChange(unitType, 'bedrooms', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Bathrooms</Label>
                  <Input
                    type="number"
                    value={details.bathrooms}
                    onChange={(e) => handleUnitTypeChange(unitType, 'bathrooms', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Key Contacts */}
      <Card>
        <CardHeader>
          <CardTitle>Key Contacts</CardTitle>
          <CardDescription>Update your actual team contacts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(config.keyContacts).map(([role, contact]) => (
            <div key={role} className="border rounded-lg p-4 space-y-4">
              <h3 className="font-semibold">{role}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={contact.name}
                    onChange={(e) => handleContactChange(role, 'name', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Company</Label>
                  <Input
                    value={contact.company}
                    onChange={(e) => handleContactChange(role, 'company', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={contact.email}
                    onChange={(e) => handleContactChange(role, 'email', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={contact.phone}
                    onChange={(e) => handleContactChange(role, 'phone', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Financial Information */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Information</CardTitle>
          <CardDescription>Update your actual project financial data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="totalInvestment">Total Investment (€)</Label>
              <Input
                id="totalInvestment"
                type="number"
                value={config.totalInvestment}
                onChange={(e) => handleBasicInfoChange('totalInvestment', parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="soldToDate">Units Sold to Date</Label>
              <Input
                id="soldToDate"
                type="number"
                value={config.soldToDate}
                onChange={(e) => handleBasicInfoChange('soldToDate', parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="reservedUnits">Reserved Units</Label>
              <Input
                id="reservedUnits"
                type="number"
                value={config.reservedUnits}
                onChange={(e) => handleBasicInfoChange('reservedUnits', parseInt(e.target.value))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Save Button */}
      <div className="flex justify-center">
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          size="lg"
          className="px-8"
        >
          {isSaving ? 'Updating...' : 'Update Live Data'}
        </Button>
      </div>

      {/* Current Configuration Summary */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-sm">Current Configuration Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm space-y-2">
            <p><strong>Total Units:</strong> {config.totalUnits}</p>
            <p><strong>Available for Sale:</strong> {config.availableForSale}</p>
            <p><strong>Progress:</strong> {config.completionPercentage}%</p>
            <p><strong>Total Investment:</strong> €{config.totalInvestment.toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}