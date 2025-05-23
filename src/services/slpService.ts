import { slpClient } from '@/lib/slp-client';
import { Logger } from '@/utils/logger';
import { EventEmitter } from 'events';

// Mock types for development
export enum ComponentStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ON_HOLD = 'ON_HOLD'
}

export interface SLPComponent {
  id: string;
  name: string;
  description: string;
  required: boolean;
  projectId: string;
  status: ComponentStatus;
  documentId?: string;
  documentUrl?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const prisma = slpClient;
const logger = new Logger('SLPService');
const eventBus = new EventEmitter();

export interface SLPComponentInput {
  name: string;
  description: string;
  required?: boolean;
  projectId: string;
}

export interface SLPUpdateInput {
  status?: ComponentStatus;
  documentId?: string;
  documentUrl?: string;
  notes?: string;
  reviewedBy?: string;
}

export class SLPService {
  /**
   * Get all SLP components for a project
   */
  async getComponents(projectId: string): Promise<SLPComponent[]> {
    try {
      return await prisma.sLPComponent.findMany({
        where: { projectId },
        orderBy: { createdAt: 'asc' }
      });
    } catch (error) {
      logger.error('Failed to fetch SLP components', { projectId, error });
      throw new Error('Unable to fetch SLP components');
    }
  }

  /**
   * Get a single SLP component by ID
   */
  async getComponentById(componentId: string): Promise<SLPComponent | null> {
    try {
      return await prisma.sLPComponent.findUnique({
        where: { id: componentId },
        include: {
          project: true,
          changeHistory: {
            orderBy: { performedAt: 'desc' },
            take: 10
          }
        }
      });
    } catch (error) {
      logger.error('Failed to fetch SLP component', { componentId, error });
      throw new Error('Unable to fetch SLP component');
    }
  }

  /**
   * Create a new SLP component
   */
  async createComponent(data: SLPComponentInput): Promise<SLPComponent> {
    try {
      const component = await prisma.sLPComponent.create({
        data: {
          name: data.name,
          description: data.description,
          required: data.required ?? true,
          projectId: data.projectId
        }
      });

      // Emit event for other services
      eventBus.emit('slp.component.created', component);
      logger.info('SLP component created', { componentId: component.id });

      return component;
    } catch (error) {
      logger.error('Failed to create SLP component', { data, error });
      throw new Error('Unable to create SLP component');
    }
  }

  /**
   * Update an SLP component status
   */
  async updateComponentStatus(
    componentId: string, 
    status: ComponentStatus, 
    updatedBy: string,
    notes?: string
  ): Promise<SLPComponent> {
    try {
      // Get current component state
      const currentComponent = await prisma.sLPComponent.findUnique({
        where: { id: componentId }
      });

      if (!currentComponent) {
        throw new Error('Component not found');
      }

      // Update component
      const updatedComponent = await prisma.sLPComponent.update({
        where: { id: componentId },
        data: {
          status,
          reviewedBy: updatedBy,
          reviewedAt: new Date(),
          notes
        }
      });

      // Create history record
      await prisma.sLPHistory.create({
        data: {
          componentId,
          action: 'STATUS_CHANGE',
          performedBy: updatedBy,
          oldStatus: currentComponent.status,
          newStatus: status,
          notes
        }
      });

      // Emit event for other services
      eventBus.emit('slp.component.updated', {
        component: updatedComponent,
        previousStatus: currentComponent.status,
        newStatus: status
      });

      logger.info('SLP component status updated', { 
        componentId, 
        oldStatus: currentComponent.status, 
        newStatus: status 
      });

      return updatedComponent;
    } catch (error) {
      logger.error('Failed to update SLP component status', { 
        componentId, 
        status, 
        error 
      });
      throw new Error('Unable to update SLP component status');
    }
  }

  /**
   * Upload document for an SLP component
   */
  async uploadDocument(
    componentId: string,
    documentId: string,
    documentUrl: string,
    uploadedBy: string
  ): Promise<SLPComponent> {
    try {
      const component = await prisma.sLPComponent.update({
        where: { id: componentId },
        data: {
          documentId,
          documentUrl,
          uploadedBy,
          uploadedAt: new Date(),
          status: ComponentStatus.UPLOADED
        }
      });

      // Create history record
      await prisma.sLPHistory.create({
        data: {
          componentId,
          action: 'DOCUMENT_UPLOADED',
          performedBy: uploadedBy,
          notes: `Document ${documentId} uploaded`
        }
      });

      // Emit event
      eventBus.emit('slp.document.uploaded', {
        componentId,
        documentId,
        uploadedBy
      });

      logger.info('Document uploaded for SLP component', { 
        componentId, 
        documentId 
      });

      return component;
    } catch (error) {
      logger.error('Failed to upload document', { 
        componentId, 
        documentId, 
        error 
      });
      throw new Error('Unable to upload document');
    }
  }

  /**
   * Get overall SLP completion progress for a project
   */
  async getProjectProgress(projectId: string): Promise<{
    totalComponents: number;
    approvedComponents: number;
    progressPercentage: number;
    componentsbyStatus: Record<ComponentStatus, number>\n  );
  }> {
    try {
      const components = await this.getComponents(projectId);

      const totalComponents = components.length;
      const approvedComponents = components.filter(
        c => c.status === ComponentStatus.APPROVED
      ).length;

      const componentsByStatus = components.reduce((acccomponent: any) => {
        acc[component.status] = (acc[component.status] || 0) + 1;
        return acc;
      }, {} as Record<ComponentStatus, number>);

      const progressPercentage = totalComponents> 0 
        ? Math.round((approvedComponents / totalComponents) * 100)
        : 0;

      return {
        totalComponents,
        approvedComponents,
        progressPercentage,
        componentsbyStatus: componentsByStatus
      };
    } catch (error) {
      logger.error('Failed to calculate project progress', { projectId, error });
      throw new Error('Unable to calculate project progress');
    }
  }

  /**
   * Batch update multiple components
   */
  async batchUpdateComponents(
    updates: Array<{ componentId: string; data: SLPUpdateInput }>
  ): Promise<SLPComponent[]> {
    try {
      const results = await prisma.$transaction(
        updates.map(({ componentId, data }) => 
          prisma.sLPComponent.update({
            where: { id: componentId },
            data
          })
        )
      );

      // Emit batch update event
      eventBus.emit('slp.components.batch.updated', results);

      return results;
    } catch (error) {
      logger.error('Failed to batch update components', { updates, error });
      throw new Error('Unable to batch update components');
    }
  }

  /**
   * Generate SLP report for a project
   */
  async generateReport(projectId: string): Promise<{
    project: any;
    components: SLPComponent[];
    progress: any;
    generatedAt: Date;
  }> {
    try {
      const project = await prisma.project.findUnique({
        where: { id: projectId }
      });

      if (!project) {
        throw new Error('Project not found');
      }

      const components = await this.getComponents(projectId);
      const progress = await this.getProjectProgress(projectId);

      return {
        project,
        components,
        progress,
        generatedAt: new Date()
      };
    } catch (error) {
      logger.error('Failed to generate SLP report', { projectId, error });
      throw new Error('Unable to generate SLP report');
    }
  }

  /**
   * Get event bus for subscribing to SLP events
   */
  getEventBus(): EventEmitter {
    return eventBus;
  }
}

// Export singleton instance
export const slpService = new SLPService();
