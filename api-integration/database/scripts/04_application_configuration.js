/**
 * ================================================================================
 * ENTERPRISE APPLICATION CONFIGURATION UPDATE - Phase 7
 * Updates application to use PostgreSQL instead of SQLite
 * SAFE CONFIGURATION SWITCH - Original files backed up automatically
 * ================================================================================
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class EnterpriseConfigurationUpdater {
    constructor() {
        this.updateId = `config_update_${new Date().toISOString().replace(/[:.]/g, '-')}`;
        this.logFile = path.join(process.cwd(), 'database', 'logs', `${this.updateId}.log`);
        
        this.state = {
            phase: 'application_configuration',
            startTime: new Date().toISOString(),
            backups: [],
            updates: [],
            errors: []
        };
        
        this.initializeLogging();
        this.log('🔧 Enterprise Configuration Updater Initialized');
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
     * Create backup of file before modification
     */
    async createFileBackup(filePath) {
        if (!fs.existsSync(filePath)) {
            return null;
        }

        const backupDir = path.join(process.cwd(), 'database', 'backups', 'config_backups');
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }

        const fileName = path.basename(filePath);
        const backupPath = path.join(backupDir, `${fileName}_backup_${this.updateId}`);
        
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            fs.writeFileSync(backupPath, content);
            
            const backup = {
                original: filePath,
                backup: backupPath,
                checksum: crypto.createHash('sha256').update(content).digest('hex'),
                timestamp: new Date().toISOString()
            };
            
            this.state.backups.push(backup);
            this.log(`✓ Backup created: ${fileName}`);
            return backup;
            
        } catch (error) {
            throw new Error(`Failed to backup ${filePath}: ${error.message}`);
        }
    }

    /**
     * Update database configuration file
     */
    async updateDatabaseConfig() {
        const configPath = path.join(process.cwd(), 'database', 'config', 'database.config.ts');
        
        try {
            await this.createFileBackup(configPath);
            
            if (!fs.existsSync(configPath)) {
                this.log('ℹ️  Database config file does not exist, skipping update');
                return;
            }

            let content = fs.readFileSync(configPath, 'utf8');
            
            // Update default environment to use PostgreSQL
            const originalContent = content;
            
            // Find and update the default database configuration
            content = content.replace(
                /configs\[process\.env\.NODE_ENV \|\| 'development'\]/g,
                "configs[process.env.NODE_ENV || 'postgresql']"
            );
            
            // Add PostgreSQL as default if not exists
            if (!content.includes("'postgresql'")) {
                content = content.replace(
                    /'development': {/,
                    `'postgresql': {
        type: 'postgresql',
        host: process.env.PG_HOST || 'localhost',
        port: parseInt(process.env.PG_PORT) || 5432,
        database: process.env.PG_DATABASE || 'propie_dev',
        username: process.env.PG_USER || 'postgres',
        password: process.env.PG_PASSWORD || 'postgres',
        ssl: process.env.PG_SSL === 'true' ? { rejectUnauthorized: false } : false,
        pool: {
            min: 5,
            max: process.env.NODE_ENV === 'production' ? 100 : 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 10000
        },
        logging: process.env.NODE_ENV === 'development'
    },
    'development': {`
                );
            }
            
            if (content !== originalContent) {
                fs.writeFileSync(configPath, content);
                this.state.updates.push({
                    file: configPath,
                    type: 'database_config',
                    description: 'Updated to use PostgreSQL by default',
                    timestamp: new Date().toISOString()
                });
                this.log('✓ Updated database configuration');
            } else {
                this.log('ℹ️  Database configuration already uses PostgreSQL');
            }
            
        } catch (error) {
            this.state.errors.push({
                file: configPath,
                error: error.message,
                timestamp: new Date().toISOString()
            });
            this.log(`⚠️  Failed to update database config: ${error.message}`);
        }
    }

    /**
     * Update environment configuration
     */
    async updateEnvironmentConfig() {
        const envPath = path.join(process.cwd(), '.env.local');
        
        try {
            await this.createFileBackup(envPath);
            
            let envContent = '';
            if (fs.existsSync(envPath)) {
                envContent = fs.readFileSync(envPath, 'utf8');
            }
            
            // Load PostgreSQL configuration
            const pgEnvPath = path.join(process.cwd(), '.env.postgresql');
            if (fs.existsSync(pgEnvPath)) {
                const pgConfig = fs.readFileSync(pgEnvPath, 'utf8');
                
                // Add PostgreSQL configuration to .env.local
                const postgresqlSection = `
# ================================================================================
# POSTGRESQL DATABASE CONFIGURATION (Enterprise Migration)
# Updated: ${new Date().toISOString()}
# ================================================================================
${pgConfig}

# Database Type Selection
DATABASE_TYPE=postgresql
NODE_ENV=postgresql

`;
                
                if (!envContent.includes('POSTGRESQL DATABASE CONFIGURATION')) {
                    envContent = postgresqlSection + envContent;
                    fs.writeFileSync(envPath, envContent);
                    
                    this.state.updates.push({
                        file: envPath,
                        type: 'environment_config',
                        description: 'Added PostgreSQL configuration',
                        timestamp: new Date().toISOString()
                    });
                    this.log('✓ Updated environment configuration');
                } else {
                    this.log('ℹ️  Environment already configured for PostgreSQL');
                }
            } else {
                this.log('⚠️  PostgreSQL environment file not found, manual configuration needed');
            }
            
        } catch (error) {
            this.state.errors.push({
                file: envPath,
                error: error.message,
                timestamp: new Date().toISOString()
            });
            this.log(`⚠️  Failed to update environment: ${error.message}`);
        }
    }

    /**
     * Update Next.js configuration if needed
     */
    async updateNextConfig() {
        const nextConfigPath = path.join(process.cwd(), 'next.config.js');
        
        try {
            await this.createFileBackup(nextConfigPath);
            
            if (!fs.existsSync(nextConfigPath)) {
                this.log('ℹ️  Next.js config not found, skipping update');
                return;
            }

            let content = fs.readFileSync(nextConfigPath, 'utf8');
            const originalContent = content;
            
            // Add PostgreSQL-specific configurations if needed
            if (!content.includes('postgresql')) {
                // This is a placeholder for any Next.js specific PostgreSQL configs
                // Currently no changes needed for basic PostgreSQL support
                this.log('ℹ️  Next.js configuration requires no PostgreSQL-specific changes');
            }
            
        } catch (error) {
            this.state.errors.push({
                file: nextConfigPath,
                error: error.message,
                timestamp: new Date().toISOString()
            });
            this.log(`⚠️  Failed to check Next.js config: ${error.message}`);
        }
    }

    /**
     * Update package.json scripts if needed
     */
    async updatePackageScripts() {
        const packagePath = path.join(process.cwd(), 'package.json');
        
        try {
            await this.createFileBackup(packagePath);
            
            const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
            let updated = false;
            
            // Add PostgreSQL-specific scripts if they don't exist
            const postgresqlScripts = {
                'db:connect-postgresql': 'node database/scripts/connect_postgresql.js',
                'db:status': 'node database/scripts/02_postgresql_test.js',
                'db:backup-postgresql': 'pg_dump $PG_DATABASE > database/backups/postgresql_backup_$(date +%Y-%m-%d_%H-%M-%S).sql'
            };
            
            for (const [scriptName, scriptCommand] of Object.entries(postgresqlScripts)) {
                if (!packageJson.scripts[scriptName]) {
                    packageJson.scripts[scriptName] = scriptCommand;
                    updated = true;
                }
            }
            
            if (updated) {
                fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
                this.state.updates.push({
                    file: packagePath,
                    type: 'package_scripts',
                    description: 'Added PostgreSQL-specific scripts',
                    timestamp: new Date().toISOString()
                });
                this.log('✓ Updated package.json scripts');
            } else {
                this.log('ℹ️  Package.json already has PostgreSQL scripts');
            }
            
        } catch (error) {
            this.state.errors.push({
                file: packagePath,
                error: error.message,
                timestamp: new Date().toISOString()
            });
            this.log(`⚠️  Failed to update package scripts: ${error.message}`);
        }
    }

    /**
     * Create connection test script
     */
    async createConnectionTestScript() {
        const scriptPath = path.join(process.cwd(), 'database', 'scripts', 'connect_postgresql.js');
        
        if (fs.existsSync(scriptPath)) {
            this.log('ℹ️  PostgreSQL connection script already exists');
            return;
        }

        const connectionScript = `/**
 * PostgreSQL Connection Test Script
 * Generated during enterprise migration: ${new Date().toISOString()}
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Load PostgreSQL configuration
const pgEnvFile = path.join(process.cwd(), '.env.postgresql');
if (fs.existsSync(pgEnvFile)) {
    const envContent = fs.readFileSync(pgEnvFile, 'utf8');
    envContent.split('\\n').forEach(line => {
        if (line.includes('=') && !line.startsWith('#')) {
            const [key, value] = line.split('=', 2);
            process.env[key.trim()] = value.trim();
        }
    });
}

const pool = new Pool({
    host: process.env.PG_HOST || 'localhost',
    port: parseInt(process.env.PG_PORT) || 5432,
    database: process.env.PG_DATABASE || 'propie_dev',
    user: process.env.PG_USER || 'postgres',
    password: process.env.PG_PASSWORD || 'postgres',
    ssl: process.env.PG_SSL === 'true' ? { rejectUnauthorized: false } : false
});

async function testConnection() {
    try {
        console.log('🔌 Testing PostgreSQL connection...');
        const client = await pool.connect();
        
        const result = await client.query('SELECT NOW() as current_time, version()');
        console.log('✅ PostgreSQL connection successful!');
        console.log('📊 Server time:', result.rows[0].current_time);
        console.log('🗄️  Version:', result.rows[0].version.split(' ').slice(0, 2).join(' '));
        
        // Test users table
        const userCount = await client.query('SELECT COUNT(*) FROM users');
        console.log('👥 Users in database:', userCount.rows[0].count);
        
        client.release();
        process.exit(0);
        
    } catch (error) {
        console.error('❌ PostgreSQL connection failed:', error.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

if (require.main === module) {
    testConnection();
}

module.exports = { testConnection };
`;

        try {
            fs.writeFileSync(scriptPath, connectionScript);
            this.state.updates.push({
                file: scriptPath,
                type: 'connection_script',
                description: 'Created PostgreSQL connection test script',
                timestamp: new Date().toISOString()
            });
            this.log('✓ Created PostgreSQL connection test script');
        } catch (error) {
            this.state.errors.push({
                file: scriptPath,
                error: error.message,
                timestamp: new Date().toISOString()
            });
            this.log(`⚠️  Failed to create connection script: ${error.message}`);
        }
    }

    /**
     * Generate configuration update report
     */
    async generateConfigurationReport() {
        const reportFile = path.join(process.cwd(), 'database', 'reports', `config_update_report_${this.updateId}.json`);
        
        const reportDir = path.dirname(reportFile);
        if (!fs.existsSync(reportDir)) {
            fs.mkdirSync(reportDir, { recursive: true });
        }
        
        const report = {
            updateId: this.updateId,
            timestamp: new Date().toISOString(),
            phase: 'application_configuration_update',
            migration: {
                from: 'SQLite',
                to: 'PostgreSQL',
                configurationChanges: this.state.updates.length,
                backupsCreated: this.state.backups.length,
                errors: this.state.errors.length
            },
            updates: this.state.updates,
            backups: this.state.backups,
            errors: this.state.errors,
            nextSteps: [
                'Test application with PostgreSQL configuration',
                'Verify all authentication flows work',
                'Monitor performance with new database',
                'Update deployment configurations if needed'
            ],
            rollbackInstructions: {
                description: 'To rollback configuration changes, restore files from backups',
                backupLocation: path.join(process.cwd(), 'database', 'backups', 'config_backups'),
                automatedRollback: 'npm run db:rollback-config'
            }
        };
        
        fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
        
        this.log(`📋 Configuration update report saved: ${reportFile}`);
        return report;
    }

    /**
     * Execute complete configuration update
     */
    async executeConfigurationUpdate() {
        try {
            this.log('\n🔧 ENTERPRISE APPLICATION CONFIGURATION UPDATE - PHASE 7');
            this.log('===========================================================');
            this.log(`Update ID: ${this.updateId}`);
            this.log('Converting application from SQLite to PostgreSQL configuration');
            
            // Step 1: Update database configuration
            await this.updateDatabaseConfig();
            
            // Step 2: Update environment configuration
            await this.updateEnvironmentConfig();
            
            // Step 3: Update Next.js configuration
            await this.updateNextConfig();
            
            // Step 4: Update package.json scripts
            await this.updatePackageScripts();
            
            // Step 5: Create connection test script
            await this.createConnectionTestScript();
            
            // Step 6: Generate report
            const report = await this.generateConfigurationReport();
            
            // Step 7: Final status
            if (this.state.errors.length === 0) {
                this.log('\n🎉 CONFIGURATION UPDATE COMPLETED SUCCESSFULLY');
                this.log('==============================================');
                this.log(`✅ ${this.state.updates.length} configuration files updated`);
                this.log(`✅ ${this.state.backups.length} backup files created`);
                this.log('✅ Application ready for PostgreSQL');
                this.log('\nYour application is now configured to use PostgreSQL!');
                this.log('\nNext step: Test the application with the new database configuration');
                this.log('\nTest commands:');
                this.log('  npm run db:connect-postgresql  # Test database connection');
                this.log('  npm run dev                    # Start application with PostgreSQL');
            } else {
                this.log('\n⚠️  CONFIGURATION UPDATE COMPLETED WITH WARNINGS');
                this.log('================================================');
                this.log(`✅ ${this.state.updates.length} files updated successfully`);
                this.log(`⚠️  ${this.state.errors.length} files had errors`);
                this.log('\\nReview the configuration report for details.');
            }
            
            return report;
            
        } catch (error) {
            this.log(`\n❌ CONFIGURATION UPDATE FAILED: ${error.message}`);
            throw error;
        }
    }
}

// Execute if called directly
if (require.main === module) {
    const updater = new EnterpriseConfigurationUpdater();
    
    updater.executeConfigurationUpdate()
        .then(() => {
            console.log('\n✅ Configuration update successful!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n❌ Configuration update failed:', error.message);
            process.exit(1);
        });
}

module.exports = EnterpriseConfigurationUpdater;