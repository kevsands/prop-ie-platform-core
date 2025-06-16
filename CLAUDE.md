# prop-ie-aws-app Claude Code Configuration

## Project Overview
This is an enterprise-grade property platform built for the Irish real estate market, designed to handle transactions worth billions of euros.

## Tech Stack
- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **State Management**: React Query v4, Context API
- **Authentication**: NextAuth.js with custom JWT implementation
- **Database**: PostgreSQL with Prisma ORM
- **Real-time**: WebSockets for live updates
- **Infrastructure**: AWS (ECS, RDS, CloudFront)
- **Monitoring**: CloudWatch, custom metrics
- **Testing**: Jest, React Testing Library, Playwright

## Key Features
1. **Developer Portal**: Project management, sales tracking, financial dashboards
2. **Buyer Journey**: Property search, customization, purchase flow
3. **Transaction System**: End-to-end property transactions with blockchain integration
4. **Document Management**: KYC, contracts, compliance documents
5. **Analytics**: Real-time metrics, performance monitoring
6. **Security**: MFA, JWT tokens, role-based access control

## Current Focus Areas
- Completing transaction flow implementation
- Improving test coverage (target: 80%+)
- Performance optimization for scale
- Security hardening for production
- Mobile responsiveness
- API documentation
- Reducing TypeScript errors

## Code Conventions
- Use TypeScript strict mode
- Follow ESLint configuration
- Component naming: PascalCase
- Hooks: camelCase with 'use' prefix
- API routes: RESTful conventions
- Tests: Co-located with components

## Common Tasks
1. **Fix TypeScript errors**: Check build output and resolve type issues
2. **Improve test coverage**: Focus on critical paths (auth, transactions)
3. **Performance optimization**: Use React.memo, lazy loading, caching
4. **Security reviews**: Check for exposed secrets, validate inputs
5. **API development**: Ensure proper error handling and validation

## Important Directories
- `/src/app/` - Next.js 14 app router pages
- `/src/components/` - Reusable React components
- `/src/hooks/` - Custom React hooks
- `/src/services/` - Business logic and API services
- `/src/lib/` - Utility functions and configurations
- `/prisma/` - Database schema and migrations
- `/infrastructure/` - Terraform and deployment configs
- `/scripts/` - Utility scripts for codebase maintenance
- `/backup-files/` - Backup reference files (.txt extension to avoid TypeScript errors)

## Testing Strategy
- Unit tests for utilities and hooks
- Integration tests for API routes
- Component tests for UI elements
- E2E tests for critical user journeys

## Deployment
- Development: `npm run dev`
- Production build: `npm run build`
- Tests: `npm test`
- Type checking: `npm run type-check`
- Backup files cleanup: `npm run backup-files`

## TypeScript Error Audit System
We've implemented a systematic approach to gradually reduce TypeScript errors:

1. **Error Audit**: Runs TypeScript check and categorizes errors
   - Command: `node scripts/error-audit.js`
   - Generates reports in `/error-reports/`

2. **Error Tracking**: Monitors progress in error reduction over time
   - Command: `node scripts/error-track-progress.js`
   - Stores history in `/error-history/`

3. **Automated Fixes**: Applies fixes for common TypeScript errors
   - Command: `node scripts/fix-common-errors.js`
   - Creates backups in `/error-fix-backups/`

4. **Combined Workflow**: All-in-one audit, tracking, and fixing
   - Command: `./audit-and-fix.sh`
   - Options: `--audit-only`, `--track-only`, `--fix-only`, `--dry-run`

5. **VS Code Configuration**: `.vscode/settings.json` optimizes editor performance
   - Increases memory limits for large codebase
   - Excludes non-essential files from validation
   - Improves UI responsiveness with large error counts

## Known Issues
- Some legacy React Query v3 imports need updating
- TypeScript strict mode violations in older components
- Test coverage gaps in transaction flow
- Performance issues with large property lists
- ~3000 TypeScript errors to be systematically addressed

## Security Considerations
- All API routes require authentication
- Sensitive data encrypted at rest
- Rate limiting on public endpoints
- Input validation on all forms
- XSS protection via Content Security Policy

## File Corruption Prevention and Safeguards

### CRITICAL WARNING: Previous File Corruption Incident
This codebase experienced significant file corruption due to aggressive automated fix scripts. The following safeguards MUST be followed:

### Corruption Timeline Analysis
**Date Range**: January 14-15, 2025
**Root Cause**: Multiple aggressive automated scripts that:
1. **fix-corruption-pattern.js** - Replaced literal `\n` with actual newlines (corrupted 2,000+ files)
2. **fix-jsx-syntax-comprehensive.js** - Overly aggressive JSX pattern replacements
3. **cleanup-duplicates.js** - Deleted JS files when TS equivalents existed
4. **postinstall hooks** - Executed corruption scripts automatically during `npm install`

**Evidence Found**:
- 2,958 backup files in `/error-fix-backups/` with timestamps showing mass modification
- Reports showing 336 files modified in single script run
- Backup files with naming pattern: `.bak-jsx-comprehensive-[timestamp]`

### PROHIBITED ACTIONS
**NEVER create or run scripts that**:
1. Mass replace text patterns across multiple files without precise targeting
2. Delete files based on assumptions about duplicates
3. Convert escaped characters (`\n`, `\"`, etc.) in code files
4. Modify JSX/TSX syntax patterns broadly
5. Execute automatically via package.json hooks
6. Operate on more than 10 files simultaneously without explicit approval

### MANDATORY SAFEGUARDS
**Before ANY script execution**:
1. **Create timestamped backups** of target files
2. **Limit scope** to maximum 5-10 files per run
3. **Use --dry-run flag** first to preview changes
4. **Manual review** of all changes before applying
5. **Test on single file** before batch operations

### REMAINING RISK ASSESSMENT
**High-Risk Scripts Still Present** (10 found in `/scripts/`):
- `fix-jsx-syntax.js` - Could corrupt JSX components
- `fix-escaped-newlines.js` - Dangerous newline replacement patterns
- `clean-schema-duplicates.js` - Could delete necessary schema definitions
- Multiple other `fix-*.js` scripts with broad pattern matching

**Recommended Actions**:
1. **Quarantine** all remaining fix scripts in separate directory
2. **Remove** from package.json scripts section
3. **Disable** any postinstall/preinstall hooks that could trigger them
4. **Code Review** required before running any automation

### SAFE DEVELOPMENT PRACTICES
**When working with Claude Code on this project, prioritize**:
1. **Manual, surgical fixes** over automated mass changes
2. **Single file modifications** with immediate testing
3. **Incremental TypeScript error fixes** (5-10 errors per session)
4. **Explicit backups** before any code transformation
5. **Code quality and type safety** through careful review
6. **Security best practices** with manual verification
7. **Performance optimization** through targeted changes
8. **Test coverage improvement** with isolated additions
9. **Clear documentation** of all changes made

### EMERGENCY RECOVERY
If corruption is detected:
1. **STOP** all automated processes immediately
2. **Identify** scope of corruption via `git diff`
3. **Restore** from backups in `/error-fix-backups/` or git history
4. **Document** what triggered the corruption
5. **Update** this prevention guide with new safeguards

