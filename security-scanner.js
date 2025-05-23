#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

// Security patterns to detect
const SECURITY_PATTERNS = {
  // Malicious code patterns
  cryptoMiners: [
    /coinhive/gi,
    /cryptonight/gi,
    /monero/gi,
    /bitcoin.*min(er|ing)/gi,
    /crypto.*min(er|ing)/gi,
    /web.*min(er|ing)/gi,
    /coin.*imp/gi,
    /crypto.*loot/gi,
    /deepminer/gi,
    /jsecoin/gi,
    /perfektstart/gi,
    /webassembly.*instantiate.*crypto/gi,
    /wasm.*crypto.*hash/gi
  ],
  
  // Backdoor patterns
  backdoors: [
    /eval\s*\(\s*[\"\']?.*base64/gi,
    /eval\s*\(\s*unescape/gi,
    /eval\s*\(\s*decode/gi,
    /Function\s*\(\s*[\"\']?.*base64/gi,
    /new\s+Function\s*\(\s*atob/gi,
    /setTimeout\s*\(\s*[\"\'].*base64/gi,
    /setInterval\s*\(\s*[\"\'].*base64/gi,
    /document\.write\s*\(\s*unescape/gi,
    /\$\$\s*=\s*~\[\];/g, // JSFuck patterns
    /\$\$\s*=\s*\$\$\s*\+/g,
    /_0x[a-f0-9]{4,}/gi, // Obfuscated code
    /\\x[0-9a-f]{2}/gi, // Hex encoded strings
    /String\.fromCharCode\s*\(\s*[0-9,\s]+\)/g
  ],
  
  // Data exfiltration
  dataExfiltration: [
    /fetch\s*\(\s*[\"\']https?:\/\/(?!.*localhost|.*127\.0\.0\.1|.*prop\.ie)/gi,
    /XMLHttpRequest.*open.*POST.*https?:\/\/(?!.*localhost|.*127\.0\.0\.1|.*prop\.ie)/gi,
    /navigator\.(sendBeacon|beacon)\s*\(/gi,
    /websocket.*ws[s]?:\/\/(?!.*localhost|.*127\.0\.0\.1|.*prop\.ie)/gi,
    /localStorage\.getItem.*fetch/gi,
    /sessionStorage\.getItem.*fetch/gi,
    /document\.cookie.*fetch/gi,
    /btoa\s*\(\s*.*localStorage/gi,
    /btoa\s*\(\s*.*sessionStorage/gi,
    /btoa\s*\(\s*.*document\.cookie/gi
  ],
  
  // Exposed secrets
  secrets: [
    /["\']?api[_-]?key["\']?\s*[:=]\s*["\'][^"\']+["\']/gi,
    /["\']?api[_-]?secret["\']?\s*[:=]\s*["\'][^"\']+["\']/gi,
    /["\']?auth[_-]?token["\']?\s*[:=]\s*["\'][^"\']+["\']/gi,
    /["\']?private[_-]?key["\']?\s*[:=]\s*["\'][^"\']+["\']/gi,
    /["\']?secret[_-]?key["\']?\s*[:=]\s*["\'][^"\']+["\']/gi,
    /["\']?access[_-]?token["\']?\s*[:=]\s*["\'][^"\']+["\']/gi,
    /["\']?refresh[_-]?token["\']?\s*[:=]\s*["\'][^"\']+["\']/gi,
    /["\']?client[_-]?secret["\']?\s*[:=]\s*["\'][^"\']+["\']/gi,
    /["\']?password["\']?\s*[:=]\s*["\'][^"\']+["\']/gi,
    /["\']?db[_-]?password["\']?\s*[:=]\s*["\'][^"\']+["\']/gi,
    /["\']?database[_-]?url["\']?\s*[:=]\s*["\'][^"\']+["\']/gi,
    /["\']?connection[_-]?string["\']?\s*[:=]\s*["\'][^"\']+["\']/gi,
    /aws[_-]?access[_-]?key[_-]?id/gi,
    /aws[_-]?secret[_-]?access[_-]?key/gi,
    /-----BEGIN\s+(RSA\s+)?PRIVATE\s+KEY-----/g,
    /sk[_-]live[_-][a-zA-Z0-9]{20,}/g, // Stripe
    /pk[_-]live[_-][a-zA-Z0-9]{20,}/g,
    /ghp_[a-zA-Z0-9]{36}/g, // GitHub
    /gho_[a-zA-Z0-9]{36}/g,
    /github_pat_[a-zA-Z0-9]{22}_[a-zA-Z0-9]{59}/g
  ],
  
  // SQL Injection vulnerabilities
  sqlInjection: [
    /query\s*\(\s*[\"\'].*\+.*[\"\']?\s*\)/gi,
    /query\s*\(\s*`.*\$\{.*\}`\s*\)/gi,
    /execute\s*\(\s*[\"\'].*\+.*[\"\']?\s*\)/gi,
    /raw\s*\(\s*[\"\'].*\+.*[\"\']?\s*\)/gi,
    /sequelize\.query\s*\(\s*[\"\'].*\+/gi,
    /knex\.raw\s*\(\s*[\"\'].*\+/gi,
    /\$queryRaw\s*`.*\$\{.*\}`/g,
    /\$executeRaw\s*`.*\$\{.*\}`/g
  ],
  
  // XSS vulnerabilities
  xss: [
    /innerHTML\s*=\s*[^"\'`]+[;\s]/gi,
    /outerHTML\s*=\s*[^"\'`]+[;\s]/gi,
    /document\.write\s*\(/gi,
    /document\.writeln\s*\(/gi,
    /dangerouslySetInnerHTML/gi,
    /v-html\s*=/gi,
    /\{\{\{.*\}\}\}/g, // Unescaped mustache templates
    /eval\s*\(/gi,
    /setTimeout\s*\(\s*[^"\'`]+,/gi,
    /setInterval\s*\(\s*[^"\'`]+,/gi,
    /new\s+Function\s*\(/gi
  ],
  
  // Command injection
  commandInjection: [
    /exec\s*\(\s*[^"\'`]+\+/gi,
    /execSync\s*\(\s*[^"\'`]+\+/gi,
    /spawn\s*\(\s*[^"\'`]+,.*\+/gi,
    /child_process.*exec.*\+/gi,
    /shell\s*:\s*true/gi
  ],
  
  // Path traversal
  pathTraversal: [
    /\.\.\/\.\.\//g,
    /readFile.*\+.*["\']?\s*\)/gi,
    /readFileSync.*\+.*["\']?\s*\)/gi,
    /createReadStream.*\+.*["\']?\s*\)/gi,
    /sendFile.*\+.*["\']?\s*\)/gi
  ],
  
  // Insecure randomness
  insecureRandom: [
    /Math\.random\s*\(\s*\).*(?:password|token|key|secret|salt|iv)/gi,
    /Date\.now\s*\(\s*\).*(?:password|token|key|secret|salt|iv)/gi
  ],
  
  // Suspicious URLs
  suspiciousUrls: [
    /https?:\/\/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/g, // IP addresses
    /https?:\/\/.*\.tk[\/\s"\']/g, // Suspicious TLDs
    /https?:\/\/.*\.ml[\/\s"\']/g,
    /https?:\/\/.*\.ga[\/\s"\']/g,
    /https?:\/\/.*\.cf[\/\s"\']/g,
    /https?:\/\/bit\.ly/g,
    /https?:\/\/tinyurl\.com/g,
    /https?:\/\/goo\.gl/g,
    /https?:\/\/.*pastebin\.com/g,
    /https?:\/\/.*hastebin\.com/g,
    /https?:\/\/.*privatebin\.net/g
  ],
  
  // Vulnerable dependencies patterns
  vulnerablePatterns: [
    /require\s*\(\s*["\']child_process["\']\s*\)/g,
    /require\s*\(\s*["\']fs["\']\s*\)/g,
    /require\s*\(\s*["\']net["\']\s*\)/g,
    /require\s*\(\s*["\']dgram["\']\s*\)/g,
    /require\s*\(\s*["\']cluster["\']\s*\)/g,
    /process\.env\.[A-Z_]+/g,
    /process\.exit\s*\(/g,
    /process\.kill\s*\(/g
  ]
};

// Files and directories to skip
const SKIP_PATTERNS = [
  /node_modules/,
  /\.git/,
  /\.next/,
  /dist/,
  /build/,
  /coverage/,
  /\.min\.js$/,
  /\.map$/,
  /package-lock\.json$/,
  /pnpm-lock\.yaml$/,
  /yarn\.lock$/,
  /\.test\.(js|ts|jsx|tsx)$/,
  /\.spec\.(js|ts|jsx|tsx)$/,
  /__tests__/,
  /\.d\.ts$/
];

// Suspicious npm packages
const SUSPICIOUS_PACKAGES = [
  'flatmap-stream',
  'event-stream',
  'eslint-scope',
  'eslint-config-eslint',
  'cross-env',
  'nodemailer-js',
  'crossenv',
  'node-fabric',
  'node-opencv',
  'node-opensl',
  'node-openssl',
  'node-opencv',
  'node-sass-js',
  'node-tk5',
  'sqlite.js',
  'd3.js',
  'gruntcli',
  'discordi.js',
  'discord-api.js',
  'mariadb',
  'mysqljs',
  'node-sqlite',
  'nodesass',
  'nodefabric',
  'node-opensl',
  'mongose',
  'mssql-node',
  'mssql.js',
  'opencv.js',
  'openssl.js',
  'proxy.js',
  'shadowsocks-js',
  'smb',
  'sqliter',
  'sqlserver',
  'vue-cli',
  'uglifyjs',
  'uglify-js',
  'uglify-es',
  'uglifyes',
  'uglifyjs2'
];

class SecurityScanner {
  constructor() {
    this.findings = {
      critical: [],
      high: [],
      medium: [],
      low: [],
      info: []
    };
    this.stats = {
      filesScanned: 0,
      vulnerabilitiesFound: 0,
      startTime: Date.now()
    };
  }

  async scan(rootPath) {
    console.log('🔍 Starting comprehensive security scan...\n');
    
    // Check package.json for suspicious packages
    await this.checkPackageJson(rootPath);
    
    // Scan all files
    await this.scanDirectory(rootPath);
    
    // Check for npm audit vulnerabilities
    await this.runNpmAudit(rootPath);
    
    // Check for exposed environment files
    await this.checkEnvironmentFiles(rootPath);
    
    // Generate report
    await this.generateReport(rootPath);
  }

  async scanDirectory(dirPath) {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        
        // Skip if matches skip pattern
        if (SKIP_PATTERNS.some(pattern => pattern.test(fullPath))) {
          continue;
        }
        
        if (entry.isDirectory()) {
          await this.scanDirectory(fullPath);
        } else if (entry.isFile() && this.shouldScanFile(entry.name)) {
          await this.scanFile(fullPath);
        }
      }
    } catch (error) {
      console.error(`Error scanning directory ${dirPath}:`, error.message);
    }
  }

  shouldScanFile(filename) {
    const extensions = ['.js', '.jsx', '.ts', '.tsx', '.json', '.env', '.yml', '.yaml', '.sh', '.sql'];
    return extensions.some(ext => filename.endsWith(ext));
  }

  async scanFile(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      this.stats.filesScanned++;
      
      // Check for each security pattern
      for (const [category, patterns] of Object.entries(SECURITY_PATTERNS)) {
        for (const pattern of patterns) {
          const matches = content.match(pattern);
          if (matches) {
            for (const match of matches) {
              await this.addFinding(category, filePath, match, content);
            }
          }
        }
      }
      
      // Check for hardcoded IPs
      const ipPattern = /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g;
      const ips = content.match(ipPattern);
      if (ips) {
        for (const ip of ips) {
          if (!this.isLocalIP(ip)) {
            await this.addFinding('suspiciousUrls', filePath, ip, content);
          }
        }
      }
      
    } catch (error) {
      console.error(`Error scanning file ${filePath}:`, error.message);
    }
  }

  isLocalIP(ip) {
    return ip.startsWith('127.') || 
           ip.startsWith('192.168.') || 
           ip.startsWith('10.') || 
           ip.startsWith('172.') ||
           ip === '0.0.0.0' ||
           ip === '255.255.255.255';
  }

  async addFinding(category, filePath, match, content) {
    const lines = content.split('\n');
    let lineNumber = 1;
    let context = '';
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(match)) {
        lineNumber = i + 1;
        context = lines.slice(Math.max(0, i - 2), Math.min(lines.length, i + 3)).join('\n');
        break;
      }
    }
    
    const severity = this.getSeverity(category, match);
    const finding = {
      category,
      severity,
      file: filePath,
      line: lineNumber,
      match: match.substring(0, 100) + (match.length > 100 ? '...' : ''),
      context: context.substring(0, 300) + (context.length > 300 ? '...' : ''),
      timestamp: new Date().toISOString()
    };
    
    // Avoid duplicate findings
    const isDuplicate = this.findings[severity].some(f => 
      f.file === finding.file && 
      f.line === finding.line && 
      f.category === finding.category
    );
    
    if (!isDuplicate) {
      this.findings[severity].push(finding);
      this.stats.vulnerabilitiesFound++;
    }
  }

  getSeverity(category, match) {
    // Critical severity
    if (['cryptoMiners', 'backdoors', 'dataExfiltration'].includes(category)) {
      return 'critical';
    }
    
    // High severity
    if (['secrets', 'sqlInjection', 'commandInjection'].includes(category)) {
      // Check if it's actually a secret or just a placeholder
      if (category === 'secrets') {
        const lowerMatch = match.toLowerCase();
        if (lowerMatch.includes('your-') || 
            lowerMatch.includes('example') || 
            lowerMatch.includes('placeholder') ||
            lowerMatch.includes('xxx') ||
            lowerMatch.includes('test') ||
            lowerMatch.includes('demo')) {
          return 'low';
        }
      }
      return 'high';
    }
    
    // Medium severity
    if (['xss', 'pathTraversal', 'insecureRandom'].includes(category)) {
      return 'medium';
    }
    
    // Low severity
    return 'low';
  }

  async checkPackageJson(rootPath) {
    try {
      const packageJsonPath = path.join(rootPath, 'package.json');
      const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));
      
      const allDeps = {
        ...packageJson.dependencies || {},
        ...packageJson.devDependencies || {}
      };
      
      for (const [pkg, version] of Object.entries(allDeps)) {
        // Check for suspicious packages
        if (SUSPICIOUS_PACKAGES.includes(pkg)) {
          this.findings.critical.push({
            category: 'suspiciousPackage',
            severity: 'critical',
            file: 'package.json',
            match: `${pkg}@${version}`,
            context: `Suspicious package detected: ${pkg}. This package has been flagged for potential security issues.`,
            timestamp: new Date().toISOString()
          });
        }
        
        // Check for packages with wildcards
        if (version.includes('*') || version === 'latest') {
          this.findings.high.push({
            category: 'unpinnedDependency',
            severity: 'high',
            file: 'package.json',
            match: `${pkg}@${version}`,
            context: `Unpinned dependency: ${pkg}. Using wildcards or 'latest' can introduce breaking changes or vulnerabilities.`,
            timestamp: new Date().toISOString()
          });
        }
        
        // Check for git dependencies
        if (version.includes('git') || version.includes('github')) {
          this.findings.medium.push({
            category: 'gitDependency',
            severity: 'medium',
            file: 'package.json',
            match: `${pkg}@${version}`,
            context: `Git dependency detected: ${pkg}. Git dependencies can change without notice.`,
            timestamp: new Date().toISOString()
          });
        }
      }
    } catch (error) {
      console.error('Error checking package.json:', error.message);
    }
  }

  async runNpmAudit(rootPath) {
    console.log('Running npm audit...');
    try {
      const { stdout } = await execAsync('npm audit --json', { 
        cwd: rootPath,
        maxBuffer: 1024 * 1024 * 10 // 10MB buffer
      });
      
      const auditResult = JSON.parse(stdout);
      
      if (auditResult.vulnerabilities) {
        for (const [name, vuln] of Object.entries(auditResult.vulnerabilities)) {
          const severity = vuln.severity === 'moderate' ? 'medium' : vuln.severity;
          
          this.findings[severity] = this.findings[severity] || [];
          this.findings[severity].push({
            category: 'npmVulnerability',
            severity,
            file: 'package.json',
            match: name,
            context: `${vuln.via[0]?.title || 'Vulnerability'} - ${vuln.via[0]?.url || ''}`,
            fixAvailable: vuln.fixAvailable,
            timestamp: new Date().toISOString()
          });
        }
      }
    } catch (error) {
      console.error('npm audit failed:', error.message);
    }
  }

  async checkEnvironmentFiles(rootPath) {
    const envFiles = ['.env', '.env.local', '.env.production', '.env.development'];
    
    for (const envFile of envFiles) {
      const envPath = path.join(rootPath, envFile);
      try {
        const stats = await fs.stat(envPath);
        if (stats.isFile()) {
          // Check if .env file is in .gitignore
          try {
            const gitignorePath = path.join(rootPath, '.gitignore');
            const gitignore = await fs.readFile(gitignorePath, 'utf8');
            if (!gitignore.includes(envFile)) {
              this.findings.critical.push({
                category: 'exposedEnvFile',
                severity: 'critical',
                file: envFile,
                match: envFile,
                context: `Environment file ${envFile} is not in .gitignore and may be committed to version control`,
                timestamp: new Date().toISOString()
              });
            }
          } catch (e) {
            // No .gitignore file
          }
          
          // Scan the env file for secrets
          await this.scanFile(envPath);
        }
      } catch (error) {
        // File doesn't exist, skip
      }
    }
  }

  async generateReport(rootPath) {
    const reportPath = path.join(rootPath, `security-report-${Date.now()}.json`);
    const htmlReportPath = path.join(rootPath, `security-report-${Date.now()}.html`);
    
    const report = {
      summary: {
        scanDate: new Date().toISOString(),
        duration: `${((Date.now() - this.stats.startTime) / 1000).toFixed(2)}s`,
        filesScanned: this.stats.filesScanned,
        totalFindings: this.stats.vulnerabilitiesFound,
        findingsBySeverity: {
          critical: this.findings.critical.length,
          high: this.findings.high.length,
          medium: this.findings.medium.length,
          low: this.findings.low.length,
          info: this.findings.info.length
        }
      },
      findings: this.findings,
      recommendations: this.getRecommendations()
    };
    
    // Save JSON report
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    
    // Generate HTML report
    const htmlContent = this.generateHTMLReport(report);
    await fs.writeFile(htmlReportPath, htmlContent);
    
    // Print summary to console
    console.log('\n📊 Security Scan Summary');
    console.log('========================');
    console.log(`Files scanned: ${this.stats.filesScanned}`);
    console.log(`Total findings: ${this.stats.vulnerabilitiesFound}`);
    console.log(`\nFindings by severity:`);
    console.log(`  🔴 Critical: ${this.findings.critical.length}`);
    console.log(`  🟠 High: ${this.findings.high.length}`);
    console.log(`  🟡 Medium: ${this.findings.medium.length}`);
    console.log(`  🔵 Low: ${this.findings.low.length}`);
    console.log(`  ⚪ Info: ${this.findings.info.length}`);
    console.log(`\n📄 Full report saved to:`);
    console.log(`   JSON: ${reportPath}`);
    console.log(`   HTML: ${htmlReportPath}`);
    
    // Print critical findings
    if (this.findings.critical.length > 0) {
      console.log('\n🚨 CRITICAL FINDINGS:');
      this.findings.critical.slice(0, 5).forEach(f => {
        console.log(`   - ${f.category} in ${f.file}:${f.line}`);
        console.log(`     ${f.match}`);
      });
      if (this.findings.critical.length > 5) {
        console.log(`   ... and ${this.findings.critical.length - 5} more critical findings`);
      }
    }
  }

  generateHTMLReport(report) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Security Scan Report</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .header {
            background: #2c3e50;
            color: white;
            padding: 30px;
            border-radius: 8px;
            margin-bottom: 30px;
        }
        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .stat-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            text-align: center;
        }
        .stat-value {
            font-size: 36px;
            font-weight: bold;
            margin: 10px 0;
        }
        .severity-critical { color: #e74c3c; }
        .severity-high { color: #e67e22; }
        .severity-medium { color: #f39c12; }
        .severity-low { color: #3498db; }
        .severity-info { color: #95a5a6; }
        .findings-section {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .finding {
            border-left: 4px solid;
            padding: 15px;
            margin: 10px 0;
            background: #f8f9fa;
        }
        .finding-critical { border-color: #e74c3c; }
        .finding-high { border-color: #e67e22; }
        .finding-medium { border-color: #f39c12; }
        .finding-low { border-color: #3498db; }
        .finding-info { border-color: #95a5a6; }
        .code {
            font-family: 'Courier New', monospace;
            background: #2c3e50;
            color: #ecf0f1;
            padding: 10px;
            border-radius: 4px;
            overflow-x: auto;
            margin: 10px 0;
        }
        .recommendations {
            background: #ecf0f1;
            padding: 20px;
            border-radius: 8px;
            margin-top: 30px;
        }
        h2 {
            border-bottom: 2px solid #3498db;
            padding-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🔒 Security Scan Report</h1>
        <p>Generated on ${new Date(report.summary.scanDate).toLocaleString()}</p>
        <p>Scan duration: ${report.summary.duration}</p>
    </div>

    <div class="summary">
        <div class="stat-card">
            <div class="stat-label">Files Scanned</div>
            <div class="stat-value">${report.summary.filesScanned}</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">Total Findings</div>
            <div class="stat-value">${report.summary.totalFindings}</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">Critical</div>
            <div class="stat-value severity-critical">${report.summary.findingsBySeverity.critical}</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">High</div>
            <div class="stat-value severity-high">${report.summary.findingsBySeverity.high}</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">Medium</div>
            <div class="stat-value severity-medium">${report.summary.findingsBySeverity.medium}</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">Low</div>
            <div class="stat-value severity-low">${report.summary.findingsBySeverity.low}</div>
        </div>
    </div>

    ${['critical', 'high', 'medium', 'low', 'info'].map(severity => {
      const findings = report.findings[severity];
      if (findings.length === 0) return '';
      
      return `
        <div class="findings-section">
            <h2 class="severity-${severity}">${severity.toUpperCase()} Severity Findings (${findings.length})</h2>
            ${findings.map(finding => `
                <div class="finding finding-${severity}">
                    <strong>${finding.category}</strong> - ${finding.file}:${finding.line || 'N/A'}
                    <div class="code">${this.escapeHtml(finding.match)}</div>
                    ${finding.context ? `<p>${this.escapeHtml(finding.context)}</p>` : ''}
                    ${finding.fixAvailable ? '<p>✅ Fix available via npm audit fix</p>' : ''}
                </div>
            `).join('')}
        </div>
      `;
    }).join('')}

    <div class="recommendations">
        <h2>📋 Recommendations</h2>
        <ul>
            ${report.recommendations.map(rec => `<li>${rec}</li>`).join('')}
        </ul>
    </div>
</body>
</html>`;
  }

  escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, m => map[m]);
  }

  getRecommendations() {
    const recommendations = [];
    
    if (this.findings.critical.length > 0) {
      recommendations.push('🚨 URGENT: Address all critical security findings immediately');
      recommendations.push('Review and remove any malicious code, backdoors, or crypto miners');
      recommendations.push('Rotate all exposed secrets and API keys');
    }
    
    if (this.findings.high.length > 0) {
      recommendations.push('Fix SQL injection vulnerabilities by using parameterized queries');
      recommendations.push('Address command injection risks by validating and sanitizing inputs');
      recommendations.push('Remove hardcoded secrets and use environment variables');
    }
    
    if (this.findings.medium.length > 0) {
      recommendations.push('Implement proper XSS protection using content security policies');
      recommendations.push('Use crypto.randomBytes() instead of Math.random() for security tokens');
      recommendations.push('Validate file paths to prevent directory traversal attacks');
    }
    
    recommendations.push('Run npm audit fix to patch known vulnerabilities');
    recommendations.push('Keep all dependencies up to date');
    recommendations.push('Implement security headers (CSP, HSTS, X-Frame-Options)');
    recommendations.push('Use static code analysis tools in CI/CD pipeline');
    recommendations.push('Conduct regular security audits and penetration testing');
    recommendations.push('Implement proper logging and monitoring');
    recommendations.push('Follow OWASP security best practices');
    
    return recommendations;
  }
}

// Run the scanner
async function main() {
  const scanner = new SecurityScanner();
  const rootPath = process.argv[2] || process.cwd();
  
  try {
    await scanner.scan(rootPath);
  } catch (error) {
    console.error('Security scan failed:', error);
    process.exit(1);
  }
}

main();