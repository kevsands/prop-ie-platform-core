/**
 * PostgreSQL Connection Test Script
 * Generated during enterprise migration: 2025-06-18T19:41:17.069Z
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

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
