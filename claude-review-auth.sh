#!/bin/bash

# Set API key directly in script (for testing only)
export ANTHROPIC_API_KEY="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"

echo "Reviewing AuthContext.tsx..."
echo "=========================="

# Read the file and send to Claude
cat src/context/AuthContext.tsx | claude -p "Review this AuthContext.tsx file for:
1. Code quality and best practices
2. Security vulnerabilities
3. Performance issues
4. State management approaches
5. Error handling

Provide specific recommendations for improvements."

echo "Review complete!"