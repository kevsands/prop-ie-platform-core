#!/usr/bin/env node

/**
 * Staging Environment Health Check
 * Continuous monitoring for staging environment
 */

const https = require('https');
const fs = require('fs');

class StagingHealthCheck {
  constructor() {
    this.config = JSON.parse(fs.readFileSync('./staging/monitoring-config.json', 'utf8'));
    this.baseUrl = process.env.STAGING_URL || 'https://prop-ie-staging.vercel.app';
  }

  async runHealthChecks() {
    console.log(`[STAGING] ${new Date().toISOString()} - Running health checks...`);
    
    const results = [];
    
    for (const endpoint of this.config.healthChecks.endpoints) {
      try {
        const result = await this.checkEndpoint(endpoint);
        results.push(result);
        console.log(`✅ ${endpoint}: ${result.status} (${result.responseTime}ms)`);
      } catch (error) {
        console.log(`❌ ${endpoint}: Failed - ${error.message}`);
        results.push({ endpoint, status: 'failed', error: error.message });
      }
    }
    
    await this.generateHealthReport(results);
  }

  async checkEndpoint(endpoint) {
    const startTime = Date.now();
    
    return new Promise((resolve, reject) => {
      const url = `${this.baseUrl}${endpoint}`;
      const req = https.get(url, (res) => {
        const responseTime = Date.now() - startTime;
        resolve({
          endpoint,
          status: res.statusCode,
          responseTime,
          healthy: res.statusCode >= 200 && res.statusCode < 400
        });
      });
      
      req.on('error', reject);
      req.setTimeout(10000, () => reject(new Error('Timeout')));
    });
  }

  async generateHealthReport(results) {
    const report = {
      timestamp: new Date().toISOString(),
      environment: 'staging',
      overall: results.every(r => r.healthy),
      checks: results,
      summary: {
        total: results.length,
        passed: results.filter(r => r.healthy).length,
        failed: results.filter(r => !r.healthy).length
      }
    };
    
    fs.appendFileSync('./staging/health-reports.log', JSON.stringify(report) + '\n');
  }
}

const healthCheck = new StagingHealthCheck();
healthCheck.runHealthChecks();

// Schedule regular checks (every minute)
setInterval(() => {
  healthCheck.runHealthChecks();
}, 60000);
