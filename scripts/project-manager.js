const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class ProjectManager {
    constructor() {
        this.projectRoot = path.resolve(__dirname, '..');
        this.packageJsonPath = path.join(this.projectRoot, 'package.json');
        this.tsConfigPath = path.join(this.projectRoot, 'tsconfig.json');
        this.loadConfigurations();
    }

    loadConfigurations() {
        this.packageJson = JSON.parse(fs.readFileSync(this.packageJsonPath, 'utf8'));
        this.tsConfig = JSON.parse(fs.readFileSync(this.tsConfigPath, 'utf8'));
    }

    saveConfigurations() {
        fs.writeFileSync(this.packageJsonPath, JSON.stringify(this.packageJson, null, 2));
        fs.writeFileSync(this.tsConfigPath, JSON.stringify(this.tsConfig, null, 2));
    }

    updateDependency(name, version) {
        this.packageJson.dependencies[name] = version;
        this.saveConfigurations();
        this.installDependencies();
    }

    updateDevDependency(name, version) {
        this.packageJson.devDependencies[name] = version;
        this.saveConfigurations();
        this.installDependencies();
    }

    installDependencies() {
        try {
            execSync('npm install', { stdio: 'inherit' });
        } catch (error) {
            console.error('Error installing dependencies:', error);
        }
    }

    updateTypeScriptConfig(config) {
        this.tsConfig = { ...this.tsConfig, ...config };
        this.saveConfigurations();
    }

    checkDependencyConflicts() {
        try {
            execSync('npm ls', { stdio: 'inherit' });
        } catch (error) {
            console.error('Dependency conflicts found:', error);
        }
    }

    updateScripts(scripts) {
        this.packageJson.scripts = { ...this.packageJson.scripts, ...scripts };
        this.saveConfigurations();
    }

    generateDependencyReport() {
        const report = {
            timestamp: new Date().toISOString(),
            dependencies: this.packageJson.dependencies,
            devDependencies: this.packageJson.devDependencies,
            scripts: this.packageJson.scripts,
            typescriptConfig: this.tsConfig
        };

        const reportPath = path.join(this.projectRoot, 'reports', `dependency-report-${new Date().toISOString().split('T')[0]}.json`);
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        return report;
    }

    checkForUpdates() {
        try {
            const outdated = execSync('npm outdated --json').toString();
            return JSON.parse(outdated);
        } catch (error) {
            console.error('Error checking for updates:', error);
            return {};
        }
    }

    updateAllDependencies() {
        try {
            execSync('npm update', { stdio: 'inherit' });
            this.loadConfigurations();
        } catch (error) {
            console.error('Error updating dependencies:', error);
        }
    }

    auditDependencies() {
        try {
            const audit = execSync('npm audit --json').toString();
            return JSON.parse(audit);
        } catch (error) {
            console.error('Error auditing dependencies:', error);
            return {};
        }
    }

    fixAuditIssues() {
        try {
            execSync('npm audit fix', { stdio: 'inherit' });
        } catch (error) {
            console.error('Error fixing audit issues:', error);
        }
    }
}

// CLI interface
if (require.main === module) {
    const manager = new ProjectManager();
    const command = process.argv[2];
    const args = process.argv.slice(3);

    switch (command) {
        case 'update-dependency':
            manager.updateDependency(args[0], args[1]);
            break;
        case 'update-dev-dependency':
            manager.updateDevDependency(args[0], args[1]);
            break;
        case 'update-ts-config':
            manager.updateTypeScriptConfig(JSON.parse(args[0]));
            break;
        case 'check-conflicts':
            manager.checkDependencyConflicts();
            break;
        case 'update-scripts':
            manager.updateScripts(JSON.parse(args[0]));
            break;
        case 'generate-report':
            console.log(JSON.stringify(manager.generateDependencyReport(), null, 2));
            break;
        case 'check-updates':
            console.log(JSON.stringify(manager.checkForUpdates(), null, 2));
            break;
        case 'update-all':
            manager.updateAllDependencies();
            break;
        case 'audit':
            console.log(JSON.stringify(manager.auditDependencies(), null, 2));
            break;
        case 'fix-audit':
            manager.fixAuditIssues();
            break;
        default:
            console.log('Unknown command');
    }
}

module.exports = ProjectManager; 