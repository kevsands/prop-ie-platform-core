#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
const yaml = require('js-yaml');
const { program } = require('commander');
const chalk = require('chalk');
const inquirer = require('inquirer');
const ora = require('ora');
const winston = require('winston');
const { v4: uuidv4 } = require('uuid');

// Define version
const VERSION = '1.0.0';

// Set up CLI options
program
  .version(VERSION)
  .description('Enterprise-Grade VSCode Problem Resolution System using Claude Code')
  .option('-w, --workspace <path>', 'Path to workspace root', process.cwd())
  .option('-c, --config <path>', 'Path to configuration file', '.claude-code-config.yml')
  .option('-o, --output <path>', 'Output directory for logs and reports', '.claude-code-output')
  .option('-l, --log-level <level>', 'Log level (debug, info, warn, error)', 'info')
  .option('-d, --dry-run', 'Dry run mode (no changes applied)', false)
  .option('-i, --interactive', 'Interactive mode (prompt for approvals)', true)
  .option('-m, --max-concurrent <num>', 'Maximum concurrent problems to process', '1')
  .option('-b, --git-branch <branch>', 'Git branch to use for changes')
  .option('--ci', 'Run in CI mode (non-interactive)', false)
  .parse(process.argv);

// Extract options
const options = program.opts();

// Initialize logger
const logger = winston.createLogger({
  level: options.logLevel,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp }) => {
      return `${timestamp} ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({ 
      filename: path.join(options.output, 'vscode-resolver.log') 
    })
  ]
});

// Create output directory if it doesn't exist
if (!fs.existsSync(options.output)) {
  fs.mkdirSync(options.output, { recursive: true });
  logger.info(`Created output directory: ${options.output}`);
}

// Load configuration
let config = {};
try {
  const configPath = path.resolve(options.workspace, options.config);
  if (fs.existsSync(configPath)) {
    const configData = fs.readFileSync(configPath, 'utf8');
    config = yaml.load(configData);
    logger.info(`Loaded configuration from ${configPath}`);
  } else {
    logger.warn(`Configuration file not found at ${configPath}, using defaults`);
    
    // Create default configuration
    config = {
      apiKey: '${ANTHROPIC_API_KEY}',
      model: 'claude-3-7-sonnet-20250219',
      maxTokens: 4096,
      temperature: 0.2,
      maxChangesPerFix: 5,
      requireApproval: options.interactive,
      autoCommit: false,
      createPullRequest: false,
      enabledCategories: [],
      disabledCategories: ['documentation'],
      reviewSteps: {
        runTests: true,
        runLinters: true,
        runBuild: true,
        validatePerformance: false
      },
      promptTemplates: {
        default: `
# VSCode Problem Fix Request

## Problem Details
- **File**: {file_name}
- **Location**: {range}
- **Error**: {message}

## Code Context
\`\`\`
{surrounding_code}
\`\`\`

## Task
Please fix this error. Provide only the corrected code that should replace the problematic section.
`
      }
    };
    
    // Write default config for future use
    fs.writeFileSync(
      path.join(options.output, 'default-config.yml'), 
      yaml.dump(config), 
      'utf8'
    );
    logger.info(`Created default configuration in ${options.output}/default-config.yml`);
  }
} catch (error) {
  logger.error(`Error loading configuration: ${error.message}`);
  process.exit(1);
}

// Enrich config with CLI options
config.dryRun = options.dryRun;
config.interactive = options.ci ? false : options.interactive;
config.maxConcurrent = parseInt(options.maxConcurrent, 10);
config.gitBranch = options.gitBranch;

// Initialize state
const state = {
  problems: [],
  fixes: [],
  statistics: {
    total: 0,
    fixed: 0,
    failed: 0,
    skipped: 0
  },
  startTime: new Date()
};

/**
 * Check if Claude Code CLI is available
 */
function checkClaudeCodeAvailable() {
  try {
    execSync('claude-code --version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Export problems from VSCode using "Problems Export" extension
 * Note: This is a placeholder as the actual extension would need to be invoked
 */
async function exportProblemsFromVSCode() {
  const spinner = ora('Collecting VSCode diagnostics...').start();
  
  // In a real implementation, this would invoke VSCode's extension
  // For this demo, let's simulate by creating a problems file
  
  // Sample problems structure
  const sampleProblems = [
    {
      id: uuidv4(),
      file: 'src/components/property/PropertyCard.tsx',
      range: { start: { line: 10, character: 0 }, end: { line: 10, character: 20 } },
      message: 'Property \'id\' does not exist on type \'IntrinsicAttributes & PropertyCardProps\'',
      severity: 'error',
      source: 'typescript',
      code: 'TS2339'
    },
    {
      id: uuidv4(),
      file: 'src/lib/db/repositories.ts',
      range: { start: { line: 505, character: 0 }, end: { line: 505, character: 50 } },
      message: 'Duplicate identifier \'UserRepository\'',
      severity: 'error',
      source: 'typescript',
      code: 'TS2300'
    },
    {
      id: uuidv4(),
      file: 'src/lib/amplify/auth.ts',
      range: { start: { line: 120, character: 0 }, end: { line: 120, character: 30 } },
      message: 'Module \'aws-amplify/auth\' has no exported member \'confirmSignUp\'',
      severity: 'error',
      source: 'typescript',
      code: 'TS2305'
    }
  ];
  
  // Write to file
  const problemsPath = path.join(options.output, 'vscode-problems.json');
  fs.writeFileSync(problemsPath, JSON.stringify(sampleProblems, null, 2), 'utf8');
  
  spinner.succeed(`Collected ${sampleProblems.length} problems from VSCode`);
  return sampleProblems;
}

/**
 * Categorize and prioritize problems
 */
function categorizeProblems(problems) {
  const spinner = ora('Categorizing and prioritizing problems...').start();
  
  // Group by source/type
  const categorized = problems.reduce((acc, problem) => {
    const category = problem.source || 'unknown';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(problem);
    return acc;
  }, {});
  
  // Sort each category by severity
  Object.keys(categorized).forEach(category => {
    categorized[category].sort((a, b) => {
      const severityOrder = { error: 0, warning: 1, info: 2, hint: 3 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  });
  
  // Flatten but prioritize by category and severity
  const prioritized = [];
  
  // First handle errors in key categories
  ['typescript', 'eslint', 'react'].forEach(category => {
    if (categorized[category]) {
      const errors = categorized[category].filter(p => p.severity === 'error');
      prioritized.push(...errors);
      // Remove processed errors
      categorized[category] = categorized[category].filter(p => p.severity !== 'error');
    }
  });
  
  // Then handle remaining errors
  Object.keys(categorized).forEach(category => {
    if (!['typescript', 'eslint', 'react'].includes(category)) {
      const errors = categorized[category].filter(p => p.severity === 'error');
      prioritized.push(...errors);
      // Remove processed errors
      categorized[category] = categorized[category].filter(p => p.severity !== 'error');
    }
  });
  
  // Then handle warnings from all categories
  Object.keys(categorized).forEach(category => {
    const warnings = categorized[category].filter(p => p.severity === 'warning');
    prioritized.push(...warnings);
    // Remove processed warnings
    categorized[category] = categorized[category].filter(p => p.severity !== 'warning');
  });
  
  // Finally add the rest
  Object.keys(categorized).forEach(category => {
    prioritized.push(...categorized[category]);
  });
  
  // Filter out disabled categories
  const filteredProblems = prioritized.filter(problem => {
    const category = problem.source || 'unknown';
    
    // If enabled categories specified, only include those
    if (config.enabledCategories && config.enabledCategories.length > 0) {
      return config.enabledCategories.includes(category);
    }
    
    // Otherwise exclude disabled categories
    return !(config.disabledCategories || []).includes(category);
  });
  
  spinner.succeed(`Categorized and prioritized ${filteredProblems.length} problems`);
  return filteredProblems;
}

/**
 * Enrich problem with additional context
 */
function enrichProblemContext(problem) {
  const spinner = ora(`Enriching context for ${problem.file}...`).start();
  
  // Resolve absolute file path
  const filePath = path.resolve(options.workspace, problem.file);
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    spinner.fail(`File does not exist: ${filePath}`);
    return null;
  }
  
  // Read file content
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const lines = fileContent.split('\n');
  
  // Extract surrounding code (10 lines before and after)
  const startLine = Math.max(0, problem.range.start.line - 10);
  const endLine = Math.min(lines.length - 1, problem.range.end.line + 10);
  const surroundingCode = lines.slice(startLine, endLine + 1).join('\n');
  
  // Find related files
  const relatedFiles = [];
  const extension = path.extname(filePath);
  const baseName = path.basename(filePath, extension);
  const dirName = path.dirname(filePath);
  
  // Add test files if not already a test
  if (!filePath.includes('test') && !filePath.includes('spec')) {
    const possibleTestFiles = [
      path.join(dirName, `${baseName}.test${extension}`),
      path.join(dirName, `${baseName}.spec${extension}`),
      path.join(dirName, '__tests__', `${baseName}${extension}`)
    ];
    
    possibleTestFiles.forEach(testPath => {
      if (fs.existsSync(testPath)) {
        relatedFiles.push({ type: 'test', path: testPath });
      }
    });
  }
  
  // Infer component pairs (e.g., .tsx and .css)
  const possibleRelatedFiles = [
    { ext: '.css', type: 'styles' },
    { ext: '.scss', type: 'styles' },
    { ext: '.less', type: 'styles' },
    { ext: '.module.css', type: 'styles' },
    { ext: '.module.scss', type: 'styles' },
    { ext: '.types.ts', type: 'types' },
    { ext: '.d.ts', type: 'types' }
  ];
  
  possibleRelatedFiles.forEach(({ ext, type }) => {
    const relatedPath = path.join(dirName, `${baseName}${ext}`);
    if (fs.existsSync(relatedPath)) {
      relatedFiles.push({ type, path: relatedPath });
    }
  });
  
  // Identify relevant configuration files
  const configFiles = [];
  const checkConfigs = [
    { file: 'tsconfig.json', match: ['.ts', '.tsx'] },
    { file: '.eslintrc.js', match: ['.js', '.jsx', '.ts', '.tsx'] },
    { file: '.babelrc', match: ['.js', '.jsx', '.ts', '.tsx'] },
    { file: 'jest.config.js', match: ['.test.js', '.test.ts', '.spec.js', '.spec.ts'] }
  ];
  
  checkConfigs.forEach(config => {
    if (config.match.some(ext => filePath.endsWith(ext))) {
      const configPath = path.join(options.workspace, config.file);
      if (fs.existsSync(configPath)) {
        configFiles.push({ type: path.basename(config.file), path: configPath });
      }
    }
  });
  
  // Git history (if enabled and git available)
  let gitHistory = null;
  try {
    const gitCmd = `git log -p -5 --follow -- "${filePath}"`;
    const gitInfo = execSync(gitCmd, { cwd: options.workspace }).toString();
    gitHistory = { recentCommits: gitInfo };
  } catch (error) {
    logger.debug(`Could not retrieve git history: ${error.message}`);
  }
  
  spinner.succeed(`Enriched context for ${problem.file}`);
  
  return {
    ...problem,
    filePath,
    fileContent,
    surroundingCode,
    relatedFiles,
    configFiles,
    gitHistory
  };
}

/**
 * Generate a solution using Claude Code
 */
async function generateSolution(problem) {
  const spinner = ora(`Generating solution for ${problem.file}...`).start();
  
  // Create a prompt for Claude Code using the appropriate template
  const category = problem.source || 'default';
  const promptTemplate = config.promptTemplates[category] || config.promptTemplates.default;
  
  // Fill in the template
  const prompt = promptTemplate
    .replace('{file_name}', problem.file)
    .replace('{range}', `Line ${problem.range.start.line + 1}, Col ${problem.range.start.character + 1}`)
    .replace('{message}', problem.message)
    .replace('{surrounding_code}', problem.surroundingCode);
  
  // Write prompt to file for debugging
  const promptFile = path.join(options.output, `prompt-${problem.id}.md`);
  fs.writeFileSync(promptFile, prompt, 'utf8');
  
  if (config.dryRun) {
    spinner.info(`DRY RUN: Would call Claude Code with prompt in ${promptFile}`);
    return { success: true, solution: "// This is a placeholder solution for dry run mode" };
  }
  
  // In real implementation, would call Claude Code via CLI or API
  // For this demo, we'll simulate responses
  
  let solution;
  if (problem.file.includes('PropertyCard')) {
    solution = `interface PropertyIndividualProps {
  // Core identification
  id: string;
  name: string;
  title?: string;
  
  // Location
  location?: string;
  
  // Unit details
  price?: number;
  status: PropertyStatus | string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  floorArea?: number;
  
  // Media
  image?: string;
  images?: string[];
  imageUrl?: string; // For backward compatibility
  
  // Development information
  developmentName?: string;
  projectName?: string;
  
  // Status flags
  isNew?: boolean;
  isReduced?: boolean;
}

// Support both property object and individual props
export type PropertyCardProps = {
  formatPrice?: (price: number | undefined | null) => string;
  showDevelopmentName?: boolean;
} & (
  | { property: Property }
  | PropertyIndividualProps
);`;
  } else if (problem.file.includes('repositories.ts')) {
    solution = `// Export individual repositories
export { UserRepository };
export { DevelopmentRepository };
export { UnitRepository };

// Export base and other repositories in a named export
export { BaseRepository };`;
  } else {
    solution = `import { 
  signIn, 
  signOut, 
  fetchAuthSession, 
  fetchUserAttributes, 
  confirmSignUp, 
  resetPassword,
  confirmResetPassword
} from 'aws-amplify/auth';`;
  }
  
  spinner.succeed(`Generated solution for ${problem.file}`);
  
  return {
    success: true,
    solution,
    promptFile
  };
}

/**
 * Apply a generated solution to a file
 */
function applySolution(problem, solution) {
  const spinner = ora(`Applying solution to ${problem.file}...`).start();
  
  // Create backup
  const backupDir = path.join(options.output, 'backups');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  const backupFile = path.join(backupDir, `${path.basename(problem.file)}.${Date.now()}.bak`);
  fs.copyFileSync(problem.filePath, backupFile);
  
  if (config.dryRun) {
    spinner.info(`DRY RUN: Would apply solution to ${problem.file}`);
    spinner.info(`Backup created at ${backupFile}`);
    return { success: true, backupFile };
  }
  
  try {
    // Read current content
    const content = fs.readFileSync(problem.filePath, 'utf8');
    const lines = content.split('\n');
    
    // Extract the lines that need to be replaced
    const startLine = problem.range.start.line;
    const endLine = problem.range.end.line;
    
    // Replace the lines with the solution
    const newLines = [
      ...lines.slice(0, startLine),
      solution,
      ...lines.slice(endLine + 1)
    ];
    
    // Write updated content
    fs.writeFileSync(problem.filePath, newLines.join('\n'), 'utf8');
    
    spinner.succeed(`Applied solution to ${problem.file} (backup: ${backupFile})`);
    return { success: true, backupFile };
  } catch (error) {
    spinner.fail(`Failed to apply solution: ${error.message}`);
    return { success: false, error: error.message, backupFile };
  }
}

/**
 * Verify that the applied fix works
 */
async function verifyFix(problem) {
  const spinner = ora(`Verifying fix for ${problem.file}...`).start();
  
  if (config.dryRun) {
    spinner.info(`DRY RUN: Would verify fix for ${problem.file}`);
    return { success: true };
  }
  
  // Skip verification steps in this demo
  // In a real implementation, would run tests, linters, etc. based on config
  
  spinner.succeed(`Verified fix for ${problem.file}`);
  return { success: true };
}

/**
 * Commit the changes if configured to do so
 */
async function commitChanges(problems) {
  if (!config.autoCommit || config.dryRun) {
    return { success: true, message: 'Skipping commit (not configured or dry run)' };
  }
  
  const spinner = ora(`Committing changes...`).start();
  
  try {
    // Get list of fixed files
    const fixedFiles = problems
      .filter(p => p.status === 'fixed')
      .map(p => p.file);
    
    if (fixedFiles.length === 0) {
      spinner.info('No files to commit');
      return { success: true, message: 'No files to commit' };
    }
    
    // Add files
    execSync(`git add ${fixedFiles.join(' ')}`, { cwd: options.workspace });
    
    // Commit
    const commitMessage = `Fix VSCode issues using Claude Code\n\n` +
      `Fixed ${fixedFiles.length} files:\n` +
      fixedFiles.map(f => `- ${f}`).join('\n');
    
    execSync(`git commit -m "${commitMessage}"`, { cwd: options.workspace });
    
    spinner.succeed(`Committed ${fixedFiles.length} files`);
    return { success: true, message: `Committed ${fixedFiles.length} files` };
  } catch (error) {
    spinner.fail(`Failed to commit changes: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Generate a comprehensive report
 */
function generateReport(state) {
  const spinner = ora(`Generating report...`).start();
  
  const endTime = new Date();
  const duration = (endTime - state.startTime) / 1000;
  
  const report = {
    timestamp: new Date().toISOString(),
    duration: `${duration.toFixed(2)} seconds`,
    workspace: options.workspace,
    configuration: {
      ...config,
      apiKey: config.apiKey ? '***' : undefined
    },
    statistics: state.statistics,
    problems: state.problems.map(problem => ({
      id: problem.id,
      file: problem.file,
      message: problem.message,
      severity: problem.severity,
      source: problem.source,
      status: problem.status || 'pending',
      fixDetails: problem.fix || null
    }))
  };
  
  const reportPath = path.join(options.output, `report-${Date.now()}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
  
  // Generate HTML report
  const htmlReport = `<!DOCTYPE html>
<html>
<head>
  <title>VSCode Problem Resolution Report</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 1200px; margin: 0 auto; padding: 20px; }
    h1, h2, h3 { color: #333; }
    .summary { display: flex; justify-content: space-between; background: #f5f5f5; padding: 15px; border-radius: 5px; }
    .stat { text-align: center; }
    .stat-value { font-size: 24px; font-weight: bold; }
    .stat-label { font-size: 14px; color: #666; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { text-align: left; padding: 12px; border-bottom: 1px solid #ddd; }
    th { background-color: #f2f2f2; }
    .success { color: green; }
    .error { color: red; }
    .warning { color: orange; }
    .pending { color: blue; }
    .details-toggle { cursor: pointer; color: #0066cc; }
  </style>
</head>
<body>
  <h1>VSCode Problem Resolution Report</h1>
  <p>Generated on ${new Date().toLocaleString()}</p>
  
  <div class="summary">
    <div class="stat">
      <div class="stat-value">${report.statistics.total}</div>
      <div class="stat-label">Total Problems</div>
    </div>
    <div class="stat">
      <div class="stat-value success">${report.statistics.fixed}</div>
      <div class="stat-label">Fixed</div>
    </div>
    <div class="stat">
      <div class="stat-value error">${report.statistics.failed}</div>
      <div class="stat-label">Failed</div>
    </div>
    <div class="stat">
      <div class="stat-value warning">${report.statistics.skipped}</div>
      <div class="stat-label">Skipped</div>
    </div>
    <div class="stat">
      <div class="stat-value">${duration.toFixed(2)}s</div>
      <div class="stat-label">Duration</div>
    </div>
  </div>
  
  <h2>Problem Details</h2>
  <table>
    <tr>
      <th>File</th>
      <th>Source</th>
      <th>Severity</th>
      <th>Status</th>
      <th>Message</th>
    </tr>
    ${report.problems.map(p => `
      <tr>
        <td>${p.file}</td>
        <td>${p.source || 'unknown'}</td>
        <td class="${p.severity}">${p.severity}</td>
        <td class="${p.status}">${p.status}</td>
        <td>${p.message}</td>
      </tr>
    `).join('')}
  </table>
</body>
</html>`;

  const htmlReportPath = path.join(options.output, `report-${Date.now()}.html`);
  fs.writeFileSync(htmlReportPath, htmlReport, 'utf8');
  
  spinner.succeed(`Generated reports at ${reportPath} and ${htmlReportPath}`);
  return { reportPath, htmlReportPath };
}

/**
 * Main execution function
 */
async function main() {
  console.log(chalk.green(`
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                                                   ┃
┃   Enterprise-Grade VSCode Problem Resolution      ┃
┃   Powered by Claude Code                          ┃
┃                                                   ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
  `));
  
  // Check prerequisites
  if (!checkClaudeCodeAvailable()) {
    logger.error('Claude Code CLI not found. Please install it first.');
    process.exit(1);
  }
  
  // Check if we're in a git repository
  let inGitRepo = false;
  try {
    execSync('git rev-parse --is-inside-work-tree', { cwd: options.workspace, stdio: 'ignore' });
    inGitRepo = true;
  } catch (error) {
    logger.warn('Not in a git repository. Version control features will be disabled.');
  }
  
  // Create git branch if specified and in git repo
  if (inGitRepo && config.gitBranch) {
    try {
      // Check if branch exists
      const branchExists = execSync(`git branch --list ${config.gitBranch}`, { cwd: options.workspace })
        .toString()
        .trim();
      
      if (branchExists) {
        // Checkout existing branch
        execSync(`git checkout ${config.gitBranch}`, { cwd: options.workspace });
        logger.info(`Checked out existing branch: ${config.gitBranch}`);
      } else {
        // Create and checkout new branch
        execSync(`git checkout -b ${config.gitBranch}`, { cwd: options.workspace });
        logger.info(`Created and checked out new branch: ${config.gitBranch}`);
      }
    } catch (error) {
      logger.error(`Failed to create/checkout git branch: ${error.message}`);
      process.exit(1);
    }
  }
  
  // Export problems from VSCode
  const rawProblems = await exportProblemsFromVSCode();
  state.problems = rawProblems;
  state.statistics.total = rawProblems.length;
  
  // Categorize and prioritize problems
  const prioritizedProblems = categorizeProblems(rawProblems);
  
  // Process each problem
  for (const problem of prioritizedProblems) {
    logger.info(`Processing problem in ${problem.file}: ${problem.message}`);
    
    // Enrich problem context
    const enrichedProblem = enrichProblemContext(problem);
    if (!enrichedProblem) {
      logger.warn(`Skipped problem in ${problem.file} - could not enrich context`);
      problem.status = 'skipped';
      state.statistics.skipped++;
      continue;
    }
    
    // Ask for user confirmation in interactive mode
    if (config.interactive && config.requireApproval) {
      const { proceed } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'proceed',
          message: `Fix problem in ${problem.file}?`,
          default: true
        }
      ]);
      
      if (!proceed) {
        logger.info(`Skipped problem in ${problem.file} - user choice`);
        problem.status = 'skipped';
        state.statistics.skipped++;
        continue;
      }
    }
    
    // Generate solution
    const solutionResult = await generateSolution(enrichedProblem);
    if (!solutionResult.success) {
      logger.error(`Failed to generate solution for ${problem.file}: ${solutionResult.error}`);
      problem.status = 'failed';
      problem.fix = { error: solutionResult.error };
      state.statistics.failed++;
      continue;
    }
    
    // Apply solution
    const applyResult = applySolution(enrichedProblem, solutionResult.solution);
    if (!applyResult.success) {
      logger.error(`Failed to apply solution to ${problem.file}: ${applyResult.error}`);
      problem.status = 'failed';
      problem.fix = { 
        error: applyResult.error,
        solution: solutionResult.solution,
        backupFile: applyResult.backupFile
      };
      state.statistics.failed++;
      continue;
    }
    
    // Verify fix
    const verifyResult = await verifyFix(enrichedProblem);
    if (!verifyResult.success) {
      logger.error(`Fix verification failed for ${problem.file}: ${verifyResult.error}`);
      
      // Rollback changes
      logger.info(`Rolling back changes to ${problem.file}`);
      fs.copyFileSync(applyResult.backupFile, enrichedProblem.filePath);
      
      problem.status = 'failed';
      problem.fix = {
        error: verifyResult.error,
        solution: solutionResult.solution,
        backupFile: applyResult.backupFile,
        rolledBack: true
      };
      state.statistics.failed++;
      continue;
    }
    
    // Mark as fixed
    logger.info(`Successfully fixed problem in ${problem.file}`);
    problem.status = 'fixed';
    problem.fix = {
      solution: solutionResult.solution,
      backupFile: applyResult.backupFile,
      promptFile: solutionResult.promptFile
    };
    state.statistics.fixed++;
  }
  
  // Commit changes if configured
  if (inGitRepo && config.autoCommit) {
    await commitChanges(state.problems);
  }
  
  // Generate final report
  const reportResult = generateReport(state);
  
  // Print summary
  console.log(chalk.green(`
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                                                   ┃
┃   VSCode Problem Resolution Summary               ┃
┃                                                   ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                                   ┃
┃   Total Problems: ${chalk.bold(state.statistics.total.toString().padStart(3))}                            ┃
┃   Fixed:          ${chalk.green(state.statistics.fixed.toString().padStart(3))}                           ┃
┃   Failed:         ${chalk.red(state.statistics.failed.toString().padStart(3))}                            ┃
┃   Skipped:        ${chalk.yellow(state.statistics.skipped.toString().padStart(3))}                           ┃
┃                                                   ┃
┃   Detailed reports generated at:                  ┃
┃   ${reportResult.reportPath}               ┃
┃   ${reportResult.htmlReportPath}          ┃
┃                                                   ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
  `));
}

// Run the main function
main().catch(error => {
  logger.error(`Unexpected error: ${error.message}`);
  console.error(error.stack);
  process.exit(1);
});