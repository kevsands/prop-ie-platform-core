/**
 * Design Coordination Service
 * 
 * Month 2, Week 1 Implementation: Core Professional Roles
 * Business logic for architect workflow coordination
 * 
 * Features:
 * - Design stage lifecycle management
 * - Planning application coordination
 * - Multi-disciplinary design coordination
 * - RIAI compliance tracking and validation
 * - Client approval workflows
 * - Document version control
 */

import { PrismaClient, UserRole } from '@prisma/client';
import { EventEmitter } from 'events';
// import EcosystemNotificationService from './EcosystemNotificationService';

const prisma = new PrismaClient();

export interface DesignStage {
  id: string;
  name: string;
  status: 'not_started' | 'in_progress' | 'review' | 'approved' | 'revisions_required';
  progress: number;
  dueDate: Date;
  assignedTeam: string[];
  deliverables: Deliverable[];
  dependencies: string[];
  riaiApprovalRequired: boolean;
  clientApprovalRequired: boolean;
}

export interface Deliverable {
  id: string;
  name: string;
  type: 'drawing' | 'specification' | 'report' | 'model' | 'schedule';
  status: 'not_started' | 'in_progress' | 'review' | 'approved';
  version: string;
  fileUrl?: string;
  lastModified: Date;
  modifiedBy: string;
}

export interface PlanningApplication {
  id: string;
  applicationNumber: string;
  status: 'draft' | 'submitted' | 'under_review' | 'additional_info_requested' | 'approved' | 'rejected' | 'appeal';
  applicationType: 'retention' | 'permission' | 'outline' | 'strategic_housing';
  submissionDate?: Date;
  targetDecisionDate?: Date;
  actualDecisionDate?: Date;
  localAuthority: string;
  planningOfficer?: string;
  conditions: PlanningCondition[];
  documents: PlanningDocument[];
  publicConsultation?: {
    startDate: Date;
    endDate: Date;
    submissions: number;
  };
}

export interface PlanningCondition {
  id: string;
  conditionNumber: string;
  description: string;
  status: 'pending' | 'in_progress' | 'submitted' | 'approved';
  dueDate?: Date;
  assignedTo?: string;
  documents: string[];
}

export interface PlanningDocument {
  id: string;
  name: string;
  type: 'plans' | 'particulars' | 'report' | 'response' | 'supporting';
  uploadDate: Date;
  fileUrl: string;
  uploadedBy: string;
}

export interface RiaiCompliance {
  projectRegistered: boolean;
  registrationNumber?: string;
  stageApprovals: { [stage: string]: RiaiStageApproval };
  codeOfConduct: boolean;
  professionalIndemnity: {
    valid: boolean;
    provider: string;
    expiryDate: Date;
    coverageAmount: number;
  };
  continuousProfessionalDevelopment: {
    currentYear: number;
    requiredHours: number;
    completedHours: number;
    courses: CpdCourse[];
  };
}

export interface RiaiStageApproval {
  required: boolean;
  status: 'not_required' | 'pending' | 'submitted' | 'approved' | 'rejected';
  submissionDate?: Date;
  approvalDate?: Date;
  approver?: string;
  comments?: string;
}

export interface CpdCourse {
  id: string;
  name: string;
  provider: string;
  hours: number;
  completionDate: Date;
  certificateUrl?: string;
}

export interface ProjectCoordination {
  projectId: string;
  projectName: string;
  client: string;
  projectType: 'residential' | 'commercial' | 'mixed_use' | 'industrial' | 'institutional' | 'infrastructure';
  projectStage: 'inception' | 'feasibility' | 'concept' | 'developed_design' | 'technical_design' | 'construction' | 'completion';
  designStages: DesignStage[];
  planningApplication?: PlanningApplication;
  team: ProjectTeam;
  riaiCompliance: RiaiCompliance;
  budget: ProjectBudget;
  timeline: ProjectTimeline;
  risks: ProjectRisk[];
}

export interface ProjectTeam {
  leadArchitect: TeamMember;
  projectArchitect: TeamMember;
  designTeam: TeamMember[];
  consultants: {
    structural: ConsultantTeam;
    civil: ConsultantTeam;
    mep: ConsultantTeam;
    environmental?: ConsultantTeam;
    landscape?: ConsultantTeam;
    planning?: ConsultantTeam;
    fire?: ConsultantTeam;
    acoustic?: ConsultantTeam;
  };
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  qualifications: string[];
  contactInfo: {
    email: string;
    phone: string;
  };
  workload: number; // percentage
  availability: DateRange[];
}

export interface ConsultantTeam {
  company: string;
  leadConsultant: TeamMember;
  team: TeamMember[];
  contractValue: number;
  scope: string[];
}

export interface ProjectBudget {
  totalFees: number;
  stageBreakdown: { [stage: string]: number };
  variations: BudgetVariation[];
  expenses: ProjectExpense[];
}

export interface BudgetVariation {
  id: string;
  description: string;
  amount: number;
  status: 'proposed' | 'approved' | 'rejected';
  approvedBy?: string;
  approvalDate?: Date;
}

export interface ProjectExpense {
  id: string;
  description: string;
  amount: number;
  category: 'travel' | 'printing' | 'models' | 'consultants' | 'statutory' | 'other';
  date: Date;
  receiptUrl?: string;
}

export interface ProjectTimeline {
  startDate: Date;
  plannedEndDate: Date;
  actualEndDate?: Date;
  milestones: ProjectMilestone[];
  criticalPath: string[];
}

export interface ProjectMilestone {
  id: string;
  name: string;
  dueDate: Date;
  completionDate?: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
  dependencies: string[];
}

export interface ProjectRisk {
  id: string;
  description: string;
  category: 'technical' | 'planning' | 'financial' | 'resource' | 'external';
  probability: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  mitigation: string;
  owner: string;
  status: 'open' | 'mitigated' | 'closed';
}

export interface DateRange {
  start: Date;
  end: Date;
}

class DesignCoordinationService extends EventEmitter {
  // private notificationService: EcosystemNotificationService;

  constructor() {
    super();
    // this.notificationService = new EcosystemNotificationService();
  }

  /**
   * Create a new architectural project with initial setup
   */
  async createProject(projectData: Partial<ProjectCoordination>): Promise<ProjectCoordination> {
    try {
      // Validate project data
      if (!projectData.projectName || !projectData.client) {
        throw new Error('Project name and client are required');
      }

      // Create project with default design stages
      const project: ProjectCoordination = {
        projectId: `arch-${Date.now()}`,
        projectName: projectData.projectName,
        client: projectData.client,
        projectType: projectData.projectType || 'residential',
        projectStage: 'inception',
        designStages: this.getDefaultDesignStages(),
        team: projectData.team || this.getDefaultTeam(),
        riaiCompliance: this.getDefaultRiaiCompliance(),
        budget: projectData.budget || this.getDefaultBudget(),
        timeline: projectData.timeline || this.getDefaultTimeline(),
        risks: []
      };

      // Save to database (implement with actual Prisma operations)
      // const savedProject = await prisma.project.create({
      //   data: {
      //     id: project.projectId,
      //     name: project.projectName,
      //     // ... other fields
      //   }
      // });

      // Emit event for ecosystem coordination
      this.emit('project_created', project);

      // Send notifications to team members
      // await this.notificationService.sendNotification({
      //   type: 'project_created',
      //   recipients: [project.team.leadArchitect.id],
      //   data: {
      //     projectId: project.projectId,
      //     projectName: project.projectName,
      //     client: project.client
      //   }
      // });

      return project;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }

  /**
   * Update design stage status and trigger workflow events
   */
  async updateDesignStage(
    projectId: string, 
    stageId: string, 
    updates: Partial<DesignStage>
  ): Promise<DesignStage> {
    try {
      // Get current project
      const project = await this.getProject(projectId);
      if (!project) {
        throw new Error('Project not found');
      }

      // Find and update stage
      const stageIndex = project.designStages.findIndex(s => s.id === stageId);
      if (stageIndex === -1) {
        throw new Error('Design stage not found');
      }

      const currentStage = project.designStages[stageIndex];
      const updatedStage = { ...currentStage, ...updates };

      // Validate stage progression
      if (updates.status) {
        await this.validateStageProgression(project, updatedStage, updates.status);
      }

      // Update stage
      project.designStages[stageIndex] = updatedStage;

      // Save to database
      // await prisma.designStage.update({
      //   where: { id: stageId },
      //   data: updates
      // });

      // Handle stage completion
      if (updates.status === 'approved') {
        await this.handleStageCompletion(project, updatedStage);
      }

      // Send notifications
      // await this.notificationService.sendNotification({
      //   type: 'stage_updated',
      //   recipients: updatedStage.assignedTeam,
      //   data: {
      //     projectId,
      //     stageName: updatedStage.name,
      //     status: updatedStage.status
      //   }
      // });

      this.emit('stage_updated', { projectId, stage: updatedStage });

      return updatedStage;
    } catch (error) {
      console.error('Error updating design stage:', error);
      throw error;
    }
  }

  /**
   * Submit planning application
   */
  async submitPlanningApplication(
    projectId: string,
    applicationData: Partial<PlanningApplication>
  ): Promise<PlanningApplication> {
    try {
      const project = await this.getProject(projectId);
      if (!project) {
        throw new Error('Project not found');
      }

      // Validate submission requirements
      await this.validatePlanningSubmission(project);

      const application: PlanningApplication = {
        id: `pa-${projectId}-${Date.now()}`,
        applicationNumber: applicationData.applicationNumber || `DRAFT-${Date.now()}`,
        status: 'submitted',
        applicationType: applicationData.applicationType || 'permission',
        submissionDate: new Date(),
        targetDecisionDate: new Date(Date.now() + (8 * 7 * 24 * 60 * 60 * 1000)), // 8 weeks
        localAuthority: applicationData.localAuthority || '',
        conditions: [],
        documents: applicationData.documents || []
      };

      // Save to database
      // await prisma.planningApplication.create({
      //   data: application
      // });

      // Update project
      project.planningApplication = application;

      // Emit event
      this.emit('planning_submitted', { projectId, application });

      // Send notifications
      // await this.notificationService.sendNotification({
      //   type: 'planning_submitted',
      //   recipients: [project.team.leadArchitect.id],
      //   data: {
      //     projectId,
      //     applicationNumber: application.applicationNumber,
      //     localAuthority: application.localAuthority
      //   }
      // });

      return application;
    } catch (error) {
      console.error('Error submitting planning application:', error);
      throw error;
    }
  }

  /**
   * Update RIAI compliance status
   */
  async updateRiaiCompliance(
    projectId: string,
    complianceUpdates: Partial<RiaiCompliance>
  ): Promise<RiaiCompliance> {
    try {
      const project = await this.getProject(projectId);
      if (!project) {
        throw new Error('Project not found');
      }

      // Update compliance data
      project.riaiCompliance = { ...project.riaiCompliance, ...complianceUpdates };

      // Validate compliance
      const complianceStatus = await this.validateRiaiCompliance(project.riaiCompliance);

      // Save to database
      // await prisma.riaiCompliance.update({
      //   where: { projectId },
      //   data: complianceUpdates
      // });

      // Send notifications for compliance issues
      if (!complianceStatus.isCompliant) {
        // await this.notificationService.sendNotification({
        //   type: 'compliance_issue',
        //   recipients: [project.team.leadArchitect.id],
        //   data: {
        //     projectId,
        //     issues: complianceStatus.issues
        //   }
        // });
      }

      this.emit('compliance_updated', { projectId, compliance: project.riaiCompliance });

      return project.riaiCompliance;
    } catch (error) {
      console.error('Error updating RIAI compliance:', error);
      throw error;
    }
  }

  /**
   * Coordinate multi-disciplinary design team
   */
  async coordinateDesignTeam(
    projectId: string,
    coordinationRequest: {
      message: string;
      recipients: UserRole[];
      priority: 'low' | 'medium' | 'high';
      deadline?: Date;
    }
  ): Promise<void> {
    try {
      const project = await this.getProject(projectId);
      if (!project) {
        throw new Error('Project not found');
      }

      // Get team members for specified roles
      const recipients = this.getTeamMembersByRole(project, coordinationRequest.recipients);

      // Send coordination message
      // await this.notificationService.sendNotification({
      //   type: 'design_coordination',
      //   recipients: recipients.map(r => r.id),
      //   data: {
      //     projectId,
      //     message: coordinationRequest.message,
      //     priority: coordinationRequest.priority,
      //     deadline: coordinationRequest.deadline,
      //     from: project.team.leadArchitect.name
      //   }
      // });

      // Log coordination activity
      this.emit('team_coordinated', {
        projectId,
        recipients: coordinationRequest.recipients,
        message: coordinationRequest.message
      });

    } catch (error) {
      console.error('Error coordinating design team:', error);
      throw error;
    }
  }

  // Helper methods
  private getDefaultDesignStages(): DesignStage[] {
    return [
      {
        id: 'inception',
        name: 'Inception & Brief',
        status: 'not_started',
        progress: 0,
        dueDate: new Date(Date.now() + (2 * 7 * 24 * 60 * 60 * 1000)),
        assignedTeam: ['lead_architect'],
        deliverables: [],
        dependencies: [],
        riaiApprovalRequired: false,
        clientApprovalRequired: true
      },
      {
        id: 'concept',
        name: 'Concept Design',
        status: 'not_started',
        progress: 0,
        dueDate: new Date(Date.now() + (6 * 7 * 24 * 60 * 60 * 1000)),
        assignedTeam: ['lead_architect', 'design_team'],
        deliverables: [],
        dependencies: ['inception'],
        riaiApprovalRequired: true,
        clientApprovalRequired: true
      },
      {
        id: 'developed',
        name: 'Developed Design',
        status: 'not_started',
        progress: 0,
        dueDate: new Date(Date.now() + (12 * 7 * 24 * 60 * 60 * 1000)),
        assignedTeam: ['project_architect', 'design_team'],
        deliverables: [],
        dependencies: ['concept'],
        riaiApprovalRequired: true,
        clientApprovalRequired: true
      },
      {
        id: 'technical',
        name: 'Technical Design',
        status: 'not_started',
        progress: 0,
        dueDate: new Date(Date.now() + (20 * 7 * 24 * 60 * 60 * 1000)),
        assignedTeam: ['project_architect', 'technical_team'],
        deliverables: [],
        dependencies: ['developed'],
        riaiApprovalRequired: true,
        clientApprovalRequired: false
      }
    ];
  }

  private getDefaultTeam(): ProjectTeam {
    return {
      leadArchitect: {
        id: 'default-lead',
        name: 'Lead Architect',
        role: 'Lead Architect',
        qualifications: ['MRIAI'],
        contactInfo: { email: '', phone: '' },
        workload: 0,
        availability: []
      },
      projectArchitect: {
        id: 'default-project',
        name: 'Project Architect',
        role: 'Project Architect',
        qualifications: [],
        contactInfo: { email: '', phone: '' },
        workload: 0,
        availability: []
      },
      designTeam: [],
      consultants: {
        structural: {
          company: '',
          leadConsultant: {
            id: '',
            name: '',
            role: '',
            qualifications: [],
            contactInfo: { email: '', phone: '' },
            workload: 0,
            availability: []
          },
          team: [],
          contractValue: 0,
          scope: []
        },
        civil: {
          company: '',
          leadConsultant: {
            id: '',
            name: '',
            role: '',
            qualifications: [],
            contactInfo: { email: '', phone: '' },
            workload: 0,
            availability: []
          },
          team: [],
          contractValue: 0,
          scope: []
        },
        mep: {
          company: '',
          leadConsultant: {
            id: '',
            name: '',
            role: '',
            qualifications: [],
            contactInfo: { email: '', phone: '' },
            workload: 0,
            availability: []
          },
          team: [],
          contractValue: 0,
          scope: []
        }
      }
    };
  }

  private getDefaultRiaiCompliance(): RiaiCompliance {
    return {
      projectRegistered: false,
      stageApprovals: {},
      codeOfConduct: false,
      professionalIndemnity: {
        valid: false,
        provider: '',
        expiryDate: new Date(),
        coverageAmount: 0
      },
      continuousProfessionalDevelopment: {
        currentYear: new Date().getFullYear(),
        requiredHours: 20,
        completedHours: 0,
        courses: []
      }
    };
  }

  private getDefaultBudget(): ProjectBudget {
    return {
      totalFees: 0,
      stageBreakdown: {},
      variations: [],
      expenses: []
    };
  }

  private getDefaultTimeline(): ProjectTimeline {
    return {
      startDate: new Date(),
      plannedEndDate: new Date(Date.now() + (52 * 7 * 24 * 60 * 60 * 1000)), // 1 year
      milestones: [],
      criticalPath: []
    };
  }

  private async getProject(projectId: string): Promise<ProjectCoordination | null> {
    // Implement database lookup
    // return await prisma.project.findUnique({ where: { id: projectId } });
    return null; // Placeholder
  }

  private async validateStageProgression(
    project: ProjectCoordination,
    stage: DesignStage,
    newStatus: string
  ): Promise<void> {
    // Implement validation logic
    if (newStatus === 'approved' && stage.dependencies.length > 0) {
      // Check if dependencies are completed
      for (const depId of stage.dependencies) {
        const dependency = project.designStages.find(s => s.id === depId);
        if (!dependency || dependency.status !== 'approved') {
          throw new Error(`Dependency ${depId} must be completed first`);
        }
      }
    }
  }

  private async handleStageCompletion(project: ProjectCoordination, stage: DesignStage): Promise<void> {
    // Handle stage completion logic
    if (stage.riaiApprovalRequired) {
      // Trigger RIAI approval process
      this.emit('riai_approval_required', { project, stage });
    }

    // Check if next stage can be started
    const nextStages = project.designStages.filter(s => 
      s.dependencies.includes(stage.id) && s.status === 'not_started'
    );

    for (const nextStage of nextStages) {
      // Check if all dependencies are met
      const allDependenciesMet = nextStage.dependencies.every(depId => {
        const dep = project.designStages.find(s => s.id === depId);
        return dep && dep.status === 'approved';
      });

      if (allDependenciesMet) {
        await this.updateDesignStage(project.projectId, nextStage.id, { status: 'in_progress' });
      }
    }
  }

  private async validatePlanningSubmission(project: ProjectCoordination): Promise<void> {
    // Validate that required design stages are complete
    const requiredStages = ['concept', 'developed'];
    for (const stageId of requiredStages) {
      const stage = project.designStages.find(s => s.id === stageId);
      if (!stage || stage.status !== 'approved') {
        throw new Error(`${stageId} design stage must be completed before planning submission`);
      }
    }
  }

  private async validateRiaiCompliance(compliance: RiaiCompliance): Promise<{
    isCompliant: boolean;
    issues: string[];
  }> {
    const issues: string[] = [];

    if (!compliance.projectRegistered) {
      issues.push('Project must be registered with RIAI');
    }

    if (!compliance.codeOfConduct) {
      issues.push('Code of Conduct acknowledgment required');
    }

    if (!compliance.professionalIndemnity.valid) {
      issues.push('Valid professional indemnity insurance required');
    }

    if (compliance.continuousProfessionalDevelopment.completedHours < 
        compliance.continuousProfessionalDevelopment.requiredHours) {
      issues.push('CPD requirements not met for current year');
    }

    return {
      isCompliant: issues.length === 0,
      issues
    };
  }

  private getTeamMembersByRole(project: ProjectCoordination, roles: UserRole[]): TeamMember[] {
    const members: TeamMember[] = [];
    
    roles.forEach(role => {
      switch (role) {
        case UserRole.LEAD_ARCHITECT:
          members.push(project.team.leadArchitect);
          break;
        case UserRole.ARCHITECT:
          members.push(project.team.projectArchitect);
          break;
        // Add other role mappings as needed
      }
    });

    return members;
  }
}

export default DesignCoordinationService;