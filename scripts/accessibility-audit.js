#!/usr/bin/env node

/**
 * Accessibility Audit Script
 * 
 * This script performs an accessibility audit on the application by:
 * 1. Running automated axe-core tests on key pages
 * 2. Generating a report of accessibility issues
 * 3. Providing recommendations for fixes
 * 
 * Usage:
 * node scripts/accessibility-audit.js [--ci] [--fix]
 * 
 * Options:
 * --ci      Run in CI mode (no interactive prompts)
 * --fix     Attempt to automatically fix common issues
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const puppeteer = require('puppeteer');
const { AxePuppeteer } = require('@axe-core/puppeteer');
const ora = require('ora');
const prompts = require('prompts');

// Define important routes to test
const ROUTES = [
  { path: '/', name: 'Home' },
  { path: '/login', name: 'Login' },
  { path: '/register', name: 'Register' },
  { path: '/properties', name: 'Properties' },
  { path: '/buyer/dashboard', name: 'Buyer Dashboard', auth: true },
  { path: '/developer/dashboard', name: 'Developer Dashboard', auth: true },
];

// Accessibility criteria to test against
const CRITERIA = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'];

// Main function
async function runAccessibilityAudit() {
  console.log(chalk.blue.bold('\n📊 PropIE Accessibility Audit Tool'));
  console.log(chalk.blue('============================================\n'));
  
  // Parse command line arguments
  const args = process.argv.slice(2);
  const ciMode = args.includes('--ci');
  const fixMode = args.includes('--fix');
  
  // Determine dev server URL
  const baseUrl = 'http://localhost:3000';
  
  // Create output directory
  const outputDir = path.join(process.cwd(), 'accessibility-reports');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }
  
  // Launch browser
  const spinner = ora('Launching browser').start();
  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: 1280, height: 900 },
  });
  
  spinner.succeed('Browser launched');
  
  // Store audit results
  const results = [];
  const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
  const reportFile = path.join(outputDir, `a11y-audit-${timestamp}.json`);
  const summaryFile = path.join(outputDir, `a11y-audit-${timestamp}.md`);
  
  try {
    // Test each route
    for (const route of ROUTES) {
      if (route.auth && !ciMode) {
        spinner.info(`Skipping authenticated route: ${route.name} (${route.path})`);
        continue;
      }
      
      spinner.start(`Analyzing ${route.name} (${route.path})`);
      
      const page = await browser.newPage();
      await page.setBypassCSP(true);
      
      try {
        // Navigate to the page
        await page.goto(`${baseUrl}${route.path}`, { 
          waitUntil: 'networkidle2',
          timeout: 30000,
        });
        
        // Give time for client-side rendering
        await page.waitForTimeout(2000);
        
        // Run axe on the page
        const axeResults = await new AxePuppeteer(page)
          .withTags(CRITERIA)
          .analyze();
        
        results.push({
          route,
          violations: axeResults.violations,
          passes: axeResults.passes.length,
          incomplete: axeResults.incomplete.length,
        });
        
        const issueCount = axeResults.violations.length;
        
        if (issueCount === 0) {
          spinner.succeed(`${route.name}: ${chalk.green('No accessibility issues found')}`);
        } else {
          spinner.warn(`${route.name}: ${chalk.yellow(`${issueCount} accessibility issues found`)}`);
        }
      } catch (error) {
        spinner.fail(`Error analyzing ${route.name}: ${error.message}`);
        results.push({
          route,
          error: error.message,
        });
      } finally {
        await page.close();
      }
    }
    
    // Save detailed results
    fs.writeFileSync(reportFile, JSON.stringify(results, null, 2));
    
    // Generate summary report
    const summary = generateSummaryReport(results);
    fs.writeFileSync(summaryFile, summary);
    
    // Display summary
    console.log(chalk.blue.bold('\n📋 Accessibility Audit Summary'));
    console.log(chalk.blue('============================================\n'));
    
    let totalIssues = 0;
    const issues = results.map(result => {
      if (result.error) {
        return `${result.route.name}: ${chalk.red('Error during analysis')}`;
      }
      
      const issueCount = result.violations.length;
      totalIssues += issueCount;
      
      if (issueCount === 0) {
        return `${result.route.name}: ${chalk.green('No issues')}`;
      } else {
        return `${result.route.name}: ${chalk.yellow(`${issueCount} issues`)}`;
      }
    });
    
    console.log(issues.join('\n'));
    console.log(chalk.blue('\n============================================'));
    
    if (totalIssues === 0) {
      console.log(chalk.green.bold('\n✅ No accessibility issues found!'));
    } else {
      console.log(chalk.yellow.bold(`\n⚠️  Total issues found: ${totalIssues}`));
      console.log(chalk.white(`Detailed report saved to: ${chalk.cyan(summaryFile)}`));
      
      if (!ciMode && fixMode) {
        await attemptAutomaticFixes(results);
      }
      
      if (!ciMode && !fixMode && totalIssues > 0) {
        const { shouldFix } = await prompts({
          type: 'confirm',
          name: 'shouldFix',
          message: 'Would you like to attempt automatic fixes for common issues?',
          initial: false,
        });
        
        if (shouldFix) {
          await attemptAutomaticFixes(results);
        }
      }
    }
  } finally {
    await browser.close();
  }
}

/**
 * Generate a markdown summary report from the audit results
 */
function generateSummaryReport(results) {
  const timestamp = new Date().toLocaleString();
  let report = `# Accessibility Audit Report\n\n`;
  report += `Generated: ${timestamp}\n\n`;
  
  // Summary statistics
  let totalViolations = 0;
  let impactCounts = { critical: 0, serious: 0, moderate: 0, minor: 0 };
  
  results.forEach(result => {
    if (result.violations) {
      totalViolations += result.violations.length;
      
      result.violations.forEach(violation => {
        impactCounts[violation.impact] = (impactCounts[violation.impact] || 0) + 1;
      });
    }
  });
  
  report += `## Summary\n\n`;
  report += `- **Total Pages Scanned**: ${results.length}\n`;
  report += `- **Total Violations Found**: ${totalViolations}\n`;
  report += `- **Impact Breakdown**:\n`;
  
  for (const [impact, count] of Object.entries(impactCounts)) {
    if (count > 0) {
      report += `  - ${impact.charAt(0).toUpperCase() + impact.slice(1)}: ${count}\n`;
    }
  }
  
  report += `\n## Page Results\n\n`;
  
  // Detailed results per page
  results.forEach(result => {
    report += `### ${result.route.name} (${result.route.path})\n\n`;
    
    if (result.error) {
      report += `❌ Error during analysis: ${result.error}\n\n`;
      return;
    }
    
    if (!result.violations || result.violations.length === 0) {
      report += `✅ No accessibility issues found\n\n`;
      return;
    }
    
    report += `- Violations: ${result.violations.length}\n`;
    report += `- Passed Checks: ${result.passes}\n`;
    report += `- Incomplete/Needs Review: ${result.incomplete}\n\n`;
    
    report += `#### Violations\n\n`;
    
    result.violations.forEach(violation => {
      report += `##### ${violation.id}: ${violation.help}\n\n`;
      report += `- **Impact**: ${violation.impact}\n`;
      report += `- **Description**: ${violation.description}\n`;
      report += `- **WCAG**: ${violation.tags.filter(t => t.startsWith('wcag')).join(', ')}\n`;
      report += `- **Elements Affected**: ${violation.nodes.length}\n`;
      
      report += `\n**Recommendation**:\n${violation.helpUrl}\n\n`;
      
      report += `**Example**:\n`;
      if (violation.nodes.length > 0) {
        report += `\`\`\`html\n${violation.nodes[0].html}\n\`\`\`\n\n`;
      }
    });
  });
  
  report += `## Recommendations\n\n`;
  report += `1. Fix critical and serious issues first\n`;
  report += `2. Ensure all interactive elements are keyboard accessible\n`;
  report += `3. Add appropriate ARIA labels to complex UI components\n`;
  report += `4. Ensure color contrast meets WCAG AA standards\n`;
  report += `5. Provide text alternatives for non-text content\n`;
  
  return report;
}

/**
 * Attempt to automatically fix common accessibility issues
 */
async function attemptAutomaticFixes(results) {
  const spinner = ora('Analyzing issues for potential fixes').start();
  
  // Collect all components with issues
  const componentsToFix = new Map();
  
  results.forEach(result => {
    if (!result.violations) return;
    
    result.violations.forEach(violation => {
      violation.nodes.forEach(node => {
        // Try to extract component info from HTML
        const html = node.html;
        const matches = html.match(/<([a-zA-Z0-9]+)[^>]*className="[^"]*"[^>]*>/);
        
        if (matches && matches[1]) {
          const elementType = matches[1];
          
          // Find possible component file
          const componentName = findPossibleComponentName(elementType, html);
          
          if (componentName) {
            if (!componentsToFix.has(componentName)) {
              componentsToFix.set(componentName, []);
            }
            
            componentsToFix.get(componentName).push({
              violation,
              html,
              selector: node.target.join(' '),
            });
          }
        }
      });
    });
  });
  
  spinner.succeed(`Found ${componentsToFix.size} components with potential fixes`);
  
  // If no components to fix, exit
  if (componentsToFix.size === 0) {
    console.log(chalk.yellow('No automatic fixes available'));
    return;
  }
  
  // Display fixable components
  console.log(chalk.blue.bold('\n🔧 Components That Need Fixing'));
  console.log(chalk.blue('============================================\n'));
  
  const componentList = Array.from(componentsToFix.entries()).map(([name, issues]) => {
    return `${name}: ${chalk.yellow(`${issues.length} issues`)}`;
  });
  
  console.log(componentList.join('\n'));
  
  // Save fix suggestions
  const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
  const fixSuggestionsFile = path.join(process.cwd(), 'accessibility-reports', `a11y-fixes-${timestamp}.md`);
  
  let suggestions = `# Accessibility Fix Suggestions\n\n`;
  suggestions += `Generated: ${new Date().toLocaleString()}\n\n`;
  
  for (const [componentName, issues] of componentsToFix.entries()) {
    suggestions += `## ${componentName}\n\n`;
    
    const uniqueViolations = new Map();
    issues.forEach(issue => {
      if (!uniqueViolations.has(issue.violation.id)) {
        uniqueViolations.set(issue.violation.id, issue);
      }
    });
    
    uniqueViolations.forEach(issue => {
      suggestions += `### ${issue.violation.id}: ${issue.violation.help}\n\n`;
      suggestions += `- **Impact**: ${issue.violation.impact}\n`;
      suggestions += `- **Description**: ${issue.violation.description}\n`;
      suggestions += `- **Example HTML**:\n\`\`\`html\n${issue.html}\n\`\`\`\n\n`;
      
      suggestions += `**Fix Suggestion**:\n`;
      
      // Generate fix suggestions based on violation type
      switch (issue.violation.id) {
        case 'button-name':
          suggestions += `Add an aria-label to buttons without text content:\n`;
          suggestions += `\`\`\`jsx\n<button aria-label="Descriptive action name">...</button>\n\`\`\`\n\n`;
          break;
          
        case 'color-contrast':
          suggestions += `Increase the color contrast between text and background:\n`;
          suggestions += `- Update text color to meet at least 4.5:1 contrast ratio\n`;
          suggestions += `- Consider using Tailwind's text-gray-900 on light backgrounds\n`;
          suggestions += `- For dark backgrounds, use at least text-gray-100\n\n`;
          break;
          
        case 'label':
          suggestions += `Add labels to form fields:\n`;
          suggestions += `\`\`\`jsx\n<label htmlFor="field-id">Field Label</label>\n<input id="field-id" />\n\`\`\`\n\n`;
          break;
          
        case 'image-alt':
          suggestions += `Add alt text to images:\n`;
          suggestions += `\`\`\`jsx\n<img src="..." alt="Descriptive text" />\n\`\`\`\n\n`;
          break;
          
        default:
          suggestions += `Review the component and add appropriate accessibility attributes based on the violation description.\n\n`;
          suggestions += `Refer to: ${issue.violation.helpUrl}\n\n`;
      }
    });
  }
  
  fs.writeFileSync(fixSuggestionsFile, suggestions);
  console.log(chalk.white(`\nFix suggestions saved to: ${chalk.cyan(fixSuggestionsFile)}`));
}

/**
 * Try to find a possible component name from HTML
 */
function findPossibleComponentName(elementType, html) {
  // Extract className
  const classMatch = html.match(/className="([^"]*)"/);
  if (!classMatch) return null;
  
  const classes = classMatch[1].split(' ');
  
  // Look for component-specific classes
  const componentClasses = classes.filter(cls => {
    return /^[a-z]+-[a-z]+/.test(cls) || 
           /^(btn|button|card|modal|dialog|form|input|select|nav|menu|list|item)/.test(cls);
  });
  
  if (componentClasses.length > 0) {
    // Convert to PascalCase for component name
    return componentClasses[0]
      .split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join('') + 'Component';
  }
  
  // Fallback: use element type with Component suffix
  return elementType.charAt(0).toUpperCase() + elementType.slice(1) + 'Component';
}

// Run the audit
runAccessibilityAudit().catch(error => {
  console.error(chalk.red(`\n❌ Error: ${error.message}`));
  process.exit(1);
});