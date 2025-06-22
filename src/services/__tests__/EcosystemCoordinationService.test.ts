/**
 * Enterprise Unit Tests for EcosystemCoordinationService
 * Tests multi-stakeholder coordination and communication workflows
 */

import EcosystemCoordinationService from '../EcosystemCoordinationService';
import { getTestDatabase } from '../../tests/utils/test-database';
import type Database from 'better-sqlite3';

describe('EcosystemCoordinationService', () => {
  let db: Database.Database;
  let coordinationService: EcosystemCoordinationService;
  
  beforeAll(() => {
    db = getTestDatabase();
    coordinationService = new EcosystemCoordinationService(db);
  });
  
  afterAll(() => {
    db.close();
  });
  
  beforeEach(() => {
    // Clean up test data
    db.exec('DELETE FROM ecosystem_coordination');
    db.exec('DELETE FROM ecosystem_tasks');
  });
  
  describe('Ecosystem Coordination Initiation', () => {
    test('should initiate coordination for Irish property transaction', async () => {
      const coordinationRequest = {
        transactionId: 'irish-prop-001',
        requiredRoles: ['BUYER', 'DEVELOPER', 'BUYER_SOLICITOR', 'ESTATE_AGENT'],
        priority: 'high',
        timeline: {
          startDate: new Date(),
          targetCompletionDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) // 60 days
        },
        customRequirements: {
          htbRequired: true,
          planningPermissionRequired: true,
          newBuild: true
        }
      };
      
      const coordination = await coordinationService.initiateEcosystemCoordination(coordinationRequest);
      
      expect(coordination).toBeDefined();
      expect(coordination.id).toBeDefined();
      expect(coordination.transactionId).toBe('irish-prop-001');
      expect(coordination.status).toBe('initiated');
      expect(coordination.requiredRoles).toHaveLength(4);
      expect(coordination.coordinationType).toBe('PROPERTY_TRANSACTION');
    });
    
    test('should create coordination with Irish regulatory requirements', async () => {
      const coordinationRequest = {
        transactionId: 'regulatory-001',
        requiredRoles: ['DEVELOPER', 'PLANNING_AUTHORITY', 'BUILDING_CONTROL'],
        priority: 'critical',
        customRequirements: {
          planningApplicationRequired: true,
          firesSafetyCertificateRequired: true,
          bcarComplianceRequired: true
        }
      };
      
      const coordination = await coordinationService.initiateEcosystemCoordination(coordinationRequest);
      
      expect(coordination.metadata.planningApplicationRequired).toBe(true);
      expect(coordination.metadata.bcarComplianceRequired).toBe(true);
      expect(coordination.requiredRoles).toContain('PLANNING_AUTHORITY');
    });
  });
  
  describe('Multi-Stakeholder Task Coordination', () => {
    test('should coordinate HTB application across stakeholders', async () => {
      const transactionId = 'htb-coordination-001';
      
      // Initiate coordination
      const coordination = await coordinationService.initiateEcosystemCoordination({
        transactionId,
        requiredRoles: ['BUYER', 'MORTGAGE_BROKER', 'BUYER_SOLICITOR'],
        customRequirements: { htbApplication: true }
      });
      
      // Add stakeholder coordination steps
      const coordinationSteps = await coordinationService.addCoordinationSteps(coordination.id, [
        {
          step: 1,
          role: 'BUYER',
          action: 'Complete HTB eligibility check',
          dependencies: [],
          estimatedDuration: 2 // hours
        },
        {
          step: 2,
          role: 'MORTGAGE_BROKER',
          action: 'Submit HTB application to Revenue',
          dependencies: [1],
          estimatedDuration: 4
        },
        {
          step: 3,
          role: 'BUYER_SOLICITOR',
          action: 'Incorporate HTB into legal documentation',
          dependencies: [2],
          estimatedDuration: 6
        }
      ]);
      
      expect(coordinationSteps).toHaveLength(3);
      expect(coordinationSteps[1].dependencies).toContain(1);
      expect(coordinationSteps[2].dependencies).toContain(2);
    });
    
    test('should coordinate planning permission workflow', async () => {
      const transactionId = 'planning-coordination-001';
      
      const coordination = await coordinationService.initiateEcosystemCoordination({
        transactionId,
        requiredRoles: ['DEVELOPER', 'LEAD_ARCHITECT', 'PLANNING_AUTHORITY', 'PLANNING_CONSULTANT'],
        customRequirements: { 
          planningApplication: true,
          architecturalDrawings: true,
          engineeringReports: true
        }
      });
      
      const planningSteps = await coordinationService.addCoordinationSteps(coordination.id, [
        {
          step: 1,
          role: 'LEAD_ARCHITECT',
          action: 'Prepare architectural drawings',
          dependencies: [],
          estimatedDuration: 120 // hours
        },
        {
          step: 2,
          role: 'PLANNING_CONSULTANT',
          action: 'Review planning compliance',
          dependencies: [1],
          estimatedDuration: 40
        },
        {
          step: 3,
          role: 'DEVELOPER',
          action: 'Submit planning application',
          dependencies: [1, 2],
          estimatedDuration: 8
        },
        {
          step: 4,
          role: 'PLANNING_AUTHORITY',
          action: 'Process planning application',
          dependencies: [3],
          estimatedDuration: 720 // 30 days
        }
      ]);
      
      expect(planningSteps).toHaveLength(4);
      expect(planningSteps[2].dependencies).toHaveLength(2);
    });
  });
  
  describe('Real-time Coordination Status', () => {
    let coordinationId: string;
    
    beforeEach(async () => {
      const coordination = await coordinationService.initiateEcosystemCoordination({
        transactionId: 'status-test-001',
        requiredRoles: ['BUYER', 'BUYER_SOLICITOR'],
        priority: 'medium'
      });
      coordinationId = coordination.id;
    });
    
    test('should track coordination progress accurately', async () => {
      // Add coordination steps
      await coordinationService.addCoordinationSteps(coordinationId, [
        { step: 1, role: 'BUYER', action: 'Document upload', estimatedDuration: 2 },
        { step: 2, role: 'BUYER_SOLICITOR', action: 'Document review', estimatedDuration: 4 }
      ]);
      
      // Complete first step
      await coordinationService.updateStepStatus(coordinationId, 1, 'completed');
      
      const status = await coordinationService.getCoordinationStatus(coordinationId);
      
      expect(status.overallProgress).toBe(50); // 1 of 2 steps completed
      expect(status.completedSteps).toBe(1);
      expect(status.totalSteps).toBe(2);
      expect(status.currentStep.step).toBe(2);
    });
    
    test('should identify coordination bottlenecks', async () => {
      // Add steps with dependencies
      await coordinationService.addCoordinationSteps(coordinationId, [
        { step: 1, role: 'BUYER', action: 'Task 1', estimatedDuration: 2 },
        { step: 2, role: 'BUYER_SOLICITOR', action: 'Task 2', dependencies: [1], estimatedDuration: 4 },
        { step: 3, role: 'BUYER', action: 'Task 3', dependencies: [2], estimatedDuration: 1 }
      ]);
      
      // Simulate delay in step 2
      await coordinationService.updateStepStatus(coordinationId, 1, 'completed');
      await coordinationService.updateStepStatus(coordinationId, 2, 'delayed', { 
        delayReason: 'Waiting for additional documentation',
        estimatedDelay: 48 // hours
      });
      
      const bottlenecks = await coordinationService.identifyBottlenecks(coordinationId);
      
      expect(bottlenecks).toHaveLength(1);
      expect(bottlenecks[0].step).toBe(2);
      expect(bottlenecks[0].delayReason).toContain('documentation');
      expect(bottlenecks[0].impactedSteps).toContain(3);
    });
  });
  
  describe('Stakeholder Communication Management', () => {
    test('should send notifications to relevant stakeholders', async () => {
      const coordinationId = 'comm-test-001';
      
      const notifications = await coordinationService.sendStakeholderNotifications(coordinationId, {
        type: 'status_update',
        message: 'HTB application approved by Revenue',
        recipients: ['BUYER', 'MORTGAGE_BROKER', 'BUYER_SOLICITOR'],
        priority: 'high',
        actionRequired: true
      });
      
      expect(notifications.sent).toBe(3);
      expect(notifications.recipients).toHaveLength(3);
      expect(notifications.deliveryStatus.success).toBe(3);
    });
    
    test('should escalate critical coordination issues', async () => {
      const coordinationId = 'escalation-test-001';
      
      const escalation = await coordinationService.escalateCoordinationIssue(coordinationId, {
        severity: 'critical',
        issue: 'Planning permission rejected',
        impactedStakeholders: ['DEVELOPER', 'BUYER', 'BUYER_SOLICITOR'],
        suggestedActions: [
          'Appeal planning decision',
          'Modify building design',
          'Consider alternative site'
        ]
      });
      
      expect(escalation.escalationId).toBeDefined();
      expect(escalation.notificationsSent).toBeGreaterThan(0);
      expect(escalation.priorityLevel).toBe('critical');
      expect(escalation.suggestedActions).toHaveLength(3);
    });
  });
  
  describe('Irish Regulatory Compliance Coordination', () => {
    test('should coordinate Revenue.ie HTB compliance workflow', async () => {
      const htbCoordination = await coordinationService.initiateRegulatoryCompliance({
        type: 'HTB_APPLICATION',
        transactionId: 'htb-compliance-001',
        regulatoryBodies: ['REVENUE_COMMISSIONERS'],
        requiredDocuments: [
          'P60_OR_PAYSLIPS',
          'BANK_STATEMENTS',
          'MORTGAGE_APPROVAL_LETTER',
          'SOLICITOR_CONFIRMATION'
        ],
        timeline: {
          submissionDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          expectedResponse: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000) // 45 days
        }
      });
      
      expect(htbCoordination.complianceType).toBe('HTB_APPLICATION');
      expect(htbCoordination.requiredDocuments).toHaveLength(4);
      expect(htbCoordination.regulatoryBodies).toContain('REVENUE_COMMISSIONERS');
    });
    
    test('should coordinate Planning Authority compliance', async () => {
      const planningCompliance = await coordinationService.initiateRegulatoryCompliance({
        type: 'PLANNING_APPLICATION',
        transactionId: 'planning-compliance-001',
        regulatoryBodies: ['LOCAL_PLANNING_AUTHORITY'],
        requiredDocuments: [
          'ARCHITECTURAL_DRAWINGS',
          'ENGINEERING_REPORTS',
          'ENVIRONMENTAL_IMPACT_ASSESSMENT',
          'PUBLIC_CONSULTATION_NOTICE'
        ],
        fees: {
          applicationFee: 65,
          newspaperNotice: 54,
          total: 119
        }
      });
      
      expect(planningCompliance.fees.total).toBe(119);
      expect(planningCompliance.requiredDocuments).toContain('ENVIRONMENTAL_IMPACT_ASSESSMENT');
    });
    
    test('should coordinate Building Control compliance workflow', async () => {
      const buildingControlCompliance = await coordinationService.initiateRegulatoryCompliance({
        type: 'BUILDING_CONTROL_COMPLIANCE',
        transactionId: 'building-control-001',
        regulatoryBodies: ['BUILDING_CONTROL_AUTHORITY'],
        requiredCertifications: [
          'FIRE_SAFETY_CERTIFICATE',
          'BCAR_ASSIGNED_CERTIFIER',
          'COMMENCEMENT_NOTICE',
          'COMPLETION_CERTIFICATE'
        ],
        workflow: 'BCAR_SI_9_2014'
      });
      
      expect(buildingControlCompliance.workflow).toBe('BCAR_SI_9_2014');
      expect(buildingControlCompliance.requiredCertifications).toContain('BCAR_ASSIGNED_CERTIFIER');
    });
  });
  
  describe('Performance and Scalability', () => {
    test('should handle multiple simultaneous coordinations', async () => {
      const coordinationPromises = Array.from({ length: 10 }, (_, i) => 
        coordinationService.initiateEcosystemCoordination({
          transactionId: `concurrent-${i}`,
          requiredRoles: ['BUYER', 'DEVELOPER'],
          priority: 'medium'
        })
      );
      
      const coordinations = await Promise.all(coordinationPromises);
      
      expect(coordinations).toHaveLength(10);
      expect(coordinations.every(c => c.id !== undefined)).toBe(true);
      expect(coordinations.every(c => c.status === 'initiated')).toBe(true);
    });
    
    test('should optimize coordination workflows', async () => {
      const complexCoordination = await coordinationService.initiateEcosystemCoordination({
        transactionId: 'optimization-test-001',
        requiredRoles: [
          'BUYER', 'DEVELOPER', 'BUYER_SOLICITOR', 'SELLER_SOLICITOR',
          'MORTGAGE_BROKER', 'BUILDING_SURVEYOR', 'ESTATE_AGENT'
        ],
        priority: 'high'
      });
      
      const optimizedWorkflow = await coordinationService.optimizeWorkflow(complexCoordination.id);
      
      expect(optimizedWorkflow.parallelSteps).toBeGreaterThan(0);
      expect(optimizedWorkflow.criticalPath).toBeDefined();
      expect(optimizedWorkflow.estimatedCompletionTime).toBeLessThan(
        optimizedWorkflow.originalEstimate
      );
    });
  });
});