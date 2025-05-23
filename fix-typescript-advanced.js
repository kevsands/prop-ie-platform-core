#!/usr/bin/env node

const { Project, ts, SyntaxKind } = require('ts-morph');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

class AdvancedTypeScriptFixer {
  constructor() {
    this.project = new Project({
      tsConfigFilePath: path.join(process.cwd(), 'tsconfig.json'),
      skipAddingFilesFromTsConfig: true,
    });
    
    this.commonTypeMap = new Map([
      // React types
      ['onClick', '(event: React.MouseEvent<HTMLElement>) => void'],
      ['onChange', '(event: React.ChangeEvent<HTMLInputElement>) => void'],
      ['onSubmit', '(event: React.FormEvent<HTMLFormElement>) => void'],
      ['children', 'React.ReactNode'],
      ['className', 'string'],
      ['style', 'React.CSSProperties'],
      
      // Common prop types
      ['id', 'string'],
      ['name', 'string'],
      ['value', 'string'],
      ['disabled', 'boolean'],
      ['loading', 'boolean'],
      ['error', 'Error | null'],
      ['data', 'any'],
      
      // Next.js specific
      ['params', '{ [key: string]: string }'],
      ['searchParams', '{ [key: string]: string | string[] | undefined }'],
    ]);
    
    this.stats = {
      interfacesCreated: 0,
      propsFixed: 0,
      genericTypesAdded: 0,
      unionTypesFixed: 0,
      promisesFixed: 0,
      hooksFixed: 0,
    };
  }

  async run() {
    console.log(chalk.blue('🚀 Advanced TypeScript Fixer Starting...'));
    
    const sourceFiles = this.project.addSourceFilesAtPaths('src/**/*.{ts,tsx}');
    const totalFiles = sourceFiles.length;
    
    console.log(chalk.yellow(`Processing ${totalFiles} files for advanced fixes...`));
    
    for (let i = 0; i < sourceFiles.length; i++) {
      const sourceFile = sourceFiles[i];
      const relativePath = path.relative(process.cwd(), sourceFile.getFilePath());
      
      console.log(chalk.gray(`[${i + 1}/${totalFiles}] ${relativePath}`));
      
      try {
        await this.processFile(sourceFile);
      } catch (error) {
        console.error(chalk.red(`Error in ${relativePath}:`, error.message));
      }
    }
    
    await this.project.save();
    this.printStats();
  }

  async processFile(sourceFile) {
    // 1. Fix React component props
    this.fixComponentProps(sourceFile);
    
    // 2. Add generic types to hooks
    this.fixHookTypes(sourceFile);
    
    // 3. Fix Promise types
    this.fixPromiseTypes(sourceFile);
    
    // 4. Create missing interfaces
    this.createMissingInterfaces(sourceFile);
    
    // 5. Fix union types
    this.fixUnionTypes(sourceFile);
    
    // 6. Fix API response types
    this.fixApiTypes(sourceFile);
  }

  fixComponentProps(sourceFile) {
    const funcComponents = this.findFunctionalComponents(sourceFile);
    
    for (const component of funcComponents) {
      const params = component.getParameters();
      
      if (params.length > 0 && !params[0].getTypeNode()) {
        const componentName = this.getComponentName(component);
        const propsInterface = `${componentName}Props`;
        
        // Extract prop usage
        const propUsage = this.extractPropUsage(component);
        
        if (propUsage.size > 0) {
          // Create interface
          const interfaceText = this.generatePropsInterface(propsInterface, propUsage);
          
          // Add interface before component
          const componentStart = component.getStart();
          const leadingTrivia = component.getLeadingTriviaWidth();
          sourceFile.insertText(componentStart - leadingTrivia, interfaceText + '\n\n');
          
          // Add type to parameter
          params[0].setType(propsInterface);
          
          this.stats.interfacesCreated++;
          this.stats.propsFixed++;
        }
      }
    }
  }

  findFunctionalComponents(sourceFile) {
    const components = [];
    
    // Find arrow function components
    const arrowFunctions = sourceFile.getDescendantsOfKind(SyntaxKind.ArrowFunction);
    for (const func of arrowFunctions) {
      if (this.isReactComponent(func)) {
        components.push(func);
      }
    }
    
    // Find function declaration components
    const functionDecls = sourceFile.getDescendantsOfKind(SyntaxKind.FunctionDeclaration);
    for (const func of functionDecls) {
      if (this.isReactComponent(func)) {
        components.push(func);
      }
    }
    
    return components;
  }

  isReactComponent(func) {
    // Check if returns JSX
    const hasJSX = func.getDescendantsOfKind(SyntaxKind.JsxElement).length > 0 ||
                   func.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement).length > 0 ||
                   func.getDescendantsOfKind(SyntaxKind.JsxFragment).length > 0;
    
    // Check if name starts with capital letter
    const name = this.getComponentName(func);
    const isCapitalized = name && /^[A-Z]/.test(name);
    
    return hasJSX && isCapitalized;
  }

  getComponentName(func) {
    if (func.getKind() === SyntaxKind.FunctionDeclaration) {
      return func.getName();
    }
    
    // For arrow functions, check parent variable declaration
    const parent = func.getParent();
    if (parent && parent.getKind() === SyntaxKind.VariableDeclaration) {
      return parent.getName();
    }
    
    return null;
  }

  extractPropUsage(component) {
    const propUsage = new Map();
    const params = component.getParameters();
    
    if (params.length === 0) return propUsage;
    
    const paramName = params[0].getName();
    
    // Find all property accesses
    component.forEachDescendant(node => {
      if (node.getKind() === SyntaxKind.PropertyAccessExpression) {
        const propAccess = node.asKindOrThrow(SyntaxKind.PropertyAccessExpression);
        const object = propAccess.getExpression();
        
        if (object.getText() === paramName) {
          const propName = propAccess.getName();
          
          // Try to infer type from usage
          const inferredType = this.inferPropType(propName, propAccess);
          propUsage.set(propName, inferredType);
        }
      }
      
      // Handle destructured props
      if (node.getKind() === SyntaxKind.ObjectBindingPattern && 
          node.getParent() === params[0]) {
        const pattern = node.asKindOrThrow(SyntaxKind.ObjectBindingPattern);
        
        for (const element of pattern.getElements()) {
          const propName = element.getName();
          const inferredType = this.inferPropType(propName, element);
          propUsage.set(propName, inferredType);
        }
      }
    });
    
    return propUsage;
  }

  inferPropType(propName, node) {
    // Check common type map
    if (this.commonTypeMap.has(propName)) {
      return this.commonTypeMap.get(propName);
    }
    
    // Check how it's used
    const parent = node.getParent();
    
    // Used in conditional
    if (parent && (parent.getKind() === SyntaxKind.IfStatement || 
                   parent.getKind() === SyntaxKind.ConditionalExpression)) {
      return 'boolean';
    }
    
    // Used with map
    if (parent && parent.getKind() === SyntaxKind.CallExpression) {
      const callExpr = parent.asKindOrThrow(SyntaxKind.CallExpression);
      const propAccess = callExpr.getExpression();
      
      if (propAccess.getKind() === SyntaxKind.PropertyAccessExpression &&
          propAccess.asKindOrThrow(SyntaxKind.PropertyAccessExpression).getName() === 'map') {
        return 'any[]';
      }
    }
    
    return 'any';
  }

  generatePropsInterface(name, propUsage) {
    const props = Array.from(propUsage.entries())
      .map(([propName, propType]) => `  ${propName}?: ${propType};`)
      .join('\n');
    
    return `interface ${name} {\n${props}\n}`;
  }

  fixHookTypes(sourceFile) {
    // Fix useState
    const useStateCalls = this.findHookCalls(sourceFile, 'useState');
    
    for (const call of useStateCalls) {
      if (!call.getTypeArguments().length) {
        const args = call.getArguments();
        if (args.length > 0) {
          const initialValue = args[0];
          const inferredType = this.inferStateType(initialValue);
          
          call.addTypeArgument(inferredType);
          this.stats.hooksFixed++;
        }
      }
    }
    
    // Fix useRef
    const useRefCalls = this.findHookCalls(sourceFile, 'useRef');
    
    for (const call of useRefCalls) {
      if (!call.getTypeArguments().length) {
        const args = call.getArguments();
        const inferredType = args.length > 0 && args[0].getText() !== 'null' 
          ? 'any' 
          : 'HTMLElement | null';
        
        call.addTypeArgument(inferredType);
        this.stats.hooksFixed++;
      }
    }
  }

  findHookCalls(sourceFile, hookName) {
    const calls = [];
    
    sourceFile.forEachDescendant(node => {
      if (node.getKind() === SyntaxKind.CallExpression) {
        const callExpr = node.asKindOrThrow(SyntaxKind.CallExpression);
        const expr = callExpr.getExpression();
        
        if (expr.getText() === hookName) {
          calls.push(callExpr);
        }
      }
    });
    
    return calls;
  }

  inferStateType(initialValue) {
    const text = initialValue.getText();
    
    if (text === 'null') return 'any | null';
    if (text === 'undefined') return 'any | undefined';
    if (text === 'true' || text === 'false') return 'boolean';
    if (/^['"`]/.test(text)) return 'string';
    if (/^\d+$/.test(text)) return 'number';
    if (/^\[/.test(text)) return 'any[]';
    if (/^\{/.test(text)) return 'Record<string, any>';
    
    return 'any';
  }

  fixPromiseTypes(sourceFile) {
    const asyncFunctions = sourceFile.getDescendantsOfKind(SyntaxKind.FunctionDeclaration)
      .filter(f => f.hasModifier(SyntaxKind.AsyncKeyword));
    
    for (const func of asyncFunctions) {
      const returnType = func.getReturnTypeNode();
      
      if (!returnType || returnType.getText() === 'Promise<any>') {
        // Try to infer from return statements
        const returnStatements = func.getDescendantsOfKind(SyntaxKind.ReturnStatement);
        
        if (returnStatements.length > 0) {
          const inferredType = this.inferPromiseReturnType(returnStatements);
          func.setReturnType(`Promise<${inferredType}>`);
          this.stats.promisesFixed++;
        }
      }
    }
  }

  inferPromiseReturnType(returnStatements) {
    // Simple inference based on first return
    if (returnStatements.length > 0) {
      const expr = returnStatements[0].getExpression();
      if (expr) {
        const text = expr.getText();
        
        if (/^{.*}$/.test(text)) return 'Record<string, any>';
        if (/^\[.*\]$/.test(text)) return 'any[]';
        if (text === 'null') return 'null';
        if (text === 'undefined') return 'void';
      }
    }
    
    return 'any';
  }

  createMissingInterfaces(sourceFile) {
    // Find object literals that could be interfaces
    const objectLiterals = sourceFile.getDescendantsOfKind(SyntaxKind.ObjectLiteralExpression);
    
    for (const objLiteral of objectLiterals) {
      const parent = objLiteral.getParent();
      
      // Check if it's a type annotation position
      if (parent && parent.getKind() === SyntaxKind.TypeLiteral) {
        const properties = objLiteral.getProperties();
        
        if (properties.length > 3) {
          // Complex object, might benefit from interface
          // This is a placeholder for more complex logic
        }
      }
    }
  }

  fixUnionTypes(sourceFile) {
    // Find type annotations that could be union types
    sourceFile.forEachDescendant(node => {
      if (node.getKind() === SyntaxKind.TypeReference) {
        const typeRef = node.asKindOrThrow(SyntaxKind.TypeReference);
        const typeName = typeRef.getText();
        
        // Common patterns that should be unions
        if (typeName === 'string | null' || typeName === 'string | undefined') {
          // Already a union, skip
          return;
        }
        
        // Check parent context
        const parent = node.getParent();
        if (parent && parent.getKind() === SyntaxKind.Parameter) {
          const param = parent.asKindOrThrow(SyntaxKind.Parameter);
          
          // Check if parameter has default value
          if (param.getInitializer()) {
            const initText = param.getInitializer().getText();
            
            if (initText === 'null' && typeName !== 'null') {
              param.setType(`${typeName} | null`);
              this.stats.unionTypesFixed++;
            }
          }
        }
      }
    });
  }

  fixApiTypes(sourceFile) {
    // Find fetch calls and axios calls
    const fetchCalls = this.findApiCalls(sourceFile);
    
    for (const call of fetchCalls) {
      // Check if it's properly typed
      const parent = call.getParent();
      
      if (parent && parent.getKind() === SyntaxKind.AwaitExpression) {
        const awaitParent = parent.getParent();
        
        if (awaitParent && awaitParent.getKind() === SyntaxKind.VariableDeclaration) {
          const varDecl = awaitParent.asKindOrThrow(SyntaxKind.VariableDeclaration);
          
          if (!varDecl.getTypeNode()) {
            // Add generic response type
            varDecl.setType('any');
            this.stats.genericTypesAdded++;
          }
        }
      }
    }
  }

  findApiCalls(sourceFile) {
    const calls = [];
    
    sourceFile.forEachDescendant(node => {
      if (node.getKind() === SyntaxKind.CallExpression) {
        const callExpr = node.asKindOrThrow(SyntaxKind.CallExpression);
        const expr = callExpr.getExpression();
        const text = expr.getText();
        
        if (text === 'fetch' || text.includes('axios') || text.includes('api')) {
          calls.push(callExpr);
        }
      }
    });
    
    return calls;
  }

  printStats() {
    console.log(chalk.blue('\n📊 Advanced Fix Statistics:'));
    console.log(chalk.gray(`  Interfaces created: ${this.stats.interfacesCreated}`));
    console.log(chalk.gray(`  Component props fixed: ${this.stats.propsFixed}`));
    console.log(chalk.gray(`  Generic types added: ${this.stats.genericTypesAdded}`));
    console.log(chalk.gray(`  Union types fixed: ${this.stats.unionTypesFixed}`));
    console.log(chalk.gray(`  Promise types fixed: ${this.stats.promisesFixed}`));
    console.log(chalk.gray(`  Hook types fixed: ${this.stats.hooksFixed}`));
  }
}

// Main execution
async function main() {
  try {
    const fixer = new AdvancedTypeScriptFixer();
    await fixer.run();
  } catch (error) {
    console.error(chalk.red('❌ Fatal error:'), error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = AdvancedTypeScriptFixer;