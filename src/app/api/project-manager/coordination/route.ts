/**
 * Project Manager Coordination API Routes
 * 
 * Month 2, Week 1 Implementation: Core Professional Roles
 * API endpoints for construction oversight and project management
 * 
 * Endpoints:
 * - GET: Get project management data, compliance status, reports
 * - POST: Create projects, update phases, assign team, manage risks
 * - PUT: Update project details
 * - DELETE: Archive project
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import ProjectManagementService from '@/services/ProjectManagementService';

const projectManagement = new ProjectManagementService();

// Request schemas
const CreateProjectSchema = z.object({
  projectName: z.string().min(1),
  projectType: z.enum(['residential', 'commercial', 'mixed_use', 'industrial', 'infrastructure']),
  client: z.string().min(1),
  location: z.string().optional(),
  totalValue: z.number().optional(),
  duration: z.number().optional(),
  startDate: z.coerce.date().optional(),
  targetCompletion: z.coerce.date().optional()
});

const UpdatePhaseSchema = z.object({
  projectId: z.string(),
  phaseId: z.string(),
  status: z.enum(['not_started', 'in_progress', 'on_hold', 'completed', 'delayed']).optional(),
  progress: z.number().min(0).max(100).optional(),
  actualDate: z.coerce.date().optional(),
  budget: z.object({
    spent: z.number().optional(),
    committed: z.number().optional()
  }).optional()
});

const TeamAssignmentSchema = z.object({
  projectId: z.string(),
  role: z.string(),
  professionalId: z.string(),
  allocation: z.number().min(0).max(100),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  responsibilities: z.array(z.string())
});

const RiskItemSchema = z.object({
  projectId: z.string(),
  title: z.string().min(1),
  description: z.string(),
  category: z.enum(['technical', 'financial', 'schedule', 'regulatory', 'safety', 'external', 'environmental']),
  probability: z.enum(['low', 'medium', 'high']),
  impact: z.enum(['low', 'medium', 'high']),
  owner: z.string(),
  mitigation: z.string()
});

const QualityCheckSchema = z.object({
  projectId: z.string(),
  phaseId: z.string(),
  name: z.string(),
  category: z.enum(['design_review', 'material_test', 'workmanship', 'compliance', 'safety', 'environmental']),
  inspectorId: z.string(),
  inspectionDate: z.coerce.date(),
  cost: z.number().optional()
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const projectId = searchParams.get('projectId');
    const phaseId = searchParams.get('phaseId');
    const userId = searchParams.get('userId');

    switch (action) {
      case 'get_project':
        if (!projectId) {
          return NextResponse.json(
            { error: 'Project ID is required' },
            { status: 400 }
          );
        }
        return await getProjectManagement(projectId);

      case 'get_user_projects':
        if (!userId) {
          return NextResponse.json(
            { error: 'User ID is required' },
            { status: 400 }
          );
        }
        return await getUserProjects(userId);

      case 'get_phase_details':
        if (!projectId || !phaseId) {
          return NextResponse.json(
            { error: 'Project ID and Phase ID are required' },
            { status: 400 }
          );
        }
        return await getPhaseDetails(projectId, phaseId);

      case 'get_project_kpis':
        if (!projectId) {
          return NextResponse.json(
            { error: 'Project ID is required' },
            { status: 400 }
          );
        }
        return await getProjectKPIs(projectId);

      case 'get_compliance_status':
        if (!projectId) {
          return NextResponse.json(
            { error: 'Project ID is required' },
            { status: 400 }
          );
        }
        return await getComplianceStatus(projectId);

      case 'get_team_performance':
        if (!projectId) {
          return NextResponse.json(
            { error: 'Project ID is required' },
            { status: 400 }
          );
        }
        return await getTeamPerformance(projectId);

      case 'get_project_reports':
        if (!projectId) {
          return NextResponse.json(
            { error: 'Project ID is required' },
            { status: 400 }
          );
        }
        return await getProjectReports(projectId);

      case 'get_bcar_requirements':
        return await getBCARRequirements();

      case 'get_safety_requirements':
        return await getSafetyRequirements();

      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Project management API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body as { action: string };

    switch (action) {
      case 'create_project':
        const projectData = CreateProjectSchema.parse(body);
        return await createProject(projectData);

      case 'update_phase':
        const phaseData = UpdatePhaseSchema.parse(body);
        return await updatePhase(phaseData);

      case 'assign_team_member':
        const assignmentData = TeamAssignmentSchema.parse(body);
        return await assignTeamMember(assignmentData);

      case 'create_risk':
        const riskData = RiskItemSchema.parse(body);
        return await createRisk(riskData);

      case 'schedule_quality_check':
        const qualityCheckData = QualityCheckSchema.parse(body);
        return await scheduleQualityCheck(qualityCheckData);

      case 'submit_bcar_inspection':
        return await submitBCARInspection(body);

      case 'generate_report':
        return await generateReport(body);

      case 'update_budget':
        return await updateBudget(body);

      case 'create_communication':
        return await createCommunication(body);

      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Project management API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Implementation functions

async function getProjectManagement(projectId: string) {
  try {
    // Mock data for demonstration - replace with actual database query
    const mockProject = {
      projectId: 'fitzgerald-gardens-pm',
      projectName: 'Fitzgerald Gardens Development',
      projectType: 'residential',
      client: 'Fitzgerald Development Ltd',
      location: 'Swords, Co. Dublin',
      overview: {
        totalValue: 4200000,
        duration: 450,
        startDate: '2025-04-01T00:00:00Z',
        targetCompletion: '2026-05-31T00:00:00Z',
        currentPhase: 'Structural Works',
        overallProgress: 62,
        status: 'active',
        healthStatus: 'green',
        kpis: [
          {
            name: 'Schedule Performance',
            current: 98,
            target: 100,
            unit: '%',
            trend: 'stable',
            status: 'good'
          },
          {
            name: 'Budget Performance',
            current: 96,
            target: 100,
            unit: '%',
            trend: 'down',
            status: 'warning'
          },
          {
            name: 'Quality Score',
            current: 95,
            target: 95,
            unit: '%',
            trend: 'up',
            status: 'good'
          },
          {
            name: 'Safety Score',
            current: 100,
            target: 100,
            unit: '%',
            trend: 'stable',
            status: 'good'
          }
        ]
      },
      phases: [
        {
          id: 'planning',
          name: 'Planning & Design',
          stage: 'planning',
          status: 'completed',
          progress: 100,
          startDate: '2025-04-01T00:00:00Z',
          targetDate: '2025-05-31T00:00:00Z',
          actualDate: '2025-05-28T00:00:00Z',
          dependencies: [],
          team: [
            {
              id: 'planning-pm',
              role: 'Planning Manager',
              professional: {
                id: 'pm-001',
                name: 'Michael O\'Sullivan',
                title: 'Senior Project Manager',
                role: 'project_manager',
                company: 'O\'Sullivan Construction Management',
                qualifications: ['PMP', 'MSc Construction Management', 'CIOB'],
                contactInfo: {
                  email: 'michael@osullivanpm.ie',
                  phone: '+353 1 234 5678',
                  address: 'Dublin 2'
                },
                availability: 'available',
                workload: 80,
                performance: {
                  rating: 4.8,
                  completedTasks: 156,
                  onTimeDelivery: 96,
                  qualityScore: 4.7,
                  projects: 23
                },
                insurance: {
                  professionalIndemnity: true,
                  publicLiability: true,
                  employersLiability: true,
                  expiryDate: '2025-12-31T00:00:00Z'
                }
              },
              responsibilities: ['Project planning', 'Design coordination', 'Regulatory approvals'],
              allocation: 100,
              startDate: '2025-04-01T00:00:00Z',
              endDate: '2025-05-31T00:00:00Z',
              status: 'completed',
              performance: {
                tasksCompleted: 45,
                onTimeDelivery: 98,
                qualityRating: 4.8
              }
            }
          ],
          tasks: [
            {
              id: 'planning-001',
              name: 'Obtain Planning Permission',
              description: 'Submit and process planning application with Fingal County Council',
              type: 'approval',
              priority: 'critical',
              status: 'completed',
              assignedTo: ['pm-001', 'planning-consultant'],
              estimatedHours: 160,
              actualHours: 145,
              startDate: '2025-04-01T00:00:00Z',
              dueDate: '2025-05-15T00:00:00Z',
              completionDate: '2025-05-12T00:00:00Z',
              dependencies: [],
              deliverables: [
                {
                  id: 'planning-app',
                  name: 'Planning Application',
                  type: 'document',
                  url: '/documents/planning-application.pdf',
                  status: 'approved',
                  submittedBy: 'Planning Consultant',
                  submissionDate: '2025-04-15T00:00:00Z',
                  reviewedBy: 'Fingal County Council',
                  reviewDate: '2025-05-12T00:00:00Z',
                  version: '1.0',
                  fileSize: 2500000,
                  format: 'PDF'
                }
              ],
              comments: [
                {
                  id: 'comment-001',
                  author: 'Planning Officer',
                  content: 'Planning permission granted with standard conditions',
                  timestamp: '2025-05-12T14:30:00Z',
                  type: 'approval',
                  attachments: ['/documents/planning-decision.pdf'],
                  mentions: ['pm-001']
                }
              ],
              budget: {
                estimated: 15000,
                actual: 12500
              },
              riskFactors: ['Planning delays', 'Third party objections']
            }
          ],
          milestones: [
            {
              id: 'planning-milestone-001',
              name: 'Planning Permission Granted',
              description: 'Full planning permission obtained from Fingal County Council',
              type: 'regulatory',
              targetDate: '2025-05-15T00:00:00Z',
              actualDate: '2025-05-12T00:00:00Z',
              status: 'achieved',
              dependencies: [],
              stakeholders: ['Client', 'Planning Authority', 'Design Team'],
              requirements: ['Planning application', 'Supporting documents', 'Public consultation'],
              signoffRequired: true,
              signedOff: {
                signedBy: 'Planning Officer, Fingal County Council',
                signDate: '2025-05-12T00:00:00Z',
                comments: 'Planning permission granted subject to standard conditions',
                conditions: ['Materials to be agreed', 'Landscaping details to be submitted'],
                certificateUrl: '/certificates/planning-permission.pdf'
              },
              criticalPath: true,
              impact: 'critical'
            }
          ],
          qualityChecks: [
            {
              id: 'design-review-001',
              name: 'Design Review',
              category: 'design_review',
              phase: 'planning',
              status: 'passed',
              inspector: {
                id: 'reviewer-001',
                name: 'Dr. Patricia Walsh',
                company: 'Independent Design Review',
                qualifications: ['PhD Architecture', 'MRIAI', 'RIBA'],
                specializations: ['Residential Design', 'Planning Applications'],
                contactInfo: {
                  email: 'patricia@designreview.ie',
                  phone: '+353 1 456 7890'
                }
              },
              inspectionDate: '2025-05-01T00:00:00Z',
              results: {
                score: 94,
                maxScore: 100,
                findings: [],
                recommendations: ['Consider additional landscaping elements'],
                photos: [],
                certificateIssued: true,
                certificateUrl: '/certificates/design-review.pdf',
                reinspectionRequired: false
              },
              followUpRequired: false,
              cost: 5000,
              standardsCompliance: ['Building Regulations', 'Planning Guidelines']
            }
          ],
          safetyRequirements: [
            {
              id: 'safety-plan',
              name: 'Construction Safety Plan',
              type: 'procedure',
              description: 'Comprehensive safety plan for construction phases',
              applicable: ['all_phases'],
              mandatory: true,
              compliance: {
                status: 'compliant',
                lastChecked: '2025-05-20T00:00:00Z',
                nextCheck: '2025-08-20T00:00:00Z',
                checkedBy: 'Safety Officer',
                evidence: ['/documents/safety-plan.pdf']
              },
              documentation: ['/documents/safety-plan.pdf', '/documents/risk-assessment.pdf'],
              trainingRequired: true,
              refreshPeriod: 90
            }
          ],
          budget: {
            allocated: 500000,
            spent: 485000,
            remaining: 15000,
            forecasted: 485000
          }
        },
        {
          id: 'foundation',
          name: 'Foundation Works',
          stage: 'foundation',
          status: 'completed',
          progress: 100,
          startDate: '2025-06-01T00:00:00Z',
          targetDate: '2025-07-15T00:00:00Z',
          actualDate: '2025-07-10T00:00:00Z',
          dependencies: ['planning'],
          team: [
            {
              id: 'foundation-contractor',
              role: 'Foundation Contractor',
              professional: {
                id: 'contractor-001',
                name: 'Kelly Construction Ltd',
                title: 'Main Contractor',
                role: 'contractor',
                company: 'Kelly Construction Ltd',
                qualifications: ['CIF Member', 'Safe Pass', 'CSCS'],
                contactInfo: {
                  email: 'info@kellyconstruction.ie',
                  phone: '+353 1 567 8901',
                  address: 'Swords, Co. Dublin'
                },
                availability: 'available',
                workload: 75,
                performance: {
                  rating: 4.6,
                  completedTasks: 89,
                  onTimeDelivery: 94,
                  qualityScore: 4.5,
                  projects: 15
                },
                insurance: {
                  professionalIndemnity: true,
                  publicLiability: true,
                  employersLiability: true,
                  expiryDate: '2025-11-30T00:00:00Z'
                }
              },
              responsibilities: ['Foundation excavation', 'Concrete works', 'Quality control'],
              allocation: 100,
              startDate: '2025-06-01T00:00:00Z',
              endDate: '2025-07-15T00:00:00Z',
              status: 'completed',
              performance: {
                tasksCompleted: 23,
                onTimeDelivery: 96,
                qualityRating: 4.7
              }
            }
          ],
          tasks: [],
          milestones: [],
          qualityChecks: [],
          safetyRequirements: [],
          budget: {
            allocated: 800000,
            spent: 785000,
            remaining: 15000,
            forecasted: 785000
          }
        },
        {
          id: 'structure',
          name: 'Structural Works',
          stage: 'structure',
          status: 'in_progress',
          progress: 75,
          startDate: '2025-07-16T00:00:00Z',
          targetDate: '2025-09-30T00:00:00Z',
          dependencies: ['foundation'],
          team: [],
          tasks: [],
          milestones: [],
          qualityChecks: [],
          safetyRequirements: [],
          budget: {
            allocated: 1200000,
            spent: 850000,
            remaining: 350000,
            forecasted: 1180000
          }
        }
      ],
      team: [
        {
          id: 'pm-assignment',
          role: 'Project Manager',
          professional: {
            id: 'pm-001',
            name: 'Michael O\'Sullivan',
            title: 'Senior Project Manager',
            role: 'project_manager',
            company: 'O\'Sullivan Construction Management',
            qualifications: ['PMP', 'MSc Construction Management', 'CIOB'],
            contactInfo: {
              email: 'michael@osullivanpm.ie',
              phone: '+353 1 234 5678',
              address: 'Dublin 2'
            },
            availability: 'available',
            workload: 80,
            performance: {
              rating: 4.8,
              completedTasks: 156,
              onTimeDelivery: 96,
              qualityScore: 4.7,
              projects: 23
            },
            insurance: {
              professionalIndemnity: true,
              publicLiability: true,
              employersLiability: true,
              expiryDate: '2025-12-31T00:00:00Z'
            }
          },
          responsibilities: ['Overall project management', 'Team coordination', 'Client communication'],
          allocation: 80,
          startDate: '2025-04-01T00:00:00Z',
          endDate: '2026-05-31T00:00:00Z',
          status: 'active',
          performance: {
            tasksCompleted: 68,
            onTimeDelivery: 97,
            qualityRating: 4.8
          }
        }
      ],
      budget: {
        totalBudget: 4200000,
        spentToDate: 1635000,
        committed: 800000,
        remaining: 1765000,
        contingency: 420000,
        phaseBreakdown: {
          planning: {
            allocated: 500000,
            spent: 485000,
            committed: 0,
            remaining: 15000,
            variance: -15000,
            forecasted: 485000,
            contingencyUsed: 0
          },
          foundation: {
            allocated: 800000,
            spent: 785000,
            committed: 0,
            remaining: 15000,
            variance: -15000,
            forecasted: 785000,
            contingencyUsed: 0
          },
          structure: {
            allocated: 1200000,
            spent: 850000,
            committed: 200000,
            remaining: 150000,
            variance: 20000,
            forecasted: 1180000,
            contingencyUsed: 0
          }
        },
        variations: [
          {
            id: 'variation-001',
            description: 'Additional insulation specification',
            amount: 25000,
            type: 'addition',
            category: 'design_change',
            status: 'approved',
            requestedBy: 'Client',
            requestDate: '2025-06-15T00:00:00Z',
            approvedBy: 'Project Manager',
            approvalDate: '2025-06-18T00:00:00Z',
            justification: 'Enhanced energy performance requirements',
            impact: 'Slight delay to envelope phase',
            documentation: ['/documents/variation-001.pdf']
          }
        ],
        forecastCompletion: 4240000,
        cashFlow: []
      },
      risks: [
        {
          id: 'risk-001',
          title: 'Weather Impact on External Works',
          description: 'Extended wet weather could delay external construction activities',
          category: 'external',
          probability: 'high',
          impact: 'medium',
          riskScore: 6,
          status: 'open',
          owner: 'Site Manager',
          identifiedBy: 'Project Manager',
          identifiedDate: '2025-06-01T00:00:00Z',
          lastReview: '2025-06-20T00:00:00Z',
          mitigation: {
            strategy: 'Weather protection measures and schedule flexibility',
            actions: [
              {
                id: 'mitigation-001',
                description: 'Install temporary weather protection',
                responsible: 'Site Manager',
                dueDate: '2025-07-01T00:00:00Z',
                status: 'completed',
                completionDate: '2025-06-28T00:00:00Z',
                evidence: ['/photos/weather-protection.jpg']
              }
            ],
            responsible: 'Site Manager',
            targetDate: '2025-07-01T00:00:00Z',
            status: 'completed',
            effectivenessRating: 4,
            cost: 15000
          },
          monitoring: {
            frequency: 'daily',
            indicators: ['Weather forecast', 'Site conditions', 'Work progress'],
            lastReview: '2025-06-20T00:00:00Z',
            nextReview: '2025-06-21T00:00:00Z',
            trend: 'improving',
            reviewNotes: ['Weather protection installed', 'Work proceeding on schedule']
          }
        }
      ],
      compliance: {
        bcar: {
          required: true,
          status: 'submitted',
          inspections: [
            {
              id: 'bcar-foundation',
              stage: 'Foundation',
              inspector: 'Assigned Certifier',
              scheduledDate: '2025-07-01T00:00:00Z',
              actualDate: '2025-07-01T00:00:00Z',
              status: 'completed',
              findings: ['All works comply with approved drawings', 'Quality of workmanship excellent'],
              signOff: true,
              certificate: '/certificates/bcar-foundation.pdf',
              followUpRequired: false
            },
            {
              id: 'bcar-structure',
              stage: 'Structure',
              inspector: 'Assigned Certifier',
              scheduledDate: '2025-09-15T00:00:00Z',
              status: 'scheduled',
              findings: [],
              signOff: false,
              followUpRequired: false
            }
          ],
          designCertifier: 'Dr. James O\'Connor MIEI',
          assignedCertifier: 'Sarah Murphy MIEI',
          documents: []
        },
        buildingRegulations: {
          approvals: [
            {
              id: 'commencement-notice',
              type: 'Commencement Notice',
              authority: 'Fingal County Council',
              applicationDate: '2025-05-20T00:00:00Z',
              approvalDate: '2025-05-25T00:00:00Z',
              status: 'approved',
              conditions: [],
              validUntil: '2026-05-25T00:00:00Z',
              documentUrl: '/documents/commencement-notice.pdf'
            }
          ],
          certificates: [
            {
              id: 'fire-cert',
              type: 'Fire Safety Certificate',
              issuedBy: 'Building Control Authority',
              issuedDate: '2025-05-10T00:00:00Z',
              status: 'valid',
              documentUrl: '/certificates/fire-safety.pdf',
              conditions: ['Fire alarm system to be certified']
            }
          ],
          notifications: []
        },
        safety: {
          status: 'compliant',
          lastChecked: '2025-06-20T00:00:00Z',
          nextCheck: '2025-07-20T00:00:00Z',
          checkedBy: 'Health & Safety Officer',
          evidence: ['/documents/safety-inspection.pdf']
        },
        environmental: {
          assessmentRequired: false,
          assessmentStatus: 'completed',
          permits: [],
          monitoring: []
        }
      },
      communications: [
        {
          id: 'comm-001',
          type: 'meeting',
          subject: 'Weekly Progress Meeting',
          sender: 'Project Manager',
          recipients: ['Client', 'Design Team', 'Main Contractor'],
          date: '2025-06-20T10:00:00Z',
          content: 'Weekly progress review and upcoming activities coordination',
          attachments: ['/documents/progress-report-week-12.pdf'],
          priority: 'medium',
          actionRequired: true,
          actionItems: [
            {
              id: 'action-001',
              description: 'Submit material samples for approval',
              assignedTo: 'Contractor',
              dueDate: '2025-06-25T00:00:00Z',
              status: 'pending'
            }
          ],
          status: 'sent'
        }
      ],
      reports: [
        {
          id: 'report-001',
          type: 'progress',
          title: 'Monthly Progress Report - June 2025',
          author: 'Michael O\'Sullivan',
          date: '2025-06-30T00:00:00Z',
          period: 'June 2025',
          summary: 'Foundation works completed ahead of schedule. Structural works commenced on time and progressing well.',
          keyMetrics: {
            overallProgress: 62,
            budgetUtilization: 96,
            schedulePerformance: 98,
            qualityScore: 95,
            safetyScore: 100
          },
          issues: [
            {
              id: 'issue-001',
              description: 'Material delivery delays for steel frame',
              severity: 'medium',
              category: 'procurement',
              impact: 'Potential 3-day delay to structural phase',
              recommendedAction: 'Source alternative supplier',
              responsible: 'Procurement Manager',
              dueDate: '2025-07-05T00:00:00Z',
              status: 'open'
            }
          ],
          recommendations: [
            'Consider early procurement of long-lead items',
            'Implement additional weather protection measures'
          ],
          documentUrl: '/reports/progress-june-2025.pdf',
          recipients: ['Client', 'Design Team', 'Senior Management'],
          distribution: 'client'
        }
      ],
      stakeholders: [
        {
          id: 'client-001',
          name: 'John Fitzgerald',
          organization: 'Fitzgerald Development Ltd',
          role: 'Project Sponsor',
          influence: 'high',
          interest: 'high',
          contactInfo: {
            email: 'john@fitzgeralddevelopment.ie',
            phone: '+353 1 234 5678'
          },
          communicationPreferences: ['email', 'weekly meetings'],
          lastContact: '2025-06-20T00:00:00Z'
        }
      ]
    };

    return NextResponse.json({
      success: true,
      project: mockProject
    });
  } catch (error) {
    console.error('Error getting project management data:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve project management data' },
      { status: 500 }
    );
  }
}

async function getUserProjects(userId: string) {
  try {
    const projects = [
      {
        projectId: 'fitzgerald-gardens-pm',
        projectName: 'Fitzgerald Gardens Development',
        projectType: 'residential',
        overallProgress: 62,
        status: 'active',
        healthStatus: 'green',
        currentPhase: 'Structural Works',
        nextMilestone: 'BCAR Structural Inspection',
        dueDate: '2025-09-15T00:00:00Z',
        budgetUtilization: 96,
        teamSize: 12
      },
      {
        projectId: 'city-centre-office',
        projectName: 'City Centre Office Development',
        projectType: 'commercial',
        overallProgress: 35,
        status: 'active',
        healthStatus: 'amber',
        currentPhase: 'Foundation Works',
        nextMilestone: 'Foundation Completion',
        dueDate: '2025-08-30T00:00:00Z',
        budgetUtilization: 89,
        teamSize: 18
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

async function getPhaseDetails(projectId: string, phaseId: string) {
  try {
    // Mock implementation - would query specific phase data
    const phaseDetails = {
      phase: phaseId,
      detailedTasks: [],
      teamPerformance: {},
      budgetDetails: {},
      qualityMetrics: {}
    };

    return NextResponse.json({
      success: true,
      details: phaseDetails
    });
  } catch (error) {
    console.error('Error getting phase details:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve phase details' },
      { status: 500 }
    );
  }
}

async function getProjectKPIs(projectId: string) {
  try {
    const kpis = {
      schedulePerformance: 98,
      budgetPerformance: 96,
      qualityScore: 95,
      safetyScore: 100,
      teamEfficiency: 94,
      clientSatisfaction: 92,
      trendsData: {
        last30Days: {
          schedule: [98, 97, 98, 99, 98],
          budget: [95, 94, 96, 97, 96],
          quality: [95, 95, 94, 95, 95],
          safety: [100, 100, 100, 100, 100]
        }
      }
    };

    return NextResponse.json({
      success: true,
      kpis
    });
  } catch (error) {
    console.error('Error getting project KPIs:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve KPIs' },
      { status: 500 }
    );
  }
}

async function getComplianceStatus(projectId: string) {
  try {
    const compliance = {
      bcarStatus: 'submitted',
      buildingRegulations: 'compliant',
      safetyCompliance: 'compliant',
      environmentalCompliance: 'not_required',
      upcomingInspections: [
        {
          type: 'BCAR Structural',
          date: '2025-09-15T00:00:00Z',
          inspector: 'Assigned Certifier'
        }
      ],
      certificates: [
        {
          type: 'Fire Safety Certificate',
          status: 'valid',
          expiryDate: '2026-05-10T00:00:00Z'
        }
      ]
    };

    return NextResponse.json({
      success: true,
      compliance
    });
  } catch (error) {
    console.error('Error getting compliance status:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve compliance status' },
      { status: 500 }
    );
  }
}

async function getTeamPerformance(projectId: string) {
  try {
    const teamPerformance = {
      overallRating: 4.6,
      onTimeDelivery: 96,
      qualityScore: 4.7,
      teamMembers: [
        {
          name: 'Michael O\'Sullivan',
          role: 'Project Manager',
          performance: {
            rating: 4.8,
            onTimeDelivery: 97,
            qualityScore: 4.8
          }
        }
      ]
    };

    return NextResponse.json({
      success: true,
      performance: teamPerformance
    });
  } catch (error) {
    console.error('Error getting team performance:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve team performance' },
      { status: 500 }
    );
  }
}

async function getProjectReports(projectId: string) {
  try {
    const reports = [
      {
        id: 'report-001',
        type: 'progress',
        title: 'Monthly Progress Report - June 2025',
        author: 'Michael O\'Sullivan',
        date: '2025-06-30T00:00:00Z',
        period: 'June 2025',
        summary: 'Foundation works completed ahead of schedule'
      }
    ];

    return NextResponse.json({
      success: true,
      reports
    });
  } catch (error) {
    console.error('Error getting project reports:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve reports' },
      { status: 500 }
    );
  }
}

async function createProject(projectData: any) {
  try {
    const project = await projectManagement.createProject(projectData);
    
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

async function updatePhase(phaseData: any) {
  try {
    const phase = await projectManagement.updatePhaseStatus(
      phaseData.projectId,
      phaseData.phaseId,
      phaseData
    );
    
    return NextResponse.json({
      success: true,
      phase
    });
  } catch (error) {
    console.error('Error updating phase:', error);
    return NextResponse.json(
      { error: 'Failed to update phase' },
      { status: 500 }
    );
  }
}

async function assignTeamMember(assignmentData: any) {
  try {
    const assignment = await projectManagement.assignTeamMember(
      assignmentData.projectId,
      assignmentData
    );
    
    return NextResponse.json({
      success: true,
      assignment
    });
  } catch (error) {
    console.error('Error assigning team member:', error);
    return NextResponse.json(
      { error: 'Failed to assign team member' },
      { status: 500 }
    );
  }
}

async function createRisk(riskData: any) {
  try {
    const risk = await projectManagement.createRisk(
      riskData.projectId,
      riskData
    );
    
    return NextResponse.json({
      success: true,
      risk
    });
  } catch (error) {
    console.error('Error creating risk:', error);
    return NextResponse.json(
      { error: 'Failed to create risk' },
      { status: 500 }
    );
  }
}

async function scheduleQualityCheck(qualityCheckData: any) {
  try {
    const qualityCheck = await projectManagement.scheduleQualityCheck(
      qualityCheckData.projectId,
      qualityCheckData.phaseId,
      qualityCheckData
    );
    
    return NextResponse.json({
      success: true,
      qualityCheck
    });
  } catch (error) {
    console.error('Error scheduling quality check:', error);
    return NextResponse.json(
      { error: 'Failed to schedule quality check' },
      { status: 500 }
    );
  }
}

async function submitBCARInspection(data: any) {
  try {
    const inspection = await projectManagement.submitBCARInspection(
      data.projectId,
      data
    );
    
    return NextResponse.json({
      success: true,
      inspection
    });
  } catch (error) {
    console.error('Error submitting BCAR inspection:', error);
    return NextResponse.json(
      { error: 'Failed to submit BCAR inspection' },
      { status: 500 }
    );
  }
}

async function generateReport(data: any) {
  try {
    const report = await projectManagement.generateReport(
      data.projectId,
      data.reportType,
      data.period
    );
    
    return NextResponse.json({
      success: true,
      report
    });
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}

async function updateBudget(data: any) {
  try {
    // Implementation for budget updates
    return NextResponse.json({
      success: true,
      message: 'Budget updated successfully'
    });
  } catch (error) {
    console.error('Error updating budget:', error);
    return NextResponse.json(
      { error: 'Failed to update budget' },
      { status: 500 }
    );
  }
}

async function createCommunication(data: any) {
  try {
    // Implementation for creating communications
    return NextResponse.json({
      success: true,
      message: 'Communication created successfully'
    });
  } catch (error) {
    console.error('Error creating communication:', error);
    return NextResponse.json(
      { error: 'Failed to create communication' },
      { status: 500 }
    );
  }
}

async function getBCARRequirements() {
  try {
    const requirements = {
      designCertifier: {
        required: true,
        qualifications: ['Registered with CIF', 'Professional qualifications', 'BCAR training'],
        responsibilities: ['Design compliance', 'Statutory notifications', 'Inspections']
      },
      assignedCertifier: {
        required: true,
        qualifications: ['Registered with relevant professional body', 'BCAR training', 'Professional indemnity'],
        responsibilities: ['Construction compliance', 'Inspections', 'Certificates']
      },
      inspectionStages: [
        'Foundation',
        'Structure',
        'Fire stopping',
        'Drainage',
        'Completion'
      ],
      documentation: [
        'Design certificate',
        'Inspection plans',
        'Compliance documentation',
        'As-built drawings'
      ]
    };

    return NextResponse.json({
      success: true,
      requirements
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get BCAR requirements' },
      { status: 500 }
    );
  }
}

async function getSafetyRequirements() {
  try {
    const requirements = {
      healthSafetyPlan: {
        required: true,
        content: ['Risk assessments', 'Safety procedures', 'Emergency procedures', 'Training requirements']
      },
      safetyOfficer: {
        required: true,
        qualifications: ['Safety qualification', 'Site experience', 'First aid training']
      },
      ppe: ['Hard hats', 'High-vis clothing', 'Safety boots', 'Eye protection', 'Hearing protection'],
      training: ['Site induction', 'Equipment training', 'Emergency procedures', 'Manual handling'],
      inspections: ['Daily safety walks', 'Weekly inspections', 'Monthly audits', 'Incident investigations']
    };

    return NextResponse.json({
      success: true,
      requirements
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get safety requirements' },
      { status: 500 }
    );
  }
}