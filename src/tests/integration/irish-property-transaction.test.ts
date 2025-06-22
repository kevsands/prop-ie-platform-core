/**
 * Enterprise Integration Tests for Irish Property Transaction Flows
 * Tests complete workflows from buyer registration through property completion
 */

import { setupTestDatabase, cleanupTestDatabase } from '../utils/test-database';
import TaskOrchestrationEngine from '../../services/TaskOrchestrationEngine';
import IntelligentTaskRoutingService from '../../services/IntelligentTaskRoutingService';
import EcosystemCoordinationService from '../../services/EcosystemCoordinationService';
import type Database from 'better-sqlite3';

describe('Irish Property Transaction Integration Tests', () => {
  let db: Database.Database;
  let orchestrationEngine: TaskOrchestrationEngine;
  let routingService: IntelligentTaskRoutingService;
  let coordinationService: EcosystemCoordinationService;
  
  beforeAll(async () => {
    db = await setupTestDatabase();
    orchestrationEngine = new TaskOrchestrationEngine(db);
    routingService = new IntelligentTaskRoutingService(db);
    coordinationService = new EcosystemCoordinationService(db);
  });
  
  afterAll(async () => {
    await cleanupTestDatabase();
  });
  
  beforeEach(() => {
    // Clean transaction data between tests
    db.exec('DELETE FROM ecosystem_tasks WHERE transaction_id LIKE "%integration-test%"');
    db.exec('DELETE FROM ecosystem_coordination WHERE transaction_id LIKE "%integration-test%"');
  });
  
  describe('Complete HTB (Help to Buy) Transaction Flow', () => {
    test('should orchestrate complete HTB application and approval workflow', async () => {
      const transactionId = 'htb-integration-test-001';
      
      // Step 1: Initiate HTB coordination
      const htbCoordination = await coordinationService.initiateEcosystemCoordination({
        transactionId,
        requiredRoles: ['BUYER', 'MORTGAGE_BROKER', 'BUYER_SOLICITOR', 'REVENUE_COMMISSIONERS'],
        priority: 'high',
        customRequirements: {
          htbApplication: true,
          propertyValue: 450000,
          annualIncome: 65000,
          firstTimeBuyer: true
        }
      });
      
      expect(htbCoordination.id).toBeDefined();
      expect(htbCoordination.status).toBe('initiated');
      
      // Step 2: Create HTB eligibility task
      const htbEligibilityTask = orchestrationEngine.createTaskInstance({
        taskTemplateId: 1, // HTB task template
        transactionId,
        assignedTo: 'BUYER',
        priority: 'high',
        metadata: JSON.stringify({
          propertyValue: 450000,
          annualIncome: 65000,
          firstTimeBuyer: true,
          ppsNumber: 'TEST123456A'
        })
      });
      
      expect(htbEligibilityTask.id).toBeDefined();
      expect(htbEligibilityTask.status).toBe('pending');
      
      // Step 3: Route task to qualified professional
      const routingResult = await routingService.routeTaskRealTime(htbEligibilityTask.id, {
        category: 'FINANCIAL_PLANNING',
        urgency: 'high',
        requiredSkills: ['HTB_EXPERTISE', 'REVENUE_INTEGRATION']
      });
      
      expect(routingResult.assignedProfessional).toBeDefined();
      expect(routingResult.assignedProfessional.specializations).toContain('HTB_EXPERTISE');
      
      // Step 4: Complete HTB eligibility check
      const completedEligibilityTask = orchestrationEngine.updateTaskStatus(
        htbEligibilityTask.id, 
        'completed', 
        100,
        { 
          htbEligible: true, 
          maxBenefit: 22500,
          revenueApplicationId: 'HTB-TEST-001'
        }
      );
      
      expect(completedEligibilityTask.status).toBe('completed');
      expect(completedEligibilityTask.completed_at).toBeDefined();
      
      // Step 5: Create mortgage application task (dependent on HTB completion)
      const mortgageTask = orchestrationEngine.createTaskInstance({
        taskTemplateId: 2, // Mortgage application template (would be created)
        transactionId,
        assignedTo: 'MORTGAGE_BROKER',
        priority: 'high',
        dependencies: JSON.stringify([htbEligibilityTask.id])
      });
      
      // Step 6: Update coordination status
      const updatedCoordination = await coordinationService.updateCoordinationProgress(
        htbCoordination.id,
        {
          completedSteps: 1,
          totalSteps: 4,
          currentStep: 'Mortgage Application',
          overallProgress: 25
        }
      );
      
      expect(updatedCoordination.overallProgress).toBe(25);
      
      // Verify complete workflow integration
      const transactionTasks = orchestrationEngine.getTasksByTransaction(transactionId);
      expect(transactionTasks.length).toBe(2);
      expect(transactionTasks.some(t => t.status === 'completed')).toBe(true);
      expect(transactionTasks.some(t => t.status === 'pending')).toBe(true);
    });
    
    test('should handle HTB rejection and alternative routing', async () => {
      const transactionId = 'htb-rejection-test-001';
      
      // Create HTB task with ineligible parameters
      const htbTask = orchestrationEngine.createTaskInstance({
        taskTemplateId: 1,
        transactionId,
        assignedTo: 'BUYER',
        metadata: JSON.stringify({
          propertyValue: 600000, // Over HTB limit
          annualIncome: 85000,    // Over income limit
          firstTimeBuyer: true
        })
      });
      
      // Complete with rejection
      const rejectedTask = orchestrationEngine.updateTaskStatus(
        htbTask.id,
        'completed',
        100,
        {
          htbEligible: false,
          rejectionReasons: ['Property value exceeds €500,000', 'Annual income exceeds €75,000'],
          alternativeOptions: ['Standard mortgage', 'Local authority schemes']
        }
      );
      
      expect(rejectedTask.status).toBe('completed');
      
      // Verify alternative routing triggered
      const coordination = await coordinationService.initiateEcosystemCoordination({
        transactionId,
        requiredRoles: ['BUYER', 'MORTGAGE_BROKER'],
        customRequirements: {
          alternativeFunding: true,
          standardMortgage: true
        }
      });
      
      expect(coordination.metadata.alternativeFunding).toBe(true);
    });
  });
  
  describe('Planning Permission and Development Workflow', () => {
    test('should orchestrate complete planning application process', async () => {
      const transactionId = 'planning-integration-test-001';
      
      // Step 1: Initiate planning coordination
      const planningCoordination = await coordinationService.initiateEcosystemCoordination({
        transactionId,
        requiredRoles: [
          'DEVELOPER', 
          'LEAD_ARCHITECT', 
          'PLANNING_CONSULTANT',
          'PLANNING_AUTHORITY'
        ],
        priority: 'medium',
        customRequirements: {
          planningApplication: true,
          developmentType: 'residential',
          units: 15
        }
      });
      
      // Step 2: Create architectural design task
      const architecturalTask = orchestrationEngine.createTaskInstance({
        taskTemplateId: 2, // Developer/Planning task template
        transactionId,
        assignedTo: 'LEAD_ARCHITECT',
        priority: 'high',
        metadata: JSON.stringify({
          projectType: 'residential_development',
          units: 15,
          storeys: 4,
          compliance: ['BUILDING_REGULATIONS', 'ACCESSIBILITY_STANDARDS']
        })
      });
      
      // Route to qualified architect
      const architectRouting = await routingService.routeTaskRealTime(architecturalTask.id, {
        category: 'PLANNING',
        requiredSkills: ['ARCHITECTURAL_DESIGN', 'PLANNING_COMPLIANCE'],
        certifications: ['RIAI_MEMBERSHIP']
      });
      
      expect(architectRouting.assignedProfessional.certifications).toContain('RIAI_MEMBERSHIP');
      
      // Step 3: Complete architectural drawings
      const completedArchitecturalTask = orchestrationEngine.updateTaskStatus(
        architecturalTask.id,
        'completed',
        100,
        {
          drawingsCompleted: true,
          complianceChecked: true,
          planningCompliant: true
        }
      );
      
      // Step 4: Create planning application submission task
      const planningSubmissionTask = orchestrationEngine.createTaskInstance({
        taskTemplateId: 2,
        transactionId,
        assignedTo: 'PLANNING_CONSULTANT',
        priority: 'high',
        dependencies: JSON.stringify([architecturalTask.id])
      });
      
      // Step 5: Submit to planning authority
      const submissionResult = orchestrationEngine.updateTaskStatus(
        planningSubmissionTask.id,
        'completed',
        100,
        {
          applicationSubmitted: true,
          referenceNumber: 'PL24/5678',
          submissionDate: new Date().toISOString(),
          publicNoticeRequired: true,
          estimatedDecision: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
        }
      );
      
      // Verify workflow integration
      const transactionProgress = orchestrationEngine.calculateTransactionProgress(transactionId);
      expect(transactionProgress).toBe(100); // Both tasks completed
      
      const coordinationStatus = await coordinationService.getCoordinationStatus(planningCoordination.id);
      expect(coordinationStatus.status).toBe('active');
    });
  });
  
  describe('Legal/Conveyancing Workflow Integration', () => {
    test('should orchestrate complete conveyancing process', async () => {
      const transactionId = 'conveyancing-integration-test-001';
      
      // Step 1: Initiate legal coordination
      const legalCoordination = await coordinationService.initiateEcosystemCoordination({
        transactionId,
        requiredRoles: ['BUYER_SOLICITOR', 'SELLER_SOLICITOR', 'LAND_REGISTRY'],
        priority: 'high',
        customRequirements: {
          conveyancing: true,
          propertyType: 'new_build',
          mortgageRequired: true
        }
      });
      
      // Step 2: AML/KYC verification
      const amlTask = orchestrationEngine.createTaskInstance({
        taskTemplateId: 3, // Solicitor AML template
        transactionId,
        assignedTo: 'BUYER_SOLICITOR',
        priority: 'critical',
        metadata: JSON.stringify({
          clientName: 'John Doe',
          clientType: 'individual',
          highRisk: false
        })
      });
      
      // Route to qualified solicitor
      const solicitorRouting = await routingService.routeTaskRealTime(amlTask.id, {
        category: 'COMPLIANCE',
        requiredSkills: ['AML_COMPLIANCE', 'KYC_VERIFICATION'],
        certifications: ['LAW_SOCIETY_IRELAND']
      });
      
      expect(solicitorRouting.assignedProfessional.certifications).toContain('LAW_SOCIETY_IRELAND');
      
      // Complete AML verification
      const completedAML = orchestrationEngine.updateTaskStatus(
        amlTask.id,
        'completed',
        100,
        {
          amlCompleted: true,
          kycCompleted: true,
          riskAssessment: 'low',
          documentsVerified: true
        }
      );
      
      // Step 3: Title investigation (depends on AML completion)
      const titleTask = orchestrationEngine.createTaskInstance({
        taskTemplateId: 3, // Title investigation template
        transactionId,
        assignedTo: 'BUYER_SOLICITOR',
        priority: 'high',
        dependencies: JSON.stringify([amlTask.id])
      });
      
      // Complete title investigation
      const completedTitle = orchestrationEngine.updateTaskStatus(
        titleTask.id,
        'completed',
        100,
        {
          titleClear: true,
          folioNumber: 'DN12345F',
          encumbrances: [],
          registeredOwner: 'Verified'
        }
      );
      
      // Verify legal workflow completion
      const transactionTasks = orchestrationEngine.getTasksByTransaction(transactionId);
      expect(transactionTasks.every(t => t.status === 'completed')).toBe(true);
      
      const finalProgress = orchestrationEngine.calculateTransactionProgress(transactionId);
      expect(finalProgress).toBe(100);
    });
  });
  
  describe('End-to-End Property Purchase Integration', () => {
    test('should orchestrate complete property purchase from start to completion', async () => {
      const transactionId = 'complete-purchase-test-001';
      
      // Phase 1: Initial coordination
      const masterCoordination = await coordinationService.initiateEcosystemCoordination({
        transactionId,
        requiredRoles: [
          'BUYER',
          'DEVELOPER', 
          'ESTATE_AGENT',
          'BUYER_SOLICITOR',
          'MORTGAGE_BROKER',
          'BUILDING_SURVEYOR'
        ],
        priority: 'high',
        timeline: {
          startDate: new Date(),
          targetCompletionDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000) // 120 days
        },
        customRequirements: {
          newBuildPurchase: true,
          htbApplication: true,
          mortgageRequired: true,
          surveyRequired: true
        }
      });
      
      // Phase 2: Create all major task categories
      const tasks = [];
      
      // HTB Application
      const htbTask = orchestrationEngine.createTaskInstance({
        taskTemplateId: 1,
        transactionId,
        assignedTo: 'BUYER',
        priority: 'high'
      });
      tasks.push(htbTask);
      
      // AML/KYC
      const amlTask = orchestrationEngine.createTaskInstance({
        taskTemplateId: 3,
        transactionId,
        assignedTo: 'BUYER_SOLICITOR',
        priority: 'high'
      });
      tasks.push(amlTask);
      
      // Mortgage Application
      const mortgageTask = orchestrationEngine.createTaskInstance({
        taskTemplateId: 1, // Would use mortgage template
        transactionId,
        assignedTo: 'MORTGAGE_BROKER',
        priority: 'high',
        dependencies: JSON.stringify([htbTask.id])
      });
      tasks.push(mortgageTask);
      
      // Property Survey
      const surveyTask = orchestrationEngine.createTaskInstance({
        taskTemplateId: 2, // Would use survey template
        transactionId,
        assignedTo: 'BUILDING_SURVEYOR',
        priority: 'medium'
      });
      tasks.push(surveyTask);
      
      // Phase 3: Route all tasks intelligently
      for (const task of tasks) {
        const routing = await routingService.routeTaskRealTime(task.id, {
          category: task.assigned_to === 'BUYER' ? 'FINANCIAL_PLANNING' : 'COMPLIANCE',
          urgency: task.priority
        });
        expect(routing.assignedProfessional).toBeDefined();
      }
      
      // Phase 4: Complete tasks in sequence
      // Complete HTB first
      orchestrationEngine.updateTaskStatus(htbTask.id, 'completed', 100, {
        htbApproved: true,
        benefit: 22500
      });
      
      // Complete AML (can be parallel)
      orchestrationEngine.updateTaskStatus(amlTask.id, 'completed', 100, {
        amlCompleted: true
      });
      
      // Complete survey (can be parallel)
      orchestrationEngine.updateTaskStatus(surveyTask.id, 'completed', 100, {
        surveyPassed: true,
        structurallySound: true
      });
      
      // Complete mortgage (depends on HTB)
      orchestrationEngine.updateTaskStatus(mortgageTask.id, 'completed', 100, {
        mortgageApproved: true,
        loanAmount: 350000,
        interestRate: 3.5
      });
      
      // Phase 5: Verify complete integration
      const finalTasks = orchestrationEngine.getTasksByTransaction(transactionId);
      expect(finalTasks.length).toBe(4);
      expect(finalTasks.every(t => t.status === 'completed')).toBe(true);
      
      const finalProgress = orchestrationEngine.calculateTransactionProgress(transactionId);
      expect(finalProgress).toBe(100);
      
      const finalCoordination = await coordinationService.getCoordinationStatus(masterCoordination.id);
      expect(finalCoordination.overallProgress).toBe(100);
      
      // Verify all stakeholders were coordinated
      expect(finalCoordination.coordinatedStakeholders.length).toBeGreaterThan(4);
    });
  });
  
  describe('Error Handling and Recovery Integration', () => {
    test('should handle task failures and rerouting', async () => {
      const transactionId = 'error-handling-test-001';
      
      // Create task that will fail
      const failingTask = orchestrationEngine.createTaskInstance({
        taskTemplateId: 1,
        transactionId,
        assignedTo: 'BUYER',
        priority: 'high'
      });
      
      // Simulate task failure
      const failedTask = orchestrationEngine.updateTaskStatus(
        failingTask.id,
        'blocked',
        25,
        {
          errorType: 'document_missing',
          errorMessage: 'Required documentation not provided',
          retryPossible: true
        }
      );
      
      expect(failedTask.status).toBe('blocked');
      
      // Trigger intelligent rerouting
      const reroutingResult = await routingService.handleTaskFailure(failingTask.id, {
        failureReason: 'document_missing',
        escalationRequired: true
      });
      
      expect(reroutingResult.rerouteSuccessful).toBe(true);
      expect(reroutingResult.escalationTriggered).toBe(true);
      expect(reroutingResult.alternativeAssignment).toBeDefined();
    });
    
    test('should handle coordination bottlenecks', async () => {
      const transactionId = 'bottleneck-test-001';
      
      const coordination = await coordinationService.initiateEcosystemCoordination({
        transactionId,
        requiredRoles: ['BUYER', 'BUYER_SOLICITOR', 'PLANNING_AUTHORITY'],
        priority: 'high'
      });
      
      // Create dependent tasks
      const task1 = orchestrationEngine.createTaskInstance({
        taskTemplateId: 1,
        transactionId,
        assignedTo: 'BUYER'
      });
      
      const task2 = orchestrationEngine.createTaskInstance({
        taskTemplateId: 3,
        transactionId,
        assignedTo: 'BUYER_SOLICITOR',
        dependencies: JSON.stringify([task1.id])
      });
      
      // Complete first task
      orchestrationEngine.updateTaskStatus(task1.id, 'completed', 100);
      
      // Block second task
      orchestrationEngine.updateTaskStatus(task2.id, 'blocked', 50, {
        blockReason: 'Awaiting external approval'
      });
      
      // Identify and resolve bottleneck
      const bottlenecks = await coordinationService.identifyBottlenecks(coordination.id);
      expect(bottlenecks.length).toBe(1);
      
      const resolution = await coordinationService.resolveBottleneck(coordination.id, bottlenecks[0].id, {
        strategy: 'escalate_to_manager',
        alternativeOptions: ['parallel_processing', 'external_consultation']
      });
      
      expect(resolution.resolved).toBe(true);
    });
  });
});