#!/usr/bin/env node

/**
 * Claude Code VSCode Problem Resolver
 * 
 * An enterprise-grade solution for systematically detecting, fixing, and verifying 
 * solutions for problems identified in VSCode using Claude Code.
 * 
 * @license MIT
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { program } = require('commander');
const { execSync } = require('child_process');
const winston = require('winston');
const chalk = require('chalk');
const dotenv = require('dotenv');
const glob = require('glob');
const Anthropic = require('@anthropic-ai/sdk');
const inquirer = require('inquirer');
const temp = require('temp').track();
const { v4: uuidv4 } = require('uuid');
const { promisify } = require('util');
const { spawn } = require('child_process');
const simpleGit = require('simple-git');

// Load env variables
dotenv.config();

// Version from package.json
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
const version = packageJson.version;

// Command line interface setup
program
  .name('claude-resolver')
  .description('Claude Code VSCode Problem Resolver')
  .version(version)
  .option('-c, --config <path>', 'Path to configuration file', '.claude-resolver.yml')
  .option('-w, --workspace <path>', 'Path to workspace root', process.cwd())
  .option('-o, --output <path>', 'Output directory for logs and reports', '.claude-resolver-output')
  .option('-l, --log-level <level>', 'Log level (debug, info, warn, error)', 'info')
  .option('-d, --dry-run', 'Dry run (no changes will be applied)', false)
  .option('-i, --interactive', 'Interactive mode (prompt for approvals)', true)
  .option('-m, --max-concurrent <n>', 'Maximum concurrent problems to process', 1)
  .option('-b, --git-branch <branch>', 'Git branch to use for changes')
  .option('--ci', 'Run in CI mode (non-interactive)', false)
  .parse(process.argv);

const options = program.opts();

// Main class for the resolver
class ClaudeResolver {
  constructor(options) {
    this.options = options;
    this.initTimestamp = new Date().toISOString().replace(/:/g, '-');
    this.config = null;
    this.logger = null;
    this.anthropic = null;
    this.git = null;
    this.workspacePath = path.resolve(options.workspace);
    this.outputPath = path.resolve(options.output);
    this.backupPath = null;
    this.problems = [];
    this.fixedProblems = [];
    this.failedProblems = [];
    this.skippedProblems = [];
    this.stats = {
      totalProblems: 0,
      fixedProblems: 0,
      failedProblems: 0,
      skippedProblems: 0,
      verificationPasses: 0,
      verificationFails: 0,
      startTime: Date.now(),
      endTime: null,
      elapsedTime: null
    };
  }

  /**
   * Initialize the resolver
   */
  async initialize() {
    try {
      // Ensure output directory exists
      if (!fs.existsSync(this.outputPath)) {
        fs.mkdirSync(this.outputPath, { recursive: true });
      }
      
      // Load configuration
      await this.loadConfig();
      
      // Initialize logger
      this.initializeLogger();
      
      this.logger.info('Claude Code VSCode Problem Resolver initializing...');
      this.logger.debug('Options:', { options: this.options });
      this.logger.debug('Configuration loaded:', { config: this.config });

      // Initialize backup directory
      if (this.config.safety.createBackups) {
        this.backupPath = path.resolve(this.config.safety.backupLocation || path.join(this.outputPath, 'backups'));
        if (!fs.existsSync(this.backupPath)) {
          fs.mkdirSync(this.backupPath, { recursive: true });
        }
        this.logger.debug(`Backup directory created at ${this.backupPath}`);
      }

      // Initialize Anthropic client
      const apiKey = this.config.claude.apiKey || process.env.ANTHROPIC_API_KEY;
      if (!apiKey) {
        throw new Error('Anthropic API key not found. Provide it in .claude-resolver.yml or set ANTHROPIC_API_KEY environment variable.');
      }
      
      this.anthropic = new Anthropic({
        apiKey
      });
      
      // Initialize Git if enabled
      if (this.config.versionControl.git.enabled) {
        this.git = simpleGit(this.workspacePath);
        
        // Check if Git is available and we're in a Git repository
        try {
          await this.git.status();
          this.logger.debug('Git repository detected and accessible');
          
          // Create a new branch if specified
          if (options.gitBranch) {
            const currentBranch = (await this.git.branchLocal()).current;
            this.logger.info(`Current Git branch: ${currentBranch}`);
            
            const newBranch = options.gitBranch.startsWith(this.config.versionControl.git.branchPrefix) 
              ? options.gitBranch 
              : `${this.config.versionControl.git.branchPrefix}${options.gitBranch}`;
            
            try {
              await this.git.checkoutBranch(newBranch, currentBranch);
              this.logger.info(`Created and switched to new branch: ${newBranch}`);
            } catch (err) {
              // Check if branch already exists
              try {
                await this.git.checkout(newBranch);
                this.logger.info(`Switched to existing branch: ${newBranch}`);
              } catch (checkoutErr) {
                this.logger.error(`Failed to create or switch to branch ${newBranch}:`, checkoutErr);
                throw new Error(`Git branch creation failed: ${checkoutErr.message}`);
              }
            }
          }
        } catch (err) {
          this.logger.warn(`Git initialization failed: ${err.message}. Continuing without Git integration.`);
          this.config.versionControl.git.enabled = false;
        }
      }
      
      this.logger.info('Initialization complete');
      return true;
    } catch (error) {
      if (this.logger) {
        this.logger.error('Initialization failed:', error);
      } else {
        console.error('Initialization failed:', error);
      }
      throw error;
    }
  }

  /**
   * Load configuration from file
   */
  async loadConfig() {
    try {
      const configPath = path.resolve(this.options.config);
      
      if (!fs.existsSync(configPath)) {
        throw new Error(`Configuration file not found: ${configPath}`);
      }
      
      const configContent = fs.readFileSync(configPath, 'utf8');
      this.config = yaml.load(configContent);
      
      // Override configuration with command line options
      if (this.options.logLevel) {
        this.config.logging.level = this.options.logLevel;
      }
      
      if (this.options.ci) {
        this.config.ci.enabled = true;
        this.config.ci.nonInteractive = true;
        this.options.interactive = false;
      }
      
      if (this.options.dryRun) {
        this.config.fixes.requireApproval = true;
        this.config.fixes.autoCommit = false;
      }
      
      if (this.options.maxConcurrent) {
        this.config.safety.maxConcurrent = parseInt(this.options.maxConcurrent, 10);
      }
      
      // Resolve paths
      if (this.config.safety.backupLocation) {
        this.config.safety.backupLocation = path.resolve(this.workspacePath, this.config.safety.backupLocation);
      }
      
      if (this.config.advanced && this.config.advanced.cacheLocation) {
        this.config.advanced.cacheLocation = path.resolve(this.workspacePath, this.config.advanced.cacheLocation);
      }
      
      return this.config;
    } catch (error) {
      console.error('Failed to load configuration:', error);
      throw error;
    }
  }

  /**
   * Initialize logging
   */
  initializeLogger() {
    const logConfig = this.config.logging;
    const logFormat = winston.format.combine(
      winston.format.timestamp(),
      logConfig.format === 'json' 
        ? winston.format.json() 
        : winston.format.printf(({ level, message, timestamp, ...meta }) => {
            return `${timestamp} ${level.toUpperCase()}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
          })
    );
    
    const transports = [
      new winston.transports.File({ 
        filename: path.join(this.outputPath, logConfig.file || 'claude-resolver.log'),
        level: logConfig.level || 'info',
        format: logFormat
      })
    ];
    
    if (logConfig.console !== false) {
      transports.push(
        new winston.transports.Console({
          level: logConfig.level || 'info',
          format: winston.format.combine(
            winston.format.timestamp(),
            logConfig.colorize !== false ? winston.format.colorize() : winston.format.simple(),
            winston.format.printf(({ level, message, timestamp, ...meta }) => {
              return `${timestamp} ${level}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
            })
          )
        })
      );
    }
    
    this.logger = winston.createLogger({
      level: logConfig.level || 'info',
      format: logFormat,
      defaultMeta: { service: 'claude-resolver' },
      transports
    });
  }

  /**
   * Collect problems from VSCode
   */
  async collectProblems() {
    this.logger.info('Collecting problems from VSCode...');
    
    try {
      // Read problems from VSCode's problems.txt export or diagnostics API
      // For demo, we'll use a mock problems collection
      const problems = await this.mockCollectProblems();
      
      this.logger.info(`Collected ${problems.length} problems`);
      this.stats.totalProblems = problems.length;
      
      // Filter and prioritize problems
      const filteredProblems = this.filterProblems(problems);
      const prioritizedProblems = this.prioritizeProblems(filteredProblems);
      
      this.problems = prioritizedProblems;
      this.logger.info(`After filtering and prioritization: ${this.problems.length} problems to process`);
      
      return this.problems;
    } catch (error) {
      this.logger.error('Failed to collect problems:', error);
      throw error;
    }
  }
  
  /**
   * Mock problem collection for demonstration
   * In a real implementation, this would integrate with VSCode's diagnostics
   */
  async mockCollectProblems() {
    const problems = [
      {
        id: uuidv4(),
        file: path.join(this.workspacePath, 'src', 'components', 'auth', 'LoginForm.tsx'),
        line: 15,
        column: 23,
        range: { start: { line: 15, character: 23 }, end: { line: 15, character: 28 } },
        severity: 'error',
        source: 'typescript',
        code: '2551',
        message: "Property 'login' does not exist on type 'AuthContextType'. Did you mean 'signIn'?",
        category: 'typescript'
      },
      {
        id: uuidv4(),
        file: path.join(this.workspacePath, 'src', 'components', 'performance', 'VirtualizedList.tsx'),
        line: 42,
        column: 10,
        range: { start: { line: 42, character: 10 }, end: { line: 42, character: 20 } },
        severity: 'error',
        source: 'typescript',
        code: '2322',
        message: "Type '(item: T) => JSX.Element' is not assignable to type 'string | number'.",
        category: 'typescript'
      },
      {
        id: uuidv4(),
        file: path.join(this.workspacePath, 'src', 'lib', 'security', 'index.ts'),
        line: 27,
        column: 5,
        range: { start: { line: 27, character: 5 }, end: { line: 27, character: 56 } },
        severity: 'warning',
        source: 'eslint',
        code: 'security/no-unsafe-assignment',
        message: "Assignment might lead to prototype pollution or similar attacks",
        category: 'security'
      }
    ];
    
    // Augment problems with file content
    for (const problem of problems) {
      if (fs.existsSync(problem.file)) {
        const fileContent = fs.readFileSync(problem.file, 'utf8');
        const lines = fileContent.split('\n');
        
        // Get surrounding context (10 lines before and after)
        const startLine = Math.max(0, problem.line - 10);
        const endLine = Math.min(lines.length - 1, problem.line + 10);
        
        problem.surroundingCode = lines.slice(startLine, endLine + 1).join('\n');
        problem.fileContent = fileContent;
        problem.language = path.extname(problem.file).substring(1);
      } else {
        this.logger.warn(`File not found: ${problem.file}`);
        problem.surroundingCode = '';
        problem.fileContent = '';
        problem.language = '';
      }
    }
    
    return problems;
  }
  
  /**
   * Filter problems based on configuration
   */
  filterProblems(problems) {
    // Apply category filters
    const categoryConfig = this.config.categories;
    
    let filteredProblems = problems;
    
    if (categoryConfig.enabled && categoryConfig.enabled.length > 0) {
      filteredProblems = filteredProblems.filter(problem => 
        categoryConfig.enabled.includes(problem.category) || 
        categoryConfig.enabled.includes(problem.source)
      );
    }
    
    if (categoryConfig.disabled && categoryConfig.disabled.length > 0) {
      filteredProblems = filteredProblems.filter(problem => 
        !categoryConfig.disabled.includes(problem.category) && 
        !categoryConfig.disabled.includes(problem.source)
      );
    }
    
    // Apply file pattern filters
    if (this.config.files) {
      const { include, exclude } = this.config.files;
      
      if (include && include.length > 0) {
        const includePatterns = include.map(pattern => 
          pattern.startsWith('/') ? pattern : path.join(this.workspacePath, pattern)
        );
        
        filteredProblems = filteredProblems.filter(problem => {
          return includePatterns.some(pattern => {
            const matchResult = glob.sync(pattern);
            return matchResult.includes(problem.file);
          });
        });
      }
      
      if (exclude && exclude.length > 0) {
        const excludePatterns = exclude.map(pattern => 
          pattern.startsWith('/') ? pattern : path.join(this.workspacePath, pattern)
        );
        
        filteredProblems = filteredProblems.filter(problem => {
          return !excludePatterns.some(pattern => {
            const matchResult = glob.sync(pattern);
            return matchResult.includes(problem.file);
          });
        });
      }
    }
    
    // Check for critical files that should never be modified
    if (this.config.safety.excludeCriticalFiles) {
      filteredProblems = filteredProblems.filter(problem => {
        const fileName = path.basename(problem.file);
        return !this.config.safety.excludeCriticalFiles.some(pattern => {
          // Handle glob patterns
          if (pattern.includes('*')) {
            const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
            return regex.test(fileName);
          }
          return fileName === pattern;
        });
      });
    }
    
    return filteredProblems;
  }
  
  /**
   * Prioritize problems based on configuration
   */
  prioritizeProblems(problems) {
    const priorityConfig = this.config.categories.priority || {};
    
    // Calculate base priority for each problem
    const prioritizedProblems = problems.map(problem => {
      let priority = 0;
      
      // Priority based on severity
      switch (problem.severity) {
        case 'error':
          priority += priorityConfig.errors || 90;
          break;
        case 'warning':
          priority += priorityConfig.warnings || 60;
          break;
        case 'info':
        case 'hint':
          priority += priorityConfig.hints || 40;
          break;
      }
      
      // Priority based on category
      if (problem.category && priorityConfig[problem.category]) {
        priority += priorityConfig[problem.category];
      }
      
      // Priority based on source
      if (problem.source && priorityConfig[problem.source]) {
        priority += priorityConfig[problem.source];
      }
      
      return { ...problem, priority };
    });
    
    // Sort by priority (descending)
    return prioritizedProblems.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Process all collected problems
   */
  async processProblems() {
    this.logger.info(`Starting to process ${this.problems.length} problems...`);
    
    if (this.problems.length === 0) {
      this.logger.info('No problems to process');
      return { fixed: 0, failed: 0, skipped: 0 };
    }
    
    // Execute custom hook if configured
    if (this.config.advanced?.hooks?.beforeFix) {
      await this.executeHook('beforeFix');
    }
    
    // Process problems with concurrency limit
    const concurrency = this.config.safety.maxConcurrent;
    let activePromises = [];
    let results = [];
    
    // Clone problems array to avoid modifying during iteration
    const remainingProblems = [...this.problems];
    
    while (remainingProblems.length > 0 || activePromises.length > 0) {
      // Fill up to concurrency limit
      while (activePromises.length < concurrency && remainingProblems.length > 0) {
        const problem = remainingProblems.shift();
        
        // Create a promise for this problem with its index
        const promise = (async () => {
          try {
            const result = await this.processProblem(problem);
            return { problem, result, error: null };
          } catch (error) {
            return { problem, result: null, error };
          }
        })();
        
        activePromises.push(promise);
      }
      
      // Wait for first promise to complete
      if (activePromises.length > 0) {
        const result = await Promise.race(activePromises);
        results.push(result);
        
        // Remove completed promise
        activePromises = activePromises.filter(p => p !== result);
        
        // Log progress
        const completed = results.length;
        const total = completed + remainingProblems.length + activePromises.length;
        this.logger.info(`Progress: ${completed}/${total} problems processed`);
      }
    }
    
    // Process results
    let fixed = 0, failed = 0, skipped = 0;
    
    for (const { problem, result, error } of results) {
      if (error) {
        this.logger.error(`Failed to process problem:`, { 
          file: problem.file, 
          message: problem.message,
          error: error.message 
        });
        this.failedProblems.push(problem);
        failed++;
      } else if (result.skipped) {
        this.skippedProblems.push(problem);
        skipped++;
      } else if (result.fixed) {
        this.fixedProblems.push({ ...problem, ...result });
        fixed++;
      } else {
        this.failedProblems.push(problem);
        failed++;
      }
    }
    
    // Execute custom hook if configured
    if (this.config.advanced?.hooks?.afterFix) {
      await this.executeHook('afterFix');
    }
    
    // Update stats
    this.stats.fixedProblems = fixed;
    this.stats.failedProblems = failed;
    this.stats.skippedProblems = skipped;
    
    this.logger.info(`Problem processing complete: ${fixed} fixed, ${failed} failed, ${skipped} skipped`);
    
    return { fixed, failed, skipped };
  }
  
  /**
   * Process a single problem
   */
  async processProblem(problem) {
    this.logger.info(`Processing problem in ${path.relative(this.workspacePath, problem.file)}: ${problem.message}`);
    
    // Check if problem should require approval
    const requiresApproval = this.config.safety.requireApprovalFor && 
      (this.config.safety.requireApprovalFor.includes(problem.category) || 
       this.config.safety.requireApprovalFor.includes(problem.source));
    
    // Skip if always require approval and not in interactive mode
    if (requiresApproval && !this.options.interactive) {
      this.logger.info(`Skipping problem that requires approval in non-interactive mode`);
      return { fixed: false, skipped: true, reason: 'requires_approval' };
    }
    
    try {
      // Select appropriate prompt template
      let promptTemplate;
      if (this.config.promptTemplates[problem.category]) {
        promptTemplate = this.config.promptTemplates[problem.category];
      } else if (this.config.promptTemplates[problem.source]) {
        promptTemplate = this.config.promptTemplates[problem.source];
      } else {
        promptTemplate = this.config.promptTemplates.general;
      }
      
      // Prepare prompt variables
      const promptVars = {
        file_name: problem.file,
        range: `Line ${problem.line}, Column ${problem.column}`,
        severity: problem.severity,
        source: problem.source,
        code: problem.code,
        message: problem.message,
        language: problem.language || this.detectLanguage(problem.file),
        surrounding_code: problem.surroundingCode || 'No code context available',
        related_types: '', // This would be populated in a real implementation
        eslint_config: '', // This would be populated in a real implementation
      };
      
      // Replace variables in prompt template
      let prompt = promptTemplate;
      for (const [key, value] of Object.entries(promptVars)) {
        prompt = prompt.replace(new RegExp(`{${key}}`, 'g'), value);
      }
      
      // Create a unique ID for this fix attempt
      const fixId = uuidv4();
      const fixDir = path.join(this.outputPath, 'fixes', fixId);
      fs.mkdirSync(fixDir, { recursive: true });
      
      // Save the prompt for debugging
      fs.writeFileSync(path.join(fixDir, 'prompt.md'), prompt);
      
      // Send to Claude
      this.logger.debug(`Sending problem to Claude...`);
      const response = await this.anthropic.messages.create({
        model: this.config.claude.model,
        max_tokens: this.config.claude.maxTokens,
        temperature: this.config.claude.temperature,
        system: this.config.claude.systemPrompt,
        messages: [
          { role: 'user', content: prompt }
        ]
      });
      
      // Save the response for debugging
      fs.writeFileSync(path.join(fixDir, 'response.json'), JSON.stringify(response, null, 2));
      
      // Parse the solution from the response
      const solution = this.parseSolution(response.content[0].text);
      fs.writeFileSync(path.join(fixDir, 'parsed_solution.json'), JSON.stringify(solution, null, 2));
      
      if (!solution || !solution.files || solution.files.length === 0) {
        this.logger.warn(`No valid solution found in Claude's response`);
        return { fixed: false, skipped: false, reason: 'no_solution' };
      }
      
      // Ask for approval if needed
      if (this.config.fixes.requireApproval || requiresApproval) {
        if (!this.options.interactive) {
          this.logger.info(`Skipping problem that requires approval in non-interactive mode`);
          return { fixed: false, skipped: true, reason: 'requires_approval' };
        }
        
        const approved = await this.askForApproval(problem, solution);
        if (!approved) {
          this.logger.info(`Solution was rejected by user`);
          return { fixed: false, skipped: true, reason: 'rejected_by_user' };
        }
      }
      
      // In dry run mode, don't apply any changes
      if (this.options.dryRun) {
        this.logger.info(`Dry run mode - not applying changes`);
        return { fixed: false, skipped: true, reason: 'dry_run' };
      }
      
      // Apply the solution
      const result = await this.applySolution(problem, solution);
      
      // Run verification if enabled and solution was applied
      if (result.fixed && this.shouldRunVerification()) {
        const verificationResult = await this.verifyFix(problem, solution);
        
        if (!verificationResult.success) {
          // Roll back changes if verification failed and rollback is enabled
          if (this.config.safety.rollbackOnFailure) {
            await this.rollbackFix(problem, solution);
            this.logger.warn(`Verification failed, changes rolled back: ${verificationResult.reason}`);
            return { fixed: false, skipped: false, reason: `verification_failed: ${verificationResult.reason}` };
          } else {
            this.logger.warn(`Verification failed, but changes kept: ${verificationResult.reason}`);
          }
        }
        
        result.verification = verificationResult;
      }
      
      return result;
    } catch (error) {
      this.logger.error(`Error processing problem:`, error);
      return { fixed: false, skipped: false, error: error.message };
    }
  }
  
  /**
   * Parse the solution from Claude's response
   */
  parseSolution(responseText) {
    try {
      // Detect file sections in the format:
      // FILE: path/to/file.ext
      // ```language
      // code content
      // ```
      const fileRegex = /FILE:\s*([^\n]+)\s*```(?:\w+)?\s*([\s\S]+?)```/g;
      const files = [];
      let match;
      
      while ((match = fileRegex.exec(responseText)) !== null) {
        const filePath = match[1].trim();
        const content = match[2].trim();
        
        files.push({
          path: filePath,
          content
        });
      }
      
      // Extract analysis sections
      const analysisRegex = /Problem Analysis:\s*([\s\S]+?)(?:\n\d+\.\s*Solution|$)/i;
      const analysisMatch = responseText.match(analysisRegex);
      const analysis = analysisMatch ? analysisMatch[1].trim() : '';
      
      const solutionRegex = /Solution Approach:\s*([\s\S]+?)(?:\n\d+\.\s*Code|$)/i;
      const solutionMatch = responseText.match(solutionRegex);
      const approach = solutionMatch ? solutionMatch[1].trim() : '';
      
      return {
        analysis,
        approach,
        files
      };
    } catch (error) {
      this.logger.error(`Error parsing solution:`, error);
      return null;
    }
  }
  
  /**
   * Ask for approval before applying a fix
   */
  async askForApproval(problem, solution) {
    if (!this.options.interactive) {
      return false;
    }
    
    console.log('\n' + chalk.yellow('═'.repeat(80)));
    console.log(chalk.yellow.bold(`Problem in ${path.relative(this.workspacePath, problem.file)}`));
    console.log(chalk.yellow('═'.repeat(80)));
    console.log(chalk.red(`${problem.severity.toUpperCase()}: ${problem.message}`));
    console.log(chalk.gray(`Line ${problem.line}, Column ${problem.column}`));
    console.log();
    
    if (solution.analysis) {
      console.log(chalk.cyan.bold('Analysis:'));
      console.log(solution.analysis);
      console.log();
    }
    
    if (solution.approach) {
      console.log(chalk.cyan.bold('Approach:'));
      console.log(solution.approach);
      console.log();
    }
    
    console.log(chalk.cyan.bold('Proposed Changes:'));
    for (const file of solution.files) {
      console.log(chalk.green(`File: ${file.path}`));
      console.log(chalk.gray('```'));
      // Only show first few lines if content is too long
      const previewLines = file.content.split('\n').slice(0, 20);
      if (previewLines.length < file.content.split('\n').length) {
        console.log(previewLines.join('\n') + '\n' + chalk.gray('... (truncated)'));
      } else {
        console.log(file.content);
      }
      console.log(chalk.gray('```'));
      console.log();
    }
    
    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'Do you want to apply this fix?',
        choices: [
          { name: 'Yes, apply the fix', value: 'yes' },
          { name: 'No, skip this problem', value: 'no' },
          { name: 'View full file diff', value: 'diff' }
        ]
      }
    ]);
    
    if (answer.action === 'diff') {
      // Show detailed diff for each file
      for (const file of solution.files) {
        const fullPath = path.isAbsolute(file.path) ? file.path : path.join(this.workspacePath, file.path);
        
        try {
          if (fs.existsSync(fullPath)) {
            const originalContent = fs.readFileSync(fullPath, 'utf8');
            
            // Create temp files for diff
            const originalFile = temp.path({ suffix: '.original' + path.extname(fullPath) });
            const newFile = temp.path({ suffix: '.new' + path.extname(fullPath) });
            
            fs.writeFileSync(originalFile, originalContent);
            fs.writeFileSync(newFile, file.content);
            
            // Show diff
            console.log(chalk.yellow(`Diff for ${fullPath}:`));
            try {
              const diffOutput = execSync(`diff -u ${originalFile} ${newFile}`, { encoding: 'utf8' });
              console.log(diffOutput);
            } catch (diffError) {
              // diff returns non-zero exit code when files differ, which is expected
              console.log(diffError.stdout);
            }
          } else {
            console.log(chalk.yellow(`New file: ${fullPath}`));
            console.log(file.content);
          }
        } catch (error) {
          console.error(`Error showing diff: ${error.message}`);
        }
      }
      
      // Ask again after showing diff
      const finalAnswer = await inquirer.prompt([
        {
          type: 'list',
          name: 'action',
          message: 'Do you want to apply this fix?',
          choices: [
            { name: 'Yes, apply the fix', value: 'yes' },
            { name: 'No, skip this problem', value: 'no' }
          ]
        }
      ]);
      
      return finalAnswer.action === 'yes';
    }
    
    return answer.action === 'yes';
  }
  
  /**
   * Apply the solution to fix the problem
   */
  async applySolution(problem, solution) {
    this.logger.info(`Applying solution for problem in ${path.relative(this.workspacePath, problem.file)}`);
    
    try {
      // Create backups if enabled
      if (this.config.safety.createBackups) {
        await this.createBackups(solution.files);
      }
      
      // Apply each file change
      const changedFiles = [];
      
      for (const file of solution.files) {
        const fullPath = path.isAbsolute(file.path) ? file.path : path.join(this.workspacePath, file.path);
        const relPath = path.relative(this.workspacePath, fullPath);
        
        // Ensure directory exists
        const dirPath = path.dirname(fullPath);
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
        }
        
        // Write file content
        fs.writeFileSync(fullPath, file.content);
        this.logger.debug(`Updated file: ${relPath}`);
        
        changedFiles.push(relPath);
      }
      
      this.logger.info(`Solution applied successfully, modified ${changedFiles.length} files`);
      
      // Commit changes if Git is enabled and autoCommit is true
      if (this.config.versionControl.git.enabled && 
          this.config.fixes.autoCommit &&
          !this.options.dryRun) {
        await this.commitChanges(problem, changedFiles);
      }
      
      return { 
        fixed: true, 
        skipped: false, 
        changedFiles,
        solution
      };
    } catch (error) {
      this.logger.error(`Error applying solution:`, error);
      return { fixed: false, skipped: false, error: error.message };
    }
  }
  
  /**
   * Create backups of files before modifying them
   */
  async createBackups(files) {
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const backupDir = path.join(this.backupPath, timestamp);
    
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    for (const file of files) {
      const fullPath = path.isAbsolute(file.path) ? file.path : path.join(this.workspacePath, file.path);
      
      if (fs.existsSync(fullPath)) {
        const relPath = path.relative(this.workspacePath, fullPath);
        const backupPath = path.join(backupDir, relPath);
        
        // Ensure backup directory exists
        const backupFileDir = path.dirname(backupPath);
        if (!fs.existsSync(backupFileDir)) {
          fs.mkdirSync(backupFileDir, { recursive: true });
        }
        
        // Copy file to backup location
        fs.copyFileSync(fullPath, backupPath);
        this.logger.debug(`Created backup of ${relPath} at ${backupPath}`);
      }
    }
    
    return backupDir;
  }
  
  /**
   * Commit changes to Git
   */
  async commitChanges(problem, changedFiles) {
    try {
      if (!this.git) {
        this.logger.warn('Git not initialized, skipping commit');
        return false;
      }
      
      // Stage changed files
      for (const file of changedFiles) {
        await this.git.add(file);
      }
      
      // Generate commit message
      let commitMessage = this.config.versionControl.git.commitMessageTemplate || 'fix({category}): {message}';
      commitMessage = commitMessage
        .replace('{category}', problem.category || problem.source || 'code')
        .replace('{message}', problem.message);
      
      // Commit changes
      await this.git.commit(commitMessage);
      this.logger.info(`Committed changes with message: ${commitMessage}`);
      
      // Push to remote if configured
      if (this.config.versionControl.git.pushToRemote) {
        const currentBranch = (await this.git.branchLocal()).current;
        await this.git.push('origin', currentBranch);
        this.logger.info(`Pushed changes to remote: origin/${currentBranch}`);
      }
      
      return true;
    } catch (error) {
      this.logger.error(`Error committing changes:`, error);
      return false;
    }
  }
  
  /**
   * Check if verification should be run
   */
  shouldRunVerification() {
    const verificationConfig = this.config.verification;
    
    return (
      verificationConfig.runTests || 
      verificationConfig.runLinters || 
      verificationConfig.runBuild || 
      (verificationConfig.custom && verificationConfig.custom.length > 0)
    );
  }
  
  /**
   * Verify that the fix didn't break anything
   */
  async verifyFix(problem, solution) {
    this.logger.info(`Verifying fix for problem in ${path.relative(this.workspacePath, problem.file)}`);
    
    try {
      // Execute custom hook if configured
      if (this.config.advanced?.hooks?.beforeVerification) {
        await this.executeHook('beforeVerification');
      }
      
      const verificationConfig = this.config.verification;
      const results = {
        tests: null,
        linters: null,
        build: null,
        custom: []
      };
      
      // Run build
      if (verificationConfig.runBuild) {
        this.logger.info('Running build verification...');
        results.build = await this.runCommand(
          verificationConfig.buildCommand || 'npm run build',
          verificationConfig.timeoutSeconds * 1000
        );
        
        if (!results.build.success) {
          this.logger.warn(`Build verification failed: ${results.build.error}`);
          this.stats.verificationFails++;
          return { 
            success: false, 
            reason: 'build_failed', 
            results 
          };
        }
      }
      
      // Run linters
      if (verificationConfig.runLinters) {
        this.logger.info('Running linter verification...');
        results.linters = await this.runCommand(
          verificationConfig.lintCommand || 'npm run lint',
          verificationConfig.timeoutSeconds * 1000
        );
        
        if (!results.linters.success) {
          this.logger.warn(`Linter verification failed: ${results.linters.error}`);
          this.stats.verificationFails++;
          return { 
            success: false, 
            reason: 'linting_failed', 
            results 
          };
        }
      }
      
      // Run tests
      if (verificationConfig.runTests) {
        this.logger.info('Running test verification...');
        results.tests = await this.runCommand(
          verificationConfig.testCommand || 'npm test',
          verificationConfig.timeoutSeconds * 1000
        );
        
        if (!results.tests.success) {
          this.logger.warn(`Test verification failed: ${results.tests.error}`);
          this.stats.verificationFails++;
          return { 
            success: false, 
            reason: 'tests_failed', 
            results 
          };
        }
      }
      
      // Run custom verification steps
      if (verificationConfig.custom && verificationConfig.custom.length > 0) {
        for (const step of verificationConfig.custom) {
          this.logger.info(`Running custom verification step: ${step.name}`);
          const result = await this.runCommand(
            step.command,
            verificationConfig.timeoutSeconds * 1000
          );
          
          results.custom.push({
            name: step.name,
            ...result
          });
          
          if (!result.success && step.failOnError !== false) {
            this.logger.warn(`Custom verification step '${step.name}' failed: ${result.error}`);
            this.stats.verificationFails++;
            return { 
              success: false, 
              reason: `custom_verification_failed: ${step.name}`, 
              results 
            };
          }
        }
      }
      
      // Execute custom hook if configured
      if (this.config.advanced?.hooks?.afterVerification) {
        await this.executeHook('afterVerification');
      }
      
      this.logger.info('Verification passed successfully');
      this.stats.verificationPasses++;
      
      return { 
        success: true, 
        results 
      };
    } catch (error) {
      this.logger.error(`Error during verification:`, error);
      this.stats.verificationFails++;
      return { 
        success: false, 
        reason: 'verification_error', 
        error: error.message 
      };
    }
  }
  
  /**
   * Roll back changes if verification fails
   */
  async rollbackFix(problem, solution) {
    this.logger.info(`Rolling back changes for problem in ${path.relative(this.workspacePath, problem.file)}`);
    
    try {
      if (this.config.versionControl.git.enabled) {
        // Use Git to revert changes
        await this.git.reset(['--hard', 'HEAD~1']);
        this.logger.info('Changes rolled back using Git');
        return true;
      } else if (this.config.safety.createBackups) {
        // Restore from backups
        const timestamp = new Date().toISOString().replace(/:/g, '-');
        const backupDirs = fs.readdirSync(this.backupPath)
          .filter(dir => fs.statSync(path.join(this.backupPath, dir)).isDirectory())
          .sort((a, b) => b.localeCompare(a)); // Sort in reverse chronological order
        
        if (backupDirs.length === 0) {
          this.logger.warn('No backups found for rollback');
          return false;
        }
        
        const latestBackupDir = path.join(this.backupPath, backupDirs[0]);
        
        for (const file of solution.files) {
          const fullPath = path.isAbsolute(file.path) ? file.path : path.join(this.workspacePath, file.path);
          const relPath = path.relative(this.workspacePath, fullPath);
          const backupPath = path.join(latestBackupDir, relPath);
          
          if (fs.existsSync(backupPath)) {
            // Restore file from backup
            fs.copyFileSync(backupPath, fullPath);
            this.logger.debug(`Restored ${relPath} from backup`);
          } else {
            // If it was a new file, remove it
            if (fs.existsSync(fullPath)) {
              fs.unlinkSync(fullPath);
              this.logger.debug(`Removed new file ${relPath}`);
            }
          }
        }
        
        this.logger.info('Changes rolled back from backups');
        return true;
      } else {
        this.logger.warn('No rollback mechanism available (Git disabled and no backups)');
        return false;
      }
    } catch (error) {
      this.logger.error(`Error rolling back changes:`, error);
      return false;
    }
  }
  
  /**
   * Run a command and return the result
   */
  async runCommand(command, timeout = 120000) {
    return new Promise((resolve) => {
      const subprocess = spawn(command, {
        shell: true,
        cwd: this.workspacePath,
        env: { ...process.env, FORCE_COLOR: 'true' }
      });
      
      let stdout = '';
      let stderr = '';
      let timedOut = false;
      
      subprocess.stdout.on('data', (data) => {
        stdout += data.toString();
      });
      
      subprocess.stderr.on('data', (data) => {
        stderr += data.toString();
      });
      
      // Set timeout
      const timeoutId = setTimeout(() => {
        timedOut = true;
        subprocess.kill('SIGTERM');
      }, timeout);
      
      subprocess.on('close', (code) => {
        clearTimeout(timeoutId);
        
        if (timedOut) {
          resolve({
            success: false,
            code: null,
            stdout,
            stderr,
            error: 'Command timed out'
          });
        } else {
          resolve({
            success: code === 0,
            code,
            stdout,
            stderr,
            error: code !== 0 ? `Command exited with code ${code}` : null
          });
        }
      });
      
      subprocess.on('error', (error) => {
        clearTimeout(timeoutId);
        resolve({
          success: false,
          code: null,
          stdout,
          stderr,
          error: error.message
        });
      });
    });
  }
  
  /**
   * Generate a report of the resolver's activity
   */
  async generateReport() {
    if (!this.config.reporting?.enabled) {
      return null;
    }
    
    this.logger.info('Generating report...');
    
    try {
      const reportFormat = this.config.reporting.format || 'markdown';
      const reportDir = path.join(this.outputPath, 'reports');
      
      if (!fs.existsSync(reportDir)) {
        fs.mkdirSync(reportDir, { recursive: true });
      }
      
      // Update stats
      this.stats.endTime = Date.now();
      this.stats.elapsedTime = this.stats.endTime - this.stats.startTime;
      
      let reportContent = '';
      
      if (reportFormat === 'markdown') {
        reportContent = this.generateMarkdownReport();
      } else if (reportFormat === 'json') {
        reportContent = JSON.stringify(this.generateJsonReport(), null, 2);
      } else if (reportFormat === 'html') {
        reportContent = this.generateHtmlReport();
      } else {
        reportContent = this.generateMarkdownReport();
      }
      
      const timestamp = new Date().toISOString().replace(/:/g, '-');
      const reportFilename = `claude-resolver-report-${timestamp}.${reportFormat === 'json' ? 'json' : reportFormat === 'html' ? 'html' : 'md'}`;
      const reportPath = path.join(reportDir, reportFilename);
      
      fs.writeFileSync(reportPath, reportContent);
      
      this.logger.info(`Report generated at ${reportPath}`);
      
      // Also generate a JSON report for CI if needed
      if (this.config.ci.enabled && this.config.ci.reportPath) {
        const ciReportPath = path.join(this.workspacePath, this.config.ci.reportPath);
        fs.writeFileSync(ciReportPath, JSON.stringify(this.generateJsonReport(), null, 2));
        this.logger.info(`CI report generated at ${ciReportPath}`);
      }
      
      return reportPath;
    } catch (error) {
      this.logger.error(`Error generating report:`, error);
      return null;
    }
  }
  
  /**
   * Generate a markdown report
   */
  generateMarkdownReport() {
    const elapsedTimeStr = this.formatElapsedTime(this.stats.elapsedTime);
    const timestamp = new Date().toISOString();
    
    let report = `# Claude Code VSCode Problem Resolver Report\n\n`;
    report += `Generated on: ${timestamp}\n\n`;
    report += `## Summary\n\n`;
    report += `- **Total problems found:** ${this.stats.totalProblems}\n`;
    report += `- **Fixed:** ${this.stats.fixedProblems}\n`;
    report += `- **Failed:** ${this.stats.failedProblems}\n`;
    report += `- **Skipped:** ${this.stats.skippedProblems}\n`;
    report += `- **Verification passes:** ${this.stats.verificationPasses}\n`;
    report += `- **Verification failures:** ${this.stats.verificationFails}\n`;
    report += `- **Elapsed time:** ${elapsedTimeStr}\n\n`;

    if (this.fixedProblems.length > 0) {
      report += `## Fixed Problems\n\n`;
      
      for (const problem of this.fixedProblems) {
        const relPath = path.relative(this.workspacePath, problem.file);
        
        report += `### ${problem.source || 'Problem'}: ${problem.message}\n\n`;
        report += `- **File:** \`${relPath}\`\n`;
        report += `- **Location:** Line ${problem.line}, Column ${problem.column}\n`;
        report += `- **Severity:** ${problem.severity}\n`;
        if (problem.code) {
          report += `- **Code:** ${problem.code}\n`;
        }
        report += `\n`;
        
        if (problem.solution) {
          if (problem.solution.analysis) {
            report += `#### Analysis\n\n${problem.solution.analysis}\n\n`;
          }
          
          if (problem.solution.approach) {
            report += `#### Solution Approach\n\n${problem.solution.approach}\n\n`;
          }
          
          if (problem.solution.files && problem.solution.files.length > 0) {
            report += `#### Changed Files\n\n`;
            
            for (const file of problem.solution.files) {
              const fileRelPath = path.isAbsolute(file.path) 
                ? path.relative(this.workspacePath, file.path) 
                : file.path;
              
              report += `- \`${fileRelPath}\`\n`;
            }
            report += `\n`;
          }
        }
        
        if (problem.verification) {
          report += `#### Verification\n\n`;
          report += `- **Result:** ${problem.verification.success ? '✅ Passed' : '❌ Failed'}\n`;
          
          if (!problem.verification.success && problem.verification.reason) {
            report += `- **Reason:** ${problem.verification.reason}\n`;
          }
          
          report += `\n`;
        }
      }
    }

    if (this.failedProblems.length > 0) {
      report += `## Failed Problems\n\n`;
      
      for (const problem of this.failedProblems) {
        const relPath = path.relative(this.workspacePath, problem.file);
        
        report += `### ${problem.source || 'Problem'}: ${problem.message}\n\n`;
        report += `- **File:** \`${relPath}\`\n`;
        report += `- **Location:** Line ${problem.line}, Column ${problem.column}\n`;
        report += `- **Severity:** ${problem.severity}\n`;
        if (problem.code) {
          report += `- **Code:** ${problem.code}\n`;
        }
        report += `\n`;
      }
    }
    
    if (this.skippedProblems.length > 0 && this.config.reporting.includeUnfixedProblems) {
      report += `## Skipped Problems\n\n`;
      
      for (const problem of this.skippedProblems) {
        const relPath = path.relative(this.workspacePath, problem.file);
        
        report += `### ${problem.source || 'Problem'}: ${problem.message}\n\n`;
        report += `- **File:** \`${relPath}\`\n`;
        report += `- **Location:** Line ${problem.line}, Column ${problem.column}\n`;
        report += `- **Severity:** ${problem.severity}\n`;
        if (problem.code) {
          report += `- **Code:** ${problem.code}\n`;
        }
        report += `\n`;
      }
    }
    
    return report;
  }
  
  /**
   * Generate a JSON report
   */
  generateJsonReport() {
    return {
      timestamp: new Date().toISOString(),
      stats: this.stats,
      fixedProblems: this.fixedProblems.map(problem => ({
        ...problem,
        file: path.relative(this.workspacePath, problem.file),
        fileContent: undefined,  // Remove large content fields
        surroundingCode: undefined
      })),
      failedProblems: this.failedProblems.map(problem => ({
        ...problem,
        file: path.relative(this.workspacePath, problem.file),
        fileContent: undefined,
        surroundingCode: undefined
      })),
      skippedProblems: this.config.reporting.includeUnfixedProblems 
        ? this.skippedProblems.map(problem => ({
            ...problem,
            file: path.relative(this.workspacePath, problem.file),
            fileContent: undefined,
            surroundingCode: undefined
          }))
        : [],
      config: {
        // Include only non-sensitive configuration
        categories: this.config.categories,
        files: this.config.files,
        fixes: this.config.fixes,
        verification: this.config.verification,
        versionControl: {
          git: {
            ...this.config.versionControl.git,
            apiToken: undefined  // Remove sensitive data
          }
        },
        ci: this.config.ci,
        logging: this.config.logging,
        reporting: this.config.reporting,
        safety: this.config.safety
      }
    };
  }
  
  /**
   * Generate an HTML report
   */
  generateHtmlReport() {
    // Basic HTML report - in a real implementation this would be more sophisticated
    const jsonReport = this.generateJsonReport();
    const elapsedTimeStr = this.formatElapsedTime(this.stats.elapsedTime);
    
    let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Claude Code VSCode Problem Resolver Report</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; line-height: 1.6; color: #333; max-width: 1200px; margin: 0 auto; padding: 20px; }
        h1 { color: #2c3e50; }
        h2 { color: #3498db; margin-top: 30px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
        h3 { color: #2c3e50; margin-top: 25px; }
        h4 { color: #7f8c8d; margin-top: 20px; }
        pre { background-color: #f8f8f8; padding: 10px; border-radius: 5px; overflow-x: auto; }
        .success { color: #27ae60; }
        .failure { color: #e74c3c; }
        .warning { color: #f39c12; }
        .summary { background-color: #f8f8f8; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
        .file-path { font-family: monospace; background-color: #f8f8f8; padding: 3px 6px; border-radius: 3px; }
        table { border-collapse: collapse; width: 100%; margin: 20px 0; }
        th, td { text-align: left; padding: 12px; border-bottom: 1px solid #ddd; }
        th { background-color: #f2f2f2; }
        tr:hover { background-color: #f5f5f5; }
      </style>
    </head>
    <body>
      <h1>Claude Code VSCode Problem Resolver Report</h1>
      <p>Generated on: ${new Date().toLocaleString()}</p>
      
      <div class="summary">
        <h2>Summary</h2>
        <table>
          <tr><th>Total problems found</th><td>${this.stats.totalProblems}</td></tr>
          <tr><th>Fixed</th><td class="success">${this.stats.fixedProblems}</td></tr>
          <tr><th>Failed</th><td class="failure">${this.stats.failedProblems}</td></tr>
          <tr><th>Skipped</th><td class="warning">${this.stats.skippedProblems}</td></tr>
          <tr><th>Verification passes</th><td>${this.stats.verificationPasses}</td></tr>
          <tr><th>Verification failures</th><td>${this.stats.verificationFails}</td></tr>
          <tr><th>Elapsed time</th><td>${elapsedTimeStr}</td></tr>
        </table>
      </div>
    `;
    
    if (this.fixedProblems.length > 0) {
      html += `<h2>Fixed Problems</h2>`;
      
      for (const problem of this.fixedProblems) {
        const relPath = path.relative(this.workspacePath, problem.file);
        
        html += `
        <div>
          <h3>${problem.source || 'Problem'}: ${this.escapeHtml(problem.message)}</h3>
          <p><strong>File:</strong> <span class="file-path">${relPath}</span></p>
          <p><strong>Location:</strong> Line ${problem.line}, Column ${problem.column}</p>
          <p><strong>Severity:</strong> ${problem.severity}</p>
          ${problem.code ? `<p><strong>Code:</strong> ${problem.code}</p>` : ''}
        `;
        
        if (problem.solution) {
          if (problem.solution.analysis) {
            html += `
            <h4>Analysis</h4>
            <pre>${this.escapeHtml(problem.solution.analysis)}</pre>
            `;
          }
          
          if (problem.solution.approach) {
            html += `
            <h4>Solution Approach</h4>
            <pre>${this.escapeHtml(problem.solution.approach)}</pre>
            `;
          }
          
          if (problem.solution.files && problem.solution.files.length > 0) {
            html += `
            <h4>Changed Files</h4>
            <ul>
            `;
            
            for (const file of problem.solution.files) {
              const fileRelPath = path.isAbsolute(file.path) 
                ? path.relative(this.workspacePath, file.path) 
                : file.path;
              
              html += `<li><span class="file-path">${fileRelPath}</span></li>`;
            }
            
            html += `</ul>`;
          }
        }
        
        if (problem.verification) {
          html += `
          <h4>Verification</h4>
          <p><strong>Result:</strong> ${problem.verification.success 
            ? '<span class="success">✅ Passed</span>' 
            : '<span class="failure">❌ Failed</span>'}</p>
          `;
          
          if (!problem.verification.success && problem.verification.reason) {
            html += `<p><strong>Reason:</strong> ${this.escapeHtml(problem.verification.reason)}</p>`;
          }
        }
        
        html += `</div>`;
      }
    }
    
    if (this.failedProblems.length > 0) {
      html += `<h2>Failed Problems</h2>`;
      
      for (const problem of this.failedProblems) {
        const relPath = path.relative(this.workspacePath, problem.file);
        
        html += `
        <div>
          <h3>${problem.source || 'Problem'}: ${this.escapeHtml(problem.message)}</h3>
          <p><strong>File:</strong> <span class="file-path">${relPath}</span></p>
          <p><strong>Location:</strong> Line ${problem.line}, Column ${problem.column}</p>
          <p><strong>Severity:</strong> ${problem.severity}</p>
          ${problem.code ? `<p><strong>Code:</strong> ${problem.code}</p>` : ''}
        </div>
        `;
      }
    }
    
    if (this.skippedProblems.length > 0 && this.config.reporting.includeUnfixedProblems) {
      html += `<h2>Skipped Problems</h2>`;
      
      for (const problem of this.skippedProblems) {
        const relPath = path.relative(this.workspacePath, problem.file);
        
        html += `
        <div>
          <h3>${problem.source || 'Problem'}: ${this.escapeHtml(problem.message)}</h3>
          <p><strong>File:</strong> <span class="file-path">${relPath}</span></p>
          <p><strong>Location:</strong> Line ${problem.line}, Column ${problem.column}</p>
          <p><strong>Severity:</strong> ${problem.severity}</p>
          ${problem.code ? `<p><strong>Code:</strong> ${problem.code}</p>` : ''}
        </div>
        `;
      }
    }
    
    html += `
    </body>
    </html>
    `;
    
    return html;
  }
  
  /**
   * Execute a custom hook
   */
  async executeHook(hookName) {
    const hookPath = this.config.advanced?.hooks?.[hookName];
    
    if (!hookPath) {
      return null;
    }
    
    try {
      const fullPath = path.resolve(this.workspacePath, hookPath);
      
      if (!fs.existsSync(fullPath)) {
        this.logger.warn(`Hook script not found: ${fullPath}`);
        return null;
      }
      
      this.logger.info(`Executing hook: ${hookName}`);
      
      // Execute the hook script
      const result = await this.runCommand(`node ${fullPath}`, 60000);
      
      if (!result.success) {
        this.logger.warn(`Hook execution failed: ${result.error}`);
      } else {
        this.logger.debug(`Hook executed successfully`);
      }
      
      return result;
    } catch (error) {
      this.logger.error(`Error executing hook ${hookName}:`, error);
      return null;
    }
  }
  
  /**
   * Format elapsed time in a human-readable way
   */
  formatElapsedTime(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }
  
  /**
   * Detect language from file extension
   */
  detectLanguage(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    
    const languageMap = {
      '.js': 'javascript',
      '.jsx': 'javascript',
      '.ts': 'typescript',
      '.tsx': 'typescript',
      '.py': 'python',
      '.rb': 'ruby',
      '.java': 'java',
      '.c': 'c',
      '.cpp': 'cpp',
      '.cs': 'csharp',
      '.php': 'php',
      '.go': 'go',
      '.rs': 'rust',
      '.swift': 'swift',
      '.kt': 'kotlin',
      '.html': 'html',
      '.css': 'css',
      '.scss': 'scss',
      '.json': 'json',
      '.md': 'markdown',
      '.yml': 'yaml',
      '.yaml': 'yaml',
      '.xml': 'xml',
      '.sh': 'bash',
      '.bat': 'batch',
      '.ps1': 'powershell'
    };
    
    return languageMap[ext] || 'plaintext';
  }
  
  /**
   * Escape HTML special characters
   */
  escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
  
  /**
   * Main execution method
   */
  async run() {
    try {
      // Initialize the resolver
      await this.initialize();
      
      // Collect problems
      await this.collectProblems();
      
      if (this.problems.length === 0) {
        this.logger.info('No problems to fix');
        return {
          success: true,
          stats: this.stats
        };
      }
      
      // Process problems
      const processResult = await this.processProblems();
      
      // Generate report
      const reportPath = await this.generateReport();
      
      // Calculate exit code for CI mode
      let exitCode = 0;
      if (this.config.ci.enabled && processResult.failed > 0) {
        exitCode = this.config.ci.exitCodeOnFailure || 1;
      }
      
      this.stats.endTime = Date.now();
      this.stats.elapsedTime = this.stats.endTime - this.stats.startTime;
      
      const result = {
        success: processResult.failed === 0,
        stats: this.stats,
        exitCode,
        reportPath
      };
      
      // Print final summary to console
      this.printSummary();
      
      return result;
    } catch (error) {
      this.logger?.error('Error running resolver:', error);
      console.error(chalk.red(`Error: ${error.message}`));
      
      return {
        success: false,
        error: error.message,
        exitCode: 1
      };
    }
  }
  
  /**
   * Print a summary of the results
   */
  printSummary() {
    console.log('\n' + chalk.yellow('═'.repeat(80)));
    console.log(chalk.yellow.bold('Claude Code VSCode Problem Resolver - Summary'));
    console.log(chalk.yellow('═'.repeat(80)));
    
    const elapsedTimeStr = this.formatElapsedTime(this.stats.elapsedTime);
    
    console.log(`Total problems found: ${chalk.bold(this.stats.totalProblems)}`);
    console.log(`Fixed: ${chalk.bold.green(this.stats.fixedProblems)}`);
    console.log(`Failed: ${chalk.bold.red(this.stats.failedProblems)}`);
    console.log(`Skipped: ${chalk.bold.yellow(this.stats.skippedProblems)}`);
    console.log(`Verification passes: ${chalk.bold.green(this.stats.verificationPasses)}`);
    console.log(`Verification failures: ${chalk.bold.red(this.stats.verificationFails)}`);
    console.log(`Elapsed time: ${chalk.bold(elapsedTimeStr)}`);
    
    if (this.stats.fixedProblems > 0) {
      console.log('\n' + chalk.green.bold('Fixed Problems:'));
      for (const problem of this.fixedProblems) {
        const relPath = path.relative(this.workspacePath, problem.file);
        console.log(`- ${chalk.green('✓')} ${relPath}: ${problem.message}`);
      }
    }
    
    if (this.stats.failedProblems > 0) {
      console.log('\n' + chalk.red.bold('Failed Problems:'));
      for (const problem of this.failedProblems) {
        const relPath = path.relative(this.workspacePath, problem.file);
        console.log(`- ${chalk.red('✗')} ${relPath}: ${problem.message}`);
      }
    }
    
    console.log('\n' + chalk.yellow('═'.repeat(80)));
  }
}

// Main execution
(async () => {
  try {
    const resolver = new ClaudeResolver(options);
    const result = await resolver.run();
    
    if (options.ci) {
      process.exit(result.exitCode);
    }
  } catch (error) {
    console.error(chalk.red(`Unhandled error: ${error.message}`));
    if (options.ci) {
      process.exit(1);
    }
  }
})();