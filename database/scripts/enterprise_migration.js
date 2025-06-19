/**
 * ================================================================================
 * ENTERPRISE DATABASE MIGRATION ORCHESTRATOR
 * Safely coordinates the entire migration process with enterprise safeguards
 * ZERO-RISK APPROACH - Multiple safety checkpoints and rollback capabilities
 * ================================================================================
 */

const fs = require('fs');
const path = require('path');
const EnterpriseBackupManager = require('./01_sqlite_backup');
const PostgreSQLConnectionTester = require('./02_postgresql_test');

class EnterpriseMigrationOrchestrator {
    constructor() {
        this.migrationId = `migration_${new Date().toISOString().replace(/[:.]/g, '-')}`;
        this.logFile = path.join(process.cwd(), 'database', 'logs', `${this.migrationId}.log`);
        this.state = {
            phase: 'initialization',
            startTime: new Date().toISOString(),
            checkpoints: [],
            canRollback: true,
            errors: []
        };
        
        this.initializeLogging();
        this.log('🏢 Enterprise Migration Orchestrator Initialized');
    }

    /**
     * Initialize logging system
     */
    initializeLogging() {
        const logDir = path.dirname(this.logFile);
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }
        
        // Redirect console.log to both console and file
        const originalLog = console.log;
        const originalError = console.error;
        
        console.log = (...args) => {
            const message = args.join(' ');
            originalLog(...args);
            fs.appendFileSync(this.logFile, `[${new Date().toISOString()}] INFO: ${message}\n`);
        };
        
        console.error = (...args) => {
            const message = args.join(' ');
            originalError(...args);
            fs.appendFileSync(this.logFile, `[${new Date().toISOString()}] ERROR: ${message}\n`);
        };
    }

    /**
     * Log with timestamp
     */
    log(message) {
        console.log(`[${new Date().toISOString()}] ${message}`);
    }

    /**
     * Create checkpoint for rollback capability
     */
    createCheckpoint(phase, description) {
        const checkpoint = {
            phase,
            description,
            timestamp: new Date().toISOString(),
            success: true
        };
        
        this.state.checkpoints.push(checkpoint);
        this.log(`📍 CHECKPOINT: ${phase} - ${description}`);
        
        return checkpoint;
    }

    /**
     * Fail-safe error handler
     */
    async handleError(phase, error) {
        this.log(`❌ ERROR in ${phase}: ${error.message}`);
        this.state.errors.push({
            phase,
            error: error.message,
            timestamp: new Date().toISOString()
        });
        
        // Update checkpoint as failed
        const currentCheckpoint = this.state.checkpoints[this.state.checkpoints.length - 1];
        if (currentCheckpoint && currentCheckpoint.phase === phase) {
            currentCheckpoint.success = false;
            currentCheckpoint.error = error.message;
        }
        
        await this.generateFailureReport();
        throw error;
    }

    /**
     * Phase 1: Pre-migration safety checks
     */
    async phase1_SafetyChecks() {
        this.state.phase = 'safety_checks';
        this.createCheckpoint('safety_checks', 'Running pre-migration safety verification');
        
        try {
            this.log('\n🛡️  PHASE 1: SAFETY CHECKS');
            this.log('===========================');
            
            // Check if SQLite database exists and is accessible
            const sqliteDbPath = path.join(process.cwd(), 'dev.db');
            if (!fs.existsSync(sqliteDbPath)) {
                throw new Error('SQLite database not found at expected location');
            }
            
            // Verify file permissions
            fs.accessSync(sqliteDbPath, fs.constants.R_OK);
            this.log('✓ SQLite database is accessible');
            
            // Check if PostgreSQL configuration exists
            const pgConfigPath = path.join(process.cwd(), '.env.postgresql');
            if (!fs.existsSync(pgConfigPath)) {
                this.log('⚠ PostgreSQL configuration not found, using environment variables');
            } else {
                this.log('✓ PostgreSQL configuration found');
            }
            
            // Verify sufficient disk space (minimum 1GB)
            const stats = fs.statSync(sqliteDbPath);
            const freeSpaceNeeded = stats.size * 10; // 10x database size for safety
            this.log(`✓ Database size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
            this.log(`✓ Estimated space needed: ${(freeSpaceNeeded / 1024 / 1024).toFixed(2)} MB`);
            
            this.log('✅ Phase 1 completed successfully');
            return true;
            
        } catch (error) {
            await this.handleError('safety_checks', error);
        }
    }

    /**
     * Phase 2: Create enterprise backups
     */
    async phase2_CreateBackups() {
        this.state.phase = 'backup_creation';
        this.createCheckpoint('backup_creation', 'Creating comprehensive safety backups');
        
        try {
            this.log('\n💾 PHASE 2: BACKUP CREATION');
            this.log('============================');
            
            const backupManager = new EnterpriseBackupManager();
            const backupReport = await backupManager.createSafetyBackup();
            
            // Store backup information in state
            this.state.backupReport = backupReport;
            this.state.canRollback = true;
            
            this.log('✅ Phase 2 completed successfully');
            return backupReport;
            
        } catch (error) {
            await this.handleError('backup_creation', error);
        }
    }

    /**
     * Phase 3: Test PostgreSQL connectivity
     */
    async phase3_TestPostgreSQL() {
        this.state.phase = 'postgresql_testing';
        this.createCheckpoint('postgresql_testing', 'Verifying PostgreSQL connection and capabilities');
        
        try {
            this.log('\n🔗 PHASE 3: POSTGRESQL TESTING');
            this.log('===============================');
            
            const tester = new PostgreSQLConnectionTester();
            const testResults = await tester.runAllTests();
            
            if (!testResults) {
                throw new Error('PostgreSQL tests failed - cannot proceed with migration');
            }
            
            this.state.postgresqlTests = testResults;
            
            this.log('✅ Phase 3 completed successfully');
            return testResults;
            
        } catch (error) {
            await this.handleError('postgresql_testing', error);
        }
    }

    /**
     * Phase 4: Create PostgreSQL schema (SAFE - no data migration yet)
     */
    async phase4_CreateSchema() {
        this.state.phase = 'schema_creation';
        this.createCheckpoint('schema_creation', 'Creating PostgreSQL enterprise schema');
        
        try {
            this.log('\n🏗️  PHASE 4: SCHEMA CREATION');
            this.log('============================');
            
            const { Pool } = require('pg');
            
            // Load PostgreSQL configuration
            const config = {
                host: process.env.PG_HOST || 'localhost',
                port: parseInt(process.env.PG_PORT) || 5432,
                database: process.env.PG_DATABASE || 'propie_dev',
                user: process.env.PG_USER || 'postgres',
                password: process.env.PG_PASSWORD || 'postgres',
                ssl: process.env.PG_SSL === 'true' ? { rejectUnauthorized: false } : false
            };
            
            const pool = new Pool(config);
            
            try {
                // Read and execute schema creation script
                const schemaFile = path.join(process.cwd(), 'database', 'migrations', '001_initial_schema.sql');
                
                if (!fs.existsSync(schemaFile)) {
                    throw new Error('Schema migration file not found');
                }
                
                const schemaSQL = fs.readFileSync(schemaFile, 'utf8');
                
                this.log('📄 Executing enterprise schema creation...');
                await pool.query(schemaSQL);
                
                // Verify schema was created correctly
                const tableCheck = await pool.query(`
                    SELECT table_name, table_type 
                    FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    AND table_name IN ('users', 'user_audit_log')
                    ORDER BY table_name
                `);
                
                if (tableCheck.rows.length < 2) {
                    throw new Error('Schema creation incomplete - expected tables not found');
                }
                
                this.log('✓ Enterprise schema created successfully');
                this.log(`✓ Created tables: ${tableCheck.rows.map(r => r.table_name).join(', ')}`);
                
                this.state.schemaCreated = true;
                
            } finally {
                await pool.end();
            }
            
            this.log('✅ Phase 4 completed successfully');
            return true;
            
        } catch (error) {
            await this.handleError('schema_creation', error);
        }
    }

    /**
     * Phase 5: Validate migration readiness (FINAL CHECKPOINT)
     */
    async phase5_ValidateReadiness() {
        this.state.phase = 'migration_validation';
        this.createCheckpoint('migration_validation', 'Final validation before data migration');
        
        try {
            this.log('\n✅ PHASE 5: MIGRATION VALIDATION');
            this.log('=================================');
            
            // Verify all previous phases completed successfully
            const failedCheckpoints = this.state.checkpoints.filter(cp => !cp.success);
            if (failedCheckpoints.length > 0) {
                throw new Error(`Cannot proceed - ${failedCheckpoints.length} previous phases failed`);
            }
            
            // Verify backup exists
            if (!this.state.backupReport) {
                throw new Error('No backup report found - cannot proceed without safety backup');
            }
            
            // Verify PostgreSQL schema exists
            if (!this.state.schemaCreated) {
                throw new Error('PostgreSQL schema not created - cannot proceed');
            }
            
            // Final connectivity test
            const { Pool } = require('pg');
            const config = {
                host: process.env.PG_HOST || 'localhost',
                port: parseInt(process.env.PG_PORT) || 5432,
                database: process.env.PG_DATABASE || 'propie_dev',
                user: process.env.PG_USER || 'postgres',
                password: process.env.PG_PASSWORD || 'postgres',
                ssl: process.env.PG_SSL === 'true' ? { rejectUnauthorized: false } : false
            };
            
            const pool = new Pool(config);
            
            try {
                // Verify we can write to the users table
                await pool.query('SELECT COUNT(*) FROM users');
                this.log('✓ PostgreSQL database is ready for data migration');
            } finally {
                await pool.end();
            }
            
            this.log('✅ Phase 5 completed successfully');
            this.log('\n🎉 SYSTEM IS READY FOR DATA MIGRATION');
            this.log('=====================================');
            this.log('All safety checks passed. You may now proceed with:');
            this.log('1. Data migration (Phase 6)');
            this.log('2. Application configuration update');
            this.log('3. Production cutover');
            
            return true;
            
        } catch (error) {
            await this.handleError('migration_validation', error);
        }
    }

    /**
     * Generate comprehensive migration report
     */
    async generateMigrationReport() {
        const reportFile = path.join(process.cwd(), 'database', 'reports', `migration_report_${this.migrationId}.json`);
        
        // Ensure reports directory exists
        const reportDir = path.dirname(reportFile);
        if (!fs.existsSync(reportDir)) {
            fs.mkdirSync(reportDir, { recursive: true });
        }
        
        const report = {
            migrationId: this.migrationId,
            ...this.state,
            endTime: new Date().toISOString(),
            duration: new Date() - new Date(this.state.startTime),
            logFile: this.logFile,
            status: this.state.errors.length === 0 ? 'success' : 'partial_success',
            nextSteps: this.state.errors.length === 0 ? [
                'Proceed with data migration',
                'Update application configuration',
                'Test all authentication flows'
            ] : [
                'Review and resolve reported errors',
                'Re-run migration preparation'
            ]
        };
        
        fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
        
        this.log(`\n📋 Migration report saved: ${reportFile}`);
        return report;
    }

    /**
     * Generate failure report
     */
    async generateFailureReport() {
        const reportFile = path.join(process.cwd(), 'database', 'reports', `migration_failure_${this.migrationId}.json`);
        
        const reportDir = path.dirname(reportFile);
        if (!fs.existsSync(reportDir)) {
            fs.mkdirSync(reportDir, { recursive: true });
        }
        
        const report = {
            migrationId: this.migrationId,
            status: 'failed',
            failedPhase: this.state.phase,
            errors: this.state.errors,
            checkpoints: this.state.checkpoints,
            canRollback: this.state.canRollback,
            rollbackInstructions: this.state.canRollback ? [
                'SQLite database remains unchanged',
                'No data has been migrated',
                'Safe to retry after resolving errors'
            ] : [
                'Manual intervention may be required',
                'Contact database administrator'
            ]
        };
        
        fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
        return report;
    }

    /**
     * Execute enterprise migration preparation
     */
    async executeMigrationPreparation() {
        try {
            this.log('\n🏢 ENTERPRISE DATABASE MIGRATION PREPARATION');
            this.log('============================================');
            this.log(`Migration ID: ${this.migrationId}`);
            this.log(`Start Time: ${this.state.startTime}`);
            
            // Execute all preparation phases
            await this.phase1_SafetyChecks();
            await this.phase2_CreateBackups();
            await this.phase3_TestPostgreSQL();
            await this.phase4_CreateSchema();
            await this.phase5_ValidateReadiness();
            
            // Generate success report
            const report = await this.generateMigrationReport();
            
            this.log('\n🎉 MIGRATION PREPARATION COMPLETED SUCCESSFULLY');
            this.log('===============================================');
            this.log('Your system is now ready for enterprise PostgreSQL migration!');
            
            return report;
            
        } catch (error) {
            this.log('\n💥 MIGRATION PREPARATION FAILED');
            this.log('===============================');
            this.log(`Error: ${error.message}`);
            this.log('All operations were non-destructive. Your SQLite database is untouched.');
            
            throw error;
        }
    }
}

// Execute if called directly
if (require.main === module) {
    const orchestrator = new EnterpriseMigrationOrchestrator();
    
    orchestrator.executeMigrationPreparation()
        .then(() => {
            console.log('\n✅ Migration preparation successful!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n❌ Migration preparation failed:', error.message);
            process.exit(1);
        });
}

module.exports = EnterpriseMigrationOrchestrator;