/**
 * Contractor Valuation Submission Form
 * 
 * Monthly valuation submission with BOQ integration and document upload
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import {
  Building2,
  FileText,
  Euro,
  Calculator,
  Upload,
  Plus,
  Minus,
  Save,
  Send,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Receipt,
  Users,
  ArrowLeft
} from 'lucide-react';

interface BOQItem {
  id: string;
  code: string;
  description: string;
  unit: string;
  quantity: number;
  rate: number;
  previousQuantity: number;
  thisMonthQuantity: number;
  cumulativeQuantity: number;
  amount: number;
}

interface ValuationData {
  projectId: string;
  valuationNumber: number;
  periodFrom: Date;
  periodTo: Date;
  workCompleted: BOQItem[];
  materialsOnSite: {
    description: string;
    quantity: number;
    unit: string;
    value: number;
  }[];
  variations: {
    description: string;
    type: 'addition' | 'omission';
    amount: number;
    approved: boolean;
  }[];
  grossValuation: number;
  retentionPercentage: number;
  retentionAmount: number;
  previousCertificates: number;
  netAmount: number;
  contractorNotes: string;
  supportingDocuments: string[];
}

export default function CreateValuation() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [boqItems, setBOQItems] = useState<BOQItem[]>([]);
  const [valuationData, setValuationData] = useState<ValuationData>({
    projectId: 'fitzgerald-gardens',
    valuationNumber: 10,
    periodFrom: new Date('2025-07-01'),
    periodTo: new Date('2025-07-31'),
    workCompleted: [],
    materialsOnSite: [],
    variations: [],
    grossValuation: 0,
    retentionPercentage: 5.0,
    retentionAmount: 0,
    previousCertificates: 8687500,
    netAmount: 0,
    contractorNotes: '',
    supportingDocuments: []
  });

  useEffect(() => {
    // Load BOQ items for the project
    const loadBOQItems = async () => {
      try {
        // Mock BOQ data based on Fitzgerald Gardens project
        const mockBOQItems: BOQItem[] = [
          {
            id: 'boq-001',
            code: '01.001',
            description: 'Excavation for foundations',
            unit: 'm³',
            quantity: 2400,
            rate: 45.00,
            previousQuantity: 2400,
            thisMonthQuantity: 0,
            cumulativeQuantity: 2400,
            amount: 0
          },
          {
            id: 'boq-002',
            code: '02.001',
            description: 'Concrete foundations',
            unit: 'm³',
            quantity: 850,
            rate: 180.00,
            previousQuantity: 850,
            thisMonthQuantity: 0,
            cumulativeQuantity: 850,
            amount: 0
          },
          {
            id: 'boq-003',
            code: '03.001',
            description: 'Block work to ground floor',
            unit: 'm²',
            quantity: 1200,
            rate: 95.00,
            previousQuantity: 1200,
            thisMonthQuantity: 0,
            cumulativeQuantity: 1200,
            amount: 0
          },
          {
            id: 'boq-004',
            code: '04.001',
            description: 'Structural steel frame',
            unit: 'tonnes',
            quantity: 145,
            rate: 1850.00,
            previousQuantity: 125,
            thisMonthQuantity: 20,
            cumulativeQuantity: 145,
            amount: 37000
          },
          {
            id: 'boq-005',
            code: '05.001',
            description: 'Precast concrete panels',
            unit: 'm²',
            quantity: 2800,
            rate: 125.00,
            previousQuantity: 1800,
            thisMonthQuantity: 1000,
            cumulativeQuantity: 2800,
            amount: 125000
          },
          {
            id: 'boq-006',
            code: '06.001',
            description: 'Roofing and waterproofing',
            unit: 'm²',
            quantity: 1600,
            rate: 85.00,
            previousQuantity: 400,
            thisMonthQuantity: 800,
            cumulativeQuantity: 1200,
            amount: 68000
          },
          {
            id: 'boq-007',
            code: '07.001',
            description: 'Windows and doors',
            unit: 'No.',
            quantity: 180,
            rate: 850.00,
            previousQuantity: 80,
            thisMonthQuantity: 60,
            cumulativeQuantity: 140,
            amount: 51000
          },
          {
            id: 'boq-008',
            code: '08.001',
            description: 'Internal partitions',
            unit: 'm²',
            quantity: 3200,
            rate: 65.00,
            previousQuantity: 1200,
            thisMonthQuantity: 800,
            cumulativeQuantity: 2000,
            amount: 52000
          }
        ];

        setBOQItems(mockBOQItems);
        setValuationData(prev => ({
          ...prev,
          workCompleted: mockBOQItems
        }));
      } catch (error) {
        console.error('Error loading BOQ items:', error);
        toast({
          title: "Error",
          description: "Failed to load BOQ items",
          variant: "destructive",
        });
      }
    };

    loadBOQItems();
  }, [toast]);

  useEffect(() => {
    // Calculate gross valuation whenever work completed changes
    const grossValuation = valuationData.workCompleted.reduce((sum, item) => sum + item.amount, 0);
    const retentionAmount = (grossValuation * valuationData.retentionPercentage) / 100;
    const netAmount = grossValuation - retentionAmount - valuationData.previousCertificates;

    setValuationData(prev => ({
      ...prev,
      grossValuation,
      retentionAmount,
      netAmount: Math.max(0, netAmount) // Ensure net amount is not negative
    }));
  }, [valuationData.workCompleted, valuationData.retentionPercentage, valuationData.previousCertificates]);

  const updateBOQItem = (index: number, field: keyof BOQItem, value: number) => {
    const updatedItems = [...valuationData.workCompleted];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };

    // Recalculate cumulative quantity and amount
    if (field === 'thisMonthQuantity') {
      updatedItems[index].cumulativeQuantity = updatedItems[index].previousQuantity + value;
      updatedItems[index].amount = value * updatedItems[index].rate;
    }

    setValuationData(prev => ({
      ...prev,
      workCompleted: updatedItems
    }));
  };

  const addMaterialOnSite = () => {
    setValuationData(prev => ({
      ...prev,
      materialsOnSite: [
        ...prev.materialsOnSite,
        { description: '', quantity: 0, unit: '', value: 0 }
      ]
    }));
  };

  const updateMaterialOnSite = (index: number, field: string, value: any) => {
    const updatedMaterials = [...valuationData.materialsOnSite];
    updatedMaterials[index] = {
      ...updatedMaterials[index],
      [field]: value
    };
    setValuationData(prev => ({
      ...prev,
      materialsOnSite: updatedMaterials
    }));
  };

  const addVariation = () => {
    setValuationData(prev => ({
      ...prev,
      variations: [
        ...prev.variations,
        { description: '', type: 'addition', amount: 0, approved: false }
      ]
    }));
  };

  const updateVariation = (index: number, field: string, value: any) => {
    const updatedVariations = [...valuationData.variations];
    updatedVariations[index] = {
      ...updatedVariations[index],
      [field]: value
    };
    setValuationData(prev => ({
      ...prev,
      variations: updatedVariations
    }));
  };

  const saveDraft = async () => {
    setLoading(true);
    try {
      // In production, save to database
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: "Draft Saved",
        description: "Valuation draft has been saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save draft",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const submitValuation = async () => {
    setLoading(true);
    try {
      // Validate required fields
      if (valuationData.workCompleted.length === 0) {
        throw new Error('Please add at least one work item');
      }

      if (!valuationData.contractorNotes.trim()) {
        throw new Error('Please add contractor notes');
      }

      // In production, submit to API
      const response = await fetch('/api/valuations/contractor/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...valuationData,
          status: 'submitted',
          submittedAt: new Date(),
          submittedBy: 'John Murphy' // Would get from auth context
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit valuation');
      }

      toast({
        title: "Valuation Submitted",
        description: `Valuation #${valuationData.valuationNumber} for ${valuationData.netAmount.toLocaleString('en-IE', { style: 'currency', currency: 'EUR' })} has been submitted for QS review.`,
      });

      // Redirect to contractor portal
      router.push('/contractor');
    } catch (error) {
      console.error('Error submitting valuation:', error);
      toast({
        title: "Submission Error",
        description: error instanceof Error ? error.message : "Failed to submit valuation",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Submit Monthly Valuation</h1>
                <p className="text-gray-600">Valuation #{valuationData.valuationNumber} - Fitzgerald Gardens</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={saveDraft}
                disabled={loading}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button
                onClick={submitValuation}
                disabled={loading}
              >
                <Send className="h-4 w-4 mr-2" />
                Submit for Review
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Valuation Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Valuation Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">Gross Valuation</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(valuationData.grossValuation)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Retention ({valuationData.retentionPercentage}%)</p>
                <p className="text-2xl font-bold text-orange-600">
                  -{formatCurrency(valuationData.retentionAmount)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Previous Certificates</p>
                <p className="text-2xl font-bold text-gray-600">
                  -{formatCurrency(valuationData.previousCertificates)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Net Amount Due</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(valuationData.netAmount)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Work Completed */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Work Completed This Month
            </CardTitle>
            <CardDescription>
              Update quantities for work completed during {valuationData.periodFrom.toLocaleDateString()} - {valuationData.periodTo.toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Code</th>
                    <th className="text-left p-2">Description</th>
                    <th className="text-left p-2">Unit</th>
                    <th className="text-left p-2">Rate</th>
                    <th className="text-left p-2">Previous</th>
                    <th className="text-left p-2">This Month</th>
                    <th className="text-left p-2">Cumulative</th>
                    <th className="text-left p-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {valuationData.workCompleted.map((item, index) => (
                    <tr key={item.id} className="border-b">
                      <td className="p-2 font-mono text-sm">{item.code}</td>
                      <td className="p-2">{item.description}</td>
                      <td className="p-2">{item.unit}</td>
                      <td className="p-2">{formatCurrency(item.rate)}</td>
                      <td className="p-2">{item.previousQuantity.toLocaleString()}</td>
                      <td className="p-2">
                        <Input
                          type="number"
                          value={item.thisMonthQuantity}
                          onChange={(e) => updateBOQItem(index, 'thisMonthQuantity', parseFloat(e.target.value) || 0)}
                          className="w-24"
                          min="0"
                          step="0.01"
                        />
                      </td>
                      <td className="p-2">{item.cumulativeQuantity.toLocaleString()}</td>
                      <td className="p-2 font-medium">{formatCurrency(item.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Materials on Site */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Materials on Site
            </CardTitle>
            <CardDescription>
              Materials delivered but not yet incorporated into the works
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {valuationData.materialsOnSite.map((material, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                  <div>
                    <Label>Description</Label>
                    <Input
                      value={material.description}
                      onChange={(e) => updateMaterialOnSite(index, 'description', e.target.value)}
                      placeholder="Material description"
                    />
                  </div>
                  <div>
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      value={material.quantity}
                      onChange={(e) => updateMaterialOnSite(index, 'quantity', parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <Label>Unit</Label>
                    <Input
                      value={material.unit}
                      onChange={(e) => updateMaterialOnSite(index, 'unit', e.target.value)}
                      placeholder="e.g. m³, tonnes"
                    />
                  </div>
                  <div>
                    <Label>Value</Label>
                    <Input
                      type="number"
                      value={material.value}
                      onChange={(e) => updateMaterialOnSite(index, 'value', parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={addMaterialOnSite}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Material on Site
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Variations */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Variations
            </CardTitle>
            <CardDescription>
              Approved variations and change orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {valuationData.variations.map((variation, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                  <div className="md:col-span-2">
                    <Label>Description</Label>
                    <Textarea
                      value={variation.description}
                      onChange={(e) => updateVariation(index, 'description', e.target.value)}
                      placeholder="Variation description"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label>Type</Label>
                    <Select
                      value={variation.type}
                      onValueChange={(value) => updateVariation(index, 'type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="addition">Addition</SelectItem>
                        <SelectItem value="omission">Omission</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Amount</Label>
                    <Input
                      type="number"
                      value={variation.amount}
                      onChange={(e) => updateVariation(index, 'amount', parseFloat(e.target.value) || 0)}
                      step="0.01"
                    />
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={addVariation}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Variation
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Contractor Notes */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Contractor Notes
            </CardTitle>
            <CardDescription>
              Additional information for the Quantity Surveyor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={valuationData.contractorNotes}
              onChange={(e) => setValuationData(prev => ({ ...prev, contractorNotes: e.target.value }))}
              placeholder="Provide details about work completed, any issues encountered, quality of work, weather conditions, or other relevant information..."
              rows={6}
              className="w-full"
            />
          </CardContent>
        </Card>

        {/* Submit Actions */}
        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={() => router.push('/contractor')}
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={saveDraft}
            disabled={loading}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button
            onClick={submitValuation}
            disabled={loading}
          >
            <Send className="h-4 w-4 mr-2" />
            Submit for Review
          </Button>
        </div>
      </div>
    </div>
  );
}