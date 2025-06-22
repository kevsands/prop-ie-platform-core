/**
 * Enterprise Test Database Utilities
 * Manages test database setup and cleanup for TaskOrchestrationEngine testing
 */

import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs/promises';

const TEST_DB_PATH = path.join(process.cwd(), 'test.db');

export async function setupTestDatabase(): Promise<Database.Database> {
  // Remove existing test database
  try {
    await fs.unlink(TEST_DB_PATH);
  } catch (error) {
    // File might not exist, which is fine
  }
  
  const db = new Database(TEST_DB_PATH);
  
  // Create tables for TaskOrchestrationEngine testing
  db.exec(`
    -- Task Templates Table
    CREATE TABLE IF NOT EXISTS task_templates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task_code TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      primary_professional_role TEXT NOT NULL,
      category TEXT NOT NULL,
      persona TEXT NOT NULL,
      task_type TEXT NOT NULL,
      estimated_duration_hours REAL NOT NULL DEFAULT 1.0,
      automation_level TEXT NOT NULL DEFAULT 'manual',
      dependencies TEXT DEFAULT '[]',
      ui_requirements TEXT DEFAULT '{}',
      compliance_requirements TEXT DEFAULT '[]',
      stakeholder_notifications TEXT DEFAULT '[]',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
    -- Ecosystem Tasks Table (instances of task templates)
    CREATE TABLE IF NOT EXISTS ecosystem_tasks (
      id TEXT PRIMARY KEY,
      task_template_id INTEGER,
      transaction_id TEXT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      priority TEXT NOT NULL DEFAULT 'medium',
      assigned_to TEXT,
      assigned_user_id TEXT,
      due_date DATETIME,
      completed_at DATETIME,
      progress INTEGER DEFAULT 0,
      metadata TEXT DEFAULT '{}',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (task_template_id) REFERENCES task_templates(id)
    );
    
    -- Task Dependencies Table
    CREATE TABLE IF NOT EXISTS task_dependencies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      prerequisite_task_code TEXT NOT NULL,
      dependent_task_code TEXT NOT NULL,
      dependency_type TEXT NOT NULL DEFAULT 'SEQUENTIAL',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (prerequisite_task_code) REFERENCES task_templates(task_code),
      FOREIGN KEY (dependent_task_code) REFERENCES task_templates(task_code)
    );
    
    -- Ecosystem Coordination Table
    CREATE TABLE IF NOT EXISTS ecosystem_coordination (
      id TEXT PRIMARY KEY,
      transaction_id TEXT NOT NULL,
      coordination_type TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      required_roles TEXT NOT NULL DEFAULT '[]',
      assigned_professionals TEXT DEFAULT '[]',
      timeline_start DATETIME,
      timeline_end DATETIME,
      metadata TEXT DEFAULT '{}',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
    -- Create indexes for performance
    CREATE INDEX IF NOT EXISTS idx_task_templates_role ON task_templates(primary_professional_role);
    CREATE INDEX IF NOT EXISTS idx_task_templates_category ON task_templates(category);
    CREATE INDEX IF NOT EXISTS idx_ecosystem_tasks_status ON ecosystem_tasks(status);
    CREATE INDEX IF NOT EXISTS idx_ecosystem_tasks_assigned_to ON ecosystem_tasks(assigned_to);
    CREATE INDEX IF NOT EXISTS idx_ecosystem_tasks_transaction ON ecosystem_tasks(transaction_id);
  `);
  
  // Insert test data for TaskOrchestrationEngine
  await seedTestTaskTemplates(db);
  
  return db;
}

async function seedTestTaskTemplates(db: Database.Database) {
  const insertTaskTemplate = db.prepare(`
    INSERT INTO task_templates (
      task_code, title, description, primary_professional_role, category,
      persona, task_type, estimated_duration_hours, automation_level, dependencies,
      ui_requirements, compliance_requirements, stakeholder_notifications
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  // Real Irish property tasks for testing
  const testTasks = [
    {
      task_code: 'BUY-001-TEST',
      title: 'Register with Revenue for HTB (Help to Buy) - Test',
      description: 'Test HTB registration with Revenue.ie',
      primary_professional_role: 'BUYER',
      category: 'FINANCIAL_PLANNING',
      persona: 'BUYER',
      task_type: 'REGISTRATION',
      estimated_duration_hours: 2.0,
      automation_level: 'semi_automated',
      dependencies: '[]',
      ui_requirements: '{"element": "Revenue.ie integration form", "validation": "HTB eligibility check"}',
      compliance_requirements: '["REVENUE_COMMISSIONERS", "HTB_SCHEME_RULES"]',
      stakeholder_notifications: '["REVENUE_COMMISSIONERS", "MORTGAGE_BROKER"]'
    },
    {
      task_code: 'DEV-001-TEST',
      title: 'Planning Permission Application - Test',
      description: 'Test planning application submission',
      primary_professional_role: 'DEVELOPER',
      category: 'COMPLIANCE',
      persona: 'DEVELOPER',
      task_type: 'REGULATORY_APPLICATION',
      estimated_duration_hours: 40.0,
      automation_level: 'semi_automated',
      dependencies: '[]',
      ui_requirements: '{"element": "Planning portal integration"}',
      compliance_requirements: '["PLANNING_AND_DEVELOPMENT_ACT", "LOCAL_AREA_PLAN"]',
      stakeholder_notifications: '["PLANNING_AUTHORITY", "LEAD_ARCHITECT"]'
    },
    {
      task_code: 'SOL-001-TEST',
      title: 'Client AML/KYC Verification - Test',
      description: 'Test client verification process',
      primary_professional_role: 'BUYER_SOLICITOR',
      category: 'COMPLIANCE',
      persona: 'SOLICITOR',
      task_type: 'CLIENT_VERIFICATION',
      estimated_duration_hours: 2.0,
      automation_level: 'fully_automated',
      dependencies: '[]',
      ui_requirements: '{"element": "ID verification system"}',
      compliance_requirements: '["CRIMINAL_JUSTICE_MONEY_LAUNDERING_ACT", "LAW_SOCIETY_AML_HANDBOOK"]',
      stakeholder_notifications: '["COMPLIANCE_OFFICER", "LAW_SOCIETY"]'
    }
  ];
  
  for (const task of testTasks) {
    insertTaskTemplate.run(
      task.task_code,
      task.title,
      task.description,
      task.primary_professional_role,
      task.category,
      task.persona,
      task.task_type,
      task.estimated_duration_hours,
      task.automation_level,
      task.dependencies,
      task.ui_requirements,
      task.compliance_requirements,
      task.stakeholder_notifications
    );
  }
  
  console.log(`✅ Seeded ${testTasks.length} test task templates`);
}

export async function cleanupTestDatabase(): Promise<void> {
  try {
    await fs.unlink(TEST_DB_PATH);
    console.log('✅ Test database removed');
  } catch (error) {
    // Database might not exist, which is fine
  }
}

export function getTestDatabase(): Database.Database {
  return new Database(TEST_DB_PATH);
}