import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'

// Enhanced API endpoint for comprehensive project management
// Handles company details, phases, and complete project information

interface CompanyDetails {
  id?: string
  name: string
  tradingName?: string
  companyType: 'LIMITED_COMPANY' | 'PLC' | 'LLP' | 'PARTNERSHIP' | 'SOLE_TRADER' | 'CHARITY' | 'OTHER'
  registrationNumber?: string
  vatNumber?: string
  vatStatus: 'REGISTERED' | 'NOT_REGISTERED' | 'EXEMPT' | 'PENDING'
  registeredAddress: {
    line1: string
    line2?: string
    city: string
    county?: string
    postcode?: string
    country: string
  }
  primaryEmail: string
  secondaryEmail?: string
  primaryPhone: string
  secondaryPhone?: string
  website?: string
  authorizedShare?: number
  issuedShare?: number
  currency: string
  bankName?: string
  accountName?: string
  accountNumber?: string
  sortCode?: string
  iban?: string
  insurancePolicyNumber?: string
  insuranceProvider?: string
  insuranceExpiry?: string
  professionalIndemnity?: number
  publicLiability?: number
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

interface ProjectData {
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
  company?: CompanyDetails
  phases: ProjectPhase[]
}

// Mock database service - replace with actual database calls
class ProjectDataService {
  private static instance: ProjectDataService
  private projectData: Map<string, ProjectData> = new Map()

  static getInstance(): ProjectDataService {
    if (!ProjectDataService.instance) {
      ProjectDataService.instance = new ProjectDataService()
    }
    return ProjectDataService.instance
  }

  private constructor() {
    // Initialize with Fitzgerald Gardens data
    this.projectData.set('fitzgerald-gardens', {
      id: 'fitzgerald-gardens',
      name: 'Fitzgerald Gardens',
      description: 'Premium residential development in Drogheda, Co. Louth',
      projectCode: 'FG-2025',
      totalEstimatedCost: 45000000,
      totalEstimatedUnits: 96,
      planningReference: 'DCC-2024/FG001',
      planningStatus: 'APPROVED',
      estimatedStartDate: '2024-01-15',
      estimatedEndDate: '2026-12-31',
      actualStartDate: '2024-02-01',
      overallStatus: 'ACTIVE',
      completionPercentage: 68,
      company: {
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
      phases: [
        {
          id: 'phase-1',
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
          id: 'phase-2a',
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
          id: 'phase-2b',
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
  }

  async getProject(id: string): Promise<ProjectData | null> {
    // In a real application, this would query the database
    return this.projectData.get(id) || null
  }

  async updateProject(id: string, data: ProjectData): Promise<boolean> {
    try {
      // Validate data
      if (!data.name || !data.company) {
        throw new Error('Missing required fields')
      }

      // Add timestamps in real implementation
      const updatedData = {
        ...data,
        id,
        updated: new Date().toISOString()
      }

      // In a real application, this would update the database
      this.projectData.set(id, updatedData)

      // Log the update for audit purposes
      console.log(`Project ${id} updated:`, {
        name: data.name,
        company: data.company.name,
        phases: data.phases.length,
        timestamp: new Date().toISOString()
      })

      return true
    } catch (error) {
      console.error('Failed to update project:', error)
      return false
    }
  }

  async createProject(data: ProjectData): Promise<string | null> {
    try {
      const id = data.projectCode?.toLowerCase().replace(/[^a-z0-9]/g, '-') || 
                 data.name.toLowerCase().replace(/[^a-z0-9]/g, '-')
      
      const projectData = {
        ...data,
        id,
        created: new Date().toISOString(),
        updated: new Date().toISOString()
      }

      this.projectData.set(id, projectData)
      return id
    } catch (error) {
      console.error('Failed to create project:', error)
      return null
    }
  }
}

// GET - Retrieve comprehensive project data
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params
    const service = ProjectDataService.getInstance()
    
    const project = await service.getProject(projectId)
    
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: project
    })
  } catch (error) {
    console.error('GET /api/projects/[id]/comprehensive error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update comprehensive project data
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params
    const data: ProjectData = await request.json()
    
    // Validate required fields
    if (!data.name || !data.company) {
      return NextResponse.json(
        { error: 'Missing required fields: name, company' },
        { status: 400 }
      )
    }

    // Validate company data
    if (!data.company.name || !data.company.registeredAddress) {
      return NextResponse.json(
        { error: 'Missing required company information' },
        { status: 400 }
      )
    }

    // Validate phases
    if (!Array.isArray(data.phases)) {
      return NextResponse.json(
        { error: 'Phases must be an array' },
        { status: 400 }
      )
    }

    const service = ProjectDataService.getInstance()
    const success = await service.updateProject(projectId, data)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update project' },
        { status: 500 }
      )
    }

    // Return updated data
    const updatedProject = await service.getProject(projectId)
    
    return NextResponse.json({
      success: true,
      message: 'Project updated successfully',
      data: updatedProject
    })
  } catch (error) {
    console.error('PUT /api/projects/[id]/comprehensive error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create new comprehensive project
export async function POST(request: NextRequest) {
  try {
    const data: ProjectData = await request.json()
    
    // Validate required fields
    if (!data.name || !data.company) {
      return NextResponse.json(
        { error: 'Missing required fields: name, company' },
        { status: 400 }
      )
    }

    const service = ProjectDataService.getInstance()
    const projectId = await service.createProject(data)
    
    if (!projectId) {
      return NextResponse.json(
        { error: 'Failed to create project' },
        { status: 500 }
      )
    }

    const createdProject = await service.getProject(projectId)
    
    return NextResponse.json({
      success: true,
      message: 'Project created successfully',
      data: createdProject
    }, { status: 201 })
  } catch (error) {
    console.error('POST /api/projects/comprehensive error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH - Partial update of project data
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params
    const updates = await request.json()
    
    const service = ProjectDataService.getInstance()
    const existingProject = await service.getProject(projectId)
    
    if (!existingProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Merge updates with existing data
    const updatedProject = {
      ...existingProject,
      ...updates,
      id: projectId, // Ensure ID doesn't change
      updated: new Date().toISOString()
    }

    const success = await service.updateProject(projectId, updatedProject)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update project' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Project updated successfully',
      data: updatedProject
    })
  } catch (error) {
    console.error('PATCH /api/projects/[id]/comprehensive error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Remove project (soft delete in production)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params
    
    // In a real application, this would be a soft delete
    // For now, we'll just return success
    
    return NextResponse.json({
      success: true,
      message: 'Project marked for deletion'
    })
  } catch (error) {
    console.error('DELETE /api/projects/[id]/comprehensive error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}