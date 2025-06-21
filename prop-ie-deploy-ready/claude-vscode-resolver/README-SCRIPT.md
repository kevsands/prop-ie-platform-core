# Claude Code VSCode Problem Resolver (Quick Start)

This document provides quick instructions for running the script directly without installation.

## Prerequisites

- Node.js (v18 or later)
- An Anthropic API key

## Running the Script Directly

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the same directory with:
   ```
   ANTHROPIC_API_KEY=your_api_key_here
   ```
4. Make the script executable:
   ```bash
   chmod +x index.js
   ```
5. Run the script:
   ```bash
   ./index.js --workspace /path/to/your/project
   ```

## Common Usage Examples

### Run in Dry Run Mode

Preview fixes without applying them:

```bash
./index.js --workspace /path/to/your/project --dry-run
```

### Run with Custom Configuration

```bash
./index.js --workspace /path/to/your/project --config my-config.yml
```

### Run in Non-Interactive Mode

```bash
./index.js --workspace /path/to/your/project --ci
```

### Create a Git Branch for Changes

```bash
./index.js --workspace /path/to/your/project --git-branch fix-vscode-issues
```

### Limit Problem Processing

Only process up to 5 problems concurrently:

```bash
./index.js --workspace /path/to/your/project --max-concurrent 5
```

## Example Output

The tool will:

1. Collect problems from VSCode diagnostics
2. Prioritize issues based on severity and category
3. Generate fixes using Claude Code
4. Verify fixes through testing and linting
5. Generate a detailed report of actions taken

You'll see output similar to:

```
Claude Code VSCode Problem Resolver - Summary
══════════════════════════════════════════════════════════════════════════════
Total problems found: 15
Fixed: 12
Failed: 2
Skipped: 1
Verification passes: 12
Verification failures: 0
Elapsed time: 3m 45s

Fixed Problems:
✓ src/components/auth/LoginForm.tsx: Property 'login' does not exist on type 'AuthContextType'. Did you mean 'signIn'?
✓ src/components/performance/VirtualizedList.tsx: Type '(item: T) => JSX.Element' is not assignable to type 'string | number'.
...

Failed Problems:
✗ src/lib/security/index.ts: Assignment might lead to prototype pollution or similar attacks
...
══════════════════════════════════════════════════════════════════════════════
```

## Troubleshooting

If you encounter issues:

1. Check your API key is valid
2. Ensure your Node.js version is 18 or later
3. Verify the workspace path is correct
4. Check the logs in the output directory

For detailed documentation, see the main [README.md](README.md).