# TypeScript Error Fixing Guide

This guide explains how to use the automated TypeScript error fixing scripts to resolve the 2,623 TypeScript errors in the codebase.

## Scripts Overview

### 1. `fix-typescript.js` - Main TypeScript Fixer
The primary script that handles common TypeScript errors:
- **Syntax Errors**: Fixes malformed type annotations (e.g., "strin, g" → "string")
- **Missing Imports**: Adds React and Next.js imports
- **Type Annotations**: Adds types to untyped variables
- **Async/Await**: Fixes missing async keywords
- **Module Resolution**: Converts relative imports to path aliases
- **Return Types**: Adds return types to functions
- **JSX Errors**: Fixes common JSX issues (class → className)
- **Fallback**: Adds @ts-expect-error for unfixable errors

### 2. `fix-typescript-advanced.js` - Advanced TypeScript Fixer
Handles more complex TypeScript patterns:
- **Component Props**: Creates interfaces for React component props
- **Hook Types**: Adds generic types to useState, useRef, etc.
- **Promise Types**: Fixes async function return types
- **Union Types**: Adds proper union types where needed
- **API Types**: Adds types to fetch/axios calls

### 3. `fix-all-typescript.sh` - Wrapper Script
Runs both fixers in sequence and provides statistics.

## Usage

### Quick Start
```bash
# Run all fixes at once
./fix-all-typescript.sh
```

### Step by Step
```bash
# 1. Install dependencies
npm install --save-dev ts-morph fs-extra chalk

# 2. Run the main fixer
node fix-typescript.js

# 3. Run the advanced fixer
node fix-typescript-advanced.js

# 4. Check results
npm run type-check
```

## What Gets Fixed

### Syntax Errors
```typescript
// Before
const name: strin, g = "John";

// After
const name: string = "John";
```

### Missing Imports
```typescript
// Before (in .tsx file using JSX without React import)
const Component = () => <div>Hello</div>;

// After
import React from 'react';
const Component = () => <div>Hello</div>;
```

### Type Annotations
```typescript
// Before
const data = fetchData();

// After
const data: any = fetchData();
```

### Component Props
```typescript
// Before
const MyComponent = (props) => {
  return <div>{props.title}</div>;
};

// After
interface MyComponentProps {
  title?: string;
}

const MyComponent = (props: MyComponentProps) => {
  return <div>{props.title}</div>;
};
```

### Hook Types
```typescript
// Before
const [count, setCount] = useState(0);

// After
const [count, setCount] = useState<number>(0);
```

## Output Files

1. **typescript-fix-backup-[timestamp]/**: Complete backup of all modified files
2. **typescript-fix-report.json**: Detailed report of all fixes applied
3. **fix-later.log**: List of errors that require manual intervention

## Safety Features

- **Automatic Backup**: All files are backed up before modification
- **AST-Based**: Uses TypeScript's AST for safe transformations
- **Progress Tracking**: Shows real-time progress
- **Error Logging**: Logs any files that couldn't be processed

## Manual Fixes Required

Some errors can't be automatically fixed and will have `@ts-expect-error` added:
- Complex type inference issues
- Third-party library type conflicts
- Circular dependency issues
- Advanced generic type problems

Check `fix-later.log` for a list of these issues.

## Best Practices

1. **Review Changes**: Always review the changes made by the scripts
2. **Test Thoroughly**: Run your test suite after fixing
3. **Commit Before Running**: Make sure your work is committed
4. **Incremental Approach**: You can run the scripts multiple times

## Troubleshooting

### Script fails to run
```bash
# Make sure the script is executable
chmod +x fix-all-typescript.sh

# Install missing dependencies
npm install --save-dev ts-morph fs-extra chalk
```

### Too many errors remain
1. Run the scripts again (they're idempotent)
2. Check `fix-later.log` for manual fixes needed
3. Consider updating tsconfig.json to be less strict temporarily

### Performance issues
For large codebases, the scripts might take several minutes. This is normal.

## Next Steps

After running the fixers:
1. Review the changes in your git diff
2. Run `npm run build` to ensure the build still works
3. Run `npm test` to ensure tests pass
4. Manually fix errors logged in `fix-later.log`
5. Gradually remove @ts-expect-error comments