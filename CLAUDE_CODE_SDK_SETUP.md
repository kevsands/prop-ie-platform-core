# Claude Code SDK Setup Guide for prop-ie-aws-app

This guide will help you integrate the Claude Code SDK to supercharge your development workflow for the property platform.

## 1. Installation

```bash
# Install Claude Code SDK globally
npm install -g @anthropic-ai/claude-code

# Verify installation
claude --version
```

## 2. Authentication

You'll need an Anthropic API key:
1. Visit https://console.anthropic.com
2. Create an API key
3. Set it as an environment variable:

```bash
export ANTHROPIC_API_KEY="your-api-key-here"
```

Add this to your `.bashrc`, `.zshrc`, or `.env` file for persistence.

## 3. Project-Specific Configuration

Create a `CLAUDE.md` file in your project root:

```bash
touch CLAUDE.md
```

Add project-specific context:

```markdown
# prop-ie-aws-app Claude Code Configuration

This is a Next.js 14 enterprise property platform with:
- Authentication: NextAuth with custom JWT
- Database: Prisma with PostgreSQL
- Real-time: WebSocket integration
- Infrastructure: AWS with Terraform
- Testing: Jest + React Testing Library

Key areas to focus on:
- Developer portal functionality
- Transaction flow implementation
- Security and authentication
- Performance optimization
- Test coverage improvement
```

## 4. Common Usage Patterns

### Interactive Mode
```bash
# Start an interactive session
claude

# You can then ask questions like:
# > "Show me all authentication-related files"
# > "Fix TypeScript errors in the developer portal"
# > "Generate tests for transaction components"
```

### One-Shot Commands
```bash
# Quick code review
claude -p "Review the authentication flow in src/context/AuthContext.tsx"

# Fix build errors
claude -p "Fix all TypeScript errors preventing the build"

# Generate documentation
claude -p "Add JSDoc comments to all API routes"
```

### Piping and Automation
```bash
# Analyze test coverage
npm test -- --coverage | claude -p "Analyze this coverage report and suggest areas for improvement"

# Review git changes
git diff | claude -p "Review these changes for potential issues"

# Auto-fix ESLint errors
npm run lint | claude -p "Fix these linting errors"
```

## 5. CI/CD Integration

Create `.github/workflows/claude-code-review.yml`:

```yaml
name: Claude Code Review
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  code-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install -g @anthropic-ai/claude-code
      - name: Run Claude Code Review
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          git diff origin/main | claude -p "Review these changes for:
          - Security vulnerabilities
          - Performance issues
          - TypeScript type safety
          - Test coverage gaps
          Output in GitHub PR comment format"
```

## 6. Development Workflow Integration

### Pre-commit Hook
Add to `.git/hooks/pre-commit`:

```bash
#!/bin/bash
# Run Claude Code to check for common issues before commit
git diff --cached | claude -p "Check these staged changes for:
- Security issues
- Missing tests
- TypeScript errors
- Code quality problems
Exit with status 1 if critical issues found"
```

### VSCode Integration
Create a task in `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Claude Code Review",
      "type": "shell",
      "command": "claude",
      "args": ["-p", "Review the current file: ${file}"],
      "presentation": {
        "reveal": "always",
        "panel": "new"
      }
    }
  ]
}
```

## 7. Useful Commands for Your Project

```bash
# Fix authentication issues
claude -p "Analyze and fix authentication issues in the platform"

# Improve performance
claude -p "Profile the application and suggest performance optimizations"

# Generate API documentation
claude -p "Generate comprehensive API documentation for all routes"

# Create test suites
claude -p "Create comprehensive test suites for the transaction flow"

# Security audit
claude -p "Perform a security audit of the codebase"
```

## 8. Best Practices

1. **Use Memory Files**: Keep the `CLAUDE.md` updated with project context
2. **Batch Operations**: Use piping for efficiency
3. **Specific Prompts**: Be clear about what you want
4. **Review Output**: Always review Claude's suggestions before applying
5. **Version Control**: Commit Claude-generated changes separately

## 9. Advanced Features

### Model Context Protocol (MCP)
Add custom tools by creating an MCP server configuration:

```bash
# Create MCP config
mkdir -p ~/.config/claude
cat > ~/.config/claude/config.json << EOF
{
  "mcpServers": {
    "prop-platform": {
      "command": "node",
      "args": ["./mcp-server.js"],
      "scope": "project"
    }
  }
}
EOF
```

### Extended Thinking
For complex architectural decisions:

```bash
claude -p "Using extended thinking, design a scalable architecture for handling 100k concurrent property transactions"
```

## 10. Troubleshooting

- **API Key Issues**: Ensure `ANTHROPIC_API_KEY` is set correctly
- **Permission Errors**: Run with appropriate file system permissions
- **Memory Issues**: Clear conversation history with `claude --clear`
- **Performance**: Use `--verbose` flag for debugging slow operations

## Next Steps

1. Install the SDK: `npm install -g @anthropic-ai/claude-code`
2. Set up your API key
3. Create the `CLAUDE.md` file
4. Try the example commands
5. Integrate into your workflow

This setup will significantly enhance your development productivity by:
- Automating code reviews
- Fixing bugs faster
- Generating tests automatically
- Improving code quality
- Accelerating feature development