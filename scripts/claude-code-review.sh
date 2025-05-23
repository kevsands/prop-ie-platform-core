#!/bin/bash
# Claude Code review script for prop-ie-aws-app

# Load environment variables from .env file if it exists
if [ -f .env ]; then
    # This safer approach handles special characters and spaces in values
    while IFS='=' read -r key value
    do
        # Skip comments and empty lines
        if [[ $key && ! $key =~ ^# && $value ]]; then
            # Remove leading/trailing whitespace and quotes
            key=$(echo $key | xargs)
            # Use the raw value to preserve special characters
            export "$key=$value"
        fi
    done < .env
fi

# Print API key status (without revealing the key)
if [ -n "$ANTHROPIC_API_KEY" ]; then
    echo "✅ ANTHROPIC_API_KEY is set (${#ANTHROPIC_API_KEY} characters)"
else
    echo "⚠️ ANTHROPIC_API_KEY is not set"
fi

# Check if Claude Code is installed
if ! command -v claude &> /dev/null; then
    echo "Claude Code is not installed. Installing now..."
    npm install -g @anthropic-ai/claude-code
fi

# Check if API key is set
if [ -z "$ANTHROPIC_API_KEY" ]; then
    echo "Error: ANTHROPIC_API_KEY is not set"
    echo "Please set it with: export ANTHROPIC_API_KEY='your-key-here'"
    exit 1
fi

# Function to review specific areas
review_area() {
    local area=$1
    local prompt=$2
    
    echo "Reviewing $area..."
    echo "===================="
    
    case $area in
        "auth")
            find src -name "*.tsx" -o -name "*.ts" | grep -E "(auth|Auth)" | \
            xargs cat | claude -p "$prompt"
            ;;
        "api")
            find src/app/api -name "*.ts" | xargs cat | claude -p "$prompt"
            ;;
        "transactions")
            find src -name "*.tsx" -o -name "*.ts" | grep -E "(transaction|Transaction)" | \
            xargs cat | claude -p "$prompt"
            ;;
        "tests")
            npm test -- --coverage --json | claude -p "$prompt"
            ;;
        "security")
            git ls-files | xargs grep -l "process.env\|jwt\|token\|password\|secret" | \
            xargs cat | claude -p "$prompt"
            ;;
        "performance")
            npm run build | claude -p "$prompt"
            ;;
        *)
            echo "Unknown area: $area"
            ;;
    esac
    
    echo -e "\n\n"
}

# Main menu
if [ $# -eq 0 ]; then
    echo "Claude Code Review for prop-ie-aws-app"
    echo "===================================="
    echo "Usage: $0 <command> [options]"
    echo ""
    echo "Commands:"
    echo "  full          - Complete code review"
    echo "  auth          - Review authentication system"
    echo "  api           - Review API routes"
    echo "  transactions  - Review transaction flow"
    echo "  tests         - Review test coverage"
    echo "  security      - Security audit"
    echo "  performance   - Performance analysis"
    echo "  pr            - Review current git changes"
    echo "  fix           - Auto-fix common issues"
    echo ""
    exit 0
fi

# Handle commands
case $1 in
    "full")
        echo "Running complete code review..."
        review_area "auth" "Review authentication implementation for security issues and best practices"
        review_area "api" "Review API routes for proper error handling, validation, and security"
        review_area "transactions" "Review transaction flow for completeness and edge cases"
        review_area "tests" "Analyze test coverage and suggest improvements"
        review_area "security" "Perform security audit and identify vulnerabilities"
        review_area "performance" "Analyze build output and suggest performance optimizations"
        ;;
        
    "auth")
        review_area "auth" "Review the authentication system in detail. Check for:
        - Security vulnerabilities
        - Proper JWT implementation
        - Session management
        - Role-based access control
        - Error handling
        Provide specific code improvements"
        ;;
        
    "api")
        review_area "api" "Review all API routes for:
        - Proper authentication checks
        - Input validation
        - Error handling
        - Response formatting
        - Security best practices
        Suggest improvements with code examples"
        ;;
        
    "transactions")
        review_area "transactions" "Review the transaction system for:
        - Complete flow implementation
        - Error handling
        - State management
        - Security considerations
        - Missing features
        Provide implementation suggestions"
        ;;
        
    "tests")
        npm test -- --coverage | claude -p "Analyze this test coverage report and:
        - Identify areas with low coverage
        - Suggest specific test cases to add
        - Provide example test implementations
        - Recommend testing strategies"
        ;;
        
    "security")
        echo "Running security audit..."
        git ls-files | xargs grep -l "process.env\|jwt\|token\|password\|secret\|api\|key" | \
        xargs cat | claude -p "Perform a comprehensive security audit:
        - Check for exposed secrets
        - Review authentication implementation
        - Identify injection vulnerabilities
        - Check for XSS risks
        - Review API security
        Provide specific fixes with high priority items first"
        ;;
        
    "performance")
        echo "Analyzing performance..."
        npm run build 2>&1 | claude -p "Analyze this build output and:
        - Identify bundle size issues
        - Find performance bottlenecks
        - Suggest optimization strategies
        - Recommend lazy loading opportunities
        - Check for unnecessary dependencies"
        ;;
        
    "pr")
        echo "Reviewing current changes..."
        git diff | claude -p "Review these code changes for:
        - Code quality
        - Security issues
        - TypeScript errors
        - Missing tests
        - Performance impact
        Provide actionable feedback"
        ;;
        
    "fix")
        echo "Auto-fixing common issues..."
        
        # Fix ESLint errors
        npm run lint 2>&1 | claude -p "Fix these linting errors and provide the corrected code"
        
        # Fix TypeScript errors
        npm run type-check 2>&1 | claude -p "Fix these TypeScript errors and provide the corrected code"
        
        # Fix test failures
        npm test 2>&1 | grep -A 10 "FAIL" | claude -p "Fix these failing tests and provide the corrected code"
        ;;
        
    *)
        echo "Unknown command: $1"
        echo "Run '$0' without arguments to see available commands"
        exit 1
        ;;
esac

echo "Review complete!"