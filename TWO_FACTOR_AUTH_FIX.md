# Two-Factor Authentication Fix

## Problem
The two-factor authentication route (`src/app/api/auth/two-factor/route.ts`) was trying to update fields `twoFactorEnabled` and `twoFactorSecret` that don't exist on the Prisma User model. The Prisma schema defines a `metadata` field of type `Json` where this data should be stored.

## Solution
Updated the code to store two-factor authentication data in the User's metadata field instead of non-existent direct fields.

## Changes Made

### 1. Updated `authService.ts`

#### `enableTwoFactor` method:
- Changed to store `twoFactorEnabled` and `twoFactorSecret` in the user's metadata
- Added logic to preserve existing metadata when updating

#### `verifyMFACode` method:
- Changed to read two-factor settings from user's metadata
- Added proper null checks for metadata field

### 2. Updated `two-factor/route.ts`

#### Disable action:
- Changed to update metadata field instead of direct fields
- Added user existence check and metadata preservation

#### GET method:
- Changed to read two-factor status from metadata field
- Added proper null checks and default values

### 3. Updated `lib/db/mappers.ts`

#### `mapUser` function:
- Added logic to extract `twoFactorEnabled` from metadata
- Added fallback for field names to support both snake_case and camelCase
- Maps to the application's User interface correctly

#### `mapUserToDb` function:
- Added logic to store `twoFactorEnabled` in metadata when mapping to database
- Updated to use Prisma's camelCase field names
- Fixed roles mapping to expect an array

## Testing

A test script has been created at `test-two-factor-fix.js` to verify the changes work correctly. The script:

1. Creates a test user with two-factor disabled in metadata
2. Updates the user to enable two-factor with a secret
3. Verifies the data can be read correctly
4. Cleans up the test data

To run the test:
```bash
node test-two-factor-fix.js
```

## Migration Notes

For existing users who may have been created with the old schema expectations:
- Two-factor settings will now be read from metadata
- The system will default to `twoFactorEnabled: false` if not present in metadata
- Any existing two-factor data should be migrated to the metadata field

## Future Considerations

1. Consider creating a dedicated schema for two-factor authentication data within metadata
2. Implement proper TOTP verification (currently using a test value)
3. Add database migration to move any existing two-factor data to metadata
4. Consider adding TypeScript types for the metadata structure