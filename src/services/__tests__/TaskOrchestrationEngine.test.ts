/**
 * Enterprise Unit Tests for TaskOrchestrationEngine
 * Tests critical task coordination and orchestration functionality
 */

import TaskOrchestrationEngine from '../TaskOrchestrationEngine';
import { getTestDatabase } from '../../tests/utils/test-database';
import type Database from 'better-sqlite3';

describe('TaskOrchestrationEngine', () => {
  let db: Database.Database;
  let orchestrationEngine: TaskOrchestrationEngine;
  
  beforeAll(() => {
    db = getTestDatabase();
    orchestrationEngine = new TaskOrchestrationEngine(db);
  });
  
  afterAll(() => {
    db.close();
  });
  
  beforeEach(() => {
    // Clean up test data before each test
    db.exec('DELETE FROM ecosystem_tasks');
    db.exec('DELETE FROM ecosystem_coordination');
  });
  
  describe('Task Template Management', () => {
    test('should retrieve Irish property task templates by role', () => {
      const buyerTasks = orchestrationEngine.getTaskTemplatesByRole('BUYER');
      
      expect(buyerTasks).toBeDefined();
      expect(Array.isArray(buyerTasks)).toBe(true);
      expect(buyerTasks.length).toBeGreaterThan(0);
      
      const htbTask = buyerTasks.find(task => task.task_code === 'BUY-001-TEST');
      expect(htbTask).toBeDefined();
      expect(htbTask?.title).toContain('HTB');
      expect(htbTask?.primary_professional_role).toBe('BUYER');
    });
    
    test('should retrieve developer tasks with planning requirements', () => {
      const developerTasks = orchestrationEngine.getTaskTemplatesByRole('DEVELOPER');
      
      expect(developerTasks.length).toBeGreaterThan(0);
      
      const planningTask = developerTasks.find(task => task.task_code === 'DEV-001-TEST');
      expect(planningTask).toBeDefined();
      expect(planningTask?.title).toContain('Planning Permission');
      expect(planningTask?.category).toBe('COMPLIANCE');
      
      const complianceReqs = JSON.parse(planningTask?.compliance_requirements || '[]');
      expect(complianceReqs).toContain('PLANNING_AND_DEVELOPMENT_ACT');
    });
    
    test('should retrieve solicitor tasks with AML/KYC requirements', () => {
      const solicitorTasks = orchestrationEngine.getTaskTemplatesByRole('BUYER_SOLICITOR');
      
      expect(solicitorTasks.length).toBeGreaterThan(0);
      
      const amlTask = solicitorTasks.find(task => task.task_code === 'SOL-001-TEST');
      expect(amlTask).toBeDefined();
      expect(amlTask?.task_type).toBe('CLIENT_VERIFICATION');
      
      const complianceReqs = JSON.parse(amlTask?.compliance_requirements || '[]');
      expect(complianceReqs).toContain('CRIMINAL_JUSTICE_MONEY_LAUNDERING_ACT');
    });
  });
  
  describe('Task Instance Creation', () => {
    test('should create task instance from template', () => {
      const transactionId = 'test-transaction-001';
      const taskTemplateId = 1; // HTB task template
      
      const taskInstance = orchestrationEngine.createTaskInstance({
        taskTemplateId,
        transactionId,
        assignedTo: 'BUYER',
        priority: 'high',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      });
      
      expect(taskInstance).toBeDefined();
      expect(taskInstance.id).toBeDefined();
      expect(taskInstance.transaction_id).toBe(transactionId);
      expect(taskInstance.status).toBe('pending');
      expect(taskInstance.priority).toBe('high');
      expect(taskInstance.assigned_to).toBe('BUYER');
    });
    
    test('should create task with metadata and compliance requirements', () => {
      const metadata = {
        propertyValue: 450000,
        annualIncome: 65000,
        htbEligible: true
      };
      
      const taskInstance = orchestrationEngine.createTaskInstance({
        taskTemplateId: 1,
        transactionId: 'test-transaction-002',
        assignedTo: 'BUYER',
        metadata
      });
      
      expect(taskInstance.metadata).toBeDefined();
      const parsedMetadata = JSON.parse(taskInstance.metadata);
      expect(parsedMetadata.propertyValue).toBe(450000);
      expect(parsedMetadata.htbEligible).toBe(true);
    });
  });
  
  describe('Task Status Management', () => {
    let taskId: string;
    
    beforeEach(() => {
      const task = orchestrationEngine.createTaskInstance({
        taskTemplateId: 1,
        transactionId: 'test-transaction-status',
        assignedTo: 'BUYER'
      });
      taskId = task.id;
    });
    
    test('should update task status from pending to in_progress', () => {
      const updatedTask = orchestrationEngine.updateTaskStatus(taskId, 'in_progress', 25);
      
      expect(updatedTask).toBeDefined();
      expect(updatedTask.status).toBe('in_progress');
      expect(updatedTask.progress).toBe(25);
      expect(updatedTask.updated_at).toBeDefined();
    });
    
    test('should complete task with completion timestamp', () => {
      const completedTask = orchestrationEngine.updateTaskStatus(taskId, 'completed', 100);
      
      expect(completedTask.status).toBe('completed');
      expect(completedTask.progress).toBe(100);
      expect(completedTask.completed_at).toBeDefined();
    });
    
    test('should block task and record reason', () => {
      const metadata = { blockReason: 'Waiting for document upload' };
      const blockedTask = orchestrationEngine.updateTaskStatus(taskId, 'blocked', 50, metadata);
      
      expect(blockedTask.status).toBe('blocked');
      expect(blockedTask.progress).toBe(50);
      
      const parsedMetadata = JSON.parse(blockedTask.metadata);
      expect(parsedMetadata.blockReason).toBe('Waiting for document upload');
    });
  });
  
  describe('Transaction Task Orchestration', () => {
    test('should orchestrate complete Irish property transaction', () => {
      const transactionId = 'irish-property-001';
      
      // Create buyer tasks
      const htbTask = orchestrationEngine.createTaskInstance({
        taskTemplateId: 1, // HTB task
        transactionId,
        assignedTo: 'BUYER',
        priority: 'high'
      });
      
      // Create solicitor tasks
      const amlTask = orchestrationEngine.createTaskInstance({
        taskTemplateId: 3, // AML/KYC task
        transactionId,
        assignedTo: 'BUYER_SOLICITOR',
        priority: 'high'
      });
      
      // Create developer tasks
      const planningTask = orchestrationEngine.createTaskInstance({
        taskTemplateId: 2, // Planning permission
        transactionId,
        assignedTo: 'DEVELOPER',
        priority: 'medium'
      });
      
      // Get all tasks for transaction
      const transactionTasks = orchestrationEngine.getTasksByTransaction(transactionId);
      
      expect(transactionTasks.length).toBe(3);
      expect(transactionTasks.some(t => t.assigned_to === 'BUYER')).toBe(true);
      expect(transactionTasks.some(t => t.assigned_to === 'BUYER_SOLICITOR')).toBe(true);
      expect(transactionTasks.some(t => t.assigned_to === 'DEVELOPER')).toBe(true);
    });
    
    test('should calculate transaction progress correctly', () => {
      const transactionId = 'progress-test-001';
      
      // Create multiple tasks
      const task1 = orchestrationEngine.createTaskInstance({
        taskTemplateId: 1,
        transactionId,
        assignedTo: 'BUYER'
      });
      
      const task2 = orchestrationEngine.createTaskInstance({
        taskTemplateId: 2,
        transactionId,
        assignedTo: 'DEVELOPER'
      });
      
      const task3 = orchestrationEngine.createTaskInstance({
        taskTemplateId: 3,
        transactionId,
        assignedTo: 'BUYER_SOLICITOR'
      });
      
      // Complete one task
      orchestrationEngine.updateTaskStatus(task1.id, 'completed', 100);
      
      // Start another task
      orchestrationEngine.updateTaskStatus(task2.id, 'in_progress', 50);
      
      // Calculate progress
      const progress = orchestrationEngine.calculateTransactionProgress(transactionId);
      
      // Expected: (100 + 50 + 0) / 3 = 50%
      expect(progress).toBeCloseTo(50, 0);
    });
  });
  
  describe('Critical Path Analysis', () => {
    test('should identify critical path for Irish property transaction', () => {
      const transactionId = 'critical-path-001';
      
      // Create dependent tasks (simulating real Irish property workflow)
      const tasks = [
        { templateId: 1, assignedTo: 'BUYER', priority: 'high' }, // HTB registration
        { templateId: 3, assignedTo: 'BUYER_SOLICITOR', priority: 'high' }, // AML/KYC
        { templateId: 2, assignedTo: 'DEVELOPER', priority: 'medium' } // Planning permission
      ];
      
      const createdTasks = tasks.map(task => 
        orchestrationEngine.createTaskInstance({
          taskTemplateId: task.templateId,
          transactionId,
          assignedTo: task.assignedTo,
          priority: task.priority
        })
      );
      
      const criticalTasks = orchestrationEngine.getCriticalPathTasks(transactionId);
      
      expect(criticalTasks.length).toBeGreaterThan(0);
      expect(criticalTasks.every(task => task.priority === 'high')).toBe(true);
    });
  });
  
  describe('Irish Compliance Validation', () => {
    test('should validate HTB compliance requirements', () => {
      const htbTask = orchestrationEngine.createTaskInstance({
        taskTemplateId: 1, // HTB task
        transactionId: 'compliance-test-001',
        assignedTo: 'BUYER',
        metadata: JSON.stringify({
          propertyValue: 450000,
          annualIncome: 65000,
          firstTimeBuyer: true
        })
      });
      
      const compliance = orchestrationEngine.validateTaskCompliance(htbTask.id);
      
      expect(compliance.isCompliant).toBe(true);
      expect(compliance.requirements).toContain('REVENUE_COMMISSIONERS');
      expect(compliance.requirements).toContain('HTB_SCHEME_RULES');
    });
    
    test('should identify non-compliant tasks', () => {
      const nonCompliantTask = orchestrationEngine.createTaskInstance({
        taskTemplateId: 1, // HTB task
        transactionId: 'non-compliant-001',
        assignedTo: 'BUYER',
        metadata: JSON.stringify({
          propertyValue: 600000, // Over HTB limit
          annualIncome: 85000,    // Over income limit
          firstTimeBuyer: true
        })
      });
      
      const compliance = orchestrationEngine.validateTaskCompliance(nonCompliantTask.id);
      
      expect(compliance.isCompliant).toBe(false);
      expect(compliance.violations.length).toBeGreaterThan(0);
    });
  });
  
  describe('Performance and Scalability', () => {
    test('should handle large numbers of tasks efficiently', () => {
      const transactionId = 'performance-test-001';
      const startTime = Date.now();
      
      // Create 100 tasks
      const tasks = [];
      for (let i = 0; i < 100; i++) {
        const task = orchestrationEngine.createTaskInstance({
          taskTemplateId: (i % 3) + 1,
          transactionId,
          assignedTo: ['BUYER', 'DEVELOPER', 'BUYER_SOLICITOR'][i % 3],
          priority: ['low', 'medium', 'high'][i % 3]
        });
        tasks.push(task);
      }
      
      const creationTime = Date.now() - startTime;
      
      // Retrieve all tasks
      const retrievalStart = Date.now();
      const allTasks = orchestrationEngine.getTasksByTransaction(transactionId);
      const retrievalTime = Date.now() - retrievalStart;
      
      expect(allTasks.length).toBe(100);
      expect(creationTime).toBeLessThan(1000); // Less than 1 second
      expect(retrievalTime).toBeLessThan(100);  // Less than 100ms
    });
  });
});