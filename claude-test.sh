#!/bin/bash

# Set API key directly in script (for testing only)
export ANTHROPIC_API_KEY="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"

# Check if Claude Code is installed
if ! command -v claude &> /dev/null; then
    echo "Claude Code is not installed. Installing now..."
    npm install -g @anthropic-ai/claude-code
fi

# Verify API key
echo "API key length: ${#ANTHROPIC_API_KEY} characters"

# Test connection
echo "Testing Claude Code..."
claude -p "Hello, can you confirm you're working correctly?" 

echo "Test complete!"