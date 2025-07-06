/**
 * ================================================================================
 * ENTERPRISE POSTGRESQL CONNECTION TESTER
 * Verifies PostgreSQL setup before any migration operations
 * SAFE READ-ONLY TESTING - NO SCHEMA OR DATA CHANGES
 * ================================================================================
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

class PostgreSQLConnectionTester {
    constructor() {
        this.loadConfiguration();
        this.testResults = {
            timestamp: new Date().toISOString(),
            tests: [],
            overall: 'pending'
        };
    }

    /**
     * Load PostgreSQL configuration from environment
     */
    loadConfiguration() {
        // Load PostgreSQL environment file
        const pgEnvFile = path.join(process.cwd(), '.env.postgresql');
        
        if (fs.existsSync(pgEnvFile)) {
            const envContent = fs.readFileSync(pgEnvFile, 'utf8');
            envContent.split('\n').forEach(line => {
                if (line.includes('=') && !line.startsWith('#')) {
                    const [key, value] = line.split('=', 2);
                    process.env[key.trim()] = value.trim();
                }
            });
            console.log('✓ PostgreSQL configuration loaded');
        } else {
            console.log('⚠ No .env.postgresql file found, using environment variables');
        }

        // Configure connection with safety defaults
        this.config = {
            host: process.env.PG_HOST || 'localhost',
            port: parseInt(process.env.PG_PORT) || 5432,
            database: process.env.PG_DATABASE || 'propie_dev',
            user: process.env.PG_USER || 'postgres',
            password: process.env.PG_PASSWORD || 'postgres',
            
            // Conservative connection settings for testing
            max: 3, // Minimal connections for testing
            min: 1,
            idleTimeoutMillis: 10000,
            connectionTimeoutMillis: 5000,
            
            // SSL configuration
            ssl: process.env.PG_SSL === 'true' ? {
                rejectUnauthorized: false // Development mode
            } : false
        };
    }

    /**
     * Run a single test and record results
     */
    async runTest(testName, testFunction) {
        console.log(`\n🧪 Testing: ${testName}`);
        
        const testResult = {
            name: testName,
            startTime: new Date().toISOString(),
            status: 'running'
        };
        
        try {
            const result = await testFunction();
            testResult.status = 'passed';
            testResult.result = result;
            testResult.message = `✓ ${testName} passed`;
            console.log(`✓ ${testName} - PASSED`);
        } catch (error) {
            testResult.status = 'failed';
            testResult.error = error.message;
            testResult.message = `✗ ${testName} - FAILED: ${error.message}`;
            console.log(`✗ ${testName} - FAILED: ${error.message}`);
        } finally {
            testResult.endTime = new Date().toISOString();
            testResult.duration = new Date(testResult.endTime) - new Date(testResult.startTime);
        }
        
        this.testResults.tests.push(testResult);
        return testResult;
    }

    /**
     * Test basic connection
     */
    async testBasicConnection() {
        const pool = new Pool(this.config);
        
        try {
            const client = await pool.connect();
            const result = await client.query('SELECT NOW() as server_time, version() as version');
            client.release();
            
            return {
                connected: true,
                serverTime: result.rows[0].server_time,
                version: result.rows[0].version
            };
        } finally {
            await pool.end();
        }
    }

    /**
     * Test database permissions
     */
    async testDatabasePermissions() {
        const pool = new Pool(this.config);
        
        try {
            const client = await pool.connect();
            
            // Test SELECT permission
            const selectTest = await client.query(`
                SELECT 
                    current_user as user,
                    current_database() as database,
                    has_database_privilege(current_user, current_database(), 'CREATE') as can_create,
                    has_database_privilege(current_user, current_database(), 'CONNECT') as can_connect
            `);
            
            // Test CREATE permission (create and drop temp table)
            await client.query('CREATE TEMP TABLE test_permissions (id SERIAL)');
            await client.query('DROP TABLE test_permissions');
            
            client.release();
            
            return {
                permissions: selectTest.rows[0],
                createTest: 'passed'
            };
        } finally {
            await pool.end();
        }
    }

    /**
     * Test required extensions
     */
    async testRequiredExtensions() {
        const pool = new Pool(this.config);
        const requiredExtensions = ['uuid-ossp', 'pgcrypto', 'btree_gin'];
        
        try {
            const client = await pool.connect();
            
            const availableExt = await client.query(`
                SELECT name, installed_version, default_version
                FROM pg_available_extensions 
                WHERE name = ANY($1)
                ORDER BY name
            `, [requiredExtensions]);
            
            client.release();
            
            const results = {};
            requiredExtensions.forEach(ext => {
                const found = availableExt.rows.find(row => row.name === ext);
                results[ext] = {
                    available: !!found,
                    installedVersion: found?.installed_version || null,
                    defaultVersion: found?.default_version || null
                };
            });
            
            return results;
        } finally {
            await pool.end();
        }
    }

    /**
     * Test connection pooling
     */
    async testConnectionPooling() {
        const pool = new Pool({
            ...this.config,
            max: 3,
            min: 1
        });
        
        try {
            // Test multiple concurrent connections
            const promises = [];
            for (let i = 0; i < 3; i++) {
                promises.push(
                    pool.query('SELECT $1 as connection_id, pg_backend_pid() as pid', [i + 1])
                );
            }
            
            const results = await Promise.all(promises);
            
            return {
                concurrentConnections: results.length,
                connectionIds: results.map(r => r.rows[0]),
                poolStats: {
                    totalCount: pool.totalCount,
                    idleCount: pool.idleCount,
                    waitingCount: pool.waitingCount
                }
            };
        } finally {
            await pool.end();
        }
    }

    /**
     * Test performance characteristics
     */
    async testPerformance() {
        const pool = new Pool(this.config);
        
        try {
            const client = await pool.connect();
            
            // Simple query performance test
            const start = process.hrtime.bigint();
            await client.query('SELECT 1');
            const end = process.hrtime.bigint();
            const queryTime = Number(end - start) / 1000000; // Convert to milliseconds
            
            // Connection time test
            const connStart = process.hrtime.bigint();
            const testClient = await pool.connect();
            const connEnd = process.hrtime.bigint();
            const connectionTime = Number(connEnd - connStart) / 1000000;
            
            testClient.release();
            client.release();
            
            return {
                queryTime: `${queryTime.toFixed(2)}ms`,
                connectionTime: `${connectionTime.toFixed(2)}ms`,
                acceptable: queryTime < 100 && connectionTime < 1000
            };
        } finally {
            await pool.end();
        }
    }

    /**
     * Generate comprehensive test report
     */
    async generateTestReport() {
        const reportFile = path.join(process.cwd(), 'database', 'backups', `postgresql_test_${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
        
        // Calculate overall status
        const failedTests = this.testResults.tests.filter(test => test.status === 'failed');
        this.testResults.overall = failedTests.length === 0 ? 'all_tests_passed' : 'some_tests_failed';
        this.testResults.summary = {
            total: this.testResults.tests.length,
            passed: this.testResults.tests.filter(test => test.status === 'passed').length,
            failed: failedTests.length
        };
        
        // Ensure backups directory exists
        const backupDir = path.dirname(reportFile);
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }
        
        fs.writeFileSync(reportFile, JSON.stringify(this.testResults, null, 2));
        
        console.log('\n📋 POSTGRESQL TEST REPORT');
        console.log('=========================');
        console.log(`Overall Status: ${this.testResults.overall}`);
        console.log(`Tests Passed: ${this.testResults.summary.passed}/${this.testResults.summary.total}`);
        
        if (failedTests.length > 0) {
            console.log('\n❌ Failed Tests:');
            failedTests.forEach(test => {
                console.log(`  - ${test.name}: ${test.error}`);
            });
        }
        
        console.log(`\nDetailed Report: ${reportFile}`);
        
        return this.testResults;
    }

    /**
     * Run all tests
     */
    async runAllTests() {
        console.log('\n🏢 ENTERPRISE POSTGRESQL TESTING');
        console.log('=================================');
        console.log(`Target: ${this.config.host}:${this.config.port}/${this.config.database}`);
        console.log(`User: ${this.config.user}`);
        
        // Run all tests
        await this.runTest('Basic Connection', () => this.testBasicConnection());
        await this.runTest('Database Permissions', () => this.testDatabasePermissions());
        await this.runTest('Required Extensions', () => this.testRequiredExtensions());
        await this.runTest('Connection Pooling', () => this.testConnectionPooling());
        await this.runTest('Performance Check', () => this.testPerformance());
        
        // Generate report
        const report = await this.generateTestReport();
        
        if (report.overall === 'all_tests_passed') {
            console.log('\n🎉 ALL TESTS PASSED - PostgreSQL ready for enterprise migration!');
            return true;
        } else {
            console.log('\n⚠️  SOME TESTS FAILED - Please resolve issues before migration');
            return false;
        }
    }
}

// Run tests if called directly
if (require.main === module) {
    const tester = new PostgreSQLConnectionTester();
    
    tester.runAllTests()
        .then((success) => {
            process.exit(success ? 0 : 1);
        })
        .catch((error) => {
            console.error('\n💥 Testing failed:', error.message);
            process.exit(1);
        });
}

module.exports = PostgreSQLConnectionTester;