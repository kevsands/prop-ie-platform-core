# Claude Code VSCode Problem Resolver

An enterprise-grade solution for systematically detecting, fixing, and verifying solutions for problems identified in VSCode using Claude Code.

## Overview

This tool provides a robust, automated workflow for resolving VSCode diagnostics in enterprise environments. It:

- Collects all VSCode problems/diagnostics
- Categorizes and prioritizes issues by severity, type, and location
- Intelligently generates fixes using Claude Code
- Verifies fixes through comprehensive testing
- Integrates with version control systems
- Provides detailed reporting and logging

Designed for large development teams, the Claude Code VSCode Problem Resolver brings AI-powered assistance to your code quality workflow with enterprise-level safety, configurability, and integration capabilities.

## Installation

### Prerequisites

- Node.js (v18 or later)
- VSCode with the "Problems Export" extension installed
- Claude Code CLI installed and configured
- Git (for version control integration)

### Installation Steps

```bash
# Install globally
npm install -g @claude/vscode-resolver

# Or install in your project
npm install --save-dev @claude/vscode-resolver
```

Alternatively, you can clone and build the repository:

```bash
git clone https://github.com/anthropic/claude-vscode-resolver.git
cd claude-vscode-resolver
npm install
npm run build
npm link
```

## Configuration

Create a configuration file named `.claude-resolver.yml` in your project root. Here's a template with common options:

```yaml
# Claude Code configuration
claude:
  apiKey: ${ANTHROPIC_API_KEY}  # Will use environment variable if not specified
  model: "claude-3-7-sonnet-20250219"  # Model to use
  maxTokens: 4096  # Maximum tokens for Claude responses
  temperature: 0.2  # Temperature for Claude responses
  systemPrompt: "You're Claude Code, an AI pair programmer. Your task is to fix the specified code issue."
  
# Problem categorization
categories:
  enabled:  # Categories to process (empty means all)
    - typescript
    - eslint
    - security
    - performance
  disabled:  # Categories to ignore
    - documentation
    - style
  priority:  # Adjust base priority for categories
    security: 100
    errors: 90
    typescript: 80
    performance: 70
    warnings: 60
    hints: 40

# Fix generation
fixes:
  maxChangesPerFix: 5  # Maximum number of files to change in a single fix
  requireApproval: true  # Whether to require manual approval before applying fixes
  autoCommit: false  # Whether to automatically commit fixes
  createPullRequest: false  # Whether to create a pull request for fixes

# Verification
verification:
  runTests: true  # Whether to run tests after fixes
  runLinters: true  # Whether to run linters after fixes
  runBuild: true  # Whether to run build after fixes
  validatePerformance: false  # Whether to validate performance after fixes

# Prompt templates
promptTemplates:
  general: |
    # VSCode Problem Fix Request
    
    ## Problem Details
    - **File**: {file_name}
    - **Location**: {range}
    - **Severity**: {severity}
    - **Source**: {source}
    - **Code**: {code}
    - **Message**: {message}
    
    ## Code Context
    ```{language}
    {surrounding_code}
    ```
    
    ## Task
    Please fix the problem described above. Provide a clear explanation of the issue and your solution, then the exact code changes needed.
  
  typescript: |
    # TypeScript Error Fix Request
    
    ## Error Details
    - **File**: {file_name}
    - **Location**: {range}
    - **Error Code**: TS{code}
    - **Message**: {message}
    
    ## Code Context
    ```typescript
    {surrounding_code}
    ```
    
    ## Task
    Please fix this TypeScript error. Explain the root cause of the type error and provide a type-safe solution that follows TypeScript best practices.

# Integration settings
integrations:
  git:
    branchPrefix: "fix/"  # Prefix for automatically created branches
    commitMessageTemplate: "fix({category}): {message}"  # Template for commit messages
  ci:
    enabled: false  # Whether to integrate with CI/CD pipelines
    reportPath: "claude-resolver-report.json"  # Path to write report for CI systems

# Logging and output
logging:
  level: "info"  # Log level (debug, info, warn, error)
  file: "claude-resolver.log"  # Log file path
  format: "json"  # Log format (json, text)

# Safety mechanisms
safety:
  createBackups: true  # Whether to create backups before applying fixes
  rollbackOnFailure: true  # Whether to roll back on verification failure
  maxConcurrent: 1  # Maximum number of problems to fix concurrently
```

## Usage

### Basic Usage

```bash
# Run with default settings, looking for a .claude-resolver.yml file
claude-resolver

# Specify a configuration file
claude-resolver --config my-config.yml

# Show help
claude-resolver --help
```

### Command Line Options

```
Usage: claude-resolver [options]

Options:
  -c, --config <path>       Path to configuration file (default: ".claude-resolver.yml")
  -w, --workspace <path>    Path to workspace root (default: current directory)
  -o, --output <path>       Output directory for logs and reports (default: ".claude-resolver-output")
  -l, --log-level <level>   Log level (debug, info, warn, error) (default: "info")
  -d, --dry-run             Dry run (no changes will be applied)
  -i, --interactive         Interactive mode (prompt for approvals) (default: true)
  -m, --max-concurrent <n>  Maximum concurrent problems to process (default: 1)
  -b, --git-branch <name>   Git branch to use for changes
  --ci                      Run in CI mode (non-interactive)
  -h, --help                Display help
  -v, --version             Output version
```

### Integration with CI/CD Pipelines

You can integrate the resolver into your CI/CD pipelines:

```yaml
# GitHub Actions example
jobs:
  fix-problems:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Install Claude Code Resolver
        run: npm install -g @claude/vscode-resolver
      - name: Run problem resolver
        run: claude-resolver --ci --git-branch fix-vscode-problems
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
      - name: Create Pull Request
        uses: peter-evans/create-pull-request@v5
        with:
          title: "fix: Resolve VSCode problems"
          body: "Automatically fixed VSCode problems using Claude Code Resolver"
          branch: fix-vscode-problems
```

## Advanced Scenarios

### Custom Problem Resolution Workflow

You can customize the workflow by extending the configuration:

```yaml
workflow:
  preProcessors:
    - name: "dependency-analyzer"
      path: "./scripts/dependency-analyzer.js"
  postProcessors:
    - name: "quality-checker"
      path: "./scripts/quality-checker.js"
  hooks:
    beforeFix: "./scripts/before-fix.js"
    afterFix: "./scripts/after-fix.js"
```

### Custom Verification Steps

Add custom verification steps:

```yaml
verification:
  custom:
    - name: "api-schema-validation"
      command: "npm run validate-api"
    - name: "custom-test-suite"
      command: "npm run test:critical"
```

## Troubleshooting

### Common Issues

1. **Problem collection fails**
   - Make sure VSCode with the "Problems Export" extension is installed
   - Check your workspace path is correct

2. **Claude Code integration issues**
   - Verify Claude Code CLI is properly installed
   - Check your API key is valid and has sufficient permissions

3. **Verification failures**
   - Inspect verification logs for specific test failures
   - Check if build commands are correct for your project

### Logs

Logs are saved to the output directory (default: `.claude-resolver-output`). Review these logs for details on failures and operations:

- `resolver.log`: Main log file with operation details
- `fixes/`: Directory containing details of each fix attempt
- `reports/`: Generated reports
- `backups/`: Backup files created before applying changes

## License

MIT

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute to this project.