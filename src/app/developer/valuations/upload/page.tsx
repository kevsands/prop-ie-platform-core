'use client';

/**
 * Monthly Contractor Valuation Upload System
 * 
 * Allows main contractors to submit monthly valuations for work completed
 * Integrates with existing BOQ data and QS approval workflows
 * 
 * Irish Construction Workflow:
 * 1. Contractor submits monthly valuation with supporting docs
 * 2. QS reviews against BOQ allowances  
 * 3. QS approves/rejects with comments
 * 4. Generate interim payment certificate
 * 5. Process payment with RCT deductions
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { 
  Upload, 
  FileText, 
  Calculator, 
  Euro, 
  Calendar, 
  Building2,
  CheckCircle,
  AlertTriangle,
  Clock,
  User,
  Phone,
  Mail,
  FileImage,
  Plus,
  X,
  Save,
  Send,
  Eye,
  Download
} from 'lucide-react';

// Interfaces for valuation data
interface ContractorValuation {
  id?: string;
  projectId: string;
  contractorId: string;
  valuationNumber: number;
  period: {
    from: Date;
    to: Date;
  };
  workCompleted: WorkCompletedItem[];
  materialsOnSite: MaterialItem[];
  variations: VariationClaim[];
  grossValuation: number;
  retentionPercentage: number;
  retentionAmount: number;
  previousCertificates: number;
  netAmount: number;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'paid';
  supportingDocuments: UploadedDocument[];
  contractorNotes: string;
  submittedAt?: Date;
  submittedBy: string;
}

interface WorkCompletedItem {
  boqSectionId: string;
  boqElementId: string;
  description: string;
  quantityComplete: number;
  rate: number;
  amount: number;
  cumulativeQuantity: number;
  percentComplete: number;
  measurementSheets?: string[]; // File references
}

interface MaterialItem {
  description: string;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
  deliveryDate: Date;
  storageLocation: string;
  invoiceReference?: string;
}

interface VariationClaim {
  variationNumber: string;
  description: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  justification: string;
}

interface UploadedDocument {
  id: string;
  filename: string;
  type: 'measurement_sheet' | 'progress_photo' | 'delivery_docket' | 'variation_request' | 'other';
  uploadedAt: Date;
  fileSize: number;
  url: string;
}

interface ContractorInfo {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  rctStatus: 'exempt' | 'deductible';
  vatNumber?: string;
}

export default function ContractorValuationUpload() {
  const { toast } = useToast();
  
  // State management
  const [currentTab, setCurrentTab] = useState('work-completed');
  const [projectId] = useState('fitzgerald-gardens'); // Would come from route params
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Valuation data
  const [valuation, setValuation] = useState<ContractorValuation>({
    projectId: 'fitzgerald-gardens',
    contractorId: 'murphy-construction-001',
    valuationNumber: 9, // Next sequential number
    period: {
      from: new Date('2025-07-01'),
      to: new Date('2025-07-31')
    },
    workCompleted: [],
    materialsOnSite: [],
    variations: [],
    grossValuation: 0,
    retentionPercentage: 5.0,
    retentionAmount: 0,
    previousCertificates: 8720000, // Cumulative previous payments
    netAmount: 0,
    status: 'draft',
    supportingDocuments: [],
    contractorNotes: '',
    submittedBy: 'John Murphy'
  });

  // BOQ data for work sections
  const [boqSections, setBOQSections] = useState([
    {
      id: 'section_03',
      code: '03',
      title: 'Superstructure',
      elements: [
        {
          id: 'elem_03_001',
          code: '03.001',
          description: 'Reinforced concrete frame',
          budgetQuantity: 1250,
          budgetRate: 950,
          budgetAmount: 1187500,
          unit: 'm³',
          cumulativeQuantity: 1062.5, // 85% complete
          remainingQuantity: 187.5
        },
        {
          id: 'elem_03_002', 
          code: '03.002',
          description: 'Precast concrete elements',
          budgetQuantity: 96,
          budgetRate: 4500,
          budgetAmount: 432000,
          unit: 'No',
          cumulativeQuantity: 76.8, // 80% complete  
          remainingQuantity: 19.2
        }
      ]
    },
    {
      id: 'section_04',
      code: '04', 
      title: 'External Envelope',
      elements: [
        {
          id: 'elem_04_001',
          code: '04.001',
          description: 'Insulated facade system',
          budgetQuantity: 3200,
          budgetRate: 425,
          budgetAmount: 1360000,
          unit: 'm²',
          cumulativeQuantity: 1920, // 60% complete
          remainingQuantity: 1280
        }
      ]
    }
  ]);

  // Contractor information
  const contractorInfo: ContractorInfo = {
    id: 'murphy-construction-001',
    name: 'John Murphy',
    company: 'Murphy Construction Ltd',
    email: 'john@murphyconstruction.ie',
    phone: '+353 87 123 4567',
    rctStatus: 'deductible',
    vatNumber: 'IE1234567T'
  };

  // Calculate totals when work completed items change
  useEffect(() => {
    calculateTotals();
  }, [valuation.workCompleted, valuation.materialsOnSite, valuation.variations]);

  const calculateTotals = () => {
    const workValue = valuation.workCompleted.reduce((sum, item) => sum + item.amount, 0);
    const materialsValue = valuation.materialsOnSite.reduce((sum, item) => sum + item.amount, 0);
    const variationsValue = valuation.variations.reduce((sum, item) => 
      item.status === 'approved' ? sum + item.amount : sum, 0);
    
    const grossValuation = workValue + materialsValue + variationsValue;
    const retentionAmount = grossValuation * (valuation.retentionPercentage / 100);
    const netAmount = grossValuation - retentionAmount - valuation.previousCertificates;

    setValuation(prev => ({
      ...prev,
      grossValuation,
      retentionAmount,
      netAmount: Math.max(netAmount, 0) // Ensure non-negative
    }));
  };

  const addWorkCompletedItem = (boqElementId: string) => {
    const element = boqSections
      .flatMap(section => section.elements)
      .find(el => el.id === boqElementId);
    
    if (!element) return;

    const newItem: WorkCompletedItem = {
      boqSectionId: boqSections.find(s => s.elements.some(e => e.id === boqElementId))?.id || '',
      boqElementId: element.id,
      description: element.description,
      quantityComplete: 0,
      rate: element.budgetRate,
      amount: 0,
      cumulativeQuantity: element.cumulativeQuantity,
      percentComplete: 0
    };

    setValuation(prev => ({
      ...prev,
      workCompleted: [...prev.workCompleted, newItem]
    }));
  };

  const updateWorkCompletedItem = (index: number, updates: Partial<WorkCompletedItem>) => {
    setValuation(prev => ({
      ...prev,
      workCompleted: prev.workCompleted.map((item, i) => 
        i === index 
          ? { 
              ...item, 
              ...updates,
              amount: (updates.quantityComplete || item.quantityComplete) * (updates.rate || item.rate)
            }
          : item
      )
    }));
  };

  const removeWorkCompletedItem = (index: number) => {
    setValuation(prev => ({
      ...prev,
      workCompleted: prev.workCompleted.filter((_, i) => i !== index)
    }));
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      // Save to localStorage for now - in production would call API
      localStorage.setItem(`valuation_draft_${projectId}`, JSON.stringify(valuation));
      toast({
        title: "Draft Saved",
        description: "Your valuation has been saved as a draft."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save draft.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitValuation = async () => {
    setLoading(true);
    try {
      // Validation
      if (valuation.workCompleted.length === 0) {
        throw new Error("Please add at least one work completed item");
      }

      // Update status and submission details
      const submittedValuation = {
        ...valuation,
        status: 'submitted' as const,
        submittedAt: new Date()
      };

      // In production, would call API endpoint
      console.log('Submitting valuation:', submittedValuation);
      
      toast({
        title: "Valuation Submitted",
        description: `Valuation #${valuation.valuationNumber} has been submitted for review.`
      });

      // Clear draft
      localStorage.removeItem(`valuation_draft_${projectId}`);
      
    } catch (error) {
      toast({
        title: "Submission Failed", 
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Load draft on component mount
  useEffect(() => {
    const draftData = localStorage.getItem(`valuation_draft_${projectId}`);
    if (draftData) {
      try {
        const draft = JSON.parse(draftData);
        setValuation(draft);
      } catch (error) {
        console.error('Failed to load draft:', error);
      }
    }
  }, [projectId]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Monthly Valuation</h1>
            <p className="text-gray-600">Fitzgerald Gardens - Valuation #{valuation.valuationNumber}</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              <Calendar className="h-3 w-3 mr-1" />
              July 2025
            </Badge>
            <Badge variant="outline" className={
              valuation.status === 'draft' ? 'bg-gray-50 text-gray-700' :
              valuation.status === 'submitted' ? 'bg-yellow-50 text-yellow-700' :
              'bg-green-50 text-green-700'
            }>
              {valuation.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Contractor Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Contractor Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium">{contractorInfo.name}</p>
                  <p className="text-sm text-gray-600">{contractorInfo.company}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <p className="text-sm">{contractorInfo.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <p className="text-sm">{contractorInfo.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Valuation Form */}
        <Card>
          <CardHeader>
            <CardTitle>Valuation Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={currentTab} onValueChange={setCurrentTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="work-completed">Work Completed</TabsTrigger>
                <TabsTrigger value="materials">Materials</TabsTrigger>
                <TabsTrigger value="variations">Variations</TabsTrigger>
                <TabsTrigger value="summary">Summary</TabsTrigger>
              </TabsList>

              {/* Work Completed Tab */}
              <TabsContent value="work-completed" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Work Completed This Period</h3>
                  <Select onValueChange={addWorkCompletedItem}>
                    <SelectTrigger className="w-64">
                      <SelectValue placeholder="Add BOQ item..." />
                    </SelectTrigger>
                    <SelectContent>
                      {boqSections.map(section => (
                        <div key={section.id}>
                          <div className="px-2 py-1 text-sm font-medium text-gray-500">
                            {section.code} - {section.title}
                          </div>
                          {section.elements.map(element => (
                            <SelectItem key={element.id} value={element.id}>
                              {element.code} - {element.description}
                            </SelectItem>
                          ))}
                        </div>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  {valuation.workCompleted.map((item, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{item.description}</h4>
                          <p className="text-sm text-gray-600">
                            Cumulative: {item.cumulativeQuantity} units completed
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeWorkCompletedItem(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <Label>Quantity This Period</Label>
                          <Input
                            type="number"
                            value={item.quantityComplete}
                            onChange={(e) => updateWorkCompletedItem(index, {
                              quantityComplete: parseFloat(e.target.value) || 0
                            })}
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <Label>Rate (€)</Label>
                          <Input
                            type="number"
                            value={item.rate}
                            onChange={(e) => updateWorkCompletedItem(index, {
                              rate: parseFloat(e.target.value) || 0
                            })}
                            placeholder="0.00"
                          />
                        </div>
                        <div>
                          <Label>Amount (€)</Label>
                          <Input
                            value={item.amount.toLocaleString()}
                            readOnly
                            className="bg-gray-50"
                          />
                        </div>
                        <div>
                          <Label>% Complete</Label>
                          <div className="mt-2">
                            <Progress value={item.percentComplete} className="w-full" />
                            <p className="text-xs text-gray-500 mt-1">
                              {item.percentComplete.toFixed(1)}%
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}

                  {valuation.workCompleted.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Calculator className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p>No work items added yet</p>
                      <p className="text-sm">Select BOQ items from the dropdown above</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Materials On Site Tab */}
              <TabsContent value="materials" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Materials On Site</h3>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Material
                  </Button>
                </div>
                
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No materials on site this period</p>
                  <p className="text-sm">Add delivered materials not yet incorporated</p>
                </div>
              </TabsContent>

              {/* Variations Tab */}
              <TabsContent value="variations" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Variations & Claims</h3>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Variation
                  </Button>
                </div>
                
                <div className="text-center py-8 text-gray-500">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No variations this period</p>
                  <p className="text-sm">Add approved variations for inclusion</p>
                </div>
              </TabsContent>

              {/* Summary Tab */}
              <TabsContent value="summary" className="space-y-6">
                <h3 className="text-lg font-semibold">Valuation Summary</h3>
                
                {/* Financial Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">This Period</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span>Work Completed:</span>
                        <span className="font-medium">€{valuation.workCompleted.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Materials on Site:</span>
                        <span className="font-medium">€{valuation.materialsOnSite.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Approved Variations:</span>
                        <span className="font-medium">€{valuation.variations.filter(v => v.status === 'approved').reduce((sum, item) => sum + item.amount, 0).toLocaleString()}</span>
                      </div>
                      <hr />
                      <div className="flex justify-between font-semibold">
                        <span>Gross Valuation:</span>
                        <span>€{valuation.grossValuation.toLocaleString()}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Payment Calculation</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span>Gross Valuation:</span>
                        <span>€{valuation.grossValuation.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Less Retention ({valuation.retentionPercentage}%):</span>
                        <span className="text-red-600">-€{valuation.retentionAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Less Previous Certificates:</span>
                        <span className="text-red-600">-€{valuation.previousCertificates.toLocaleString()}</span>
                      </div>
                      <hr />
                      <div className="flex justify-between font-bold text-lg">
                        <span>Net Amount Due:</span>
                        <span className="text-green-600">€{valuation.netAmount.toLocaleString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Notes */}
                <div>
                  <Label>Additional Notes</Label>
                  <Textarea
                    value={valuation.contractorNotes}
                    onChange={(e) => setValuation(prev => ({ ...prev, contractorNotes: e.target.value }))}
                    placeholder="Add any additional notes or explanations for this valuation..."
                    rows={4}
                    className="mt-1"
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-6 border-t">
                  <div className="text-sm text-gray-600">
                    <Clock className="h-4 w-4 inline mr-1" />
                    Draft will be auto-saved
                  </div>
                  
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={handleSaveDraft}
                      disabled={saving}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {saving ? 'Saving...' : 'Save Draft'}
                    </Button>
                    
                    <Button
                      onClick={handleSubmitValuation}
                      disabled={loading || valuation.workCompleted.length === 0}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {loading ? 'Submitting...' : 'Submit for Review'}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}