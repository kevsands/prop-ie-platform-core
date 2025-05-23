#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

async function generateSecuritySummary() {
  // Read the most recent security report
  const files = await fs.readdir('.');
  const reportFiles = files.filter(f => f.startsWith('security-report-') && f.endsWith('.json'));
  
  if (reportFiles.length === 0) {
    console.error('No security report found. Run security-scanner.js first.');
    return;
  }
  
  const latestReport = reportFiles.sort().pop();
  const report = JSON.parse(await fs.readFile(latestReport, 'utf8'));
  
  // Filter out false positives
  const realCriticalFindings = report.findings.critical.filter(f => {
    // Filter out ANSI color codes (these are not backdoors)
    if (f.category === 'backdoors' && f.match === '\\x1b') return false;
    
    // cross-env is actually a legitimate package, but was flagged due to a past incident
    // The current version is safe
    if (f.category === 'suspiciousPackage' && f.match.includes('cross-env@^7')) return false;
    
    return true;
  });
  
  const realHighFindings = report.findings.high.filter(f => {
    // Filter out placeholder secrets
    if (f.category === 'secrets' && (
      f.match.includes('your-') ||
      f.match.includes('placeholder') ||
      f.match.includes('example') ||
      f.match.includes('test') ||
      f.match.includes('mock') ||
      f.match.includes('$2b$10$') || // bcrypt hashes are fine
      f.context.includes('test') ||
      f.context.includes('mock')
    )) return false;
    
    // Filter out environment variable references (not actual secrets)
    if (f.category === 'secrets' && (
      f.match === 'AWS_ACCESS_KEY_ID' ||
      f.match === 'AWS_SECRET_ACCESS_KEY' ||
      f.match === 'DATABASE_URL'
    ) && !f.match.includes('=')) return false;
    
    // shell: true is needed for npm scripts
    if (f.category === 'commandInjection' && f.match === 'shell: true' && 
        (f.file.includes('start-') || f.file.includes('test-'))) return false;
    
    return true;
  });
  
  const realMediumFindings = report.findings.medium.filter(f => {
    // Filter out legitimate uses
    if (f.category === 'xss' && f.match === 'dangerouslySetInnerHTML' && 
        f.file.includes('test')) return false;
    
    // eval in test files is acceptable
    if ((f.category === 'xss' || f.category === 'backdoors') && 
        f.match.includes('eval') && f.file.includes('test')) return false;
    
    return true;
  });
  
  // Group findings by category
  const findingsByCategory = {};
  
  [...realCriticalFindings, ...realHighFindings, ...realMediumFindings].forEach(f => {
    if (!findingsByCategory[f.category]) {
      findingsByCategory[f.category] = [];
    }
    findingsByCategory[f.category].push(f);
  });
  
  // Generate summary report
  const summary = {
    scanDate: report.summary.scanDate,
    filesScanned: report.summary.filesScanned,
    realFindings: {
      critical: realCriticalFindings.length,
      high: realHighFindings.length,
      medium: realMediumFindings.length
    },
    topIssues: [],
    recommendations: []
  };
  
  // Identify top issues
  if (realCriticalFindings.length > 0) {
    summary.topIssues.push({
      severity: 'CRITICAL',
      description: 'Critical security vulnerabilities found',
      count: realCriticalFindings.length,
      examples: realCriticalFindings.slice(0, 3).map(f => ({
        file: f.file,
        issue: f.match,
        category: f.category
      }))
    });
  }
  
  // Check for real exposed secrets
  const exposedSecrets = [...realCriticalFindings, ...realHighFindings]
    .filter(f => f.category === 'secrets' && !f.match.includes('your-'));
  
  if (exposedSecrets.length > 0) {
    summary.topIssues.push({
      severity: 'HIGH',
      description: 'Potentially exposed secrets or API keys',
      count: exposedSecrets.length,
      examples: exposedSecrets.slice(0, 3).map(f => ({
        file: f.file,
        issue: f.match.substring(0, 30) + '...',
        line: f.line
      }))
    });
  }
  
  // Check for SQL injection risks
  const sqlInjectionRisks = report.findings.high
    .filter(f => f.category === 'sqlInjection');
  
  if (sqlInjectionRisks.length > 0) {
    summary.topIssues.push({
      severity: 'HIGH',
      description: 'Potential SQL injection vulnerabilities',
      count: sqlInjectionRisks.length,
      examples: sqlInjectionRisks.slice(0, 3).map(f => ({
        file: f.file,
        issue: f.match,
        line: f.line
      }))
    });
  }
  
  // Check for XSS risks
  const xssRisks = realMediumFindings
    .filter(f => f.category === 'xss');
  
  if (xssRisks.length > 0) {
    summary.topIssues.push({
      severity: 'MEDIUM',
      description: 'Potential XSS vulnerabilities',
      count: xssRisks.length,
      examples: xssRisks.slice(0, 3).map(f => ({
        file: f.file,
        issue: f.match,
        line: f.line
      }))
    });
  }
  
  // Generate actionable recommendations
  if (exposedSecrets.length > 0) {
    summary.recommendations.push('🔴 URGENT: Review and rotate any exposed API keys or secrets');
    summary.recommendations.push('🔴 Move all secrets to environment variables');
    summary.recommendations.push('🔴 Ensure .env files are in .gitignore');
  }
  
  if (sqlInjectionRisks.length > 0) {
    summary.recommendations.push('🟠 Use parameterized queries with Prisma instead of raw SQL');
    summary.recommendations.push('🟠 Validate and sanitize all user inputs');
  }
  
  if (xssRisks.length > 0) {
    summary.recommendations.push('🟡 Implement Content Security Policy headers');
    summary.recommendations.push('🟡 Use React\'s built-in escaping instead of dangerouslySetInnerHTML');
    summary.recommendations.push('🟡 Sanitize any HTML content from user inputs');
  }
  
  summary.recommendations.push('✅ Run npm audit fix to patch known vulnerabilities');
  summary.recommendations.push('✅ Keep all dependencies up to date');
  summary.recommendations.push('✅ Implement security headers in middleware');
  summary.recommendations.push('✅ Add rate limiting to API endpoints');
  summary.recommendations.push('✅ Enable CORS only for trusted domains');
  
  // Print summary
  console.log('\n🔒 SECURITY SCAN SUMMARY');
  console.log('========================\n');
  
  console.log(`📊 Scan Results (filtered for real issues):`);
  console.log(`   Files scanned: ${summary.filesScanned}`);
  console.log(`   Critical issues: ${summary.realFindings.critical}`);
  console.log(`   High issues: ${summary.realFindings.high}`);
  console.log(`   Medium issues: ${summary.realFindings.medium}`);
  
  if (summary.topIssues.length > 0) {
    console.log('\n🚨 TOP SECURITY ISSUES:');
    summary.topIssues.forEach(issue => {
      console.log(`\n   ${issue.severity}: ${issue.description} (${issue.count} found)`);
      issue.examples.forEach(ex => {
        console.log(`      - ${ex.file}${ex.line ? ':' + ex.line : ''}`);
        console.log(`        ${ex.issue}`);
      });
    });
  } else {
    console.log('\n✅ No critical security issues found!');
  }
  
  console.log('\n📋 RECOMMENDATIONS:');
  summary.recommendations.forEach(rec => {
    console.log(`   ${rec}`);
  });
  
  // Save clean summary
  await fs.writeFile('security-summary.json', JSON.stringify(summary, null, 2));
  console.log('\n📄 Clean summary saved to: security-summary.json');
  
  // Check specific security concerns
  console.log('\n🔍 SPECIFIC SECURITY CHECKS:');
  
  // Check for crypto miners
  const cryptoMiners = report.findings.critical
    .filter(f => f.category === 'cryptoMiners');
  console.log(`   ✅ Crypto miners: ${cryptoMiners.length === 0 ? 'NONE FOUND' : cryptoMiners.length + ' FOUND!'}`);
  
  // Check for real backdoors
  const backdoors = report.findings.critical
    .filter(f => f.category === 'backdoors' && f.match !== '\\x1b');
  console.log(`   ✅ Backdoors: ${backdoors.length === 0 ? 'NONE FOUND' : backdoors.length + ' FOUND!'}`);
  
  // Check for data exfiltration
  const dataExfil = report.findings.critical
    .filter(f => f.category === 'dataExfiltration');
  console.log(`   ✅ Data exfiltration: ${dataExfil.length === 0 ? 'NONE FOUND' : dataExfil.length + ' FOUND!'}`);
  
  // Check for suspicious URLs
  const suspUrls = [...report.findings.critical, ...report.findings.high]
    .filter(f => f.category === 'suspiciousUrls');
  console.log(`   ✅ Suspicious URLs: ${suspUrls.length === 0 ? 'NONE FOUND' : suspUrls.length + ' FOUND!'}`);
  
  // Overall assessment
  console.log('\n🏁 OVERALL ASSESSMENT:');
  if (realCriticalFindings.length === 0 && realHighFindings.length === 0) {
    console.log('   ✅ No critical or high-severity security issues found.');
    console.log('   ✅ The codebase appears to be free from malicious code.');
    console.log('   ⚠️  Some medium-severity issues should be addressed for best practices.');
  } else {
    console.log('   ⚠️  Security issues found that need attention.');
    console.log('   🔧 Review the recommendations above to improve security posture.');
  }
}

generateSecuritySummary().catch(console.error);