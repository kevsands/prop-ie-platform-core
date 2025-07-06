# PROP Platform - CTO Quick Reference

## Access Points
- **Production URL**: https://prop.ie (configured)
- **Development**: http://localhost:3000
- **Admin Dashboard**: /admin
- **API Documentation**: /docs/api

## Test Accounts (Development)
```
buyer@example.com      → Buyer Dashboard
developer@example.com  → Developer Dashboard
agent@example.com      → Agent Dashboard
solicitor@example.com  → Solicitor Dashboard
admin@example.com      → Admin Dashboard
```
*Any password works in development mode*

## Key Commands
```bash
# Development
npm run dev           # Start development server
npm run build         # Build for production
npm run test          # Run tests
npm run lint          # Run linter

# Deployment
npm run deploy        # Deploy to AWS Amplify
npm run migrate       # Run database migrations
```

## Important Files
- `/src/app/layout.tsx` - Main app layout
- `/src/context/AuthContext.tsx` - Authentication logic
- `/src/components/` - Reusable components
- `/src/services/` - Business logic
- `/src/types/` - TypeScript definitions
- `/prisma/schema.prisma` - Database schema

## Tech Stack Quick View
```
Frontend:  Next.js 14 + React 18 + TypeScript
Styling:   Tailwind CSS
Auth:      AWS Cognito + Custom Context
API:       GraphQL (AWS AppSync)
Database:  PostgreSQL + Prisma ORM
Hosting:   AWS Amplify
Storage:   AWS S3
CDN:       CloudFront
```

## Performance Metrics
- Bundle size: ~2.5MB (needs optimization)
- First load: ~2.5s
- Lighthouse score: 78/100
- Code coverage: ~20% (needs improvement)

## Security Checklist
- [x] HTTPS enforced
- [x] Input validation
- [x] XSS protection
- [x] SQL injection prevention
- [x] Role-based access
- [ ] MFA implementation
- [ ] Penetration testing
- [ ] GDPR compliance

## Critical Issues
1. Low test coverage (20%)
2. Performance optimization needed
3. State management improvements required
4. Documentation gaps
5. Monitoring/logging setup needed

## Quick Wins (< 1 week each)
1. Add error boundaries
2. Implement code splitting
3. Set up monitoring (Sentry)
4. Add loading states
5. Optimize images

## Contact Points
- Repository: [GitHub URL]
- Documentation: /docs
- API Status: /api/health
- Support: support@prop.ie

## Environment Variables
```
NEXT_PUBLIC_API_URL
NEXT_PUBLIC_AWS_REGION
DATABASE_URL
JWT_SECRET
AMPLIFY_APP_ID
```

## Database Access
```sql
-- Connect to production
psql -h [host] -U [user] -d prop_production

-- Common queries
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM properties;
SELECT COUNT(*) FROM transactions;
```

## Monitoring Dashboards
- AWS CloudWatch: [URL]
- Amplify Console: [URL]
- Error Tracking: [Sentry URL]
- Analytics: [Google Analytics URL]

## Emergency Procedures
1. **Site Down**: Check AWS Amplify status
2. **Database Issues**: Check RDS dashboard
3. **High Load**: Scale via AWS console
4. **Security Breach**: Enable WAF rules

## Development Workflow
1. Create feature branch
2. Make changes
3. Run tests locally
4. Create pull request
5. Automated tests run
6. Code review
7. Merge to main
8. Auto-deploy to staging
9. Manual deploy to production

## Cost Centers
- AWS Amplify: ~$500/month
- RDS Database: ~$300/month
- S3 Storage: ~$100/month
- CloudFront: ~$200/month
- Total: ~$1,100/month

## Support Contacts
- AWS Support: [Ticket URL]
- Development Team: dev@prop.ie
- DevOps: devops@prop.ie
- Security: security@prop.ie