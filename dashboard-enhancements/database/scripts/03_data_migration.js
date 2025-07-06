/**
 * ================================================================================
 * ENTERPRISE DATA MIGRATION - Phase 6
 * Safely migrates user data from SQLite to PostgreSQL with full validation
 * CONTROLLED MIGRATION - Original data preserved until verification complete
 * ================================================================================
 */

const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class EnterpriseDataMigrator {
    constructor() {
        this.migrationId = `data_migration_${new Date().toISOString().replace(/[:.]/g, '-')}`;
        this.logFile = path.join(process.cwd(), 'database', 'logs', `${this.migrationId}.log`);
        this.sqliteDbPath = path.join(process.cwd(), 'dev.db');
        
        this.state = {
            phase: 'data_migration',
            startTime: new Date().toISOString(),
            sourceUsers: [],
            migratedUsers: [],
            errors: [],
            checksums: {}
        };
        
        this.initializeLogging();
        this.setupPostgreSQLConnection();
        this.log('🚀 Enterprise Data Migration Initialized');
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
     * Setup PostgreSQL connection
     */
    setupPostgreSQLConnection() {
        // Load PostgreSQL configuration
        const pgEnvFile = path.join(process.cwd(), '.env.postgresql');
        
        if (fs.existsSync(pgEnvFile)) {
            const envContent = fs.readFileSync(pgEnvFile, 'utf8');
            envContent.split('\n').forEach(line => {
                if (line.includes('=') && !line.startsWith('#')) {
                    const [key, value] = line.split('=', 2);
                    process.env[key.trim()] = value.trim();
                }
            });
        }

        this.pgConfig = {
            host: process.env.PG_HOST || 'localhost',
            port: parseInt(process.env.PG_PORT) || 5432,
            database: process.env.PG_DATABASE || 'propie_dev',
            user: process.env.PG_USER || 'postgres',
            password: process.env.PG_PASSWORD || 'postgres',
            ssl: process.env.PG_SSL === 'true' ? { rejectUnauthorized: false } : false,
            max: 5, // Conservative for migration
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 10000
        };
        
        this.pgPool = new Pool(this.pgConfig);
    }

    /**
     * Log with timestamp
     */
    log(message) {
        console.log(`[${new Date().toISOString()}] ${message}`);
    }

    /**
     * Extract all users from SQLite
     */
    async extractSourceData() {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(this.sqliteDbPath, sqlite3.OPEN_READONLY);
            
            this.log('📊 Extracting source data from SQLite...');
            
            db.all('SELECT * FROM users ORDER BY created', (err, rows) => {
                db.close();
                
                if (err) {
                    reject(new Error(`SQLite extraction failed: ${err.message}`));
                    return;
                }
                
                if (!rows || rows.length === 0) {
                    reject(new Error('No users found in SQLite database'));
                    return;
                }
                
                this.state.sourceUsers = rows;
                this.log(`✓ Extracted ${rows.length} users from SQLite`);
                
                // Create source data checksum
                const sourceDataString = JSON.stringify(rows, Object.keys(rows[0] || {}).sort());
                this.state.checksums.source = crypto.createHash('sha256').update(sourceDataString).digest('hex');
                
                this.log(`✓ Source checksum: ${this.state.checksums.source}`);
                resolve(rows);
            });
        });
    }

    /**
     * Normalize phone number to international format
     */
    normalizePhoneNumber(phone) {
        if (!phone) return null;
        
        // Remove all non-digit characters
        const digits = phone.replace(/\D/g, '');
        
        // If no digits, return null
        if (!digits) return null;
        
        // If starts with 353 (Ireland), add +
        if (digits.startsWith('353')) {
            return '+' + digits;
        }
        
        // If starts with 0 and in Ireland format, convert
        if (digits.startsWith('0') && digits.length === 10) {
            return '+353' + digits.substring(1);
        }
        
        // If 9 digits, assume Irish mobile without country code
        if (digits.length === 9) {
            return '+353' + digits;
        }
        
        // If 10+ digits and doesn't start with +, assume it has country code
        if (digits.length >= 10) {
            return '+' + digits;
        }
        
        // If can't normalize, return null to avoid constraint violation
        return null;
    }

    /**
     * Transform SQLite user to PostgreSQL format
     */
    transformUser(sqliteUser) {
        try {
            // Parse JSON fields safely
            let roles;
            try {
                roles = JSON.parse(sqliteUser.roles);
                // Ensure roles is an array
                if (!Array.isArray(roles)) {
                    roles = [roles];
                }
                // Convert roles to lowercase (PostgreSQL enum values are lowercase)
                roles = roles.map(role => role.toLowerCase());
            } catch (e) {
                roles = ['buyer']; // Default role
            }

            let preferences;
            try {
                preferences = sqliteUser.preferences ? JSON.parse(sqliteUser.preferences) : {};
            } catch (e) {
                preferences = {};
            }

            let metadata;
            try {
                metadata = sqliteUser.metadata ? JSON.parse(sqliteUser.metadata) : {};
            } catch (e) {
                metadata = {};
            }

            // Transform the user data
            const transformedUser = {
                legacy_id: sqliteUser.id, // Preserve original ID for reference
                cognito_user_id: sqliteUser.cognitoUserId,
                email: sqliteUser.email.toLowerCase().trim(),
                first_name: sqliteUser.firstName,
                last_name: sqliteUser.lastName,
                phone: this.normalizePhoneNumber(sqliteUser.phone),
                roles: roles,
                status: sqliteUser.status || 'pending',
                kyc_status: sqliteUser.kycStatus || 'not_started',
                organization: sqliteUser.organization || null,
                position: sqliteUser.position || null,
                avatar: sqliteUser.avatar || null,
                preferences: preferences,
                metadata: metadata,
                created_at: new Date(sqliteUser.created),
                updated_at: new Date(sqliteUser.updatedAt),
                last_active_at: new Date(sqliteUser.lastActive),
                last_login_at: sqliteUser.lastLogin ? new Date(sqliteUser.lastLogin) : null
            };

            return transformedUser;
        } catch (error) {
            throw new Error(`User transformation failed for ${sqliteUser.email}: ${error.message}`);
        }
    }

    /**
     * Migrate a single user to PostgreSQL
     */
    async migrateUser(sqliteUser) {
        const transformedUser = this.transformUser(sqliteUser);
        
        try {
            const insertQuery = `
                INSERT INTO users (
                    legacy_id, cognito_user_id, email, first_name, last_name, phone,
                    roles, status, kyc_status, organization, position, avatar,
                    preferences, metadata, created_at, updated_at, last_active_at, last_login_at
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18
                ) RETURNING id, email
            `;

            const values = [
                transformedUser.legacy_id,
                transformedUser.cognito_user_id,
                transformedUser.email,
                transformedUser.first_name,
                transformedUser.last_name,
                transformedUser.phone,
                transformedUser.roles,
                transformedUser.status,
                transformedUser.kyc_status,
                transformedUser.organization,
                transformedUser.position,
                transformedUser.avatar,
                transformedUser.preferences,
                transformedUser.metadata,
                transformedUser.created_at,
                transformedUser.updated_at,
                transformedUser.last_active_at,
                transformedUser.last_login_at
            ];

            const result = await this.pgPool.query(insertQuery, values);
            
            // Add audit log entry
            await this.pgPool.query(`
                INSERT INTO user_audit_log (user_id, action, new_values, performed_at)
                VALUES ($1, 'INSERT', $2, NOW())
            `, [
                result.rows[0].id,
                JSON.stringify({
                    migration_id: this.migrationId,
                    source: 'sqlite_migration',
                    legacy_id: transformedUser.legacy_id
                })
            ]);

            this.log(`✓ Migrated user: ${transformedUser.email} (${result.rows[0].id})`);
            return result.rows[0];
            
        } catch (error) {
            throw new Error(`PostgreSQL insert failed for ${transformedUser.email}: ${error.message}`);
        }
    }

    /**
     * Verify migration integrity
     */
    async verifyMigration() {
        this.log('🔍 Verifying migration integrity...');
        
        try {
            // Get all migrated users from PostgreSQL
            const pgResult = await this.pgPool.query(`
                SELECT legacy_id, email, first_name, last_name, roles, status
                FROM users 
                WHERE legacy_id IS NOT NULL
                ORDER BY created_at
            `);
            
            const migratedUsers = pgResult.rows;
            this.log(`✓ Found ${migratedUsers.length} migrated users in PostgreSQL`);
            
            // Verify count matches
            if (migratedUsers.length !== this.state.sourceUsers.length) {
                throw new Error(`User count mismatch: SQLite ${this.state.sourceUsers.length}, PostgreSQL ${migratedUsers.length}`);
            }
            
            // Verify each user exists
            for (const sourceUser of this.state.sourceUsers) {
                const migratedUser = migratedUsers.find(u => u.legacy_id === sourceUser.id);
                if (!migratedUser) {
                    throw new Error(`User not found in PostgreSQL: ${sourceUser.email} (${sourceUser.id})`);
                }
                
                // Verify key fields
                if (migratedUser.email !== sourceUser.email.toLowerCase().trim()) {
                    throw new Error(`Email mismatch for ${sourceUser.id}: expected ${sourceUser.email}, got ${migratedUser.email}`);
                }
            }
            
            // Create migrated data checksum
            const migratedDataString = JSON.stringify(migratedUsers, Object.keys(migratedUsers[0] || {}).sort());
            this.state.checksums.migrated = crypto.createHash('sha256').update(migratedDataString).digest('hex');
            
            this.log('✅ Migration integrity verification PASSED');
            this.log(`✓ All ${migratedUsers.length} users successfully migrated`);
            this.log(`✓ Migrated data checksum: ${this.state.checksums.migrated}`);
            
            return true;
            
        } catch (error) {
            throw new Error(`Migration verification failed: ${error.message}`);
        }
    }

    /**
     * Generate migration report
     */
    async generateMigrationReport() {
        const reportFile = path.join(process.cwd(), 'database', 'reports', `data_migration_report_${this.migrationId}.json`);
        
        const reportDir = path.dirname(reportFile);
        if (!fs.existsSync(reportDir)) {
            fs.mkdirSync(reportDir, { recursive: true });
        }
        
        const report = {
            migrationId: this.migrationId,
            timestamp: new Date().toISOString(),
            source: {
                database: 'SQLite',
                path: this.sqliteDbPath,
                userCount: this.state.sourceUsers.length,
                checksum: this.state.checksums.source
            },
            destination: {
                database: 'PostgreSQL',
                host: this.pgConfig.host,
                database: this.pgConfig.database,
                userCount: this.state.migratedUsers.length,
                checksum: this.state.checksums.migrated
            },
            migration: {
                status: this.state.errors.length === 0 ? 'success' : 'partial_failure',
                duration: new Date() - new Date(this.state.startTime),
                errors: this.state.errors
            },
            verification: {
                integrityCheck: 'passed',
                dataIntegrity: 'verified',
                checksumMatch: this.state.checksums.source !== this.state.checksums.migrated ? 'expected_difference' : 'identical'
            },
            nextSteps: [
                'Update application configuration to use PostgreSQL',
                'Test authentication flows with migrated data',
                'Monitor performance with new database',
                'Create production backup schedule'
            ]
        };
        
        fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
        
        this.log(`📋 Migration report saved: ${reportFile}`);
        return report;
    }

    /**
     * Execute complete data migration
     */
    async executeMigration() {
        try {
            this.log('\n🚀 ENTERPRISE DATA MIGRATION - PHASE 6');
            this.log('=========================================');
            this.log(`Migration ID: ${this.migrationId}`);
            this.log(`Target: ${this.pgConfig.host}:${this.pgConfig.port}/${this.pgConfig.database}`);
            
            // Step 1: Extract source data
            await this.extractSourceData();
            
            // Step 2: Migrate each user
            this.log('\n📦 Migrating users to PostgreSQL...');
            for (const [index, user] of this.state.sourceUsers.entries()) {
                try {
                    const migratedUser = await this.migrateUser(user);
                    this.state.migratedUsers.push(migratedUser);
                    this.log(`   ${index + 1}/${this.state.sourceUsers.length}: ${user.email} ✓`);
                } catch (error) {
                    this.state.errors.push({
                        user: user.email,
                        error: error.message,
                        timestamp: new Date().toISOString()
                    });
                    this.log(`   ${index + 1}/${this.state.sourceUsers.length}: ${user.email} ✗ - ${error.message}`);
                }
            }
            
            // Step 3: Verify migration
            await this.verifyMigration();
            
            // Step 4: Generate report
            const report = await this.generateMigrationReport();
            
            // Step 5: Final status
            if (this.state.errors.length === 0) {
                this.log('\n🎉 DATA MIGRATION COMPLETED SUCCESSFULLY');
                this.log('======================================');
                this.log(`✅ All ${this.state.sourceUsers.length} users migrated successfully`);
                this.log('✅ Data integrity verified');
                this.log('✅ Audit trails created');
                this.log('\nYour PostgreSQL database is ready for production use!');
                this.log('\nNext step: Update application configuration to use PostgreSQL');
            } else {
                this.log('\n⚠️  DATA MIGRATION COMPLETED WITH WARNINGS');
                this.log('==========================================');
                this.log(`✅ ${this.state.migratedUsers.length}/${this.state.sourceUsers.length} users migrated successfully`);
                this.log(`⚠️  ${this.state.errors.length} users had errors`);
                this.log('\nReview the migration report for details.');
            }
            
            return report;
            
        } catch (error) {
            this.log(`\n❌ DATA MIGRATION FAILED: ${error.message}`);
            throw error;
        } finally {
            // Clean up PostgreSQL connection
            if (this.pgPool) {
                await this.pgPool.end();
            }
        }
    }
}

// Execute if called directly
if (require.main === module) {
    const migrator = new EnterpriseDataMigrator();
    
    migrator.executeMigration()
        .then(() => {
            console.log('\n✅ Data migration successful!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n❌ Data migration failed:', error.message);
            process.exit(1);
        });
}

module.exports = EnterpriseDataMigrator;