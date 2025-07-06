const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class TestManager {
    constructor() {
        this.projectRoot = path.resolve(__dirname, '..');
        this.testConfigPath = path.join(this.projectRoot, 'test-config.json');
        this.loadConfigurations();
    }

    loadConfigurations() {
        try {
            this.config = JSON.parse(fs.readFileSync(this.testConfigPath, 'utf8'));
        } catch (error) {
            this.config = {
                coverage: {
                    statements: 70,
                    branches: 70,
                    functions: 70,
                    lines: 70
                },
                testTypes: {
                    unit: true,
                    integration: true,
                    e2e: true,
                    visual: true
                },
                testPatterns: {
                    unit: '**/*.test.ts',
                    integration: '**/*.integration.test.ts',
                    e2e: '**/*.e2e.test.ts',
                    visual: '**/*.visual.test.ts'
                },
                environments: {
                    unit: 'jsdom',
                    integration: 'node',
                    e2e: 'node',
                    visual: 'jsdom'
                },
                timeouts: {
                    unit: 5000,
                    integration: 10000,
                    e2e: 30000,
                    visual: 10000
                },
                retries: {
                    unit: 0,
                    integration: 1,
                    e2e: 2,
                    visual: 1
                }
            };
            this.saveConfigurations();
        }
    }

    saveConfigurations() {
        fs.writeFileSync(this.testConfigPath, JSON.stringify(this.config, null, 2));
    }

    async runTests(options = {}) {
        const results = {
            timestamp: new Date().toISOString(),
            unit: options.unit ? await this.runUnitTests() : null,
            integration: options.integration ? await this.runIntegrationTests() : null,
            e2e: options.e2e ? await this.runE2ETests() : null,
            visual: options.visual ? await this.runVisualTests() : null
        };

        const reportPath = path.join(this.projectRoot, 'reports', `test-results-${new Date().toISOString().split('T')[0]}.json`);
        fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
        return results;
    }

    async runUnitTests() {
        try {
            execSync(`jest --config jest.config.js --testMatch="${this.config.testPatterns.unit}" --coverage`, { stdio: 'inherit' });
            return this.parseTestResults('unit');
        } catch (error) {
            console.error('Unit tests failed:', error);
            return null;
        }
    }

    async runIntegrationTests() {
        try {
            execSync(`jest --config jest.config.js --testMatch="${this.config.testPatterns.integration}" --coverage`, { stdio: 'inherit' });
            return this.parseTestResults('integration');
        } catch (error) {
            console.error('Integration tests failed:', error);
            return null;
        }
    }

    async runE2ETests() {
        try {
            execSync('cypress run', { stdio: 'inherit' });
            return this.parseTestResults('e2e');
        } catch (error) {
            console.error('E2E tests failed:', error);
            return null;
        }
    }

    async runVisualTests() {
        try {
            execSync('jest --config jest.config.js --testMatch="**/*.visual.test.ts"', { stdio: 'inherit' });
            return this.parseTestResults('visual');
        } catch (error) {
            console.error('Visual tests failed:', error);
            return null;
        }
    }

    parseTestResults(type) {
        try {
            const coveragePath = path.join(this.projectRoot, 'coverage', 'coverage-summary.json');
            const coverage = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
            
            return {
                type,
                coverage: coverage.total,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error(`Error parsing ${type} test results:`, error);
            return null;
        }
    }

    updateCoverageThresholds(thresholds) {
        this.config.coverage = { ...this.config.coverage, ...thresholds };
        this.saveConfigurations();
        this.updateJestConfig();
    }

    updateTestPatterns(patterns) {
        this.config.testPatterns = { ...this.config.testPatterns, ...patterns };
        this.saveConfigurations();
    }

    updateEnvironments(environments) {
        this.config.environments = { ...this.config.environments, ...environments };
        this.saveConfigurations();
        this.updateJestConfig();
    }

    updateTimeouts(timeouts) {
        this.config.timeouts = { ...this.config.timeouts, ...timeouts };
        this.saveConfigurations();
        this.updateJestConfig();
    }

    updateRetries(retries) {
        this.config.retries = { ...this.config.retries, ...retries };
        this.saveConfigurations();
        this.updateJestConfig();
    }

    updateJestConfig() {
        const jestConfig = {
            coverageThreshold: {
                global: this.config.coverage
            },
            testEnvironment: this.config.environments.unit,
            testTimeout: this.config.timeouts.unit,
            retryTimes: this.config.retries.unit,
            testMatch: Object.values(this.config.testPatterns)
        };

        fs.writeFileSync(
            path.join(this.projectRoot, 'jest.config.js'),
            `module.exports = ${JSON.stringify(jestConfig, null, 2)}`
        );
    }

    generateTestReport() {
        const report = {
            timestamp: new Date().toISOString(),
            config: this.config,
            coverage: this.getCoverageReport(),
            testStats: this.getTestStats(),
            recommendations: this.generateRecommendations()
        };

        const reportPath = path.join(this.projectRoot, 'reports', `test-report-${new Date().toISOString().split('T')[0]}.json`);
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        return report;
    }

    getCoverageReport() {
        try {
            const coveragePath = path.join(this.projectRoot, 'coverage', 'coverage-summary.json');
            return JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
        } catch (error) {
            console.error('Error getting coverage report:', error);
            return null;
        }
    }

    getTestStats() {
        const stats = {
            total: 0,
            passed: 0,
            failed: 0,
            skipped: 0
        };

        try {
            const testResults = fs.readdirSync(path.join(this.projectRoot, 'coverage'))
                .filter(file => file.endsWith('.json'))
                .map(file => JSON.parse(fs.readFileSync(path.join(this.projectRoot, 'coverage', file), 'utf8')));

            testResults.forEach(result => {
                stats.total += result.total || 0;
                stats.passed += result.passed || 0;
                stats.failed += result.failed || 0;
                stats.skipped += result.skipped || 0;
            });
        } catch (error) {
            console.error('Error getting test stats:', error);
        }

        return stats;
    }

    generateRecommendations() {
        const recommendations = {
            immediate: [],
            shortTerm: [],
            longTerm: []
        };

        const coverage = this.getCoverageReport();
        if (coverage) {
            Object.entries(coverage.total).forEach(([metric, value]) => {
                const threshold = this.config.coverage[metric];
                if (value < threshold) {
                    recommendations.immediate.push(`Increase ${metric} coverage from ${value}% to ${threshold}%`);
                }
            });
        }

        recommendations.shortTerm = [
            'Implement missing integration tests',
            'Add visual regression tests for critical components',
            'Set up E2E test automation pipeline'
        ];

        recommendations.longTerm = [
            'Implement performance testing',
            'Set up load testing infrastructure',
            'Create comprehensive test documentation'
        ];

        return recommendations;
    }
}

// CLI interface
if (require.main === module) {
    const manager = new TestManager();
    const command = process.argv[2];
    const args = process.argv.slice(3);

    switch (command) {
        case 'run-tests':
            manager.runTests(JSON.parse(args[0]));
            break;
        case 'update-coverage':
            manager.updateCoverageThresholds(JSON.parse(args[0]));
            break;
        case 'update-patterns':
            manager.updateTestPatterns(JSON.parse(args[0]));
            break;
        case 'update-environments':
            manager.updateEnvironments(JSON.parse(args[0]));
            break;
        case 'update-timeouts':
            manager.updateTimeouts(JSON.parse(args[0]));
            break;
        case 'update-retries':
            manager.updateRetries(JSON.parse(args[0]));
            break;
        case 'generate-report':
            console.log(JSON.stringify(manager.generateTestReport(), null, 2));
            break;
        default:
            console.log('Unknown command');
    }
}

module.exports = TestManager; 