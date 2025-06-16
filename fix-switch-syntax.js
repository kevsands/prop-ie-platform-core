#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Fix switch statement syntax errors
 * Fixes broken switch statements where returns are on separate lines
 */

class SwitchSyntaxFixer {
  constructor() {
    this.fixedFiles = [];
    this.errorFiles = [];
    this.totalReplacements = 0;
    this.srcDir = path.join(__dirname, 'src');
  }

  log(message) {
    console.log(`[${new Date().toISOString()}] ${message}`);
  }

  error(message) {
    console.error(`[${new Date().toISOString()}] ERROR: ${message}`);
  }

  // Get all TypeScript/JavaScript files
  getAllSourceFiles() {
    this.log('Finding source files...');
    
    try {
      const result = execSync(
        `find "${this.srcDir}" -type f \\( -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js" \\)`,
        { encoding: 'utf8' }
      );
      
      const files = result.trim().split('\n').filter(Boolean);
      this.log(`Found ${files.length} source files`);
      return files;
    } catch (error) {
      this.error('Failed to find source files: ' + error.message);
      return [];
    }
  }

  // Fix switch statement syntax issues
  fixSwitchSyntax(content) {
    let fixedContent = content;
    let replacements = 0;

    // Pattern 1: Fix broken return statements in switch cases
    // Look for pattern: return <jsx>
    //                    );
    const pattern1 = /return\s+(<[^>]*>[^<]*<\/[^>]*>)\s*\n\s*\);/g;
    const matches1 = content.match(pattern1);
    if (matches1) {
      fixedContent = fixedContent.replace(pattern1, 'return $1;');
      replacements += matches1.length;
      this.log(`Fixed ${matches1.length} broken return statements`);
    }

    // Pattern 2: Fix broken JSX self-closing tags
    // Look for pattern: return <Component />
    //                    );
    const pattern2 = /return\s+(<[^>]*\/?>)\s*\n\s*\);/g;
    const matches2 = fixedContent.match(pattern2);
    if (matches2) {
      fixedContent = fixedContent.replace(pattern2, 'return $1;');
      replacements += matches2.length;
      this.log(`Fixed ${matches2.length} broken JSX self-closing returns`);
    }

    // Pattern 3: Fix broken object literal returns
    // Look for pattern: return { ... }
    //                    );
    const pattern3 = /return\s+(\{[^}]*\})\s*\n\s*\);/g;
    const matches3 = fixedContent.match(pattern3);
    if (matches3) {
      fixedContent = fixedContent.replace(pattern3, 'return $1;');
      replacements += matches3.length;
      this.log(`Fixed ${matches3.length} broken object returns`);
    }

    // Pattern 4: Fix broken array returns
    // Look for pattern: return [...]
    //                    );
    const pattern4 = /return\s+(\[[^\]]*\])\s*\n\s*\);/g;
    const matches4 = fixedContent.match(pattern4);
    if (matches4) {
      fixedContent = fixedContent.replace(pattern4, 'return $1;');
      replacements += matches4.length;
      this.log(`Fixed ${matches4.length} broken array returns`);
    }

    // Pattern 5: Fix broken function calls
    // Look for pattern: return functionCall()
    //                    );
    const pattern5 = /return\s+([a-zA-Z][a-zA-Z0-9_]*\([^)]*\))\s*\n\s*\);/g;
    const matches5 = fixedContent.match(pattern5);
    if (matches5) {
      fixedContent = fixedContent.replace(pattern5, 'return $1;');
      replacements += matches5.length;
      this.log(`Fixed ${matches5.length} broken function call returns`);
    }

    return { fixedContent, replacements };
  }

  // Create backup of file before fixing
  createBackup(filePath) {
    const backupPath = `${filePath}.backup-switch-fix-${Date.now()}`;
    try {
      fs.copyFileSync(filePath, backupPath);
      return backupPath;
    } catch (error) {
      this.error(`Failed to create backup for ${filePath}: ${error.message}`);
      return null;
    }
  }

  // Fix a single file
  fixFile(filePath) {
    try {
      this.log(`Fixing: ${filePath}`);
      
      // Read original content
      const originalContent = fs.readFileSync(filePath, 'utf8');
      
      // Fix switch syntax
      const { fixedContent, replacements } = this.fixSwitchSyntax(originalContent);
      
      if (replacements === 0) {
        this.log(`No syntax issues found in ${filePath}`);
        return true;
      }

      // Create backup
      const backupPath = this.createBackup(filePath);
      if (!backupPath) {
        this.errorFiles.push({ path: filePath, error: 'Backup creation failed' });
        return false;
      }

      // Write fixed content
      fs.writeFileSync(filePath, fixedContent, 'utf8');
      
      this.fixedFiles.push({
        path: filePath,
        replacements: replacements,
        backup: backupPath
      });
      
      this.totalReplacements += replacements;
      this.log(`Fixed ${replacements} syntax issues in ${filePath}`);
      
      return true;
    } catch (error) {
      this.error(`Failed to fix ${filePath}: ${error.message}`);
      this.errorFiles.push({ path: filePath, error: error.message });
      return false;
    }
  }

  // Validate TypeScript compilation after fixes
  validateTypeScript() {
    this.log('Validating TypeScript compilation...');
    
    try {
      execSync('npx tsc --noEmit --skipLibCheck', { 
        cwd: __dirname, 
        stdio: 'pipe' 
      });
      this.log('TypeScript validation passed');
      return true;
    } catch (error) {
      this.error('TypeScript validation failed - but some errors may remain');
      // Show first 50 lines of errors
      const errorOutput = error.stdout?.toString() || error.stderr?.toString() || error.message;
      const lines = errorOutput.split('\n').slice(0, 50);
      console.error(lines.join('\n'));
      return false;
    }
  }

  // Generate report
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      totalFiles: this.fixedFiles.length,
      totalReplacements: this.totalReplacements,
      errorFiles: this.errorFiles.length,
      fixedFiles: this.fixedFiles,
      errors: this.errorFiles
    };

    const reportPath = path.join(__dirname, `switch-fix-report-${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    this.log('='.repeat(60));
    this.log('SWITCH SYNTAX FIX REPORT');
    this.log('='.repeat(60));
    this.log(`Total files processed: ${this.fixedFiles.length}`);
    this.log(`Total replacements made: ${this.totalReplacements}`);
    this.log(`Files with errors: ${this.errorFiles.length}`);
    this.log(`Report saved to: ${reportPath}`);
    
    if (this.errorFiles.length > 0) {
      this.log('\nFiles with errors:');
      this.errorFiles.forEach(({ path, error }) => {
        this.log(`  - ${path}: ${error}`);
      });
    }
    
    return reportPath;
  }

  // Main execution method
  async run() {
    this.log('Starting switch syntax fix...');
    this.log(`Working directory: ${__dirname}`);
    this.log(`Source directory: ${this.srcDir}`);
    
    // Get all source files
    const sourceFiles = this.getAllSourceFiles();
    
    if (sourceFiles.length === 0) {
      this.log('No source files found.');
      return;
    }

    // Fix each file
    for (const filePath of sourceFiles) {
      this.fixFile(filePath);
    }

    // Validate TypeScript compilation
    const tsValid = this.validateTypeScript();
    
    // Generate report
    const reportPath = this.generateReport();
    
    this.log('Switch syntax fix completed!');
    
    if (!tsValid) {
      this.log('\nNote: Some TypeScript errors may still remain. Check the output above.');
    }
  }
}

// Run the fixer
if (require.main === module) {
  const fixer = new SwitchSyntaxFixer();
  fixer.run().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = SwitchSyntaxFixer;