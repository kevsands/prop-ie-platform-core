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

When working with Claude Code on this project, prioritize:
1. Code quality and type safety
2. Security best practices
3. Performance optimization
4. Test coverage improvement
5. Clear documentation
6. Systematic TypeScript error reduction

