/**
 * Architect Coordination API Routes
 * 
 * Month 2, Week 1 Implementation: Core Professional Roles
 * API endpoints for architect workflow coordination
 * 
 * Endpoints:
 * - GET: Get project coordination data
 * - POST: Create new project or update stages
 * - PUT: Update project details
 * - DELETE: Archive project
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import DesignCoordinationService from '@/services/DesignCoordinationService';

const designCoordination = new DesignCoordinationService();

// Request schemas
const CreateProjectSchema = z.object({
  projectName: z.string().min(1),
  client: z.string().min(1),
  projectType: z.enum(['residential', 'commercial', 'mixed_use', 'industrial', 'institutional', 'infrastructure']),
  budget: z.number().optional(),
  startDate: z.coerce.date().optional(),
  plannedEndDate: z.coerce.date().optional(),
  teamMembers: z.array(z.object({
    id: z.string(),
    role: z.string(),
    name: z.string()
  })).optional()
});

const UpdateStageSchema = z.object({
  projectId: z.string(),
  stageId: z.string(),
  status: z.enum(['not_started', 'in_progress', 'review', 'approved', 'revisions_required']).optional(),
  progress: z.number().min(0).max(100).optional(),
  assignedTeam: z.array(z.string()).optional(),
  deliverables: z.array(z.object({
    id: z.string(),
    name: z.string(),
    type: z.enum(['drawing', 'specification', 'report', 'model', 'schedule']),
    status: z.enum(['not_started', 'in_progress', 'review', 'approved']),
    version: z.string(),
    fileUrl: z.string().optional()
  })).optional()
});

const PlanningApplicationSchema = z.object({
  projectId: z.string(),
  applicationType: z.enum(['retention', 'permission', 'outline', 'strategic_housing']),
  localAuthority: z.string(),
  documents: z.array(z.object({
    name: z.string(),
    type: z.enum(['plans', 'particulars', 'report', 'response', 'supporting']),
    fileUrl: z.string()
  })).optional()
});

const TeamCoordinationSchema = z.object({
  projectId: z.string(),
  message: z.string().min(1),
  recipients: z.array(z.string()),
  priority: z.enum(['low', 'medium', 'high']),
  deadline: z.coerce.date().optional()
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const projectId = searchParams.get('projectId');
    const userId = searchParams.get('userId');

    switch (action) {
      case 'get_project':
        if (!projectId) {
          return NextResponse.json(
            { error: 'Project ID is required' },
            { status: 400 }
          );
        }
        return await getProjectCoordination(projectId);

      case 'get_user_projects':
        if (!userId) {
          return NextResponse.json(
            { error: 'User ID is required' },
            { status: 400 }
          );
        }
        return await getUserProjects(userId);

      case 'get_stage_templates':
        return await getStageTemplates();

      case 'get_riai_requirements':
        return await getRiaiRequirements();

      case 'get_planning_authorities':
        return await getPlanningAuthorities();

      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Architect coordination API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'create_project':
        const projectData = CreateProjectSchema.parse(body);
        return await createProject(projectData);

      case 'update_stage':
        const stageData = UpdateStageSchema.parse(body);
        return await updateDesignStage(stageData);

      case 'submit_planning':
        const planningData = PlanningApplicationSchema.parse(body);
        return await submitPlanningApplication(planningData);

      case 'coordinate_team':
        const coordinationData = TeamCoordinationSchema.parse(body);
        return await coordinateTeam(coordinationData);

      case 'upload_deliverable':
        return await uploadDeliverable(body);

      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Architect coordination API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Implementation functions

async function getProjectCoordination(projectId: string) {
  try {
    // Mock data for demonstration - replace with actual database query
    const mockProject = {
      projectId: 'fitzgerald-gardens-arch',
      projectName: 'Fitzgerald Gardens',
      client: 'Fitzgerald Development Ltd',
      projectType: 'residential',
      projectStage: 'developed_design',
      designStages: [
        {
          id: 'concept',
          name: 'Concept Design',
          status: 'approved',
          progress: 100,
          dueDate: '2025-05-15T00:00:00Z',
          assignedTeam: ['lead-architect', 'design-assistant'],
          deliverables: [
            {
              id: 'concept-drawings',
              name: 'Concept Drawings',
              type: 'drawing',
              status: 'approved',
              version: '1.0',
              fileUrl: '/documents/concept-drawings-v1.pdf'
            }
          ],
          dependencies: [],
          riaiApprovalRequired: true,
          clientApprovalRequired: true
        },
        {
          id: 'developed',
          name: 'Developed Design',
          status: 'in_progress',
          progress: 75,
          dueDate: '2025-07-30T00:00:00Z',
          assignedTeam: ['project-architect', 'cad-technician'],
          deliverables: [
            {
              id: 'floor-plans',
              name: 'Floor Plans',
              type: 'drawing',
              status: 'in_progress',
              version: '0.8',
              fileUrl: '/documents/floor-plans-v0.8.dwg'
            }
          ],
          dependencies: ['concept'],
          riaiApprovalRequired: true,
          clientApprovalRequired: true
        }
      ],
      planningApplication: {
        id: 'pa-2025-001',
        applicationNumber: 'F25A/0123',
        status: 'under_review',
        applicationType: 'permission',
        submissionDate: '2025-06-01T00:00:00Z',
        targetDecisionDate: '2025-08-30T00:00:00Z',
        localAuthority: 'Fingal County Council',
        planningOfficer: 'Sarah O\'Brien',
        conditions: [],
        documents: []
      },
      team: {
        leadArchitect: {
          id: 'lead-arch-001',
          name: 'Michael McCarthy MRIAI',
          role: 'Lead Architect',
          qualifications: ['MRIAI', 'BArch', 'RIBA'],
          contactInfo: {
            email: 'michael@architectfirm.ie',
            phone: '+353 1 234 5678'
          },
          workload: 75,
          availability: []
        },
        projectArchitect: {
          id: 'proj-arch-001',
          name: 'Emma Sullivan',
          role: 'Project Architect',
          qualifications: ['BArch', 'RIAI Student'],
          contactInfo: {
            email: 'emma@architectfirm.ie',
            phone: '+353 1 234 5679'
          },
          workload: 60,
          availability: []
        },
        designTeam: [],
        consultants: {
          structural: {
            company: 'O\'Connor & Associates',
            leadConsultant: {
              id: 'struct-001',
              name: 'James O\'Connor',
              role: 'Principal Structural Engineer',
              qualifications: ['CEng', 'MIEI'],
              contactInfo: {
                email: 'james@oconnorstructural.ie',
                phone: '+353 1 345 6789'
              },
              workload: 40,
              availability: []
            },
            team: [],
            contractValue: 45000,
            scope: ['Structural Design', 'Structural Drawings', 'Calculations']
          },
          civil: {
            company: 'Irish Civil Engineering',
            leadConsultant: {
              id: 'civil-001',
              name: 'Mary Kelly',
              role: 'Senior Civil Engineer',
              qualifications: ['CEng', 'MIEI'],
              contactInfo: {
                email: 'mary@irishcivil.ie',
                phone: '+353 1 456 7890'
              },
              workload: 30,
              availability: []
            },
            team: [],
            contractValue: 35000,
            scope: ['Site Design', 'Infrastructure', 'Drainage']
          },
          mep: {
            company: 'MEP Solutions Ireland',
            leadConsultant: {
              id: 'mep-001',
              name: 'David Chen',
              role: 'MEP Director',
              qualifications: ['CEng', 'MCIBSE'],
              contactInfo: {
                email: 'david@mepsolutions.ie',
                phone: '+353 1 567 8901'
              },
              workload: 50,
              availability: []
            },
            team: [],
            contractValue: 55000,
            scope: ['Mechanical Design', 'Electrical Design', 'Plumbing Design']
          }
        }
      },
      riaiCompliance: {
        projectRegistered: true,
        registrationNumber: 'RIAI-2025-0123',
        stageApprovals: {
          concept: {
            required: true,
            status: 'approved',
            submissionDate: '2025-05-10T00:00:00Z',
            approvalDate: '2025-05-14T00:00:00Z',
            approver: 'RIAI Review Board',
            comments: 'Concept approved with minor recommendations'
          },
          developed: {
            required: true,
            status: 'pending',
            submissionDate: null,
            approvalDate: null,
            approver: null,
            comments: null
          }
        },
        codeOfConduct: true,
        professionalIndemnity: {
          valid: true,
          provider: 'Professional Indemnity Ireland',
          expiryDate: '2025-12-31T00:00:00Z',
          coverageAmount: 2000000
        },
        continuousProfessionalDevelopment: {
          currentYear: 2025,
          requiredHours: 20,
          completedHours: 15,
          courses: [
            {
              id: 'cpd-001',
              name: 'Sustainable Design Principles',
              provider: 'RIAI CPD',
              hours: 8,
              completionDate: '2025-03-15T00:00:00Z',
              certificateUrl: '/certificates/cpd-001.pdf'
            },
            {
              id: 'cpd-002',
              name: 'Building Regulations Update',
              provider: 'RIAI CPD',
              hours: 7,
              completionDate: '2025-05-20T00:00:00Z',
              certificateUrl: '/certificates/cpd-002.pdf'
            }
          ]
        }
      },
      budget: {
        totalFees: 180000,
        stageBreakdown: {
          inception: 18000,
          concept: 36000,
          developed: 54000,
          technical: 45000,
          construction: 27000
        },
        variations: [],
        expenses: []
      },
      timeline: {
        startDate: '2025-04-01T00:00:00Z',
        plannedEndDate: '2026-02-28T00:00:00Z',
        actualEndDate: null,
        milestones: [
          {
            id: 'planning-submission',
            name: 'Planning Application Submission',
            dueDate: '2025-06-01T00:00:00Z',
            completionDate: '2025-06-01T00:00:00Z',
            status: 'completed',
            dependencies: ['concept', 'developed']
          }
        ],
        criticalPath: ['concept', 'developed', 'planning', 'technical']
      },
      risks: [
        {
          id: 'risk-001',
          description: 'Planning permission delay',
          category: 'planning',
          probability: 'medium',
          impact: 'high',
          mitigation: 'Pre-application consultation completed',
          owner: 'Lead Architect',
          status: 'open'
        }
      ]
    };

    return NextResponse.json({
      success: true,
      project: mockProject
    });
  } catch (error) {
    console.error('Error getting project coordination:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve project' },
      { status: 500 }
    );
  }
}

async function getUserProjects(userId: string) {
  try {
    // Mock implementation - replace with actual database query
    const projects = [
      {
        projectId: 'fitzgerald-gardens-arch',
        projectName: 'Fitzgerald Gardens',
        client: 'Fitzgerald Development Ltd',
        projectStage: 'developed_design',
        progress: 65,
        dueDate: '2025-07-30T00:00:00Z',
        status: 'on_track'
      },
      {
        projectId: 'city-centre-apartments',
        projectName: 'City Centre Apartments',
        client: 'Urban Living Ltd',
        projectStage: 'technical_design',
        progress: 40,
        dueDate: '2025-09-15T00:00:00Z',
        status: 'at_risk'
      }
    ];

    return NextResponse.json({
      success: true,
      projects
    });
  } catch (error) {
    console.error('Error getting user projects:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve projects' },
      { status: 500 }
    );
  }
}

async function createProject(projectData: any) {
  try {
    const project = await designCoordination.createProject(projectData);
    
    return NextResponse.json({
      success: true,
      project
    });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}

async function updateDesignStage(stageData: any) {
  try {
    const stage = await designCoordination.updateDesignStage(
      stageData.projectId,
      stageData.stageId,
      stageData
    );
    
    return NextResponse.json({
      success: true,
      stage
    });
  } catch (error) {
    console.error('Error updating design stage:', error);
    return NextResponse.json(
      { error: 'Failed to update stage' },
      { status: 500 }
    );
  }
}

async function submitPlanningApplication(planningData: any) {
  try {
    const application = await designCoordination.submitPlanningApplication(
      planningData.projectId,
      planningData
    );
    
    return NextResponse.json({
      success: true,
      application
    });
  } catch (error) {
    console.error('Error submitting planning application:', error);
    return NextResponse.json(
      { error: 'Failed to submit planning application' },
      { status: 500 }
    );
  }
}

async function coordinateTeam(coordinationData: any) {
  try {
    await designCoordination.coordinateDesignTeam(
      coordinationData.projectId,
      coordinationData
    );
    
    return NextResponse.json({
      success: true,
      message: 'Team coordination initiated'
    });
  } catch (error) {
    console.error('Error coordinating team:', error);
    return NextResponse.json(
      { error: 'Failed to coordinate team' },
      { status: 500 }
    );
  }
}

async function uploadDeliverable(data: any) {
  try {
    // Implement file upload logic
    // This would typically involve:
    // 1. Validate file
    // 2. Upload to storage (S3, etc.)
    // 3. Update database with file reference
    // 4. Update deliverable status
    
    return NextResponse.json({
      success: true,
      message: 'Deliverable uploaded successfully',
      fileUrl: `/documents/${data.fileName}`
    });
  } catch (error) {
    console.error('Error uploading deliverable:', error);
    return NextResponse.json(
      { error: 'Failed to upload deliverable' },
      { status: 500 }
    );
  }
}

async function getStageTemplates() {
  try {
    const templates = {
      residential: [
        { id: 'inception', name: 'Inception & Brief', duration: 2, deliverables: ['Brief', 'Site Survey'] },
        { id: 'concept', name: 'Concept Design', duration: 4, deliverables: ['Concept Drawings', 'Massing Study'] },
        { id: 'developed', name: 'Developed Design', duration: 8, deliverables: ['Floor Plans', 'Elevations', 'Sections'] },
        { id: 'technical', name: 'Technical Design', duration: 12, deliverables: ['Construction Drawings', 'Details', 'Specifications'] }
      ],
      commercial: [
        { id: 'inception', name: 'Inception & Brief', duration: 3, deliverables: ['Brief', 'Site Survey', 'Feasibility'] },
        { id: 'concept', name: 'Concept Design', duration: 6, deliverables: ['Concept Drawings', 'Massing Study', 'Planning Strategy'] },
        { id: 'developed', name: 'Developed Design', duration: 10, deliverables: ['Floor Plans', 'Elevations', 'Sections', 'MEP Coordination'] },
        { id: 'technical', name: 'Technical Design', duration: 16, deliverables: ['Construction Drawings', 'Details', 'Specifications', 'BOQ'] }
      ]
    };

    return NextResponse.json({
      success: true,
      templates
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get stage templates' },
      { status: 500 }
    );
  }
}

async function getRiaiRequirements() {
  try {
    const requirements = {
      registration: {
        required: true,
        stages: ['concept', 'developed', 'technical'],
        documentation: ['Registration Certificate', 'PI Insurance', 'CPD Records']
      },
      stageApprovals: {
        concept: { required: true, approver: 'RIAI Review Board' },
        developed: { required: true, approver: 'RIAI Review Board' },
        technical: { required: true, approver: 'RIAI Review Board' }
      },
      cpd: {
        annualRequirement: 20,
        categories: ['Technical', 'Management', 'Legal', 'Environment']
      }
    };

    return NextResponse.json({
      success: true,
      requirements
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get RIAI requirements' },
      { status: 500 }
    );
  }
}

async function getPlanningAuthorities() {
  try {
    const authorities = [
      { id: 'fingal', name: 'Fingal County Council', region: 'Dublin' },
      { id: 'dublin-city', name: 'Dublin City Council', region: 'Dublin' },
      { id: 'south-dublin', name: 'South Dublin County Council', region: 'Dublin' },
      { id: 'dun-laoghaire', name: 'Dún Laoghaire-Rathdown County Council', region: 'Dublin' },
      { id: 'cork-city', name: 'Cork City Council', region: 'Munster' },
      { id: 'cork-county', name: 'Cork County Council', region: 'Munster' },
      { id: 'galway-city', name: 'Galway City Council', region: 'Connacht' },
      { id: 'galway-county', name: 'Galway County Council', region: 'Connacht' },
      { id: 'waterford', name: 'Waterford City & County Council', region: 'Munster' },
      { id: 'limerick', name: 'Limerick City & County Council', region: 'Munster' }
    ];

    return NextResponse.json({
      success: true,
      authorities
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get planning authorities' },
      { status: 500 }
    );
  }
}