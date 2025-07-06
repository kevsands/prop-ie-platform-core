'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Euro, 
  Users, 
  Edit3, 
  Save, 
  X, 
  Plus,
  Building,
  Phone,
  Mail,
  Globe,
  FileText,
  Shield
} from 'lucide-react'

interface CompanyDetails {
  id?: string
  name: string
  tradingName?: string
  companyType: 'LIMITED_COMPANY' | 'PLC' | 'LLP' | 'PARTNERSHIP' | 'SOLE_TRADER' | 'CHARITY' | 'OTHER'
  registrationNumber?: string // CRO Number
  vatNumber?: string
  vatStatus: 'REGISTERED' | 'NOT_REGISTERED' | 'EXEMPT' | 'PENDING'
  
  // Address
  registeredAddress: {
    line1: string
    line2?: string
    city: string
    county?: string
    postcode?: string
    country: string
  }
  
  // Contact
  primaryEmail: string
  secondaryEmail?: string
  primaryPhone: string
  secondaryPhone?: string
  website?: string
  
  // Financial
  authorizedShare?: number
  issuedShare?: number
  currency: string
  
  // Banking
  bankName?: string
  accountName?: string
  accountNumber?: string
  sortCode?: string
  iban?: string
  
  // Insurance & Compliance
  insurancePolicyNumber?: string
  insuranceProvider?: string
  insuranceExpiry?: string
  professionalIndemnity?: number
  publicLiability?: number
  
  // Operational
  establishedDate?: string
  yearEnd?: string
  accountingPeriod?: string
}

interface ProjectPhase {
  id?: string
  name: string
  description?: string
  phaseNumber: number
  estimatedUnits?: number
  plannedUnits?: number
  completedUnits: number
  availableForSale: number
  estimatedCost?: number
  actualCost?: number
  estimatedSalesValue?: number
  estimatedStartDate?: string
  estimatedEndDate?: string
  actualStartDate?: string
  actualEndDate?: string
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED'
  completionPercentage: number
}

interface ProjectDetails {
  id: string
  name: string
  description?: string
  projectCode?: string
  totalEstimatedCost?: number
  totalEstimatedUnits?: number
  planningReference?: string
  planningStatus?: string
  estimatedStartDate?: string
  estimatedEndDate?: string
  actualStartDate?: string
  actualEndDate?: string
  overallStatus: 'ACTIVE' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED'
  completionPercentage: number
  
  // Company Details
  company?: CompanyDetails
  
  // Phases
  phases: ProjectPhase[]
}

interface EditableProjectOverviewProps {
  projectId: string
  initialData?: Partial<ProjectDetails>
  onSave?: (data: ProjectDetails) => Promise<boolean>
}

export default function EditableProjectOverview({ 
  projectId, 
  initialData, 
  onSave 
}: EditableProjectOverviewProps) {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('project')
  
  // Project data state
  const [projectData, setProjectData] = useState<ProjectDetails>({
    id: projectId,
    name: initialData?.name || 'Fitzgerald Gardens',
    description: initialData?.description || '',
    projectCode: initialData?.projectCode || 'FG-2025',
    totalEstimatedCost: initialData?.totalEstimatedCost || 45000000,
    totalEstimatedUnits: initialData?.totalEstimatedUnits || 96,
    planningReference: initialData?.planningReference || 'DCC-2024/FG001',
    planningStatus: initialData?.planningStatus || 'APPROVED',
    estimatedStartDate: initialData?.estimatedStartDate || '2024-01-15',
    estimatedEndDate: initialData?.estimatedEndDate || '2026-12-31',
    actualStartDate: initialData?.actualStartDate || '2024-02-01',
    overallStatus: initialData?.overallStatus || 'ACTIVE',
    completionPercentage: initialData?.completionPercentage || 68,
    company: initialData?.company || {
      name: 'Fitzgerald Developments Ltd',
      companyType: 'LIMITED_COMPANY',
      registrationNumber: '654321',
      vatNumber: 'IE9876543C',
      vatStatus: 'REGISTERED',
      registeredAddress: {
        line1: '123 Development Drive',
        line2: 'Industrial Estate',
        city: 'Drogheda',
        county: 'Louth',
        postcode: 'A92 X234',
        country: 'Ireland'
      },
      primaryEmail: 'info@fitzgeralddevelopments.ie',
      primaryPhone: '+353 41 123 4567',
      website: 'https://fitzgeralddevelopments.ie',
      currency: 'EUR',
      establishedDate: '2015-03-15',
      insuranceProvider: 'Allianz Ireland',
      professionalIndemnity: 10000000,
      publicLiability: 5000000
    },
    phases: initialData?.phases || [
      {
        name: 'Phase 1 - Foundation',
        description: 'Initial 43 units including site preparation and infrastructure',
        phaseNumber: 1,
        estimatedUnits: 43,
        plannedUnits: 43,
        completedUnits: 43,
        availableForSale: 0,
        estimatedCost: 18000000,
        actualCost: 17800000,
        estimatedSalesValue: 22000000,
        estimatedStartDate: '2024-02-01',
        estimatedEndDate: '2025-08-31',
        actualStartDate: '2024-02-01',
        actualEndDate: '2025-08-15',
        status: 'COMPLETED',
        completionPercentage: 100
      },
      {
        name: 'Phase 2a - Main Block',
        description: 'Central apartment block with 35 units',
        phaseNumber: 2,
        estimatedUnits: 35,
        plannedUnits: 35,
        completedUnits: 22,
        availableForSale: 13,
        estimatedCost: 15000000,
        actualCost: 12000000,
        estimatedSalesValue: 18500000,
        estimatedStartDate: '2025-03-01',
        estimatedEndDate: '2026-06-30',
        actualStartDate: '2025-03-15',
        status: 'IN_PROGRESS',
        completionPercentage: 65
      },
      {
        name: 'Phase 2b - Premium Units',
        description: 'Premium penthouse and duplex units',
        phaseNumber: 3,
        estimatedUnits: 18,
        plannedUnits: 18,
        completedUnits: 0,
        availableForSale: 18,
        estimatedCost: 12000000,
        estimatedSalesValue: 16000000,
        estimatedStartDate: '2026-01-01',
        estimatedEndDate: '2026-12-31',
        status: 'PLANNED',
        completionPercentage: 0
      }
    ]
  })

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const success = onSave ? await onSave(projectData) : await saveToDatabase()
      if (success) {
        setIsEditing(false)
        toast({
          title: 'Project Updated',
          description: 'All changes have been saved successfully.',
        })
      } else {
        toast({
          title: 'Save Failed',
          description: 'Unable to save changes. Please try again.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Save error:', error)
      toast({
        title: 'Error',
        description: 'An error occurred while saving.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const saveToDatabase = async (): Promise<boolean> => {
    try {
      const response = await fetch(`/api/projects/${projectId}/comprehensive`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData)
      })
      return response.ok
    } catch (error) {
      console.error('Database save error:', error)
      return false
    }
  }

  const updateProjectField = (field: keyof ProjectDetails, value: any) => {
    setProjectData(prev => ({ ...prev, [field]: value }))
  }

  const updateCompanyField = (field: keyof CompanyDetails, value: any) => {
    setProjectData(prev => ({
      ...prev,
      company: prev.company ? { ...prev.company, [field]: value } : undefined
    }))
  }

  const updateCompanyAddress = (field: string, value: string) => {
    setProjectData(prev => ({
      ...prev,
      company: prev.company ? {
        ...prev.company,
        registeredAddress: { ...prev.company.registeredAddress, [field]: value }
      } : undefined
    }))
  }

  const addPhase = () => {
    const newPhase: ProjectPhase = {
      name: `Phase ${projectData.phases.length + 1}`,
      description: '',
      phaseNumber: projectData.phases.length + 1,
      completedUnits: 0,
      availableForSale: 0,
      status: 'PLANNED',
      completionPercentage: 0
    }
    setProjectData(prev => ({
      ...prev,
      phases: [...prev.phases, newPhase]
    }))
  }

  const updatePhase = (index: number, field: keyof ProjectPhase, value: any) => {
    setProjectData(prev => ({
      ...prev,
      phases: prev.phases.map((phase, i) => 
        i === index ? { ...phase, [field]: value } : phase
      )
    }))
  }

  const removePhase = (index: number) => {
    setProjectData(prev => ({
      ...prev,
      phases: prev.phases.filter((_, i) => i !== index)
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header with Edit Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Project Overview</h1>
          <p className="text-gray-600">Comprehensive project and company management</p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(false)}
                disabled={isLoading}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                disabled={isLoading}
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Project
            </Button>
          )}
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="project">Project Details</TabsTrigger>
          <TabsTrigger value="company">Company Information</TabsTrigger>
          <TabsTrigger value="phases">Development Phases</TabsTrigger>
        </TabsList>

        {/* Project Details Tab */}
        <TabsContent value="project" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Project Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="projectName">Project Name</Label>
                  {isEditing ? (
                    <Input
                      id="projectName"
                      value={projectData.name}
                      onChange={(e) => updateProjectField('name', e.target.value)}
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{projectData.name}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="projectCode">Project Code</Label>
                  {isEditing ? (
                    <Input
                      id="projectCode"
                      value={projectData.projectCode || ''}
                      onChange={(e) => updateProjectField('projectCode', e.target.value)}
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{projectData.projectCode}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                {isEditing ? (
                  <Textarea
                    id="description"
                    value={projectData.description || ''}
                    onChange={(e) => updateProjectField('description', e.target.value)}
                    rows={3}
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">
                    {projectData.description || 'No description available'}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="totalUnits">Total Units</Label>
                  {isEditing ? (
                    <Input
                      id="totalUnits"
                      type="number"
                      value={projectData.totalEstimatedUnits || ''}
                      onChange={(e) => updateProjectField('totalEstimatedUnits', parseInt(e.target.value))}
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{projectData.totalEstimatedUnits}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="totalCost">Total Estimated Cost (€)</Label>
                  {isEditing ? (
                    <Input
                      id="totalCost"
                      type="number"
                      value={projectData.totalEstimatedCost || ''}
                      onChange={(e) => updateProjectField('totalEstimatedCost', parseInt(e.target.value))}
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">
                      €{projectData.totalEstimatedCost?.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="planningRef">Planning Reference</Label>
                  {isEditing ? (
                    <Input
                      id="planningRef"
                      value={projectData.planningReference || ''}
                      onChange={(e) => updateProjectField('planningReference', e.target.value)}
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{projectData.planningReference}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="planningStatus">Planning Status</Label>
                  {isEditing ? (
                    <Select 
                      value={projectData.planningStatus || ''} 
                      onValueChange={(value) => updateProjectField('planningStatus', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SUBMITTED">Submitted</SelectItem>
                        <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                        <SelectItem value="APPROVED">Approved</SelectItem>
                        <SelectItem value="CONDITIONAL">Conditional Approval</SelectItem>
                        <SelectItem value="REJECTED">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge variant={projectData.planningStatus === 'APPROVED' ? 'default' : 'secondary'}>
                      {projectData.planningStatus}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Estimated Start Date</Label>
                  {isEditing ? (
                    <Input
                      id="startDate"
                      type="date"
                      value={projectData.estimatedStartDate || ''}
                      onChange={(e) => updateProjectField('estimatedStartDate', e.target.value)}
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">
                      {projectData.estimatedStartDate ? new Date(projectData.estimatedStartDate).toLocaleDateString() : 'Not set'}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="endDate">Estimated End Date</Label>
                  {isEditing ? (
                    <Input
                      id="endDate"
                      type="date"
                      value={projectData.estimatedEndDate || ''}
                      onChange={(e) => updateProjectField('estimatedEndDate', e.target.value)}
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">
                      {projectData.estimatedEndDate ? new Date(projectData.estimatedEndDate).toLocaleDateString() : 'Not set'}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Company Information Tab */}
        <TabsContent value="company" className="space-y-6">
          {projectData.company && (
            <>
              {/* Basic Company Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    Company Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="companyName">Company Name</Label>
                      {isEditing ? (
                        <Input
                          id="companyName"
                          value={projectData.company.name}
                          onChange={(e) => updateCompanyField('name', e.target.value)}
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{projectData.company.name}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="tradingName">Trading Name</Label>
                      {isEditing ? (
                        <Input
                          id="tradingName"
                          value={projectData.company.tradingName || ''}
                          onChange={(e) => updateCompanyField('tradingName', e.target.value)}
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">
                          {projectData.company.tradingName || 'Same as company name'}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="companyType">Company Type</Label>
                      {isEditing ? (
                        <Select 
                          value={projectData.company.companyType} 
                          onValueChange={(value) => updateCompanyField('companyType', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="LIMITED_COMPANY">Limited Company</SelectItem>
                            <SelectItem value="PLC">Public Limited Company</SelectItem>
                            <SelectItem value="LLP">Limited Liability Partnership</SelectItem>
                            <SelectItem value="PARTNERSHIP">Partnership</SelectItem>
                            <SelectItem value="SOLE_TRADER">Sole Trader</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">
                          {projectData.company.companyType.replace('_', ' ')}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="croNumber">CRO Number</Label>
                      {isEditing ? (
                        <Input
                          id="croNumber"
                          value={projectData.company.registrationNumber || ''}
                          onChange={(e) => updateCompanyField('registrationNumber', e.target.value)}
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{projectData.company.registrationNumber}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="vatNumber">VAT Number</Label>
                      {isEditing ? (
                        <Input
                          id="vatNumber"
                          value={projectData.company.vatNumber || ''}
                          onChange={(e) => updateCompanyField('vatNumber', e.target.value)}
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{projectData.company.vatNumber}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Address Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Registered Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="addressLine1">Address Line 1</Label>
                    {isEditing ? (
                      <Input
                        id="addressLine1"
                        value={projectData.company.registeredAddress.line1}
                        onChange={(e) => updateCompanyAddress('line1', e.target.value)}
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">{projectData.company.registeredAddress.line1}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="addressLine2">Address Line 2</Label>
                    {isEditing ? (
                      <Input
                        id="addressLine2"
                        value={projectData.company.registeredAddress.line2 || ''}
                        onChange={(e) => updateCompanyAddress('line2', e.target.value)}
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">
                        {projectData.company.registeredAddress.line2 || 'N/A'}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      {isEditing ? (
                        <Input
                          id="city"
                          value={projectData.company.registeredAddress.city}
                          onChange={(e) => updateCompanyAddress('city', e.target.value)}
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{projectData.company.registeredAddress.city}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="county">County</Label>
                      {isEditing ? (
                        <Input
                          id="county"
                          value={projectData.company.registeredAddress.county || ''}
                          onChange={(e) => updateCompanyAddress('county', e.target.value)}
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{projectData.company.registeredAddress.county}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="postcode">Postcode</Label>
                      {isEditing ? (
                        <Input
                          id="postcode"
                          value={projectData.company.registeredAddress.postcode || ''}
                          onChange={(e) => updateCompanyAddress('postcode', e.target.value)}
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{projectData.company.registeredAddress.postcode}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="primaryEmail">Primary Email</Label>
                      {isEditing ? (
                        <Input
                          id="primaryEmail"
                          type="email"
                          value={projectData.company.primaryEmail}
                          onChange={(e) => updateCompanyField('primaryEmail', e.target.value)}
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{projectData.company.primaryEmail}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="primaryPhone">Primary Phone</Label>
                      {isEditing ? (
                        <Input
                          id="primaryPhone"
                          value={projectData.company.primaryPhone}
                          onChange={(e) => updateCompanyField('primaryPhone', e.target.value)}
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{projectData.company.primaryPhone}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="website">Website</Label>
                    {isEditing ? (
                      <Input
                        id="website"
                        value={projectData.company.website || ''}
                        onChange={(e) => updateCompanyField('website', e.target.value)}
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">
                        {projectData.company.website ? (
                          <a href={projectData.company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {projectData.company.website}
                          </a>
                        ) : 'Not provided'}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Insurance & Compliance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Insurance & Compliance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                      {isEditing ? (
                        <Input
                          id="insuranceProvider"
                          value={projectData.company.insuranceProvider || ''}
                          onChange={(e) => updateCompanyField('insuranceProvider', e.target.value)}
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{projectData.company.insuranceProvider}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="insuranceExpiry">Insurance Expiry</Label>
                      {isEditing ? (
                        <Input
                          id="insuranceExpiry"
                          type="date"
                          value={projectData.company.insuranceExpiry || ''}
                          onChange={(e) => updateCompanyField('insuranceExpiry', e.target.value)}
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">
                          {projectData.company.insuranceExpiry ? new Date(projectData.company.insuranceExpiry).toLocaleDateString() : 'Not set'}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="professionalIndemnity">Professional Indemnity (€)</Label>
                      {isEditing ? (
                        <Input
                          id="professionalIndemnity"
                          type="number"
                          value={projectData.company.professionalIndemnity || ''}
                          onChange={(e) => updateCompanyField('professionalIndemnity', parseInt(e.target.value))}
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">
                          €{projectData.company.professionalIndemnity?.toLocaleString()}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="publicLiability">Public Liability (€)</Label>
                      {isEditing ? (
                        <Input
                          id="publicLiability"
                          type="number"
                          value={projectData.company.publicLiability || ''}
                          onChange={(e) => updateCompanyField('publicLiability', parseInt(e.target.value))}
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">
                          €{projectData.company.publicLiability?.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Development Phases Tab */}
        <TabsContent value="phases" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Development Phases</h3>
              <p className="text-sm text-gray-600">Manage current and future development phases</p>
            </div>
            {isEditing && (
              <Button onClick={addPhase} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Phase
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {projectData.phases.map((phase, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      {isEditing ? (
                        <Input
                          value={phase.name}
                          onChange={(e) => updatePhase(index, 'name', e.target.value)}
                          className="text-lg font-semibold"
                        />
                      ) : (
                        phase.name
                      )}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        phase.status === 'COMPLETED' ? 'default' :
                        phase.status === 'IN_PROGRESS' ? 'secondary' :
                        phase.status === 'PLANNED' ? 'outline' : 'destructive'
                      }>
                        {phase.status.replace('_', ' ')}
                      </Badge>
                      {isEditing && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removePhase(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor={`description-${index}`}>Description</Label>
                    {isEditing ? (
                      <Textarea
                        id={`description-${index}`}
                        value={phase.description || ''}
                        onChange={(e) => updatePhase(index, 'description', e.target.value)}
                        rows={2}
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">{phase.description}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor={`estimatedUnits-${index}`}>Estimated Units</Label>
                      {isEditing ? (
                        <Input
                          id={`estimatedUnits-${index}`}
                          type="number"
                          value={phase.estimatedUnits || ''}
                          onChange={(e) => updatePhase(index, 'estimatedUnits', parseInt(e.target.value))}
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{phase.estimatedUnits}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor={`completedUnits-${index}`}>Completed Units</Label>
                      {isEditing ? (
                        <Input
                          id={`completedUnits-${index}`}
                          type="number"
                          value={phase.completedUnits}
                          onChange={(e) => updatePhase(index, 'completedUnits', parseInt(e.target.value))}
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{phase.completedUnits}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor={`availableForSale-${index}`}>Available for Sale</Label>
                      {isEditing ? (
                        <Input
                          id={`availableForSale-${index}`}
                          type="number"
                          value={phase.availableForSale}
                          onChange={(e) => updatePhase(index, 'availableForSale', parseInt(e.target.value))}
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{phase.availableForSale}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor={`completionPercentage-${index}`}>Completion %</Label>
                      {isEditing ? (
                        <Input
                          id={`completionPercentage-${index}`}
                          type="number"
                          min="0"
                          max="100"
                          value={phase.completionPercentage}
                          onChange={(e) => updatePhase(index, 'completionPercentage', parseInt(e.target.value))}
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{phase.completionPercentage}%</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`estimatedCost-${index}`}>Estimated Cost (€)</Label>
                      {isEditing ? (
                        <Input
                          id={`estimatedCost-${index}`}
                          type="number"
                          value={phase.estimatedCost || ''}
                          onChange={(e) => updatePhase(index, 'estimatedCost', parseInt(e.target.value))}
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">
                          €{phase.estimatedCost?.toLocaleString()}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor={`estimatedSalesValue-${index}`}>Estimated Sales Value (€)</Label>
                      {isEditing ? (
                        <Input
                          id={`estimatedSalesValue-${index}`}
                          type="number"
                          value={phase.estimatedSalesValue || ''}
                          onChange={(e) => updatePhase(index, 'estimatedSalesValue', parseInt(e.target.value))}
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">
                          €{phase.estimatedSalesValue?.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`startDate-${index}`}>Estimated Start Date</Label>
                      {isEditing ? (
                        <Input
                          id={`startDate-${index}`}
                          type="date"
                          value={phase.estimatedStartDate || ''}
                          onChange={(e) => updatePhase(index, 'estimatedStartDate', e.target.value)}
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">
                          {phase.estimatedStartDate ? new Date(phase.estimatedStartDate).toLocaleDateString() : 'Not set'}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor={`endDate-${index}`}>Estimated End Date</Label>
                      {isEditing ? (
                        <Input
                          id={`endDate-${index}`}
                          type="date"
                          value={phase.estimatedEndDate || ''}
                          onChange={(e) => updatePhase(index, 'estimatedEndDate', e.target.value)}
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">
                          {phase.estimatedEndDate ? new Date(phase.estimatedEndDate).toLocaleDateString() : 'Not set'}
                        </p>
                      )}
                    </div>
                  </div>

                  {isEditing && (
                    <div>
                      <Label htmlFor={`status-${index}`}>Phase Status</Label>
                      <Select 
                        value={phase.status} 
                        onValueChange={(value) => updatePhase(index, 'status', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PLANNED">Planned</SelectItem>
                          <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                          <SelectItem value="COMPLETED">Completed</SelectItem>
                          <SelectItem value="ON_HOLD">On Hold</SelectItem>
                          <SelectItem value="CANCELLED">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}