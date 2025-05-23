#!/bin/bash

# Claude Code Quick Start Script for prop-ie-aws-app

echo "🤖 Claude Code SDK Quick Start"
echo "==============================="
echo ""

# Check if Claude Code is installed
if command -v claude &> /dev/null; then
    echo "✅ Claude Code SDK is already installed"
else
    echo "📦 Installing Claude Code SDK..."
    npm install -g @anthropic-ai/claude-code
fi

# Check for API key
if [ -n "$ANTHROPIC_API_KEY" ]; then
    echo "✅ ANTHROPIC_API_KEY is set"
else
    echo "⚠️  ANTHROPIC_API_KEY is not set"
    echo "   Please set it with: export ANTHROPIC_API_KEY=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
    echo "   Or add it to your .env file"
fi

echo ""
echo "📚 Quick Commands:"
echo "=================="
echo ""
echo "Interactive Mode:"
echo "  claude"
echo ""
echo "Code Review:"
echo "  npm run claude:review:full      # Comprehensive review"
echo "  npm run claude:review:security  # Security audit"
echo "  npm run claude:review:tests     # Test coverage review"
echo "  npm run claude:review:pr        # Review PR changes"
echo ""
echo "Development Assistant:"
echo "  npm run claude:dev             # Interactive development helper"
echo "  npm run claude:fix             # Auto-fix common issues"
echo "  npm run claude:perf            # Performance analysis"
echo "  npm run claude:types           # TypeScript type checking"
echo "  npm run claude:docs            # Documentation review"
echo ""
echo "One-Liner Examples:"
echo "  claude -p \"Fix TypeScript errors in developer portal\""
echo "  claude -p \"Generate tests for transaction components\""
echo "  claude -p \"Optimize the PropertyCard component\""
echo ""
echo "📄 Documentation:"
echo "=================="
echo "  CLAUDE_CODE_SDK_SETUP.md - Complete setup guide"
echo "  CLAUDE.md                - Project context for Claude"
echo ""
echo "🚀 Next Steps:"
echo "=============="
echo "1. Install the SDK: npm install -g @anthropic-ai/claude-code"
echo "2. Set your API key: export ANTHROPIC_API_KEY='your-key-here'"
echo "3. Try interactive mode: claude"
echo "4. Run a code review: npm run claude:review:full"
echo ""
echo "Happy coding with Claude! 🎉"