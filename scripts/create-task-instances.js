/**
 * Task Instance Generation Script
 * 
 * Creates real task instances from the 8,148+ enterprise task templates
 * and assigns them to the 289 professional users for active workflow management
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Direct SQLite connection
const dbPath = path.join(__dirname, '../prisma/dev.db');
const db = new sqlite3.Database(dbPath);

// Helper to generate realistic IDs
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

/**
 * Task Instance Priority Distribution
 */
const PRIORITY_DISTRIBUTION = {
  'critical': 0.05,    // 5% critical
  'high': 0.15,        // 15% high
  'medium': 0.60,      // 60% medium
  'low': 0.20          // 20% low
};

/**
 * Task Status Distribution for realistic workflow
 */
const STATUS_DISTRIBUTION = {
  'pending': 0.30,          // 30% pending
  'assigned': 0.20,         // 20% assigned
  'in_progress': 0.25,      // 25% in progress
  'waiting_approval': 0.10, // 10% waiting approval
  'completed': 0.10,        // 10% completed
  'blocked': 0.05           // 5% blocked
};

/**
 * Get all task templates from database
 */
function getTaskTemplates() {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        id,
        task_code,
        title,
        description,
        primary_professional_role,
        secondary_professional_roles,
        category,
        subcategory,
        estimated_duration_hours,
        compliance_required,
        automation_level,
        dependencies,
        requires_professional_certification,
        regulatory_body
      FROM task_templates 
      WHERE is_active = TRUE
      ORDER BY primary_professional_role, category
    `;
    
    db.all(query, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

/**
 * Get all professional users grouped by role
 */
function getProfessionalUsers() {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        id,
        name,
        professional_role_primary,
        professional_specializations,
        professional_certifications,
        availability_status,
        project_capacity,
        experience_years
      FROM users 
      WHERE professional_role_primary IS NOT NULL 
      AND active = 1
      ORDER BY professional_role_primary, experience_years DESC
    `;
    
    db.all(query, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        // Group by professional role
        const usersByRole = {};
        rows.forEach(user => {
          if (!usersByRole[user.professional_role_primary]) {
            usersByRole[user.professional_role_primary] = [];
          }
          usersByRole[user.professional_role_primary].push(user);
        });
        resolve(usersByRole);
      }
    });
  });
}

/**
 * Generate random priority based on distribution
 */
function getRandomPriority() {
  const rand = Math.random();
  let cumulative = 0;
  
  for (const [priority, probability] of Object.entries(PRIORITY_DISTRIBUTION)) {
    cumulative += probability;
    if (rand <= cumulative) {
      return priority;
    }
  }
  return 'medium';
}

/**
 * Generate random status based on distribution
 */
function getRandomStatus() {
  const rand = Math.random();
  let cumulative = 0;
  
  for (const [status, probability] of Object.entries(STATUS_DISTRIBUTION)) {
    cumulative += probability;
    if (rand <= cumulative) {
      return status;
    }
  }
  return 'pending';
}

/**
 * Generate realistic dates for task lifecycle
 */
function generateTaskDates(status, estimatedHours) {
  const now = new Date();
  const createdAt = new Date(now - Math.random() * 30 * 24 * 60 * 60 * 1000); // Up to 30 days ago
  
  let scheduledStart, actualStart, dueDate, completedAt;
  
  // Schedule start 1-7 days after creation
  scheduledStart = new Date(createdAt.getTime() + (Math.random() * 7 + 1) * 24 * 60 * 60 * 1000);
  
  // Due date based on estimated duration + buffer
  const bufferHours = estimatedHours * 0.2; // 20% buffer
  dueDate = new Date(scheduledStart.getTime() + (estimatedHours + bufferHours) * 60 * 60 * 1000);
  
  if (status === 'in_progress' || status === 'review' || status === 'completed') {
    // Task has started
    actualStart = new Date(scheduledStart.getTime() + (Math.random() * 2 - 1) * 24 * 60 * 60 * 1000); // ±1 day variance
  }
  
  if (status === 'completed') {
    // Task is completed
    const completionVariance = estimatedHours * 0.3; // ±30% time variance
    const actualDuration = estimatedHours + (Math.random() * 2 - 1) * completionVariance;
    completedAt = new Date(actualStart.getTime() + actualDuration * 60 * 60 * 1000);
  }
  
  return {
    createdAt: createdAt.toISOString(),
    scheduledStart: scheduledStart.toISOString(),
    actualStart: actualStart?.toISOString(),
    dueDate: dueDate.toISOString(),
    completedAt: completedAt?.toISOString()
  };
}

/**
 * Create task instance from template
 */
function createTaskInstance(template, assignedUser, projectContext) {
  const status = getRandomStatus();
  const priority = getRandomPriority();
  const dates = generateTaskDates(status, template.estimated_duration_hours);
  
  // Generate completion percentage based on status
  let completionPercentage = 0;
  switch (status) {
    case 'pending': completionPercentage = 0; break;
    case 'assigned': completionPercentage = 0; break;
    case 'in_progress': completionPercentage = Math.floor(Math.random() * 70 + 10); break; // 10-80%
    case 'waiting_approval': completionPercentage = Math.floor(Math.random() * 20 + 80); break; // 80-100%
    case 'completed': completionPercentage = 100; break;
    case 'blocked': completionPercentage = Math.floor(Math.random() * 50); break; // 0-50%
  }
  
  const instanceId = `TASK-${generateId()}`;
  
  // Convert hours to minutes for database
  const estimatedMinutes = template.estimated_duration_hours * 60;
  const actualMinutes = status === 'completed' ? 
    Math.floor(estimatedMinutes * (0.7 + Math.random() * 0.6)) : null; // 70-130% of estimate
  
  return {
    id: instanceId,
    task_code: `${template.task_code}-${Date.now()}`,
    task_template_id: template.id,
    
    // Assignment
    assigned_to: assignedUser.id,
    assigned_by: 'system', // System assigned
    
    // Project context
    transaction_id: projectContext.type === 'property_transaction' ? projectContext.id : null,
    development_id: projectContext.type === 'development_project' ? projectContext.id : null,
    
    // Status and progress
    status,
    priority,
    completion_percentage: completionPercentage,
    quality_status: status === 'completed' ? 
      ['acceptable', 'good', 'excellent'][Math.floor(Math.random() * 3)] : 'not_assessed',
    
    // Timeline
    scheduled_start: dates.scheduledStart,
    due_date: dates.dueDate,
    started_at: dates.actualStart,
    completed_at: dates.completedAt,
    
    // Effort and timing
    estimated_duration_minutes: estimatedMinutes,
    actual_duration_minutes: actualMinutes,
    estimated_effort_hours: template.estimated_duration_hours,
    actual_effort_hours: actualMinutes ? actualMinutes / 60 : null,
    
    // Task customization
    custom_title: null, // Use template title
    custom_description: `Context: ${projectContext.name} - ${projectContext.address}`,
    site_specific_requirements: projectContext.type === 'development_project' ? 
      'Development project specific requirements apply' : null,
    
    // Notes and collaboration
    notes: JSON.stringify([
      {
        id: generateId(),
        timestamp: dates.createdAt,
        author: 'system',
        content: `Task automatically generated from template ${template.task_code} and assigned to ${assignedUser.name}`,
        type: 'system'
      }
    ]),
    
    // Risk and quality
    risk_level: ['low', 'low', 'medium', 'high'][Math.floor(Math.random() * 4)], // Weighted toward low
    quality_score: status === 'completed' ? Math.floor(Math.random() * 2 + 4) : null, // 4-5 for completed
    
    // Approval workflow
    requires_approval: template.compliance_required,
    approval_workflow_stage: 0,
    
    // Integration and automation
    ai_assistance_used: Math.random() < 0.3, // 30% use AI assistance
    automation_applied: template.automation_level === 'fully_automated' ? 
      JSON.stringify(['template_instantiation', 'smart_routing']) : JSON.stringify([]),
    
    // Metadata
    metadata: JSON.stringify({
      template_code: template.task_code,
      project_context: projectContext.type,
      routing_confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
      routing_rationale: `Assigned to ${assignedUser.name} based on role match (${assignedUser.professional_role_primary}) and experience (${assignedUser.experience_years} years)`
    }),
    
    tags: JSON.stringify([
      template.category,
      template.subcategory,
      assignedUser.professional_role_primary,
      projectContext.type
    ].filter(Boolean)),
    
    created_at: dates.createdAt,
    updated_at: new Date().toISOString()
  };
}

/**
 * Generate project contexts for task assignment
 */
function generateProjectContexts(usersByRole) {
  const contexts = [];
  
  // Get some users for context generation
  const buyers = usersByRole['BUYER'] || [];
  const developers = usersByRole['DEVELOPER'] || [];
  
  // Generate 50 property transaction contexts
  for (let i = 0; i < 50; i++) {
    const buyer = buyers[Math.floor(Math.random() * buyers.length)];
    const developer = developers[Math.floor(Math.random() * developers.length)];
    
    contexts.push({
      type: 'property_transaction',
      id: `PROP-TXN-${generateId()}`,
      propertyId: `PROP-${generateId()}`,
      buyerId: buyer?.id,
      developerId: developer?.id,
      name: `Property Transaction ${i + 1}`,
      address: `Property ${i + 1}, Dublin`,
      value: Math.floor(Math.random() * 500000 + 200000) // €200k-700k
    });
  }
  
  // Generate 20 development project contexts
  for (let i = 0; i < 20; i++) {
    const developer = developers[Math.floor(Math.random() * developers.length)];
    
    contexts.push({
      type: 'development_project',
      id: `DEV-PROJ-${generateId()}`,
      propertyId: null,
      buyerId: null,
      developerId: developer?.id,
      name: `Development Project ${i + 1}`,
      address: `Development Site ${i + 1}, Ireland`,
      value: Math.floor(Math.random() * 5000000 + 1000000) // €1M-6M
    });
  }
  
  return contexts;
}

/**
 * Insert task instance into database
 */
function insertTaskInstance(taskInstance) {
  return new Promise((resolve, reject) => {
    const insertSQL = `
      INSERT INTO ecosystem_tasks (
        id, task_code, task_template_id,
        assigned_to, assigned_by,
        transaction_id, development_id,
        status, priority, completion_percentage, quality_status,
        scheduled_start, due_date, started_at, completed_at,
        estimated_duration_minutes, actual_duration_minutes,
        estimated_effort_hours, actual_effort_hours,
        custom_title, custom_description, site_specific_requirements,
        notes, risk_level, quality_score,
        requires_approval, approval_workflow_stage,
        ai_assistance_used, automation_applied,
        metadata, tags, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      taskInstance.id,
      taskInstance.task_code,
      taskInstance.task_template_id,
      taskInstance.assigned_to,
      taskInstance.assigned_by,
      taskInstance.transaction_id,
      taskInstance.development_id,
      taskInstance.status,
      taskInstance.priority,
      taskInstance.completion_percentage,
      taskInstance.quality_status,
      taskInstance.scheduled_start,
      taskInstance.due_date,
      taskInstance.started_at,
      taskInstance.completed_at,
      taskInstance.estimated_duration_minutes,
      taskInstance.actual_duration_minutes,
      taskInstance.estimated_effort_hours,
      taskInstance.actual_effort_hours,
      taskInstance.custom_title,
      taskInstance.custom_description,
      taskInstance.site_specific_requirements,
      taskInstance.notes,
      taskInstance.risk_level,
      taskInstance.quality_score,
      taskInstance.requires_approval ? 1 : 0,
      taskInstance.approval_workflow_stage,
      taskInstance.ai_assistance_used ? 1 : 0,
      taskInstance.automation_applied,
      taskInstance.metadata,
      taskInstance.tags,
      taskInstance.created_at,
      taskInstance.updated_at
    ];
    
    db.run(insertSQL, values, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.lastID);
      }
    });
  });
}

/**
 * Main task instance generation function
 */
async function generateTaskInstances() {
  console.log('🚀 Starting Task Instance Generation...\n');
  
  try {
    // Get task templates and professional users
    console.log('📋 Loading task templates and professional users...');
    const [templates, usersByRole] = await Promise.all([
      getTaskTemplates(),
      getProfessionalUsers()
    ]);
    
    console.log(`✅ Loaded ${templates.length} task templates`);
    console.log(`✅ Loaded ${Object.values(usersByRole).flat().length} professional users across ${Object.keys(usersByRole).length} roles`);
    
    // Generate project contexts
    console.log('\n🏗️ Generating project contexts...');
    const projectContexts = generateProjectContexts(usersByRole);
    console.log(`✅ Generated ${projectContexts.length} project contexts`);
    
    // Generate task instances
    console.log('\n⚙️ Generating task instances...');
    let totalInstances = 0;
    let successfulInserts = 0;
    const instancesPerTemplate = 3; // Generate 3 instances per template on average
    
    const roleTemplateMap = {};
    templates.forEach(template => {
      const role = template.primary_professional_role;
      if (!roleTemplateMap[role]) {
        roleTemplateMap[role] = [];
      }
      roleTemplateMap[role].push(template);
    });
    
    for (const [role, roleTemplates] of Object.entries(roleTemplateMap)) {
      const availableUsers = usersByRole[role] || [];
      
      if (availableUsers.length === 0) {
        console.log(`⚠️  No users available for role: ${role} (${roleTemplates.length} templates skipped)`);
        continue;
      }
      
      console.log(`\n📋 Processing ${roleTemplates.length} templates for ${role} (${availableUsers.length} users)`);
      
      for (const template of roleTemplates) {
        // Generate 1-5 instances per template based on role importance
        const instanceCount = Math.floor(Math.random() * 4) + 1;
        
        for (let i = 0; i < instanceCount; i++) {
          // Select user based on workload distribution
          const userIndex = Math.floor(Math.random() * availableUsers.length);
          const assignedUser = availableUsers[userIndex];
          
          // Select random project context
          const contextIndex = Math.floor(Math.random() * projectContexts.length);
          const projectContext = projectContexts[contextIndex];
          
          // Create task instance
          const taskInstance = createTaskInstance(template, assignedUser, projectContext);
          
          try {
            await insertTaskInstance(taskInstance);
            successfulInserts++;
          } catch (error) {
            console.error(`❌ Error inserting task instance: ${error.message}`);
          }
          
          totalInstances++;
          
          // Progress indicator
          if (totalInstances % 500 === 0) {
            console.log(`   💾 Processed ${totalInstances} task instances...`);
          }
          
          // Small delay to avoid overwhelming the database
          if (totalInstances % 100 === 0) {
            await new Promise(resolve => setTimeout(resolve, 10));
          }
        }
      }
    }
    
    console.log(`\n🎉 Task Instance Generation Complete!`);
    console.log(`📊 Summary:`);
    console.log(`   • Total Instances Created: ${totalInstances}`);
    console.log(`   • Successfully Inserted: ${successfulInserts}`);
    console.log(`   • Templates Processed: ${templates.length}`);
    console.log(`   • Professional Users: ${Object.values(usersByRole).flat().length}`);
    console.log(`   • Project Contexts: ${projectContexts.length}`);
    console.log(`   • Average Instances per Template: ${(successfulInserts / templates.length).toFixed(1)}`);
    
    // Generate status distribution report
    const statusQuery = `
      SELECT status, COUNT(*) as count 
      FROM ecosystem_tasks 
      GROUP BY status 
      ORDER BY count DESC
    `;
    
    db.all(statusQuery, [], (err, statusRows) => {
      if (!err) {
        console.log(`\n📈 Task Status Distribution:`);
        statusRows.forEach(row => {
          console.log(`   ${row.status}: ${row.count} tasks`);
        });
      }
    });
    
    // Generate role distribution report  
    const roleQuery = `
      SELECT u.professional_role_primary, COUNT(*) as count 
      FROM ecosystem_tasks et
      JOIN users u ON et.assigned_to = u.id
      GROUP BY u.professional_role_primary 
      ORDER BY count DESC 
      LIMIT 10
    `;
    
    db.all(roleQuery, [], (err, roleRows) => {
      if (!err) {
        console.log(`\n👥 Top 10 Roles by Task Count:`);
        roleRows.forEach(row => {
          console.log(`   ${row.professional_role_primary}: ${row.count} tasks`);
        });
      }
    });
    
    console.log(`\n✅ Task instances are ready for AI routing and professional assignment!`);
    
  } catch (error) {
    console.error('💥 Error generating task instances:', error);
    throw error;
  }
}

/**
 * Error handling and cleanup
 */
async function main() {
  try {
    await generateTaskInstances();
  } catch (error) {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  } finally {
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
      } else {
        console.log('Database connection closed.');
      }
    });
  }
}

// Execute the script
if (require.main === module) {
  main();
}

module.exports = {
  generateTaskInstances,
  createTaskInstance,
  generateProjectContexts
};