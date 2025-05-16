# Dependency Approval Process

This document outlines the process for adding new dependencies to the project. All team members must follow this process before adding any new npm packages.

## Package Approval Checklist

### Security Review

- [ ] Package has at least 1,000 weekly downloads on npm
- [ ] Package has a GitHub repository with at least 100 stars
- [ ] Repository has had activity within the last 6 months
- [ ] Package maintainers have 2FA enabled on npm
- [ ] No unresolved high-severity security issues in the last 12 months
- [ ] Package does not have excessive dependencies (consider the entire dependency tree)
- [ ] Source code has been reviewed for suspicious patterns
- [ ] Package does not contain pre/post-install scripts that execute code

### License Compliance

- [ ] Package license is compatible with our project (MIT, Apache 2.0, BSD, ISC preferred)
- [ ] License does not impose unexpected obligations on our codebase

### Technical Evaluation

- [ ] Package functionality cannot be easily implemented in-house
- [ ] Package has adequate documentation and examples
- [ ] Package has sufficient test coverage
- [ ] Package is actively maintained
- [ ] Bundle size impact has been assessed

## Approval Workflow

1. **Request**: Developer creates a request for adding a new dependency, explaining:
   - Package name and version
   - Purpose and justification
   - Alternatives considered
   - Completed approval checklist

2. **Review**: Technical lead or security team reviews the request:
   - Verifies checklist completion
   - Reviews package source code
   - Assesses security implications
   - Considers maintenance burden

3. **Approval/Rejection**: Request is either:
   - Approved: Developer may add the dependency
   - Rejected: Developer must find alternatives or justify further

4. **Integration**: After approval, developer:
   - Adds dependency with exact version
   - Updates SBOM
   - Documents usage in project documentation

## Tools for Evaluation

Use these tools to evaluate packages:

```bash
# Check package info
npm info <package-name>

# Check download stats
npm-stat <package-name>

# Check bundle size impact
npx bundlephobia-cli <package-name>

# Check package for known security issues
npm audit <package-name>

# Analyze all dependencies of a package
npx dependency-cruiser <package-name>

# Check for suspicious patterns
node scripts/analyze-package.js <package-name>
```

## Approved and Restricted Packages

### Approved Package Alternatives

| Category | Approved Packages |
|----------|-------------------|
| UI Components | react-aria, @headlessui/react, @radix-ui/* |
| State Management | zustand, jotai, react-query |
| Form Handling | react-hook-form, formik |
| Data Fetching | @tanstack/react-query, SWR |
| Date Handling | date-fns, luxon |
| Validation | zod, yup, joi |
| Routing | next/router, next/navigation |
| Styling | tailwindcss, styled-components |
| Charting | recharts, visx |
| Icons | lucide-react, @heroicons/react |

### Restricted Packages/Categories

These packages or categories require extra scrutiny:

- Packages with native dependencies (node-gyp)
- Packages with obfuscated code
- Packages from unknown authors with low usage
- Packages with many transitive dependencies
- Packages that access the filesystem or network
- Packages that execute scripts during installation
- Packages with "helper" functionality that can be implemented in a few lines of code

## Emergency Procedures

If a malicious package is detected after installation:

1. Immediately remove the package:
   ```bash
   npm uninstall <package-name>
   ```

2. Check for persistent changes:
   ```bash
   git diff
   ```

3. Run a security scan:
   ```bash
   npm run security-check
   ```

4. Report the incident to npm and the security team
   ```bash
   npm report <package-name>
   ```

## Maintenance

This approval process document should be reviewed and updated quarterly with new security insights and evolving best practices.