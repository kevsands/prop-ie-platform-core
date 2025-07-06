#!/usr/bin/env node

/**
 * JSX Error Finder
 * 
 * This script scans React components for common JSX syntax errors:
 * - Unclosed tags
 * - Mismatched opening/closing tags
 * - Code after the component export
 * - Invalid JSX expressions
 * 
 * Usage: node find-jsx-errors.js [directory]
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const stat = promisify(fs.stat);

// Default directory to scan if none provided
const defaultDir = './src/components';
const targetDir = process.argv[2] || defaultDir;

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
};

// File extensions to scan
const extensions = ['.tsx', '.jsx'];

// Counter for issues found
let issuesFound = 0;

// Function to recursively scan directories
async function scanDirectory(directory) {
  try {
    const entries = await readdir(directory);
    
    for (const entry of entries) {
      if (entry === 'node_modules' || entry.startsWith('.')) continue;
      
      const fullPath = path.join(directory, entry);
      const entryStat = await stat(fullPath);
      
      if (entryStat.isDirectory()) {
        await scanDirectory(fullPath);
      } else if (entryStat.isFile() && extensions.includes(path.extname(entry))) {
        await analyzeFile(fullPath);
      }
    }
  } catch (error) {
    console.error(`${colors.red}Error scanning directory ${directory}:${colors.reset}`, error);
  }
}

// Function to analyze a single file for JSX errors
async function analyzeFile(filePath) {
  try {
    const content = await readFile(filePath, 'utf8');
    const lines = content.split('\n');
    
    let fileHasIssues = false;
    const issues = [];
    
    // Check for code after component export
    const exportDefaultIndex = lines.findIndex(line => /^export\s+default\s+\w+/.test(line));
    if (exportDefaultIndex >= 0) {
      // Look for non-comment, non-whitespace content after export default
      const codeAfterExport = lines.slice(exportDefaultIndex + 1)
        .some(line => {
          const trimmed = line.trim();
          return trimmed.length > 0 && 
                 !trimmed.startsWith('//') && 
                 !trimmed.startsWith('/*') &&
                 !trimmed.startsWith('*');
        });
      
      if (codeAfterExport) {
        issues.push({
          line: exportDefaultIndex + 1,
          message: "Code found after 'export default' statement"
        });
      }
    }
    
    // Check for unclosed tags
    const openingTags = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Skip lines in string literals or comments
      if (line.trim().startsWith('//') || 
          line.trim().startsWith('/*') || 
          line.trim().startsWith('*')) {
        continue;
      }
      
      // Match opening tags (skipping self-closing tags)
      const openTagMatches = line.matchAll(/<(\w+)([^>]*[^/])>/g);
      for (const match of openTagMatches) {
        const tag = match[1];
        // Skip self-closing tags like <img> that don't need closing tags
        if (!['img', 'input', 'br', 'hr', 'meta', 'link'].includes(tag.toLowerCase())) {
          openingTags.push({ tag, line: i + 1 });
        }
      }
      
      // Match closing tags
      const closeTagMatches = line.matchAll(/<\/(\w+)>/g);
      for (const match of closeTagMatches) {
        const tag = match[1];
        
        // Check if it matches the last opening tag
        if (openingTags.length > 0 && openingTags[openingTags.length - 1].tag === tag) {
          openingTags.pop();
        } else if (openingTags.length > 0) {
          issues.push({
            line: i + 1,
            message: `Mismatched closing tag: </${tag}>, expected </${openingTags[openingTags.length - 1].tag}>`
          });
        } else {
          issues.push({
            line: i + 1,
            message: `Closing tag </${tag}> without matching opening tag`
          });
        }
      }
      
      // Check for invalid JSX expressions
      if (line.includes('{') && !line.includes('}')) {
        const nextLine = i + 1 < lines.length ? lines[i + 1] : '';
        if (!nextLine.includes('}')) {
          issues.push({
            line: i + 1,
            message: "Possible unclosed JSX expression: '{' without matching '}'"
          });
        }
      }
    }
    
    // Check for unclosed tags at the end of the file
    if (openingTags.length > 0) {
      for (const tag of openingTags) {
        issues.push({
          line: tag.line,
          message: `Unclosed tag: <${tag.tag}>`
        });
      }
    }
    
    // Report issues for this file
    if (issues.length > 0) {
      fileHasIssues = true;
      issuesFound += issues.length;
      
      // Print file header
      console.log(`\n${colors.blue}File: ${colors.yellow}${filePath}${colors.reset}`);
      
      // Sort issues by line number
      issues.sort((a, b) => a.line - b.line);
      
      // Print each issue
      for (const issue of issues) {
        console.log(`  ${colors.red}Line ${issue.line}:${colors.reset} ${issue.message}`);
        
        // Show context (the line with the issue)
        if (issue.line - 1 < lines.length) {
          const contextLine = lines[issue.line - 1];
          console.log(`    ${colors.magenta}${contextLine.trim()}${colors.reset}`);
        }
      }
    }
    
    return fileHasIssues;
  } catch (error) {
    console.error(`${colors.red}Error analyzing file ${filePath}:${colors.reset}`, error);
    return false;
  }
}

// Main function
async function main() {
  console.log(`${colors.green}Scanning for JSX syntax errors in: ${colors.yellow}${targetDir}${colors.reset}`);
  console.log(`${colors.blue}This may take a moment...${colors.reset}\n`);
  
  await scanDirectory(targetDir);
  
  if (issuesFound === 0) {
    console.log(`\n${colors.green}✓ No JSX syntax issues found!${colors.reset}`);
  } else {
    console.log(`\n${colors.red}Found ${issuesFound} potential JSX syntax issues.${colors.reset}`);
    console.log(`${colors.yellow}Review and fix these issues to prevent build failures.${colors.reset}`);
  }
}

// Run the script
main().catch(error => {
  console.error(`${colors.red}Fatal error:${colors.reset}`, error);
  process.exit(1);
});