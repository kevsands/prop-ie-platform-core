#!/usr/bin/env node

const { Project, ts, SyntaxKind } = require('ts-morph');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

class TypeScriptFixer {
  constructor() {
    this.project = new Project({
      tsConfigFilePath: path.join(process.cwd(), 'tsconfig.json'),
      skipAddingFilesFromTsConfig: true,
    });
    
    this.fixLog = [];
    this.errorLog = [];
    this.backupDir = path.join(process.cwd(), 'typescript-fix-backup-' + Date.now());
    this.fixLaterFile = path.join(process.cwd(), 'fix-later.log');
    
    this.stats = {
      filesProcessed: 0,
      totalFixes: 0,
      syntaxErrors: 0,
      missingImports: 0,
      typeErrors: 0,
      asyncErrors: 0,
      moduleErrors: 0,
      returnTypeErrors: 0,
      jsxErrors: 0,
      tsExpectErrors: 0,
    };
  }

  async run() {
    console.log(chalk.blue('🔧 TypeScript Error Fixer Starting...'));
    console.log(chalk.gray(`Backup directory: ${this.backupDir}`));
    
    // Create backup directory
    await fs.ensureDir(this.backupDir);
    
    // Get all TypeScript files
    const sourceFiles = this.project.addSourceFilesAtPaths('src/**/*.{ts,tsx}');
    const totalFiles = sourceFiles.length;
    
    console.log(chalk.yellow(`Found ${totalFiles} TypeScript files to process`));
    
    // Process each file
    for (let i = 0; i < sourceFiles.length; i++) {
      const sourceFile = sourceFiles[i];
      const filePath = sourceFile.getFilePath();
      const relativePath = path.relative(process.cwd(), filePath);
      
      console.log(chalk.gray(`[${i + 1}/${totalFiles}] Processing ${relativePath}...`));
      
      try {
        await this.processFile(sourceFile);
        this.stats.filesProcessed++;
      } catch (error) {
        console.error(chalk.red(`Error processing ${relativePath}:`, error.message));
        this.errorLog.push({ file: relativePath, error: error.message });
      }
    }
    
    // Save project
    console.log(chalk.blue('\n💾 Saving all changes...'));
    await this.project.save();
    
    // Generate reports
    await this.generateReports();
    
    console.log(chalk.green('\n✅ TypeScript Error Fixer Complete!'));
    this.printStats();
  }

  async processFile(sourceFile) {
    const filePath = sourceFile.getFilePath();
    const relativePath = path.relative(process.cwd(), filePath);
    
    // Backup original file
    const backupPath = path.join(this.backupDir, relativePath);
    await fs.ensureDir(path.dirname(backupPath));
    await fs.copy(filePath, backupPath);
    
    let hasChanges = false;
    
    // 1. Fix syntax errors (like "strin, g" → "string")
    if (this.fixSyntaxErrors(sourceFile)) {
      hasChanges = true;
    }
    
    // 2. Add missing React imports
    if (this.addMissingReactImports(sourceFile)) {
      hasChanges = true;
    }
    
    // 3. Add missing Next.js imports
    if (this.addMissingNextImports(sourceFile)) {
      hasChanges = true;
    }
    
    // 4. Fix untyped variables
    if (this.fixUntypedVariables(sourceFile)) {
      hasChanges = true;
    }
    
    // 5. Fix async/await issues
    if (this.fixAsyncAwaitIssues(sourceFile)) {
      hasChanges = true;
    }
    
    // 6. Fix module resolution errors
    if (this.fixModuleResolutionErrors(sourceFile)) {
      hasChanges = true;
    }
    
    // 7. Add return types to functions
    if (this.addReturnTypes(sourceFile)) {
      hasChanges = true;
    }
    
    // 8. Fix JSX element type errors
    if (this.fixJSXErrors(sourceFile)) {
      hasChanges = true;
    }
    
    // 9. Add @ts-expect-error for remaining issues
    if (this.addTsExpectErrors(sourceFile)) {
      hasChanges = true;
    }
    
    if (hasChanges) {
      this.fixLog.push({
        file: relativePath,
        fixes: this.stats.totalFixes,
      });
    }
  }

  fixSyntaxErrors(sourceFile) {
    let fixed = false;
    const text = sourceFile.getText();
    
    // Common syntax error patterns
    const patterns = [
      // Fix "strin, g" type errors
      { pattern: /:\s*strin,\s*g\b/g, replacement: ': string' },
      // Fix "numbe,r" type errors
      { pattern: /:\s*numbe,\s*r\b/g, replacement: ': number' },
      // Fix "boolea,n" type errors
      { pattern: /:\s*boolea,\s*n\b/g, replacement: ': boolean' },
      // Fix "objec,t" type errors
      { pattern: /:\s*objec,\s*t\b/g, replacement: ': object' },
      // Fix "arra,y" type errors
      { pattern: /:\s*arra,\s*y\b/g, replacement: ': array' },
      // Fix extra commas in type definitions
      { pattern: /:\s*(\w+),\s*,/g, replacement: ': $1,' },
      // Fix missing semicolons
      { pattern: /^(\s*(?:const|let|var)\s+\w+\s*=\s*[^;]+)$/gm, replacement: '$1;' },
    ];
    
    let newText = text;
    for (const { pattern, replacement } of patterns) {
      const matches = newText.match(pattern);
      if (matches) {
        newText = newText.replace(pattern, replacement);
        this.stats.syntaxErrors += matches.length;
        fixed = true;
      }
    }
    
    if (fixed) {
      sourceFile.replaceWithText(newText);
      this.stats.totalFixes++;
    }
    
    return fixed;
  }

  addMissingReactImports(sourceFile) {
    const isReactFile = sourceFile.getFilePath().endsWith('.tsx');
    if (!isReactFile) return false;
    
    const hasReactImport = sourceFile.getImportDeclaration(
      decl => decl.getModuleSpecifierValue() === 'react'
    );
    
    const usesJSX = sourceFile.getDescendantsOfKind(SyntaxKind.JsxElement).length > 0 ||
                    sourceFile.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement).length > 0 ||
                    sourceFile.getDescendantsOfKind(SyntaxKind.JsxFragment).length > 0;
    
    if (usesJSX && !hasReactImport) {
      sourceFile.insertStatements(0, "import React from 'react';");
      this.stats.missingImports++;
      this.stats.totalFixes++;
      return true;
    }
    
    return false;
  }

  addMissingNextImports(sourceFile) {
    let added = false;
    const text = sourceFile.getText();
    
    // Check for Next.js components usage without imports
    const nextComponents = [
      { name: 'Image', module: 'next/image' },
      { name: 'Link', module: 'next/link' },
      { name: 'useRouter', module: 'next/navigation' },
      { name: 'useSearchParams', module: 'next/navigation' },
      { name: 'useParams', module: 'next/navigation' },
      { name: 'usePathname', module: 'next/navigation' },
      { name: 'redirect', module: 'next/navigation' },
      { name: 'notFound', module: 'next/navigation' },
    ];
    
    for (const { name, module } of nextComponents) {
      const regex = new RegExp(`\\b${name}\\b`, 'g');
      if (regex.test(text)) {
        const hasImport = sourceFile.getImportDeclaration(
          decl => decl.getModuleSpecifierValue() === module &&
                  decl.getNamedImports().some(imp => imp.getName() === name)
        );
        
        if (!hasImport) {
          const existingImport = sourceFile.getImportDeclaration(
            decl => decl.getModuleSpecifierValue() === module
          );
          
          if (existingImport) {
            // Add to existing import
            existingImport.addNamedImport(name);
          } else {
            // Add new import
            sourceFile.insertStatements(0, `import { ${name} } from '${module}';`);
          }
          
          this.stats.missingImports++;
          this.stats.totalFixes++;
          added = true;
        }
      }
    }
    
    return added;
  }

  fixUntypedVariables(sourceFile) {
    let fixed = false;
    
    // Find all variable declarations
    const variableDeclarations = sourceFile.getDescendantsOfKind(SyntaxKind.VariableDeclaration);
    
    for (const varDecl of variableDeclarations) {
      if (!varDecl.getTypeNode() && varDecl.getInitializer()) {
        const initializer = varDecl.getInitializer();
        const inferredType = this.inferType(initializer);
        
        if (inferredType) {
          varDecl.setType(inferredType);
          this.stats.typeErrors++;
          this.stats.totalFixes++;
          fixed = true;
        }
      }
    }
    
    return fixed;
  }

  inferType(expression) {
    if (!expression) return null;
    
    const text = expression.getText();
    
    // Basic type inference
    if (text === 'true' || text === 'false') return 'boolean';
    if (text === 'null') return 'null';
    if (text === 'undefined') return 'undefined';
    if (/^['"`].*['"`]$/.test(text)) return 'string';
    if (/^\d+$/.test(text)) return 'number';
    if (/^\[.*\]$/.test(text)) return 'any[]';
    if (/^\{.*\}$/.test(text)) return 'Record<string, any>';
    
    // Function calls
    if (expression.getKind() === SyntaxKind.CallExpression) {
      const callExpr = expression.asKindOrThrow(SyntaxKind.CallExpression);
      const funcName = callExpr.getExpression().getText();
      
      // Common function return types
      if (funcName === 'useState') return 'any';
      if (funcName === 'useRef') return 'any';
      if (funcName === 'document.getElementById') return 'HTMLElement | null';
      if (funcName === 'document.querySelector') return 'Element | null';
    }
    
    return 'any';
  }

  fixAsyncAwaitIssues(sourceFile) {
    let fixed = false;
    
    // Find all function declarations
    const functions = [
      ...sourceFile.getDescendantsOfKind(SyntaxKind.FunctionDeclaration),
      ...sourceFile.getDescendantsOfKind(SyntaxKind.FunctionExpression),
      ...sourceFile.getDescendantsOfKind(SyntaxKind.ArrowFunction),
    ];
    
    for (const func of functions) {
      const hasAwait = func.getDescendantsOfKind(SyntaxKind.AwaitExpression).length > 0;
      const isAsync = func.hasModifier(SyntaxKind.AsyncKeyword);
      
      if (hasAwait && !isAsync) {
        func.setIsAsync(true);
        this.stats.asyncErrors++;
        this.stats.totalFixes++;
        fixed = true;
      }
    }
    
    return fixed;
  }

  fixModuleResolutionErrors(sourceFile) {
    let fixed = false;
    const imports = sourceFile.getImportDeclarations();
    
    for (const importDecl of imports) {
      const moduleSpecifier = importDecl.getModuleSpecifierValue();
      
      // Fix common module resolution issues
      if (moduleSpecifier.startsWith('@/')) {
        // Already using path alias, skip
        continue;
      }
      
      // Convert relative imports to path aliases where applicable
      if (moduleSpecifier.startsWith('../') || moduleSpecifier.startsWith('./')) {
        const absolutePath = this.resolveImportPath(sourceFile.getFilePath(), moduleSpecifier);
        const srcPath = path.join(process.cwd(), 'src');
        
        if (absolutePath.startsWith(srcPath)) {
          const relativePath = path.relative(srcPath, absolutePath);
          const aliasPath = '@/' + relativePath.replace(/\\/g, '/').replace(/\.(ts|tsx|js|jsx)$/, '');
          
          importDecl.setModuleSpecifier(aliasPath);
          this.stats.moduleErrors++;
          this.stats.totalFixes++;
          fixed = true;
        }
      }
    }
    
    return fixed;
  }

  resolveImportPath(fromFile, importPath) {
    const dir = path.dirname(fromFile);
    return path.resolve(dir, importPath);
  }

  addReturnTypes(sourceFile) {
    let fixed = false;
    
    const functions = [
      ...sourceFile.getDescendantsOfKind(SyntaxKind.FunctionDeclaration),
      ...sourceFile.getDescendantsOfKind(SyntaxKind.MethodDeclaration),
      ...sourceFile.getDescendantsOfKind(SyntaxKind.ArrowFunction),
    ];
    
    for (const func of functions) {
      if (!func.getReturnTypeNode()) {
        const returnType = this.inferReturnType(func);
        
        if (returnType) {
          func.setReturnType(returnType);
          this.stats.returnTypeErrors++;
          this.stats.totalFixes++;
          fixed = true;
        }
      }
    }
    
    return fixed;
  }

  inferReturnType(func) {
    const returnStatements = func.getDescendantsOfKind(SyntaxKind.ReturnStatement);
    
    if (returnStatements.length === 0) {
      return 'void';
    }
    
    // Check if it's a React component
    const hasJSX = func.getDescendantsOfKind(SyntaxKind.JsxElement).length > 0 ||
                   func.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement).length > 0 ||
                   func.getDescendantsOfKind(SyntaxKind.JsxFragment).length > 0;
    
    if (hasJSX) {
      return 'React.ReactElement';
    }
    
    // Check for async functions
    if (func.hasModifier && func.hasModifier(SyntaxKind.AsyncKeyword)) {
      return 'Promise<any>';
    }
    
    return 'any';
  }

  fixJSXErrors(sourceFile) {
    let fixed = false;
    
    // Fix common JSX issues
    const jsxElements = [
      ...sourceFile.getDescendantsOfKind(SyntaxKind.JsxElement),
      ...sourceFile.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement),
    ];
    
    for (const element of jsxElements) {
      // Fix className vs class
      const attributes = element.getDescendantsOfKind(SyntaxKind.JsxAttribute);
      
      for (const attr of attributes) {
        if (attr.getName() === 'class') {
          attr.setName('className');
          this.stats.jsxErrors++;
          this.stats.totalFixes++;
          fixed = true;
        }
      }
    }
    
    return fixed;
  }

  addTsExpectErrors(sourceFile) {
    let fixed = false;
    
    // Get diagnostics for the file
    const diagnostics = sourceFile.getPreEmitDiagnostics();
    
    // Group diagnostics by line
    const diagnosticsByLine = new Map();
    
    for (const diagnostic of diagnostics) {
      const start = diagnostic.getStart();
      if (start) {
        const line = sourceFile.getLineAndColumnAtPos(start).line;
        
        if (!diagnosticsByLine.has(line)) {
          diagnosticsByLine.set(line, []);
        }
        
        diagnosticsByLine.get(line).push(diagnostic);
      }
    }
    
    // Add @ts-expect-error comments
    const linesToAdd = Array.from(diagnosticsByLine.entries()).sort((a, b) => b[0] - a[0]);
    
    for (const [line, diagnostics] of linesToAdd) {
      const errorMessages = diagnostics.map(d => d.getMessageText()).join('; ');
      const comment = `// @ts-expect-error TODO: Fix - ${errorMessages}`;
      
      // Insert comment before the line with the error
      const fullText = sourceFile.getFullText();
      const lines = fullText.split('\n');
      
      if (line > 0 && line <= lines.length) {
        const lineIndex = line - 1;
        const indentation = lines[lineIndex].match(/^\s*/)[0];
        lines.splice(lineIndex, 0, indentation + comment);
        
        sourceFile.replaceWithText(lines.join('\n'));
        
        this.stats.tsExpectErrors++;
        this.stats.totalFixes++;
        fixed = true;
        
        // Log to fix-later file
        this.errorLog.push({
          file: path.relative(process.cwd(), sourceFile.getFilePath()),
          line: line,
          error: errorMessages,
        });
      }
    }
    
    return fixed;
  }

  async generateReports() {
    // Write fix-later.log
    const fixLaterContent = this.errorLog
      .map(entry => `${entry.file}:${entry.line || 'unknown'} - ${entry.error}`)
      .join('\n');
    
    await fs.writeFile(this.fixLaterFile, fixLaterContent);
    
    // Generate detailed report
    const reportPath = path.join(process.cwd(), 'typescript-fix-report.json');
    const report = {
      timestamp: new Date().toISOString(),
      stats: this.stats,
      fixLog: this.fixLog,
      errorLog: this.errorLog,
      backupDirectory: this.backupDir,
    };
    
    await fs.writeJson(reportPath, report, { spaces: 2 });
    
    console.log(chalk.blue(`\n📄 Reports generated:`));
    console.log(chalk.gray(`  - ${this.fixLaterFile}`));
    console.log(chalk.gray(`  - ${reportPath}`));
  }

  printStats() {
    console.log(chalk.blue('\n📊 Statistics:'));
    console.log(chalk.gray(`  Files processed: ${this.stats.filesProcessed}`));
    console.log(chalk.gray(`  Total fixes applied: ${this.stats.totalFixes}`));
    console.log(chalk.gray(`  - Syntax errors fixed: ${this.stats.syntaxErrors}`));
    console.log(chalk.gray(`  - Missing imports added: ${this.stats.missingImports}`));
    console.log(chalk.gray(`  - Type annotations added: ${this.stats.typeErrors}`));
    console.log(chalk.gray(`  - Async/await fixed: ${this.stats.asyncErrors}`));
    console.log(chalk.gray(`  - Module errors fixed: ${this.stats.moduleErrors}`));
    console.log(chalk.gray(`  - Return types added: ${this.stats.returnTypeErrors}`));
    console.log(chalk.gray(`  - JSX errors fixed: ${this.stats.jsxErrors}`));
    console.log(chalk.gray(`  - @ts-expect-error added: ${this.stats.tsExpectErrors}`));
  }
}

// Check if required dependencies are installed
async function checkDependencies() {
  const requiredPackages = ['ts-morph', 'fs-extra', 'chalk'];
  const missingPackages = [];
  
  for (const pkg of requiredPackages) {
    try {
      require.resolve(pkg);
    } catch {
      missingPackages.push(pkg);
    }
  }
  
  if (missingPackages.length > 0) {
    console.log(chalk.yellow('📦 Installing required dependencies...'));
    const { execSync } = require('child_process');
    execSync(`npm install --save-dev ${missingPackages.join(' ')}`, { stdio: 'inherit' });
  }
}

// Main execution
async function main() {
  try {
    await checkDependencies();
    
    const fixer = new TypeScriptFixer();
    await fixer.run();
  } catch (error) {
    console.error(chalk.red('❌ Fatal error:'), error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = TypeScriptFixer;