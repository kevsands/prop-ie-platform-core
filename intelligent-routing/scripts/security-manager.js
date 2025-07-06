const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');

class SecurityManager {
    constructor() {
        this.projectRoot = path.resolve(__dirname, '..');
        this.securityConfigPath = path.join(this.projectRoot, 'security-config.json');
        this.loadConfigurations();
    }

    loadConfigurations() {
        try {
            this.config = JSON.parse(fs.readFileSync(this.securityConfigPath, 'utf8'));
        } catch (error) {
            this.config = {
                csp: {
                    'default-src': ["'self'"],
                    'script-src': ["'self'", "'unsafe-inline'"],
                    'style-src': ["'self'", "'unsafe-inline'"],
                    'img-src': ["'self'", 'data:', 'https:'],
                    'connect-src': ["'self'", 'https:'],
                    'font-src': ["'self'"],
                    'object-src': ["'none'"],
                    'media-src': ["'self'"],
                    'frame-src': ["'none'"]
                },
                securityHeaders: {
                    'X-Content-Type-Options': 'nosniff',
                    'X-Frame-Options': 'DENY',
                    'X-XSS-Protection': '1; mode=block',
                    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
                    'Content-Security-Policy': this.generateCSPHeader()
                },
                tokenConfig: {
                    accessTokenExpiry: '1h',
                    refreshTokenExpiry: '7d',
                    tokenSecret: crypto.randomBytes(32).toString('hex')
                }
            };
            this.saveConfigurations();
        }
    }

    saveConfigurations() {
        fs.writeFileSync(this.securityConfigPath, JSON.stringify(this.config, null, 2));
    }

    generateCSPHeader() {
        return Object.entries(this.config.csp)
            .map(([key, values]) => `${key} ${values.join(' ')}`)
            .join('; ');
    }

    updateCSP(directive, values) {
        this.config.csp[directive] = values;
        this.config.securityHeaders['Content-Security-Policy'] = this.generateCSPHeader();
        this.saveConfigurations();
    }

    updateSecurityHeaders(headers) {
        this.config.securityHeaders = { ...this.config.securityHeaders, ...headers };
        this.saveConfigurations();
    }

    updateTokenConfig(config) {
        this.config.tokenConfig = { ...this.config.tokenConfig, ...config };
        this.saveConfigurations();
    }

    async runSecurityScan() {
        try {
            const results = {
                timestamp: new Date().toISOString(),
                vulnerabilities: await this.checkVulnerabilities(),
                securityHeaders: this.checkSecurityHeaders(),
                csp: this.checkCSP(),
                tokenSecurity: this.checkTokenSecurity()
            };

            const reportPath = path.join(this.projectRoot, 'reports', `security-scan-${new Date().toISOString().split('T')[0]}.json`);
            fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
            return results;
        } catch (error) {
            console.error('Error running security scan:', error);
            return null;
        }
    }

    async checkVulnerabilities() {
        try {
            const audit = execSync('npm audit --json').toString();
            return JSON.parse(audit);
        } catch (error) {
            console.error('Error checking vulnerabilities:', error);
            return {};
        }
    }

    checkSecurityHeaders() {
        const headers = this.config.securityHeaders;
        const requiredHeaders = [
            'X-Content-Type-Options',
            'X-Frame-Options',
            'X-XSS-Protection',
            'Strict-Transport-Security',
            'Content-Security-Policy'
        ];

        return {
            present: Object.keys(headers),
            missing: requiredHeaders.filter(header => !headers[header]),
            recommendations: this.getHeaderRecommendations()
        };
    }

    checkCSP() {
        const csp = this.config.csp;
        const requiredDirectives = [
            'default-src',
            'script-src',
            'style-src',
            'img-src',
            'connect-src'
        ];

        return {
            present: Object.keys(csp),
            missing: requiredDirectives.filter(directive => !csp[directive]),
            recommendations: this.getCSPRecommendations()
        };
    }

    checkTokenSecurity() {
        const config = this.config.tokenConfig;
        return {
            accessTokenExpiry: config.accessTokenExpiry,
            refreshTokenExpiry: config.refreshTokenExpiry,
            tokenSecret: config.tokenSecret ? 'Set' : 'Not Set',
            recommendations: this.getTokenRecommendations()
        };
    }

    getHeaderRecommendations() {
        return [
            'Ensure all security headers are properly set',
            'Consider adding Referrer-Policy header',
            'Consider adding Permissions-Policy header',
            'Review and update header values regularly'
        ];
    }

    getCSPRecommendations() {
        return [
            'Ensure all required CSP directives are set',
            'Review and restrict allowed sources',
            'Consider using nonce or hash for inline scripts',
            'Regularly audit and update CSP rules'
        ];
    }

    getTokenRecommendations() {
        return [
            'Use strong, unique token secrets',
            'Implement token rotation',
            'Set appropriate token expiry times',
            'Implement proper token storage'
        ];
    }

    generateSecurityReport() {
        const report = {
            timestamp: new Date().toISOString(),
            config: {
                csp: this.config.csp,
                securityHeaders: this.config.securityHeaders,
                tokenConfig: {
                    ...this.config.tokenConfig,
                    tokenSecret: 'REDACTED'
                }
            },
            recommendations: {
                headers: this.getHeaderRecommendations(),
                csp: this.getCSPRecommendations(),
                tokens: this.getTokenRecommendations()
            }
        };

        const reportPath = path.join(this.projectRoot, 'reports', `security-report-${new Date().toISOString().split('T')[0]}.json`);
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        return report;
    }
}

// CLI interface
if (require.main === module) {
    const manager = new SecurityManager();
    const command = process.argv[2];
    const args = process.argv.slice(3);

    switch (command) {
        case 'update-csp':
            manager.updateCSP(args[0], JSON.parse(args[1]));
            break;
        case 'update-headers':
            manager.updateSecurityHeaders(JSON.parse(args[0]));
            break;
        case 'update-token-config':
            manager.updateTokenConfig(JSON.parse(args[0]));
            break;
        case 'run-scan':
            manager.runSecurityScan();
            break;
        case 'generate-report':
            console.log(JSON.stringify(manager.generateSecurityReport(), null, 2));
            break;
        default:
            console.log('Unknown command');
    }
}

module.exports = SecurityManager; 