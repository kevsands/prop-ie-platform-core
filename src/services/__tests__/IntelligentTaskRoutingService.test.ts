/**
 * Enterprise Unit Tests for IntelligentTaskRoutingService
 * Tests AI-powered task routing and assignment functionality
 */

import IntelligentTaskRoutingService from '../IntelligentTaskRoutingService';
import { getTestDatabase } from '../../tests/utils/test-database';
import type Database from 'better-sqlite3';

describe('IntelligentTaskRoutingService', () => {
  let db: Database.Database;
  let routingService: IntelligentTaskRoutingService;
  
  beforeAll(() => {
    db = getTestDatabase();
    routingService = new IntelligentTaskRoutingService(db);
  });
  
  afterAll(() => {
    db.close();
  });
  
  beforeEach(() => {
    // Clean up test data
    db.exec('DELETE FROM ecosystem_tasks');
    db.exec('DELETE FROM ecosystem_coordination');
  });
  
  describe('Professional Matching Algorithm', () => {
    test('should match HTB tasks to qualified mortgage brokers', async () => {
      const taskRequirements = {
        taskCode: 'BUY-001-TEST',
        category: 'FINANCIAL_PLANNING',
        skillsRequired: ['HTB_EXPERTISE', 'MORTGAGE_ADVICE'],
        compliance: ['REVENUE_COMMISSIONERS', 'HTB_SCHEME_RULES'],
        urgency: 'high'
      };
      
      const matches = await routingService.findBestProfessionalMatch(taskRequirements);
      
      expect(matches).toBeDefined();
      expect(matches.length).toBeGreaterThan(0);
      expect(matches[0].matchScore).toBeGreaterThan(80);
      expect(matches[0].professional.specializations).toContain('HTB_EXPERTISE');
    });
    
    test('should match planning tasks to qualified architects', async () => {
      const taskRequirements = {
        taskCode: 'DEV-001-TEST',
        category: 'COMPLIANCE',
        skillsRequired: ['PLANNING_PERMISSION', 'ARCHITECTURAL_DESIGN'],
        compliance: ['PLANNING_AND_DEVELOPMENT_ACT'],
        urgency: 'medium'
      };
      
      const matches = await routingService.findBestProfessionalMatch(taskRequirements);
      
      expect(matches).toBeDefined();
      expect(matches[0].professional.role).toBe('LEAD_ARCHITECT');
      expect(matches[0].professional.certifications).toContain('RIAI_MEMBERSHIP');
    });
    
    test('should match AML tasks to qualified solicitors', async () => {
      const taskRequirements = {
        taskCode: 'SOL-001-TEST',
        category: 'COMPLIANCE',
        skillsRequired: ['AML_COMPLIANCE', 'KYC_VERIFICATION'],
        compliance: ['CRIMINAL_JUSTICE_MONEY_LAUNDERING_ACT'],
        urgency: 'high'
      };
      
      const matches = await routingService.findBestProfessionalMatch(taskRequirements);
      
      expect(matches[0].professional.role).toBe('BUYER_SOLICITOR');
      expect(matches[0].professional.certifications).toContain('LAW_SOCIETY_IRELAND');
    });
  });
  
  describe('AI-Powered Task Assignment', () => {
    test('should assign task based on workload and expertise', async () => {
      const taskId = 'ai-assignment-001';
      const taskMetadata = {
        category: 'FINANCIAL_PLANNING',
        complexity: 'moderate',
        requiredSkills: ['HTB_EXPERTISE', 'FIRST_TIME_BUYER_GUIDANCE'],
        timeline: '48_hours'
      };
      
      const assignment = await routingService.assignTaskIntelligently(taskId, taskMetadata);
      
      expect(assignment).toBeDefined();
      expect(assignment.assignedProfessional).toBeDefined();
      expect(assignment.confidenceScore).toBeGreaterThan(75);
      expect(assignment.reasoning).toContain('expertise match');
    });
    
    test('should consider professional workload in assignment', async () => {
      // Simulate high workload scenario
      const busyProfessional = {
        id: 'prof-001',
        currentTaskCount: 15,
        capacity: 10,
        specializations: ['HTB_EXPERTISE']
      };
      
      const availableProfessional = {
        id: 'prof-002', 
        currentTaskCount: 3,
        capacity: 10,
        specializations: ['HTB_EXPERTISE']
      };
      
      const taskMetadata = {
        category: 'FINANCIAL_PLANNING',
        urgency: 'high'
      };
      
      const assignment = await routingService.assignTaskIntelligently('task-workload-001', taskMetadata);
      
      // Should assign to less busy professional
      expect(assignment.assignedProfessional.id).toBe('prof-002');
      expect(assignment.reasoning).toContain('workload optimization');
    });
    
    test('should prioritize urgency in assignment decisions', async () => {
      const urgentTaskMetadata = {
        category: 'COMPLIANCE',
        urgency: 'critical',
        deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      };
      
      const assignment = await routingService.assignTaskIntelligently('urgent-task-001', urgentTaskMetadata);
      
      expect(assignment.priority).toBe('critical');
      expect(assignment.escalationRequired).toBe(false);
      expect(assignment.estimatedCompletionTime).toBeLessThan(24); // hours
    });
  });
  
  describe('Machine Learning Optimization', () => {
    test('should learn from successful task completions', async () => {
      const completionData = {
        taskId: 'learning-001',
        professionalId: 'prof-ml-001',
        completionTime: 2.5, // hours
        qualityScore: 95,
        clientSatisfaction: 4.8,
        taskCategory: 'FINANCIAL_PLANNING'
      };
      
      await routingService.recordTaskCompletion(completionData);
      
      const learningMetrics = await routingService.getLearningMetrics('prof-ml-001');
      
      expect(learningMetrics.averageCompletionTime).toBeDefined();
      expect(learningMetrics.qualityScore).toBeGreaterThan(90);
      expect(learningMetrics.taskCategories).toContain('FINANCIAL_PLANNING');
    });
    
    test('should improve matching accuracy over time', async () => {
      // Simulate multiple successful assignments
      const trainingData = [
        { taskCategory: 'FINANCIAL_PLANNING', professionalId: 'prof-001', success: true, qualityScore: 92 },
        { taskCategory: 'FINANCIAL_PLANNING', professionalId: 'prof-001', success: true, qualityScore: 88 },
        { taskCategory: 'COMPLIANCE', professionalId: 'prof-002', success: true, qualityScore: 94 },
        { taskCategory: 'COMPLIANCE', professionalId: 'prof-002', success: true, qualityScore: 91 }
      ];
      
      for (const data of trainingData) {
        await routingService.recordTaskCompletion(data);
      }
      
      // Test improved matching
      const taskRequirements = {
        category: 'FINANCIAL_PLANNING',
        skillsRequired: ['HTB_EXPERTISE']
      };
      
      const matches = await routingService.findBestProfessionalMatch(taskRequirements);
      
      expect(matches[0].matchScore).toBeGreaterThan(85);
      expect(matches[0].aiConfidence).toBeGreaterThan(80);
    });
  });
  
  describe('Irish Market Specialization', () => {
    test('should prioritize Irish-qualified professionals', async () => {
      const irishTaskRequirements = {
        taskCode: 'SOL-001-TEST',
        jurisdiction: 'IRELAND',
        compliance: ['LAW_SOCIETY_IRELAND', 'IRISH_PROPERTY_LAW'],
        language: 'EN_IE'
      };
      
      const matches = await routingService.findBestProfessionalMatch(irishTaskRequirements);
      
      expect(matches[0].professional.jurisdiction).toBe('IRELAND');
      expect(matches[0].professional.certifications).toContain('LAW_SOCIETY_IRELAND');
    });
    
    test('should understand Irish property law requirements', async () => {
      const propertyLawTask = {
        taskCode: 'SOL-002-TEST',
        category: 'LEGAL_PROCESS',
        specializations: ['CONVEYANCING', 'IRISH_PROPERTY_LAW', 'LAND_REGISTRY'],
        compliance: ['REGISTRATION_OF_TITLE_ACT']
      };
      
      const matches = await routingService.findBestProfessionalMatch(propertyLawTask);
      
      expect(matches[0].professional.specializations).toContain('CONVEYANCING');
      expect(matches[0].professional.experience.irish_property_law).toBeGreaterThan(3); // years
    });
    
    test('should route HTB tasks to Revenue-certified professionals', async () => {
      const htbTask = {
        taskCode: 'BUY-001-TEST',
        category: 'FINANCIAL_PLANNING',
        compliance: ['REVENUE_COMMISSIONERS', 'HTB_SCHEME_RULES'],
        governmentIntegration: true
      };
      
      const matches = await routingService.findBestProfessionalMatch(htbTask);
      
      expect(matches[0].professional.governmentCertifications).toContain('REVENUE_QUALIFIED');
      expect(matches[0].professional.htbCasesCompleted).toBeGreaterThan(50);
    });
  });
  
  describe('Real-time Routing Optimization', () => {
    test('should route tasks based on current availability', async () => {
      const realTimeTask = {
        urgency: 'immediate',
        requiredResponse: '2_hours',
        category: 'COMPLIANCE'
      };
      
      const routing = await routingService.routeTaskRealTime('realtime-001', realTimeTask);
      
      expect(routing.assignedProfessional.currentStatus).toBe('available');
      expect(routing.estimatedResponseTime).toBeLessThan(2); // hours
      expect(routing.escalationPlan).toBeDefined();
    });
    
    test('should handle peak demand scenarios', async () => {
      // Simulate high demand
      const peakTasks = Array.from({ length: 20 }, (_, i) => ({
        id: `peak-task-${i}`,
        category: 'FINANCIAL_PLANNING',
        urgency: 'high'
      }));
      
      const routingResults = await Promise.all(
        peakTasks.map(task => routingService.routeTaskRealTime(task.id, task))
      );
      
      // All tasks should be routed successfully
      expect(routingResults.length).toBe(20);
      expect(routingResults.every(r => r.assignedProfessional !== null)).toBe(true);
      
      // Load balancing should distribute tasks
      const assignments = routingResults.map(r => r.assignedProfessional.id);
      const uniqueAssignments = new Set(assignments);
      expect(uniqueAssignments.size).toBeGreaterThan(1); // Multiple professionals assigned
    });
  });
  
  describe('Error Handling and Fallbacks', () => {
    test('should handle no available professionals gracefully', async () => {
      const impossibleTask = {
        category: 'IMPOSSIBLE_CATEGORY',
        skillsRequired: ['NON_EXISTENT_SKILL'],
        urgency: 'critical'
      };
      
      const routing = await routingService.routeTaskRealTime('impossible-001', impossibleTask);
      
      expect(routing.assignedProfessional).toBeNull();
      expect(routing.fallbackOptions).toBeDefined();
      expect(routing.escalationRequired).toBe(true);
    });
    
    test('should provide alternative suggestions when optimal match unavailable', async () => {
      const constrainedTask = {
        category: 'FINANCIAL_PLANNING',
        requiredCertifications: ['RARE_CERTIFICATION'],
        urgency: 'high'
      };
      
      const routing = await routingService.routeTaskRealTime('constrained-001', constrainedTask);
      
      if (!routing.assignedProfessional) {
        expect(routing.alternativeSuggestions).toBeDefined();
        expect(routing.alternativeSuggestions.length).toBeGreaterThan(0);
      }
    });
  });
});