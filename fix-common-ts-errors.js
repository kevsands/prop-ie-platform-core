#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

class SimpleTypeScriptFixer {
  constructor() {
    this.fixCount = 0;
    this.fileCount = 0;
    this.backupDir = `ts-fix-backup-${Date.now()}`;
  }

  async run() {
    console.log('🔧 Starting Simple TypeScript Error Fixer...\n');
    
    // Create backup directory
    fs.mkdirSync(this.backupDir, { recursive: true });
    
    // Process src directory
    await this.processDirectory(path.join(process.cwd(), 'src'));
    
    console.log(`\n✅ Fixed ${this.fixCount} issues in ${this.fileCount} files`);
    console.log(`📁 Backups saved in ${this.backupDir}/`);
  }

  async processDirectory(dir) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.')) {
        await this.processDirectory(fullPath);
      } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
        await this.processFile(fullPath);
      }
    }
  }

  async processFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      let newContent = content;
      let fileFixCount = 0;
      
      // Fix common syntax errors
      const fixes = [
        // Fix "strin, g" type errors
        { pattern: /:\s*strin,\s*g\b/g, replacement: ': string' },
        { pattern: /:\s*numbe,\s*r\b/g, replacement: ': number' },
        { pattern: /:\s*boolea,\s*n\b/g, replacement: ': boolean' },
        { pattern: /:\s*objec,\s*t\b/g, replacement: ': object' },
        
        // Fix common syntax issues
        { pattern: /\(!hasLevel:\s*any\)/g, replacement: '(!hasLevel)' },
        { pattern: /setDraggedTask\(task:\s*any\)/g, replacement: 'setDraggedTask(task)' },
        { pattern: /\(prev:\s*any\)\s*=>\s*\(\{/g, replacement: '(prev) => ({' },
        { pattern: /\.\.\.prev:\s*any,/g, replacement: '...prev,' },
        
        // Fix missing React imports in tsx files
        ...(filePath.endsWith('.tsx') ? [
          { 
            pattern: /^((?!import\s+React).)*$/s,
            replacement: (match) => {
              if (match.includes('<') && match.includes('>')) {
                return `import React from 'react';\n${match}`;
              }
              return match;
            }
          }
        ] : []),
        
        // Add 'any' type to untyped parameters
        { pattern: /\(([a-zA-Z_$][a-zA-Z0-9_$]*)\)\s*=>/g, replacement: '($1: any) =>' },
        { pattern: /function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(([a-zA-Z_$][a-zA-Z0-9_$]*)\)/g, 
          replacement: 'function $1($2: any)' },
        
        // Fix async function issues
        { pattern: /(?<!async\s+)function\s+(\w+)[^{]*{[^}]*await\s+/g, 
          replacement: 'async function $1' },
        
        // Fix common import issues
        { pattern: /from\s+['"]@\/types\/three-extensions['"]/g, 
          replacement: 'from \'three\'' },
      ];
      
      for (const fix of fixes) {
        const before = newContent;
        if (typeof fix.replacement === 'string') {
          newContent = newContent.replace(fix.pattern, fix.replacement);
        } else {
          newContent = newContent.replace(fix.pattern, fix.replacement);
        }
        
        if (before !== newContent) {
          fileFixCount++;
        }
      }
      
      // Only write if changes were made
      if (fileFixCount > 0) {
        // Backup original
        const backupPath = path.join(this.backupDir, path.relative(process.cwd(), filePath));
        fs.mkdirSync(path.dirname(backupPath), { recursive: true });
        fs.copyFileSync(filePath, backupPath);
        
        // Write fixed content
        fs.writeFileSync(filePath, newContent);
        
        this.fixCount += fileFixCount;
        this.fileCount++;
        console.log(`✓ Fixed ${fileFixCount} issues in ${path.relative(process.cwd(), filePath)}`);
      }
    } catch (error) {
      console.error(`✗ Error processing ${filePath}:`, error.message);
    }
  }
}

// Run the fixer
const fixer = new SimpleTypeScriptFixer();
fixer.run().catch(console.error);