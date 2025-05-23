#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

class SimplePerformanceAuditor {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      buildIssues: [],
      dependencies: {},
      deployment: {},
      performance: {},
      recommendations: []
    };
  }

  async run() {
    console.log('🔍 Starting Performance & DevOps Audit...\n');

    // 1. Check TypeScript errors
    this.checkTypeScriptErrors();
    
    // 2. Analyze dependencies
    await this.analyzeDependencies();
    
    // 3. Check deployment configuration
    await this.checkDeploymentConfig();
    
    // 4. Analyze current build artifacts if available
    await this.analyzeExistingBuild();
    
    // 5. Performance recommendations
    this.generatePerformanceRecommendations();
    
    // 6. Generate reports
    await this.generateReports();
    
    console.log('\n✅ Audit Complete!');
  }

  checkTypeScriptErrors() {
    console.log('📦 Checking TypeScript errors...');
    
    try {
      const output = execSync('npx tsc --noEmit --pretty false 2>&1 || true', { 
        encoding: 'utf8',
        maxBuffer: 50 * 1024 * 1024 
      });
      
      const errorCount = (output.match(/error TS/g) || []).length;
      const errors = output.split('\n').filter(line => line.includes('error TS'));
      
      // Group errors by type
      const errorTypes = {};
      errors.forEach(error => {
        const match = error.match(/error TS(\d+):/);
        if (match) {
          const code = match[1];
          errorTypes[code] = (errorTypes[code] || 0) + 1;
        }
      });
      
      this.results.buildIssues = {
        totalErrors: errorCount,
        errorTypes,
        topErrors: Object.entries(errorTypes)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([code, count]) => ({ code: `TS${code}`, count }))
      };
      
      console.log(`  Found ${errorCount} TypeScript errors`);
    } catch (error) {
      console.error('  Failed to check TypeScript errors');
    }
  }

  async analyzeDependencies() {
    console.log('\n📚 Analyzing Dependencies...');
    
    const packageJson = require(path.join(process.cwd(), 'package.json'));
    const deps = Object.keys(packageJson.dependencies || {});
    const devDeps = Object.keys(packageJson.devDependencies || {});
    
    // Check for large dependencies
    const largeDeps = [];
    const commonLargeDeps = [
      'moment', 'lodash', 'jquery', 'bootstrap', 'antd', 'material-ui',
      '@mui/material', 'react-bootstrap', 'semantic-ui-react'
    ];
    
    deps.forEach(dep => {
      if (commonLargeDeps.includes(dep)) {
        largeDeps.push(dep);
      }
    });
    
    // Check for duplicate/similar packages
    const duplicates = [];
    
    // Date libraries
    const dateLibs = deps.filter(d => 
      ['moment', 'dayjs', 'date-fns', 'luxon'].includes(d)
    );
    if (dateLibs.length > 1) {
      duplicates.push({ type: 'date libraries', packages: dateLibs });
    }
    
    // HTTP clients
    const httpLibs = deps.filter(d => 
      ['axios', 'node-fetch', 'got', 'request', 'superagent'].includes(d)
    );
    if (httpLibs.length > 1) {
      duplicates.push({ type: 'HTTP clients', packages: httpLibs });
    }
    
    // Form libraries
    const formLibs = deps.filter(d => 
      ['react-hook-form', 'formik', 'react-final-form'].includes(d)
    );
    if (formLibs.length > 1) {
      duplicates.push({ type: 'form libraries', packages: formLibs });
    }
    
    this.results.dependencies = {
      production: deps.length,
      development: devDeps.length,
      total: deps.length + devDeps.length,
      largeDependencies: largeDeps,
      duplicateCategories: duplicates,
      recommendations: []
    };
    
    // Add recommendations
    if (largeDeps.includes('moment')) {
      this.results.dependencies.recommendations.push(
        'Replace moment.js with date-fns or dayjs for smaller bundle size'
      );
    }
    
    if (largeDeps.includes('lodash')) {
      this.results.dependencies.recommendations.push(
        'Use lodash-es and import specific functions to enable tree shaking'
      );
    }
    
    console.log(`  Production deps: ${deps.length}`);
    console.log(`  Development deps: ${devDeps.length}`);
  }

  async checkDeploymentConfig() {
    console.log('\n🚀 Checking Deployment Configuration...');
    
    const config = {
      environment: {
        envFile: fs.existsSync('.env'),
        envExample: fs.existsSync('.env.example') || fs.existsSync('.env.template'),
        gitignored: false
      },
      docker: {
        dockerfile: fs.existsSync('Dockerfile'),
        dockerignore: fs.existsSync('.dockerignore'),
        compose: fs.existsSync('docker-compose.yml')
      },
      cicd: {
        githubActions: fs.existsSync('.github/workflows'),
        vercel: fs.existsSync('vercel.json'),
        netlify: fs.existsSync('netlify.toml'),
        amplify: fs.existsSync('amplify.yml')
      },
      monitoring: {},
      security: {}
    };
    
    // Check if .env is gitignored
    if (fs.existsSync('.gitignore')) {
      const gitignore = fs.readFileSync('.gitignore', 'utf8');
      config.environment.gitignored = gitignore.includes('.env');
    }
    
    // Check package.json for monitoring tools
    const packageJson = require(path.join(process.cwd(), 'package.json'));
    const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    config.monitoring = {
      sentry: !!allDeps['@sentry/nextjs'],
      datadog: !!allDeps['dd-trace'],
      googleAnalytics: !!allDeps['ga-gtag'] || !!allDeps['react-ga']
    };
    
    // Check for security configurations
    if (fs.existsSync('next.config.js')) {
      const nextConfig = fs.readFileSync('next.config.js', 'utf8');
      config.security.headers = nextConfig.includes('headers:') || 
                               nextConfig.includes('securityHeaders');
      config.security.csp = nextConfig.includes('Content-Security-Policy');
    }
    
    this.results.deployment = config;
    
    // Generate deployment issues
    const issues = [];
    
    if (!config.environment.envExample) {
      issues.push('Missing .env.example or .env.template file');
    }
    
    if (!config.environment.gitignored) {
      issues.push('.env file is not gitignored - security risk!');
    }
    
    if (!config.docker.dockerfile) {
      issues.push('Missing Dockerfile for containerized deployment');
    }
    
    if (!Object.values(config.cicd).some(v => v)) {
      issues.push('No CI/CD configuration found');
    }
    
    if (!Object.values(config.monitoring).some(v => v)) {
      issues.push('No monitoring solution configured');
    }
    
    this.results.deployment.issues = issues;
    
    console.log(`  Found ${issues.length} deployment issues`);
  }

  async analyzeExistingBuild() {
    console.log('\n📊 Analyzing Build Artifacts...');
    
    const nextDir = path.join(process.cwd(), '.next');
    if (!fs.existsSync(nextDir)) {
      console.log('  No .next directory found - skipping build analysis');
      return;
    }
    
    // Check build manifest
    const buildManifest = path.join(nextDir, 'build-manifest.json');
    if (fs.existsSync(buildManifest)) {
      const manifest = fs.readJsonSync(buildManifest);
      const pages = Object.keys(manifest.pages || {});
      
      this.results.performance.pageCount = pages.length;
      this.results.performance.hasPages = pages.length > 0;
    }
    
    // Check for static exports
    const staticDir = path.join(nextDir, 'static');
    if (fs.existsSync(staticDir)) {
      const chunks = fs.readdirSync(path.join(staticDir, 'chunks')).filter(f => f.endsWith('.js'));
      this.results.performance.chunkCount = chunks.length;
    }
    
    console.log('  Build artifacts analyzed');
  }

  generatePerformanceRecommendations() {
    console.log('\n⚡ Generating Performance Recommendations...');
    
    const recommendations = [];
    
    // Build recommendations
    if (this.results.buildIssues.totalErrors > 100) {
      recommendations.push({
        category: 'Build',
        priority: 'High',
        issue: `${this.results.buildIssues.totalErrors} TypeScript errors preventing optimized build`,
        action: 'Fix TypeScript errors to enable production optimizations'
      });
    }
    
    // Dependency recommendations
    if (this.results.dependencies.largeDependencies.length > 0) {
      recommendations.push({
        category: 'Bundle Size',
        priority: 'Medium',
        issue: `Large dependencies detected: ${this.results.dependencies.largeDependencies.join(', ')}`,
        action: 'Consider lighter alternatives or lazy loading'
      });
    }
    
    // Deployment recommendations
    this.results.deployment.issues?.forEach(issue => {
      recommendations.push({
        category: 'Deployment',
        priority: issue.includes('security') ? 'High' : 'Medium',
        issue,
        action: 'Fix deployment configuration issue'
      });
    });
    
    // Next.js specific recommendations
    recommendations.push(
      {
        category: 'Performance',
        priority: 'Medium',
        issue: 'Image optimization',
        action: 'Use next/image component for automatic image optimization'
      },
      {
        category: 'Performance',
        priority: 'Medium',
        issue: 'Font optimization',
        action: 'Use next/font for optimized font loading'
      },
      {
        category: 'Performance',
        priority: 'Low',
        issue: 'Bundle analysis',
        action: 'Install @next/bundle-analyzer to identify large modules'
      }
    );
    
    this.results.recommendations = recommendations;
    
    console.log(`  Generated ${recommendations.length} recommendations`);
  }

  async generateReports() {
    console.log('\n📄 Generating Reports...');
    
    // 1. Performance metrics JSON
    await fs.writeJson('performance-metrics.json', this.results, { spaces: 2 });
    
    // 2. Bundle analysis
    const bundleAnalysis = `BUNDLE ANALYSIS REPORT
Generated: ${this.results.timestamp}
${'='.repeat(50)}

DEPENDENCIES:
- Production: ${this.results.dependencies.production}
- Development: ${this.results.dependencies.development}
- Total: ${this.results.dependencies.total}

LARGE DEPENDENCIES:
${this.results.dependencies.largeDependencies.map(d => `- ${d}`).join('\n') || 'None detected'}

DUPLICATE CATEGORIES:
${this.results.dependencies.duplicateCategories.map(d => 
  `- ${d.type}: ${d.packages.join(', ')}`
).join('\n') || 'None detected'}

RECOMMENDATIONS:
${this.results.dependencies.recommendations.map(r => `- ${r}`).join('\n') || 'None'}
`;
    
    await fs.writeFile('bundle-analysis.txt', bundleAnalysis);
    
    // 3. Deployment blockers
    const deploymentBlockers = `DEPLOYMENT BLOCKERS REPORT
Generated: ${this.results.timestamp}
${'='.repeat(50)}

CRITICAL ISSUES:
${this.results.deployment.issues?.map(i => `❌ ${i}`).join('\n') || '✅ No critical issues found'}

CONFIGURATION STATUS:

Environment:
- .env file: ${this.results.deployment.environment.envFile ? '✅' : '❌'}
- .env.example: ${this.results.deployment.environment.envExample ? '✅' : '❌'}
- Gitignored: ${this.results.deployment.environment.gitignored ? '✅' : '❌'}

Docker:
- Dockerfile: ${this.results.deployment.docker.dockerfile ? '✅' : '❌'}
- .dockerignore: ${this.results.deployment.docker.dockerignore ? '✅' : '❌'}
- docker-compose.yml: ${this.results.deployment.docker.compose ? '✅' : '❌'}

CI/CD:
- GitHub Actions: ${this.results.deployment.cicd.githubActions ? '✅' : '❌'}
- Vercel: ${this.results.deployment.cicd.vercel ? '✅' : '❌'}
- Netlify: ${this.results.deployment.cicd.netlify ? '✅' : '❌'}
- AWS Amplify: ${this.results.deployment.cicd.amplify ? '✅' : '❌'}

Monitoring:
- Sentry: ${this.results.deployment.monitoring.sentry ? '✅' : '❌'}
- DataDog: ${this.results.deployment.monitoring.datadog ? '✅' : '❌'}
- Google Analytics: ${this.results.deployment.monitoring.googleAnalytics ? '✅' : '❌'}

Security:
- Security Headers: ${this.results.deployment.security.headers ? '✅' : '❌'}
- CSP: ${this.results.deployment.security.csp ? '✅' : '❌'}
`;
    
    await fs.writeFile('deployment-blockers.txt', deploymentBlockers);
    
    // 4. Optimization opportunities
    const optimizations = `OPTIMIZATION OPPORTUNITIES REPORT
Generated: ${this.results.timestamp}
${'='.repeat(50)}

BUILD ISSUES:
- TypeScript Errors: ${this.results.buildIssues.totalErrors}
- Top Error Types:
${this.results.buildIssues.topErrors?.map(e => 
  `  - ${e.code}: ${e.count} occurrences`
).join('\n') || '  None'}

RECOMMENDATIONS BY PRIORITY:

HIGH PRIORITY:
${this.results.recommendations
  .filter(r => r.priority === 'High')
  .map(r => `- [${r.category}] ${r.issue}\n  Action: ${r.action}`)
  .join('\n\n') || 'None'}

MEDIUM PRIORITY:
${this.results.recommendations
  .filter(r => r.priority === 'Medium')
  .map(r => `- [${r.category}] ${r.issue}\n  Action: ${r.action}`)
  .join('\n\n') || 'None'}

LOW PRIORITY:
${this.results.recommendations
  .filter(r => r.priority === 'Low')
  .map(r => `- [${r.category}] ${r.issue}\n  Action: ${r.action}`)
  .join('\n\n') || 'None'}

QUICK WINS:
1. Fix TypeScript errors to enable build optimizations
2. Remove unused dependencies
3. Add .env.example file
4. Configure monitoring solution
5. Set up CI/CD pipeline
6. Implement security headers
`;
    
    await fs.writeFile('optimization-opportunities.txt', optimizations);
    
    console.log('  Reports generated:');
    console.log('  - performance-metrics.json');
    console.log('  - bundle-analysis.txt');
    console.log('  - deployment-blockers.txt');
    console.log('  - optimization-opportunities.txt');
  }
}

// Main execution
async function main() {
  try {
    const auditor = new SimplePerformanceAuditor();
    await auditor.run();
  } catch (error) {
    console.error('Fatal error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = SimplePerformanceAuditor;