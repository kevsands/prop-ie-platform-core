# Enterprise-Grade VSCode Problem Resolution System

A robust, enterprise-level solution for systematically addressing and resolving VSCode problems using Claude Code. This system automatically identifies, categorizes, fixes, and verifies solutions for code issues detected in VSCode.

## Features

- **Comprehensive Problem Collection**: Extracts all diagnostics from VSCode for systematic resolution
- **Intelligent Prioritization**: Categorizes and prioritizes problems based on severity, dependencies, and impact
- **Contextual Analysis**: Enriches problems with relevant context like related files and configuration
- **Claude Code Integration**: Leverages Claude's AI capabilities to generate accurate fixes
- **Verification Pipeline**: Validates fixes through linting, testing, and building
- **Git Integration**: Automatic branching, commits, and optional PR creation
- **Rollback Capabilities**: Maintains backups and provides rollback mechanisms
- **Detailed Reporting**: Generates comprehensive reports on resolution status
- **CI/CD Compatibility**: Configurable for both interactive and CI environments
- **Extensive Configuration**: Highly customizable through YAML configuration

## Installation

```bash
# Install dependencies for the resolver
npm install --save-dev chalk@4.1.2 commander@9.4.1 inquirer@8.2.5 js-yaml@4.1.0 ora@5.4.1 uuid@9.0.0 winston@3.8.2

# Make the CLI executable
chmod +x ./claude-code-vscode-resolver.js
```

## Prerequisites

- Node.js 16.x or higher
- VSCode with the "Problems Export" extension installed
- Claude Code CLI (installed and accessible in PATH)
- Git (optional, for version control features)

## Usage

```bash
# Basic usage with default options
node claude-code-vscode-resolver.js

# Specify workspace and configuration
node claude-code-vscode-resolver.js --workspace /path/to/project --config custom-config.yml

# Dry run mode (no changes applied)
node claude-code-vscode-resolver.js --dry-run

# Create a dedicated git branch for fixes
node claude-code-vscode-resolver.js --git-branch fix/vscode-issues

# Non-interactive mode for CI environments
node claude-code-vscode-resolver.js --ci
```

## Configuration

The tool uses `.claude-code-config.yml` in your project root (or specify a custom path):

```yaml
# API Configuration
apiKey: ${ANTHROPIC_API_KEY}  # Can be left empty if set as environment variable
model: "claude-3-7-sonnet-20250219"
maxTokens: 4096
temperature: 0.2

# Fix Preferences
maxChangesPerFix: 5
requireApproval: true
autoCommit: false
createPullRequest: false

# Categories to enable/disable
enabledCategories: []
disabledCategories: ["documentation"]

# Verification steps
reviewSteps:
  runTests: true
  runLinters: true
  runBuild: true
  validatePerformance: false
```

## Command Line Options

| Option | Description | Default |
|--------|-------------|---------|
| `--workspace`, `-w` | Path to workspace root | Current directory |
| `--config`, `-c` | Path to configuration file | `.claude-code-config.yml` |
| `--output`, `-o` | Output directory for logs and reports | `.claude-code-output` |
| `--log-level`, `-l` | Log level (debug, info, warn, error) | `info` |
| `--dry-run`, `-d` | Dry run mode (no changes applied) | `false` |
| `--interactive`, `-i` | Interactive mode (prompt for approvals) | `true` |
| `--max-concurrent`, `-m` | Maximum concurrent problems to process | `1` |
| `--git-branch`, `-b` | Git branch to use for changes | None |
| `--ci` | Run in CI mode (non-interactive) | `false` |
| `--help`, `-h` | Show help | |

## Workflow

1. **Problem Collection**: The system exports all diagnostics from VSCode
2. **Categorization**: Problems are categorized and prioritized
3. **Resolution**: For each problem in priority order:
   - Analyze and enrich the problem context
   - Create a backup of affected files
   - Generate a solution using Claude Code
   - Apply the changes (with approval if in interactive mode)
   - Verify the fix using configured verification steps
   - Roll back changes if verification fails
   - Commit changes if configured to do so
4. **Reporting**: Generate a comprehensive report with statistics and details

## Integration with CI/CD

This tool is designed to work seamlessly in CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
name: Fix VSCode Issues

on:
  workflow_dispatch:
  schedule:
    - cron: '0 0 * * 1'  # Weekly on Mondays

jobs:
  fix-issues:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 16
      - name: Install Dependencies
        run: npm ci
      - name: Install Claude Code CLI
        run: npm install -g @anthropic/claude-code-cli
      - name: Install Resolver Dependencies
        run: npm install --no-save chalk@4.1.2 commander@9.4.1 inquirer@8.2.5 js-yaml@4.1.0 ora@5.4.1 uuid@9.0.0 winston@3.8.2
      - name: Run VSCode Problem Resolver
        run: node claude-code-vscode-resolver.js --ci --git-branch fix/vscode-issues
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
      - name: Create Pull Request
        uses: peter-evans/create-pull-request@v5
        with:
          title: 'Fix VSCode issues with Claude Code'
          body: 'Automated fixes for VSCode diagnostics using Claude Code'
          branch: fix/vscode-issues
```

## License

MIT

## Security Considerations

- The tool requires access to your codebase and potentially API keys
- Review generated changes carefully, especially in security-critical areas
- Limit API key permissions to the minimum necessary scope
- Consider running in `--dry-run` mode for sensitive repositories