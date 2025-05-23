#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const config = {
  pagesDir: './pages',
  appDir: './app',
  srcDir: './src',
  backupDir: './migration-backup',
  logFile: './migration.log',
  dryRun: process.argv.includes('--dry-run'),
  force: process.argv.includes('--force'),
  verbose: process.argv.includes('--verbose')
};

// Migration state
const migrationState = {
  movedFiles: [],
  updatedFiles: [],
  createdFiles: [],
  errors: [],
  warnings: [],
  startTime: new Date()
};

// Logging utility
class Logger {
  static log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    
    console.log(logMessage);
    
    // Also write to log file
    fs.appendFile(config.logFile, logMessage + '\n').catch(console.error);
  }

  static error(message) {
    this.log(message, 'error');
    migrationState.errors.push(message);
  }

  static warn(message) {
    this.log(message, 'warn');
    migrationState.warnings.push(message);
  }

  static verbose(message) {
    if (config.verbose) {
      this.log(message, 'verbose');
    }
  }
}

// File system utilities
class FileUtils {
  static async exists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  static async ensureDir(dirPath) {
    try {
      await fs.mkdir(dirPath, { recursive: true });
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
    }
  }

  static async readFile(filePath) {
    try {
      return await fs.readFile(filePath, 'utf8');
    } catch (error) {
      Logger.error(`Failed to read file ${filePath}: ${error.message}`);
      throw error;
    }
  }

  static async writeFile(filePath, content) {
    try {
      await this.ensureDir(path.dirname(filePath));
      await fs.writeFile(filePath, content);
      Logger.verbose(`Written file: ${filePath}`);
    } catch (error) {
      Logger.error(`Failed to write file ${filePath}: ${error.message}`);
      throw error;
    }
  }

  static async copyFile(src, dest) {
    try {
      await this.ensureDir(path.dirname(dest));
      await fs.copyFile(src, dest);
      Logger.verbose(`Copied ${src} to ${dest}`);
    } catch (error) {
      Logger.error(`Failed to copy ${src} to ${dest}: ${error.message}`);
      throw error;
    }
  }

  static async moveFile(src, dest) {
    try {
      await this.copyFile(src, dest);
      await fs.unlink(src);
      migrationState.movedFiles.push({ src, dest });
      Logger.verbose(`Moved ${src} to ${dest}`);
    } catch (error) {
      Logger.error(`Failed to move ${src} to ${dest}: ${error.message}`);
      throw error;
    }
  }

  static async getAllFiles(dir, fileList = []) {
    try {
      const files = await fs.readdir(dir);
      
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = await fs.stat(filePath);
        
        if (stat.isDirectory()) {
          await this.getAllFiles(filePath, fileList);
        } else {
          fileList.push(filePath);
        }
      }
      
      return fileList;
    } catch (error) {
      Logger.error(`Failed to read directory ${dir}: ${error.message}`);
      return fileList;
    }
  }
}

// Backup manager
class BackupManager {
  static async createBackup() {
    Logger.log('Creating backup...');
    
    try {
      await FileUtils.ensureDir(config.backupDir);
      
      // Backup pages directory if it exists
      if (await FileUtils.exists(config.pagesDir)) {
        const backupPagesDir = path.join(config.backupDir, 'pages');
        await this.copyDirectory(config.pagesDir, backupPagesDir);
      }
      
      // Backup app directory if it exists
      if (await FileUtils.exists(config.appDir)) {
        const backupAppDir = path.join(config.backupDir, 'app');
        await this.copyDirectory(config.appDir, backupAppDir);
      }
      
      // Backup src directory if it exists
      if (await FileUtils.exists(config.srcDir)) {
        const srcPagesDir = path.join(config.srcDir, 'pages');
        const srcAppDir = path.join(config.srcDir, 'app');
        
        if (await FileUtils.exists(srcPagesDir)) {
          const backupSrcPagesDir = path.join(config.backupDir, 'src', 'pages');
          await this.copyDirectory(srcPagesDir, backupSrcPagesDir);
        }
        
        if (await FileUtils.exists(srcAppDir)) {
          const backupSrcAppDir = path.join(config.backupDir, 'src', 'app');
          await this.copyDirectory(srcAppDir, backupSrcAppDir);
        }
      }
      
      // Save migration state
      await FileUtils.writeFile(
        path.join(config.backupDir, 'migration-state.json'),
        JSON.stringify(migrationState, null, 2)
      );
      
      Logger.log('Backup created successfully');
    } catch (error) {
      Logger.error(`Failed to create backup: ${error.message}`);
      throw error;
    }
  }

  static async copyDirectory(src, dest) {
    await FileUtils.ensureDir(dest);
    const entries = await fs.readdir(src, { withFileTypes: true });
    
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      
      if (entry.isDirectory()) {
        await this.copyDirectory(srcPath, destPath);
      } else {
        await FileUtils.copyFile(srcPath, destPath);
      }
    }
  }

  static async rollback() {
    Logger.log('Rolling back migration...');
    
    try {
      if (!await FileUtils.exists(config.backupDir)) {
        Logger.error('No backup found. Cannot rollback.');
        return false;
      }
      
      // Remove current directories
      if (await FileUtils.exists(config.appDir)) {
        await fs.rm(config.appDir, { recursive: true, force: true });
      }
      
      // Restore from backup
      const backupPagesDir = path.join(config.backupDir, 'pages');
      const backupAppDir = path.join(config.backupDir, 'app');
      
      if (await FileUtils.exists(backupPagesDir)) {
        await this.copyDirectory(backupPagesDir, config.pagesDir);
      }
      
      if (await FileUtils.exists(backupAppDir)) {
        await this.copyDirectory(backupAppDir, config.appDir);
      }
      
      // Handle src directory
      const backupSrcDir = path.join(config.backupDir, 'src');
      if (await FileUtils.exists(backupSrcDir)) {
        const backupSrcPagesDir = path.join(backupSrcDir, 'pages');
        const backupSrcAppDir = path.join(backupSrcDir, 'app');
        
        if (await FileUtils.exists(backupSrcPagesDir)) {
          await this.copyDirectory(backupSrcPagesDir, path.join(config.srcDir, 'pages'));
        }
        
        if (await FileUtils.exists(backupSrcAppDir)) {
          await this.copyDirectory(backupSrcAppDir, path.join(config.srcDir, 'app'));
        }
      }
      
      Logger.log('Rollback completed successfully');
      return true;
    } catch (error) {
      Logger.error(`Failed to rollback: ${error.message}`);
      return false;
    }
  }
}

// Code transformer
class CodeTransformer {
  static async transformPageToAppRoute(content, filePath) {
    let transformed = content;
    
    // Update imports
    transformed = this.updateImports(transformed);
    
    // Transform getServerSideProps to server component
    transformed = this.transformGetServerSideProps(transformed);
    
    // Transform getStaticProps to server component
    transformed = this.transformGetStaticProps(transformed);
    
    // Update router usage
    transformed = this.updateRouterUsage(transformed);
    
    // Update Link components
    transformed = this.updateLinkComponents(transformed);
    
    // Add 'use client' directive if needed
    if (this.needsClientDirective(transformed)) {
      transformed = `'use client';\n\n${transformed}`;
    }
    
    return transformed;
  }

  static updateImports(content) {
    // Update next/router to next/navigation
    content = content.replace(/from ['"]next\/router['"]/g, 'from "next/navigation"');
    content = content.replace(/import Router from ['"]next\/router['"]/g, 'import { useRouter } from "next/navigation"');
    
    // Update useRouter hook usage
    content = content.replace(/const router = useRouter\(\)/g, 'const router = useRouter()');
    
    // Update next/link if needed
    content = content.replace(/import Link from ['"]next\/link['"]/g, 'import Link from "next/link"');
    
    return content;
  }

  static transformGetServerSideProps(content) {
    const getServerSidePropsRegex = /export\s+(?:const|async\s+function)\s+getServerSideProps[^{]*{[\s\S]*?^}/gm;
    
    if (getServerSidePropsRegex.test(content)) {
      Logger.warn('Found getServerSideProps - manual review needed for server component conversion');
      content = content.replace(getServerSidePropsRegex, (match) => {
        return `// TODO: Convert to server component data fetching\n// ${match.replace(/\n/g, '\n// ')}`;
      });
    }
    
    return content;
  }

  static transformGetStaticProps(content) {
    const getStaticPropsRegex = /export\s+(?:const|async\s+function)\s+getStaticProps[^{]*{[\s\S]*?^}/gm;
    
    if (getStaticPropsRegex.test(content)) {
      Logger.warn('Found getStaticProps - manual review needed for server component conversion');
      content = content.replace(getStaticPropsRegex, (match) => {
        return `// TODO: Convert to server component data fetching\n// ${match.replace(/\n/g, '\n// ')}`;
      });
    }
    
    return content;
  }

  static updateRouterUsage(content) {
    // Update router.push to router.push
    content = content.replace(/router\.push\(/g, 'router.push(');
    
    // Update router.replace to router.replace
    content = content.replace(/router\.replace\(/g, 'router.replace(');
    
    // Update router.query to use useSearchParams
    if (content.includes('router.query')) {
      content = `import { useSearchParams } from 'next/navigation';\n${content}`;
      content = content.replace(/router\.query/g, 'Object.fromEntries(searchParams.entries())');
      Logger.warn('Updated router.query usage - manual review recommended');
    }
    
    return content;
  }

  static updateLinkComponents(content) {
    // Update Link components with legacyBehavior
    const linkRegex = /<Link([^>]*?)>(\s*<a[^>]*>[\s\S]*?<\/a>\s*)<\/Link>/g;
    
    content = content.replace(linkRegex, (match, linkProps, anchorContent) => {
      // Extract href from Link props
      const hrefMatch = linkProps.match(/href=["'{]([^"'}]+)["'}]/);
      if (hrefMatch) {
        // Remove the wrapping anchor tag
        const innerContent = anchorContent.replace(/<a[^>]*>([\s\S]*?)<\/a>/, '$1');
        return `<Link${linkProps}>${innerContent}</Link>`;
      }
      return match;
    });
    
    return content;
  }

  static needsClientDirective(content) {
    const clientFeatures = [
      'useState',
      'useEffect',
      'useReducer',
      'useContext',
      'useCallback',
      'useMemo',
      'useRef',
      'useLayoutEffect',
      'onClick',
      'onChange',
      'onSubmit',
      'addEventListener'
    ];
    
    return clientFeatures.some(feature => content.includes(feature));
  }

  static async transformApiRoute(content, filePath) {
    let transformed = content;
    
    // Check if it's already using app router API format
    if (content.includes('export async function GET') || 
        content.includes('export async function POST') ||
        content.includes('export function GET') ||
        content.includes('export function POST')) {
      return content;
    }
    
    // Transform pages API route to app router format
    const hasDefaultExport = /export\s+default\s+(?:async\s+)?function/g.test(content);
    
    if (hasDefaultExport) {
      transformed = this.convertApiHandlerToAppRouter(content);
    }
    
    return transformed;
  }

  static convertApiHandlerToAppRouter(content) {
    let transformed = content;
    
    // Extract the handler function
    const handlerRegex = /export\s+default\s+(?:async\s+)?function\s*(?:handler)?\s*\([^)]*\)\s*{([\s\S]*)}/;
    const match = content.match(handlerRegex);
    
    if (match) {
      const handlerBody = match[1];
      
      // Create new app router format
      const methods = [];
      
      // Check for method handling
      if (handlerBody.includes('req.method')) {
        const methodChecks = handlerBody.match(/req\.method\s*===?\s*['"](\w+)['"]/g) || [];
        methodChecks.forEach(check => {
          const method = check.match(/['"](\w+)['"]/)[1];
          methods.push(method);
        });
      } else {
        // Default to GET and POST if no specific method handling
        methods.push('GET', 'POST');
      }
      
      // Generate new format
      let newContent = transformed.replace(handlerRegex, '');
      
      // Add imports
      newContent = `import { NextRequest, NextResponse } from 'next/server';\n\n${newContent}`;
      
      // Add method handlers
      methods.forEach(method => {
        newContent += `\nexport async function ${method}(request: NextRequest) {
  try {
    // TODO: Migrate handler logic here
    ${method === 'GET' ? '' : 'const body = await request.json();'}
    
    return NextResponse.json({ message: 'TODO: Implement ${method} handler' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}\n`;
      });
      
      Logger.warn(`API route converted - manual review needed for ${methods.join(', ')} handlers`);
      
      return newContent;
    }
    
    return transformed;
  }

  static async createLayout(dirPath, existingLayoutPath = null) {
    const layoutContent = `import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Property Platform',
  description: 'Enterprise property platform',
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
`;

    const layoutPath = path.join(dirPath, 'layout.tsx');
    
    if (existingLayoutPath && await FileUtils.exists(existingLayoutPath)) {
      // Copy existing layout
      const existingContent = await FileUtils.readFile(existingLayoutPath);
      await FileUtils.writeFile(layoutPath, existingContent);
    } else if (!await FileUtils.exists(layoutPath)) {
      // Create new layout
      await FileUtils.writeFile(layoutPath, layoutContent);
      migrationState.createdFiles.push(layoutPath);
    }
  }

  static async mergeAppAndDocument(appContent, documentContent) {
    // This is a simplified merge - in production, you'd want more sophisticated parsing
    let mergedContent = appContent;
    
    // Extract custom meta tags, scripts, etc. from _document
    const headContentRegex = /<Head>([\s\S]*?)<\/Head>/;
    const headMatch = documentContent.match(headContentRegex);
    
    if (headMatch) {
      Logger.warn('Found custom Head content in _document.tsx - manual review needed');
      mergedContent = `// TODO: Merge the following Head content into metadata:\n/*\n${headMatch[1]}\n*/\n\n${mergedContent}`;
    }
    
    return mergedContent;
  }
}

// Migration analyzer
class MigrationAnalyzer {
  static async analyze() {
    Logger.log('Analyzing project structure...');
    
    const analysis = {
      hasPagesDir: false,
      hasAppDir: false,
      pagesCount: 0,
      appRoutesCount: 0,
      apiRoutesCount: 0,
      pagesFiles: [],
      appFiles: [],
      recommendation: ''
    };
    
    // Check root level
    if (await FileUtils.exists(config.pagesDir)) {
      analysis.hasPagesDir = true;
      analysis.pagesFiles = await FileUtils.getAllFiles(config.pagesDir);
      analysis.pagesCount = analysis.pagesFiles.filter(f => !f.includes('/api/')).length;
      analysis.apiRoutesCount = analysis.pagesFiles.filter(f => f.includes('/api/')).length;
    }
    
    if (await FileUtils.exists(config.appDir)) {
      analysis.hasAppDir = true;
      analysis.appFiles = await FileUtils.getAllFiles(config.appDir);
      analysis.appRoutesCount = analysis.appFiles.filter(f => f.endsWith('page.tsx') || f.endsWith('page.jsx')).length;
    }
    
    // Check src level
    const srcPagesDir = path.join(config.srcDir, 'pages');
    const srcAppDir = path.join(config.srcDir, 'app');
    
    if (await FileUtils.exists(srcPagesDir)) {
      analysis.hasPagesDir = true;
      const srcPagesFiles = await FileUtils.getAllFiles(srcPagesDir);
      analysis.pagesFiles = [...analysis.pagesFiles, ...srcPagesFiles];
      analysis.pagesCount += srcPagesFiles.filter(f => !f.includes('/api/')).length;
      analysis.apiRoutesCount += srcPagesFiles.filter(f => f.includes('/api/')).length;
    }
    
    if (await FileUtils.exists(srcAppDir)) {
      analysis.hasAppDir = true;
      const srcAppFiles = await FileUtils.getAllFiles(srcAppDir);
      analysis.appFiles = [...analysis.appFiles, ...srcAppFiles];
      analysis.appRoutesCount += srcAppFiles.filter(f => f.endsWith('page.tsx') || f.endsWith('page.jsx')).length;
    }
    
    // Make recommendation
    if (!analysis.hasPagesDir && analysis.hasAppDir) {
      analysis.recommendation = 'Already using App Router exclusively';
    } else if (analysis.hasPagesDir && !analysis.hasAppDir) {
      analysis.recommendation = 'Migrate all Pages Router to App Router';
    } else if (analysis.pagesCount > analysis.appRoutesCount) {
      analysis.recommendation = 'Migrate to App Router (more content in Pages)';
    } else {
      analysis.recommendation = 'Complete migration to App Router';
    }
    
    Logger.log(`Analysis complete:
    - Pages Router: ${analysis.pagesCount} pages, ${analysis.apiRoutesCount} API routes
    - App Router: ${analysis.appRoutesCount} routes
    - Recommendation: ${analysis.recommendation}`);
    
    return analysis;
  }
}

// Main migrator
class AppRouterMigrator {
  constructor() {
    this.analysis = null;
  }

  async run() {
    try {
      Logger.log('Starting Next.js App Router migration...');
      
      // Analyze current structure
      this.analysis = await MigrationAnalyzer.analyze();
      
      if (this.analysis.recommendation === 'Already using App Router exclusively') {
        Logger.log('Project is already using App Router exclusively. No migration needed.');
        return;
      }
      
      // Create backup
      if (!config.dryRun) {
        await BackupManager.createBackup();
      }
      
      // Perform migration
      await this.migratePagesToApp();
      
      // Update all imports and references
      await this.updateProjectReferences();
      
      // Clean up if not in dry run
      if (!config.dryRun && !config.force) {
        await this.cleanup();
      }
      
      // Generate report
      await this.generateReport();
      
      Logger.log('Migration completed successfully!');
      
    } catch (error) {
      Logger.error(`Migration failed: ${error.message}`);
      
      if (!config.dryRun) {
        Logger.log('Attempting rollback...');
        await BackupManager.rollback();
      }
      
      process.exit(1);
    }
  }

  async migratePagesToApp() {
    Logger.log('Migrating pages to app router...');
    
    for (const pagePath of this.analysis.pagesFiles) {
      try {
        await this.migrateFile(pagePath);
      } catch (error) {
        Logger.error(`Failed to migrate ${pagePath}: ${error.message}`);
        if (!config.force) throw error;
      }
    }
  }

  async migrateFile(filePath) {
    const relativePath = filePath.replace(/^(\.\/)?src\//, '').replace(/^(\.\/)?/, '');
    const isInSrc = filePath.includes('/src/');
    
    // Skip non-JS/TS files
    if (!filePath.match(/\.(jsx?|tsx?)$/)) {
      return;
    }
    
    Logger.verbose(`Migrating ${filePath}...`);
    
    // Determine destination path
    let destPath;
    
    if (relativePath.startsWith('pages/api/')) {
      // API route
      destPath = this.getApiRoutePath(relativePath, isInSrc);
    } else if (relativePath.startsWith('pages/_app')) {
      // _app.tsx -> merge into root layout
      await this.mergeAppFile(filePath, isInSrc);
      return;
    } else if (relativePath.startsWith('pages/_document')) {
      // _document.tsx -> merge into root layout
      await this.mergeDocumentFile(filePath, isInSrc);
      return;
    } else if (relativePath.startsWith('pages/')) {
      // Regular page
      destPath = this.getPageRoutePath(relativePath, isInSrc);
    } else {
      return;
    }
    
    // Read and transform content
    const content = await FileUtils.readFile(filePath);
    let transformedContent;
    
    if (relativePath.includes('/api/')) {
      transformedContent = await CodeTransformer.transformApiRoute(content, filePath);
    } else {
      transformedContent = await CodeTransformer.transformPageToAppRoute(content, filePath);
    }
    
    // Write to destination
    if (config.dryRun) {
      Logger.log(`[DRY RUN] Would write to ${destPath}`);
    } else {
      await FileUtils.writeFile(destPath, transformedContent);
      migrationState.updatedFiles.push(destPath);
    }
  }

  getPageRoutePath(pagesPath, isInSrc) {
    // Remove pages/ prefix
    let routePath = pagesPath.replace(/^pages\//, '');
    
    // Handle index files
    if (routePath === 'index.tsx' || routePath === 'index.jsx') {
      routePath = 'page.tsx';
    } else if (routePath.endsWith('/index.tsx') || routePath.endsWith('/index.jsx')) {
      routePath = routePath.replace(/\/index\.(tsx|jsx)$/, '/page.tsx');
    } else {
      // Convert file.tsx to file/page.tsx
      routePath = routePath.replace(/\.(tsx|jsx)$/, '/page.tsx');
    }
    
    // Handle dynamic routes
    routePath = routePath.replace(/\[([^\]]+)\]/g, '[$1]');
    
    const appBase = isInSrc ? './src/app' : './app';
    return path.join(appBase, routePath);
  }

  getApiRoutePath(pagesPath, isInSrc) {
    // Remove pages/api/ prefix
    let routePath = pagesPath.replace(/^pages\/api\//, '');
    
    // Convert to route.ts
    if (routePath.endsWith('.ts') || routePath.endsWith('.js')) {
      routePath = routePath.replace(/\.(ts|js)$/, '/route.ts');
    } else if (routePath.endsWith('.tsx') || routePath.endsWith('.jsx')) {
      routePath = routePath.replace(/\.(tsx|jsx)$/, '/route.ts');
    }
    
    // Handle index files
    routePath = routePath.replace(/\/index\/route\.ts$/, '/route.ts');
    
    const appBase = isInSrc ? './src/app' : './app';
    return path.join(appBase, 'api', routePath);
  }

  async mergeAppFile(appPath, isInSrc) {
    const appContent = await FileUtils.readFile(appPath);
    const layoutPath = isInSrc ? './src/app/layout.tsx' : './app/layout.tsx';
    
    if (await FileUtils.exists(layoutPath)) {
      Logger.warn(`_app.tsx content needs to be manually merged into ${layoutPath}`);
      
      // Add comment to layout file
      const layoutContent = await FileUtils.readFile(layoutPath);
      const commentedApp = `\n\n/* TODO: Merge _app.tsx content:\n${appContent}\n*/`;
      
      if (!config.dryRun) {
        await FileUtils.writeFile(layoutPath, layoutContent + commentedApp);
      }
    } else {
      // Transform _app to layout
      const layoutContent = this.transformAppToLayout(appContent);
      
      if (!config.dryRun) {
        await FileUtils.writeFile(layoutPath, layoutContent);
        migrationState.createdFiles.push(layoutPath);
      }
    }
  }

  async mergeDocumentFile(documentPath, isInSrc) {
    const documentContent = await FileUtils.readFile(documentPath);
    const layoutPath = isInSrc ? './src/app/layout.tsx' : './app/layout.tsx';
    
    Logger.warn(`_document.tsx content needs to be manually merged into ${layoutPath}`);
    
    if (await FileUtils.exists(layoutPath)) {
      const layoutContent = await FileUtils.readFile(layoutPath);
      const mergedContent = await CodeTransformer.mergeAppAndDocument(layoutContent, documentContent);
      
      if (!config.dryRun) {
        await FileUtils.writeFile(layoutPath, mergedContent);
      }
    }
  }

  transformAppToLayout(appContent) {
    // This is a simplified transformation
    let layoutContent = `import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Property Platform',
  description: 'Enterprise property platform',
};
`;

    // Extract providers and components from _app
    const componentMatch = appContent.match(/function\s+(?:MyApp|App)\s*\([^)]*\)\s*{([\s\S]*)}/);
    
    if (componentMatch) {
      const appBody = componentMatch[1];
      
      // Check if there are providers
      if (appBody.includes('Provider') || appBody.includes('Context')) {
        layoutContent += `\n// TODO: Move providers to a separate Client Component
`;
      }
      
      layoutContent += `
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* TODO: Add providers and global components from _app.tsx */}
        {children}
      </body>
    </html>
  );
}`;
    }
    
    return layoutContent;
  }

  async updateProjectReferences() {
    Logger.log('Updating project references...');
    
    // Get all TypeScript/JavaScript files in the project
    const allFiles = await this.getAllProjectFiles();
    
    for (const file of allFiles) {
      try {
        await this.updateFileReferences(file);
      } catch (error) {
        Logger.error(`Failed to update references in ${file}: ${error.message}`);
        if (!config.force) throw error;
      }
    }
  }

  async getAllProjectFiles() {
    const files = [];
    const directories = ['.'];
    const excludeDirs = ['node_modules', '.git', '.next', 'dist', 'build', config.backupDir];
    
    while (directories.length > 0) {
      const dir = directories.pop();
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory() && !excludeDirs.includes(entry.name)) {
          directories.push(fullPath);
        } else if (entry.isFile() && entry.name.match(/\.(tsx?|jsx?|mjs)$/)) {
          files.push(fullPath);
        }
      }
    }
    
    return files;
  }

  async updateFileReferences(filePath) {
    let content = await FileUtils.readFile(filePath);
    let modified = false;
    
    // Update imports from pages to app
    const importRegex = /import\s+.*?\s+from\s+['"](.*?)['"]/g;
    const dynamicImportRegex = /import\s*\(['"](.*?)['"]\)/g;
    
    content = content.replace(importRegex, (match, importPath) => {
      const updated = this.updateImportPath(importPath, filePath);
      if (updated !== importPath) {
        modified = true;
        return match.replace(importPath, updated);
      }
      return match;
    });
    
    content = content.replace(dynamicImportRegex, (match, importPath) => {
      const updated = this.updateImportPath(importPath, filePath);
      if (updated !== importPath) {
        modified = true;
        return match.replace(importPath, updated);
      }
      return match;
    });
    
    // Update API calls
    const apiCallRegex = /fetch\s*\(['"](\/api\/[^'"]*)['"]/g;
    content = content.replace(apiCallRegex, (match, apiPath) => {
      // App router API routes maintain the same URL structure
      return match;
    });
    
    // Update Link hrefs
    const linkHrefRegex = /<Link\s+(?:[^>]*?\s+)?href=['"](\/[^'"]*)['"]/g;
    content = content.replace(linkHrefRegex, (match, href) => {
      // App router uses the same URL structure for navigation
      return match;
    });
    
    if (modified && !config.dryRun) {
      await FileUtils.writeFile(filePath, content);
      migrationState.updatedFiles.push(filePath);
    }
  }

  updateImportPath(importPath, fromFile) {
    // This is a simplified path updater
    // In a real migration, you'd need more sophisticated path resolution
    
    if (importPath.includes('/pages/') || importPath.includes('@/pages/')) {
      return importPath.replace('/pages/', '/app/').replace('@/pages/', '@/app/');
    }
    
    return importPath;
  }

  async cleanup() {
    if (config.force) {
      Logger.log('Force mode enabled - skipping cleanup');
      return;
    }
    
    Logger.log('Cleaning up old pages directory...');
    
    // Only remove if all migrations were successful
    if (migrationState.errors.length > 0) {
      Logger.warn('Errors occurred during migration - skipping cleanup');
      return;
    }
    
    // Remove pages directories
    try {
      if (await FileUtils.exists('./pages')) {
        await fs.rm('./pages', { recursive: true, force: true });
        Logger.log('Removed ./pages directory');
      }
      
      if (await FileUtils.exists('./src/pages')) {
        await fs.rm('./src/pages', { recursive: true, force: true });
        Logger.log('Removed ./src/pages directory');
      }
    } catch (error) {
      Logger.error(`Failed to clean up: ${error.message}`);
    }
  }

  async generateReport() {
    const report = {
      startTime: migrationState.startTime,
      endTime: new Date(),
      duration: Date.now() - migrationState.startTime.getTime(),
      summary: {
        movedFiles: migrationState.movedFiles.length,
        updatedFiles: migrationState.updatedFiles.length,
        createdFiles: migrationState.createdFiles.length,
        errors: migrationState.errors.length,
        warnings: migrationState.warnings.length
      },
      details: migrationState
    };
    
    const reportPath = './migration-report.json';
    await FileUtils.writeFile(reportPath, JSON.stringify(report, null, 2));
    
    Logger.log(`
Migration Report:
================
Duration: ${Math.round(report.duration / 1000)}s
Files moved: ${report.summary.movedFiles}
Files updated: ${report.summary.updatedFiles}
Files created: ${report.summary.createdFiles}
Errors: ${report.summary.errors}
Warnings: ${report.summary.warnings}

Full report saved to: ${reportPath}
`);

    if (report.summary.warnings > 0) {
      Logger.log('\nWarnings require manual review:');
      migrationState.warnings.forEach(warning => {
        Logger.log(`  - ${warning}`);
      });
    }
  }
}

// CLI Interface
async function main() {
  console.log(`
Next.js App Router Migration Tool
=================================
`);

  if (process.argv.includes('--help')) {
    console.log(`
Usage: node migrate-to-app-router.js [options]

Options:
  --dry-run     Preview changes without modifying files
  --force       Continue migration even if errors occur
  --verbose     Show detailed logging
  --rollback    Rollback previous migration
  --help        Show this help message

Example:
  node migrate-to-app-router.js --dry-run
  node migrate-to-app-router.js --verbose
  node migrate-to-app-router.js --rollback
`);
    process.exit(0);
  }

  if (process.argv.includes('--rollback')) {
    const success = await BackupManager.rollback();
    process.exit(success ? 0 : 1);
  }

  const migrator = new AppRouterMigrator();
  await migrator.run();
}

// Run the migration
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});