#!/usr/bin/env node

/**
 * PROP.ie Production Health Monitor
 * Automated health checking with alerting
 */

const https = require('https');
const fs = require('fs');

class HealthMonitor {
  constructor() {
    this.config = JSON.parse(fs.readFileSync('./monitoring/health-checks.json', 'utf8'));
    this.failureCount = new Map();
  }

  async checkHealth() {
    console.log(`[${new Date().toISOString()}] Running health checks...`);
    
    for (const check of this.config.checks) {
      try {
        const result = await this.performCheck(check);
        if (result.healthy) {
          this.failureCount.delete(check.name);
          console.log(`✅ ${check.name}: Healthy`);
        } else {
          this.handleFailure(check, result.error);
        }
      } catch (error) {
        this.handleFailure(check, error);
      }
    }
  }

  async performCheck(check) {
    return new Promise((resolve) => {
      const options = {
        hostname: 'prop.ie',
        path: check.endpoint,
        method: check.method,
        timeout: check.timeout
      };

      const req = https.request(options, (res) => {
        resolve({
          healthy: res.statusCode === check.expectedStatus,
          statusCode: res.statusCode
        });
      });

      req.on('timeout', () => {
        resolve({ healthy: false, error: 'Timeout' });
      });

      req.on('error', (error) => {
        resolve({ healthy: false, error: error.message });
      });

      req.end();
    });
  }

  handleFailure(check, error) {
    const failures = this.failureCount.get(check.name) || 0;
    this.failureCount.set(check.name, failures + 1);
    
    console.log(`❌ ${check.name}: Failed (${failures + 1}/${this.config.retryAttempts})`);
    
    if (failures + 1 >= this.config.retryAttempts) {
      this.sendAlert(check, error);
    }
  }

  sendAlert(check, error) {
    console.log(`🚨 ALERT: ${check.name} has failed ${this.config.retryAttempts} times`);
    console.log(`Error: ${error}`);
    
    // In production, this would send actual alerts via email/SMS/Slack
    const alert = {
      timestamp: new Date().toISOString(),
      service: check.name,
      error: error,
      severity: 'critical'
    };
    
    fs.appendFileSync('./monitoring/alerts.log', JSON.stringify(alert) + '\n');
  }
}

const monitor = new HealthMonitor();
monitor.checkHealth();

// Schedule recurring checks
setInterval(() => {
  monitor.checkHealth();
}, 30000); // Every 30 seconds
