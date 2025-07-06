/**
 * ================================================================================
 * ENTERPRISE SQLite BACKUP SCRIPT
 * Creates complete backup of existing data BEFORE any migration
 * READ-ONLY OPERATIONS - NO DATA MODIFICATION
 * ================================================================================
 */

const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class EnterpriseBackupManager {
    constructor() {
        this.dbPath = path.join(process.cwd(), 'dev.db');
        this.backupDir = path.join(process.cwd(), 'database', 'backups');
        this.timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        
        // Ensure backup directory exists
        if (!fs.existsSync(this.backupDir)) {
            fs.mkdirSync(this.backupDir, { recursive: true });
        }
    }

    /**
     * Verify SQLite database integrity before backup
     */
    async verifyDatabaseIntegrity() {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(this.dbPath, sqlite3.OPEN_READONLY);
            
            console.log('🔍 Verifying database integrity...');
            
            db.get('PRAGMA integrity_check', (err, row) => {
                if (err) {
                    db.close();
                    reject(new Error(`Database integrity check failed: ${err.message}`));
                    return;
                }
                
                if (row.integrity_check !== 'ok') {
                    db.close();
                    reject(new Error(`Database integrity compromised: ${row.integrity_check}`));
                    return;
                }
                
                console.log('✓ Database integrity verified');
                db.close();
                resolve();
            });
        });
    }

    /**
     * Create full database backup (file copy)
     */
    async createFileBackup() {
        const backupFile = path.join(this.backupDir, `dev_backup_${this.timestamp}.db`);
        
        console.log('📋 Creating file backup...');
        
        try {
            fs.copyFileSync(this.dbPath, backupFile);
            
            // Verify backup file
            const originalStats = fs.statSync(this.dbPath);
            const backupStats = fs.statSync(backupFile);
            
            if (originalStats.size !== backupStats.size) {
                throw new Error('Backup file size mismatch');
            }
            
            console.log(`✓ File backup created: ${backupFile}`);
            return backupFile;
        } catch (error) {
            throw new Error(`File backup failed: ${error.message}`);
        }
    }

    /**
     * Export data to CSV format for migration
     */
    async exportToCSV() {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(this.dbPath, sqlite3.OPEN_READONLY);
            const csvFile = path.join(this.backupDir, `users_export_${this.timestamp}.csv`);
            
            console.log('📊 Exporting data to CSV...');
            
            // Get all user data
            db.all('SELECT * FROM users ORDER BY created', (err, rows) => {
                if (err) {
                    db.close();
                    reject(new Error(`Data export failed: ${err.message}`));
                    return;
                }
                
                if (!rows || rows.length === 0) {
                    db.close();
                    reject(new Error('No user data found to export'));
                    return;
                }
                
                try {
                    // Create CSV content
                    const headers = Object.keys(rows[0]);
                    const csvContent = [
                        headers.join(','),
                        ...rows.map(row => 
                            headers.map(header => {
                                const value = row[header];
                                // Escape commas and quotes in CSV
                                if (value === null || value === undefined) return '';
                                const stringValue = String(value);
                                if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
                                    return `"${stringValue.replace(/"/g, '""')}"`;
                                }
                                return stringValue;
                            }).join(',')
                        )
                    ].join('\n');
                    
                    // Write CSV file
                    fs.writeFileSync(csvFile, csvContent, 'utf8');
                    
                    console.log(`✓ CSV export created: ${csvFile}`);
                    console.log(`✓ Exported ${rows.length} user records`);
                    
                    db.close();
                    resolve({ csvFile, recordCount: rows.length });
                    
                } catch (writeError) {
                    db.close();
                    reject(new Error(`CSV write failed: ${writeError.message}`));
                }
            });
        });
    }

    /**
     * Create data checksum for integrity verification
     */
    async createDataChecksum() {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(this.dbPath, sqlite3.OPEN_READONLY);
            
            console.log('🔐 Creating data checksum...');
            
            db.all('SELECT * FROM users ORDER BY id', (err, rows) => {
                if (err) {
                    db.close();
                    reject(new Error(`Checksum creation failed: ${err.message}`));
                    return;
                }
                
                // Create deterministic hash of all data
                const dataString = JSON.stringify(rows, Object.keys(rows[0] || {}).sort());
                const checksum = crypto.createHash('sha256').update(dataString).digest('hex');
                
                const checksumFile = path.join(this.backupDir, `data_checksum_${this.timestamp}.json`);
                const checksumData = {
                    timestamp: new Date().toISOString(),
                    recordCount: rows.length,
                    checksum: checksum,
                    algorithm: 'sha256',
                    source: 'sqlite'
                };
                
                fs.writeFileSync(checksumFile, JSON.stringify(checksumData, null, 2));
                
                console.log(`✓ Data checksum created: ${checksum}`);
                console.log(`✓ Checksum file: ${checksumFile}`);
                
                db.close();
                resolve(checksumData);
            });
        });
    }

    /**
     * Generate backup report
     */
    async generateBackupReport(backupFile, csvExport, checksumData) {
        const reportFile = path.join(this.backupDir, `backup_report_${this.timestamp}.json`);
        
        const report = {
            timestamp: new Date().toISOString(),
            backupType: 'pre_migration_safety_backup',
            source: {
                database: this.dbPath,
                size: fs.statSync(this.dbPath).size,
                lastModified: fs.statSync(this.dbPath).mtime
            },
            backup: {
                fileBackup: backupFile,
                csvExport: csvExport.csvFile,
                recordCount: csvExport.recordCount,
                checksum: checksumData.checksum
            },
            verification: {
                integrityCheck: 'passed',
                filesCreated: [backupFile, csvExport.csvFile],
                dataIntegrity: 'verified'
            },
            migration: {
                status: 'ready_for_migration',
                rollbackCapable: true,
                nextStep: 'postgresql_connection_test'
            }
        };
        
        fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
        
        console.log('\n📋 BACKUP REPORT');
        console.log('================');
        console.log(`Original DB: ${this.dbPath}`);
        console.log(`Backup File: ${backupFile}`);
        console.log(`CSV Export: ${csvExport.csvFile}`);
        console.log(`Records: ${csvExport.recordCount}`);
        console.log(`Checksum: ${checksumData.checksum}`);
        console.log(`Report: ${reportFile}`);
        console.log('\n✓ BACKUP COMPLETED SUCCESSFULLY - Ready for PostgreSQL setup');
        
        return report;
    }

    /**
     * Main backup process
     */
    async createSafetyBackup() {
        try {
            console.log('\n🛡️  ENTERPRISE SAFETY BACKUP STARTING');
            console.log('=====================================');
            
            // Step 1: Verify database integrity
            await this.verifyDatabaseIntegrity();
            
            // Step 2: Create file backup
            const backupFile = await this.createFileBackup();
            
            // Step 3: Export to CSV
            const csvExport = await this.exportToCSV();
            
            // Step 4: Create checksum
            const checksumData = await this.createDataChecksum();
            
            // Step 5: Generate report
            const report = await this.generateBackupReport(backupFile, csvExport, checksumData);
            
            return report;
            
        } catch (error) {
            console.error('❌ BACKUP FAILED:', error.message);
            throw error;
        }
    }
}

// Run backup if called directly
if (require.main === module) {
    const backupManager = new EnterpriseBackupManager();
    
    backupManager.createSafetyBackup()
        .then(() => {
            console.log('\n🎉 Backup completed successfully!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n💥 Backup failed:', error.message);
            process.exit(1);
        });
}

module.exports = EnterpriseBackupManager;