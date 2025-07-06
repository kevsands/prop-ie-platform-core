#!/usr/bin/env node

/**
 * Database Configuration Manager
 * Manages database schema consolidation and environment configuration
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI color codes for enhanced output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logHeader(message) {
  log(`\n${'='.repeat(60)}`, colors.cyan);
  log(`  ${message}`, colors.bright + colors.cyan);
  log(`${'='.repeat(60)}`, colors.cyan);
}

function logSection(message) {
  log(`\n${'-'.repeat(40)}`, colors.blue);
  log(`  ${message}`, colors.bright + colors.blue);
  log(`${'-'.repeat(40)}`, colors.blue);
}

class DatabaseConfigManager {
  constructor() {
    this.projectRoot = process.cwd();
    this.prismaDir = path.join(this.projectRoot, 'prisma');
    this.backupDir = path.join(this.projectRoot, 'database-backup');
    
    this.schemaFiles = {
      current: path.join(this.prismaDir, 'schema.prisma'),
      slp: path.join(this.prismaDir, 'schema-slp.prisma'),
      unified: path.join(this.prismaDir, 'schema-unified.prisma'),
      ftb: path.join(this.prismaDir, 'schema-ftb.prisma'),
      finance: path.join(this.prismaDir, 'finance-schema.prisma'),
      mongodb: path.join(this.prismaDir, 'schema-mongodb.prisma'),
      auth: path.join(this.prismaDir, 'schema-auth.prisma'),
      enterprise: path.join(this.prismaDir, 'schema-enterprise.prisma'),
      enterpriseV2: path.join(this.prismaDir, 'schema-enterprise-v2.prisma')
    };
  }

  /**
   * Analyze current database configuration
   */
  async analyzeCurrentState() {
    logHeader('DATABASE CONFIGURATION ANALYSIS');
    
    log('\n📊 Current Database State:', colors.bright);
    
    // Check existing schema files
    logSection('Schema Files Analysis');
    for (const [name, filePath] of Object.entries(this.schemaFiles)) {
      const exists = fs.existsSync(filePath);
      const status = exists ? '✅ EXISTS' : '❌ MISSING';
      const color = exists ? colors.green : colors.red;
      
      if (exists) {
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n').length;
        const models = (content.match(/^model\s+\w+/gm) || []).length;
        log(`  ${status} ${name.padEnd(15)} (${lines} lines, ${models} models)`, color);
      } else {
        log(`  ${status} ${name.padEnd(15)}`, color);
      }
    }

    // Check database files
    logSection('Database Files');
    const dbFiles = ['dev.db', 'shadow.db', 'test.db'];
    for (const dbFile of dbFiles) {
      const dbPath = path.join(this.prismaDir, dbFile);
      if (fs.existsSync(dbPath)) {
        const stats = fs.statSync(dbPath);
        const sizeKB = Math.round(stats.size / 1024);
        log(`  ✅ ${dbFile} (${sizeKB} KB)`, colors.green);
      } else {
        log(`  ❌ ${dbFile} (not found)`, colors.red);
      }
    }

    // Check environment configuration
    logSection('Environment Configuration');
    const envFiles = ['.env', '.env.local', '.env.production', '.env.template'];
    for (const envFile of envFiles) {
      const envPath = path.join(this.projectRoot, envFile);
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf8');
        const dbUrl = content.match(/DATABASE_URL\s*=\s*(.+)/);
        if (dbUrl) {
          const url = dbUrl[1].replace(/['"]/g, '');
          const provider = this.detectDatabaseProvider(url);
          log(`  ✅ ${envFile}: ${provider}`, colors.green);
        } else {
          log(`  ⚠️  ${envFile}: No DATABASE_URL found`, colors.yellow);
        }
      } else {
        log(`  ❌ ${envFile}: Not found`, colors.red);
      }
    }

    // Check package.json scripts
    logSection('Package.json Scripts Analysis');
    const packagePath = path.join(this.projectRoot, 'package.json');
    if (fs.existsSync(packagePath)) {
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      const dbScripts = Object.entries(packageJson.scripts || {})
        .filter(([key]) => key.includes('db:') || key.includes('prisma'));
      
      for (const [script, command] of dbScripts) {
        const schemaRef = command.match(/--schema=([^\s]+)/);
        if (schemaRef) {
          const referencedSchema = schemaRef[1];
          const exists = fs.existsSync(path.resolve(this.projectRoot, referencedSchema));
          const status = exists ? '✅' : '❌ BROKEN';
          const color = exists ? colors.green : colors.red;
          log(`  ${status} ${script}: ${referencedSchema}`, color);
        } else {
          log(`  ℹ️  ${script}: ${command}`, colors.blue);
        }
      }
    }

    return this.generateAnalysisReport();
  }

  /**
   * Detect database provider from URL
   */
  detectDatabaseProvider(url) {
    if (url.startsWith('file:')) return 'SQLite';
    if (url.startsWith('postgresql:') || url.startsWith('postgres:')) return 'PostgreSQL';
    if (url.startsWith('mongodb:')) return 'MongoDB';
    if (url.startsWith('mysql:')) return 'MySQL';
    return 'Unknown';
  }

  /**
   * Generate comprehensive analysis report
   */
  generateAnalysisReport() {
    const report = {
      timestamp: new Date().toISOString(),
      schemaFiles: {},
      databases: {},
      environment: {},
      issues: [],
      recommendations: []
    };

    // Analyze schema files
    for (const [name, filePath] of Object.entries(this.schemaFiles)) {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        report.schemaFiles[name] = {
          path: filePath,
          exists: true,
          lines: content.split('\n').length,
          models: (content.match(/^model\s+\w+/gm) || []).length,
          provider: this.extractProvider(content),
          enums: (content.match(/^enum\s+\w+/gm) || []).length
        };
      } else {
        report.schemaFiles[name] = { path: filePath, exists: false };
      }
    }

    // Check for inconsistencies
    this.detectIssues(report);
    this.generateRecommendations(report);

    return report;
  }

  /**
   * Extract database provider from schema content
   */
  extractProvider(content) {
    const providerMatch = content.match(/provider\s*=\s*["'](\w+)["']/);
    return providerMatch ? providerMatch[1] : 'unknown';
  }

  /**
   * Detect configuration issues
   */
  detectIssues(report) {
    // Check for provider inconsistencies
    const providers = Object.values(report.schemaFiles)
      .filter(schema => schema.exists)
      .map(schema => schema.provider)
      .filter(provider => provider !== 'unknown');
    
    const uniqueProviders = [...new Set(providers)];
    if (uniqueProviders.length > 1) {
      report.issues.push({
        type: 'PROVIDER_INCONSISTENCY',
        message: `Multiple database providers detected: ${uniqueProviders.join(', ')}`,
        severity: 'HIGH'
      });
    }

    // Check for missing unified schema
    if (!report.schemaFiles.unified.exists) {
      report.issues.push({
        type: 'MISSING_UNIFIED_SCHEMA',
        message: 'Unified schema file does not exist',
        severity: 'MEDIUM'
      });
    }

    // Check for package.json script mismatches
    const packagePath = path.join(this.projectRoot, 'package.json');
    if (fs.existsSync(packagePath)) {
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      const dbScripts = Object.entries(packageJson.scripts || {})
        .filter(([key]) => key.includes('db:'));
      
      for (const [script, command] of dbScripts) {
        const schemaRef = command.match(/--schema=([^\s]+)/);
        if (schemaRef) {
          const referencedSchema = schemaRef[1];
          if (!fs.existsSync(path.resolve(this.projectRoot, referencedSchema))) {
            report.issues.push({
              type: 'BROKEN_SCRIPT_REFERENCE',
              message: `Script "${script}" references non-existent schema: ${referencedSchema}`,
              severity: 'HIGH'
            });
          }
        }
      }
    }
  }

  /**
   * Generate recommendations based on analysis
   */
  generateRecommendations(report) {
    report.recommendations.push({
      priority: 'HIGH',
      action: 'CONSOLIDATE_SCHEMAS',
      description: 'Consolidate all schema files into a single unified schema',
      benefits: ['Single source of truth', 'Simplified maintenance', 'Reduced complexity']
    });

    if (report.schemaFiles.unified.exists) {
      report.recommendations.push({
        priority: 'MEDIUM',
        action: 'UPDATE_PACKAGE_SCRIPTS',
        description: 'Update package.json scripts to reference unified schema',
        benefits: ['Consistent build process', 'Simplified commands']
      });
    }

    report.recommendations.push({
      priority: 'MEDIUM',
      action: 'SETUP_ENVIRONMENT_CONFIG',
      description: 'Configure environment-specific database settings',
      benefits: ['Environment isolation', 'Production readiness']
    });

    report.recommendations.push({
      priority: 'LOW',
      action: 'BACKUP_EXISTING_DATA',
      description: 'Create backup of existing database and configuration',
      benefits: ['Data safety', 'Rollback capability']
    });
  }

  /**
   * Create backup of current configuration
   */
  async createBackup() {
    logHeader('CREATING CONFIGURATION BACKUP');

    // Create backup directory
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
      log(`✅ Created backup directory: ${this.backupDir}`, colors.green);
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupSubDir = path.join(this.backupDir, `backup-${timestamp}`);
    fs.mkdirSync(backupSubDir, { recursive: true });

    // Backup schema files
    logSection('Backing up Schema Files');
    for (const [name, filePath] of Object.entries(this.schemaFiles)) {
      if (fs.existsSync(filePath)) {
        const backupPath = path.join(backupSubDir, `${name}-schema.prisma`);
        fs.copyFileSync(filePath, backupPath);
        log(`  ✅ Backed up ${name} schema`, colors.green);
      }
    }

    // Backup database files
    logSection('Backing up Database Files');
    const dbFiles = fs.readdirSync(this.prismaDir).filter(file => file.endsWith('.db'));
    for (const dbFile of dbFiles) {
      const sourcePath = path.join(this.prismaDir, dbFile);
      const backupPath = path.join(backupSubDir, dbFile);
      fs.copyFileSync(sourcePath, backupPath);
      log(`  ✅ Backed up ${dbFile}`, colors.green);
    }

    // Backup environment files
    logSection('Backing up Environment Files');
    const envFiles = ['.env', '.env.local', '.env.production', '.env.template'];
    for (const envFile of envFiles) {
      const envPath = path.join(this.projectRoot, envFile);
      if (fs.existsSync(envPath)) {
        const backupPath = path.join(backupSubDir, envFile);
        fs.copyFileSync(envPath, backupPath);
        log(`  ✅ Backed up ${envFile}`, colors.green);
      }
    }

    // Create backup manifest
    const manifest = {
      timestamp,
      files: fs.readdirSync(backupSubDir),
      source: 'database-config-manager',
      purpose: 'Pre-consolidation backup'
    };
    fs.writeFileSync(
      path.join(backupSubDir, 'backup-manifest.json'),
      JSON.stringify(manifest, null, 2)
    );

    log(`\n✅ Backup completed: ${backupSubDir}`, colors.bright + colors.green);
    return backupSubDir;
  }

  /**
   * Validate unified schema
   */
  async validateUnifiedSchema() {
    logHeader('VALIDATING UNIFIED SCHEMA');

    if (!fs.existsSync(this.schemaFiles.unified)) {
      log('❌ Unified schema does not exist!', colors.red);
      return false;
    }

    try {
      // Run Prisma validate
      logSection('Running Prisma Validation');
      execSync(`npx prisma validate --schema=${this.schemaFiles.unified}`, {
        stdio: 'inherit',
        cwd: this.projectRoot
      });
      log('✅ Prisma validation passed', colors.green);

      // Try to generate client
      logSection('Testing Client Generation');
      execSync(`npx prisma generate --schema=${this.schemaFiles.unified}`, {
        stdio: 'inherit',
        cwd: this.projectRoot
      });
      log('✅ Client generation successful', colors.green);

      return true;
    } catch (error) {
      log(`❌ Validation failed: ${error.message}`, colors.red);
      return false;
    }
  }

  /**
   * Update package.json scripts to use unified schema
   */
  async updatePackageScripts() {
    logHeader('UPDATING PACKAGE.JSON SCRIPTS');

    const packagePath = path.join(this.projectRoot, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

    const originalScripts = { ...packageJson.scripts };
    const unifiedSchemaPath = './prisma/schema-unified.prisma';

    // Update database-related scripts
    const scriptsToUpdate = {
      'db:migrate': `prisma migrate dev --schema=${unifiedSchemaPath}`,
      'db:studio': `prisma studio --schema=${unifiedSchemaPath}`,
      'db:generate': `prisma generate --schema=${unifiedSchemaPath}`,
      'db:push': `prisma db push --schema=${unifiedSchemaPath}`,
      'db:seed': `prisma db seed --schema=${unifiedSchemaPath}`,
      'db:reset': `prisma migrate reset --schema=${unifiedSchemaPath}`,
      'db:validate': `prisma validate --schema=${unifiedSchemaPath}`
    };

    let updatedCount = 0;
    for (const [script, command] of Object.entries(scriptsToUpdate)) {
      if (packageJson.scripts[script] !== command) {
        packageJson.scripts[script] = command;
        updatedCount++;
        log(`  ✅ Updated ${script}`, colors.green);
      }
    }

    if (updatedCount > 0) {
      // Create backup of original package.json
      fs.writeFileSync(
        path.join(this.projectRoot, 'package.json.backup'),
        JSON.stringify({ scripts: originalScripts }, null, 2)
      );

      // Write updated package.json
      fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
      log(`\n✅ Updated ${updatedCount} scripts in package.json`, colors.bright + colors.green);
    } else {
      log('\nℹ️  No script updates needed', colors.blue);
    }

    return updatedCount;
  }

  /**
   * Generate migration plan
   */
  async generateMigrationPlan() {
    logHeader('GENERATING MIGRATION PLAN');

    const plan = {
      timestamp: new Date().toISOString(),
      phases: []
    };

    // Phase 1: Backup and Validation
    plan.phases.push({
      phase: 1,
      name: 'Backup and Validation',
      description: 'Create backups and validate unified schema',
      tasks: [
        'Create full backup of current configuration',
        'Validate unified schema syntax',
        'Test client generation',
        'Verify all models are included'
      ],
      estimatedTime: '15 minutes',
      risk: 'LOW'
    });

    // Phase 2: Configuration Update
    plan.phases.push({
      phase: 2,
      name: 'Configuration Update',
      description: 'Update application configuration',
      tasks: [
        'Update package.json scripts',
        'Update environment configuration',
        'Update database connection settings',
        'Test configuration changes'
      ],
      estimatedTime: '30 minutes',
      risk: 'MEDIUM'
    });

    // Phase 3: Database Migration
    plan.phases.push({
      phase: 3,
      name: 'Database Migration',
      description: 'Migrate existing data to new schema',
      tasks: [
        'Export existing SLP data',
        'Create migration scripts',
        'Apply unified schema',
        'Import existing data',
        'Validate data integrity'
      ],
      estimatedTime: '45 minutes',
      risk: 'HIGH'
    });

    // Phase 4: Application Integration
    plan.phases.push({
      phase: 4,
      name: 'Application Integration',
      description: 'Update application to use unified schema',
      tasks: [
        'Update data service layer',
        'Replace mock data usage',
        'Update repository implementations',
        'Test API endpoints',
        'Update frontend components'
      ],
      estimatedTime: '2 hours',
      risk: 'MEDIUM'
    });

    // Phase 5: Testing and Validation
    plan.phases.push({
      phase: 5,
      name: 'Testing and Validation',
      description: 'Comprehensive testing of new configuration',
      tasks: [
        'Run unit tests',
        'Test database operations',
        'Validate business logic',
        'Performance testing',
        'User acceptance testing'
      ],
      estimatedTime: '1 hour',
      risk: 'LOW'
    });

    const planPath = path.join(this.projectRoot, 'database-migration-plan.json');
    fs.writeFileSync(planPath, JSON.stringify(plan, null, 2));

    logSection('Migration Plan Summary');
    plan.phases.forEach(phase => {
      log(`  Phase ${phase.phase}: ${phase.name} (${phase.estimatedTime}, Risk: ${phase.risk})`, colors.blue);
    });

    log(`\n✅ Migration plan saved: ${planPath}`, colors.bright + colors.green);
    return plan;
  }

  /**
   * Execute consolidation process
   */
  async executeConsolidation(options = {}) {
    logHeader('EXECUTING DATABASE CONSOLIDATION');

    const { dryRun = false, skipBackup = false } = options;

    if (dryRun) {
      log('🔍 DRY RUN MODE - No changes will be made\n', colors.yellow);
    }

    try {
      // Step 1: Create backup
      if (!skipBackup && !dryRun) {
        await this.createBackup();
      }

      // Step 2: Validate unified schema
      if (await this.validateUnifiedSchema()) {
        log('✅ Schema validation successful', colors.green);
      } else {
        throw new Error('Schema validation failed');
      }

      // Step 3: Update package scripts
      if (!dryRun) {
        await this.updatePackageScripts();
      }

      // Step 4: Generate migration plan
      await this.generateMigrationPlan();

      logHeader('CONSOLIDATION COMPLETED SUCCESSFULLY');
      log('✅ Database configuration has been consolidated', colors.bright + colors.green);
      log('📋 Next steps:', colors.blue);
      log('  1. Review the migration plan', colors.blue);
      log('  2. Test the configuration in development', colors.blue);
      log('  3. Run database migrations', colors.blue);
      log('  4. Update application code to use new schema', colors.blue);

      return true;
    } catch (error) {
      log(`❌ Consolidation failed: ${error.message}`, colors.red);
      throw error;
    }
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'analyze';
  
  const manager = new DatabaseConfigManager();

  try {
    switch (command) {
      case 'analyze':
        const report = await manager.analyzeCurrentState();
        
        logSection('Analysis Summary');
        log(`📊 Total schema files: ${Object.keys(report.schemaFiles).length}`, colors.blue);
        log(`✅ Existing schemas: ${Object.values(report.schemaFiles).filter(s => s.exists).length}`, colors.green);
        log(`⚠️  Issues found: ${report.issues.length}`, colors.yellow);
        log(`💡 Recommendations: ${report.recommendations.length}`, colors.cyan);
        
        if (report.issues.length > 0) {
          logSection('Issues Found');
          report.issues.forEach(issue => {
            const color = issue.severity === 'HIGH' ? colors.red : 
                         issue.severity === 'MEDIUM' ? colors.yellow : colors.blue;
            log(`  ${issue.severity}: ${issue.message}`, color);
          });
        }
        break;

      case 'backup':
        await manager.createBackup();
        break;

      case 'validate':
        await manager.validateUnifiedSchema();
        break;

      case 'update-scripts':
        await manager.updatePackageScripts();
        break;

      case 'plan':
        await manager.generateMigrationPlan();
        break;

      case 'consolidate':
        const dryRun = args.includes('--dry-run');
        const skipBackup = args.includes('--skip-backup');
        await manager.executeConsolidation({ dryRun, skipBackup });
        break;

      case 'help':
      default:
        log('\n📋 Database Configuration Manager', colors.bright);
        log('\nAvailable commands:', colors.blue);
        log('  analyze         - Analyze current database configuration', colors.green);
        log('  backup          - Create backup of current configuration', colors.green);
        log('  validate        - Validate unified schema', colors.green);
        log('  update-scripts  - Update package.json scripts', colors.green);
        log('  plan            - Generate migration plan', colors.green);
        log('  consolidate     - Execute full consolidation process', colors.green);
        log('  help            - Show this help message', colors.green);
        log('\nOptions:', colors.blue);
        log('  --dry-run       - Run without making changes', colors.cyan);
        log('  --skip-backup   - Skip backup creation', colors.cyan);
        break;
    }
  } catch (error) {
    log(`\n❌ Error: ${error.message}`, colors.red);
    process.exit(1);
  }
}

// Run CLI if this file is executed directly
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = DatabaseConfigManager;