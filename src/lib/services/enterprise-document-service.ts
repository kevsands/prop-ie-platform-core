/**
 * Enterprise Document Management Service
 * Handles all document operations for the PROP.ie platform
 * Supports templates, workflows, automation, and compliance
 */

import { prisma } from '@/lib/prisma';
import { 
  DocumentTemplate, 
  DocumentGeneration, 
  AutomaticDocumentFiller,
  DrawingManagement,
  PlanningCompliance,
  BillOfQuantities,
  FinancialTracker,
  EnterpriseWorkflowInstance,
  WorkflowTemplate,
  DocumentCategory,
  TemplateStatus,
  ComplianceStatus,
  WorkflowStatus
} from '@prisma/client';

// ================================================================================
// DOCUMENT TEMPLATE SERVICE
// ================================================================================

export class DocumentTemplateService {
  
  /**
   * Create a new document template
   */
  async createTemplate(data: {
    name: string;
    description?: string;
    category: DocumentCategory;
    templateData: any;
    projectTypes: string[];
    createdBy: string;
    tags?: string[];
    metadata?: any;
  }): Promise<DocumentTemplate> {
    return await prisma.documentTemplate.create({
      data: {
        ...data,
        status: 'draft' as TemplateStatus,
        version: '1.0',
      }
    });
  }

  /**
   * Get templates by category with filtering
   */
  async getTemplatesByCategory(
    category: DocumentCategory,
    filters?: {
      status?: TemplateStatus;
      projectType?: string;
      limit?: number;
      offset?: number;
    }
  ): Promise<DocumentTemplate[]> {
    const where: any = { category };
    
    if (filters?.status) {
      where.status = filters.status;
    }
    
    if (filters?.projectType) {
      where.projectTypes = {
        has: filters.projectType
      };
    }

    return await prisma.documentTemplate.findMany({
      where,
      take: filters?.limit || 50,
      skip: filters?.offset || 0,
      orderBy: { createdAt: 'desc' },
      include: {
        generatedDocuments: {
          take: 5,
          orderBy: { generatedAt: 'desc' }
        },
        workflowTemplates: true
      }
    });
  }

  /**
   * Generate document from template
   */
  async generateFromTemplate(data: {
    templateId: string;
    projectId?: string;
    generatedData: any;
    generatedBy: string;
  }): Promise<DocumentGeneration> {
    return await prisma.documentGeneration.create({
      data: {
        ...data,
        status: 'draft'
      },
      include: {
        template: true
      }
    });
  }

  /**
   * Update template status
   */
  async updateTemplateStatus(templateId: string, status: TemplateStatus): Promise<DocumentTemplate> {
    return await prisma.documentTemplate.update({
      where: { id: templateId },
      data: { status }
    });
  }

  /**
   * Get template usage analytics
   */
  async getTemplateAnalytics(templateId: string): Promise<{
    totalGenerations: number;
    recentGenerations: number;
    averageCompletionTime: number | null;
    popularFields: string[];
  }> {
    const generations = await prisma.documentGeneration.findMany({
      where: { templateId },
      orderBy: { generatedAt: 'desc' }
    });

    const recentGenerations = generations.filter(
      g => g.generatedAt > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
    ).length;

    return {
      totalGenerations: generations.length,
      recentGenerations,
      averageCompletionTime: null, // Calculate based on workflow completion
      popularFields: [] // Analyze generatedData for most used fields
    };
  }
}

// ================================================================================
// AUTOMATIC DOCUMENT FILLER SERVICE
// ================================================================================

export class AutomaticDocumentFillerService {
  
  /**
   * Create automatic document filler application
   */
  async createApplication(data: {
    providerName: string;
    applicationType: string;
    projectId?: string;
    formData: any;
    estimatedCost?: string;
    estimatedTime?: string;
  }): Promise<AutomaticDocumentFiller> {
    return await prisma.automaticDocumentFiller.create({
      data: {
        ...data,
        status: 'draft'
      },
      include: {
        project: true
      }
    });
  }

  /**
   * Get applications by provider
   */
  async getApplicationsByProvider(
    providerName: string,
    projectId?: string
  ): Promise<AutomaticDocumentFiller[]> {
    const where: any = { providerName };
    if (projectId) {
      where.projectId = projectId;
    }

    return await prisma.automaticDocumentFiller.findMany({
      where,
      orderBy: { generatedAt: 'desc' },
      include: {
        project: true
      }
    });
  }

  /**
   * Submit application (mark as submitted)
   */
  async submitApplication(id: string): Promise<AutomaticDocumentFiller> {
    return await prisma.automaticDocumentFiller.update({
      where: { id },
      data: {
        status: 'submitted',
        submittedAt: new Date()
      }
    });
  }

  /**
   * Get provider statistics
   */
  async getProviderStatistics(): Promise<{
    provider: string;
    totalApplications: number;
    submittedApplications: number;
    estimatedSavings: string;
  }[]> {
    const applications = await prisma.automaticDocumentFiller.groupBy({
      by: ['providerName'],
      _count: {
        id: true
      }
    });

    return applications.map(app => ({
      provider: app.providerName,
      totalApplications: app._count.id,
      submittedApplications: 0, // Calculate submitted count
      estimatedSavings: '€2,500' // Calculate based on automated time savings
    }));
  }
}

// ================================================================================
// DRAWING MANAGEMENT SERVICE
// ================================================================================

export class DrawingManagementService {
  
  /**
   * Create new drawing entry
   */
  async createDrawing(data: {
    projectId: string;
    drawingNumber: string;
    title: string;
    category: DocumentCategory;
    subcategory?: string;
    drawingFile?: string;
    createdBy: string;
    metadata?: any;
  }): Promise<DrawingManagement> {
    return await prisma.drawingManagement.create({
      data: {
        ...data,
        revision: 'A',
        status: 'draft'
      },
      include: {
        project: true,
        revisions: true
      }
    });
  }

  /**
   * Get drawings by project and category
   */
  async getDrawingsByProject(
    projectId: string,
    category?: DocumentCategory
  ): Promise<DrawingManagement[]> {
    const where: any = { projectId };
    if (category) {
      where.category = category;
    }

    return await prisma.drawingManagement.findMany({
      where,
      orderBy: { drawingNumber: 'asc' },
      include: {
        revisions: {
          orderBy: { revisedAt: 'desc' },
          take: 5
        },
        scheduleItems: true
      }
    });
  }

  /**
   * Create drawing revision
   */
  async createRevision(data: {
    drawingId: string;
    revision: string;
    description: string;
    revisedBy: string;
    fileUrl?: string;
  }): Promise<any> {
    // Update the main drawing revision
    await prisma.drawingManagement.update({
      where: { id: data.drawingId },
      data: { 
        revision: data.revision,
        updatedAt: new Date()
      }
    });

    // Create revision history
    return await prisma.drawingRevision.create({
      data
    });
  }

  /**
   * Get drawing coordination matrix
   */
  async getCoordinationMatrix(projectId: string): Promise<{
    drawing: DrawingManagement;
    linkedDrawings: DrawingManagement[];
  }[]> {
    const drawings = await prisma.drawingManagement.findMany({
      where: { 
        projectId,
        linkedDocuments: {
          isEmpty: false
        }
      },
      include: {
        project: true
      }
    });

    const matrix = await Promise.all(
      drawings.map(async (drawing) => {
        const linkedDrawings = await prisma.drawingManagement.findMany({
          where: {
            id: {
              in: drawing.linkedDocuments
            }
          }
        });

        return {
          drawing,
          linkedDrawings
        };
      })
    );

    return matrix;
  }
}

// ================================================================================
// PLANNING COMPLIANCE SERVICE
// ================================================================================

export class PlanningComplianceService {
  
  /**
   * Create compliance requirement
   */
  async createCompliance(data: {
    projectId: string;
    complianceCategory: string;
    requirementName: string;
    description?: string;
    authority: string;
    legislation?: string;
    deadlineDate?: Date;
    responsiblePerson?: string;
  }): Promise<PlanningCompliance> {
    return await prisma.planningCompliance.create({
      data: {
        ...data,
        status: 'pending_review' as ComplianceStatus
      },
      include: {
        project: true
      }
    });
  }

  /**
   * Update compliance status and score
   */
  async updateCompliance(
    id: string,
    data: {
      status?: ComplianceStatus;
      score?: number;
      completionDate?: Date;
      notes?: string;
    }
  ): Promise<PlanningCompliance> {
    return await prisma.planningCompliance.update({
      where: { id },
      data: {
        ...data,
        lastReviewed: new Date()
      }
    });
  }

  /**
   * Get compliance by project with scoring
   */
  async getProjectCompliance(projectId: string): Promise<{
    compliance: PlanningCompliance[];
    overallScore: number;
    categoryScores: { [key: string]: number };
    overdueItems: number;
  }> {
    const compliance = await prisma.planningCompliance.findMany({
      where: { projectId },
      orderBy: { deadlineDate: 'asc' }
    });

    // Calculate overall compliance score
    const scoredItems = compliance.filter(item => item.score !== null);
    const overallScore = scoredItems.length > 0 
      ? scoredItems.reduce((sum, item) => sum + (item.score || 0), 0) / scoredItems.length
      : 0;

    // Calculate category scores
    const categoryScores: { [key: string]: number } = {};
    const categories = [...new Set(compliance.map(item => item.complianceCategory))];
    
    categories.forEach(category => {
      const categoryItems = compliance.filter(item => 
        item.complianceCategory === category && item.score !== null
      );
      if (categoryItems.length > 0) {
        categoryScores[category] = categoryItems.reduce((sum, item) => sum + (item.score || 0), 0) / categoryItems.length;
      }
    });

    // Count overdue items
    const now = new Date();
    const overdueItems = compliance.filter(item => 
      item.deadlineDate && item.deadlineDate < now && item.status !== 'compliant'
    ).length;

    return {
      compliance,
      overallScore,
      categoryScores,
      overdueItems
    };
  }

  /**
   * Generate compliance report
   */
  async generateComplianceReport(
    complianceId: string,
    reportType: string,
    generatedBy: string
  ): Promise<any> {
    const compliance = await prisma.planningCompliance.findUnique({
      where: { id: complianceId },
      include: { project: true }
    });

    if (!compliance) {
      throw new Error('Compliance record not found');
    }

    const reportData = {
      complianceId,
      projectName: compliance.project?.name,
      reportType,
      generatedAt: new Date(),
      // Add specific report data based on type
    };

    return await prisma.complianceReport.create({
      data: {
        complianceId,
        reportType,
        reportData,
        generatedBy
      }
    });
  }
}

// ================================================================================
// WORKFLOW SERVICE
// ================================================================================

export class EnterpriseWorkflowService {
  
  /**
   * Create workflow instance
   */
  async createWorkflow(data: {
    workflowTemplateId: string;
    title: string;
    description?: string;
    projectId?: string;
    documentId?: string;
    priority?: string;
    assignedTo?: string;
    createdBy: string;
    dueDate?: Date;
    budget?: number;
    tags?: string[];
  }): Promise<EnterpriseWorkflowInstance> {
    return await prisma.enterpriseWorkflowInstance.create({
      data: {
        ...data,
        status: 'pending' as WorkflowStatus,
        progress: 0
      },
      include: {
        workflowTemplate: true,
        project: true,
        document: true
      }
    });
  }

  /**
   * Update workflow progress
   */
  async updateWorkflowProgress(
    workflowId: string,
    data: {
      status?: WorkflowStatus;
      currentStage?: string;
      progress?: number;
      assignedTo?: string;
    }
  ): Promise<EnterpriseWorkflowInstance> {
    return await prisma.enterpriseWorkflowInstance.update({
      where: { id: workflowId },
      data: {
        ...data,
        updatedAt: new Date()
      }
    });
  }

  /**
   * Get active workflows by project
   */
  async getActiveWorkflows(projectId?: string): Promise<EnterpriseWorkflowInstance[]> {
    const where: any = {
      status: {
        in: ['pending', 'in_progress']
      }
    };

    if (projectId) {
      where.projectId = projectId;
    }

    return await prisma.enterpriseWorkflowInstance.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        workflowTemplate: true,
        project: true,
        document: true,
        stageHistory: {
          orderBy: { startedAt: 'desc' },
          take: 5
        }
      }
    });
  }

  /**
   * Create workflow stage history
   */
  async recordStageProgress(data: {
    workflowInstanceId: string;
    stageId: string;
    stageName: string;
    status: string;
    assignedUsers: string[];
    notes?: string;
    approvals?: any;
  }): Promise<any> {
    return await prisma.workflowStageHistory.create({
      data: {
        ...data,
        startedAt: new Date()
      }
    });
  }
}

// ================================================================================
// BILL OF QUANTITIES SERVICE
// ================================================================================

export class BillOfQuantitiesService {
  
  /**
   * Create BOQ
   */
  async createBOQ(data: {
    projectId: string;
    name: string;
    description?: string;
    categories: any;
    createdBy: string;
    currency?: string;
    taxRate?: number;
    contingency?: number;
    overhead?: number;
    profit?: number;
  }): Promise<BillOfQuantities> {
    return await prisma.billOfQuantities.create({
      data: {
        ...data,
        totals: {}, // Calculate totals from categories
        status: 'draft',
        version: '1.0'
      },
      include: {
        project: true
      }
    });
  }

  /**
   * Update BOQ calculations
   */
  async updateBOQCalculations(
    boqId: string,
    categories: any,
    totals: any
  ): Promise<BillOfQuantities> {
    return await prisma.billOfQuantities.update({
      where: { id: boqId },
      data: {
        categories,
        totals,
        updatedAt: new Date()
      }
    });
  }

  /**
   * Get BOQs by project
   */
  async getBOQsByProject(projectId: string): Promise<BillOfQuantities[]> {
    return await prisma.billOfQuantities.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
      include: {
        project: true,
        document: true
      }
    });
  }
}

// ================================================================================
// FINANCIAL TRACKER SERVICE
// ================================================================================

export class FinancialTrackerService {
  
  /**
   * Create financial tracker
   */
  async createTracker(data: {
    projectId: string;
    name: string;
    trackingType: string;
    data: any;
    currency?: string;
    period?: string;
    createdBy: string;
  }): Promise<FinancialTracker> {
    return await prisma.financialTracker.create({
      data: {
        ...data,
        status: 'active'
      },
      include: {
        project: true
      }
    });
  }

  /**
   * Update tracker data
   */
  async updateTrackerData(
    trackerId: string,
    data: any
  ): Promise<FinancialTracker> {
    return await prisma.financialTracker.update({
      where: { id: trackerId },
      data: {
        data,
        updatedAt: new Date()
      }
    });
  }

  /**
   * Get trackers by project and type
   */
  async getTrackersByProject(
    projectId: string,
    trackingType?: string
  ): Promise<FinancialTracker[]> {
    const where: any = { projectId };
    if (trackingType) {
      where.trackingType = trackingType;
    }

    return await prisma.financialTracker.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        project: true,
        document: true
      }
    });
  }
}

// ================================================================================
// EXPORT SERVICES
// ================================================================================

export const enterpriseDocumentServices = {
  templates: new DocumentTemplateService(),
  automation: new AutomaticDocumentFillerService(),
  drawings: new DrawingManagementService(),
  compliance: new PlanningComplianceService(),
  workflows: new EnterpriseWorkflowService(),
  boq: new BillOfQuantitiesService(),
  financial: new FinancialTrackerService(),
};

export default enterpriseDocumentServices;