const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class QualityManager {
    constructor() {
        this.projectRoot = path.resolve(__dirname, '..');
        this.jestConfigPath = path.join(this.projectRoot, 'jest.config.js');
        this.eslintConfigPath = path.join(this.projectRoot, '.eslintrc.js');
        this.loadConfigurations();
    }

    loadConfigurations() {
        this.jestConfig = require(this.jestConfigPath);
        this.eslintConfig = require(this.eslintConfigPath);
    }

    runTests(options = {}) {
        const args = [];
        if (options.watch) args.push('--watch');
        if (options.coverage) args.push('--coverage');
        if (options.verbose) args.push('--verbose');
        
        try {
            execSync(`jest ${args.join(' ')}`, { stdio: 'inherit' });
            return true;
        } catch (error) {
            console.error('Tests failed:', error);
            return false;
        }
    }

    runLint(options = {}) {
        const args = [];
        if (options.fix) args.push('--fix');
        if (options.quiet) args.push('--quiet');
        
        try {
            execSync(`eslint . ${args.join(' ')}`, { stdio: 'inherit' });
            return true;
        } catch (error) {
            console.error('Linting failed:', error);
            return false;
        }
    }

    runTypeCheck() {
        try {
            execSync('tsc --noEmit', { stdio: 'inherit' });
            return true;
        } catch (error) {
            console.error('Type checking failed:', error);
            return false;
        }
    }

    generateTestReport() {
        try {
            execSync('jest --coverage --json --outputFile=coverage/coverage-summary.json', { stdio: 'inherit' });
            const coverage = JSON.parse(fs.readFileSync(path.join(this.projectRoot, 'coverage/coverage-summary.json'), 'utf8'));
            
            const report = {
                timestamp: new Date().toISOString(),
                coverage: coverage,
                summary: {
                    total: coverage.total,
                    passed: coverage.passed,
                    failed: coverage.failed,
                    skipped: coverage.skipped
                }
            };

            const reportPath = path.join(this.projectRoot, 'reports', `test-report-${new Date().toISOString().split('T')[0]}.json`);
            fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
            return report;
        } catch (error) {
            console.error('Error generating test report:', error);
            return null;
        }
    }

    generateLintReport() {
        try {
            const output = execSync('eslint . --format json', { stdio: 'pipe' }).toString();
            const results = JSON.parse(output);
            
            const report = {
                timestamp: new Date().toISOString(),
                results: results,
                summary: {
                    total: results.length,
                    errors: results.reduce((sum, file) => sum + file.errorCount, 0),
                    warnings: results.reduce((sum, file) => sum + file.warningCount, 0)
                }
            };

            const reportPath = path.join(this.projectRoot, 'reports', `lint-report-${new Date().toISOString().split('T')[0]}.json`);
            fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
            return report;
        } catch (error) {
            console.error('Error generating lint report:', error);
            return null;
        }
    }

    updateJestConfig(config) {
        this.jestConfig = { ...this.jestConfig, ...config };
        fs.writeFileSync(this.jestConfigPath, `module.exports = ${JSON.stringify(this.jestConfig, null, 2)}`);
    }

    updateEslintConfig(config) {
        this.eslintConfig = { ...this.eslintConfig, ...config };
        fs.writeFileSync(this.eslintConfigPath, `module.exports = ${JSON.stringify(this.eslintConfig, null, 2)}`);
    }

    runQualityCheck() {
        const results = {
            timestamp: new Date().toISOString(),
            tests: this.runTests({ coverage: true }),
            lint: this.runLint(),
            types: this.runTypeCheck()
        };

        const reportPath = path.join(this.projectRoot, 'reports', `quality-check-${new Date().toISOString().split('T')[0]}.json`);
        fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
        return results;
    }

    fixQualityIssues() {
        this.runLint({ fix: true });
        this.runTests();
        this.runTypeCheck();
    }
}

// CLI interface
if (require.main === module) {
    const manager = new QualityManager();
    const command = process.argv[2];
    const args = process.argv.slice(3);

    switch (command) {
        case 'run-tests':
            manager.runTests(JSON.parse(args[0]));
            break;
        case 'run-lint':
            manager.runLint(JSON.parse(args[0]));
            break;
        case 'run-type-check':
            manager.runTypeCheck();
            break;
        case 'generate-test-report':
            console.log(JSON.stringify(manager.generateTestReport(), null, 2));
            break;
        case 'generate-lint-report':
            console.log(JSON.stringify(manager.generateLintReport(), null, 2));
            break;
        case 'update-jest-config':
            manager.updateJestConfig(JSON.parse(args[0]));
            break;
        case 'update-eslint-config':
            manager.updateEslintConfig(JSON.parse(args[0]));
            break;
        case 'run-quality-check':
            console.log(JSON.stringify(manager.runQualityCheck(), null, 2));
            break;
        case 'fix-quality-issues':
            manager.fixQualityIssues();
            break;
        default:
            console.log('Unknown command');
    }
}

module.exports = QualityManager; 