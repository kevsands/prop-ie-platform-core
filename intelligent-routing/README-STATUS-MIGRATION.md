# Property Status Enum Migration Guide

This guide explains how to migrate string literal status comparisons to use the `PropertyStatus` enum for better type safety.

## Why Use Enums?

Using enums for property status provides several benefits:

1. **Type Safety**: TypeScript ensures you only use valid status values
2. **Intellisense**: Code editors provide autocompletion for enum values
3. **Maintenance**: Centralized definition of valid status values
4. **Refactoring**: Easier to rename or add new status values

## PropertyStatus Enum Definition

The enum is defined in `/src/types/enums.ts`:

```typescript
export enum PropertyStatus {
    Available = "Available",
    Reserved = "Reserved",
    Sold = "Sold",
    UnderConstruction = "Under Construction", 
    ComingSoon = "Coming Soon",
    OffMarket = "Off Market"
}
```

## Manual Migration Process

### 1. Import the Enum

Add the following import to files that need to use the enum:

```typescript
import { PropertyStatus } from "../types/enums";
```

### 2. Replace String Literals

#### Incorrect (Before):
```typescript
if (property.status === "sold") {
  // ...
}
```

#### Correct (After):
```typescript
if (property.status === PropertyStatus.Sold) {
  // ...
}
```

### 3. Handle Mixed Type Comparisons

If you have functions that accept either string or enum values:

```typescript
function getStatusColor(status: string | PropertyStatus): string {
  // Normalize the status for comparison
  const normalizedStatus = typeof status === 'string' 
    ? status.toLowerCase() 
    : String(status).toLowerCase();
  
  switch (normalizedStatus) {
    case String(PropertyStatus.Available).toLowerCase():
      return 'text-green-500';
    case String(PropertyStatus.Sold).toLowerCase():
      return 'text-red-500';
    // other cases...
    default:
      return 'text-gray-500';
  }
}
```

## Automated Migration

We've created a script that automatically finds and replaces string literal comparisons with enum-based ones:

```bash
node replace-status-literals.js
```

This script:

1. Searches all TypeScript files in the `src` directory
2. Identifies string literals used in status comparisons
3. Replaces them with appropriate PropertyStatus enum references
4. Adds the necessary import statement if needed

### What the Script Looks For

The script identifies likely status comparisons by:

1. Finding binary expressions (using `===`, `==`, `!==`, `!=`)
2. Checking if one side is a string literal matching a known status value
3. Checking if the other side has "status" in its name

### Limitations

The automated script:
- May miss complex cases where status values are used indirectly
- Won't update string literals used in functions without comparison operators
- May incorrectly modify string literals that match status values but are used for different purposes

Always review changes made by the script and manually fix any remaining issues.

## Testing After Migration

After migrating to enums, be sure to:

1. Run the TypeScript compiler to catch any errors
2. Test status-based conditional rendering
3. Test status filtering functionality
4. Verify color-coding and status displays
5. Test any form or dropdown components that use status values