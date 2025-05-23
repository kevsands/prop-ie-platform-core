const fs = require('fs');
const path = require('path');

class ArchitectureAnalyzer {
  constructor() {
    this.components = [];
    this.routes = {
      app: [],
      pages: [],
      api: []
    };
    this.stateManagement = {
      contexts: [],
      reactQuery: [],
      redux: [],
      zustand: []
    };
    this.dependencies = new Map();
    this.conflicts = [];
    this.issues = [];
  }

  async analyze() {
    console.log('🔍 Starting Architecture Analysis...\n');
    
    // Analyze routing structure
    await this.analyzeRouting();
    
    // Analyze components
    await this.analyzeComponents();
    
    // Analyze state management
    await this.analyzeStateManagement();
    
    // Check for conflicts and issues
    this.checkForConflicts();
    
    // Generate reports
    this.generateReports();
    
    console.log('\n✅ Analysis complete! Check the generated reports.');
  }

  async analyzeRouting() {
    console.log('📍 Analyzing routing structure...');
    
    // Check App Router
    const appDir = path.join(process.cwd(), 'src/app');
    if (fs.existsSync(appDir)) {
      this.scanAppRoutes(appDir, '');
    }
    
    // Check Pages Router (legacy)
    const pagesDir = path.join(process.cwd(), 'src/pages');
    if (fs.existsSync(pagesDir)) {
      this.scanPagesRoutes(pagesDir, '');
    }
    
    // Check API routes
    const apiDir = path.join(process.cwd(), 'src/app/api');
    if (fs.existsSync(apiDir)) {
      this.scanApiRoutes(apiDir, '/api');
    }
    
    console.log(`  ✓ Found ${this.routes.app.length} app routes`);
    console.log(`  ✓ Found ${this.routes.pages.length} pages routes`);
    console.log(`  ✓ Found ${this.routes.api.length} API routes`);
  }

  scanAppRoutes(dir, basePath) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        const newBasePath = basePath + '/' + file;
        this.scanAppRoutes(filePath, newBasePath);
      } else if (file === 'page.tsx' || file === 'page.jsx' || file === 'page.js') {
        const route = basePath || '/';
        this.routes.app.push({
          path: route,
          file: filePath,
          type: 'page'
        });
      } else if (file === 'layout.tsx' || file === 'layout.jsx' || file === 'layout.js') {
        this.routes.app.push({
          path: basePath || '/',
          file: filePath,
          type: 'layout'
        });
      }
    }
  }

  scanPagesRoutes(dir, basePath) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && file !== 'api') {
        const newBasePath = basePath + '/' + file;
        this.scanPagesRoutes(filePath, newBasePath);
      } else if (file.endsWith('.tsx') || file.endsWith('.jsx') || file.endsWith('.js')) {
        const routeName = file.replace(/\.(tsx|jsx|js)$/, '');
        if (routeName !== '_app' && routeName !== '_document') {
          const route = basePath + '/' + (routeName === 'index' ? '' : routeName);
          this.routes.pages.push({
            path: route || '/',
            file: filePath
          });
        }
      }
    }
  }

  scanApiRoutes(dir, basePath) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        const newBasePath = basePath + '/' + file;
        this.scanApiRoutes(filePath, newBasePath);
      } else if (file === 'route.ts' || file === 'route.js') {
        this.routes.api.push({
          path: basePath,
          file: filePath,
          hasAuth: this.checkAuthInFile(filePath)
        });
      }
    }
  }

  checkAuthInFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      return content.includes('getServerSession') || 
             content.includes('authOptions') ||
             content.includes('authentication required') ||
             content.includes('getCurrentUser');
    } catch (error) {
      return false;
    }
  }

  async analyzeComponents() {
    console.log('\n🧩 Analyzing components...');
    
    const componentsDir = path.join(process.cwd(), 'src/components');
    const featuresDir = path.join(process.cwd(), 'src/features');
    
    if (fs.existsSync(componentsDir)) {
      this.scanComponents(componentsDir);
    }
    
    if (fs.existsSync(featuresDir)) {
      this.scanComponents(featuresDir);
    }
    
    // Analyze component sizes and dependencies
    this.analyzeComponentMetrics();
    
    console.log(`  ✓ Found ${this.components.length} components`);
    console.log(`  ✓ Average component size: ${this.getAverageComponentSize()} lines`);
  }

  scanComponents(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        this.scanComponents(filePath);
      } else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n').length;
        const imports = this.extractImports(content);
        
        this.components.push({
          name: file.replace(/\.(tsx|jsx)$/, ''),
          path: filePath,
          lines,
          imports,
          complexity: this.calculateComplexity(content)
        });
      }
    }
  }

  extractImports(content) {
    const imports = [];
    const importRegex = /import\s+(?:{[^}]+}|\*\s+as\s+\w+|\w+)\s+from\s+['"]([^'"]+)['"]/g;
    let match;
    
    while ((match = importRegex.exec(content)) !== null) {
      imports.push(match[1]);
    }
    
    return imports;
  }

  calculateComplexity(content) {
    // Simple complexity calculation based on common patterns
    let complexity = 0;
    
    complexity += (content.match(/useState/g) || []).length * 2;
    complexity += (content.match(/useEffect/g) || []).length * 3;
    complexity += (content.match(/useCallback/g) || []).length * 2;
    complexity += (content.match(/useMemo/g) || []).length * 2;
    complexity += (content.match(/if\s*\(/g) || []).length;
    complexity += (content.match(/switch\s*\(/g) || []).length * 2;
    complexity += (content.match(/\?.+:/g) || []).length;
    
    return complexity;
  }

  analyzeComponentMetrics() {
    // Find largest components
    this.components.sort((a, b) => b.lines - a.lines);
    
    // Build dependency graph
    this.components.forEach(component => {
      this.dependencies.set(component.name, component.imports);
    });
    
    // Check for circular dependencies
    this.checkCircularDependencies();
  }

  checkCircularDependencies() {
    // Simplified circular dependency check
    this.components.forEach(component => {
      const visited = new Set();
      const stack = new Set();
      
      if (this.hasCycle(component.name, visited, stack)) {
        this.issues.push({
          type: 'circular-dependency',
          component: component.name,
          severity: 'high'
        });
      }
    });
  }

  hasCycle(node, visited, stack) {
    visited.add(node);
    stack.add(node);
    
    const deps = this.dependencies.get(node) || [];
    for (const dep of deps) {
      if (!visited.has(dep)) {
        if (this.hasCycle(dep, visited, stack)) {
          return true;
        }
      } else if (stack.has(dep)) {
        return true;
      }
    }
    
    stack.delete(node);
    return false;
  }

  async analyzeStateManagement() {
    console.log('\n🔄 Analyzing state management...');
    
    const srcDir = path.join(process.cwd(), 'src');
    this.scanForStateManagement(srcDir);
    
    console.log(`  ✓ Found ${this.stateManagement.contexts.length} Context providers`);
    console.log(`  ✓ Found ${this.stateManagement.reactQuery.length} React Query usages`);
    console.log(`  ✓ Found ${this.stateManagement.redux.length} Redux usages`);
    console.log(`  ✓ Found ${this.stateManagement.zustand.length} Zustand usages`);
  }

  scanForStateManagement(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !file.includes('node_modules')) {
        this.scanForStateManagement(filePath);
      } else if (file.endsWith('.tsx') || file.endsWith('.jsx') || file.endsWith('.ts') || file.endsWith('.js')) {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          
          // Check for Context
          if (content.includes('createContext') || content.includes('useContext')) {
            this.stateManagement.contexts.push(filePath);
          }
          
          // Check for React Query
          if (content.includes('useQuery') || content.includes('useMutation') || content.includes('@tanstack/react-query')) {
            this.stateManagement.reactQuery.push(filePath);
          }
          
          // Check for Redux
          if (content.includes('useSelector') || content.includes('useDispatch') || content.includes('redux')) {
            this.stateManagement.redux.push(filePath);
          }
          
          // Check for Zustand
          if (content.includes('zustand') || content.includes('create(')) {
            this.stateManagement.zustand.push(filePath);
          }
        } catch (error) {
          // Ignore read errors
        }
      }
    }
  }

  checkForConflicts() {
    console.log('\n⚠️  Checking for conflicts...');
    
    // Check for route conflicts
    const allRoutes = [...this.routes.app.map(r => r.path), ...this.routes.pages.map(r => r.path)];
    const routeSet = new Set();
    
    allRoutes.forEach(route => {
      if (routeSet.has(route)) {
        this.conflicts.push({
          type: 'route-conflict',
          path: route,
          message: `Duplicate route found: ${route}`
        });
      }
      routeSet.add(route);
    });
    
    // Check for API routes without auth
    this.routes.api.forEach(route => {
      if (!route.hasAuth) {
        this.issues.push({
          type: 'missing-auth',
          path: route.path,
          file: route.file,
          severity: 'high'
        });
      }
    });
    
    // Check for large components
    this.components.forEach(component => {
      if (component.lines > 500) {
        this.issues.push({
          type: 'large-component',
          component: component.name,
          lines: component.lines,
          severity: 'medium'
        });
      }
    });
    
    console.log(`  ✓ Found ${this.conflicts.length} conflicts`);
    console.log(`  ✓ Found ${this.issues.length} issues`);
  }

  getAverageComponentSize() {
    if (this.components.length === 0) return 0;
    const totalLines = this.components.reduce((sum, comp) => sum + comp.lines, 0);
    return Math.round(totalLines / this.components.length);
  }

  generateReports() {
    console.log('\n📄 Generating reports...');
    
    // Generate architecture map JSON
    const architectureMap = {
      summary: {
        totalComponents: this.components.length,
        totalRoutes: this.routes.app.length + this.routes.pages.length + this.routes.api.length,
        averageComponentSize: this.getAverageComponentSize(),
        totalLinesOfCode: this.components.reduce((sum, comp) => sum + comp.lines, 0)
      },
      routes: this.routes,
      largestComponents: this.components.slice(0, 10).map(c => ({
        name: c.name,
        lines: c.lines,
        path: c.path
      })),
      stateManagement: {
        contexts: this.stateManagement.contexts.length,
        reactQuery: this.stateManagement.reactQuery.length,
        redux: this.stateManagement.redux.length,
        zustand: this.stateManagement.zustand.length
      },
      issues: this.issues,
      conflicts: this.conflicts
    };
    
    fs.writeFileSync('architecture-map.json', JSON.stringify(architectureMap, null, 2));
    console.log('  ✓ Generated architecture-map.json');
    
    // Generate routing conflicts report
    const conflictsReport = this.conflicts.map(c => 
      `${c.type}: ${c.message}`
    ).join('\n');
    
    fs.writeFileSync('routing-conflicts.txt', conflictsReport || 'No routing conflicts found');
    console.log('  ✓ Generated routing-conflicts.txt');
    
    // Generate component hierarchy JSON
    const componentHierarchy = {
      components: this.components.slice(0, 50).map(c => ({
        name: c.name,
        path: c.path,
        lines: c.lines,
        complexity: c.complexity,
        importCount: c.imports.length
      })),
      dependencies: Object.fromEntries(this.dependencies)
    };
    
    fs.writeFileSync('component-hierarchy.json', JSON.stringify(componentHierarchy, null, 2));
    console.log('  ✓ Generated component-hierarchy.json');
    
    // Generate recommended fixes
    this.generateRecommendations();
  }

  generateRecommendations() {
    const recommendations = [];
    
    // Large components
    const largeComponents = this.components.filter(c => c.lines > 500);
    if (largeComponents.length > 0) {
      recommendations.push({
        category: 'Component Size',
        issue: `${largeComponents.length} components exceed 500 lines`,
        recommendation: 'Split these components into smaller, more focused components',
        components: largeComponents.slice(0, 5).map(c => c.name)
      });
    }
    
    // Missing auth
    const missingAuth = this.issues.filter(i => i.type === 'missing-auth');
    if (missingAuth.length > 0) {
      recommendations.push({
        category: 'Security',
        issue: `${missingAuth.length} API routes lack authentication`,
        recommendation: 'Add authentication checks to these routes',
        routes: missingAuth.slice(0, 5).map(i => i.path)
      });
    }
    
    // State management
    if (this.stateManagement.contexts.length > 10) {
      recommendations.push({
        category: 'State Management',
        issue: `${this.stateManagement.contexts.length} Context providers found`,
        recommendation: 'Consider consolidating related contexts or using a state management library',
        severity: 'medium'
      });
    }
    
    fs.writeFileSync('architecture-recommendations.json', JSON.stringify(recommendations, null, 2));
    console.log('  ✓ Generated architecture-recommendations.json');
  }
}

// Run the analyzer
const analyzer = new ArchitectureAnalyzer();
analyzer.analyze().catch(console.error);