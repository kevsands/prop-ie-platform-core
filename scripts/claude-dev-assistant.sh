#!/bin/bash
# Claude Code Development Assistant for prop-ie-aws-app

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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
    echo -e "${GREEN}✅ ANTHROPIC_API_KEY is set (${#ANTHROPIC_API_KEY} characters)${NC}"
else
    echo -e "${RED}⚠️ ANTHROPIC_API_KEY is not set${NC}"
fi

# Check Claude Code installation
check_claude() {
    if ! command -v claude &> /dev/null; then
        echo -e "${RED}Claude Code is not installed${NC}"
        echo "Installing Claude Code..."
        npm install -g @anthropic-ai/claude-code
    fi
    
    if [ -z "$ANTHROPIC_API_KEY" ]; then
        echo -e "${RED}Error: ANTHROPIC_API_KEY is not set${NC}"
        echo "Please set it with: export ANTHROPIC_API_KEY='your-key-here'"
        exit 1
    fi
}

# Interactive menu
show_menu() {
    echo -e "${BLUE}Claude Code Development Assistant${NC}"
    echo "================================"
    echo "1. Start new feature"
    echo "2. Fix current errors"
    echo "3. Improve test coverage"
    echo "4. Optimize performance"
    echo "5. Security audit"
    echo "6. Code review (staged changes)"
    echo "7. Update documentation"
    echo "8. Debug issue"
    echo "9. Refactor code"
    echo "10. Generate API docs"
    echo "11. Create component"
    echo "12. Database operations"
    echo "0. Exit"
    echo ""
    read -p "Select option: " choice
}

# Feature development
start_feature() {
    read -p "Feature name: " feature_name
    read -p "Feature description: " feature_desc
    
    echo -e "${GREEN}Starting feature: $feature_name${NC}"
    
    claude -p "Help me implement a new feature: $feature_name
    Description: $feature_desc
    
    Please:
    1. Create a development plan
    2. Identify files to modify/create
    3. Suggest the implementation approach
    4. List potential challenges
    5. Recommend test strategies"
    
    read -p "Create feature branch? (y/n): " create_branch
    if [[ $create_branch == "y" ]]; then
        git checkout -b "feature/$feature_name"
        echo -e "${GREEN}Created branch: feature/$feature_name${NC}"
    fi
}

# Fix errors
fix_errors() {
    echo -e "${YELLOW}Checking for errors...${NC}"
    
    # TypeScript errors
    echo "TypeScript errors:"
    npm run type-check 2>&1 | tee type-errors.log
    
    # ESLint errors
    echo "ESLint errors:"
    npm run lint 2>&1 | tee lint-errors.log
    
    # Test errors
    echo "Test errors:"
    npm test 2>&1 | tee test-errors.log
    
    # Send to Claude
    cat type-errors.log lint-errors.log test-errors.log | \
    claude -p "Fix all these errors. Provide:
    1. Specific code changes for each error
    2. Explanation of what was wrong
    3. File paths and line numbers
    Format as ready-to-apply patches"
    
    rm type-errors.log lint-errors.log test-errors.log
}

# Improve test coverage
improve_tests() {
    echo -e "${YELLOW}Analyzing test coverage...${NC}"
    
    npm test -- --coverage --json > coverage.json
    
    cat coverage.json | claude -p "Analyze this coverage report and:
    1. Identify components/functions with low coverage
    2. Generate specific test cases for uncovered code
    3. Provide complete test file implementations
    4. Focus on critical business logic first
    Include the actual test code I can copy and paste"
    
    rm coverage.json
}

# Performance optimization
optimize_performance() {
    echo -e "${YELLOW}Running performance analysis...${NC}"
    
    # Build analysis
    npm run build > build-output.log 2>&1
    
    # Bundle analyzer (if available)
    if command -v npm run analyze &> /dev/null; then
        npm run analyze > bundle-analysis.log 2>&1
    fi
    
    cat build-output.log bundle-analysis.log 2>/dev/null | \
    claude -p "Optimize performance based on this analysis:
    1. Identify large bundles and suggest code splitting
    2. Find unnecessary dependencies
    3. Recommend lazy loading opportunities
    4. Suggest React optimization techniques
    5. Provide specific code changes with examples"
    
    rm -f build-output.log bundle-analysis.log
}

# Security audit
security_audit() {
    echo -e "${YELLOW}Running security audit...${NC}"
    
    # Find sensitive files
    git ls-files | xargs grep -l "process.env\|jwt\|token\|password\|secret\|api.*key" > sensitive-files.txt
    
    # Check dependencies
    npm audit > npm-audit.log 2>&1
    
    # Send to Claude
    cat sensitive-files.txt | xargs cat | \
    claude -p "Security audit these files for:
    1. Exposed secrets or credentials
    2. SQL injection vulnerabilities
    3. XSS risks
    4. Authentication/authorization issues
    5. Input validation problems
    Provide specific fixes with severity ratings"
    
    rm sensitive-files.txt npm-audit.log
}

# Code review
review_staged() {
    echo -e "${YELLOW}Reviewing staged changes...${NC}"
    
    git diff --cached | claude -p "Review these staged changes for:
    1. Code quality and style consistency
    2. Potential bugs or edge cases
    3. Performance implications
    4. Security concerns
    5. Missing tests
    6. Documentation needs
    Provide specific feedback with line numbers"
}

# Update documentation
update_docs() {
    echo -e "${YELLOW}Analyzing documentation needs...${NC}"
    
    # Find recently modified files
    git log --name-only --pretty=format: -n 20 | sort | uniq | grep -E "\.(ts|tsx|js|jsx)$" > recent-files.txt
    
    cat recent-files.txt | xargs cat | \
    claude -p "Check if these files need documentation updates:
    1. Missing or outdated JSDoc comments
    2. Complex functions needing explanation
    3. API changes requiring README updates
    4. Type definitions needing clarification
    Provide the actual documentation to add"
    
    rm recent-files.txt
}

# Debug issue
debug_issue() {
    read -p "Describe the issue: " issue_desc
    read -p "Error message (if any): " error_msg
    read -p "Related files (comma-separated): " related_files
    
    echo -e "${YELLOW}Debugging: $issue_desc${NC}"
    
    IFS=',' read -ra FILES <<< "$related_files"
    for file in "${FILES[@]}"; do
        if [ -f "$file" ]; then
            cat "$file"
        fi
    done | claude -p "Debug this issue:
    Issue: $issue_desc
    Error: $error_msg
    
    Please:
    1. Identify the root cause
    2. Explain why it's happening
    3. Provide step-by-step fix
    4. Suggest preventive measures
    5. Include code changes needed"
}

# Refactor code
refactor_code() {
    read -p "File or directory to refactor: " target
    read -p "Refactoring goal: " goal
    
    echo -e "${YELLOW}Refactoring: $target${NC}"
    
    if [ -d "$target" ]; then
        find "$target" -name "*.ts" -o -name "*.tsx" | xargs cat
    else
        cat "$target"
    fi | claude -p "Refactor this code with goal: $goal
    
    Please:
    1. Identify refactoring opportunities
    2. Apply design patterns where appropriate
    3. Improve code organization
    4. Enhance readability and maintainability
    5. Provide the complete refactored code"
}

# Generate API documentation
generate_api_docs() {
    echo -e "${YELLOW}Generating API documentation...${NC}"
    
    find src/app/api -name "*.ts" | xargs cat | \
    claude -p "Generate comprehensive API documentation:
    1. Endpoint descriptions and purposes
    2. Request/response formats with examples
    3. Authentication requirements
    4. Error codes and meanings
    5. Rate limiting information
    Format as OpenAPI/Swagger spec"
}

# Create component
create_component() {
    read -p "Component name: " comp_name
    read -p "Component type (ui/feature/layout): " comp_type
    read -p "Description: " comp_desc
    
    echo -e "${YELLOW}Creating component: $comp_name${NC}"
    
    claude -p "Create a new React component:
    Name: $comp_name
    Type: $comp_type
    Description: $comp_desc
    
    Include:
    1. TypeScript component implementation
    2. Props interface with proper types
    3. CSS module or styled components
    4. Unit tests
    5. Storybook story (if applicable)
    6. Usage example
    
    Follow the project's coding standards"
}

# Database operations
database_ops() {
    echo -e "${BLUE}Database Operations${NC}"
    echo "1. Create migration"
    echo "2. Seed data"
    echo "3. Query optimization"
    echo "4. Schema review"
    read -p "Select option: " db_choice
    
    case $db_choice in
        1)
            read -p "Migration description: " mig_desc
            claude -p "Create a Prisma migration for: $mig_desc
            Include:
            1. Schema changes
            2. Migration SQL
            3. Rollback procedure
            4. Data migration if needed"
            ;;
        2)
            read -p "Seed data type: " seed_type
            claude -p "Create seed data for: $seed_type
            Include:
            1. Realistic test data
            2. Proper relationships
            3. Edge cases
            4. Development scenarios"
            ;;
        3)
            read -p "Query to optimize: " query
            claude -p "Optimize this database query: $query
            Provide:
            1. Optimized query
            2. Index recommendations
            3. Query plan analysis
            4. Performance improvements"
            ;;
        4)
            cat prisma/schema.prisma | claude -p "Review this database schema for:
            1. Normalization issues
            2. Missing indexes
            3. Relationship problems
            4. Performance concerns
            5. Best practice violations"
            ;;
    esac
}

# Main loop
check_claude

while true; do
    show_menu
    
    case $choice in
        1) start_feature ;;
        2) fix_errors ;;
        3) improve_tests ;;
        4) optimize_performance ;;
        5) security_audit ;;
        6) review_staged ;;
        7) update_docs ;;
        8) debug_issue ;;
        9) refactor_code ;;
        10) generate_api_docs ;;
        11) create_component ;;
        12) database_ops ;;
        0) 
            echo -e "${GREEN}Goodbye!${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid option${NC}"
            ;;
    esac
    
    echo ""
    read -p "Press Enter to continue..."
    clear
done